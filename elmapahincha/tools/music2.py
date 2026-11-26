import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf, sys
SR=44100
def env(m,a,d,s=0.0):
    t=np.arange(m)/SR; e=np.minimum(1,t/max(a,1e-4))*((1-s)*np.exp(-t/d)+s); return e
def note_f(n): return 440*2**((n-69)/12)
def ks(f,dur,bright=0.5,seed=0):
    r=np.random.default_rng(seed); m=int(dur*SR); p=max(2,int(SR/f))
    buf=r.uniform(-1,1,p); buf=ss.lfilter([bright,1-bright],[1],buf)
    out=np.zeros(m); idx=0
    for i in range(m):
        v=buf[idx]; nxt=buf[(idx+1)%p]; buf[idx]=0.996*0.5*(v+nxt); out[i]=v; idx=(idx+1)%p
    return out*env(m,0.002,dur*0.6)
def ks_fast(f,dur,decay=0.996,seed=0):
    # vectorized-ish KS via block loop
    r=np.random.default_rng(seed); m=int(dur*SR); p=max(2,int(round(SR/f)))
    out=np.zeros(m+p); out[:p]=r.uniform(-1,1,p)
    for s in range(p,m+p,p):
        e=min(s+p,m+p); prev=out[s-p:e-p]; prev2=np.roll(out[s-p:s-p+p],-1)[:e-s]
        out[s:e]=decay*0.5*(prev+prev2)
    x=out[:m]; return ss.lfilter([1,-0.3],[1],x)*env(m,0.001,dur)
def marimba(f,dur):
    m=int(dur*SR); t=np.arange(m)/SR
    x=np.sin(2*np.pi*f*t)*np.exp(-t/0.45)+0.35*np.sin(2*np.pi*f*4*t)*np.exp(-t/0.06)+0.15*np.sin(2*np.pi*f*10*t)*np.exp(-t/0.015)
    return x*np.minimum(1,t/0.002)
def bell(f,dur):
    m=int(dur*SR); t=np.arange(m)/SR
    mod=np.sin(2*np.pi*f*3.5*t)*2.0*np.exp(-t/0.4)
    return np.sin(2*np.pi*f*t+mod)*np.exp(-t/0.9)*np.minimum(1,t/0.002)
def pad(fs,dur):
    m=int(dur*SR); t=np.arange(m)/SR; x=np.zeros(m)
    for f in fs:
        for d in (-0.006,0,0.006): x+=ss.sawtooth(2*np.pi*f*(1+d)*t+np.random.rand()*6)
    b,a=ss.butter(2,1800/(SR/2)); x=ss.lfilter(b,a,x)
    e=np.minimum(1,t/0.3)*np.minimum(1,(dur-t)/0.3); return x*e/len(fs)/3
def brass(fs,dur):
    m=int(dur*SR); t=np.arange(m)/SR; x=np.zeros(m)
    for f in fs:
        for d in (-0.004,0.004): x+=ss.sawtooth(2*np.pi*f*(1+d)*t)
    cut=600+2600*np.minimum(1,t/0.08)*np.exp(-t/0.6)
    y=np.zeros(m); st=0
    for s in range(0,m,512):
        b,a=ss.butter(2,min(cut[s],18000)/(SR/2)); y[s:s+512],_=ss.lfilter(b,a,x[s:s+512],zi=ss.lfilter_zi(b,a)*x[s]) if True else (0,0)
    return y*np.minimum(1,t/0.02)*np.minimum(1,(dur-t)/0.05)/len(fs)/2
def bassn(f,dur):
    m=int(dur*SR); t=np.arange(m)/SR
    x=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*2*f*t)+0.15*ss.square(2*np.pi*f*t)
    return x*np.minimum(1,t/0.004)*np.minimum(1,(dur-t)/0.02)*np.exp(-t/0.8)
rng=np.random.default_rng(1)
def kick():
    m=int(0.35*SR); t=np.arange(m)/SR; return np.sin(2*np.pi*np.cumsum(50+110*np.exp(-t/0.025))/SR)*np.exp(-t/0.16)
def snare():
    m=int(0.22*SR); t=np.arange(m)/SR; n=rng.standard_normal(m); b,a=ss.butter(2,[1500/(SR/2),9000/(SR/2)],'band')
    return ss.lfilter(b,a,n)*np.exp(-t/0.06)+0.4*np.sin(2*np.pi*190*t)*np.exp(-t/0.04)
def hat():
    m=int(0.05*SR); t=np.arange(m)/SR; n=rng.standard_normal(m); b,a=ss.butter(2,8000/(SR/2),'high'); return ss.lfilter(b,a,n)*np.exp(-t/0.012)
def shaker():
    m=int(0.08*SR); t=np.arange(m)/SR; n=rng.standard_normal(m); b,a=ss.butter(2,[5000/(SR/2),12000/(SR/2)],'band'); return ss.lfilter(b,a,n)*np.sin(np.pi*t/0.08)
def clap():
    m=int(0.2*SR); x=np.zeros(m); t=np.arange(m)/SR
    for k in (0,0.01,0.02):
        i=int(k*SR); n=rng.standard_normal(m-i); b,a=ss.butter(2,[1000/(SR/2),5000/(SR/2)],'band'); x[i:]+=ss.lfilter(b,a,n)*np.exp(-t[:m-i]/(0.012 if k<0.02 else 0.07))
    return x
def reverb(x,mix=0.18,decay=1.4):
    m=int(decay*SR); t=np.arange(m)/SR; ir=rng.standard_normal(m)*np.exp(-t/(decay/6)); b,a=ss.butter(2,3500/(SR/2)); ir=ss.lfilter(b,a,ir); ir[:int(0.012*SR)]=0
    y=ss.fftconvolve(x,ir)[:len(x)]; y/=np.max(np.abs(y))+1e-9; return x+mix*y*np.max(np.abs(x))
SCALES={'maj':[0,2,4,5,7,9,11],'min':[0,2,3,5,7,8,10]}
def build(name,root,mode,bpm,prog,bars=64,style='happy',seed=0):
    r=np.random.default_rng(seed); beat=60/bpm; n=int(bars*4*beat*SR)+2*SR
    L=np.zeros(n); R=np.zeros(n)
    def add(x,t,g=1,pan=0):
        i=int(t*SR); m=min(len(x),n-i)
        if m<=0: return
        L[i:i+m]+=x[:m]*g*(1-pan); R[i:i+m]+=x[:m]*g*(1+pan)
    sc=SCALES[mode]
    def deg(d,octv=0):
        o,k=divmod(d,7); return root+sc[k]+12*(o+octv)
    # motif (scale degrees, 8ths) per 2 bars
    motifA=[r.choice([0,2,4,7,4,2]) for _ in range(16)]
    motifB=[r.choice([4,5,7,9,7,5,4]) for _ in range(16)]
    rest_mask=r.random(16)<0.28
    for bar in range(bars):
        t0=bar*4*beat; sec=bar//8; ch=prog[bar%len(prog)]
        chord=[deg(ch),deg(ch+2),deg(ch+4)]
        intro = sec==0
        # drums
        if not intro or bar>=4:
            for b in range(4):
                if style!='tense' or b in (0,2): add(kick(),t0+b*beat,0.55 if b in (0,2) else 0.4)
                if b in (1,3): add(clap() if sec%2 else snare(),t0+b*beat,0.16,0.1)
            for k in range(8): add(hat(),t0+k*beat/2+(0.012 if k%2 else 0),0.06 if k%2 else 0.035,-0.4)
            for k in range(8): add(shaker(),t0+k*beat/2+beat/4,0.025,0.4)
            if style=='tense':
                for k in (1.5,3.5): add(kick(),t0+k*beat,0.35)
        # bass
        if bar>=2:
            pat=[(0,0.75),(1,0.5),(1.5,0.5),(2,0.75),(3,0.5),(3.5,0.5)] if style!='triumph' else [(0,1.5),(2,1),(3,1)]
            for o,d in pat:
                f=note_f(deg(ch,-2) + (12 if o in (1.5,3.5) else 0))
                add(bassn(f,d*beat*0.95),t0+o*beat,0.32)
        # plucked chords (offbeat, ukulele-ish)
        for k in range(8):
            if style=='triumph' and k%2==0: continue
            if k%2==1 or style=='tense':
                for j,nn in enumerate(chord):
                    add(ks_fast(note_f(nn+12),beat*0.9,0.993,seed=bar*31+k*7+j),t0+k*beat/2+j*0.008,0.10,0.3*(j-1))
        # pad
        if style!='happy' or sec>=2:
            add(pad([note_f(x) for x in chord],4*beat),t0,0.16 if style!='triumph' else 0.12)
        if style=='triumph':
            add(brass([note_f(x+12) for x in chord],beat*1.6),t0,0.20); add(brass([note_f(x+12) for x in chord],beat*0.9),t0+2.5*beat,0.15)
        # lead melody in sections 1..: marimba / bell
        if sec>=1 and not (sec==4 and bar%8>=6):
            mot=motifA if (bar//2)%2==0 else motifB
            half=(bar%2)*8
            for k in range(8):
                if rest_mask[(half+k)%16]: continue
                dg=mot[half+k]
                # snap toward chord
                nn=deg(dg,1)
                if sec in (2,4) and k%4==0: nn=chord[k%3]+12
                inst=marimba if style!='tense' else (lambda f,d: ks_fast(f,d,0.995,seed=k))
                add(inst(note_f(nn),beat*0.9),t0+k*beat/2,0.22 if style!='tense' else 0.18,-0.15)
                if sec>=3 and k%4==0: add(bell(note_f(nn+12),1.2),t0+k*beat/2,0.07,0.2)
        # fills
        if bar%8==7 and not intro:
            for k in range(4): add(snare(),t0+3*beat+k*beat/4,0.12+0.05*k,0.1)
    mix=np.stack([reverb(L,0.10),reverb(R,0.10)],1)
    b,a=ss.butter(1,30/(SR/2),'high'); mix=ss.lfilter(b,a,mix,axis=0)
    mix/=np.max(np.abs(mix))+1e-9; mix=np.tanh(mix*1.2)/np.tanh(1.2)*0.9
    fo=int(2*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
    wf.write(f'/home/claude/emh/public/music/{name}.wav',SR,(mix*32767).astype(np.int16))
    print(name, n/SR)
which=sys.argv[1]
if which=='happy': build('m_happy',55,'maj',118,[0,4,5,3],bars=64,style='happy',seed=3)      # G major I V vi IV
if which=='tense': build('m_tense',57,'min',124,[0,5,3,4],bars=64,style='tense',seed=5)      # A minor i VI iv v
if which=='triumph': build('m_triumph',50,'maj',108,[0,3,4,0,5,3,4,4],bars=40,style='triumph',seed=7)  # D major
