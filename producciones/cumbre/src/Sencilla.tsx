import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.1, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);

// Encabezado fijo de la cumbre (pequeño) para todas las escenas menos la primera
const Marca: React.FC = () => (
	<AbsoluteFill style={{alignItems: 'center', top: 120}}>
		<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: C.blanco, textAlign: 'center', lineHeight: 1.15}}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</div>
		<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 26, color: C.celeste}}>Amazonas 2026</div>
	</AbsoluteFill>
);

// ---------- 1. Portada (0–5 s) ----------
const Portada: React.FC = () => {
	const f = useCurrentFrame();
	const datos: [string, string, number][] = [['FECHA', 'Viernes 4 de diciembre', 40], ['HORA', 'Desde las 2:00 PM', 48], ['LUGAR', 'Club Parapata · Puerto Ayacucho', 56]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="por" />
			<AbsoluteFill style={{alignItems: 'center', top: 330}}>
				<Txt size={46} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 5)}}>CUMBRE DE</Txt>
				<Txt size={120} style={{opacity: entra(f, 4, 4), transform: `scale(${golpe(f, 4, 1.4)})`}}>TRANSFORMACIÓN</Txt>
				<Txt size={120} color={C.oro} style={{opacity: entra(f, 10, 4), transform: `scale(${golpe(f, 10, 1.4)})`, textShadow: `0 0 30px ${C.oro}66, ${sombra}`}}>EMPRESARIAL</Txt>
				<div style={{marginTop: 18, opacity: entra(f, 18, 5)}}><Pildora fondo={C.azul} color={C.blanco} size={38}>AMAZONAS 2026</Pildora></div>
				<div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 18, width: 880}}>
					{datos.map(([k, v, d]) => (
						<div key={k} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: entra(f, d, 5), transform: `translateX(${interpolate(f, [d, d + 10], [-80, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, background: 'rgba(255,255,255,0.08)', border: `2px solid ${C.celeste}55`, borderRadius: 20, padding: '16px 26px'}}>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 26, letterSpacing: 4, color: C.oro, width: 130}}>{k}</span>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 40, color: C.blanco}}>{v}</span>
						</div>
					))}
				</div>
			</AbsoluteFill>
			<Destello en={0} dur={8} max={0.6} color={C.celeste} />
		</AbsoluteFill>
	);
};

// ---------- 2. Ponentes (5–25 s) y panel (25–28 s) ----------
const PONENTES = [
	{nombre: 'José Rodríguez', cargo: 'Asesor en Ventas y Liderazgo Comercial', charla: 'Conecta, vende y lidera con estrategia', foto: 'img/jose-tarima.jpg', pos: '30% 30%'},
	{nombre: 'Juan Ernesto Sierra', cargo: 'Asesor en Finanzas', charla: 'Finanzas inteligentes y ganancias reales', foto: 'img/juan-tarima.jpg', pos: '25% 25%'},
	{nombre: 'Daniela Silva', cargo: 'Desarrolladora de Soluciones Digitales', charla: 'Tu negocio en piloto automático digital', foto: 'img/daniela-tarima.jpg', pos: '30% 25%'},
	{nombre: 'Tania Alzuru', cargo: 'Asesora en Neuromarketing', charla: 'De emprendedor a empresario exitoso', foto: 'img/tania-tarima.jpg', pos: '30% 25%'},
];
const Ponente: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const p = PONENTES[i];
	const x = interpolate(f, [0, 12], [i % 2 ? -1100 : 1100, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const salida = interpolate(f, [S(5) - 6, S(5)], [0, i % 2 ? 1100 : -1100], {...clamp, easing: Easing.in(Easing.cubic)});
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla={`p${i}`} n={18} />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 260}}>
				<Txt size={34} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 4)}}>PONENTE {i + 1} DE 4</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 340, transform: `translateX(${x + salida}px)`}}>
				<div style={{width: 900, borderRadius: 30, overflow: 'hidden', border: `5px solid ${C.oro}`, boxShadow: `0 0 50px ${C.celeste}44, 0 20px 40px rgba(0,0,0,0.6)`}}>
					<div style={{height: 680, overflow: 'hidden'}}>
						<Img src={staticFile(p.foto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.pos, transform: `scale(${1.03 + f * 0.0012})`}} />
					</div>
					<div style={{padding: '22px 30px 28px', background: `linear-gradient(90deg, ${C.azul}, ${C.marino})`}}>
						<div style={{fontFamily: F.titulo, fontSize: 80, lineHeight: 1, color: C.blanco}}>{p.nombre.toUpperCase()}</div>
						<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 30, color: C.celeste, marginTop: 6}}>{p.cargo}</div>
					</div>
				</div>
				<div style={{marginTop: 34, width: 900, opacity: entra(f, 14, 6), transform: `translateY(${sube(f, 14)}px)`, display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{width: 10, alignSelf: 'stretch', background: C.oro, borderRadius: 6}} />
					<div>
						<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 28, color: C.celeste, letterSpacing: 3}}>TEMA</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 50, lineHeight: 1.15, color: C.oro}}>{p.charla}</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const Panel: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pan" />
			<Marca />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22, paddingBottom: 100}}>
				<Txt size={40} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 4)}}>Y PARA CERRAR</Txt>
				<Txt size={110} color={C.oro} style={{opacity: entra(f, 4, 4), transform: `scale(${golpe(f, 4, 1.5)})`}}>PANEL CENTRAL</Txt>
				<Txt size={44} font={F.texto} peso={700} style={{opacity: entra(f, 14, 5), maxWidth: 900}}>Los cuatro ponentes junto a dos invitados especiales:</Txt>
				<div style={{display: 'flex', gap: 16, opacity: entra(f, 24, 5)}}>
					<Pildora fondo={C.azul} color={C.blanco} size={34}>Experto tributario</Pildora>
					<Pildora fondo={C.azul} color={C.blanco} size={34}>Asesor laboral</Pildora>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 3. Patrocinadores: filas de logos en movimiento (28–38 s) ----------
const FILAS = [[1, 2, 3, 4, 5], [6, 7, 8, 9], [10, 11, 12, 13]];
const FilaLogos: React.FC<{ids: number[]; dir: 1 | -1; vel: number; f: number; d: number}> = ({ids, dir, vel, f, d}) => {
	const tam = 230, gap = 26;
	const lista = [...ids, ...ids, ...ids, ...ids];
	const ancho = ids.length * (tam + gap);
	const off = (f * vel) % ancho;
	const x = dir === -1 ? -off : off - ancho;
	return (
		<div style={{width: 1080, overflow: 'hidden', opacity: entra(f, d, 8)}}>
			<div style={{display: 'flex', gap, transform: `translateX(${x}px)`}}>
				{lista.map((n, k) => (
					<div key={k} style={{flex: `0 0 ${tam}px`, height: tam, borderRadius: 24, background: C.blanco, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}}>
						<Img src={staticFile(`logos/logo${n}.png`)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
					</div>
				))}
			</div>
		</div>
	);
};
const Patrocinadores: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 270, padding: '0 70px'}}>
				<Txt size={46} font={F.texto} peso={700} style={{opacity: entra(f, 0, 6)}}>Este evento está patrocinado por</Txt>
				<Txt size={78} color={C.oro} style={{opacity: entra(f, 8, 5), transform: `scale(${golpe(f, 8, 1.3)})`}}>LOS COMERCIOS DE LA</Txt>
				<Txt size={78} color={C.oro} style={{opacity: entra(f, 12, 5), transform: `scale(${golpe(f, 12, 1.3)})`}}>CAPITAL AMAZONENSE</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{top: 700, gap: 30, display: 'flex', flexDirection: 'column'}}>
				<FilaLogos ids={FILAS[0]} dir={-1} vel={3.2} f={f} d={14} />
				<FilaLogos ids={FILAS[1]} dir={1} vel={2.8} f={f} d={20} />
				<FilaLogos ids={FILAS[2]} dir={-1} vel={3.4} f={f} d={26} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 4. Forma parte (38–47 s) ----------
const BENEFICIOS = ['Stand publicitario en el evento', 'Logo en todo el material físico y digital', '3 menciones radiales exclusivas', 'Campaña en las redes de los ponentes', 'Perifoneo masivo', 'Pantallas dentro del evento', 'Mención en vivo desde la tarima'];
const FormaParte: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="fp" />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 260}}>
				<Txt size={92} style={{opacity: entra(f, 0, 4), transform: `scale(${golpe(f, 0, 1.4)})`}}>FORMA PARTE DE ESTO</Txt>
				<Txt size={52} font={F.texto} peso={900} color={C.oro} style={{opacity: entra(f, 8, 5)}}>Patrocina la cumbre</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 520}}>
				<div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 14}}>
					{BENEFICIOS.map((b, i) => (
						<div key={b} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: entra(f, 18 + i * 8, 4), transform: `translateX(${interpolate(f, [18 + i * 8, 28 + i * 8], [60, 0], clamp)}px)`, background: 'rgba(255,255,255,0.07)', borderRadius: 18, padding: '14px 22px'}}>
							<svg width={46} height={46} viewBox="0 0 46 46" style={{flex: '0 0 46px'}}><circle cx={23} cy={23} r={23} fill={C.oro} /><path d="M13 24 L20 31 L34 16" stroke={C.marino} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 38, color: C.blanco}}>{b}</span>
						</div>
					))}
				</div>
				<div style={{display: 'flex', gap: 20, marginTop: 30, width: 900}}>
					{[['ORO', '2 entradas VIP'], ['DIAMANTE', '3 entradas VIP']].map(([n, v], i) => (
						<div key={n} style={{flex: 1, borderRadius: 22, border: `3px solid ${C.oro}`, background: 'rgba(7,26,74,0.85)', padding: '14px 10px', textAlign: 'center', opacity: entra(f, 80 + i * 8, 5), transform: `scale(${golpe(f, 80 + i * 8, 1.4)})`}}>
							<div style={{fontFamily: F.titulo, fontSize: 62, color: C.oro, lineHeight: 1.05}}>{n}</div>
							<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.blanco}}>{v}</div>
						</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 5. Llamado y enlace (47–53 s) ----------
const Llamado: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="ll" />
			<AbsoluteFill style={{alignItems: 'center', top: 230}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 44, color: C.blanco, letterSpacing: 2, textAlign: 'center', lineHeight: 1.1, opacity: entra(f, 0, 5)}}>CUMBRE DE TRANSFORMACIÓN<br /><span style={{fontSize: 72, color: C.oro}}>EMPRESARIAL</span></div>
				<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 34, color: C.celeste, marginTop: 6, opacity: entra(f, 4, 5)}}>Amazonas 2026</div>
				<div style={{marginTop: 70, fontFamily: F.texto, fontWeight: 900, fontSize: 56, color: C.marino, background: C.oro, padding: '22px 60px', borderRadius: 70, boxShadow: `0 0 0 ${6 + 4 * Math.sin(f / 5)}px ${C.oro}55, 0 0 40px ${C.oro}`, transform: `scale(${golpe(f, 10, 0.4)})`}}>QUIERO SER PATROCINADOR</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 60, opacity: entra(f, 22, 6)}}>
					<Img src={staticFile('img/qr.png')} style={{width: 230, height: 230, borderRadius: 16, border: `8px solid ${C.blanco}`}} />
					<div style={{fontFamily: F.texto, color: C.blanco, lineHeight: 1.35}}>
						<div style={{fontWeight: 700, fontSize: 30, color: C.celeste}}>Escríbenos por WhatsApp</div>
						<div style={{fontWeight: 900, fontSize: 52, color: C.oro}}>0426-761-7944</div>
					</div>
				</div>
				<div style={{marginTop: 70, fontFamily: F.texto, fontWeight: 800, fontSize: 36, color: C.blanco, textAlign: 'center', lineHeight: 1.4, opacity: entra(f, 32, 6)}}>
					Viernes 4 de diciembre · 2:00 PM<br />Club Parapata · Puerto Ayacucho
				</div>
			</AbsoluteFill>
			<Destello en={10} dur={8} max={0.5} color={C.oro} />
		</AbsoluteFill>
	);
};

const ESCENAS: [number, number, React.FC][] = [
	[0, 5, Portada],
	[5, 10, () => <Ponente i={0} />],
	[10, 15, () => <Ponente i={1} />],
	[15, 20, () => <Ponente i={2} />],
	[20, 25, () => <Ponente i={3} />],
	[25, 28, Panel],
	[28, 38, Patrocinadores],
	[38, 47, FormaParte],
	[47, 54, Llamado],
];
export const Sencilla: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			<Audio src={staticFile('audio/efectos-sencilla.wav')} />
			{ESCENAS.map(([a, b, Comp]) => <Sequence key={a} from={S(a)} durationInFrames={S(b) - S(a)}><Comp /></Sequence>)}
		</AbsoluteFill>
	);
};
