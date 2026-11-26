import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf, os, shutil
SR=48000; O='/home/claude/emh/public/sfx/'
rng=np.random.default_rng(7)
def save(n,x,g=0.9):
    x=x/ (np.max(np.abs(x))+1e-9)*g
    wf.write(O+n+'.wav',SR,(x*32767).astype(np.int16))
def env(n,a,d):
    t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def bp(x,lo,hi,o=2): b,a=ss.butter(o,[lo/(SR/2),hi/(SR/2)],'band'); return ss.lfilter(b,a,x)
def lp(x,f,o=2): b,a=ss.butter(o,f/(SR/2)); return ss.lfilter(b,a,x)
def hp(x,f,o=2): b,a=ss.butter(o,f/(SR/2),'high'); return ss.lfilter(b,a,x)
def pink(n):
    w=rng.standard_normal(n); f=np.fft.rfft(w); k=np.arange(len(f)); k[0]=1; return np.fft.irfft(f/np.sqrt(k),n)
# whooshes
for i,(dur,f0,f1) in enumerate([(0.45,300,3000),(0.6,200,2200),(0.35,500,4500),(0.8,150,1800)]):
    n=int(dur*SR); t=np.arange(n)/SR; w=rng.standard_normal(n)
    out=np.zeros(n); seg=256
    for s in range(0,n,seg):
        p=s/n; fc=f0*(f1/f0)**p
        out[s:s+seg]=bp(w[max(0,s-2048):s+seg],fc*0.6,min(fc*1.6,23000))[-len(out[s:s+seg]):]
    e=np.sin(np.pi*np.clip(t/dur,0,1))**1.6
    save(f'whoosh_{i+1}',out*e,0.8)
# pops
for i,f in enumerate([520,650,780,900]):
    n=int(0.16*SR); t=np.arange(n)/SR
    fr=f*(1+2.2*np.exp(-t/0.012)); ph=2*np.pi*np.cumsum(fr)/SR
    x=np.sin(ph)*env(n,0.001,0.045)+0.25*bp(rng.standard_normal(n),2000,8000)*env(n,0.0005,0.006)
    save(f'pop_{i+1}',x,0.8)
# referee whistle (two-tone pea whistle with trill)
def whistle(dur,name):
    n=int(dur*SR); t=np.arange(n)/SR
    trill=1+0.035*np.sign(np.sin(2*np.pi*31*t))*0.5+0.02*np.sin(2*np.pi*31*t)
    f=2950*trill; ph=2*np.pi*np.cumsum(f)/SR
    x=np.sin(ph)+0.35*np.sin(2*ph)+0.12*np.sin(3*ph)
    x*= (1+0.6*np.sin(2*np.pi*31*t))/1.6
    x+=0.25*bp(rng.standard_normal(n),2500,4000)
    a=np.minimum(1,t/0.02)*np.minimum(1,(dur-t)/0.06)
    save(name,x*a,0.7)
whistle(0.55,'whistle_short'); whistle(1.3,'whistle_long')
# crowd ambience loop (8 s) and roar
def crowd(dur,roar=False):
    n=int(dur*SR); t=np.arange(n)/SR
    base=bp(pink(n),250,3500,2)
    # many voices: modulated bands
    v=np.zeros(n)
    for k in range(40):
        fc=rng.uniform(300,1400); w=bp(rng.standard_normal(n),fc*0.85,fc*1.15,1)
        am=0.5+0.5*np.sin(2*np.pi*rng.uniform(0.2,2.5)*t+rng.uniform(0,6))
        v+=w*am
    x=base*0.6+v/np.std(v)*np.std(base)*0.9
    if roar:
        e=np.minimum(1,t/0.25)*np.exp(-np.maximum(0,t-0.8)/1.1)
        x=hp(x,180)*(0.25+e)
    return x
c=crowd(10.0); fade=int(0.5*SR); c[:fade]*=np.linspace(0,1,fade); c[-fade:]*=np.linspace(1,0,fade)
save('crowd_loop',c,0.6)
save('crowd_roar',crowd(3.2,True),0.9)
# ohh (disappointment)
n=int(1.6*SR); t=np.arange(n)/SR; x=crowd(1.6); x=lp(x,900)*np.sin(np.pi*np.clip(t/1.6,0,1)); save('crowd_ohh',x,0.8)
# kick ball (thump + slap)
n=int(0.25*SR); t=np.arange(n)/SR
x=np.sin(2*np.pi*np.cumsum(90+300*np.exp(-t/0.01))/SR)*env(n,0.001,0.05)+0.6*bp(rng.standard_normal(n),800,5000)*env(n,0.0005,0.012)
save('kick',x,0.9)
# boom (impact)
n=int(1.8*SR); t=np.arange(n)/SR
x=np.sin(2*np.pi*np.cumsum(38+120*np.exp(-t/0.05))/SR)*env(n,0.002,0.5)+0.5*lp(rng.standard_normal(n),900)*env(n,0.001,0.15)
save('boom',x,0.95)
# riser
n=int(1.6*SR); t=np.arange(n)/SR; w=rng.standard_normal(n); out=np.zeros(n)
for s in range(0,n,256):
    fc=300*(12)**(s/n); out[s:s+256]=bp(w[max(0,s-2048):s+256],fc*0.7,min(fc*1.4,22000))[-len(out[s:s+256]):]
x=out*(t/1.6)**2+0.3*np.sin(2*np.pi*np.cumsum(120*(4)**(t/1.6))/SR)*(t/1.6)**2
save('riser',x,0.7)
# drumroll (snare roll)
n=int(1.5*SR); x=np.zeros(n)
for k,st in enumerate(np.arange(0,1.45,0.034)):
    i=int(st*SR); m=int(0.06*SR); s=bp(rng.standard_normal(m),1500,7000)*env(m,0.0005,0.02)+0.4*np.sin(2*np.pi*190*np.arange(m)/SR)*env(m,0.0005,0.03)
    x[i:i+m]+=s*(0.35+0.65*st/1.45)
save('drumroll',x,0.8)
# card slap (paper slap)
n=int(0.2*SR); x=bp(rng.standard_normal(n),600,6000)*env(n,0.0005,0.02)+0.5*np.sin(2*np.pi*140*np.arange(n)/SR)*env(n,0.001,0.04)
save('slap',x,0.85)
# tick for roulette
n=int(0.04*SR); x=bp(rng.standard_normal(n),2000,9000)*env(n,0.0002,0.006)+0.5*np.sin(2*np.pi*1800*np.arange(n)/SR)*env(n,0.0002,0.008)
save('tick',x,0.6)
# copy kenney picks
K='/home/claude/kenney/addons/kenney_interface_sounds/'
for a,b in [('confirmation_002','confirm'),('select_003','select'),('click_002','click'),('drop_002','drop'),('error_004','error'),('glass_002','glass'),('maximize_006','up'),('bong_001','bong')]:
    if os.path.exists(K+a+'.wav'): shutil.copy(K+a+'.wav',O+b+'.wav')
print(sorted(os.listdir(O)))
