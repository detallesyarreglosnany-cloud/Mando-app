import numpy as np, wave, sys
SR=48000; DUR=30.0; N=int(SR*DUR); rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def add(sig,t,g=1.0,pan=0.0):
    i=int(t*SR); s=sig[:max(0,N-i)]*g
    L[i:i+len(s)]+=s*np.sqrt(0.5*(1-pan)); R[i:i+len(s)]+=s*np.sqrt(0.5*(1+pan))
def tt(d): return np.arange(int(d*SR))/SR
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); acc=0.0
    for i in range(len(x)): acc=(1-a)*x[i]+a*acc; y[i]=acc
    return y
def lpv(x,fcs):  # filtro pasabajos variable
    y=np.zeros_like(x); acc=0.0
    for i in range(len(x)):
        a=np.exp(-2*np.pi*fcs[i]/SR); acc=(1-a)*x[i]+a*acc; y[i]=acc
    return y
noise=lambda d: rng.uniform(-1,1,int(d*SR))
def kick(g=1.0):
    t=tt(0.45); f=45+120*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return g*np.sin(ph)*np.exp(-t*7)+0.3*g*noise(0.45)*np.exp(-t*120)
def snare():
    t=tt(0.3); return 0.5*np.sin(2*np.pi*190*t)*np.exp(-t*25)+0.7*(noise(0.3)-lp(noise(0.3),1500))*np.exp(-t*14)
def clap():
    t=tt(0.25); n=noise(0.25)-lp(noise(0.25),900); env=np.exp(-t*20)
    for d in (0.0,0.012,0.024): env+=np.exp(-np.clip(t-d,0,None)*120)*(t>=d)
    return 0.45*n*env
def hat(open_=False):
    d=0.25 if open_ else 0.06; t=tt(d); n=noise(d); return 0.25*(n-lp(n,7000))*np.exp(-t*(12 if open_ else 60))
def tom(f):
    t=tt(0.35); ff=f*(1+0.5*np.exp(-t*20)); return 0.7*np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-t*9)
def impact(g=1.0,d=2.2):
    t=tt(d); f=30+90*np.exp(-t*8); boom=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.2)
    n=noise(d); crack=(n-lp(n,2500))*np.exp(-t*25)
    tail=lp(noise(d),400)*np.exp(-t*1.8)*3
    return g*(1.1*boom+0.6*crack+0.5*tail)
def whoosh(d=0.6,up=True,g=0.8):
    t=tt(d); x=t/d; env=np.sin(np.pi*x)**2
    fcs=(300+5000*x**2) if up else (5000-4600*x)
    n=noise(d); y=lpv(n,fcs)-lp(lpv(n,fcs),200)
    return g*2.2*y*env
def riser(d=2.0,g=0.6):
    t=tt(d); x=t/d; n=noise(d); y=lpv(n,200+7000*x**3)
    tone=np.sin(2*np.pi*np.cumsum(110+330*x**2)/SR)*0.25
    return g*(1.8*y+tone)*x**2
def crowd(d=3.0,g=0.5):
    t=tt(d); n=noise(d); b=lp(n,1800)-lp(n,300)
    mod=1+0.3*np.sin(2*np.pi*3.1*t)+0.2*np.sin(2*np.pi*5.3*t+1)
    env=np.minimum(1,t/0.4)*np.exp(-np.clip(t-d*0.5,0,None)*2)
    return g*3*b*mod*env
def shine(g=0.25):
    t=tt(0.9); y=sum(np.sin(2*np.pi*f*t)*np.exp(-t*(5+k)) for k,f in enumerate((1568,2093,2637,3136)))
    return g*y/2
def chime(g=0.3):
    t=tt(1.6); return g*sum(a*np.sin(2*np.pi*f*t)*np.exp(-t*3) for f,a in ((880,1),(1320,.5),(1760,.3)))
def bass(f,d=0.45,g=0.35):
    t=tt(d); s=np.sign(np.sin(2*np.pi*f*t))*0.5+np.sin(2*np.pi*f*t)
    return g*lp(s,600)*np.exp(-t*4)
B=0.5
# ---------- MÚSICA ----------
roots=[41.2,41.2,32.7,36.7]  # Mi, Mi, Do, Re (cada 2 s)
for k in range(int(30/B)):
    t=k*B; beat=k%4
    if t<3.0: continue
    if t>=29.5: continue
    trofeo = 22.0<=t<24.0
    half = t<8.0 or trofeo
    if not half or beat%2==0: add(kick(0.9 if not trofeo else 0.5),t,0.9)
    if not half and beat in (1,3): add(clap(),t,0.8); add(snare(),t,0.5)
    if half and beat==2 and not trofeo: add(snare(),t,0.6)
    if not trofeo:
        add(hat(),t+0.25,0.8,0.3); 
        if not half: add(hat(),t,0.5,-0.3)
    r=roots[int(t//2)%4]
    if t>=8.0 and not trofeo: add(bass(r),t,1.0); add(bass(r*2,0.2,0.15),t+0.25,1.0)
# redobles antes de cada cambio
for t0 in [7.0]+[9.5+2*i for i in range(6)]+[23.0,26.5]:
    for j,f in enumerate((180,150,120,95)): add(tom(f),t0+j*0.125,0.55,(-0.4+0.25*j))
# ---------- EFECTOS ----------
add(riser(1.0,0.7),0.0)
add(whoosh(0.5,True,0.9),0.5,1,-0.7); add(whoosh(0.5,True,0.9),0.5,1,0.7)
add(impact(1.3),1.0)
add(riser(1.8,0.5),1.2)
add(impact(1.1),3.0); add(crowd(3.0,0.45),3.0)
for t in (6.0,6.5,7.0): add(impact(0.55,0.8),t)
add(whoosh(0.5),7.5)
for i in range(7):
    t=8.0+2*i; add(whoosh(0.4,True,0.8),t-0.4,1,(-0.6 if i%2==0 else 0.6)); add(impact(0.8,1.2),t); add(shine(0.18),t+0.35)
add(whoosh(0.6,False,0.7),21.6); add(chime(0.22),22.1)
add(riser(1.0,0.5),23.0); add(impact(1.2),24.0); add(crowd(3.5,0.5),24.0)
add(whoosh(0.5),26.6); add(impact(1.0),27.0)
for t in (27.4,27.8,28.2,28.6): add(impact(0.25,0.4),t)
add(impact(1.2,1.5),29.4)
# ---------- MEZCLA ----------
x=np.stack([L,R],1)
fade=np.ones(N); fn=int(0.6*SR); fade[-fn:]=np.linspace(1,0,fn); x*=fade[:,None]
x=np.tanh(x*1.2)/np.tanh(1.2)  # saturación suave
x/=np.max(np.abs(x))/0.9
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print('ok')
