# generic mixer: mix3.py events.json duration_s out.wav music_plan  (plan: name:a:b,name:a:b)
import json, sys, numpy as np, scipy.io.wavfile as wf, scipy.signal as ss
ev=json.load(open(sys.argv[1])); total=float(sys.argv[2]); out=sys.argv[3]; plan=sys.argv[4]
MV=float(sys.argv[5]) if len(sys.argv)>5 else 0.24
FPS=60; SR=48000; N=int(total*SR)
mix=np.zeros((N,2),np.float32); cache={}
def load(p):
    if p in cache: return cache[p]
    sr,x=wf.read(p); x=x.astype(np.float32)/32768.0
    if x.ndim==1: x=np.stack([x,x],1)
    if sr!=SR: x=ss.resample_poly(x,SR,sr,axis=0).astype(np.float32)
    cache[p]=x; return x
def looped(x,n,xf=2.0):
    x=x[:-int(2.0*SR)] if len(x)>4*SR else x
    k=int(xf*SR); o=np.zeros((n,2),np.float32); pos=0; fin=np.linspace(0,1,k)[:,None]
    while pos<n:
        seg=x.copy()
        if pos>0: seg[:k]*=fin
        seg[-k:]*=(1-fin)
        m=min(len(seg),n-pos); o[pos:pos+m]+=seg[:m]; pos+=len(seg)-k
    return o
for item in plan.split(','):
    name,a,b=item.split(':'); a=float(a); b=min(float(b),total)
    x=load(f'public/music/{name}.wav'); n=int((b-a)*SR)
    lp=looped(x,n); e=np.ones(n,np.float32); k1=int(min(2.0,(b-a)/3)*SR); e[:k1]=np.linspace(0,1,k1); e[-k1:]=np.linspace(1,0,k1)
    if a==0: e[:int(0.3*SR)]=np.linspace(0,1,int(0.3*SR))
    i=int(a*SR); mix[i:i+n]+=lp*MV*e[:,None]
import os
if not os.environ.get('NOCROWD'):
    c=load('public/sfx/crowd_loop.wav'); mix+=looped(c,N,1.0)*0.08
for e_ in ev:
    t=e_['f']/FPS
    if t>=total: continue
    x=load(f"public/sfx/{e_['name']}.wav"); i=int(t*SR); m=min(len(x),N-i); mix[i:i+m]+=x[:m]*e_['vol']
mix=np.tanh(mix*1.05)/np.tanh(1.05); mix*=0.95/np.abs(mix).max()
wf.write(out,SR,(mix*32767).astype(np.int16)); print('ok',out)
