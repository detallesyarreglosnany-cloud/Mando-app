import sys, numpy as np, wave
sys.argv=[sys.argv[0],'A','/dev/null']
src=open('/tmp/claude-0/-home-user/f756b46d-58a2-5fee-8b5f-41036dcf947b/scratchpad/scripts/sfx_cumbre.py').read()
defs=src[:src.index('# ---- cuerpo común')]
exec(defs.replace("DUR=86.0 if ver=='A' else 84.0","DUR=54.0"))
add(brillo(1.4),0.0); add(golpe(0.6),0.13); add(golpe(0.6),0.33)
for t in (1.33,1.6,1.87): add(pop(0.45),t)
for t in (5,10,15,20): add(whoosh(0.5),t-0.25,0.7); add(pop(0.4),t+0.47); add(whoosh(0.4),t+4.75,0.5)
add(whoosh(),24.75,0.6); add(golpe(0.7),25.13); add(pop(0.4),25.8)
add(whoosh(),27.75,0.6); add(golpe(0.6),28.27); add(golpe(0.6),28.4)
for k in range(3): add(whoosh(0.8),28.47+k*0.2,0.35,(-0.6,0.6,-0.6)[k])
add(whoosh(),37.75,0.6); add(golpe(0.7),38.0)
for i in range(7): add(tick(1600+i*80,0.35),38.6+i*0.267)
for t in (40.67,40.93): add(pop(0.5),t)
add(whoosh(),46.75,0.6); add(golpe(1.0),47.33); add(brillo(1.6),47.33); add(pop(0.5),48.07)
x=np.stack([L,R],1); x/=max(1e-9,np.abs(x).max()); x*=0.89
fade=np.ones(N); n=int(0.8*SR); fade[-n:]=np.linspace(1,0,n); x*=fade[:,None]
with wave.open('/home/user/video-cumbre/public/audio/efectos-sencilla.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
print('ok')
