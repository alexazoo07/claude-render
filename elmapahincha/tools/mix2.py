import json, sys, numpy as np, scipy.io.wavfile as wf, scipy.signal as ss
ev=json.load(open('out/sfx_main.json')); segs=json.load(open('out/segments.json'))
FPS=60; SR=48000
total=(segs[-1]['from']+segs[-1]['dur'])/FPS; N=int(total*SR)
mix=np.zeros((N,2),np.float32); cache={}
def load(p):
    if p in cache: return cache[p]
    sr,x=wf.read(p); x=x.astype(np.float32)/32768.0
    if x.ndim==1: x=np.stack([x,x],1)
    if sr!=SR: x=ss.resample_poly(x,SR,sr,axis=0).astype(np.float32)
    cache[p]=x; return x
def place(x,t,g):
    i=int(t*SR); m=min(len(x),N-i)
    if m>0: mix[i:i+m]+=x[:m]*g
def looped(x,n,xf=2.0):
    # loop with crossfade (track already fades out at its end; trim the faded tail)
    x=x[:-int(2.0*SR)] if len(x)>4*SR else x
    k=int(xf*SR); out=np.zeros((n,2),np.float32); pos=0
    fin=np.linspace(0,1,k)[:,None]; fout=1-fin
    while pos<n:
        seg=x.copy()
        if pos>0: seg[:k]*=fin
        seg[-k:]*=fout
        m=min(len(seg),n-pos); out[pos:pos+m]+=seg[:m]; pos+=len(seg)-k
    return out
def fade_env(n,a,b,fa,fb):
    e=np.zeros(n,np.float32); ia,ib=int(a*SR),int(b*SR); ka,kb=int(fa*SR),int(fb*SR)
    e[ia:ib]=1
    if ka>0: e[ia:ia+ka]=np.linspace(0,1,min(ka,ib-ia))
    if kb>0: e[ib-kb:ib]=np.linspace(1,0,kb)
    return e
start=lambda kind,idx=None: next(s['from'] for s in segs if s['kind']==kind and (idx is None or s.get('idx')==idx))/FPS
t_tense=start('round',7); t_champ=start('champ'); t_final=start('finalIntro')
MV=0.24
plan=[('m_happy',0,t_tense+1.5,0.6,3.0),('m_tense',t_tense-1.5,t_champ+0.5,3.0,1.5),('m_triumph',t_champ,total,0.5,3.0)]
for name,a,b,fa,fb in plan:
    x=load(f'public/music/{name}.wav'); n=int((b-a)*SR)+SR
    lp=looped(x,n)
    e=fade_env(N,a,min(b,total),fa,fb)
    i=int(a*SR); m=min(n,N-i)
    mix[i:i+m]+=lp[:m]*MV*e[i:i+m,None]
# crowd ambience
c=load('public/sfx/crowd_loop.wav'); mix+=looped(c,N,1.0)*0.09
for e_ in ev: place(load(f"public/sfx/{e_['name']}.wav"), e_['f']/FPS, e_['vol'])
pk=np.abs(mix).max(); print('peak',pk)
mix=np.tanh(mix*1.05)/np.tanh(1.05)
mix*=0.95/np.abs(mix).max()
wf.write('out/main_audio.wav',SR,(mix*32767).astype(np.int16)); print('ok',total)
