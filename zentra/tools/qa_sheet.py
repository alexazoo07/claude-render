import json, subprocess, os
from PIL import Image, ImageDraw
J = json.load(open('src/beats.json'))
B = '/home/claude/zv/public/base'
items = []
for k, x in enumerate(J['video']):
    L = x['t1'] - x['t0']
    if 'p' in x and 'map' not in x:
        r = x.get('rate', 1)
        items.append((k, x['t0'], x['p'], x['s'] + 0.05, x['s'] + L * r - 0.05, x.get('rate')))
    elif 'split' in x:
        for sd in x['split']:
            items.append((k, x['t0'], sd['p'], sd['s'] + 0.05, sd['s'] + L - 0.05, 'split'))
W, H = 192, 108
cols = 8
rows = (len(items) + cols - 1) // cols
sh = Image.new('RGB', (cols * (2 * W + 8), rows * (H + 16)), 'black'); d = ImageDraw.Draw(sh)
for i, (k, t0, p, a, b, r) in enumerate(items):
    x0 = (i % cols) * (2 * W + 8); y0 = (i // cols) * (H + 16)
    for j, t in enumerate((a, b)):
        subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-ss', str(max(0, t)), '-i', f'{B}/b{p}.mp4', '-frames:v', '1', '-vf', f'scale={W}:{H}', '/tmp/q.jpg'])
        try: sh.paste(Image.open('/tmp/q.jpg'), (x0 + j * W, y0))
        except Exception: pass
    d.text((x0 + 2, y0 + H + 1), f'#{k} {t0:.1f}s {p}@{a:.1f}-{b:.1f} {r or ""}', fill='yellow')
sh.save('/tmp/qa_src.jpg', quality=80)
print(len(items), sh.size)
