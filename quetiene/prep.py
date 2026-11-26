"""Build data for the long-form engine: dark satellite pyramid, country-id raster, outlines.
usage: python3 -I prep.py <datadir> <ne1.tif or ne1.npy> <countries.geojson>"""
import sys, json, pickle, numpy as np, cv2
D, SRC, GJ = sys.argv[1:4]
if SRC.endswith('.npy'): src = np.load(SRC, mmap_mode='r')
else:
    import tifffile; src = tifffile.imread(SRC)
H, W, _ = src.shape
out = np.zeros((H, W, 3), np.uint8); CH, PAD = 1200, 64
for y0 in range(0, H, CH):
    a0, a1 = max(0, y0 - PAD), min(H, y0 + CH + PAD)
    a = np.asarray(src[a0:a1], np.float32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    L = 0.3 * R + 0.59 * G + 0.11 * B
    water = ((B - R) > 28) & (B > G - 8)
    water = cv2.morphologyEx(water.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    wsoft = cv2.GaussianBlur(water.astype(np.float32), (0, 0), 0.8)
    blurL = cv2.GaussianBlur(L, (0, 0), 6)
    S = np.clip(L / (blurL + 1e-3), 0.55, 1.6)
    gr = G - R
    wf = np.clip((gr + 4) / 22.0, 0, 1); wd = np.clip((R - G - 4) / 18.0, 0, 1); wg = np.clip(1 - wf - wd, 0, 1)
    forest = np.array([34, 58, 30], np.float32); grass = np.array([96, 98, 58], np.float32); desert = np.array([182, 146, 100], np.float32)
    col = (wf[..., None] * forest + wg[..., None] * grass + wd[..., None] * desert) / ((wf + wg + wd)[..., None] + 1e-6)
    lumfac = np.clip((blurL - 150) / 90.0, 0.75, 1.25)
    land = col * lumfac[..., None] * (S[..., None] ** 1.5)
    sat = a.max(-1) - a.min(-1)
    snow = np.clip((L - 215) / 25.0, 0, 1) * np.clip((40 - sat) / 25.0, 0, 1) * np.clip((B - R + 6) / 8.0, 0, 1)
    land = land * (1 - snow[..., None]) + (np.array([215, 222, 230], np.float32) * S[..., None]) * snow[..., None]
    t = np.clip((blurL - 120) / 70.0, 0, 1) ** 1.6
    deep = np.array([7, 17, 30], np.float32); shallow = np.array([20, 56, 74], np.float32)
    ocean = (deep + (shallow - deep) * t[..., None]) * (S[..., None] ** 0.6)
    res = land * (1 - wsoft[..., None]) + ocean * wsoft[..., None]
    out[y0:min(H, y0 + CH)] = np.clip(res, 0, 255).astype(np.uint8)[y0 - a0: y0 - a0 + min(CH, H - y0)]
np.save(f'{D}/sat0.npy', out); lvl = out
for i in range(1, 6):
    lvl = cv2.resize(lvl, (lvl.shape[1] // 2, lvl.shape[0] // 2), interpolation=cv2.INTER_AREA); np.save(f'{D}/sat{i}.npy', lvl)
del out, src
# ---- countries
gj = json.load(open(GJ)); polys = {}; ids = ['']; cont = {}
CW, CHh = 12000, 6000
cid = np.zeros((CHh, CW), np.uint16)
for f in gj['features']:
    iso = f['properties']['ADM0_A3']; g = f['geometry']
    if g is None: continue
    rings = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
    ids.append(iso); k = len(ids) - 1; cont[iso] = f['properties'].get('CONTINENT', '')
    pl = []
    for poly in rings:
        ext = np.array(poly[0], np.float64); pl.append(ext)
        pts = np.stack([(ext[:, 0] + 180) / 360 * CW, (90 - ext[:, 1]) / 180 * CHh], -1)
        cv2.fillPoly(cid, [np.round(pts * 8).astype(np.int32)], k, shift=3)
    polys[iso] = pl
np.save(f'{D}/cid.npy', cid)
pickle.dump({'polys': polys, 'ids': ids, 'cont': cont}, open(f'{D}/countries.pkl', 'wb'))
print('ok', len(ids))
