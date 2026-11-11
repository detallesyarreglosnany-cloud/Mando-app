import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
	C, Chispas, Cuerdas, Destello, F, IconoAlpargata, IconoArpa, IconoBota, IconoCuatro, IconoMaracas, IconoPin,
	IconoSombrero, LogoMorichal, S, Sabana, clamp, entra, golpe, sacudir, useFuentes, useLienzo,
} from './comun';

const sombra = '0 6px 24px rgba(0,0,0,0.85)';

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, style}) => {
	const {u} = useLienzo();
	return <div style={{fontFamily: font, fontSize: size * u, lineHeight: 1.02, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>;
};

// Foto que cubre el lienzo con acercamiento lento
const Foto: React.FC<{src: string; dur: number; zoom?: [number, number]; filtro?: string; origen?: string}> = ({src, dur, zoom = [1.04, 1.14], filtro, origen = 'center'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, dur], zoom, clamp)})`, transformOrigin: origen, filter: filtro}} />
		</AbsoluteFill>
	);
};

const Velo: React.FC<{arriba?: number; abajo?: number}> = ({arriba = 0.75, abajo = 0.85}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,16,38,${arriba}) 0%, rgba(11,16,38,0) 30%, rgba(11,16,38,0) 55%, rgba(11,16,38,${abajo}) 100%)`}} />
);

const Salida: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const f = useCurrentFrame();
	const k = interpolate(f, [dur - 5, dur], [0, 1], clamp);
	return <AbsoluteFill style={{transform: `scale(${1 + k * 0.18})`, filter: k > 0 ? `blur(${k * 12}px)` : undefined}}>{children}</AbsoluteFill>;
};

// ---------- 1. Fecha (0–3.2 s) ----------
const Fecha: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {H, cuadrado} = useLienzo();
	return (
		<Salida dur={S(3.2)}>
			<Sabana />
			<Cuerdas golpes={[0, S(0.9), S(1.5)]} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: sacudir(f, S(0.9), 14), paddingBottom: cuadrado ? 0 : H * 0.06}}>
				<Txt size={cuadrado ? 150 : 170} style={{opacity: entra(f, S(0.9), 2), transform: `scale(${golpe(f, fps, S(0.9), 2)})`}}>SÁBADO</Txt>
				<Txt size={cuadrado ? 280 : 340} color={C.oro} style={{opacity: entra(f, S(1.5), 2), transform: `scale(${golpe(f, fps, S(1.5), 2.4)})`, textShadow: `0 0 40px ${C.naranja}, ${sombra}`}}>21</Txt>
				<Txt size={cuadrado ? 64 : 76} style={{opacity: entra(f, S(1.6), 4)}}>DE NOVIEMBRE</Txt>
				<Txt size={cuadrado ? 54 : 64} font={F.script} color={C.crema} style={{marginTop: 30, opacity: entra(f, S(2.0), 8), transform: `translateY(${interpolate(f, [S(2.0), S(2.4)], [30, 0], clamp)}px)`}}>
					Ayacucho, desempolva tu sombrero
				</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={8} max={0.6} color={C.oro} />
		</Salida>
	);
};

// ---------- 2. 8:00 PM (3.2–5.8 s) ----------
const Hora: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const d = S(4.35 - 3.2);
	return (
		<Salida dur={S(2.6)}>
			<Sabana noche={interpolate(f, [0, 30], [0.2, 1], clamp)} />
			<Cuerdas golpes={[d]} opacidad={0.35} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: sacudir(f, d, 12)}}>
				<Txt size={60} font={F.texto} style={{fontWeight: 800, letterSpacing: 8, opacity: entra(f, 2, 6)}}>A PARTIR DE LAS</Txt>
				<Txt size={260} color={C.oro} style={{opacity: entra(f, d, 2), transform: `scale(${golpe(f, fps, d, 2.2)})`, textShadow: `0 0 40px ${C.oro}88, ${sombra}`}}>8:00 PM</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.4} />
		</Salida>
	);
};

// ---------- 3. Gran Amanecer Llanero (5.8–9.6 s) ----------
const Titulo: React.FC<{amanecer?: boolean; fondo?: boolean}> = ({amanecer = false, fondo = true}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {cuadrado} = useLienzo();
	const d = amanecer ? S(46.1 - 45.8) : S(6.8 - 5.8);
	return (
		<>
			{fondo && <Sabana noche={amanecer ? interpolate(f, [0, 60], [0.8, 0], clamp) : 0.85} sol={amanecer ? interpolate(f, [0, 70], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0} />}
			{!amanecer && <AbsoluteFill style={{background: `repeating-conic-gradient(from ${f}deg at 50% 45%, ${C.oro}22 0deg 5deg, transparent 5deg 15deg)`}} />}
			{fondo && <Cuerdas golpes={[d]} opacidad={0.4} />}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: sacudir(f, d, 18), paddingBottom: cuadrado ? 40 : 160}}>
				<Txt size={cuadrado ? 120 : 150} style={{opacity: entra(f, d, 2), transform: `scale(${golpe(f, fps, d, 2)})`}}>GRAN</Txt>
				<Txt size={cuadrado ? 150 : 190} color={C.oro} style={{opacity: entra(f, d + 4, 2), transform: `scale(${golpe(f, fps, d + 4, 2.2)})`, textShadow: `0 0 40px ${C.naranja}, ${sombra}`}}>AMANECER</Txt>
				<Txt size={cuadrado ? 120 : 150} font={F.script} color={C.crema} style={{marginTop: -10, opacity: entra(f, d + 10, 6), transform: `rotate(-5deg) scale(${golpe(f, fps, d + 10, 1.4)})`}}>Llanero</Txt>
				{!amanecer && (
					<div style={{marginTop: 30, fontFamily: F.texto, fontWeight: 800, fontSize: 44, letterSpacing: 10, color: C.noche, background: C.rojo, padding: '8px 30px', borderRadius: 40, opacity: entra(f, d + 22, 6), boxShadow: `0 0 30px ${C.rojo}`}}>
						<span style={{color: C.blanco}}>● EN VIVO</span>
					</div>
				)}
			</AbsoluteFill>
			<Chispas semilla={amanecer ? 'am2' : 'am1'} n={30} />
			<Destello en={d} dur={7} max={0.6} color={C.oro} />
		</>
	);
};

// ---------- 4. Fachada (9.6–12.5 s) ----------
const Fachada: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {W, H, cuadrado, u} = useLienzo();
	const d = S(10.5 - 9.6);
	const ancho = W * (cuadrado ? 0.92 : 1);
	const alto = ancho * (941 / 1672);
	const tarde = 'brightness(0.9) saturate(1.15) sepia(0.15)';
	return (
		<Salida dur={S(2.9)}>
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<Img src={staticFile('img/fachada.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(28px) brightness(0.45)', transform: 'scale(1.2)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.magenta}66, ${C.naranja}44)`}} />
			<div style={{position: 'absolute', left: (W - ancho) / 2, top: H * (cuadrado ? 0.1 : 0.27), width: ancho, height: alto, overflow: 'hidden', borderRadius: cuadrado ? 24 : 0, boxShadow: '0 20px 60px rgba(0,0,0,0.7)', border: cuadrado ? `4px solid ${C.oro}` : undefined}}>
				<Img src={staticFile('img/fachada.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: tarde, transform: `scale(${interpolate(f, [0, S(2.9)], [1, 1.1])})`}} />
				<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.naranja}33, ${C.magenta}33)`, mixBlendMode: 'multiply'}} />
				{/* bombillitos que se encienden sobre el aviso */}
				{new Array(18).fill(0).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: `${3 + i * 5.5}%`, top: `${8 + Math.sin(i * 0.9) * 1.2}%`, width: 12 * u, height: 12 * u, borderRadius: 12, background: '#FFE7A8', opacity: entra(f, 4 + i, 3), boxShadow: `0 0 ${18 * u}px #FFC85A`}} />
				))}
			</div>
			<AbsoluteFill style={{alignItems: 'center', top: H * (cuadrado ? 0.66 : 0.6)}}>
				<Txt size={46} font={F.texto} style={{fontWeight: 800, letterSpacing: 8, opacity: entra(f, d - 4, 4)}}>TASCA</Txt>
				<Txt size={cuadrado ? 104 : 124} color={C.oro} style={{opacity: entra(f, d, 2), transform: `scale(${golpe(f, fps, d, 1.9)})`}}>EL BODEGÓN DE JONY</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.5} />
		</Salida>
	);
};

// ---------- 5. Interior vacío + dirección (12.5–18.5 s) ----------
const Interior: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {H, cuadrado, u} = useLienzo();
	const noche = interpolate(f, [10, 90], [0, 0.55], clamp);
	const pinY = interpolate(spring01(f - S(0.5), fps), [0, 1], [-400, 0]);
	const bombillos: [number, number][] = [[0.021, 0.161], [0.465, 0.2], [0.762, 0.226]];
	return (
		<Salida dur={S(6)}>
			<Foto src="img/interior.jpg" dur={S(6)} zoom={[1.02, 1.12]} />
			<AbsoluteFill style={{background: '#0B1026', opacity: noche}} />
			{bombillos.map(([x, y], i) => (
				<div key={i} style={{position: 'absolute', left: `${x * 100}%`, top: `${(cuadrado ? y * 1.78 - 0.39 : y) * 100}%`, width: 0, height: 0}}>
					<div style={{position: 'absolute', left: -120 * u, top: -120 * u, width: 240 * u, height: 240 * u, borderRadius: '50%', background: 'radial-gradient(circle, #FFE7A8 0%, #FFC85A88 25%, transparent 70%)', opacity: entra(f, 40 + i * 8, 20)}} />
				</div>
			))}
			<Velo arriba={0.2} abajo={0.9} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: H * (cuadrado ? 0.1 : 0.2)}}>
				<div style={{transform: `translateY(${pinY}px)`}}><IconoPin s={140 * u} /></div>
				<Txt size={cuadrado ? 82 : 96} style={{marginTop: 10, opacity: entra(f, S(0.6), 4), transform: `scale(${golpe(f, fps, S(0.6), 1.5)})`}}>AV. PRINCIPAL DE ARAMARE</Txt>
				<Txt size={cuadrado ? 44 : 50} font={F.texto} color={C.oro} style={{fontWeight: 800, marginTop: 14, opacity: entra(f, S(3.0), 8)}}>Diagonal a los semáforos Las Delicias</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.4} />
		</Salida>
	);
};
const spring01 = (f: number, fps: number) => (f < 0 ? 0 : Math.min(1, 1 - Math.exp(-f / 4) * Math.cos(f / 3)));

// ---------- 6. Tasca llena + cantantes (18.5–28.9 s) ----------
type Cantante = {nombre: string; frase: string; foto: string; color: string; t: number; cara: [number, number]; lado: 'izq' | 'der'};
const CANTANTES: Cantante[] = [
	{nombre: 'REYNALDO CAMACHO', frase: 'El Rey de la Canta', foto: 'img/reynaldo.png', color: '#E3A73A', t: 20.69, cara: [0.25, 0.47], lado: 'izq'},
	{nombre: 'MARÍA JOROPA', frase: 'Voz recia femenina', foto: 'img/maria.png', color: '#B57EDC', t: 22.27, cara: [0.82, 0.47], lado: 'der'},
	{nombre: 'BETZONIA ARMAS', frase: 'Pasión de joropo y pasaje criollo', foto: 'img/betzonia.png', color: C.naranja, t: 24.54, cara: [0.42, 0.46], lado: 'izq'},
	{nombre: 'MANUEL SALAS', frase: 'Canta y anima la noche', foto: 'img/manuel.png', color: '#3A5BD9', t: 26.59, cara: [0.65, 0.45], lado: 'der'},
];
const T0 = 18.5;
const TascaLlena: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {W, H, cuadrado, u} = useLienzo();
	const actual = [...CANTANTES].reverse().find((c) => f >= S(c.t - T0));
	// mapeo de la foto (941x1672) en modo "cover"
	const esc = Math.max(W / 941, H / 1672);
	const iw = 941 * esc, ih = 1672 * esc, ox = (W - iw) / 2, oy = (H - ih) / 2;
	const foco = actual ? {x: ox + actual.cara[0] * iw, y: oy + actual.cara[1] * ih} : null;
	const intro = !actual;
	return (
		<AbsoluteFill>
			<Foto src="img/interior-cantantes.jpg" dur={S(10.4)} zoom={[1.0, 1.06]} filtro="brightness(0.95) saturate(1.1)" />
			<AbsoluteFill style={{background: '#0B1026', opacity: 0.35}} />
			{foco && <AbsoluteFill style={{background: `radial-gradient(circle at ${foco.x}px ${foco.y}px, transparent 0, transparent ${150 * u}px, rgba(11,16,38,0.7) ${260 * u}px)`}} />}
			{intro && (
				<AbsoluteFill style={{alignItems: 'center', top: H * (cuadrado ? 0.08 : 0.12)}}>
					<Txt size={cuadrado ? 70 : 84} style={{opacity: entra(f, 4, 6), transform: `scale(${golpe(f, fps, 4, 1.5)})`}}>CON LA PRESENTACIÓN DE</Txt>
				</AbsoluteFill>
			)}
			{/* luces de tarima al llenarse la tasca */}
			<AbsoluteFill style={{opacity: interpolate(f, [0, 20, 60], [0, 0.7, 0], clamp), background: `conic-gradient(from ${f * 3}deg at 50% -10%, transparent 0deg, ${C.oro}55 10deg, transparent 20deg, transparent 40deg, ${C.oro}44 50deg, transparent 60deg)`}} />
			{actual && <Tarjeta c={actual} f={f - S(actual.t - T0)} fps={fps} />}
			<Destello en={0} dur={10} max={0.8} color="#FFF3D6" />
			{CANTANTES.map((c) => <Destello key={c.nombre} en={S(c.t - T0)} dur={5} max={0.35} color={c.color} />)}
		</AbsoluteFill>
	);
};
const Tarjeta: React.FC<{c: Cantante; f: number; fps: number}> = ({c, f, fps}) => {
	const {W, H, cuadrado, u} = useLienzo();
	const alto = H * (cuadrado ? 0.68 : 0.46);
	const izq = c.lado === 'izq';
	const desliza = interpolate(spring01(f, fps), [0, 1], [izq ? -W * 0.6 : W * 0.6, 0]);
	return (
		<AbsoluteFill style={{transform: sacudir(f, 0, 10, 8)}}>
			<AbsoluteFill style={{background: `linear-gradient(180deg, transparent ${cuadrado ? 20 : 45}%, ${c.color}CC ${cuadrado ? 70 : 78}%, ${C.noche} 100%)`}} />
			<Img src={staticFile(c.foto)} style={{position: 'absolute', bottom: 0, [izq ? 'left' : 'right']: -20 * u, height: alto, transform: `translateX(${desliza}px)`, filter: `drop-shadow(0 0 30px ${c.color}) drop-shadow(0 10px 20px rgba(0,0,0,0.6))`}} />
			<div style={{position: 'absolute', bottom: H * (cuadrado ? 0.12 : 0.1), [izq ? 'right' : 'left']: 40 * u, width: W * 0.5, textAlign: izq ? 'right' : 'left'}}>
				{c.nombre.split(' ').map((p, i) => (
					<div key={p} style={{fontFamily: F.titulo, fontSize: (cuadrado ? 88 : 104) * u, lineHeight: 0.95, color: i === 0 ? C.blanco : C.oro, textShadow: sombra, opacity: entra(f, 2 + i * 3, 3), transform: `scale(${golpe(f, fps, 2 + i * 3, 1.6)})`, transformOrigin: izq ? 'right' : 'left'}}>{p}</div>
				))}
				<div style={{fontFamily: F.script, fontSize: (cuadrado ? 44 : 50) * u, color: C.crema, marginTop: 10 * u, textShadow: sombra, opacity: entra(f, 10, 6)}}>{c.frase}</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- 7. Grupo frente al Bodegón (28.9–33.3 s) ----------
const Grupo: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {H, cuadrado} = useLienzo();
	return (
		<Salida dur={S(4.4)}>
			<Foto src="img/grupo-fachada.jpg" dur={S(4.4)} zoom={[1.12, 1.02]} origen={cuadrado ? 'center 60%' : 'center'} />
			<Velo arriba={0.1} abajo={0.92} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: H * (cuadrado ? 0.06 : 0.12)}}>
				<Txt size={cuadrado ? 84 : 100} style={{opacity: entra(f, 3, 3), transform: `scale(${golpe(f, fps, 3, 1.6)})`}}>SÁBADO 21</Txt>
				<Txt size={cuadrado ? 54 : 62} color={C.oro} style={{opacity: entra(f, S(1.9), 4)}}>EN EL BODEGÓN DE JONY</Txt>
				<Txt size={cuadrado ? 30 : 34} font={F.texto} style={{fontWeight: 800, marginTop: 16, letterSpacing: 1, opacity: entra(f, S(2.4), 8)}}>
					Reynaldo Camacho · María Joropa · Betzonia Armas · Manuel Salas
				</Txt>
			</AbsoluteFill>
			<Destello en={0} dur={6} max={0.5} />
		</Salida>
	);
};

// ---------- 8. Arpa, cuatro y maracas (33.3–35.0 s) + 9. Morichal Amigo (35.0–37.2 s) ----------
const Instrumentos: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u, cuadrado} = useLienzo();
	const items = [
		{t: 0, el: <IconoArpa s={300 * u} />, txt: 'ARPA'},
		{t: S(33.85 - 33.3), el: <IconoCuatro s={300 * u} />, txt: 'CUATRO'},
		{t: S(34.6 - 33.3), el: <IconoMaracas s={300 * u} />, txt: 'MARACAS'},
	];
	return (
		<AbsoluteFill>
			<Sabana noche={0.9} />
			<Cuerdas golpes={items.map((i) => i.t)} />
			<AbsoluteFill style={{flexDirection: cuadrado ? 'row' : 'column', justifyContent: 'center', alignItems: 'center', gap: 20 * u}}>
				{items.map((it) => (
					<div key={it.txt} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: entra(f, it.t, 2), transform: `scale(${golpe(f, fps, it.t, 2)}) rotate(${Math.sin((f - it.t) / 3) * 4}deg)`}}>
						{it.el}
						<Txt size={70}>{it.txt}</Txt>
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const Morichal: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u, H, cuadrado} = useLienzo();
	return (
		<Salida dur={S(2.2)}>
			<Sabana noche={0.9} />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${C.oro}44 0%, transparent 55%)`}} />
			<Cuerdas golpes={[0]} opacidad={0.3} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 12 * u, paddingBottom: cuadrado ? 0 : H * 0.04}}>
				<Txt size={52} font={F.texto} color={C.oro} style={{fontWeight: 800, letterSpacing: 8, opacity: entra(f, 0, 4)}}>PRESENTACIÓN ESPECIAL</Txt>
				<div style={{transform: `scale(${golpe(f, fps, 2, 0.3)}) rotate(${interpolate(f, [2, 14], [-25, 0], clamp)}deg)`, filter: `drop-shadow(0 0 30px ${C.oro}88)`}}>
					<LogoMorichal s={(cuadrado ? 560 : 640) * u} />
				</div>
				<Txt size={cuadrado ? 64 : 76} style={{opacity: entra(f, 12, 5)}}>AGRUPACIÓN MORICHAL AMIGO</Txt>
			</AbsoluteFill>
			<Chispas semilla="mor" n={24} />
			<Destello en={0} dur={8} max={0.6} color={C.oro} />
		</Salida>
	);
};

// ---------- 10. El combo (37.2–39.8 s) ----------
const Combo: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {H, cuadrado} = useLienzo();
	const corte = S(1.2);
	const enCarne = f < corte;
	return (
		<Salida dur={S(2.6)}>
			{enCarne ? <Foto src="img/carne.jpg" dur={corte} zoom={[1.15, 1.05]} /> : <Foto src="img/polar.jpg" dur={S(1.4)} zoom={[1.05, 1.15]} origen="center 70%" />}
			<Velo arriba={0.85} abajo={0.3} />
			<AbsoluteFill style={{alignItems: 'center', top: H * (cuadrado ? 0.06 : 0.1), transform: sacudir(f, corte, 10)}}>
				<Txt size={cuadrado ? 92 : 112} color={C.oro} style={{opacity: entra(f, 2, 3), transform: `scale(${golpe(f, fps, 2, 1.7)})`}}>CARNE EN VARA</Txt>
				<Txt size={cuadrado ? 92 : 112} style={{opacity: entra(f, corte, 2), transform: `scale(${golpe(f, fps, corte, 1.8)})`}}>+ POLAR BIEN FRÍA</Txt>
				<Txt size={cuadrado ? 58 : 66} font={F.script} color={C.crema} style={{marginTop: 8, opacity: entra(f, corte + 8, 6)}}>El combo de la noche llanera</Txt>
			</AbsoluteFill>
			{!enCarne && <Chispas semilla="frio" n={20} color="#CFEFFF" />}
			<Destello en={0} dur={5} max={0.5} />
			<Destello en={corte} dur={5} max={0.5} color="#DFF4FF" />
		</Salida>
	);
};

// ---------- 11. Sombrero, botas, alpargatas (39.8–41.9 s) ----------
const Vestimenta: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {u, cuadrado, H} = useLienzo();
	const items = [{t: 0, el: <IconoSombrero s={(cuadrado ? 260 : 330) * u} />, txt: 'SOMBRERO'}, {t: S(0.5), el: <IconoBota s={(cuadrado ? 260 : 330) * u} />, txt: 'BOTAS'}, {t: S(1.0), el: <IconoAlpargata s={(cuadrado ? 260 : 330) * u} />, txt: 'ALPARGATAS'}];
	return (
		<Salida dur={S(2.1)}>
			<Sabana noche={0.6} />
			<AbsoluteFill style={{alignItems: 'center', top: H * (cuadrado ? 0.07 : 0.14)}}>
				<Txt size={cuadrado ? 86 : 100} style={{opacity: entra(f, 0, 3)}}>TRAE TU</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{flexDirection: cuadrado ? 'row' : 'column', justifyContent: 'center', alignItems: 'center', gap: (cuadrado ? 30 : 10) * u, paddingTop: cuadrado ? 60 : 80}}>
				{items.map((it) => (
					<div key={it.txt} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: entra(f, it.t, 2), transform: `translateY(${interpolate(f, [it.t, it.t + 6], [-300, 0], {...clamp, easing: Easing.out(Easing.back(1.8))})}px)`}}>
						{it.el}
						<Txt size={60} color={C.oro}>{it.txt}</Txt>
					</div>
				))}
			</AbsoluteFill>
		</Salida>
	);
};

// ---------- 12. Tarjeta de datos (41.9–45.8 s) ----------
const Datos: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {cuadrado, u} = useLienzo();
	const linea = (d: number) => ({opacity: entra(f, d, 3), transform: `scale(${golpe(f, fps, d, 1.4)})`});
	const b = S(41.9);
	return (
		<Salida dur={S(3.9)}>
			<Sabana noche={0.95} />
			<Cuerdas golpes={[S(42.0) - b, S(43.1) - b, S(44.2) - b]} opacidad={0.3} />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: (cuadrado ? 900 : 920) * u, padding: `${40 * u}px 0`, borderRadius: 40 * u, background: 'rgba(11,16,38,0.82)', border: `4px solid ${C.oro}`, boxShadow: `0 0 50px ${C.oro}44`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 * u}}>
					<Txt size={cuadrado ? 120 : 140} color={C.oro} style={linea(S(42.0) - b)}>SÁBADO 21</Txt>
					<Txt size={cuadrado ? 64 : 72} style={linea(S(42.35) - b)}>DE NOVIEMBRE · 8:00 PM</Txt>
					<div style={{width: 600 * u, height: 3, background: `${C.oro}88`, margin: `${14 * u}px 0`}} />
					<Txt size={cuadrado ? 46 : 52} font={F.texto} style={{fontWeight: 800, ...linea(S(43.1) - b)}}>Tasca El Bodegón de Jony</Txt>
					<Txt size={cuadrado ? 40 : 44} font={F.texto} color={C.crema} style={{fontWeight: 600, ...linea(S(44.2) - b)}}>Av. Principal de Aramare</Txt>
					<Txt size={cuadrado ? 34 : 38} font={F.texto} color={C.crema} style={{fontWeight: 600, ...linea(S(44.4) - b)}}>Diagonal a los semáforos Las Delicias</Txt>
					<div style={{marginTop: 18 * u, fontFamily: F.titulo, fontSize: 76 * u, color: C.noche, background: C.oro, padding: `${4 * u}px ${44 * u}px`, borderRadius: 60, boxShadow: `0 0 34px ${C.oro}`, ...linea(S(44.9) - b)}}>ENTRADA GRATIS</div>
				</div>
			</AbsoluteFill>
		</Salida>
	);
};

// ---------- 13. Amanecer final + cierre (45.8–53 s) ----------
const Final: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {H, cuadrado, u} = useLienzo();
	const c = S(49.2 - 45.8);
	const sube = interpolate(f, [c, c + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill>
			<Sabana noche={interpolate(f, [0, 60], [0.8, 0], clamp)} sol={interpolate(f, [0, 70], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)})} />
			<Cuerdas golpes={[S(46.1 - 45.8), c]} opacidad={0.4} />
			<AbsoluteFill style={{transform: `translateY(${-sube * H * (cuadrado ? 0.14 : 0.12)}px) scale(${1 - sube * 0.15})`}}>
				<Titulo amanecer fondo={false} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: H * (cuadrado ? 0.05 : 0.13), opacity: sube}}>
				<Txt size={cuadrado ? 76 : 92} font={F.western} color={C.oro} style={{transform: `scale(${golpe(f, fps, c, 1.6)}) rotate(-3deg)`, textShadow: `0 0 30px ${C.naranja}, ${sombra}`}}>¡Arpaaa, maestro!</Txt>
				<Txt size={cuadrado ? 40 : 52} font={F.texto} style={{fontWeight: 800, marginTop: 18 * u}}>Sábado 21 de noviembre · 8:00 PM</Txt>
				<Txt size={cuadrado ? 34 : 42} font={F.texto} color={C.crema} style={{fontWeight: 600, marginTop: 4 * u}}>Tasca El Bodegón de Jony · Av. Principal de Aramare</Txt>
				<div style={{marginTop: 18 * u, fontFamily: F.titulo, fontSize: 64 * u, color: C.noche, background: C.oro, padding: `${2 * u}px ${40 * u}px`, borderRadius: 60, boxShadow: `0 0 30px ${C.oro}`}}>ENTRADA GRATIS</div>
			</AbsoluteFill>
			<Destello en={c} dur={8} max={0.5} color={C.oro} />
			<AbsoluteFill style={{background: '#000', opacity: interpolate(f, [S(52.4 - 45.8), S(53 - 45.8)], [0, 0.6], clamp)}} />
		</AbsoluteFill>
	);
};

// ---------- Línea de tiempo (sincronizada con la cuña, audio recortado 4.1 s) ----------
const ESCENAS: [number, number, React.FC][] = [
	[0, 3.2, Fecha],
	[3.2, 5.8, Hora],
	[5.8, 9.6, () => <Salida dur={S(3.8)}><Titulo /></Salida>],
	[9.6, 12.5, Fachada],
	[12.5, 18.5, Interior],
	[18.5, 28.9, TascaLlena],
	[28.9, 33.3, Grupo],
	[33.3, 35.0, Instrumentos],
	[35.0, 37.2, Morichal],
	[37.2, 39.8, Combo],
	[39.8, 41.9, Vestimenta],
	[41.9, 45.8, Datos],
	[45.8, 53.0, Final],
];

export const Llanera: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.noche}}>
			<Audio src={staticFile('audio/cuna.wav')} />
			{ESCENAS.map(([a, b, Comp]) => (
				<Sequence key={a} from={S(a)} durationInFrames={S(b) - S(a)}><Comp /></Sequence>
			))}
		</AbsoluteFill>
	);
};
