import json, subprocess, os
from concurrent.futures import ThreadPoolExecutor
C = json.load(open('tools/npc_cuts.json'))
SRC = lambda s: f'/home/claude/zv/public/base/b{s[1:]}.mp4' if s.startswith('T') else f'/home/claude/npc/src/{s}.mp4'
os.makedirs('public/clips', exist_ok=True)
want = {c['id'] for c in C}
for f in os.listdir('public/clips'):
    if f.startswith('n_') and f not in want: os.remove('public/clips/' + f)
def job(c):
    out = 'public/clips/' + c['id']
    if os.path.exists(out): return
    tmp = out[:-4] + '.tmp.mp4'
    r = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-ss', str(c['a']), '-i', SRC(c['src']), '-t', str(c['d']), '-vf', 'scale=1920:1080:flags=lanczos,fps=60',
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-g', '30', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', tmp])
    if r.returncode == 0: os.rename(tmp, out)
    else: print('FAIL', c)
seen = {}
for c in C: seen[c['id']] = c
with ThreadPoolExecutor(2) as ex: list(ex.map(job, seen.values()))
print('done', len(seen))
