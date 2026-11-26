"""Long-form map engine (16:9): dark satellite globe / Mercator map, true-size shapes, glow lines, text."""
import math, pickle, os, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1920, 1080
D2R = math.pi / 180
HERE = os.path.dirname(os.path.abspath(__file__))


def unit(lon, lat):
    lon = np.asarray(lon, np.float64) * D2R; lat = np.asarray(lat, np.float64) * D2R
    return np.stack([np.cos(lat) * np.cos(lon), np.cos(lat) * np.sin(lon), np.sin(lat)], -1)


def frame_at(lon, lat):
    """columns: up, east, north"""
    lo, la = lon * D2R, lat * D2R
    up = np.array([math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la)])
    e = np.array([-math.sin(lo), math.cos(lo), 0.0])
    n = np.array([-math.sin(la) * math.cos(lo), -math.sin(la) * math.sin(lo), math.cos(la)])
    return np.stack([up, e, n], 1)


def slerp_ll(a, b, s):
    """great-circle interpolation between (lon,lat) a and b"""
    pa, pb = unit(*a), unit(*b)
    om = math.acos(float(np.clip(pa @ pb, -1, 1)))
    if om < 1e-6: return a
    p = (math.sin((1 - s) * om) * pa + math.sin(s * om) * pb) / math.sin(om)
    return (math.degrees(math.atan2(p[1], p[0])), math.degrees(math.asin(np.clip(p[2], -1, 1))))


def ang(a, b):
    return math.degrees(math.acos(float(np.clip(unit(*a) @ unit(*b), -1, 1))))


def ease(s):
    s = min(max(s, 0.0), 1.0); return s * s * (3 - 2 * s)


def ease5(s):
    s = min(max(s, 0.0), 1.0); return s * s * s * (s * (6 * s - 15) + 10)


def eout(s):
    s = min(max(s, 0.0), 1.0); return 1 - (1 - s) ** 3


def back(s):
    s = min(max(s, 0.0), 1.0); c = 1.9; return 1 + (c + 1) * (s - 1) ** 3 + c * (s - 1) ** 2


class Cam:
    def __init__(s, mode='globe', lon=0, lat=0, alt=2.0, tilt=0, head=0, fov=38, span=360):
        s.mode, s.lon, s.lat, s.alt, s.tilt, s.head, s.fov, s.span = mode, lon, lat, alt, tilt, head, fov, span

    def copy(s, **k):
        c = Cam(s.mode, s.lon, s.lat, s.alt, s.tilt, s.head, s.fov, s.span); c.__dict__.update(k); return c

    def setup(s):
        if s.mode == 'globe':
            F = frame_at(s.lon, s.lat); T, E, N = F[:, 0], F[:, 1], F[:, 2]
            h, t = s.head * D2R, s.tilt * D2R
            Fw = math.cos(h) * N + math.sin(h) * E
            s.C = T + s.alt * (math.cos(t) * T - math.sin(t) * Fw)
            s.fwd = -math.cos(t) * T + math.sin(t) * Fw
            s.up = math.cos(t) * Fw + math.sin(t) * T
            s.right = np.cross(s.fwd, s.up)
            s.ty = math.tan(s.fov * D2R / 2); s.tx = s.ty * W / H
        else:
            s.sx = W / (s.span * D2R)                    # pixels per radian
            s.my = math.log(math.tan(math.pi / 4 + s.lat * D2R / 2))
        return s

    def project(s, lonlat):
        """lonlat (...,2) deg -> xy (...,2) px, visible (...)"""
        ll = np.asarray(lonlat, np.float64)
        if s.mode == 'globe':
            P = unit(ll[..., 0], ll[..., 1]); return s.project_vec(P)
        x = W / 2 + ((ll[..., 0] - s.lon + 180) % 360 - 180) * D2R * s.sx
        la = np.clip(ll[..., 1], -85, 85) * D2R
        y = H / 2 - (np.log(np.tan(np.pi / 4 + la / 2)) - s.my) * s.sx
        return np.stack([x, y], -1), np.ones(x.shape, bool)

    def project_vec(s, P):
        v = P - s.C
        z = v @ s.fwd
        x = (v @ s.right) / np.maximum(z, 1e-6) / s.tx
        y = (v @ s.up) / np.maximum(z, 1e-6) / s.ty
        vis = (np.einsum('...i,...i->...', P, s.C - P) > 0) & (z > 0)
        return np.stack([W / 2 + x * W / 2, H / 2 - y * H / 2], -1), vis


_grid = None


def pixgrid():
    global _grid
    if _grid is None:
        xs = (np.arange(W, dtype=np.float32) + 0.5) / W * 2 - 1
        ys = (np.arange(H, dtype=np.float32) + 0.5) / H * 2 - 1
        _grid = np.meshgrid(xs, ys)
    return _grid


def cast(cam):
    """per-pixel lon, lat (deg, float32), hit mask, footprint (rad), P (H,W,3) or None, limb distance"""
    X, Y = pixgrid()
    if cam.mode == 'globe':
        tx, ty = cam.tx, cam.ty
        f, r, u, C = [np.asarray(v, np.float32) for v in (cam.fwd, cam.right, cam.up, cam.C)]
        D = f[None, None] + (X * tx)[..., None] * r[None, None] - (Y * ty)[..., None] * u[None, None]
        Dn = np.sqrt((D * D).sum(-1)); D /= Dn[..., None]
        b = D @ C; c = float(C @ C) - 1
        disc = b * b - c
        hit = disc > 0
        t = -b - np.sqrt(np.maximum(disc, 0))
        P = C[None, None] + t[..., None] * D
        cosi = np.clip(-(P * D).sum(-1), 0.08, 1)
        pix = 2 * ty / H / Dn                           # angular pixel size along ray (approx)
        fp = t * pix / np.sqrt(cosi)
        lon = np.degrees(np.arctan2(P[..., 1], P[..., 0])).astype(np.float32)
        lat = np.degrees(np.arcsin(np.clip(P[..., 2], -1, 1))).astype(np.float32)
        perp = np.sqrt(np.maximum(c + 1 - b * b, 0))   # distance of ray line from centre
        return lon, lat, hit, fp, P, perp
    lon = (cam.lon + X * (W / 2) / cam.sx / D2R).astype(np.float32)
    lon = ((lon + 180) % 360 - 180)
    my = cam.my - Y * (H / 2) / cam.sx
    lat = np.degrees(np.arctan(np.sinh(my))).astype(np.float32)
    hit = np.abs(lat) < 85
    fp = np.full(lon.shape, 1.0 / cam.sx, np.float32)
    return lon, lat, hit, fp, None, None


class World:
    def __init__(s, D):
        s.lv = [np.load(f'{D}/sat{i}.npy') for i in range(6)]
        d = pickle.load(open(f'{D}/countries.pkl', 'rb'))
        s.polys = d['polys']
        s.texel0 = 2 * math.pi / s.lv[0].shape[1]
        s.shapes = {}

    def base(s, cam, sun=(-0.4, 0.35, 0.85)):
        cam.setup()
        lon, lat, hit, fp, P, perp = cast(cam)
        L = np.clip(np.log2(np.maximum(fp, 1e-9) / s.texel0), 0, 5).astype(np.float32)
        lo, hi = int(math.floor(float(L[hit].min()) if hit.any() else 5)), int(math.ceil(float(L[hit].max()) if hit.any() else 5))
        img = np.zeros((H, W, 3), np.float32); wsum = np.zeros((H, W), np.float32)
        for k in range(lo, hi + 1):
            w = np.clip(1 - np.abs(L - k), 0, 1)
            if not (w > 0.002).any(): continue
            T = s.lv[k]; th, tw = T.shape[:2]
            mx = (lon + 180) / 360 * tw - 0.5; my = (90 - lat) / 180 * th - 0.5
            smp = cv2.remap(T, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
            img += smp.astype(np.float32) * w[..., None]; wsum += w
        img /= np.maximum(wsum, 1e-6)[..., None]
        img = img[..., ::-1].copy()   # RGB -> BGR
        if cam.mode == 'globe':
            ld = np.array(sun, np.float32); ld /= np.linalg.norm(ld)
            # light in camera space -> world: fixed relative to camera so the lit side faces us
            Lw = cam.right * ld[0] + cam.up * ld[1] - cam.fwd * ld[2]
            sh = np.clip((P @ Lw.astype(np.float32)), 0, 1)
            img *= (0.42 + 0.58 * sh ** 0.7)[..., None]
            # space + atmosphere
            X, Y = pixgrid()
            space = np.empty((H, W, 3), np.float32)
            g = (0.5 + 0.5 * (1 - np.sqrt(X * X * 0.6 + Y * Y))).clip(0, 1)
            space[:] = (np.array([22, 12, 6], np.float32) * g[..., None] + np.array([10, 5, 3], np.float32))
            atm = np.exp(-np.maximum(perp - 1, 0) * 26)[..., None] * np.array([255, 170, 80], np.float32) * 0.55
            img = np.where(hit[..., None], img, space + atm)
            rim = np.exp(-np.maximum(1 - perp, 0) * 60)[..., None] * np.array([255, 190, 110], np.float32) * 0.25
            img = img + np.where(hit[..., None], rim, 0)
        s.cur = (lon, lat, hit, P)
        return img

    # ---------- shapes (country silhouettes at true size, possibly moved)
    def shape(s, iso, flag=None, minarea=0.0, isos=None, frac=0.002):
        key = (iso, id(flag) if flag is not None else None)
        if key in s.shapes: return s.shapes[key]
        pl = [p for i in (isos or [iso]) for p in s.polys[i]]
        if iso == 'FRA': pl = [p for p in pl if p[:, 0].min() > -10 and p[:, 1].min() > 40]
        if iso == 'USA': pl = [p for p in pl if p[:, 0].min() > -130 and p[:, 1].max() < 50]   # contiguous
        if iso == 'NOR': pl = [p for p in pl if p[:, 1].max() < 72]
        if iso == 'ESP': pl = [p for p in pl if p[:, 1].min() > 35]
        if iso == 'PRT': pl = [p for p in pl if p[:, 0].min() > -10]
        def area(p):
            x, y = p[:, 0] * np.cos(np.radians(p[:, 1].mean())), p[:, 1]
            return 0.5 * abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))
        big = max(area(p) for p in pl)
        pl = [p for p in pl if area(p) >= max(minarea, big * frac)]
        if isos and len(isos) > 1:
            from shapely.geometry import Polygon
            from shapely.ops import unary_union
            u = unary_union([Polygon(p).buffer(0.02) for p in pl if len(p) > 3]).buffer(-0.02)
            geoms = list(u.geoms) if hasattr(u, 'geoms') else [u]
            pl = [np.array(g.exterior.coords) for g in geoms if g.area > 0.05]
        allp = np.concatenate(pl)
        lo0, lo1, la0, la1 = allp[:, 0].min(), allp[:, 0].max(), allp[:, 1].min(), allp[:, 1].max()
        res = max(lo1 - lo0, la1 - la0) / 2400
        rw, rh = int((lo1 - lo0) / res) + 8, int((la1 - la0) / res) + 8
        m = np.zeros((rh, rw), np.uint8)
        for p in pl:
            pts = np.stack([(p[:, 0] - lo0) / res + 4, (la1 - p[:, 1]) / res + 4], -1)
            cv2.fillPoly(m, [np.round(pts * 8).astype(np.int32)], 255, lineType=cv2.LINE_AA, shift=3)
        rgba = np.zeros((rh, rw, 4), np.float32); rgba[..., 3] = m / 255.0
        if flag is not None:
            fl = cv2.resize(flag, (rw, rh), interpolation=cv2.INTER_AREA).astype(np.float32)
            rgba[..., :3] = fl[..., :3]
        # centre (area weighted approx: centre of mask)
        ys, xs = np.nonzero(m > 127)
        cx, cy = lo0 + (xs.mean() - 4) * res, la1 - (ys.mean() - 4) * res
        simp = []
        for p in pl:
            step = max(1, len(p) // 1500)
            simp.append(p[::step])
        sh = dict(iso=iso, rgba=rgba, lo0=lo0, la1=la1, res=res, center=(float(cx), float(cy)), polys=simp)
        s.shapes[key] = sh
        return sh


def shape_rot(sh, dst, twist=0.0):
    """rotation matrix moving shape centre to dst (lon,lat) keeping local north up"""
    Fa = frame_at(*sh['center']); Fb = frame_at(*dst)
    R = Fb @ Fa.T
    if twist:
        b = unit(*dst); a = twist * D2R
        K = np.array([[0, -b[2], b[1]], [b[2], 0, -b[0]], [-b[1], b[0], 0]])
        R = (np.eye(3) + math.sin(a) * K + (1 - math.cos(a)) * K @ K) @ R
    return R


def shape_screen_polys(cam, sh, R=None, merc_offset=None):
    out = []
    for p in sh['polys']:
        if cam.mode == 'globe':
            P = unit(p[:, 0], p[:, 1])
            if R is not None: P = P @ R.T
            xy, vis = cam.project_vec(P)
        else:
            q = p.copy()
            if merc_offset is not None: q = q + merc_offset
            dx = q[:, 0] - cam.lon; q[:, 0] -= 360 * np.round(dx.mean() / 360)
            x = W / 2 + (q[:, 0] - cam.lon) * D2R * cam.sx
            la = np.clip(q[:, 1], -85, 85) * D2R
            y = H / 2 - (np.log(np.tan(np.pi / 4 + la / 2)) - cam.my) * cam.sx
            xy, vis = np.stack([x, y], -1), np.ones(len(x), bool)
        if vis.mean() < 0.5: continue
        out.append(xy.astype(np.float32))
    return out


def shape_layer(world, cam, sh, R=None, merc_offset=None, region=None):
    """sample shape RGBA into screen. returns (rgba float32 HxWx4 crop, x0, y0) or None"""
    polys = shape_screen_polys(cam, sh, R, merc_offset)
    if not polys: return None
    allp = np.concatenate(polys)
    x0, y0 = int(max(0, allp[:, 0].min() - 4)), int(max(0, allp[:, 1].min() - 4))
    x1, y1 = int(min(W, allp[:, 0].max() + 5)), int(min(H, allp[:, 1].max() + 5))
    if x1 <= x0 or y1 <= y0: return None
    lon, lat, hit, P = world.cur
    if cam.mode == 'globe':
        Q = P[y0:y1, x0:x1]
        if R is not None: Q = Q @ R.astype(np.float32)     # R^T applied to row vectors: q = R^T p
        ql = np.degrees(np.arctan2(Q[..., 1], Q[..., 0])); qa = np.degrees(np.arcsin(np.clip(Q[..., 2], -1, 1)))
        hh = hit[y0:y1, x0:x1]
    else:
        ql = lon[y0:y1, x0:x1].astype(np.float64); qa = lat[y0:y1, x0:x1].astype(np.float64)
        if merc_offset is not None: ql = ql - merc_offset[0]; qa = qa - merc_offset[1]
        hh = np.ones(ql.shape, bool)
    mx = ((ql - sh['lo0']) / sh['res'] + 4 - 0.5).astype(np.float32)
    my = ((sh['la1'] - qa) / sh['res'] + 4 - 0.5).astype(np.float32)
    smp = cv2.remap(sh['rgba'], mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    smp[..., 3] *= hh
    return smp, x0, y0, polys


def blend(img, rgba, x0, y0, alpha=1.0):
    h, w = rgba.shape[:2]
    x1, y1 = min(W, x0 + w), min(H, y0 + h)
    xa, ya = max(0, x0), max(0, y0)
    if x1 <= xa or y1 <= ya: return
    r = rgba[ya - y0:y1 - y0, xa - x0:x1 - x0]
    a = r[..., 3:4] * alpha
    img[ya:y1, xa:x1] = img[ya:y1, xa:x1] * (1 - a) + r[..., :3] * a


def glow_lines(img, polys, color=(255, 255, 255), th=2.0, glow=1.0, closed=True, alpha=1.0, gcol=None, sig=7):
    if not polys or alpha <= 0: return
    allp = np.concatenate(polys)
    pad = int(sig * 3 + th + 4)
    x0, y0 = int(max(0, allp[:, 0].min() - pad)), int(max(0, allp[:, 1].min() - pad))
    x1, y1 = int(min(W, allp[:, 0].max() + pad)), int(min(H, allp[:, 1].max() + pad))
    if x1 <= x0 or y1 <= y0: return
    lay = np.zeros((y1 - y0, x1 - x0), np.uint8)
    pts = [np.round((p - [x0, y0]) * 16).astype(np.int32) for p in polys]
    cv2.polylines(lay, pts, closed, 255, max(1, int(round(th))), cv2.LINE_AA, shift=4)
    l = lay.astype(np.float32) / 255
    g = cv2.GaussianBlur(l, (0, 0), sig) * 2.2 + cv2.GaussianBlur(l, (0, 0), sig / 3) * 0.8
    gc = np.array(gcol if gcol is not None else color, np.float32)
    sub = img[y0:y1, x0:x1]
    sub += (g[..., None] * gc * 0.55 * glow) * alpha
    a = (l * alpha)[..., None]
    sub[:] = sub * (1 - a) + np.array(color, np.float32) * a


def fill_polys(img, polys, color, alpha):
    if not polys or alpha <= 0: return
    allp = np.concatenate(polys)
    x0, y0 = int(max(0, allp[:, 0].min() - 2)), int(max(0, allp[:, 1].min() - 2))
    x1, y1 = int(min(W, allp[:, 0].max() + 3)), int(min(H, allp[:, 1].max() + 3))
    if x1 <= x0 or y1 <= y0: return
    lay = np.zeros((y1 - y0, x1 - x0), np.uint8)
    cv2.fillPoly(lay, [np.round((p - [x0, y0]) * 16).astype(np.int32) for p in polys], 255, cv2.LINE_AA, shift=4)
    a = (lay.astype(np.float32) / 255 * alpha)[..., None]
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + np.array(color, np.float32) * a


def draw_shape(world, img, cam, sh, R=None, merc_offset=None, fill=None, falpha=0.85, lift=0.0,
               line=(255, 255, 255), lalpha=1.0, th=2.2, glow=1.0, gcol=None, appear=1.0):
    """fill: None (use shape rgba, e.g. flag) | BGR tuple. lift: px extrusion"""
    res = shape_layer(world, cam, sh, R, merc_offset)
    if res is None: return None
    smp, x0, y0, polys = res
    if appear < 1:
        falpha *= appear; lalpha *= appear
    hpx = int(round(lift))
    if hpx > 0:
        fill_polys(img, [p + [6, 10] for p in polys], (0, 0, 0), 0.35 * appear)
        for k in range(0, hpx, 2):
            fill_polys(img, [p - [0, k] for p in polys], (40, 40, 40) if fill is None else tuple(c * 0.45 for c in fill), 1.0 * appear)
    if fill is not None:
        smp = smp.copy(); smp[..., :3] = np.array(fill, np.float32)
    blend(img, smp, x0, y0 - hpx, falpha)
    glow_lines(img, [p - [0, hpx] for p in polys], line, th, glow, True, lalpha, gcol)
    return [p - [0, hpx] for p in polys]


# ---------------- text
FONT = os.path.join(HERE, 'assets', 'Montserrat.ttf')
_fc = {}


def font(size, wght=800):
    k = (size, wght)
    if k not in _fc:
        f = ImageFont.truetype(FONT, size)
        try: f.set_variation_by_axes([wght])
        except Exception: pass
        _fc[k] = f
    return _fc[k]


_tc = {}


def text_img(txt, size, wght=800, color=(255, 255, 255), stroke=0, scol=(0, 0, 0), shadow=True, track=0):
    k = (txt, size, wght, color, stroke, scol, shadow, track)
    if k in _tc: return _tc[k]
    color = tuple(int(c) for c in color[::-1]); scol = tuple(int(c) for c in scol[::-1])
    f = font(size, wght)
    pad = int(size * 0.6) + stroke
    if track:
        widths = [f.getlength(ch) + track for ch in txt]; tw = int(sum(widths))
    else:
        tw = int(f.getlength(txt))
    asc, desc = f.getmetrics()
    top = max(0, -f.getbbox(txt)[1]) if txt else 0
    pad += top
    im = Image.new('RGBA', (tw + pad * 2, asc + desc + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def put(dd, fill, st=0):
        if track:
            x = pad
            for ch, wd in zip(txt, widths):
                dd.text((x, pad), ch, font=f, fill=fill, stroke_width=st, stroke_fill=fill); x += wd
        else:
            dd.text((pad, pad), txt, font=f, fill=fill, stroke_width=st, stroke_fill=fill)
    if shadow:
        sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); put(ImageDraw.Draw(sh), (0, 0, 0, 170), stroke)
        sh = sh.filter(ImageFilter.GaussianBlur(size * 0.09))
        im.alpha_composite(sh, (0, int(size * 0.05)))
    if stroke:
        put(d, scol + (255,), stroke)
    put(d, color + (255,), 0)
    a = np.asarray(im).astype(np.float32)
    out = np.empty_like(a); out[..., :3] = a[..., 2::-1]; out[..., 3] = a[..., 3] / 255
    _tc[k] = out
    return out


def put_text(img, txt, x, y, size, wght=800, color=(255, 255, 255), anchor='c', alpha=1.0, scale=1.0, **kw):
    t = text_img(txt, size, wght, color, **kw)
    if scale != 1.0 and scale > 0.02:
        t = cv2.resize(t, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    h, w = t.shape[:2]
    if anchor == 'c': x0, y0 = x - w / 2, y - h / 2
    elif anchor == 'l': x0, y0 = x - int(size * 0.6 * scale), y - h / 2
    else: x0, y0 = x - w + int(size * 0.6 * scale), y - h / 2
    blend(img, t, int(round(x0)), int(round(y0)), alpha)
    return w, h


def ground_text(img, cam, txt, lon, lat, size_deg, wght=800, color=(255, 255, 255), alpha=1.0, rot=0.0, track=0):
    """text lying on the map, centred at lon/lat, height size_deg (deg of latitude)"""
    if alpha <= 0: return
    t = text_img(txt, 96, wght, color, shadow=True, track=track)
    h, w = t.shape[:2]
    hd = size_deg * h / 96 * 0.75
    wd = hd * w / h / max(math.cos(lat * D2R), 0.2)
    c = np.array([[-wd / 2, hd / 2], [wd / 2, hd / 2], [wd / 2, -hd / 2], [-wd / 2, -hd / 2]])
    if rot:
        a = rot * D2R; c = c @ np.array([[math.cos(a), math.sin(a)], [-math.sin(a), math.cos(a)]])
    ll = c + [lon, lat]
    xy, vis = cam.project(ll)
    if not vis.all(): return
    src = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    M = cv2.getPerspectiveTransform(src, xy.astype(np.float32))
    x0, y0 = int(max(0, xy[:, 0].min() - 2)), int(max(0, xy[:, 1].min() - 2))
    x1, y1 = int(min(W, xy[:, 0].max() + 3)), int(min(H, xy[:, 1].max() + 3))
    if x1 <= x0 or y1 <= y0: return
    T = np.array([[1, 0, -x0], [0, 1, -y0], [0, 0, 1]], np.float64) @ M
    warp = cv2.warpPerspective(t, T, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    blend(img, warp, x0, y0, alpha)


def rrect(w, h, r, fill=(20, 24, 32, 200), border=(255, 255, 255, 60), bw=2):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w - 1, h - 1], r, fill=fill, outline=border, width=bw)
    a = np.asarray(im).astype(np.float32)
    out = np.empty_like(a); out[..., :3] = a[..., 2::-1]; out[..., 3] = a[..., 3] / 255
    return out


def glass(img, x0, y0, w, h, r=22, alpha=1.0, tint=(22, 18, 14), op=0.55):
    """frosted glass card"""
    x0, y0 = int(x0), int(y0)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if xb <= xa or yb <= ya or alpha <= 0: return
    sub = img[ya:yb, xa:xb]
    bl = cv2.GaussianBlur(sub, (0, 0), 14)
    card = rrect(w, h, r, (255, 255, 255, 255), (255, 255, 255, 255), 0)
    m = card[ya - y0:yb - y0, xa - x0:xb - x0, 3:4] * alpha
    mix = bl * (1 - op) + np.array(tint, np.float32) * op
    sub[:] = sub * (1 - m) + mix * m
    brd = rrect(w, h, r, (0, 0, 0, 0), (255, 255, 255, 90), 2)
    blend(img, brd, x0, y0, alpha)


def vignette(img, k=0.35):
    X, Y = pixgrid()
    v = 1 - k * np.clip((X * X * 0.8 + Y * Y) - 0.25, 0, 1.5)
    img *= v[..., None]


def fmt(n):
    return f'{int(round(n)):,}'.replace(',', '.')
