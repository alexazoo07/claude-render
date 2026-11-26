import numpy as np
from PIL import Image, ImageFilter
N=2048; rng=np.random.default_rng(7)
y,x=np.mgrid[0:N,0:N]/N*2*np.pi
def pnoise(oct_):
    f=np.zeros((N,N))
    for o in range(oct_):
        k=2**o
        for _ in range(6):
            a,b=rng.integers(-3*k,3*k+1,2)
            if a==0 and b==0: continue
            f+=np.sin(a*x+b*y+rng.uniform(0,6.28))/(k**1.1)
    return f/np.abs(f).max()
n1=pnoise(4); n2=pnoise(5)
# ripple lines: thin bright crests
cr=np.abs(np.sin(n1*7.0+n2*2.0))
lines=np.clip(1-cr/0.06,0,1)**1.5
# soft cells (caustic-like)
cells=np.clip(1-np.abs(np.sin(n2*5.0+n1))/0.25,0,1)
base=np.array([22,72,128],float)   # deep
light=np.array([46,112,178],float)
t=(n1*0.5+0.5)*0.55+ (n2*0.5+0.5)*0.45
img=base[None,None,:]*(1-t[...,None])+light[None,None,:]*t[...,None]
img+=cells[...,None]*np.array([10,22,30])*0.5
img+=lines[...,None]*np.array([70,110,140])*0.55
img=np.clip(img,0,255).astype(np.uint8)
im=Image.fromarray(img).filter(ImageFilter.GaussianBlur(1.0))
im.save('public/tex/ocean.png'); print('ok')
