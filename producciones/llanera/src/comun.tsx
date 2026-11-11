import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const C = {
	noche: '#0B1026',
	indigo: '#1B1440',
	magenta: '#7A2E5A',
	naranja: '#F28C28',
	oro: '#F5C04A',
	rojo: '#D7263D',
	crema: '#FFF4E0',
	blanco: '#FFFFFF',
	verde: '#1FA45B',
};
export const F = {
	titulo: 'Anton, sans-serif',
	texto: 'TikTokSans, sans-serif',
	script: 'Lobster, cursive',
	western: 'Rye, serif',
	logo: 'AbrilFatface, serif',
};
export const S = (seg: number) => Math.round(seg * 30); // segundos → cuadros
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useLienzo = () => {
	const {width, height} = useVideoConfig();
	return {W: width, H: height, cuadrado: Math.abs(width - height) < 10, u: width / 1080};
};

export const golpe = (f: number, fps: number, retraso = 0, desde = 1.8) =>
	interpolate(spring({frame: f - retraso, fps, config: {damping: 11, stiffness: 190, mass: 0.7}}), [0, 1], [desde, 1]);
export const entra = (f: number, d: number, dur = 6) => interpolate(f, [d, d + dur], [0, 1], clamp);
export const sacudir = (f: number, inicio: number, fuerza = 14, dur = 10) => {
	const k = f - inicio;
	if (k < 0 || k > dur) return 'translate(0px,0px)';
	const a = fuerza * (1 - k / dur);
	return `translate(${(random(`x${inicio}${k}`) - 0.5) * 2 * a}px,${(random(`y${inicio}${k}`) - 0.5) * 2 * a}px)`;
};

export const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [
			new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-SemiBold.ttf')})`, {weight: '600'}),
			new FontFace('TikTokSans', `url(${staticFile('fonts/TikTokSans-ExtraBold.ttf')})`, {weight: '800'}),
			new FontFace('Lobster', `url(${staticFile('fonts/Lobster-Regular.ttf')})`),
			new FontFace('Rye', `url(${staticFile('fonts/Rye-Regular.ttf')})`),
			new FontFace('AbrilFatface', `url(${staticFile('fonts/AbrilFatface-Regular.ttf')})`),
		];
		Promise.all(caras.map((c) => c.load())).then((cs) => {
			cs.forEach((c) => document.fonts.add(c));
			continueRender(h);
		});
	}, [h]);
};

export const Destello: React.FC<{en: number; dur?: number; max?: number; color?: string}> = ({en, dur = 7, max = 0.8, color = '#fff'}) => {
	const f = useCurrentFrame();
	const o = f >= en ? interpolate(f, [en, en + dur], [max, 0], clamp) : 0;
	return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

export const Chispas: React.FC<{n?: number; color?: string; semilla: string}> = ({n = 30, color = C.oro, semilla}) => {
	const f = useCurrentFrame();
	const {W, H} = useLienzo();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(n).fill(0).map((_, i) => {
				const x = random(`${semilla}x${i}`) * W;
				const vel = 1.5 + random(`${semilla}v${i}`) * 4;
				const y = H + 40 - ((f * vel + random(`${semilla}y${i}`) * H * 1.2) % (H * 1.15));
				const s = 3 + random(`${semilla}s${i}`) * 5;
				return <div key={i} style={{position: 'absolute', left: x + Math.sin(f / 14 + i) * 18, top: y, width: s, height: s, borderRadius: s, background: color, opacity: 0.35 + 0.6 * Math.abs(Math.sin(f / 7 + i)), boxShadow: `0 0 ${s * 3}px ${color}`}} />;
			})}
		</AbsoluteFill>
	);
};

// Cuerdas de arpa: líneas doradas que vibran con cada golpe
export const Cuerdas: React.FC<{golpes: number[]; n?: number; opacidad?: number}> = ({golpes, n = 7, opacidad = 0.55}) => {
	const f = useCurrentFrame();
	const {W, H} = useLienzo();
	let amp = 0;
	for (const g of golpes) if (f >= g) amp += 26 * Math.exp(-(f - g) / 9);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: opacidad}}>
			{new Array(n).fill(0).map((_, i) => {
				const x0 = (W / (n + 1)) * (i + 1);
				const pts: string[] = [];
				for (let y = 0; y <= H; y += 24) {
					const fase = Math.sin((y / H) * Math.PI);
					const dx = amp * fase * Math.sin(f * 1.7 + i * 1.3) * (0.6 + 0.4 * (i % 2));
					pts.push(`${x0 + dx},${y}`);
				}
				return <polyline key={i} points={pts.join(' ')} fill="none" stroke={C.oro} strokeWidth={2.5} style={{filter: `drop-shadow(0 0 6px ${C.oro})`}} />;
			})}
		</svg>
	);
};

// Palma de moriche en silueta
const Moriche: React.FC<{x: number; base: number; alto: number; color: string; inclina?: number; f: number; i: number}> = ({x, base, alto, color, inclina = 0, f, i}) => {
	const tx = x + inclina, ty = base - alto;
	const viento = Math.sin(f / 20 + i) * 4;
	const hojas = [];
	for (let k = 0; k < 15; k++) {
		const ang = (-170 + (k * 160) / 14) * (Math.PI / 180);
		const r = alto * (0.26 + 0.08 * Math.sin(k * 1.7));
		const ex = tx + Math.cos(ang) * r + viento;
		const ey = ty + Math.sin(ang) * r * 0.75 + r * 0.35 * Math.abs(Math.cos(ang));
		const cx = tx + Math.cos(ang) * r * 0.55, cy = ty + Math.sin(ang) * r * 0.65 - 6;
		hojas.push(<path key={k} d={`M ${tx} ${ty} Q ${cx} ${cy} ${ex} ${ey}`} stroke={color} strokeWidth={alto * 0.028} fill="none" strokeLinecap="round" />);
	}
	return (
		<g>
			<path d={`M ${x} ${base} Q ${x + inclina * 0.3} ${base - alto * 0.5} ${tx} ${ty}`} stroke={color} strokeWidth={alto * 0.035} fill="none" />
			{hojas}
		</g>
	);
};

// Sabana al atardecer / noche / amanecer
export const Sabana: React.FC<{noche?: number; sol?: number}> = ({noche = 0, sol = 0}) => {
	const f = useCurrentFrame();
	const {W, H} = useLienzo();
	const hz = H * 0.74;
	const cielo1 = noche > 0.5 ? '#070A1C' : C.indigo;
	const sy = hz + 60 - sol * H * 0.22;
	return (
		<AbsoluteFill>
			<svg width={W} height={H}>
				<defs>
					<linearGradient id="cielo" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor={cielo1} />
						<stop offset={0.5 - noche * 0.2} stopColor={noche > 0.6 ? '#1B1440' : C.magenta} />
						<stop offset="0.74" stopColor={noche > 0.6 ? '#3A1F4A' : C.naranja} />
					</linearGradient>
					<radialGradient id="sol">
						<stop offset="0" stopColor="#FFF1C1" />
						<stop offset="0.4" stopColor={C.oro} />
						<stop offset="1" stopColor={C.naranja} stopOpacity={0} />
					</radialGradient>
				</defs>
				<rect width={W} height={H} fill="url(#cielo)" />
				<rect width={W} height={H} fill={C.noche} opacity={noche * 0.55} />
				{noche > 0 && new Array(70).fill(0).map((_, i) => (
					<circle key={i} cx={random(`ex${i}`) * W} cy={random(`ey${i}`) * hz * 0.85} r={1 + random(`er${i}`) * 2} fill="#fff" opacity={noche * (0.4 + 0.6 * Math.abs(Math.sin(f / 9 + i)))} />
				))}
				<circle cx={W * 0.62} cy={sy} r={W * 0.2} fill="url(#sol)" opacity={1 - noche * 0.9} />
				<rect y={hz} width={W} height={H - hz} fill="#140A12" />
				{[[0.08, 0.3, 10], [0.2, 0.22, -6], [0.82, 0.34, -12], [0.93, 0.24, 8], [0.55, 0.16, 4], [0.38, 0.12, -3]].map(([px, alto, inc], i) => (
					<Moriche key={i} x={W * px} base={hz + 4} alto={H * alto} color="#140A12" inclina={inc * 3} f={f} i={i} />
				))}
			</svg>
		</AbsoluteFill>
	);
};

// ---------- Íconos ----------
export const IconoArpa: React.FC<{s: number; color?: string}> = ({s, color = C.oro}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<path d="M18 92 L30 10 Q55 2 72 18 Q86 34 88 60 L84 92 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
		<path d="M30 10 L20 92" stroke={color} strokeWidth={7} strokeLinecap="round" />
		{[0, 1, 2, 3, 4, 5, 6].map((k) => <line key={k} x1={30 + k * 7.5} y1={12 + k * 2} x2={24 + k * 8.6} y2={90} stroke={color} strokeWidth={1.6} />)}
		<path d="M14 92 L90 92" stroke={color} strokeWidth={6} strokeLinecap="round" />
	</svg>
);
export const IconoCuatro: React.FC<{s: number; color?: string}> = ({s, color = C.oro}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<g transform="rotate(-35 50 50)">
			<rect x={46} y={2} width={8} height={46} rx={2} fill={color} />
			<ellipse cx={50} cy={60} rx={18} ry={14} fill={color} />
			<ellipse cx={50} cy={80} rx={22} ry={17} fill={color} />
			<circle cx={50} cy={68} r={6} fill={C.noche} />
			{[47, 49, 51, 53].map((x) => <line key={x} x1={x} y1={4} x2={x} y2={88} stroke={C.noche} strokeWidth={0.8} />)}
		</g>
	</svg>
);
export const IconoMaracas: React.FC<{s: number; color?: string}> = ({s, color = C.naranja}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<g transform="rotate(-20 30 60)"><ellipse cx={30} cy={34} rx={17} ry={21} fill={color} /><rect x={27} y={53} width={6} height={36} rx={3} fill="#8B5A2B" /></g>
		<g transform="rotate(20 70 60)"><ellipse cx={70} cy={34} rx={17} ry={21} fill={color} /><rect x={67} y={53} width={6} height={36} rx={3} fill="#8B5A2B" /></g>
	</svg>
);
export const IconoSombrero: React.FC<{s: number; color?: string}> = ({s, color = C.crema}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<path d="M30 58 Q30 24 50 22 Q70 24 70 58 Z" fill={color} />
		<path d="M50 30 Q46 40 50 50" stroke="#00000033" strokeWidth={3} fill="none" />
		<path d="M4 56 Q20 70 50 66 Q80 70 96 56 Q84 76 50 76 Q16 76 4 56 Z" fill={color} />
		<rect x={30} y={52} width={40} height={6} fill="#5A3A22" />
	</svg>
);
export const IconoBota: React.FC<{s: number; color?: string}> = ({s, color = '#8B5A2B'}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<path d="M34 8 L62 8 L62 60 Q80 62 92 74 L92 90 L22 90 L22 80 L30 80 Z" fill={color} />
		<path d="M38 20 Q48 30 58 20 M38 34 Q48 44 58 34" stroke={C.oro} strokeWidth={3} fill="none" />
		<rect x={22} y={86} width={70} height={6} fill="#3B2412" />
	</svg>
);
// Alpargata llanera: cerrada adelante, piel de vaca blanca con manchas marrones, punta abierta, tira al talón con hebilla
export const IconoAlpargata: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<defs>
			<clipPath id="capellada"><path d="M44 80 Q44 52 62 46 Q84 42 95 70 L95 80 Z" /></clipPath>
		</defs>
		{/* suela de cuero */}
		<path d="M4 80 Q4 74 12 74 L88 74 Q97 74 97 80 Q97 87 88 87 L12 87 Q4 87 4 80 Z" fill="#B9773A" />
		<path d="M6 84 L95 84" stroke="#7A4A22" strokeWidth={2} />
		{/* plantilla visible en el talón */}
		<path d="M8 76 L50 76 L50 79 L8 79 Z" fill="#E2B27A" />
		{/* tira al talón con forro naranja y hebilla */}
		<path d="M52 56 Q30 44 12 54 Q6 62 10 76" fill="none" stroke="#E08A2E" strokeWidth={9} strokeLinecap="round" />
		<path d="M52 56 Q30 44 12 54 Q6 62 10 76" fill="none" stroke="#6B3E1E" strokeWidth={4} strokeLinecap="round" />
		<rect x={24} y={44} width={9} height={8} rx={1.5} fill="none" stroke="#C9C9C9" strokeWidth={2.4} transform="rotate(-12 28 48)" />
		{/* capellada de piel de vaca */}
		<path d="M44 80 Q44 52 62 46 Q84 42 95 70 L95 80 Z" fill="#FBF7F0" />
		<g clipPath="url(#capellada)">
			<ellipse cx={58} cy={64} rx={9} ry={7} fill="#A0521E" />
			<ellipse cx={78} cy={52} rx={7} ry={5} fill="#A0521E" />
			<ellipse cx={86} cy={74} rx={6} ry={4} fill="#8B4513" />
			<ellipse cx={48} cy={76} rx={4} ry={3} fill="#8B4513" />
		</g>
		<path d="M44 80 Q44 52 62 46 Q84 42 95 70" fill="none" stroke="#6B3E1E" strokeWidth={2.6} />
		{/* punta abierta */}
		<ellipse cx={93} cy={76} rx={3} ry={4} fill="#3B2412" />
	</svg>
);
export const IconoPin: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s} viewBox="0 0 100 100">
		<path d="M50 96 Q20 60 20 38 A30 30 0 1 1 80 38 Q80 60 50 96 Z" fill={C.rojo} stroke="#fff" strokeWidth={4} />
		<circle cx={50} cy={38} r={11} fill="#fff" />
	</svg>
);

// ---------- Logo limpio de Morichal Amigo (redibujado, sin marcas de agua) ----------
export const LogoMorichal: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s} viewBox="0 0 500 500">
		<circle cx={250} cy={245} r={205} fill="#FFF8EC" stroke="#6B4423" strokeWidth={12} />
		<text x={250} y={100} textAnchor="middle" fontFamily="TikTokSans" fontWeight={800} fontSize={30} letterSpacing={7} fill="#1A1A1A" fontStyle="italic">AGRUPACIÓN</text>
		<g transform="translate(68 118) scale(1.05)"><IconoArpaRaw /></g>
		<g transform="translate(340 112) scale(0.85)"><IconoMaracasRaw /></g>
		<g transform="translate(66 236) scale(0.9)"><MoricheLogo /></g>
		<text x={232} y={282} textAnchor="middle" fontFamily="AbrilFatface" fontSize={165} fill="#111" stroke="#BDBDBD" strokeWidth={4}>M</text>
		<text x={330} y={345} textAnchor="middle" fontFamily="AbrilFatface" fontSize={140} fill="#111" stroke="#BDBDBD" strokeWidth={4}>A</text>
		<rect x={112} y={300} width={200} height={36} rx={18} fill="#fff" stroke="#6B4423" strokeWidth={3} />
		<text x={212} y={325} textAnchor="middle" fontFamily="TikTokSans" fontWeight={800} fontSize={19} fill="#1A1A1A">MORICHAL AMIGO</text>
		<path d="M60 405 Q250 355 440 405 L440 428 Q250 378 60 428 Z" fill="#F7D117" />
		<path d="M60 428 Q250 378 440 428 L440 451 Q250 401 60 451 Z" fill="#1F3FAF" />
		<path d="M60 451 Q250 401 440 451 L440 474 Q250 424 60 474 Z" fill="#D7263D" />
		{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
			const t = 0.2 + (k * 0.6) / 7;
			const x = 60 + t * 380, y = 440 - Math.sin(t * Math.PI) * 26;
			return <text key={k} x={x} y={y + 6} textAnchor="middle" fontSize={16} fill="#fff">★</text>;
		})}
	</svg>
);
const IconoArpaRaw: React.FC = () => (
	<g>
		<path d="M18 92 L30 10 Q55 2 72 18 Q86 34 88 60 L84 92 Z" fill="none" stroke="#D99A1E" strokeWidth={5} strokeLinejoin="round" />
		<path d="M30 10 L20 92" stroke="#B5701A" strokeWidth={7} strokeLinecap="round" />
		{[0, 1, 2, 3, 4, 5, 6].map((k) => <line key={k} x1={30 + k * 7.5} y1={12 + k * 2} x2={24 + k * 8.6} y2={90} stroke="#B5701A" strokeWidth={1.4} />)}
	</g>
);
const IconoMaracasRaw: React.FC = () => (
	<g>
		<g transform="rotate(-20 30 60)"><ellipse cx={30} cy={34} rx={17} ry={21} fill={C.naranja} /><rect x={27} y={53} width={6} height={36} rx={3} fill="#8B5A2B" /></g>
		<g transform="rotate(20 70 60)"><ellipse cx={70} cy={34} rx={17} ry={21} fill={C.naranja} /><rect x={67} y={53} width={6} height={36} rx={3} fill="#8B5A2B" /></g>
	</g>
);
const MoricheLogo: React.FC = () => {
	const hojas = [];
	for (let k = 0; k < 13; k++) {
		const ang = (-170 + (k * 160) / 12) * (Math.PI / 180);
		hojas.push(<path key={k} d={`M 40 20 Q ${40 + Math.cos(ang) * 22} ${20 + Math.sin(ang) * 22 - 4} ${40 + Math.cos(ang) * 40} ${20 + Math.sin(ang) * 28 + 10}`} stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />);
	}
	return (
		<g>
			<path d="M34 130 Q36 80 40 20" stroke="#1A1A1A" strokeWidth={5} fill="none" />
			{hojas}
		</g>
	);
};
