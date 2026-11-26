"""usage: python3 render.py <datadir> <out.mp4> <job> <njobs>"""
import sys, os, subprocess, time, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scenes
D, OUT, job, nj = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
scenes.init(D)
N = int(round(scenes.END * scenes.FPS))
f0, f1 = N * job // nj, N * (job + 1) // nj
p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', '1920x1080', '-r', '60', '-i', '-',
                      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '60', OUT + '.tmp.mp4'], stdin=subprocess.PIPE)
t0 = time.time()
for f in range(f0, f1):
    im = np.clip(scenes.frame(f / scenes.FPS), 0, 255).astype(np.uint8)
    p.stdin.write(im.tobytes())
    if (f - f0) % 60 == 0: print(f, round(time.time() - t0, 1), flush=True)
p.stdin.close(); assert p.wait() == 0
os.rename(OUT + '.tmp.mp4', OUT)
print('done', f0, f1, round(time.time() - t0, 1))
