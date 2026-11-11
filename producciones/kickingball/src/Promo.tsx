import React, {useEffect, useState} from 'react';
import {
	AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, random,
	spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';

// ---------- Identidad del encuentro ----------
const C = {
	noche: '#060A14',
	oro: '#F5B82E',
	amazonas: '#1ED37F',
	bolivar: '#FF8A1F',
	blanco: '#FFFFFF',
};
const TITULO = 'Anton, sans-serif';
const TEXTO = 'TikTokSans, sans-serif';

type Equipo = {nombre: string[]; frase: string; logo: string; estado: 'AMAZONAS' | 'BOLÍVAR'; color: string; tarjeta?: boolean};
const EQUIPOS: Equipo[] = [
	{nombre: ['FÉNIX', 'DE AMAZONAS'], frase: 'Renacen en cada jugada', logo: 'logos/fenix.png', estado: 'AMAZONAS', color: '#FF7A1A'},
	{nombre: ['LAS LEGENDARIAS', 'APACUANAS'], frase: 'Guerreras de leyenda', logo: 'logos/apacuanas.jpg', estado: 'BOLÍVAR', color: '#D9A93A', tarjeta: true},
	{nombre: ['ALPHA', 'KICKINGBALL CLUB'], frase: 'Primeras en todo', logo: 'logos/alpha.png', estado: 'AMAZONAS', color: '#3A6BFF'},
	{nombre: ['PANTERAS', 'DEL MOSCÚ'], frase: 'Garras afiladas', logo: 'logos/panteras.png', estado: 'BOLÍVAR', color: '#E3182D'},
	{nombre: ['2DA BASE', 'KICKINGBALL CLUB'], frase: 'Ya tienen la base. Van por el trofeo', logo: 'logos/segundabase.png', estado: 'AMAZONAS', color: '#2747C9'},
	{nombre: ['SPORT GIRLS', 'LOS PIJIGUAOS'], frase: 'Dando pelea desde 2021', logo: 'logos/sportgirls.png', estado: 'BOLÍVAR', color: '#C431D8'},
	{nombre: ["CHIK'S", "SELVATIK'S"], frase: 'Fuerza salvaje', logo: 'logos/chiks.png', estado: 'AMAZONAS', color: '#C0175A'},
];
const AMAZONAS = EQUIPOS.filter((e) => e.estado === 'AMAZONAS');
const BOLIVAR = EQUIPOS.filter((e) => e.estado === 'BOLÍVAR');

// ---------- Utilidades ----------
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sacudir = (f: number, inicio: number, fuerza = 18, dur = 12) => {
	const k = f - inicio;
	if (k < 0 || k > dur) return 'translate(0px,0px)';
	const a = fuerza * (1 - k / dur);
	return `translate(${(random(`x${inicio}${k}`) - 0.5) * 2 * a}px,${(random(`y${inicio}${k}`) - 0.5) * 2 * a}px)`;
};
const golpe = (f: number, fps: number, retraso = 0, desde = 1.9) =>
	interpolate(spring({frame: f - retraso, fps, config: {damping: 11, stiffness: 180, mass: 0.7}}), [0, 1], [desde, 1]);

const Destello: React.FC<{en: number; dur?: number; max?: number; color?: string}> = ({en, dur = 7, max = 0.85, color = '#fff'}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [en, en + dur], [max, 0], clamp) * (f >= en ? 1 : 0);
	return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

const Chispas: React.FC<{n?: number; color?: string; semilla: string}> = ({n = 40, color = C.oro, semilla}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(n).fill(0).map((_, i) => {
				const x = random(`${semilla}x${i}`) * 1080;
				const vel = 2 + random(`${semilla}v${i}`) * 6;
				const y = 1980 - ((f * vel + random(`${semilla}y${i}`) * 2000) % 2100);
				const s = 3 + random(`${semilla}s${i}`) * 6;
				const o = 0.35 + 0.65 * Math.abs(Math.sin(f / 6 + i));
				return <div key={i} style={{position: 'absolute', left: x + Math.sin(f / 15 + i) * 20, top: y, width: s, height: s, borderRadius: s, background: color, opacity: o, boxShadow: `0 0 ${s * 3}px ${color}`}} />;
			})}
		</AbsoluteFill>
	);
};

const Vineta: React.FC<{fuerza?: number}> = ({fuerza = 0.75}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,${fuerza}) 100%)`}} />
);

const Fondo: React.FC<{src: string; zoom?: [number, number]; oscuro?: number; blur?: number; dur: number}> = ({src, zoom = [1.05, 1.15], oscuro = 0.5, blur = 0, dur}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, dur], zoom, clamp);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined}} />
			<AbsoluteFill style={{background: `rgba(6,10,20,${oscuro})`}} />
		</AbsoluteFill>
	);
};

// Salida de cada escena: barrido con desenfoque en los últimos cuadros
const Salida: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const f = useCurrentFrame();
	const k = interpolate(f, [dur - 6, dur], [0, 1], clamp);
	return <AbsoluteFill style={{transform: `scale(${1 + k * 0.25})`, filter: k > 0 ? `blur(${k * 14}px)` : undefined, opacity: 1 - k * 0.6}}>{children}</AbsoluteFill>;
};

const Titulo: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = C.blanco, style}) => (
	<div style={{fontFamily: TITULO, fontSize: size, lineHeight: 0.95, color, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 1, textShadow: '0 6px 24px rgba(0,0,0,0.75)', ...style}}>{children}</div>
);

// ---------- Escena 1: el choque Amazonas vs Bolívar (0–3 s) ----------
const Choque: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entra = interpolate(f, [12, 30], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)});
	const panel = (src: string, lado: 'izq' | 'der') => {
		const clip = lado === 'izq' ? 'polygon(0 0, 62% 0, 38% 100%, 0 100%)' : 'polygon(62% 0, 100% 0, 100% 100%, 38% 100%)';
		const dx = (lado === 'izq' ? -1 : 1) * 1100 * entra;
		return (
			<AbsoluteFill style={{clipPath: clip, transform: `translateX(${dx}px)`}}>
				<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.15 - f * 0.001})`}} />
				<AbsoluteFill style={{background: lado === 'izq' ? 'linear-gradient(180deg, rgba(4,40,22,0.25), rgba(4,30,16,0.7))' : 'linear-gradient(0deg, rgba(60,25,0,0.25), rgba(50,20,0,0.7))'}} />
			</AbsoluteFill>
		);
	};
	const s1 = golpe(f, fps, 30, 2.4);
	const s2 = golpe(f, fps, 34, 3);
	const s3 = golpe(f, fps, 38, 2.4);
	const vis = (d: number) => (f >= d ? 1 : 0);
	return (
		<Salida dur={90}>
			<AbsoluteFill style={{background: C.noche, transform: sacudir(f, 30, 26, 14)}}>
				{panel('img/amazonas.jpg', 'izq')}
				{panel('img/bolivar.jpg', 'der')}
				{/* costura de luz */}
				<AbsoluteFill style={{opacity: interpolate(f, [28, 32, 90], [0, 1, 0.7], clamp)}}>
					<svg width={1080} height={1920}><line x1={670} y1={0} x2={410} y2={1920} stroke={C.oro} strokeWidth={10} style={{filter: `drop-shadow(0 0 22px ${C.oro})`}} /></svg>
				</AbsoluteFill>
				<Vineta fuerza={0.6} />
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30}}>
					<Titulo size={190} color={C.amazonas} style={{opacity: vis(30), transform: `scale(${s1}) rotate(-4deg)`, textShadow: `0 0 40px ${C.amazonas}, 0 8px 30px #000`}}>AMAZONAS</Titulo>
					<div style={{opacity: vis(34), transform: `scale(${s2})`, width: 190, height: 190, borderRadius: 95, background: C.oro, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${C.oro}`}}>
						<span style={{fontFamily: TITULO, fontSize: 110, color: C.noche}}>VS</span>
					</div>
					<Titulo size={190} color={C.bolivar} style={{opacity: vis(38), transform: `scale(${s3}) rotate(-4deg)`, textShadow: `0 0 40px ${C.bolivar}, 0 8px 30px #000`}}>BOLÍVAR</Titulo>
				</AbsoluteFill>
				<AbsoluteFill style={{alignItems: 'center', top: 300}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.blanco, opacity: interpolate(f, [44, 54], [0, 1], clamp), transform: `translateY(${interpolate(f, [44, 54], [30, 0], clamp)}px)`, textShadow: '0 4px 16px #000'}}>
						GRAN ENCUENTRO DE KICKINGBALL
					</div>
				</AbsoluteFill>
				<Chispas semilla="choque" n={30} />
			</AbsoluteFill>
			<Destello en={30} dur={8} />
		</Salida>
	);
};

// ---------- Escena 2: el enfrentamiento (3–6 s) ----------
const Enfrentamiento: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<Salida dur={90}>
			<AbsoluteFill style={{transform: sacudir(f, 0, 20, 10)}}>
				<Fondo src="img/enfrentamiento.jpg" zoom={[1.02, 1.16]} oscuro={0.05} dur={90} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0) 32%, rgba(6,10,20,0) 75%, rgba(6,10,20,0.6) 100%)'}} />
				<AbsoluteFill style={{alignItems: 'center', top: 230}}>
					<Titulo size={150} style={{transform: `scale(${golpe(f, fps, 2, 2)})`}}>LA CANCHA</Titulo>
					<Titulo size={210} color={C.oro} style={{transform: `scale(${golpe(f, fps, 8, 2.4)})`, opacity: f >= 8 ? 1 : 0, textShadow: `0 0 50px #FF6A00, 0 8px 30px #000`}}>ARDE</Titulo>
				</AbsoluteFill>
				<Chispas semilla="enf" n={45} color="#FFB347" />
				<Vineta fuerza={0.55} />
			</AbsoluteFill>
			<Destello en={0} dur={8} />
		</Salida>
	);
};

// ---------- Escena 3: 7 · 2 · 1 (6–8 s) ----------
const Conteo: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const filas: [string, string, string, number][] = [
		['7', 'EQUIPOS', C.blanco, 0],
		['2', 'ESTADOS', C.blanco, 15],
		['1', 'TROFEO', C.oro, 30],
	];
	const sh = [0, 15, 30].map((d) => sacudir(f, d, 14, 8)).find((t) => t !== 'translate(0px,0px)') ?? 'none';
	return (
		<Salida dur={60}>
			<Fondo src="img/estadio.jpg" oscuro={0.6} blur={6} dur={60} zoom={[1.1, 1.2]} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 10, transform: sh}}>
				{filas.map(([n, t, col, d]) => (
					<div key={t} style={{display: 'flex', alignItems: 'baseline', gap: 28, opacity: f >= d ? 1 : 0, transform: `scale(${golpe(f, fps, d, 1.8)})`}}>
						<span style={{fontFamily: TITULO, fontSize: 260, color: col, textShadow: col === C.oro ? `0 0 40px ${C.oro}` : '0 6px 24px #000'}}>{n}</span>
						<span style={{fontFamily: TITULO, fontSize: 140, color: col, textShadow: '0 6px 24px #000'}}>{t}</span>
					</div>
				))}
			</AbsoluteFill>
			{[0, 15, 30].map((d) => <Destello key={d} en={d} dur={5} max={0.4} />)}
		</Salida>
	);
};

// ---------- Escena 4: cada equipo (2 s c/u) ----------
const Presentacion: React.FC<{e: Equipo; i: number}> = ({e, i}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = golpe(f, fps, 0, 2.1);
	const flota = Math.sin(f / 9) * 8;
	const colorEstado = e.estado === 'AMAZONAS' ? C.amazonas : C.bolivar;
	const anillo = interpolate(f, [0, 16], [0.4, 2.2], clamp);
	const anilloO = interpolate(f, [0, 16], [0.9, 0], clamp);
	const brillo = interpolate(f, [8, 26], [-120, 220], clamp);
	const tam = e.tarjeta ? 700 : 660;
	const mascara = `url(${staticFile(e.logo)})`;
	return (
		<Salida dur={60}>
			<AbsoluteFill style={{transform: sacudir(f, 0, 22, 10)}}>
				<Fondo src="img/estadio.jpg" oscuro={0.55} dur={60} zoom={[1.18, 1.1]} />
				<AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${e.color}CC 0%, ${e.color}55 28%, rgba(6,10,20,0.2) 60%)`, mixBlendMode: 'screen'}} />
				{/* rayos de luz detrás del logo */}
				<AbsoluteFill style={{opacity: 0.35, background: `repeating-conic-gradient(from ${f * 1.2}deg at 50% 42%, ${e.color}66 0deg 6deg, transparent 6deg 18deg)`, maskImage: 'radial-gradient(circle at 50% 42%, #000 0%, transparent 55%)', WebkitMaskImage: 'radial-gradient(circle at 50% 42%, #000 0%, transparent 55%)'}} />
				<Vineta fuerza={0.7} />
				{/* estado */}
				<AbsoluteFill style={{alignItems: 'center', top: 250}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: C.noche, background: colorEstado, padding: '12px 34px', borderRadius: 60, opacity: interpolate(f, [2, 8], [0, 1], clamp), transform: `translateY(${interpolate(f, [2, 10], [-40, 0], clamp)}px)`, boxShadow: `0 0 30px ${colorEstado}88`}}>
						{e.estado}
					</div>
				</AbsoluteFill>
				{/* onda de choque */}
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: -155}}>
					<div style={{width: 500, height: 500, borderRadius: 500, border: `10px solid ${e.color}`, transform: `scale(${anillo})`, opacity: anilloO, boxShadow: `0 0 40px ${e.color}`}} />
				</AbsoluteFill>
				{/* logo */}
				<div style={{position: 'absolute', left: (1080 - tam) / 2, top: 390 + flota, width: tam, height: tam, transform: `scale(${s})`, opacity: interpolate(f, [0, 3], [0, 1], clamp), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Img src={staticFile(e.logo)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: e.tarjeta ? 36 : 0, border: e.tarjeta ? `5px solid ${C.oro}` : undefined, filter: `drop-shadow(0 0 30px ${e.color}) drop-shadow(0 18px 30px rgba(0,0,0,0.8))`}} />
					{!e.tarjeta && (
						<div style={{position: 'absolute', inset: 0, maskImage: mascara, WebkitMaskImage: mascara, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center', background: `linear-gradient(105deg, transparent ${brillo - 20}%, rgba(255,255,255,0.75) ${brillo}%, transparent ${brillo + 20}%)`}} />
					)}
				</div>
				{/* nombre */}
				<AbsoluteFill style={{alignItems: 'center', top: 1120}}>
					<Titulo size={e.nombre[0].length > 11 ? 92 : 132} style={{opacity: interpolate(f, [5, 10], [0, 1], clamp), transform: `translateY(${interpolate(f, [5, 12], [60, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`}}>{e.nombre[0]}</Titulo>
					<Titulo size={e.nombre[0].length > 11 ? 132 : 70} color={e.nombre[0].length > 11 ? C.oro : '#E8ECF5'} style={{marginTop: 8, opacity: interpolate(f, [8, 13], [0, 1], clamp), transform: `translateY(${interpolate(f, [8, 15], [60, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`}}>{e.nombre[1]}</Titulo>
					<div style={{marginTop: 26, fontFamily: TEXTO, fontWeight: 600, fontSize: 44, color: C.blanco, opacity: interpolate(f, [14, 20], [0, 1], clamp), borderLeft: `6px solid ${e.color}`, borderRight: `6px solid ${e.color}`, padding: '4px 24px', background: 'rgba(6,10,20,0.55)', borderRadius: 8}}>
						“{e.frase}”
					</div>
				</AbsoluteFill>
				<AbsoluteFill style={{alignItems: 'center', top: 1560}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,0.7)'}}>{i + 1} / {EQUIPOS.length}</div>
				</AbsoluteFill>
				<Chispas semilla={`eq${i}`} n={22} color={e.color} />
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.7} />
		</Salida>
	);
};

// ---------- Escena 5: el trofeo, sobrio y mediano (22–24 s) ----------
const Trofeo: React.FC = () => {
	const f = useCurrentFrame();
	const sube = interpolate(f, [0, 20], [80, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<Salida dur={60}>
			<Fondo src="img/estadio.jpg" oscuro={0.72} blur={4} dur={60} zoom={[1.12, 1.18]} />
			<AbsoluteFill style={{alignItems: 'center', top: 330}}>
				<Titulo size={120} style={{opacity: interpolate(f, [2, 10], [0, 1], clamp)}}>SOLO UNO</Titulo>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: (1080 - 330) / 2, top: 560 + sube, width: 330, height: 586, opacity: interpolate(f, [0, 12], [0, 1], clamp)}}>
				<Img src={staticFile('img/trofeo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen', filter: 'saturate(0.7) brightness(0.85) contrast(1.05)'}} />
			</div>
			<AbsoluteFill style={{alignItems: 'center', top: 1220}}>
				<Titulo size={120} color={C.oro} style={{opacity: interpolate(f, [10, 18], [0, 1], clamp)}}>SE LO LLEVA</Titulo>
			</AbsoluteFill>
		</Salida>
	);
};

// ---------- Escena 6: todos juntos (24–27 s) ----------
const Todos: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const fila = (lista: Equipo[], y: number, tam: number, base: number) => {
		const gap = 24;
		const ancho = lista.length * tam + (lista.length - 1) * gap;
		return lista.map((e, k) => {
			const x0 = (1080 - ancho) / 2 + k * (tam + gap);
			const d = base + k * 3;
			const p = spring({frame: f - d, fps, config: {damping: 12, stiffness: 160}});
			const desdeX = (random(`tx${e.logo}`) - 0.5) * 2400;
			const desdeY = (random(`ty${e.logo}`) > 0.5 ? 1 : -1) * 1400;
			const bob = Math.sin((f + k * 12) / 10) * 10;
			return (
				<div key={e.logo} style={{position: 'absolute', left: x0, top: y + bob, width: tam, height: tam, transform: `translate(${(1 - p) * desdeX}px, ${(1 - p) * desdeY}px) rotate(${(1 - p) * 90}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Img src={staticFile(e.logo)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: e.tarjeta ? 18 : 0, border: e.tarjeta ? `3px solid ${C.oro}` : undefined, filter: `drop-shadow(0 0 18px ${e.color}) drop-shadow(0 10px 16px rgba(0,0,0,0.8))`}} />
				</div>
			);
		});
	};
	return (
		<Salida dur={90}>
			<AbsoluteFill style={{transform: sacudir(f, 0, 24, 12)}}>
				<Fondo src="img/enfrentamiento.jpg" oscuro={0.72} blur={10} dur={90} zoom={[1.15, 1.25]} />
				<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.amazonas}33 0%, transparent 45%, transparent 55%, ${C.bolivar}33 100%)`}} />
				<AbsoluteFill style={{alignItems: 'center', top: 250}}>
					<Titulo size={104} style={{opacity: f >= 14 ? 1 : 0, transform: `scale(${golpe(f, fps, 14, 1.8)})`}}>¿CON QUIÉN</Titulo>
					<Titulo size={104} color={C.oro} style={{opacity: f >= 18 ? 1 : 0, transform: `scale(${golpe(f, fps, 18, 1.8)})`, textShadow: `0 0 30px ${C.oro}`}}>ESTÁS TÚ?</Titulo>
				</AbsoluteFill>
				<AbsoluteFill style={{alignItems: 'center', top: 545}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: C.amazonas}}>AMAZONAS</div>
				</AbsoluteFill>
				{fila(AMAZONAS, 600, 225, 0)}
				<AbsoluteFill style={{alignItems: 'center', top: 870}}>
					<div style={{fontFamily: TITULO, fontSize: 84, color: C.oro, textShadow: `0 0 30px ${C.oro}`, transform: `scale(${1 + Math.sin(f / 5) * 0.06})`}}>VS</div>
				</AbsoluteFill>
				{fila(BOLIVAR, 990, 255, 4)}
				<AbsoluteFill style={{alignItems: 'center', top: 1265}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: C.bolivar}}>BOLÍVAR</div>
				</AbsoluteFill>
				<AbsoluteFill style={{alignItems: 'center', top: 1370}}>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 48, color: C.blanco, opacity: interpolate(f, [30, 40], [0, 1], clamp), textShadow: '0 4px 16px #000'}}>¡Ven a apoyar a tu equipo!</div>
				</AbsoluteFill>
				<Chispas semilla="todos" n={40} />
			</AbsoluteFill>
			<Destello en={0} dur={8} />
		</Salida>
	);
};

// ---------- Escena 7: la información (27–30 s) ----------
const Info: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const aparece = (d: number) => ({opacity: interpolate(f, [d, d + 4], [0, 1], clamp), transform: `scale(${golpe(f, fps, d, 1.5)})`});
	const pulso = 1 + interpolate(f, [72, 80], [0.05, 0], clamp) * (f >= 72 ? 1 : 0);
	return (
		<AbsoluteFill>
			<Fondo src="img/estadio.jpg" oscuro={0.62} dur={90} zoom={[1.08, 1.0]} />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${C.oro}22 0%, transparent 60%)`}} />
			<AbsoluteFill style={{alignItems: 'center', top: 250, transform: `scale(${pulso})`}}>
				<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 36, letterSpacing: 7, color: C.blanco, ...aparece(0)}}>GRAN ENCUENTRO DE KICKINGBALL</div>
				<div style={{display: 'flex', gap: 22, alignItems: 'baseline', marginTop: 10, ...aparece(2)}}>
					<span style={{fontFamily: TITULO, fontSize: 96, color: C.amazonas}}>AMAZONAS</span>
					<span style={{fontFamily: TITULO, fontSize: 64, color: C.oro}}>VS</span>
					<span style={{fontFamily: TITULO, fontSize: 96, color: C.bolivar}}>BOLÍVAR</span>
				</div>
				<div style={{marginTop: 40, width: 860, padding: '36px 0 42px', borderRadius: 36, background: 'rgba(6,10,20,0.72)', border: `3px solid ${C.oro}`, boxShadow: `0 0 50px ${C.oro}44`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{fontFamily: TITULO, fontSize: 190, lineHeight: 1, color: C.oro, ...aparece(12), textShadow: `0 0 30px ${C.oro}88`}}>13 Y 14</div>
					<div style={{fontFamily: TITULO, fontSize: 92, lineHeight: 1, color: C.blanco, ...aparece(12)}}>DE NOVIEMBRE</div>
					<div style={{width: 640, height: 3, background: `${C.oro}88`, margin: '26px 0'}} />
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 64, color: C.blanco, ...aparece(24)}}><span style={{color: C.oro}}>HORA:</span> 4:30 P.M.</div>
					<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 52, color: C.blanco, marginTop: 14, ...aparece(36)}}>Cancha Av. del Ejército</div>
					<div style={{marginTop: 28, fontFamily: TITULO, fontSize: 66, color: C.noche, background: C.amazonas, padding: '6px 40px', borderRadius: 60, ...aparece(48), boxShadow: `0 0 30px ${C.amazonas}99`}}>ENTRADA GRATIS</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill style={{top: 1390, height: 130, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14}}>
				{EQUIPOS.map((e, k) => (
					<Img key={e.logo} src={staticFile(e.logo)} style={{width: 118, height: 118, objectFit: 'contain', borderRadius: e.tarjeta ? 10 : 0, opacity: interpolate(f, [56 + k * 2, 60 + k * 2], [0, 1], clamp), transform: `translateY(${interpolate(f, [56 + k * 2, 62 + k * 2], [40, 0], clamp) + Math.sin((f + k * 10) / 9) * 5}px)`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.8))'}} />
				))}
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 1545}}>
				<div style={{fontFamily: TEXTO, fontWeight: 800, fontSize: 40, color: C.oro, opacity: interpolate(f, [62, 70], [0, 1], clamp)}}>¡Trae a tu barra y comparte!</div>
			</AbsoluteFill>
			<Chispas semilla="info" n={26} />
			<Destello en={0} dur={8} />
			<Destello en={72} dur={6} max={0.35} color={C.oro} />
			<AbsoluteFill style={{background: '#000', opacity: interpolate(f, [84, 90], [0, 0.5], clamp)}} />
		</AbsoluteFill>
	);
};

// ---------- Fuentes ----------
const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [
			new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-SemiBold.ttf')})`, {weight: '600'}),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-ExtraBold.ttf')})`, {weight: '800'}),
		];
		Promise.all(caras.map((c) => c.load())).then((cs) => {
			cs.forEach((c) => document.fonts.add(c));
			continueRender(h);
		});
	}, [h]);
};

// ---------- Línea de tiempo (sincronizada a 120 BPM: 1 tiempo = 15 cuadros) ----------
export const Promo: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche}}>
			<Audio src={staticFile('audio/banda.wav')} />
			<Sequence from={0} durationInFrames={90}><Choque /></Sequence>
			<Sequence from={90} durationInFrames={90}><Enfrentamiento /></Sequence>
			<Sequence from={180} durationInFrames={60}><Conteo /></Sequence>
			{EQUIPOS.map((e, i) => (
				<Sequence key={e.logo} from={240 + i * 60} durationInFrames={60}><Presentacion e={e} i={i} /></Sequence>
			))}
			<Sequence from={660} durationInFrames={60}><Trofeo /></Sequence>
			<Sequence from={720} durationInFrames={90}><Todos /></Sequence>
			<Sequence from={810} durationInFrames={90}><Info /></Sequence>
		</AbsoluteFill>
	);
};
