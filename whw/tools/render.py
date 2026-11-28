"""Satellite-map franchise short renderer (1080x1920).
usage: render.py still <t> <out.jpg> | render.py video <out.mp4> [t0 t1]"""
import sys, json, math, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
import os
PROJ = os.environ.get('WHW_PROJ', '/home/claude/fr'); DATA = os.environ.get('WHW_DATA', PROJ + '/data')
sys.path.insert(0, PROJ)
from data import COUNTRIES

W, H, FPS = 1080, 1920, 60
ROOT = PROJ
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(f'{ROOT}/out/timeline.json'))
TOTAL = TL['total']

# ---------------------------------------------------------------- texture pyramid
LV = [np.load(f'{DATA}/sat{i}.npy', mmap_mode='r') for i in range(6)]
_lv_cache = {}
def level(i):
    if i not in _lv_cache: _lv_cache[i] = np.ascontiguousarray(LV[i])
    return _lv_cache[i]

def merc(lon, lat):
    lat = max(-85, min(85, lat))
    return (lon + 180) / 360, (1 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / math.pi) / 2

def base_image(cx, cy, w):
    h = w * H / W
    xs = cx - w / 2 + (np.arange(W) + 0.5) / W * w
    ys = cy - h / 2 + (np.arange(H) + 0.5) / H * h
    lon = xs * 360 - 180
    lat = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * np.clip(ys, 0.001, 0.999)))))
    s0 = w * LV[0].shape[1] / W                     # level-0 source px per screen px
    li = int(np.clip(math.floor(math.log2(max(1.0, s0))), 0, 5))
    T = level(li); th, tw = T.shape[:2]
    px = ((lon + 180) / 360 * tw - 0.5) % tw
    py = np.clip((90 - lat) / 180 * th - 0.5, 0, th - 1)
    mx = np.broadcast_to(px[None, :], (H, W)).astype(np.float32)
    my = np.broadcast_to(py[:, None], (H, W)).astype(np.float32)
    img = cv2.remap(T, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    if s0 < 0.8:   # upscaled: sharpen a little
        bl = cv2.GaussianBlur(img, (0, 0), 2.2)
        img = cv2.addWeighted(img, 1.6, bl, -0.6, 0)
    return img

# ---------------------------------------------------------------- countries
import json as _j
GJ = _j.load(open(f'{DATA}/countries.geojson'))
POLY = {}
want = {c['iso'] for c in COUNTRIES}
for f in GJ['features']:
    a3 = f['properties'].get('ADM0_A3')
    if a3 not in want: continue
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    rings = []
    for p in polys:
        for r in p:
            arr = np.array(r, np.float64)
            lon, lat = arr[:, 0], np.clip(arr[:, 1], -85, 85)
            X = (lon + 180) / 360
            Y = (1 - np.log(np.tan(np.pi / 4 + np.radians(lat) / 2)) / np.pi) / 2
            rings.append(np.stack([X, Y], 1))
    POLY[a3] = rings
for c in COUNTRIES: assert c['iso'] in POLY, c['iso']

# ---------------------------------------------------------------- timeline helpers
SEGS = TL['segs']
CSTART = {s['ci']: s['start'] for s in SEGS if s['kind'] == 'country'}
ITEMS = [s for s in SEGS if s['kind'] == 'item']
APPEAR = {(s['ci'], s['ii']): s['name_t'] - 0.07 for s in ITEMS}
CAPS = sorted([cp for s in SEGS for cp in s['caps']], key=lambda x: x[0])

def arrive_view(c):
    lon0, lon1, lat0, lat1 = c['bbox']
    x0, y1 = merc(lon0, lat0); x1, y0 = merc(lon1, lat1)
    wx = (x1 - x0) * 1.22; wy = (y1 - y0) * 1.12
    return ((x0 + x1) / 2, (y0 + y1) / 2 + (y1 - y0) * 0.04, max(wx, wy * W / H))

def item_view(c, it):
    w = c['iw'] / 360; h = w * H / W
    x, y = merc(it[3], it[4])
    return (x, y + 0.07 * h, w)

# camera keys: (t, cx, cy, w, kind) ; kind of the segment ending at this key
KEYS = []
for ci, c in enumerate(COUNTRIES):
    av = arrive_view(c)
    st = CSTART[ci]
    if ci == 0:
        KEYS.append((0.0, av[0], av[1], av[2] * 1.06, 'ease'))
    else:
        KEYS.append((st - 0.08, *av, 'whip'))
    first = [s for s in ITEMS if s['ci'] == ci]
    for k, s in enumerate(first):
        it = c['items'][s['ii']]; iv = item_view(c, it)
        tland = s['name_t'] - 0.07
        if k == 0:
            dz = 0.30
            KEYS.append((tland - dz, av[0], av[1], av[2] * 0.93, 'lin'))   # slow push on arrival shot
            KEYS.append((tland, *iv, 'zoom'))
        else:
            KEYS.append((tland - 0.34, prev[0], prev[1], prev[2] * 0.975, 'lin'))
            KEYS.append((tland, *iv, 'pan'))
        prev = iv
    nxt = CSTART.get(ci + 1, TOTAL + 1)
    KEYS.append((nxt - 0.62 if ci + 1 < len(COUNTRIES) else TOTAL + 0.5, prev[0], prev[1], prev[2] * 0.95, 'lin'))

def ease_io(u):  # smooth, quick in/out
    return u * u * u * (u * (u * 6 - 15) + 10)

def camera(t):
    if t <= KEYS[0][0]: return KEYS[0][1:4]
    for a, b in zip(KEYS, KEYS[1:]):
        if a[0] <= t <= b[0]:
            u = (t - a[0]) / max(1e-6, b[0] - a[0]); kind = b[4]
            if kind == 'lin':
                v = u
            elif kind == 'whip':
                v = ease_io(u)
            else:
                v = ease_io(u)
            cx = a[1] + (b[1] - a[1]) * v; cy = a[2] + (b[2] - a[2]) * v
            lw = math.log(a[3]) + (math.log(b[3]) - math.log(a[3])) * v
            if kind == 'whip':
                d = math.hypot(b[1] - a[1], b[2] - a[2])
                bump = math.log(max(1.0, d / max(a[3], b[3]) * 1.7))
                lw += bump * math.sin(math.pi * u)
            return cx, cy, math.exp(lw)
    return KEYS[-1][1:4]

def alpha_country(ci, t):
    t0 = CSTART[ci] - 0.42
    return float(np.clip((t - t0) / 0.38, 0, 1))

# ---------------------------------------------------------------- logos
LOGO = {}
for c in COUNTRIES:
    for it in c['items']:
        LOGO[it[2]] = np.array(Image.open(f'{ROOT}/logos_ready/{it[2]}.png').convert('RGBA'))
LOGO_PX = 470    # on-screen width-ish of a sticker at the item zoom

def pop(u):   # u seconds since appear
    if u < 0: return 0.0
    x = u / 0.16
    if x >= 1: return 1.0
    return 0.55 + 0.45 * math.sin(x * math.pi * 0.5) + 0.12 * math.sin(x * math.pi)

def paste_rgba(dst, src, cx, cy, scale):
    h, w = src.shape[:2]
    nw, nh = max(2, int(w * scale)), max(2, int(h * scale))
    x0, y0 = int(round(cx - nw / 2)), int(round(cy - nh / 2))
    if x0 > W or y0 > H or x0 + nw < 0 or y0 + nh < 0: return
    im = cv2.resize(src, (nw, nh), interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_LINEAR)
    sx0, sy0 = max(0, -x0), max(0, -y0); dx0, dy0 = max(0, x0), max(0, y0)
    dx1, dy1 = min(W, x0 + nw), min(H, y0 + nh)
    if dx1 <= dx0 or dy1 <= dy0: return
    part = im[sy0:sy0 + dy1 - dy0, sx0:sx0 + dx1 - dx0].astype(np.float32) / 255
    a = part[..., 3:4]
    dst[dy0:dy1, dx0:dx1] = dst[dy0:dy1, dx0:dx1] * (1 - a) + part[..., :3] * a

# ---------------------------------------------------------------- captions
FONT = ImageFont.truetype(f'{HERE}/fonts/Fredoka.ttf', 62)
try: FONT.set_variation_by_name('Bold')
except Exception: pass
_cap = {}
def cap_img(text):
    if text in _cap: return _cap[text]
    tw = int(FONT.getlength(text)) + 60
    im = Image.new('RGBA', (tw, 130), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((30, 24), text, font=FONT, fill=(0, 0, 0, 170), stroke_width=6, stroke_fill=(0, 0, 0, 170))
    sh = np.array(sh); sh[..., 3] = cv2.GaussianBlur(sh[..., 3], (0, 0), 5)
    im = Image.alpha_composite(Image.fromarray(sh), im)
    d = ImageDraw.Draw(im)
    d.text((30, 18), text, font=FONT, fill=(255, 255, 255, 255), stroke_width=5, stroke_fill=(10, 10, 10, 255))
    _cap[text] = np.array(im); return _cap[text]

def caption_at(t):
    cur = None
    for ct, txt in CAPS:
        if ct <= t: cur = (ct, txt)
        else: break
    return cur

# ---------------------------------------------------------------- frame
VIG = None
def vignette():
    global VIG
    if VIG is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.75)) ** 2)
        VIG = (1 - 0.28 * np.clip(r - 0.35, 0, 1) ** 1.5)[..., None].astype(np.float32)
    return VIG

def draw_scene(t, cam):
    cx, cy, w = cam
    h = w * H / W
    img = base_image(cx, cy, w).astype(np.float32) / 255
    lum = (img @ np.array([0.3, 0.59, 0.11], np.float32))[..., None]
    lines = np.zeros((H, W), np.uint8)
    glow_any = False
    for ci, c in enumerate(COUNTRIES):
        a = alpha_country(ci, t)
        if a <= 0: continue
        mask = np.zeros((H, W), np.uint8); pts_all = []
        for off in (-1, 0, 1):
            for r in POLY[c['iso']]:
                X = (r[:, 0] + off - (cx - w / 2)) / w * W
                Y = (r[:, 1] - (cy - h / 2)) / h * H
                if X.max() < -50 or X.min() > W + 50 or Y.max() < -50 or Y.min() > H + 50: continue
                if (X.max() - X.min()) < 1.5 and (Y.max() - Y.min()) < 1.5: continue
                pts_all.append(np.round(np.stack([X, Y], 1) * 4).astype(np.int32))
        if not pts_all: continue
        cv2.fillPoly(mask, pts_all, 255, cv2.LINE_AA, shift=2)
        m = (mask.astype(np.float32) / 255)[..., None] * a
        col = np.array(c['col'], np.float32) / 255
        tint = col * (0.52 + 0.85 * lum)
        tint = np.clip(tint, 0, 1)
        img = img * (1 - 0.86 * m) + tint * 0.86 * m
        thick = 2
        cv2.polylines(lines, pts_all, True, int(255 * a), thick, cv2.LINE_AA, shift=2)
        glow_any = True
    if glow_any:
        lf = lines.astype(np.float32) / 255
        small = cv2.resize(lf, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
        g1 = cv2.resize(cv2.GaussianBlur(small, (0, 0), 4), (W, H))
        g2 = cv2.resize(cv2.GaussianBlur(small, (0, 0), 12), (W, H))
        L = np.clip(lf * 0.85 + g1 * 0.75 + g2 * 0.5, 0, 1)[..., None]
        img = img + (1 - img) * L * 0.9
    img *= vignette()
    # logos
    cur_ci = max([k for k, st in CSTART.items() if st - 0.7 <= t] or [0])
    for ci, c in enumerate(COUNTRIES):
        for ii, it in enumerate(c['items']):
            ta = APPEAR[(ci, ii)]
            if t < ta: continue
            iw = c['iw'] / 360
            src = LOGO[it[2]]
            zf = iw / w
            if ci != cur_ci: zf = min(zf, 1.1)   # neighbours never grow huge when we zoom into a small country
            base_scale = min(math.sqrt(470 * 330 / (src.shape[1] * src.shape[0])), 760 / src.shape[1], 460 / src.shape[0]) * zf
            x, y = merc(it[3], it[4])
            for off in (-1, 0, 1):
                sx = (x + off - (cx - w / 2)) / w * W; sy = (y - (cy - h / 2)) / h * H
                if -800 < sx < W + 800:
                    paste_rgba(img, src, sx, sy, base_scale * pop(t - ta))
    return img

def frame(t, prev_cam=None):
    cam = camera(t)
    # motion blur when camera moves fast
    sub = 1
    c2 = camera(t + 1 / FPS)
    move = math.hypot(c2[0] - cam[0], c2[1] - cam[1]) / cam[2] * W + abs(math.log(c2[2] / cam[2])) * 900
    if move > 10: sub = int(np.clip(move * 0.5 / 7, 2, 9))
    acc = None
    for k in range(sub):
        tt = t + (k / (sub - 1) - 0.5) * (1 / FPS) * 0.35 if sub > 1 else t
        im = draw_scene(t, camera(tt))
        acc = im if acc is None else acc + im
    img = acc / sub
    cp = caption_at(t)
    if cp:
        ci_ = cap_img(cp[1]); a = min(1.0, (t - cp[0]) / 0.1)
        if a > 0:
            ch = ci_.copy(); ch[..., 3] = (ch[..., 3] * a).astype(np.uint8)
            paste_rgba(img, ch, W / 2, 1440, 1.0)
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)

if __name__ == '__main__':
    if sys.argv[1] == 'still':
        t = float(sys.argv[2]); cv2.imwrite(sys.argv[3], frame(t)[:, :, ::-1], [cv2.IMWRITE_JPEG_QUALITY, 92])
    elif sys.argv[1] == 'sheet':
        ts = [float(x) for x in sys.argv[3:]]
        ims = [cv2.resize(frame(t), (270, 480), interpolation=cv2.INTER_AREA) for t in ts]
        while len(ims) % 6: ims.append(np.zeros_like(ims[0]))
        rows = [np.hstack(ims[i:i + 6]) for i in range(0, len(ims), 6)]
        cv2.imwrite(sys.argv[2], np.vstack(rows)[:, :, ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    elif sys.argv[1] == 'part':
        out, job, nj = sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
        N = int(math.ceil(TOTAL * FPS)); f0, f1 = N * job // nj, N * (job + 1) // nj
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out + '.tmp.mp4'], stdin=subprocess.PIPE)
        for fi in range(f0, f1):
            p.stdin.write(frame(fi / FPS).tobytes())
            if fi % 120 == 0: print(fi, flush=True)
        p.stdin.close(); assert p.wait() == 0; os.rename(out + '.tmp.mp4', out)
    elif sys.argv[1] == 'video':
        out = sys.argv[2]
        f0 = int(float(sys.argv[3]) * FPS) if len(sys.argv) > 3 else 0
        f1 = int(float(sys.argv[4]) * FPS) if len(sys.argv) > 4 else int(math.ceil(TOTAL * FPS))
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        for fi in range(f0, f1):
            p.stdin.write(frame(fi / FPS).tobytes())
            if fi % 60 == 0: print(fi, flush=True)
        p.stdin.close(); p.wait()
