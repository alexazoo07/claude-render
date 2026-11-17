import json, subprocess, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
BASE = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/zv/public/base'
cuts = json.load(open(os.path.join(HERE, 'cuts.json')))
out = os.path.join(HERE, '..', 'public', 'clips')
keep = set()
for c in cuts:
    keep.add(c['name'])
    dst = os.path.join(out, c['name'])
    if os.path.exists(dst): continue
    subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(c['start']), '-i', f"{BASE}/b{c['p']}.mp4", '-t', str(c['dur']), '-an',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-tune', 'film', '-pix_fmt', 'yuv420p', '-g', '30', '-movflags', '+faststart', dst + '.tmp.mp4'], check=True)
    os.rename(dst + '.tmp.mp4', dst)
for f in os.listdir(out):
    if f not in keep: os.remove(os.path.join(out, f))
print('ok', len(keep))
