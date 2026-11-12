import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';

// Video "Cumbre Amazonas 2026 · Patrocinadores": guion aprobado v3 (llegada satelital, pilares, ponentes, red,
// 18 patrocinadores uno por uno, invitación con tecleo del sitio). Tiempos en segundos, tomados de la voz real (José Manuel, ElevenLabs).
export const V = {v01: 4.6, v02: 9.7, v03: 13.2, v04: 21.0, v05: 32.0, v06: 35.2, v07: 38.8, v08: 42.0, v09: 45.4, v10: 51.5, v11: 62.6, v12: 66.8, v13: 71.8, v14: 78.2, v15: 81.4, v16: 84.6};
export const DURACION_PATRO = 91.0;
const EXPLOTA = 9.6;
// Escenas: [inicio, fin]
const E = {intro: [0, 13.0], pilares: [13.0, 31.7], ponentes: [31.7, 45.2], red: [45.2, 51.2], patro: [51.2, 66.6], invita: [66.6, 78.0], web: [78.0, 84.4], cierre: [84.4, DURACION_PATRO]} as const;

// Cuando llegue el recorrido de Google Earth Studio (cuadros JPG 1080x1920), se pone aquí la carpeta dentro de public/
// y la cantidad de cuadros; reemplaza al mapa animado provisional.
// Fondo tras la explosión: último cuadro del recorrido satelital (proyecto amazonas-intro). El recorrido en sí se
// antepone como video aparte (ver producciones/amazonas-intro, modo 'patrocinio').
const SATELITE = {fondo: 'satelite/final.jpg'} as {fondo: string} | null;

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.08, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);
const rel = (f: number, s: number) => f - S(s); // cuadros relativos a un segundo absoluto dentro de una escena que empieza en 0

// ---------------------------------------------------------------- 1. LLEGADA
const PARADAS = [
	{n: 'TOBOGÁN DE LA SELVA', lat: 5.387537, lng: -67.617578},
	{n: 'PUERTO NUEVO · EL BURRO', lat: 6.213163, lng: -67.423578},
	{n: 'EL APARO', lat: 5.650263, lng: -67.599797},
	{n: 'PLAZA YO AMO AMAZONAS', lat: 5.668288, lng: -67.614609},
	{n: 'CATEDRAL MARÍA AUXILIADORA', lat: 5.666438, lng: -67.628078},
	{n: 'PLAZA BOLÍVAR', lat: 5.666288, lng: -67.628297},
];
const T_PARADA = [2.9, 4.0, 5.1, 6.2, 7.3, 8.4];
const ESCALA = 26000; // px por grado en cada parada
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Globo: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	const z = interpolate(t, [0, 2.9], [0.55, 9], {...clamp, easing: Easing.in(Easing.cubic)});
	const o = interpolate(t, [2.4, 2.9], [1, 0], clamp);
	const giro = interpolate(t, [0, 2.9], [-40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill style={{opacity: o, alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #0B1E4F 0%, #01040D 70%)'}}>
			{new Array(70).fill(0).map((_, i) => (
				<div key={i} style={{position: 'absolute', left: random(`e${i}`) * 1080, top: random(`f${i}`) * 1920, width: 2 + random(`g${i}`) * 2, height: 2 + random(`g${i}`) * 2, borderRadius: 4, background: '#fff', opacity: 0.25 + 0.5 * random(`h${i}`)}} />
			))}
			<div style={{width: 760, height: 760, borderRadius: '50%', position: 'relative', overflow: 'hidden', transform: `scale(${z})`, transformOrigin: '43% 44%', background: 'radial-gradient(circle at 35% 30%, #2C7BE5 0%, #0E3C8C 45%, #061A44 75%)', boxShadow: `0 0 120px ${C.celeste}66, inset -60px -40px 120px rgba(0,0,0,0.6)`}}>
				{new Array(9).fill(0).map((_, i) => (
					<div key={`m${i}`} style={{position: 'absolute', left: '50%', top: 0, width: 760 * Math.cos(((i - 4) / 9) * Math.PI) , height: 760, marginLeft: -380 * Math.cos(((i - 4) / 9) * Math.PI), border: '1px solid rgba(79,195,247,0.25)', borderRadius: '50%', transform: `translateX(${giro}px)`}} />
				))}
				{new Array(7).fill(0).map((_, i) => <div key={`p${i}`} style={{position: 'absolute', left: 0, right: 0, top: 95 + i * 95, height: 1, background: 'rgba(79,195,247,0.25)'}} />)}
				<div style={{position: 'absolute', left: '43%', top: '44%', width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: '50%', background: C.oro, boxShadow: `0 0 0 ${10 + 8 * Math.sin(t * 8)}px ${C.oro}55, 0 0 30px ${C.oro}`}} />
			</div>
		</AbsoluteFill>
	);
};

const Mapa: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	// segmento actual
	let i = 0;
	while (i < T_PARADA.length - 1 && t >= T_PARADA[i + 1]) i++;
	const a = PARADAS[i], b = PARADAS[Math.min(i + 1, PARADAS.length - 1)];
	const viaje = i < PARADAS.length - 1 ? 0.62 : 0.0001;
	const p = i < PARADAS.length - 1 ? interpolate(t, [T_PARADA[i] + (T_PARADA[i + 1] - T_PARADA[i]) - viaje, T_PARADA[i + 1]], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
	const lat = lerp(a.lat, b.lat, p), lng = lerp(a.lng, b.lng, p);
	const dist = Math.hypot(b.lat - a.lat, b.lng - a.lng);
	const dip = Math.min(0.96, dist / 0.02 * 0.5);
	const entrada = interpolate(t, [2.6, 3.2], [0.18, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const escala = ESCALA * entrada * (1 - dip * Math.sin(Math.PI * p)) * (i === PARADAS.length - 1 ? interpolate(t, [T_PARADA[5], EXPLOTA], [1, 1.35], clamp) : 1);
	const cx = 540, cy = 900;
	const pos = (q: {lat: number; lng: number}) => ({x: cx + (q.lng - lng) * escala, y: cy - (q.lat - lat) * escala});
	const paso = 0.002 * escala; // cuadrícula cada 0.002°
	const llegada = T_PARADA[i];
	const kLlega = Math.round((t - llegada) * 30);
	return (
		<AbsoluteFill style={{background: '#04122E', overflow: 'hidden'}}>
			{/* terreno: manchas verdes fijas en coordenadas */}
			{new Array(46).fill(0).map((_, k) => {
				const q = {lat: 5.3 + random(`la${k}`) * 1.0, lng: -67.75 + random(`lo${k}`) * 0.45};
				const s = pos(q); const r = (0.004 + random(`r${k}`) * 0.02) * escala;
				return <div key={k} style={{position: 'absolute', left: s.x - r, top: s.y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: 'radial-gradient(circle, rgba(18,120,80,0.28), transparent 70%)'}} />;
			})}
			<AbsoluteFill style={{backgroundImage: `linear-gradient(rgba(79,195,247,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.13) 1px, transparent 1px)`, backgroundSize: `${paso}px ${paso}px`, backgroundPosition: `${cx - ((lng % 0.002) * escala)}px ${cy + ((lat % 0.002) * escala)}px`}} />
			{/* ruta */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{PARADAS.slice(0, i + 1).map((q, k) => {
					const s0 = pos(q), s1 = k < i ? pos(PARADAS[k + 1]) : pos({lat, lng});
					return <line key={k} x1={s0.x} y1={s0.y} x2={s1.x} y2={s1.y} stroke={C.oro} strokeWidth={5} strokeDasharray="14 10" opacity={0.8} />;
				})}
			</svg>
			{PARADAS.map((q, k) => {
				const s = pos(q); const vis = t >= T_PARADA[k] - 0.05;
				if (!vis || s.x < -100 || s.x > 1180 || s.y < -100 || s.y > 2020) return null;
				const pulso = 14 + 10 * Math.abs(Math.sin((t - T_PARADA[k]) * 5));
				return <div key={k} style={{position: 'absolute', left: s.x - 13, top: s.y - 13, width: 26, height: 26, borderRadius: '50%', background: k === i ? C.oro : C.celeste, boxShadow: `0 0 0 ${k === i ? pulso : 6}px ${(k === i ? C.oro : C.celeste)}44, 0 0 30px ${k === i ? C.oro : C.celeste}`}} />;
			})}
			{/* rótulo de la parada */}
			<AbsoluteFill style={{alignItems: 'center', top: 1030}}>
				<div style={{opacity: entra(kLlega, 0, 4), transform: `translateY(${sube(kLlega, 0, 30)}px)`, background: 'rgba(7,26,74,0.82)', border: `2px solid ${C.oro}88`, borderRadius: 18, padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 14}}>
					<svg width={30} height={40} viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.3 0 11.8 0 20.6 12 32 12 32s12-11.4 12-20.2C24 5.3 18.6 0 12 0zm0 16.5a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z" fill={C.oro} /></svg>
					<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: C.blanco}}>{PARADAS[i].n}</span>
				</div>
			</AbsoluteFill>
			{/* lectura de coordenadas */}
			<div style={{position: 'absolute', left: 50, bottom: 70, fontFamily: 'monospace', fontSize: 26, color: C.celeste, opacity: 0.8}}>{lat.toFixed(4)}° N · {Math.abs(lng).toFixed(4)}° O</div>
			<div style={{position: 'absolute', right: 50, bottom: 70, fontFamily: F.texto, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.celeste, opacity: 0.8}}>PUERTO AYACUCHO</div>
		</AbsoluteFill>
	);
};

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

const Llegada: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30;
	const k = f - S(EXPLOTA);
	const fondo = k >= 0 ? interpolate(k, [0, 12], [1, 0.35], clamp) : 1;
	return (
		<AbsoluteFill style={{background: '#01040D'}}>
			<AbsoluteFill style={{opacity: fondo, filter: k >= 0 ? `blur(${interpolate(k, [0, 12], [0, 8], clamp)}px)` : undefined}}>
				{SATELITE && k >= 0 ? (
					<Img src={staticFile(SATELITE.fondo)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				) : (
					<>
						{t >= 2.4 && <Mapa f={f} />}
						{t < 2.95 && <Globo f={f} />}
					</>
				)}
			</AbsoluteFill>
			{/* Textos de la voz durante el recorrido */}
			{k < 0 && (
				<AbsoluteFill style={{alignItems: 'center', top: 240, gap: 8}}>
					<Txt size={64} font={F.texto} peso={900} style={{opacity: entra(rel(f, V.v01), 0, 6), transform: `translateY(${sube(rel(f, V.v01), 0, 30)}px)`}}>ESTE 4 DE DICIEMBRE…</Txt>
					<Txt size={92} color={C.oro} style={{opacity: entra(rel(f, V.v01 + 2.31), 0, 4), transform: `scale(${golpe(rel(f, V.v01 + 2.31), 0, 1.4)})`}}>PUERTO AYACUCHO</Txt>
					<Txt size={58} font={F.texto} peso={900} style={{opacity: entra(rel(f, V.v01 + 3.57), 0, 5)}}>ES LA SEDE</Txt>
				</AbsoluteFill>
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
			<Destello en={S(EXPLOTA)} dur={14} max={1} color="#FFF6D8" />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 2. PILARES + LO QUE TE LLEVAS
const Pilares: React.FC = () => {
	const f = useCurrentFrame();
	const base = E.pilares[0];
	const r = (s: number) => f - S(s - base);
	const golpes: [string, number, string, number][] = [['LIDERA', V.v03 + 3.0, C.azul, 300], ['VENDE', V.v03 + 4.1, C.celeste, 400], ['CRECE', V.v03 + 5.19, C.oro, 520]];
	const fase2 = r(V.v04) >= 0;
	const items: [string, string, number][] = [['👥', 'Capacita a tu equipo', V.v04], ['📋', 'Organiza tu negocio', V.v04 + 2.68], ['⭐', 'Posiciona tu marca', V.v04 + 4.19]];
	const kPapel = r(V.v04 + 6.12);
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
						<Txt size={56} font={F.texto} peso={800} style={{marginTop: 70, opacity: entra(f, 12, 8), padding: '0 80px'}}>Tres pilares para llevar tu negocio al siguiente nivel</Txt>
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
							const m = interpolate(kPapel, [14 + j * 2, 34 + j * 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
							return <div key={j} style={{position: 'absolute', left: 250 + j * 26 + (450 - 250 - j * 26) * m, top: 130 + j * 22 + (150 - 130 - j * 22) * m, width: 300 - 100 * m, height: 380 * (1 - m) + 20, background: j === 5 ? '#E8F5E9' : '#F4F1E8', borderRadius: 8, transform: `rotate(${(j - 2.5) * 5 * (1 - m)}deg)`, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', opacity: 1 - m}} />;
						})}
						{(() => {
							const m = interpolate(kPapel, [30, 44], [0, 1], clamp);
							return (
								<div style={{position: 'absolute', left: 340, top: 110, width: 220, height: 420, borderRadius: 34, background: '#0B1220', border: `5px solid ${C.oro}`, opacity: m, transform: `scale(${interpolate(m, [0, 1], [0.6, 1])})`, boxShadow: `0 0 50px ${C.oro}88`, padding: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
									{['Ventas', 'Inventario', 'Finanzas', 'Clientes'].map((x, j) => <div key={x} style={{background: j % 2 ? C.azul : C.celeste, borderRadius: 10, height: 58, fontFamily: F.texto, fontWeight: 800, fontSize: 22, color: C.blanco, display: 'flex', alignItems: 'center', paddingLeft: 12, opacity: entra(kPapel, 40 + j * 4, 4)}}>{x}</div>)}
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
const LIMITES_P = [31.7, 35.0, 38.6, 41.8, 45.2];
const Ponente: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const p = PONENTES[i];
	const lado = i % 2 ? -1 : 1;
	const x = interpolate(f, [0, 12], [lado * 700, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const k = f - S(p.v - LIMITES_P[i]);
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
				<div style={{marginTop: 30, opacity: entra(k, 14, 4), transform: `scale(${golpe(k, 14, 1.5)})`}}>
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
	const palabras: [string, number, string][] = [['CONECTA', V.v09, C.blanco], ['INTERCAMBIA', V.v09 + 1.87, C.celeste], ['CONSIGUE NUEVOS CLIENTES', V.v09 + 3.3, C.oro]];
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
const LLEGA = (() => {
	const out: number[] = []; let t = 51.7;
	for (let i = 0; i < LOGOS.length; i++) { out.push(t); t += interpolate(i, [0, LOGOS.length - 2], [0.85, 0.36]); }
	return out;
})();
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
				const vuelo = interpolate(k, [9, 17], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
				const grande = golpe(k, 0, 0.3);
				const W = lerp(720, TW, vuelo) * (vuelo < 1 ? grande : 1), H = W * 2 / 3;
				const cx = lerp(540, s.x + TW / 2, vuelo), cy = lerp(1000, s.y + TH / 2, vuelo);
				const brillo = interpolate(k, [0, 9], [-1.2, 1.2], clamp);
				return (
					<div key={l} style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: 18 + 20 * (1 - vuelo), overflow: 'hidden', boxShadow: `0 0 0 ${2 + 4 * (1 - vuelo)}px ${vuelo < 1 ? C.oro : 'rgba(255,255,255,0.15)'}, 0 ${10 + 20 * (1 - vuelo)}px ${26 + 30 * (1 - vuelo)}px rgba(0,0,0,0.5)`, zIndex: vuelo < 1 ? 10 : 1}}>
						<Img src={staticFile(`patro/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block'}} />
						{k < 10 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.65) 50%, transparent 62%)', transform: `translateX(${brillo * 100}%)`}} />}
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
	const k1 = r(V.v12), k2 = r(V.v13);
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
					<Txt size={68} style={{opacity: entra(k2, 40, 4), transform: `translateY(${sube(k2, 40, 30)}px)`}}>MÁXIMA VISIBILIDAD</Txt>
					<Txt size={68} color={C.oro} style={{opacity: entra(k2, 60, 4), transform: `translateY(${sube(k2, 60, 30)}px)`}}>MÁXIMA PUBLICIDAD</Txt>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- 5b. SITIO WEB: tecleo, Enter, destello y la página
const DIRECCION = 'cumbre.kubiav.com';
export const T_TECLEO = 78.3, POR_LETRA = 1 / 12, T_ENTER = 80.15;
const Web: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / 30 + E.web[0];
	const n = Math.max(0, Math.min(DIRECCION.length, Math.floor((t - T_TECLEO) / POR_LETRA) + 1));
	const kE = Math.round((t - T_ENTER) * 30);
	const cursor = Math.floor(t * 2.5) % 2 === 0;
	const kW = f - S(V.v15 - E.web[0]);
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
	const fin = interpolate(f, [S(E.cierre[1] - E.cierre[0]) - 18, S(E.cierre[1] - E.cierre[0])], [0, 1], clamp);
	const lemas: [string, number, string][] = [['LIDERA', V.v16 + 2.72, C.blanco], ['VENDE', V.v16 + 3.82, C.celeste], ['CRECE', V.v16 + 4.75, C.oro]];
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

export const Patrocinio: React.FC<{conAudio?: boolean}> = ({conAudio = true}) => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{conAudio && <Audio src={staticFile('audio/mezcla-patrocinio.wav')} />}
			{ESCENAS.map(([[a, b], Comp], i) => (
				<Sequence key={i} from={S(a)} durationInFrames={S(b) - S(a)}><Comp /></Sequence>
			))}
		</AbsoluteFill>
	);
};

// Datos para el montaje de audio (los lee el script de mezcla vía un JSON exportado aparte)
export const MARCAS_AUDIO = {LLEGA, T_PARADA, EXPLOTA, T_TECLEO, POR_LETRA, T_ENTER, DIRECCION};
