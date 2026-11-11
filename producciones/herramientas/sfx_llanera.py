import numpy as np, wave, sys
SR=48000; DUR=53.0; N=int(SR*DUR); rng=np.random.default_rng(3)
L=np.zeros(N); R=np.zeros(N)
def add(s,t,g=1.0,pan=0.0):
    i=int(t*SR); s=s[:max(0,N-i)]*g; L[i:i+len(s)]+=s*np.sqrt(.5*(1-pan)); R[i:i+len(s)]+=s*np.sqrt(.5*(1+pan))
def tt(d): return np.arange(int(d*SR))/SR
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); acc=0.
    for i in range(len(x)): acc=(1-a)*x[i]+a*acc; y[i]=acc
    return y
def pluck(f,d=1.4,brillo=0.5):  # Karplus-Strong: cuerda de arpa
    n=int(SR/f); buf=rng.uniform(-1,1,n); out=np.empty(int(d*SR))
    for i in range(len(out)):
        out[i]=buf[i%n]; buf[i%n]=0.996*(brillo*buf[i%n]+(1-brillo)*buf[(i+1)%n]) if True else 0
    return out*np.exp(-tt(d)*1.2)
notas={'D4':293.7,'E4':329.6,'F#4':370,'G4':392,'A4':440,'B4':493.9,'D5':587.3,'F#5':740,'A5':880,'D6':1175}
def gliss(seq,paso=0.045,g=0.35):
    s=np.zeros(int((len(seq)*paso+1.6)*SR))
    for k,n in enumerate(seq):
        p=pluck(notas[n],1.5); i=int(k*paso*SR); s[i:i+len(p)]+=p
    return s*g
def maraca(d=0.12):
    t=tt(d); n=rng.uniform(-1,1,len(t)); y=n-lp(n,3500); return 0.5*y*np.exp(-t*35)
def whoosh(d=0.45):
    t=tt(d); x=t/d; n=rng.uniform(-1,1,len(t)); y=lp(n,2500)-lp(n,300); return 1.4*y*np.sin(np.pi*x)**2
def golpe(g=1.0):
    t=tt(0.8); f=40+80*np.exp(-t*12); return g*(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*5))
def brillo(d=1.2):
    t=tt(d); return 0.15*sum(np.sin(2*np.pi*f*t)*np.exp(-t*(3+k)) for k,f in enumerate((1760,2349,2960,3520)))
def rasgueo():
    s=np.zeros(int(1.2*SR))
    for k,f in enumerate((440,587.3,740,987.8)):
        p=pluck(f,1.0,0.6); i=int(k*0.012*SR); s[i:i+len(p)]+=p
    return 0.3*s
ARP=['D4','F#4','A4','D5','F#5','A5','D6']
add(gliss(ARP),0.0,1.0)                       # entrada: glissando de arpa
add(golpe(0.6),0.9)                           # SÁBADO
for t in (3.15,5.75,9.55,12.45,28.85,37.15,41.85): add(whoosh(),t-0.2,0.5)   # transiciones
add(pluck(notas['A5'],1.2)*0.4,4.35)          # 8:00 PM
add(golpe(0.7),6.8); add(brillo(),6.8)        # GRAN AMANECER
add(pluck(notas['D5'],1.0)*0.35,10.5)         # Bodegón
add(pluck(notas['F#5'],1.0)*0.35,13.0)        # pin
add(brillo(1.6),18.5)                         # se llena la tasca
for t,n in ((20.69,'D5'),(22.27,'F#5'),(24.54,'A5'),(26.59,'D6')):   # cada cantante
    add(golpe(0.45),t); add(pluck(notas[n],1.2)*0.45,t); add(maraca(),t+0.05,0.8,0.4); add(maraca(),t+0.2,0.6,-0.4)
add(gliss(ARP[:5],0.05,0.3),33.29)            # arpa
add(rasgueo(),33.85)                          # cuatro
for k in range(4): add(maraca(),34.6+k*0.11,0.9,(-1)**k*0.5)   # maracas
add(brillo(1.4),35.0)                         # logo Morichal
for t in (39.8,40.3,40.8): add(golpe(0.35),t); add(pluck(notas['A4'],0.8)*0.3,t)   # sombrero/botas/alpargatas
for t in (42.0,43.1,44.2): add(pluck(notas['D5'],0.8)*0.25,t)
add(golpe(0.8),46.1); add(brillo(1.6),46.1)   # GRAN AMANECER final
add(gliss(ARP,0.05,0.4),49.2)                 # ¡Arpa, maestro!
x=np.stack([L,R],1); x/=max(1e-9,np.abs(x).max()); x*=0.9
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print('ok')
