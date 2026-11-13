import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';
import T from './tiempos59.json';

// Video "Cumbre Amazonas 2026 · Patrocinadores", versión dinámica de 57 s: zoom satelital rápido hasta Club Parapata,
// cortes al pulso de la música (120 BPM) y animaciones clavadas a la voz. Todos los tiempos salen de tiempos59.json
// (gen_tiempos59.py), que también usa la mezcla de audio (mezcla59.py).
const V = T.V;
export const DURACION_59 = T.DUR;
const E = T.E as unknown as Record<'intro' | 'pilares' | 'red' | 'patro' | 'invita' | 'web' | 'cierre', readonly [number, number]>;
const ATRIBUCION = 'Imágenes: Sentinel-2 cloudless — s2maps.eu, EOX IT Services GmbH (contiene datos modificados de Copernicus Sentinel 2016), CC BY 4.0 · Relieve: producido con Copernicus WorldDEM-30 © DLR e.V. 2010-2014 y © Airbus Defence and Space GmbH 2014-2018, provisto bajo COPERNICUS por la Unión Europea y la ESA';

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.08, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);

const Particulas: React.FC<{k: number}> = ({k}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		{new Array(70).fill(0).map((_, i) => {
			const ang = random(`a${i}`) * Math.PI * 2, vel = 18 + random(`v${i}`) * 34;
			const d = vel * k * (1 - k / 80);
			const o = interpolate(k, [0, 6, 40], [0, 1, 0], clamp);
			const s = 4 + random(`s${i}`) * 8;
			return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * d, top: 900 + Math.sin(ang) * d, width: s, height: s, borderRadius: s, background: i % 3 ? C.oro : '#fff', opacity: o, boxShadow: `0 0 ${s * 3}px ${C.oro}`}} />;
		})}
	</AbsoluteFill>
);

// ---------------------------------------------------------------- 1. LLEGADA: zoom satelital en 3,5 s + Club Parapata
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const N_SAT = 600;
// cuadro satelital (0..599) para un tiempo t en segundos: arranque suave, caída acelerada hasta el Orinoco,
// salto con barrido a la toma final de Puerto Ayacucho y asentamiento
const fuente = (t: number) => {
	if (t < 0.35) return lerp(0, 6, t / 0.35);
	if (t < 2.95) return lerp(6, 226, Easing.inOut(Easing.quad)((t - 0.35) / 2.6));
	return lerp(540, 599, Easing.out(Easing.cubic)(Math.min(1, (t - 2.95) / 0.55)));
};
const cuadroSat = (i: number) => staticFile(`sat59/${String(Math.max(0, Math.min(N_SAT - 1, Math.round(i))) + 1).padStart(4, '0')}.jpg`);
const Estela: React.FC<{t: number}> = ({t}) => ( // 6 submuestras por cuadro = desenfoque de movimiento real
	<>{[0, 1, 2, 3, 4, 5].map((j) => <Img key={j} src={cuadroSat(fuente(t + j / 180))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 / (j + 1)}} />)}</>
);
const ALT = (t: number) => { // altitud aproximada que marca el instrumento
	const km = Math.exp(lerp(Math.log(19000), Math.log(4), Easing.inOut(Easing.quad)(Math.min(1, t / T.GOLPE))));
	return km >= 100 ? `${Math.round(km / 10) * 10}` : km.toFixed(1);
};
const Llegada: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30;
	const k = f - S(T.EX), g = f - S(T.GOLPE);
	const fondo = k >= 0 ? interpolate(k, [0, 12], [1, 0.35], clamp) : 1;
	const vel = interpolate(t, [0.3, 1.2, 2.9, 3.3], [0, 1, 1, 0], clamp); // intensidad de la caída
	const salto = interpolate(t, [2.85, 2.95, 3.1], [0, 1, 0], clamp); // barrido del corte
	const zoomSalto = t < 2.95 ? interpolate(t, [2.7, 2.95], [1, 2.6], {...clamp, easing: Easing.in(Easing.cubic)}) : interpolate(t, [2.95, 3.5], [0.55, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
	const empuje = g >= 0 ? interpolate(g, [0, 40], [1, 1.07], clamp) : 1;
	const tiembla = g >= 0 && g < 10 ? `translate(${(random(`tx${g}`) - 0.5) * 36 * (1 - g / 10)}px, ${(random(`ty${g}`) - 0.5) * 36 * (1 - g / 10)}px)` : '';
	return (
		<AbsoluteFill style={{background: '#01040D'}}>
			<AbsoluteFill style={{opacity: fondo, filter: k >= 0 ? `blur(${interpolate(k, [0, 12], [0, 8], clamp)}px)` : salto > 0 ? `blur(${salto * 14}px) brightness(${1 + salto * 0.6})` : undefined, transform: `${tiembla} scale(${zoomSalto * empuje})`}}>
				<Estela t={Math.min(t, 3.6)} />
			</AbsoluteFill>
			{k < 0 && (
				<>
					{/* líneas de velocidad */}
					<AbsoluteFill style={{opacity: vel * 0.8, background: `repeating-conic-gradient(from ${f * 1.7}deg at 50% 50%, transparent 0deg, rgba(160,220,255,0.16) 0.5deg, transparent 1.3deg 6.5deg)`, WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 22%, #000 78%)', maskImage: 'radial-gradient(circle at 50% 50%, transparent 22%, #000 78%)', mixBlendMode: 'screen'}} />
					<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(1,4,13,0.75) 100%)'}} />
					{/* instrumentos */}
					<div style={{position: 'absolute', left: 60, top: 470, fontFamily: 'monospace', fontSize: 30, lineHeight: 1.5, color: C.celeste, opacity: interpolate(f, [2, 8], [0, 0.95], clamp) * (g >= 0 ? interpolate(g, [0, 6], [1, 0], clamp) : 1), textShadow: '0 2px 8px #000'}}>
						<div>ALT <b style={{color: C.blanco}}>{ALT(t)}</b> KM</div>
						<div>{lerp(2, 5.6663, Math.min(1, t / T.GOLPE)).toFixed(4)}° N · {lerp(63, 67.6283, Math.min(1, t / T.GOLPE)).toFixed(4)}° O</div>
					</div>
					<div style={{position: 'absolute', right: 60, top: 470, textAlign: 'right', fontFamily: F.texto, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: C.oro, opacity: interpolate(f, [2, 8], [0, 0.95], clamp) * (g >= 0 ? interpolate(g, [0, 6], [1, 0], clamp) : 1), textShadow: '0 2px 8px #000'}}>
						<div>● DESTINO</div><div style={{color: C.blanco}}>AMAZONAS · VENEZUELA</div>
					</div>
					{/* mira que se cierra sobre el destino */}
					{g < 8 && (() => {
						const r = interpolate(t, [0.2, T.GOLPE], [470, 70], {...clamp, easing: Easing.in(Easing.quad)});
						return (
							<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: interpolate(f, [2, 10], [0, 0.9], clamp) * (g >= 0 ? interpolate(g, [0, 8], [1, 0], clamp) : 1)}}>
								<circle cx={540} cy={960} r={r} fill="none" stroke={C.oro} strokeWidth={3} strokeDasharray="60 26" transform={`rotate(${f * 4} 540 960)`} />
								<circle cx={540} cy={960} r={r * 0.72} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.6} transform={`rotate(${-f * 3} 540 960)`} strokeDasharray="8 14" />
								{[0, 90, 180, 270].map((a) => <line key={a} x1={540} y1={960 - r - 26} x2={540} y2={960 - r + 26} stroke={C.oro} strokeWidth={4} transform={`rotate(${a} 540 960)`} />)}
							</svg>
						);
					})()}
					{/* rótulos que pasan volando hacia la cámara */}
					{(T.rotulos as [string, number, number][]).map(([txt, a, b]) => {
						if (t < a || t > b + 0.1) return null;
						const p = (t - a) / (b - a);
						return (
							<AbsoluteFill key={txt} style={{justifyContent: 'center', alignItems: 'center', top: -220}}>
								<Txt size={txt.length > 12 ? 104 : 150} color={txt === 'PUERTO AYACUCHO' ? C.oro : C.blanco} style={{opacity: interpolate(p, [0, 0.12, 0.75, 1.05], [0, 1, 1, 0], clamp), transform: `scale(${interpolate(p, [0, 0.18, 0.8, 1.05], [0.5, 1, 1.12, 2.4], clamp)})`, letterSpacing: interpolate(p, [0, 1], [2, 10]), filter: `blur(${interpolate(p, [0.8, 1.05], [0, 10], clamp)}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.9)'}}>{txt}</Txt>
							</AbsoluteFill>
						);
					})}
					{/* ¡PAM! llegada a la sede */}
					{g >= 0 && (
						<>
							{[0, 5].map((d) => { const q = g - d; return q >= 0 ? <div key={d} style={{position: 'absolute', left: 540, top: 880, width: 0, height: 0}}><div style={{position: 'absolute', left: -q * 34, top: -q * 34, width: q * 68, height: q * 68, borderRadius: '50%', border: `${Math.max(1, 10 - q * 0.5)}px solid ${C.oro}`, opacity: interpolate(q, [0, 20], [0.9, 0], clamp)}} /></div> : null; })}
							<svg width={150} height={200} viewBox="0 0 24 32" style={{position: 'absolute', left: 540 - 75, top: 880 - 200, transform: `translateY(${interpolate(spring({frame: g, fps: 30, config: {damping: 9, stiffness: 220, mass: 0.6}}), [0, 1], [-900, 0])}px)`, filter: `drop-shadow(0 0 30px ${C.oro})`}}>
								<path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0zm0 16.5a4.6 4.6 0 1 1 0-9.2 4.6 4.6 0 0 1 0 9.2z" fill={C.oro} stroke="#fff" strokeWidth={0.6} />
							</svg>
							<AbsoluteFill style={{alignItems: 'center', top: 940, gap: 10}}>
								<Txt size={40} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 12, opacity: entra(g, 2, 4)}}>LA SEDE</Txt>
								<Txt size={168} color={C.oro} style={{opacity: entra(g, 0, 2), transform: `scale(${golpe(g, 0, 2.6)})`, textShadow: `0 0 60px ${C.oro}99, 0 8px 30px rgba(0,0,0,0.9)`, lineHeight: 0.98}}>CLUB<br />PARAPATA</Txt>
								<div style={{marginTop: 18, opacity: entra(g, 8, 4), transform: `scale(${golpe(g, 8, 1.5)})`}}><Pildora size={40} fondo={C.blanco} color={C.marino}>VIERNES 4 DIC · 2:00 PM</Pildora></div>
							</AbsoluteFill>
						</>
					)}
					<div style={{position: 'absolute', left: 30, right: 30, bottom: 22, fontFamily: F.texto, fontWeight: 500, fontSize: 13, lineHeight: 1.35, color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px #000'}}>{ATRIBUCION}</div>
				</>
			)}
			{k >= 0 && (
				<>
					<Brillos semilla="ex" n={30} />
					<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 6, padding: '0 50px'}}>
						<Txt size={46} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 10, opacity: entra(k, 2, 4)}}>CUMBRE DE</Txt>
						<Txt size={132} style={{opacity: entra(k, 0, 2), transform: `scale(${golpe(k, 0, 2.2)})`}}>TRANSFORMACIÓN</Txt>
						<Txt size={132} color={C.oro} style={{opacity: entra(k, 3, 2), transform: `scale(${golpe(k, 3, 2.2)})`, textShadow: `0 0 50px ${C.oro}88, ${sombra}`}}>EMPRESARIAL</Txt>
						<div style={{marginTop: 22, opacity: entra(k, 10, 5), transform: `scale(${golpe(k, 10, 1.5)})`}}><Pildora fondo={C.azul} color={C.blanco} size={44}>AMAZONAS 2026</Pildora></div>
					</AbsoluteFill>
					<Particulas k={k} />
				</>
			)}
			<Destello en={S(2.93)} dur={6} max={0.55} color="#CFEAFF" />
			<Destello en={S(T.GOLPE)} dur={8} max={0.75} color="#FFF6D8" />
			<Destello en={S(T.EX)} dur={14} max={1} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 2. PILARES + LO QUE TE LLEVAS
const Pilares: React.FC = () => {
	const f = useCurrentFrame();
	const base = E.pilares[0];
	const r = (s: number) => f - S(s - base);
	const golpes: [string, number, string, number][] = [['LIDERA', T.pilares[0], C.azul, 300], ['VENDE', T.pilares[1], C.celeste, 400], ['CRECE', T.pilares[2], C.oro, 520]];
	const fase2 = r(V.v04) >= 0;
	const items: [string, string, number][] = [['👥', 'Capacita a tu equipo', T.items[0]], ['📋', 'Organiza tu negocio', T.items[1]], ['⭐', 'Posiciona tu marca', T.items[2]]];
	const kPapel = r(T.papel);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pil" n={22} />
			{!fase2 && (
				<>
					<AbsoluteFill style={{alignItems: 'center', top: 210, gap: 16}}>
						<Txt size={36} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 6)}}>CLUB PARAPATA · PUERTO AYACUCHO</Txt>
						<div style={{display: 'flex', gap: 16, opacity: entra(f, 6, 6), transform: `translateY(${sube(f, 6, 30)}px)`}}>
							<Pildora size={34}>VIERNES 4 DE DICIEMBRE</Pildora>
							<Pildora size={34} fondo={C.azul} color={C.blanco}>2:00 PM</Pildora>
						</div>
						<Txt size={56} font={F.texto} peso={800} style={{marginTop: 70, opacity: entra(f, 12, 8), padding: '0 80px'}}>Tres pilares para tu negocio</Txt>
					</AbsoluteFill>
					<div style={{position: 'absolute', left: 90, right: 90, bottom: 260, height: 600, display: 'flex', alignItems: 'flex-end', gap: 26}}>
						{golpes.map(([w, s, col, h]) => {
							const k = r(s);
							const alto = interpolate(spring({frame: k, fps: 30, config: {damping: 13, stiffness: 160}}), [0, 1], [0, h]);
							return (
								<div key={w} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
									<Txt size={84} color={col === C.oro ? C.oro : C.blanco} style={{opacity: entra(k, 0, 3), transform: `scale(${golpe(k, 0, 1.8)})`, marginBottom: 14}}>{w}</Txt>
									<div style={{width: '100%', height: alto, borderRadius: '18px 18px 0 0', background: col, boxShadow: `0 0 40px ${col}88`}} />
								</div>
							);
						})}
					</div>
					{golpes.map(([w, s]) => <Destello key={w} en={S(s - base)} dur={6} max={0.35} color={C.celeste} />)}
				</>
			)}
			{fase2 && (
				<AbsoluteFill style={{alignItems: 'center', top: 230, gap: 34}}>
					<Txt size={44} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 8, opacity: entra(r(V.v04), 0, 5)}}>LO QUE TE LLEVAS</Txt>
					{items.map(([ico, txt, s], i) => {
						const k = r(s);
						return (
							<div key={txt} style={{width: 900, display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(255,255,255,0.08)', border: `2px solid ${C.celeste}55`, borderRadius: 26, padding: '24px 34px', opacity: entra(k, 0, 4), transform: `translateX(${interpolate(k, [0, 10], [i % 2 ? 300 : -300, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`}}>
								<span style={{fontSize: 64, fontFamily: 'Noto Color Emoji, sans-serif'}}>{ico}</span>
								<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 52, color: C.blanco}}>{txt}</span>
							</div>
						);
					})}
					{/* Del papel y el Excel… a tu teléfono */}
					<div style={{marginTop: 20, width: 900, height: 560, position: 'relative', opacity: entra(kPapel, 0, 4)}}>
						<Txt size={50} font={F.texto} peso={900} color={C.oro} style={{position: 'absolute', left: 0, right: 0, top: 0}}>Del papel y el Excel… a tu teléfono</Txt>
						{new Array(6).fill(0).map((_, j) => {
							const m = interpolate(kPapel, [10 + j * 2, 26 + j * 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
							return <div key={j} style={{position: 'absolute', left: 250 + j * 26 + (450 - 250 - j * 26) * m, top: 130 + j * 22 + (150 - 130 - j * 22) * m, width: 300 - 100 * m, height: 380 * (1 - m) + 20, background: j === 5 ? '#E8F5E9' : '#F4F1E8', borderRadius: 8, transform: `rotate(${(j - 2.5) * 5 * (1 - m)}deg)`, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', opacity: 1 - m}} />;
						})}
						{(() => {
							const m = interpolate(kPapel, [22, 32], [0, 1], clamp);
							return (
								<div style={{position: 'absolute', left: 340, top: 110, width: 220, height: 420, borderRadius: 34, background: '#0B1220', border: `5px solid ${C.oro}`, opacity: m, transform: `scale(${interpolate(m, [0, 1], [0.6, 1])})`, boxShadow: `0 0 50px ${C.oro}88`, padding: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
									{['Ventas', 'Inventario', 'Finanzas', 'Clientes'].map((x, j) => <div key={x} style={{background: j % 2 ? C.azul : C.celeste, borderRadius: 10, height: 58, fontFamily: F.texto, fontWeight: 800, fontSize: 22, color: C.blanco, display: 'flex', alignItems: 'center', paddingLeft: 12, opacity: entra(kPapel, 30 + j * 3, 3)}}>{x}</div>)}
								</div>
							);
						})()}
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 3. PONENTES
const PONENTES = [
	{nombre: ['JOSÉ', 'RODRÍGUEZ'], frase: 'LIDERA TU EQUIPO', foto: 'img/jose-recorte.png', v: V.v05},
	{nombre: ['JUAN ERNESTO', 'SIERRA'], frase: 'ORGANIZA TUS FINANZAS', foto: 'img/juan-recorte.png', v: V.v06},
	{nombre: ['DANIELA', 'SILVA'], frase: 'TRANSFORMACIÓN DIGITAL', foto: 'img/daniela-recorte.png', v: V.v07},
	{nombre: ['TANIA', 'ALZURU'], frase: 'POSICIONA TU MARCA', foto: 'img/tania-recorte.png', v: V.v08},
];
const LIMITES_P = T.LIM;
const Ponente: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const p = PONENTES[i];
	const lado = i % 2 ? -1 : 1;
	const x = interpolate(f, [0, 12], [lado * 700, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const k = f - S(T.frases[i] - LIMITES_P[i]);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 74%, ${C.azul}AA 0%, transparent 45%)`}} />
			<div style={{position: 'absolute', left: 540 - 330, top: 920, width: 660, height: 660, borderRadius: '50%', border: `6px solid ${C.oro}`, opacity: entra(f, 2, 8), transform: `scale(${golpe(f, 2, 0.6)})`, boxShadow: `0 0 60px ${C.oro}55`}} />
			<Brillos semilla={`pp${i}`} n={16} />
			<AbsoluteFill style={{alignItems: 'center', top: 200}}>
				<Txt size={34} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 8, opacity: entra(f, 0, 4), marginBottom: 14}}>CON</Txt>
				<Txt size={110} style={{opacity: entra(f, 2, 3), transform: `scale(${golpe(f, 2, 1.4)})`, lineHeight: 1}}>{p.nombre[0]}</Txt>
				<Txt size={110} color={C.oro} style={{opacity: entra(f, 5, 3), transform: `scale(${golpe(f, 5, 1.4)})`, lineHeight: 1}}>{p.nombre[1]}</Txt>
				<div style={{marginTop: 30, opacity: entra(k, 0, 3), transform: `scale(${golpe(k, 0, 1.8)})`}}>
					<Pildora size={50}>{p.frase}</Pildora>
				</div>
			</AbsoluteFill>
			<Img src={staticFile(p.foto)} style={{position: 'absolute', bottom: 0, left: '50%', height: 1020, transform: `translateX(calc(-50% + ${x}px))`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, transparent 84%, ${C.marino} 100%)`}} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 3b. RED DE CONTACTOS
const Red: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.red[0]);
	const nodos = new Array(26).fill(0).map((_, i) => ({x: 90 + random(`nx${i}`) * 900, y: 260 + random(`ny${i}`) * 1400, d: random(`nd${i}`) * 60}));
	const palabras: [string, number, string][] = [['CONECTA', T.red[0], C.blanco], ['INTERCAMBIA', T.red[1], C.celeste], ['CONSIGUE NUEVOS CLIENTES', T.red[2], C.oro]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{nodos.map((a, i) => nodos.slice(i + 1).map((b, j) => {
					const d = Math.hypot(a.x - b.x, a.y - b.y);
					if (d > 330) return null;
					const o = interpolate(f, [a.d + b.d * 0.3, a.d + b.d * 0.3 + 14], [0, 0.55 * (1 - d / 330)], clamp);
					return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.celeste} strokeWidth={2.5} opacity={o} />;
				}))}
				{nodos.map((a, i) => <circle key={i} cx={a.x} cy={a.y} r={i % 5 ? 9 : 14} fill={i % 5 ? C.celeste : C.oro} opacity={entra(f, a.d, 8)} />)}
			</svg>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(7,26,74,0.85) 0%, rgba(7,26,74,0.2) 60%)'}} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 26, padding: '0 60px'}}>
				{palabras.map(([w, s, col]) => {
					const k = r(s);
					return <Txt key={w} size={w.length > 12 ? 92 : 128} color={col} style={{opacity: entra(k, 0, 3), transform: `scale(${golpe(k, 0, 1.7)})`}}>{w}</Txt>;
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 4. PATROCINADORES UNO POR UNO
const LOGOS = ['ferreconi', 'perfumes', 'navas', 'galaxia', 'tecnoama', 'jesus-nazareth', 'marco', 'puerto-venado', 'multiempresariales-2', 'orthosmile', 'wahari', 'delicias', 'moto-daniel', 'milsi', 'divino-nino', 'kubia', 'farma', 'casita'];
// Llegadas: empiezan pausadas y se aceleran
const LLEGA = T.logos;
const TW = 300, TH = 200, GAP = 24, TOP = 300;
const slot = (i: number) => ({x: 540 - (3 * TW + 2 * GAP) / 2 + (i % 3) * (TW + GAP), y: TOP + Math.floor(i / 3) * (TH + GAP)});
const Mosaico: React.FC<{o?: number; blur?: number}> = ({o = 1, blur = 0}) => (
	<AbsoluteFill style={{opacity: o, filter: blur ? `blur(${blur}px)` : undefined}}>
		{LOGOS.map((l, i) => { const s = slot(i); return <Img key={l} src={staticFile(`patro/${l}.webp`)} style={{position: 'absolute', left: s.x, top: s.y, width: TW, height: TH, borderRadius: 18, boxShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 10px 26px rgba(0,0,0,0.45)'}} />; })}
	</AbsoluteFill>
);
const Patrocinadores: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30 + E.patro[0];
	const kG = f - S(V.v11 - E.patro[0]);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pat" n={20} />
			<AbsoluteFill style={{alignItems: 'center', top: 120}}>
				<Txt size={40} font={F.texto} peso={900} color={C.oro} style={{letterSpacing: 9, opacity: entra(f, 0, 6), transform: `translateY(${sube(f, 0, 30)}px)`}}>PATROCINADORES OFICIALES</Txt>
			</AbsoluteFill>
			{LOGOS.map((l, i) => {
				const k = Math.round((t - LLEGA[i]) * 30);
				if (k < 0) return null;
				const s = slot(i);
				const vuelo = interpolate(k, [5, 11], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
				const grande = golpe(k, 0, 0.3);
				const W = lerp(720, TW, vuelo) * (vuelo < 1 ? grande : 1), H = W * 2 / 3;
				const cx = lerp(540, s.x + TW / 2, vuelo), cy = lerp(1000, s.y + TH / 2, vuelo);
				const brillo = interpolate(k, [0, 6], [-1.2, 1.2], clamp);
				return (
					<div key={l} style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: 18 + 20 * (1 - vuelo), overflow: 'hidden', boxShadow: `0 0 0 ${2 + 4 * (1 - vuelo)}px ${vuelo < 1 ? C.oro : 'rgba(255,255,255,0.15)'}, 0 ${10 + 20 * (1 - vuelo)}px ${26 + 30 * (1 - vuelo)}px rgba(0,0,0,0.5)`, zIndex: vuelo < 1 ? 10 : 1}}>
						<Img src={staticFile(`patro/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block'}} />
						{k < 7 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.65) 50%, transparent 62%)', transform: `translateX(${brillo * 100}%)`}} />}
					</div>
				);
			})}
			{kG >= 0 && (
				<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110}}>
					<div style={{opacity: entra(kG, 0, 6), transform: `scale(${golpe(kG, 0, 1.4)})`, textAlign: 'center'}}>
						<Txt size={46} font={F.texto} peso={900} style={{letterSpacing: 6}}>GRACIAS POR CRECER</Txt>
						<Txt size={84} color={C.oro} style={{textShadow: `0 0 40px ${C.oro}88, ${sombra}`}}>CON AMAZONAS</Txt>
					</div>
				</AbsoluteFill>
			)}
			{LLEGA.map((s, i) => <Destello key={i} en={S(s - E.patro[0])} dur={4} max={0.12} color={C.oro} />)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 5. INVITACIÓN
const Invita: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.invita[0]);
	const k1 = r(V.v12), k2 = r(T.invita2);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Mosaico o={0.22} blur={6} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(7,26,74,0.75) 0%, rgba(7,26,74,0.35) 70%)'}} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 60px', transform: `translateY(${k2 >= 0 ? interpolate(k2, [0, 12], [0, -260], {...clamp, easing: Easing.out(Easing.cubic)}) : 0}px)`}}>
				<Txt size={120} style={{opacity: entra(k1, 0, 3), transform: `scale(${golpe(k1, 0, 1.6)})`}}>TU MARCA</Txt>
				<Txt size={64} font={F.texto} peso={900} style={{opacity: entra(k1, 8, 4)}}>TAMBIÉN PUEDE SER</Txt>
				<Txt size={120} color={C.oro} style={{opacity: entra(k1, 16, 3), transform: `scale(${golpe(k1, 16, 1.6)})`, textShadow: `0 0 40px ${C.oro}88, ${sombra}`}}>PARTE DE ESTO</Txt>
			</AbsoluteFill>
			{k2 >= 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 1130, gap: 26}}>
					<div style={{opacity: entra(k2, 2, 4), transform: `scale(${golpe(k2, 2, 1.4)})`}}><Pildora size={44} fondo={C.azul} color={C.blanco}>PATROCINADOR OFICIAL</Pildora></div>
					<Txt size={68} style={{opacity: entra(k2, 14, 4), transform: `translateY(${sube(k2, 14, 30)}px)`}}>MÁXIMA VISIBILIDAD</Txt>
					<Txt size={68} color={C.oro} style={{opacity: entra(k2, 28, 4), transform: `translateY(${sube(k2, 28, 30)}px)`}}>MÁXIMA PUBLICIDAD</Txt>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 5b. SITIO WEB: tecleo, Enter, destello y la página
const DIRECCION = 'cumbre.kubiav.com';
const T_TECLEO = T.tecleo, POR_LETRA = T.por_letra, T_ENTER = T.enter;
const Web: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30 + E.web[0];
	const n = Math.max(0, Math.min(DIRECCION.length, Math.floor((t - T_TECLEO) / POR_LETRA) + 1));
	const kE = Math.round((t - T_ENTER) * 30);
	const cursor = Math.floor(t * 2.5) % 2 === 0;
	const kW = f - S(T.whatsapp - 0.7 - E.web[0]);
	const fase2 = kE >= 4;
	const scroll = fase2 ? interpolate(kE, [10, 110], [0, -1500], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="web" n={18} />
			{!fase2 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40}}>
					<Txt size={44} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 5)}}>TODA LA INFORMACIÓN EN</Txt>
					<div style={{width: 960, height: 130, borderRadius: 65, background: C.blanco, display: 'flex', alignItems: 'center', gap: 22, padding: '0 40px', boxShadow: `0 0 0 6px ${C.oro}55, 0 20px 50px rgba(0,0,0,0.5)`, opacity: entra(f, 0, 5), transform: `scale(${kE >= 0 ? interpolate(kE, [0, 2, 5], [1, 0.95, 1], clamp) : golpe(f, 0, 0.8)})`}}>
						<svg width={40} height={46} viewBox="0 0 24 28"><rect x={2} y={12} width={20} height={15} rx={3} fill="#12A150" /><path d="M6 12V8a6 6 0 0 1 12 0v4" stroke="#12A150" strokeWidth={3} fill="none" /></svg>
						<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 60, color: C.marino, letterSpacing: 0.5}}>{DIRECCION.slice(0, n)}<span style={{opacity: cursor ? 1 : 0, color: C.azul}}>|</span></span>
					</div>
				</AbsoluteFill>
			)}
			{fase2 && (
				<>
					<AbsoluteFill style={{alignItems: 'center', top: 110}}>
						<Txt size={52} font={F.texto} peso={900} color={C.oro} style={{letterSpacing: 2}}>{DIRECCION}</Txt>
					</AbsoluteFill>
					<div style={{position: 'absolute', left: 540 - 310, top: 220, width: 620, height: 1220, borderRadius: 70, background: '#0B0F18', padding: 18, boxShadow: `0 0 0 4px #2A2F3A, 0 0 80px ${C.celeste}55, 0 30px 60px rgba(0,0,0,0.6)`, transform: `scale(${golpe(kE - 4, 0, 0.7)})`}}>
						<div style={{width: '100%', height: '100%', borderRadius: 54, overflow: 'hidden', background: '#fff'}}>
							<Img src={staticFile('img/sitio-movil.png')} style={{width: '100%', transform: `translateY(${scroll}px)`}} />
						</div>
					</div>
					{kW >= 0 && (
						<AbsoluteFill style={{alignItems: 'center', top: 1500, gap: 14}}>
							<Txt size={40} font={F.texto} peso={800} style={{opacity: entra(kW, 0, 5)}}>Atención personalizada por</Txt>
							<div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#25D366', borderRadius: 80, padding: '18px 44px', opacity: entra(kW, 4, 4), transform: `scale(${golpe(kW, 4, 1.5)})`, boxShadow: '0 0 50px #25D36688'}}>
								<svg viewBox="0 0 32 32" width={70} height={70}><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.7 12.7-12.6C28.7 8.6 23 3 16 3zm0 23.2c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.5C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>
								<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 64, color: C.blanco}}>0426-761-7944</span>
							</div>
						</AbsoluteFill>
					)}
				</>
			)}
			<Destello en={S(T_ENTER - E.web[0]) + 1} dur={12} max={1} color="#FFE7A3" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 6. CIERRE
const Cierre: React.FC = () => {
	const f = useCurrentFrame();
	const r = (s: number) => f - S(s - E.cierre[0]);
	const fin = interpolate(f, [S(E.cierre[1] - E.cierre[0]) - 14, S(E.cierre[1] - E.cierre[0])], [0, 1], clamp);
	const lemas: [string, number, string][] = [['LIDERA', T.lemas[0], C.blanco], ['VENDE', T.lemas[1], C.celeste], ['CRECE', T.lemas[2], C.oro]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Mosaico o={0.18} blur={4} />
			<Brillos semilla="cie" n={28} />
			<AbsoluteFill style={{alignItems: 'center', top: 300, gap: 8}}>
				<Txt size={44} font={F.texto} peso={900} color={C.celeste} style={{letterSpacing: 10, opacity: entra(f, 2, 6)}}>CUMBRE</Txt>
				<Txt size={120} style={{opacity: entra(f, 4, 4), transform: `scale(${golpe(f, 4, 1.5)})`}}>AMAZONAS 2026</Txt>
				<div style={{display: 'flex', gap: 26, marginTop: 40}}>
					{lemas.map(([w, s, col]) => { const k = r(s); return <Txt key={w} size={96} color={col} style={{opacity: entra(k, 0, 3), transform: `scale(${golpe(k, 0, 1.8)})`}}>{w}</Txt>; })}
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1000, gap: 22}}>
				<Img src={staticFile('img/qr.png')} style={{width: 330, height: 330, background: '#fff', borderRadius: 26, padding: 18, opacity: entra(f, 10, 6)}} />
				<Txt size={50} font={F.texto} peso={900} color={C.oro} style={{opacity: entra(f, 14, 6)}}>cumbre.kubiav.com</Txt>
				<Txt size={42} font={F.texto} peso={800} style={{opacity: entra(f, 18, 6)}}>WhatsApp 0426-761-7944</Txt>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 60, right: 60, bottom: 40, fontFamily: F.texto, fontWeight: 500, fontSize: 15, lineHeight: 1.35, textAlign: 'center', color: 'rgba(255,255,255,0.6)'}}>{ATRIBUCION}</div>
			<AbsoluteFill style={{background: '#000', opacity: fin}} />
		</AbsoluteFill>
	);
};

const ESCENAS: [readonly [number, number], React.FC][] = [
	[E.intro, Llegada], [E.pilares, Pilares],
	[[LIMITES_P[0], LIMITES_P[1]], () => <Ponente i={0} />], [[LIMITES_P[1], LIMITES_P[2]], () => <Ponente i={1} />],
	[[LIMITES_P[2], LIMITES_P[3]], () => <Ponente i={2} />], [[LIMITES_P[3], LIMITES_P[4]], () => <Ponente i={3} />],
	[E.red, Red], [E.patro, Patrocinadores], [E.invita, Invita], [E.web, Web], [E.cierre, Cierre],
];

// Entrada de cada escena: golpe de acercamiento con desenfoque. Más un pulso leve en cada tiempo de la música.
const Corte: React.FC<{children: React.ReactNode; dur: number; primero?: boolean}> = ({children, dur, primero}) => {
	const f = useCurrentFrame();
	const e = primero ? 1 : interpolate(f, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const sale = primero ? 0 : interpolate(f, [dur - 3, dur], [0, 1], clamp);
	return (
		<AbsoluteFill style={{transform: `scale(${1.22 - 0.22 * e + sale * 0.1})`, filter: e < 1 || sale > 0 ? `blur(${(1 - e) * 16 + sale * 10}px)` : undefined, opacity: primero ? 1 : interpolate(f, [0, 3], [0.4, 1], clamp)}}>
			{children}
			{!primero && <Destello en={0} dur={5} max={0.3} color="#CFEAFF" />}
		</AbsoluteFill>
	);
};
const Pulso: React.FC<{children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	const t = f / 30 - T.EX;
	const fase = t >= 0 ? (t % 0.5) / 0.5 : 1;
	return <AbsoluteFill style={{transform: `scale(${1 + 0.012 * Math.exp(-fase * 5)})`}}>{children}</AbsoluteFill>;
};

export const Patro59: React.FC<{conAudio?: boolean}> = ({conAudio = true}) => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{conAudio && <Audio src={staticFile('audio/mezcla-59.wav')} />}
			<Pulso>
				{ESCENAS.map(([[a, b], Comp], i) => (
					<Sequence key={i} from={S(a)} durationInFrames={S(b) - S(a)}><Corte dur={S(b) - S(a)} primero={i === 0}><Comp /></Corte></Sequence>
				))}
			</Pulso>
		</AbsoluteFill>
	);
};
