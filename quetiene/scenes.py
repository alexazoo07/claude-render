"""México es MUCHO más grande de lo que crees — part 1 (0 – 129.8 s)"""
import math, numpy as np, cv2
from engine import *

FPS = 60
END = 129.8
w = None
S = {}


def init(D):
    global w
    w = World(D)
    flag_mx = cv2.imread(os.path.join(HERE, 'assets', 'flag_mx.png'))
    S['mex'] = w.shape('MEX', flag_mx)
    S['mexp'] = w.shape('MEX')
    S['usa'] = w.shape('USA_all', isos=['USA'], frac=0.0005)
    S['cam'] = w.shape('CAM', isos=['GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN'])
    S['can'] = w.shape('CAN', frac=0.003)
    S['rus'] = w.shape('RUS', frac=0.003)
    S['nor'] = w.shape('NORD', isos=['NOR', 'SWE', 'FIN', 'ISL'], frac=0.003)
    S['grl'] = w.shape('GRL', frac=0.01)
    afr = [k for k, v in pickle.load(open(f'{D}/countries.pkl', 'rb'))['cont'].items() if v == 'Africa']
    S['afr'] = w.shape('AFR', isos=afr, frac=0.0008)


def P(t, a, b):
    return min(max((t - a) / (b - a), 0.0), 1.0)


def win(t, a, b, fi=0.35, fo=0.35):
    """1 inside [a,b] with fades"""
    return min(P(t, a, a + fi), 1 - P(t, b - fo, b))


def lerp(a, b, s): return a + (b - a) * s


def lerp_cam(c1, c2, s, hump=0.0):
    if c1.mode == 'globe':
        lo, la = slerp_ll((c1.lon, c1.lat), (c2.lon, c2.lat), s)
        alt = math.exp(lerp(math.log(c1.alt), math.log(c2.alt), s)) * (1 + hump * math.sin(math.pi * s))
        return c1.copy(lon=lo, lat=la, alt=alt, tilt=lerp(c1.tilt, c2.tilt, s), head=lerp(c1.head, c2.head, s))
    return c1.copy(lon=lerp(c1.lon, c2.lon, s), lat=lerp(c1.lat, c2.lat, s),
                   span=math.exp(lerp(math.log(c1.span), math.log(c2.span), s)))


def cam_track(t, keys):
    """keys: list of (time_start, time_end, cam) ; holds between, eases inside [ts,te]"""
    c = keys[0][2]
    for i in range(1, len(keys)):
        ts, te, ck = keys[i][:3]
        if t <= ts: return c
        if t < te:
            return lerp_cam(c, ck, ease5(P(t, ts, te)), keys[i][3] if len(keys[i]) > 3 else 0)
        c = ck
    return c


# ---------------- UI pieces
def pill(img, txt, x, y, a, size=34, col=(255, 255, 255), bg=(24, 20, 16), scale_in=True, accent=None):
    if a <= 0: return
    sc = back(a) if scale_in else 1
    t = text_img(txt, size, 800, col, shadow=False)
    tw, th = t.shape[1] - 2 * int(size * 0.6), int(size * 1.9)
    bw = int((tw + size * 1.3) * sc); bh = int(th * sc)
    if bw < 8 or bh < 8: return
    glass(img, x - bw / 2, y - bh / 2, bw, bh, r=bh // 2, alpha=min(a * 1.5, 1), tint=bg, op=0.7)
    if accent is not None:
        fill_polys(img, [np.array([[x - bw / 2 + 4, y - bh / 2 + bh * .25], [x - bw / 2 + 10, y - bh / 2 + bh * .25],
                                    [x - bw / 2 + 10, y + bh / 2 - bh * .25], [x - bw / 2 + 4, y + bh / 2 - bh * .25]], np.float32)], accent, a)
    put_text(img, txt, x, y, size, 800, col, alpha=min(a * 1.5, 1), scale=sc, shadow=False)


def big(img, txt, x, y, a, size=120, col=(255, 255, 255), stroke=0, scol=(0, 0, 0)):
    if a <= 0: return
    put_text(img, txt, x, y, size, 900, col, alpha=min(1, a * 2), scale=back(min(1, a * 1.4)), stroke=stroke, scol=scol)


def glitch(img, k, seed):
    if k <= 0: return img
    rng = np.random.default_rng(seed)
    out = img.copy()
    d = int(14 * k)
    out[..., 2] = np.roll(img[..., 2], d, 1); out[..., 0] = np.roll(img[..., 0], -d, 1)
    for _ in range(int(9 * k)):
        y0 = rng.integers(0, H - 40); hh = rng.integers(6, 50); sh = int(rng.integers(-80, 80) * k)
        out[y0:y0 + hh] = np.roll(out[y0:y0 + hh], sh, 1)
    out[..., 2] += 40 * k
    return out


def dashed(img, pts, col, th=3, dash=18, gap=12, prog=1.0, phase=0.0, alpha=1.0, gcol=None):
    """pts screen polyline (N,2); draw dashed with glow up to prog fraction of length"""
    if len(pts) < 2 or alpha <= 0: return
    seg = np.diff(pts, axis=0); L = np.sqrt((seg ** 2).sum(1)); cum = np.concatenate([[0], np.cumsum(L)])
    tot = cum[-1] * prog
    out = []; s = -phase % (dash + gap)
    s = s - (dash + gap)
    while s < tot:
        a, b = max(s, 0), min(s + dash, tot)
        if b > a:
            ts = np.linspace(a, b, 6)
            xs = np.interp(ts, cum, pts[:, 0]); ys = np.interp(ts, cum, pts[:, 1])
            out.append(np.stack([xs, ys], -1).astype(np.float32))
        s += dash + gap
    glow_lines(img, out, col, th, 1.2, False, alpha, gcol, sig=6)


def gc_points(a, b, n=120, upto=1.0):
    return np.array([slerp_ll(a, b, s * upto) for s in np.linspace(0, 1, n)])


def circle_ll(c, r, n=72):
    Pc = unit(*c); F = frame_at(*c); E, N = F[:, 1], F[:, 2]
    th = np.linspace(0, 2 * np.pi, n, endpoint=False)
    r = r * D2R
    p = math.cos(r) * Pc[None] + math.sin(r) * (np.cos(th)[:, None] * E[None] + np.sin(th)[:, None] * N[None])
    return np.stack([np.degrees(np.arctan2(p[:, 1], p[:, 0])), np.degrees(np.arcsin(p[:, 2]))], -1), th


def tissot(img, cam, centers, r, morph=1.0, alpha=1.0, colorize=0.0):
    for c in centers:
        ll, th = circle_ll(c, r)
        if cam.mode == 'globe':
            xy, vis = cam.project(ll)
            if vis.mean() < 0.9: continue
        else:
            ll[:, 0] = c[0] + ((ll[:, 0] - c[0] + 180) % 360 - 180)
            ll[:, 0] -= 360 * round((c[0] - cam.lon) / 360)
            x = W / 2 + (ll[:, 0] - cam.lon) * D2R * cam.sx
            y = H / 2 - (np.log(np.tan(np.pi / 4 + ll[:, 1] * D2R / 2)) - cam.my) * cam.sx
            xy = np.stack([x, y], -1)
            cxy, _ = cam.project(np.array(c))
            R = r * D2R * cam.sx
            eq = np.stack([cxy[0] + R * np.cos(th), cxy[1] - R * np.sin(th)], -1)
            xy = eq * (1 - morph) + xy * morph
        st = 1 / max(math.cos(c[1] * D2R), 0.2)
        k = min(1, (st - 1) / 2.5) * colorize
        col = (lerp(120, 60, k), lerp(230, 70, k), lerp(140, 255, k))
        fill_polys(img, [xy.astype(np.float32)], col, 0.28 * alpha)
        glow_lines(img, [xy.astype(np.float32)], col, 2, 0.7, True, alpha, sig=5)


def lat_line(img, cam, lat, col, alpha, prog=1.0, lon0=-180, lon1=180, dash=True, phase=0):
    ll = np.stack([np.linspace(lon0, lon1, 400), np.full(400, lat)], -1)
    if cam.mode == 'merc':
        ll[:, 0] = cam.lon + np.linspace(-180, 180, 400)
    xy, vis = cam.project(ll)
    xy = xy[vis]
    if len(xy) < 2: return
    if dash: dashed(img, xy, col, 3, 22, 14, prog, phase, alpha)
    else: glow_lines(img, [xy.astype(np.float32)], col, 2.5, 1.0, False, alpha)


def label_at(img, cam, txt, ll, a, dy=-60, size=34, col=(255, 255, 255)):
    xy, vis = cam.project(np.array(ll))
    if not vis: return
    pill(img, txt, xy[0], xy[1] + dy, a, size, col)


# ---------------- scenes
WHITE = (255, 255, 255)
RED = (60, 60, 255); BLUE = (255, 160, 60); ORANGE = (40, 150, 255); CYAN = (255, 230, 120); GOLD = (60, 200, 255)
GREEN = (120, 220, 90)


def sc_intro(t):
    cam = cam_track(t, [(0, 0, Cam('merc', -10, 22, span=380)),
                        (0, 9.6, Cam('merc', -20, 24, span=330)),
                        (9.6, 13.2, Cam('merc', -96, 25, span=118)),
                        (13.2, 24.5, Cam('merc', -93, 24, span=98))])
    img = w.base(cam)
    vignette(img, 0.3)
    # chips
    for i, (txt, ts) in enumerate([('EL COLEGIO', 5.3), ('LAS NOTICIAS', 6.7), ('GOOGLE MAPS', 8.1)]):
        a = win(t, ts, 10.0, 0.35, 0.4)
        pill(img, txt, 960 + (i - 1) * 420, 150, a, 40, accent=GOLD)
    a_usa = P(t, 16.7, 17.2); a_cam = P(t, 17.8, 18.3)
    if a_usa > 0:
        draw_shape(w, img, cam, S['usa'], fill=BLUE, falpha=0.22 * a_usa, line=BLUE, lalpha=a_usa, th=2, glow=0.7)
        label_at(img, cam, 'ESTADOS UNIDOS', (-99, 39), a_usa, 0, 36)
    if a_cam > 0:
        draw_shape(w, img, cam, S['cam'], fill=ORANGE, falpha=0.25 * a_cam, line=ORANGE, lalpha=a_cam, th=2, glow=0.7)
        label_at(img, cam, 'CENTROAMÉRICA', (-80, 11.5), a_cam, 0, 34)
    am = P(t, 11.3, 11.8)
    if am > 0:
        draw_shape(w, img, cam, S['mex'], falpha=0.92 * am, lalpha=am, th=2.5, glow=1.2, gcol=GREEN)
        if t > 11.5:
            label_at(img, cam, 'MÉXICO', (-102, 24), P(t, 11.5, 12.0), -95 * (cam.span < 200) - 40, 42)
    ap = win(t, 12.4, 19.3, 0.3, 0.3)
    if ap > 0:
        label_at(img, cam, '¿UN PAÍS MEDIANO?', (-104, 17), ap, 95, 32, GOLD)
    # the lie
    gk = max(0.0, 1 - abs(t - 20.75) / 0.45) + 0.5 * max(0.0, 1 - abs(t - 21.4) / 0.2)
    if gk > 0: img = glitch(img, gk, int(t * 60))
    a = win(t, 20.55, 24.4, 0.15, 0.5)
    if a > 0:
        big(img, 'ESTE MAPA MIENTE', 960, 950, a, 92, (255, 255, 255), 6, (30, 30, 210))
    return img


RANK = [('RUSIA', 17098246), ('CANADÁ', 9984670), ('ESTADOS UNIDOS', 9833517), ('CHINA', 9596961), ('BRASIL', 8515767),
        ('AUSTRALIA', 7692024), ('INDIA', 3287263), ('ARGENTINA', 2780400), ('KAZAJISTÁN', 2724900), ('ARGELIA', 2381741),
        ('R. D. DEL CONGO', 2344858), ('ARABIA SAUDÍ', 2149690), ('MÉXICO', 1964375)]


def counter_card(img, t, a, x=1430, y=300):
    if a <= 0: return
    cw, ch = 760, 300
    glass(img, x - cw / 2, y - ch / 2 + (1 - eout(a)) * 40, cw, ch, 26, min(1, a * 1.5))
    yy = y + (1 - eout(a)) * 40
    put_text(img, 'SUPERFICIE DE MÉXICO', x, yy - 90, 34, 700, (200, 210, 220), alpha=a, shadow=False, track=3)
    v = 1964375 * eout(P(t, 28.4, 37.2)) ** 1.0
    if t < 28.4: v = 0
    put_text(img, fmt(v), x - 40, yy + 5, 104, 900, WHITE, alpha=a)
    put_text(img, 'km²', x + 300, yy + 22, 50, 800, GOLD, alpha=a)
    ab = P(t, 38.9, 39.4)
    if ab > 0:
        pill(img, '13.º PAÍS MÁS GRANDE DEL MUNDO', x, yy + 100, ab, 30, (255, 255, 255), accent=GOLD)


def rank_panel(img, t, a):
    if a <= 0: return
    x0, y0, pw = 70, 120, 640
    rh = 58
    glass(img, x0 - (1 - eout(a)) * 60, y0, pw, rh * 13 + 110, 26, min(1, a * 1.5))
    xo = x0 - (1 - eout(a)) * 60
    put_text(img, 'LOS 13 PAÍSES MÁS GRANDES', xo + pw / 2, y0 + 48, 32, 800, (200, 210, 220), alpha=a, shadow=False)
    for i, (n, v) in enumerate(RANK):
        ts = 43.4 + i * 0.22 if i < 12 else 47.85
        ra = P(t, ts, ts + 0.3) * a
        if ra <= 0: continue
        yy = y0 + 110 + i * rh
        mx = i == 12
        col = GOLD if mx else (235, 235, 235)
        put_text(img, f'{i + 1}', xo + 36, yy, 28, 800, col, alpha=ra, shadow=False)
        put_text(img, n, xo + 66, yy, 26, 700 if not mx else 900, col, anchor='l', alpha=ra, shadow=False)
        bl = (v / 17098246) ** 0.6 * 250 * eout(P(t, ts, ts + 0.6))
        bx = xo + 340
        fill_polys(img, [np.array([[bx, yy - 11], [bx + bl, yy - 11], [bx + bl, yy + 11], [bx, yy + 11]], np.float32)],
                   (60, 200, 255) if mx else (190, 150, 110), 0.9 * ra)
        put_text(img, f'{v / 1e6:.2f} M'.replace('.', ','), bx + bl + 12, yy, 22, 700, col, anchor='l', alpha=ra, shadow=False)


MEX_C = (-102.5, 23.6)
EU = (8, 47)


def sc_globe1(t):
    keys = [(23.4, 23.4, Cam('globe', -96, 22, 2.6, 0, 0)),
            (23.4, 27.5, Cam('globe', -101, 22, 1.08, 22, 0)),
            (27.5, 42.0, Cam('globe', -100, 22, 0.98, 26, -6)),
            (42.0, 43.6, Cam('globe', -118, 23, 1.0, 22, -4)),
            (48.6, 50.4, Cam('globe', -101, 22, 1.0, 26, -2)),
            (53.6, 55.4, Cam('globe', -101, 21, 1.15, 44, 0)),
            (59.6, 61.8, Cam('globe', -45, 30, 2.7, 6, 0), 0.15),
            (69.0, 76.6, Cam('globe', -48, 26, 2.5, 0, 4))]
    cam = cam_track(t, keys)
    img = w.base(cam)
    tissue = P(t, 75.0, 75.6)
    if tissue > 0:
        cs = [(lo, la) for la in (-60, -30, 0, 30, 60) for lo in range(-120, 60, 30)]
        tissot(img, cam.setup(), cs, 7, 1, tissue)
    # Mexico
    lift = 16 * ease(P(t, 56.2, 56.9)) * (1 - ease(P(t, 61.9, 62.5)))
    mv = 0.0
    if t > 59.8:
        mv = 0.45 * ease5(P(t, 59.8, 61.8)) * (1 - ease5(P(t, 61.85, 62.6)))
    if mv > 0.002:
        # ghost at home + dashed route
        draw_shape(w, img, cam, S['mexp'], fill=(255, 255, 255), falpha=0.12, line=(255, 255, 255), lalpha=0.5, th=1.5, glow=0.3)
        pts = gc_points(MEX_C, EU, 120)
        xy, vis = cam.project(pts)
        dashed(img, xy[vis], GOLD, 3, 20, 12, 1.0, t * 60, P(t, 59.8, 60.2) * (1 - P(t, 61.9, 62.4)))
    dst = slerp_ll(MEX_C, EU, mv)
    R = shape_rot(S['mex'], dst) if mv > 0.002 else None
    draw_shape(w, img, cam, S['mex'], R=R, falpha=0.95, lift=lift, th=2.5, glow=1.2 + 0.6 * (lift > 0), gcol=GREEN)
    counter_card(img, t, win(t, 28.1, 42.4, 0.4, 0.4))
    rank_panel(img, t, win(t, 43.0, 49.4, 0.4, 0.5))
    a = win(t, 57.9, 59.9, 0.3, 0.3)
    if a > 0:
        cam.setup(); xy, _ = cam.project(np.array(MEX_C))
        pill(img, 'TAMAÑO REAL', xy[0], xy[1] - 190, a, 40, accent=GREEN)
    a = win(t, 62.8, 68.6, 0.3, 0.4)
    if a > 0: pill(img, '¿POR QUÉ NOS ENGAÑA EL MAPA?', 960, 950, a, 40, accent=RED)
    # Mercator title + year
    a = win(t, 69.4, 76.2, 0.35, 0.4)
    if a > 0:
        pill(img, 'PROYECCIÓN DE MERCATOR', 960, 950, a, 44, accent=GOLD)
    a = win(t, 71.9, 76.2, 0.3, 0.4)
    if a > 0:
        big(img, '1569', 1560, 260, a, 150, GOLD)
        put_text(img, 'GERARDUS MERCATOR', 1560, 360, 30, 700, (220, 220, 220), alpha=a, track=2)
    a = P(t, 73.0, 74.4) * (1 - P(t, 75.4, 76.0))
    if a > 0:
        pts = gc_points((-9.2, 38.7), (-66, 18.4), 140)
        xy, vis = cam.project(pts)
        dashed(img, xy[vis], CYAN, 3, 16, 12, P(t, 73.0, 74.4), 0, a)
        label_at(img, cam, 'NAVEGAR', (-38, 32), a, -40, 32)
    a = win(t, 75.3, 76.05, 0.3, 0.2)
    if a > 0: big(img, 'ESFERA', 960, 140, a, 90)
    vignette(img, 0.3)
    return img


TIS = [(lo, la) for la in (-40, -20, 0, 20, 40, 60) for lo in range(-180, 180, 40)]


def sc_merc(t):
    keys = [(76.0, 76.0, Cam('merc', -10, 10, span=380)),
            (76.0, 78.0, Cam('merc', -10, 15, span=360)),
            (96.8, 100.6, Cam('merc', -70, 32, span=170)),
            (101.2, 103.2, Cam('merc', -15, 54, span=368))]
    cam = cam_track(t, keys)
    img = w.base(cam)
    a = win(t, 76.0, 83.4, 0.4, 0.5)
    if a > 0:
        tissot(img, cam, TIS, 6.5, ease5(P(t, 77.6, 79.2)), a, P(t, 79.4, 80.6))
    a = win(t, 76.35, 77.6, 0.2, 0.3)
    if a > 0: big(img, 'RECTÁNGULO', 960, 140, a, 90)
    a = win(t, 81.6, 85.0, 0.3, 0.4)
    if a > 0:
        lat_line(img, cam, 0, GOLD, a, 1.0, dash=False)
        xy, _ = cam.project(np.array([cam.lon, 0]))
        pill(img, 'ECUADOR', 960, xy[1] - 46, a, 34, GOLD)
    a = win(t, 79.4, 83.0, 0.3, 0.3)
    if a > 0: pill(img, 'CUANTO MÁS LEJOS DEL ECUADOR, MÁS ESTIRADO', 960, 960, a, 34, accent=RED)
    fade_n = 1 - 0.55 * P(t, 97.0, 99.0)
    flash = 1 + 0.8 * max(0, 1 - abs(t - 90.4) / 0.35)
    for key, ts, col, lab, ll in [('can', 86.0, RED, 'CANADÁ', (-105, 61)), ('rus', 87.0, RED, 'RUSIA', (95, 63)),
                                  ('nor', 88.1, RED, 'NÓRDICOS', (18, 64))]:
        a = P(t, ts, ts + 0.4) * (1 - P(t, 101.2, 101.8))
        if a > 0:
            draw_shape(w, img, cam, S[key], fill=col, falpha=min(0.9, 0.38 * a * flash) * fade_n, line=(140, 140, 255), lalpha=a * fade_n, th=2, glow=0.8)
            label_at(img, cam, lab, ll, a * fade_n, 0, 30)
    a = win(t, 90.1, 92.0, 0.2, 0.3)
    if a > 0: big(img, 'GIGANTES', 960, 150, a, 96, (255, 255, 255), 5, (40, 40, 200))
    a = P(t, 92.6, 93.4) * (1 - P(t, 101.2, 101.8))
    if a > 0:
        lat_line(img, cam, 23.44, CYAN, a, P(t, 92.6, 93.8), phase=t * 40)
        xy, _ = cam.project(np.array([cam.lon, 23.44]))
        pill(img, 'TRÓPICO DE CÁNCER', 1500, xy[1] - 42, a, 28, CYAN)
    a = P(t, 94.0, 94.4) * (1 - P(t, 101.2, 101.8))
    if a > 0:
        pulse = 1 + 0.6 * max(0, 1 - abs(t - 95.9) / 0.4)
        draw_shape(w, img, cam, S['mex'], falpha=0.95 * a, lalpha=a, th=2.5, glow=1.2 * pulse, gcol=GREEN)
        label_at(img, cam, 'MÉXICO', (-102, 23), a, 70, 30)
    a = win(t, 95.6, 101.0, 0.25, 0.4)
    if a > 0: big(img, 'ENCOGIDOS', 960, 150, a, 96, (255, 255, 255), 5, (40, 140, 40))
    # Greenland vs Africa
    a = P(t, 102.9, 103.3)
    if a > 0:
        draw_shape(w, img, cam, S['grl'], fill=CYAN, falpha=0.45 * a, line=WHITE, lalpha=a, th=2.2, glow=1.0, gcol=CYAN)
        label_at(img, cam, 'GROENLANDIA', (-41, 74), a, 0, 32)
    a = P(t, 108.3, 108.7)
    if a > 0:
        draw_shape(w, img, cam, S['afr'], fill=ORANGE, falpha=0.40 * a, line=WHITE, lalpha=a, th=2, glow=0.9, gcol=ORANGE)
        label_at(img, cam, 'ÁFRICA', (20, 8), a, 0, 32)
    a = win(t, 106.4, 110.0, 0.3, 0.3)
    if a > 0: pill(img, '¿DEL MISMO TAMAÑO?', 960, 960, a, 40, accent=GOLD)
    vignette(img, 0.3)
    return img


GRL_C = (-41.5, 74.5)


def sc_globe2(t):
    keys = [(109.4, 109.4, Cam('globe', -12, 40, 2.3, 0, 0)),
            (109.4, 111.4, Cam('globe', 2, 18, 1.85, 8, 0)),
            (114.2, 117.4, Cam('globe', -92, 24, 1.15, 18, 0), 0.25),
            (120.8, 123.0, Cam('globe', -94, 23, 1.05, 24, 0))]
    cam = cam_track(t, keys)
    img = w.base(cam)
    a = 1 - P(t, 114.4, 115.4)
    if a > 0:
        draw_shape(w, img, cam, S['afr'], fill=ORANGE, falpha=0.40 * a, line=WHITE, lalpha=a, th=2, glow=0.9, gcol=ORANGE)
    am = P(t, 114.6, 115.4)
    if am > 0:
        draw_shape(w, img, cam, S['mex'], falpha=0.95 * am, lalpha=am, th=2.5, glow=1.2, gcol=GREEN)
    # greenland path: home -> Africa (110-111.6) -> next to Mexico (114.6-117.2)
    AF = (18, 6); NX = (-77, 23)
    if t < 114.5:
        dst = slerp_ll(GRL_C, AF, ease5(P(t, 110.0, 111.7)))
    else:
        dst = slerp_ll(AF, NX, ease5(P(t, 114.6, 117.2)))
    R = shape_rot(S['grl'], dst)
    ll = 10 * math.sin(math.pi * P(t, 110.0, 111.7)) + 10 * math.sin(math.pi * P(t, 114.6, 117.2))
    draw_shape(w, img, cam, S['grl'], R=R, fill=CYAN, falpha=0.55, line=WHITE, th=2.2, glow=1.0, gcol=CYAN, lift=ll)
    a = win(t, 111.7, 114.4, 0.15, 0.4)
    if a > 0:
        big(img, '×14', 1500, 300, a, 170, GOLD)
        put_text(img, 'ÁFRICA ES 14 VECES MÁS GRANDE', 1500, 420, 30, 800, WHITE, alpha=a)
    # comparison card
    a = win(t, 117.4, 126.6, 0.4, 0.3)
    if a > 0:
        x, y, cw, ch = 1450, 250, 700, 290
        glass(img, x - cw / 2, y - ch / 2, cw, ch, 26, a)
        put_text(img, 'GROENLANDIA', x - 310, y - 70, 34, 800, CYAN, anchor='l', alpha=a)
        v = 2166086 * eout(P(t, 117.4, 120.0))
        put_text(img, fmt(v) + ' km²', x + 310, y - 70, 38, 900, WHITE, anchor='r', alpha=a)
        a2 = P(t, 121.9, 122.4) * a
        if a2 > 0:
            put_text(img, 'MÉXICO', x - 310, y + 10, 34, 800, (120, 230, 140), anchor='l', alpha=a2)
            put_text(img, fmt(1964375) + ' km²', x + 310, y + 10, 38, 900, WHITE, anchor='r', alpha=a2)
        a3 = P(t, 123.5, 123.9) * a
        if a3 > 0:
            pill(img, 'SOLO UN 10 % MÁS GRANDE', x, y + 95, a3, 32, GOLD, accent=GOLD)
    vignette(img, 0.3)
    return img


def sc_merc2(t):
    cam = cam_track(t, [(126.0, 126.0, Cam('merc', -60, 52, span=210)), (126.0, END, Cam('merc', -62, 50, span=190))])
    img = w.base(cam)
    draw_shape(w, img, cam, S['grl'], fill=CYAN, falpha=0.5, line=WHITE, th=2.2, glow=1.0, gcol=CYAN)
    draw_shape(w, img, cam, S['mex'], falpha=0.95, th=2.5, glow=1.2, gcol=GREEN)
    a = win(t, 127.0, END + 1, 0.3, 0.3)
    if a > 0: big(img, 'EN EL MAPA: VARIAS VECES MAYOR', 960, 110, a, 60, (255, 255, 255), 4, (30, 30, 200))
    vignette(img, 0.3)
    return img


SCENES = [(0.0, 24.4, sc_intro), (23.4, 76.8, sc_globe1), (76.0, 110.2, sc_merc), (109.4, 126.6, sc_globe2), (126.0, END, sc_merc2)]
XF = {1: (23.4, 24.4), 2: (76.0, 76.8), 3: (109.4, 110.2), 4: (126.0, 126.6)}

SFX = [(5.3, 'pop'), (6.7, 'pop'), (8.1, 'pop'), (11.3, 'hit'), (12.4, 'pop'), (16.7, 'pop'), (17.8, 'pop'), (20.5, 'glitch'),
       (23.3, 'whoosh'), (28.1, 'pop'), (28.4, 'ticks:28.4:37.2'), (38.9, 'pop'), (42.0, 'swish'), (43.0, 'pop'),
       (47.85, 'hit'), (53.6, 'swish'), (56.2, 'rise'), (57.9, 'pop'), (59.7, 'whoosh'), (61.85, 'rewind'), (62.8, 'pop'),
       (69.4, 'pop'), (71.9, 'hit'), (73.0, 'swish'), (75.0, 'pop'), (75.9, 'whoosh'), (77.6, 'rise'), (79.4, 'pop'),
       (81.6, 'pop'), (86.0, 'pop'), (87.0, 'pop'), (88.1, 'pop'), (90.1, 'hit'), (92.6, 'swish'), (94.0, 'pop'),
       (95.6, 'hit'), (96.8, 'swish'), (101.2, 'whoosh'), (102.9, 'pop'), (106.4, 'pop'), (108.3, 'pop'), (109.3, 'whoosh'),
       (110.0, 'swish'), (111.7, 'hit'), (114.4, 'whoosh'), (117.4, 'pop'), (117.4, 'ticks:117.4:120.0'), (121.9, 'pop'),
       (123.5, 'hit'), (125.9, 'whoosh'), (127.0, 'pop')]


def frame(t):
    act = [(i, sc) for i, (a, b, sc) in enumerate(SCENES) if a <= t < b]
    if len(act) == 1: return act[0][1](t)
    (i0, s0), (i1, s1) = act[0], act[-1]
    a, b = XF[i1]
    m = ease(P(t, a, b))
    A = s0(t); B = s1(t)
    out = A * (1 - m) + B * m
    out += 35 * max(0, 1 - abs(m - 0.5) * 2.6)   # soft flash
    return out
