"""Turn Natural Earth NE1 (pastel) into a satellite-looking equirectangular texture + pyramid."""
import numpy as np, cv2, sys
import sys
D = sys.argv[1]
src = np.load(f'{D}/ne1.npy', mmap_mode='r')
H, W, _ = src.shape
out = np.zeros((H, W, 3), np.uint8)
CH = 1200
PAD = 64
for y0 in range(0, H, CH):
    a0, a1 = max(0, y0 - PAD), min(H, y0 + CH + PAD)
    a = src[a0:a1].astype(np.float32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    L = 0.3 * R + 0.59 * G + 0.11 * B
    water = ((B - R) > 28) & (B > G - 8)
    water = cv2.morphologyEx(water.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
    blurL = cv2.GaussianBlur(L, (0, 0), 6)
    S = np.clip(L / (blurL + 1e-3), 0.55, 1.5)
    # ---- land
    gr = G - R
    wf = np.clip((gr + 4) / 22.0, 0, 1)           # forest / green
    wd = np.clip((R - G - 4) / 18.0, 0, 1)        # desert / arid
    wg = np.clip(1 - wf - wd, 0, 1)
    forest = np.array([46, 70, 36], np.float32)
    grass = np.array([120, 118, 74], np.float32)
    desert = np.array([200, 166, 118], np.float32)
    col = wf[..., None] * forest + wg[..., None] * grass + wd[..., None] * desert
    col /= (wf + wg + wd)[..., None] + 1e-6
    # brighten very pale (high L) arid areas a bit
    lumfac = np.clip((blurL - 150) / 90.0, 0.75, 1.25)
    land = col * lumfac[..., None] * (S[..., None] ** 1.35)
    sat = a.max(-1) - a.min(-1)
    snow = np.clip((L - 215) / 25.0, 0, 1) * np.clip((40 - sat) / 25.0, 0, 1) * np.clip((B - R + 6) / 8.0, 0, 1)
    land = land * (1 - snow[..., None]) + (np.array([232, 236, 240], np.float32) * S[..., None]) * snow[..., None]
    # ---- ocean
    t = np.clip((blurL - 120) / 70.0, 0, 1) ** 1.4
    deep = np.array([12, 38, 54], np.float32); shallow = np.array([38, 98, 112], np.float32)
    ocean = deep + (shallow - deep) * t[..., None]
    ocean *= (S[..., None] ** 0.8)
    res = np.where(water[..., None], ocean, land)
    res = np.clip(res, 0, 255).astype(np.uint8)
    out[y0:min(H, y0 + CH)] = res[y0 - a0: y0 - a0 + min(CH, H - y0)]
    print(y0, flush=True)
np.save(f'{D}/sat0.npy', out)
lvl = out
for i in range(1, 6):
    lvl = cv2.resize(lvl, (lvl.shape[1] // 2, lvl.shape[0] // 2), interpolation=cv2.INTER_AREA)
    np.save(f'{D}/sat{i}.npy', lvl)
cv2.imwrite('/tmp/sat_eu.jpg', out[2000:3000, 10500:12000, ::-1])
cv2.imwrite('/tmp/sat_world.jpg', cv2.resize(out, (2000, 1000), interpolation=cv2.INTER_AREA)[:, :, ::-1])
