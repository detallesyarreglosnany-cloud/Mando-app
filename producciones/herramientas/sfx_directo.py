import sys, numpy as np, wave
sys.argv=[sys.argv[0],'A','/dev/null']
src=open('/tmp/claude-0/-home-user/f756b46d-58a2-5fee-8b5f-41036dcf947b/scratchpad/scripts/sfx_cumbre.py').read()
exec(src[:src.index('# ---- cuerpo común')].replace("DUR=86.0 if ver=='A' else 84.0","DUR=68.0"))
add(brillo(1.4),0.0); add(golpe(0.6),0.27); add(golpe(0.6),0.53); add(tick(),1.0)
add(whoosh(),3.35,0.6)
for i in range(4): add(pop(0.45),3.93+i*0.3)
add(dron(3.0),7.0); add(golpe(0.9),7.27); add(golpe(0.9),7.47); add(brillo(1.4),7.47)
add(whoosh(),9.75,0.6); add(golpe(0.6),10.07); add(golpe(0.6),10.2)
for t in (10.87,11.07,11.27): add(pop(0.4),t)
for t in (14,18,22,26): add(whoosh(0.5),t-0.25,0.7); add(golpe(0.7),t+0.1); add(brillo(1.0,0.18),t+0.07); add(pop(0.4),t+0.53)
add(whoosh(),29.75,0.6); add(golpe(0.7),30.1)
for i in range(4): add(pop(0.35),30.13+i*0.1)
add(whoosh(),32.75,0.6); add(golpe(0.7),33.2)
for k in range(3): add(whoosh(0.8),33.4+k*0.2,0.35,(-0.6,0.6,-0.6)[k])
add(tick(1400,0.5),38.5)
add(whoosh(),41.75,0.6); add(golpe(0.6),42.13)
for k in range(3):
    t=42+k*4.2; add(golpe(0.7),t+0.02); add(whoosh(0.4),t-0.2,0.5)
    for i in range(4): add(tick(1500+i*120,0.35),t+(10+i*9)/30)
add(whoosh(),54.75,0.6); add(golpe(0.7),55.27); add(golpe(0.7),55.53); add(tick(),56.0)
add(whoosh(),60.75,0.6); add(golpe(1.0),61.4); add(brillo(1.6),61.4); add(pop(0.5),62.0)
x=np.stack([L,R],1); x/=max(1e-9,np.abs(x).max()); x*=0.89
fade=np.ones(N); n=int(0.8*SR); fade[-n:]=np.linspace(1,0,n); x*=fade[:,None]
with wave.open('/home/user/video-cumbre/public/audio/efectos-directo.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print('ok')
