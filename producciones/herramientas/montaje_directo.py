import json, numpy as np, wave, sys, subprocess
V='/tmp/claude-0/-home-user/f756b46d-58a2-5fee-8b5f-41036dcf947b/scratchpad/voz/lineas'
P='/home/user/video-cumbre'
dur=json.load(open(f'{V}/duraciones.json'))
PRE, POST = 0.15, 0.35
voz=[]  # (id, inicio)
def bloque(ids, minimo=0.0):
    global t
    ini=t; rel=[]
    for i in ids:
        rel.append(round(t-ini,3)); voz.append((i, t+PRE)); t+=PRE+dur[i]+POST
    d=max(t-ini, minimo); t=ini+d
    return {'start': round(ini,3), 'dur': round(d,3), 'fases': rel}
t=0.0
T={}
T['gancho']=bloque(['g1','g2','g3'])
T['portada']=bloque(["por"], 5)
T['ponentes']=[bloque([p], 4) for p in ('p1','p2','p3','p4')]
T['panel']=bloque(['pan'], 4)
T['patro']=bloque(["pat"], 6.5)
T['ben']=bloque(['ben','b1','b2','b3'])
T['paq']=bloque(["paq"], 9)
T['fin']=bloque(["fin"], 9)
T['total']=round(t+0.3,3)
open(f'{P}/src/tiempos.ts','w').write('// Generado desde la duración real de cada frase de la locución\nexport const T = '+json.dumps(T, indent=1)+' as const;\n')
print(json.dumps({k:(v if k=='total' else (v['start'] if isinstance(v,dict) else [x['start'] for x in v])) for k,v in T.items()}))
SR=48000; N=int(SR*T['total'])
# ---- pista de voz
VL=np.zeros((N,2))
for i,ini in voz:
    w=wave.open(f'{V}/{i}.wav'); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,2).astype(float)/32768
    k=int(ini*SR); VL[k:k+len(a)]+=a[:N-k]
# ---- efectos limpios (sin ruido)
E=np.zeros((N,2))
def add(s,ti,g=1.0,pan=0.0):
    k=int(ti*SR); s=s[:max(0,N-k)]*g; E[k:k+len(s),0]+=s*np.sqrt(.5*(1-pan)); E[k:k+len(s),1]+=s*np.sqrt(.5*(1+pan))
def tt(d): return np.arange(int(d*SR))/SR
def barrido(d=0.35,f0=300,f1=1400):  # transición tonal, sin ruido
    x=tt(d); f=f0+(f1-f0)*(x/d)**2; env=np.sin(np.pi*x/d)**2
    return 0.25*(np.sin(2*np.pi*np.cumsum(f)/SR)+0.4*np.sin(4*np.pi*np.cumsum(f)/SR))*env
def golpe(g=1.0):
    x=tt(0.9); f=45+70*np.exp(-x*12); return g*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*4.5)
def pop(g=0.4):
    x=tt(0.14); f=700+800*np.exp(-x*40); return g*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*26)
def tick(f=1700,g=0.3):
    x=tt(0.07); return g*np.sin(2*np.pi*f*x)*np.exp(-x*60)
def brillo(d=1.1,g=0.2):
    x=tt(d); return g*sum(np.sin(2*np.pi*fr*x)*np.exp(-x*(3+k)) for k,fr in enumerate((1568,2093,2637,3136)))
escenas=[T['gancho'],T['portada'],*T['ponentes'],T['panel'],T['patro'],T['ben'],T['paq'],T['fin']]
for e in escenas[1:]: add(barrido(),e['start']-0.3,0.8); add(golpe(0.55),e['start']+0.1)
g=T['gancho']; add(brillo(1.3),0.0)
for r in g['fases'][1:]: add(barrido(0.3,500,1800),g['start']+r-0.2,0.6)
add(golpe(0.9),g['start']+g['fases'][2]+0.3); add(brillo(1.2),g['start']+g['fases'][2]+0.45)
for k in range(4): add(pop(0.35),g['start']+g['fases'][1]+0.35+k*0.3)
for p in T['ponentes']: add(brillo(0.9,0.15),p['start']+0.1); add(pop(0.35),p['start']+0.55)
pt=T['patro']['start']
for k in range(3): add(barrido(0.6,200,900),pt+0.4+k*0.2,0.4,(-0.6,0.6,-0.6)[k])
b=T['ben']
for r in b['fases'][1:]:
    add(golpe(0.5),b['start']+r)
    for k in range(4): add(tick(1500+k*120),b['start']+r+(10+k*9)/30)
q=T['paq']['start']; add(pop(0.45),q+0.3); add(pop(0.45),q+0.55); add(brillo(1.3,0.22),q+0.6)
f=T['fin']['start']; add(golpe(0.8),f+0.4); add(brillo(1.5),f+0.4)
E/=max(1e-9,np.abs(E).max())
mix=VL+E*0.16
def guardar(x,ruta):
    x=x/max(1e-9,np.abs(x).max())*0.9
    w=wave.open(ruta,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes()); w.close()
guardar(VL,f'{P}/public/audio/voz-directo.wav'); guardar(E,f'{P}/public/audio/efectos-directo-limpios.wav'); guardar(mix,f'{P}/public/audio/mezcla-directo-raw.wav')
subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',f'{P}/public/audio/mezcla-directo-raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000',f'{P}/public/audio/mezcla-directo.wav'],check=True)
print('total',T['total'])
