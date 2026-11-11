import numpy as np, wave, sys
ver=sys.argv[1]; out=sys.argv[2]
SR=48000; DUR=86.0 if ver=='A' else 84.0; N=int(SR*DUR); rng=np.random.default_rng(11)
L=np.zeros(N); R=np.zeros(N)
def add(s,t,g=1.0,pan=0.0):
    i=int(t*SR); s=s[:max(0,N-i)]*g; L[i:i+len(s)]+=s*np.sqrt(.5*(1-pan)); R[i:i+len(s)]+=s*np.sqrt(.5*(1+pan))
def tt(d): return np.arange(int(d*SR))/SR
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); acc=0.
    for i in range(len(x)): acc=(1-a)*x[i]+a*acc; y[i]=acc
    return y
def ruido(d): return rng.uniform(-1,1,int(d*SR))
def whoosh(d=0.45):
    t=tt(d); x=t/d; n=ruido(d); y=lp(n,3000)-lp(n,250); return 1.5*y*np.sin(np.pi*x)**2
def golpe(g=1.0,d=1.2):
    t=tt(d); f=38+90*np.exp(-t*10); return g*(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.5)+0.25*(ruido(d)-lp(ruido(d),2000))*np.exp(-t*30))
def tick(f=1800,g=0.4):
    t=tt(0.08); return g*np.sin(2*np.pi*f*t)*np.exp(-t*60)
def pop(g=0.5):
    t=tt(0.15); f=600+900*np.exp(-t*40); return g*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*25)
def beep(f=1400,d=0.12,g=0.35):
    t=tt(d); return g*np.sign(np.sin(2*np.pi*f*t))*0.5*np.exp(-t*8)
def brillo(d=1.2,g=0.25):
    t=tt(d); return g*sum(np.sin(2*np.pi*f*t)*np.exp(-t*(3+k)) for k,f in enumerate((1568,2093,2637,3136)))
def zumbido(d=2.2):
    t=tt(d); s=0.15*np.sin(2*np.pi*110*t)+0.08*np.sin(2*np.pi*220.5*t); return s*np.minimum(1,t/0.3)*np.minimum(1,(d-t)/0.3)
def santamaria():
    d=1.3; t=tt(d); n=ruido(d); rat=(n-lp(n,1500))*(0.6+0.4*np.sign(np.sin(2*np.pi*28*t)))*np.exp(-t*2.5)
    g=np.zeros(len(t)); gg=golpe(0.9,1.0); i=int(0.9*SR); g[i:i+len(gg)]=gg[:len(t)-i]
    return 0.6*rat*np.minimum(1,t/0.05)+g
def estatica(d=1.2):
    t=tt(d); n=ruido(d); y=(lp(n,4000)-lp(n,400))*0.5; s=0.25*np.sin(2*np.pi*np.cumsum(300+250*np.sin(2*np.pi*1.5*t))/SR)
    return (y+s)*np.minimum(1,t/0.05)*np.minimum(1,(d-t)/0.1)
def sello():
    t=tt(0.3); return 0.8*(lp(ruido(0.3),600))*np.exp(-t*25)*3
def cajera():
    t=tt(1.0); return 0.3*(np.sin(2*np.pi*2637*t)+np.sin(2*np.pi*3520*t))*np.exp(-t*4)+0.3*(ruido(1.0)-lp(ruido(1.0),3000))*np.exp(-t*40)
def dron(d=3.0):
    t=tt(d); return 0.2*np.sin(2*np.pi*55*t)*(0.7+0.3*np.sin(2*np.pi*0.7*t))*np.minimum(1,t/0.5)*np.minimum(1,(d-t)/0.5)
# ---- cuerpo común
add(zumbido(2.4),0.2)
for t,f in ((0.97,1300),(1.1,1500),(1.52,1700),(1.61,1900)): add(beep(f),t)
add(golpe(0.9),2.2)
for (t0,lineas,card) in ((6,(6.8,9.2),11.6),(16,(16.8,19.4),22.4),(30,(30.6,32.6),35.0),(40,(40.8,43.4),45.6)):
    add(whoosh(),t0-0.35,0.7); add(golpe(0.8),t0)
    for t in lineas: add(tick(),t)
    add(whoosh(0.5),card-0.25,0.6); add(brillo(),card)
add(whoosh(),26.65,0.6); add(santamaria(),27.0,0.9)
for i in range(13): add(tick(2400,0.18),27.2+i*0.133)
add(whoosh(),49.65,0.6); add(golpe(1.0),50.13); add(sello(),50.13); add(golpe(0.5),51.33)
for t in (55.0,55.6,56.2): add(golpe(0.7),t)
for i in range(4): add(pop(0.4),55.67+i*0.1)
add(brillo(1.4),56.67)
if ver=='A':
    add(whoosh(),60.65,0.6); add(tick(900,0.5),61.2); add(estatica(1.3),62.8,0.7)
    add(golpe(1.0),65.2); add(brillo(1.5),65.2)
    add(whoosh(),67.65,0.6)
    for i in range(4): add(pop(0.4),68.2+i*0.1)
    add(golpe(0.8),68.87)
    for i in range(6): add(pop(0.45),69.33+i*0.3)
    add(whoosh(),74.65,0.6)
    for i in range(13): add(tick(1500+i*60,0.3),75.2+i*0.1)
    add(brillo(1.4),76.67)
    add(dron(3.4),79.0)
    for t in (79.27,80.47,81.67): add(tick(700,0.5),t)
    add(golpe(1.1),82.5); add(brillo(1.6),82.5); add(pop(0.6),83.23)
else:
    add(whoosh(),60.65,0.6)
    for i in range(4): add(pop(0.4),61.2+i*0.1)
    for i in range(4): add(sello(),61.87+i*0.133)
    for t in (65.4,66.6): add(pop(0.55),t)
    add(whoosh(),68.65,0.6); add(tick(),69.13); add(whoosh(0.5),70.6,0.8)
    add(golpe(1.1),71.4); add(cajera(),71.45)
    add(dron(6.0),75.0); add(whoosh(0.8),75.6,0.7)
    add(tick(900,0.5),76.6); add(golpe(0.6),77.8); add(brillo(1.4),79.0)
    add(golpe(1.0),81.0); add(brillo(1.6),81.0); add(pop(0.6),81.73)
x=np.stack([L,R],1); x/=max(1e-9,np.abs(x).max()); x*=0.89
fade=np.ones(N); n=int(0.8*SR); fade[-n:]=np.linspace(1,0,n); x*=fade[:,None]
with wave.open(out,'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print('ok',ver)
