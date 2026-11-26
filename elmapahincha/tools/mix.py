import json, sys, numpy as np, scipy.io.wavfile as wf, scipy.signal as ss
# usage: mix.py events.json duration_s out.wav [music_vol] [crowd_vol]
ev=json.load(open(sys.argv[1])); dur=float(sys.argv[2]); out=sys.argv[3]
mv=float(sys.argv[4]) if len(sys.argv)>4 else 0.2; cv=float(sys.argv[5]) if len(sys.argv)>5 else 0.16
SR=48000; FPS=60; N=int(dur*SR)
mix=np.zeros((N,2))
cache={}
def load(p):
    if p in cache: return cache[p]
    sr,x=wf.read(p); x=x.astype(np.float32)
    x/= 32768.0 if x.dtype!=np.float32 or np.abs(x).max()>1.5 else 1.0
    if x.ndim==1: x=np.stack([x,x],1)
    if sr!=SR: x=ss.resample_poly(x,SR,sr,axis=0)
    cache[p]=x; return x
def place(x,t,g):
    i=int(t*SR); m=min(len(x),N-i)
    if m>0: mix[i:i+m]+=x[:m]*g
# music
m=load('public/music/hinchada.wav')
reps=int(np.ceil(N/len(m)))+1; mm=np.concatenate([m]*reps)[:N]
env=np.ones(N); fi=int(0.4*SR); env[:fi]=np.linspace(0,1,fi); fo=int(1.5*SR); env[-fo:]=np.linspace(1,0.4,fo)
mix+=mm*mv*env[:,None]
c=load('public/sfx/crowd_loop.wav')
reps=int(np.ceil(N/len(c)))+1; cc=np.concatenate([c]*reps)[:N]
mix+=cc*cv
for e in ev:
    place(load(f"public/sfx/{e['name']}.wav"), e['f']/FPS, e['vol'])
# soft limiter
peak=np.abs(mix).max()
mix=np.tanh(mix*1.1)/np.tanh(1.1) if peak>0.9 else mix
mix*=0.92/max(np.abs(mix).max(),1e-6)
wf.write(out,SR,(mix*32767).astype(np.int16))
print('peak',peak,'written',out)
