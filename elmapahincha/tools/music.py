import numpy as np, scipy.signal as ss, scipy.io.wavfile as wf
SR=48000; rng=np.random.default_rng(3)
BPM=122; beat=60/BPM; bars=32; n=int(bars*4*beat*SR)+SR
L=np.zeros(n); R=np.zeros(n)
def env(m,a,d): t=np.arange(m)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def bp(x,lo,hi,o=2): b,a=ss.butter(o,[lo/(SR/2),hi/(SR/2)],'band'); return ss.lfilter(b,a,x)
def add(x,t,g=1.0,pan=0.0):
    i=int(t*SR); m=min(len(x),n-i)
    L[i:i+m]+=x[:m]*g*(1-pan)/1; R[i:i+m]+=x[:m]*g*(1+pan)/1
def bombo():
    m=int(0.5*SR); t=np.arange(m)/SR
    return np.sin(2*np.pi*np.cumsum(55+90*np.exp(-t/0.03))/SR)*env(m,0.001,0.22)+0.3*bp(rng.standard_normal(m),100,900)*env(m,0.0005,0.03)
def snare():
    m=int(0.25*SR); t=np.arange(m)/SR
    return bp(rng.standard_normal(m),1200,8000)*env(m,0.0005,0.07)+0.5*np.sin(2*np.pi*200*t)*env(m,0.0005,0.04)
def hat(o=False):
    m=int((0.25 if o else 0.06)*SR); return bp(rng.standard_normal(m),7000,16000)*env(m,0.0003,0.12 if o else 0.018)
def clap():
    m=int(0.2*SR); x=np.zeros(m)
    for k in (0,0.009,0.018): i=int(k*SR); s=bp(rng.standard_normal(m-i),1000,5000)*env(m-i,0.0003,0.012 if k<0.018 else 0.06); x[i:]+=s
    return x
def bass(f,dur):
    m=int(dur*SR); t=np.arange(m)/SR
    x=ss.sawtooth(2*np.pi*f*t)*0.6+np.sin(2*np.pi*f*t)
    b,a=ss.butter(2,900/(SR/2)); x=ss.lfilter(b,a,x)
    return x*np.minimum(1,t/0.005)*np.minimum(1,(dur-t)/0.02)
def stab(fs,dur):
    m=int(dur*SR); t=np.arange(m)/SR; x=np.zeros(m)
    for f in fs:
        for det in (-0.004,0,0.004): x+=ss.sawtooth(2*np.pi*f*(1+det)*t)
    b,a=ss.butter(2,2600/(SR/2)); x=ss.lfilter(b,a,x)
    return x*env(m,0.004,dur*0.45)
root=[110,110,98,82.4]  # A A G E
chords=[[220,277.2,329.6],[220,277.2,329.6],[196,246.9,293.7],[164.8,207.7,246.9]]
for bar in range(bars):
    t0=bar*4*beat; section = bar//8
    # bombo hinchada pattern: 1, 2&, 3, 4
    for b in (0,1.5,2,3):
        add(bombo(),t0+b*beat,0.9)
    if section>=1:
        for b in (1,3): add(snare(),t0+b*beat,0.45,0.1)
        for k in range(8): add(hat(k%2==1 and k==7),t0+k*beat/2,0.18 if k%2 else 0.12,-0.3)
    if section>=2:
        for b in (1,3): add(clap(),t0+b*beat,0.35,-0.15)
        for k in range(16):
            if k%4==3: add(snare(),t0+k*beat/4,0.12,0.2)
    if section!=0 or bar>=4:
        r=root[bar%4]
        for k,(o,d) in enumerate([(0,0.5),(0.75,0.25),(1,0.5),(1.5,0.5),(2.5,0.5),(3,0.25),(3.5,0.5)]):
            add(bass(r*(2 if k==4 else 1),d*beat*0.9),t0+o*beat,0.35)
    if section>=2 and bar%2==0:
        add(stab(chords[bar%4],0.6),t0,0.12,0.25); add(stab(chords[bar%4],0.4),t0+2.5*beat,0.09,-0.25)
mix=np.stack([L,R],1); mix/=np.max(np.abs(mix))+1e-9; mix*=0.85
fade=int(1.0*SR); mix[-fade:]*=np.linspace(1,0,fade)[:,None]
wf.write('/home/claude/emh/public/music/hinchada.wav',SR,(mix*32767).astype(np.int16))
print('dur',n/SR)
