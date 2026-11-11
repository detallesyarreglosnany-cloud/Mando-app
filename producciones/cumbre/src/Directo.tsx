import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';

const Txt: React.FC<{children: React.ReactNode; size: number; font?: string; color?: string; peso?: number; style?: React.CSSProperties}> = ({children, size, font = F.titulo, color = C.blanco, peso, style}) => (
	<div style={{fontFamily: font, fontWeight: peso, fontSize: size, lineHeight: 1.1, color, textAlign: 'center', textShadow: sombra, ...style}}>{children}</div>
);
const Marca: React.FC = () => (
	<AbsoluteFill style={{alignItems: 'center', top: 110}}>
		<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: C.blanco}}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</div>
		<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 24, color: C.celeste}}>Amazonas 2026 · 4 de diciembre</div>
	</AbsoluteFill>
);
const Check: React.FC<{s?: number}> = ({s = 44}) => (
	<svg width={s} height={s} viewBox="0 0 46 46" style={{flex: `0 0 ${s}px`}}><circle cx={23} cy={23} r={23} fill={C.oro} /><path d="M13 24 L20 31 L34 16" stroke={C.marino} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ---------- 1. Gancho (0–10 s) ----------
const Gancho: React.FC = () => {
	const f = useCurrentFrame();
	const fase2 = S(3.6), fase3 = S(7.0);
	const fichas = ['Vender más', 'Cuidar su dinero', 'Digitalizarse', 'Posicionar su marca'];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="g" n={34} />
			{f < fase2 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 70px', gap: 10}}>
					<Txt size={50} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, 0, 5)}}>El 4 de diciembre,</Txt>
					<Txt size={104} style={{opacity: entra(f, 8, 4), transform: `scale(${golpe(f, 8, 1.4)})`}}>LOS DUEÑOS DE NEGOCIO</Txt>
					<Txt size={104} color={C.oro} style={{opacity: entra(f, 16, 4), transform: `scale(${golpe(f, 16, 1.4)})`}}>DE AMAZONAS</Txt>
					<Txt size={54} font={F.texto} peso={800} style={{opacity: entra(f, 30, 6)}}>van a estar en una sola sala.</Txt>
				</AbsoluteFill>
			)}
			{f >= fase2 && f < fase3 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 22, padding: '0 70px'}}>
					<Txt size={58} font={F.texto} peso={800} style={{opacity: entra(f, fase2, 5)}}>Siete horas aprendiendo a</Txt>
					{fichas.map((x, i) => (
						<div key={x} style={{opacity: entra(f, fase2 + 10 + i * 9, 3), transform: `scale(${golpe(f, fase2 + 10 + i * 9, 1.5)})`}}>
							<Pildora fondo={i % 2 ? C.azul : C.oro} color={i % 2 ? C.blanco : C.marino} size={52}>{x}</Pildora>
						</div>
					))}
				</AbsoluteFill>
			)}
			{f >= fase3 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 14, padding: '0 70px'}}>
					<Txt size={54} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, fase3, 4)}}>La pregunta es:</Txt>
					<Txt size={128} color={C.oro} style={{opacity: entra(f, fase3 + 8, 3), transform: `scale(${golpe(f, fase3 + 8, 1.8)})`, textShadow: `0 0 40px ${C.oro}66, ${sombra}`}}>¿TU MARCA</Txt>
					<Txt size={128} style={{opacity: entra(f, fase3 + 14, 3), transform: `scale(${golpe(f, fase3 + 14, 1.8)})`}}>VA A ESTAR AHÍ?</Txt>
				</AbsoluteFill>
			)}
			<Destello en={fase2} dur={6} max={0.4} color={C.celeste} />
			<Destello en={fase3} dur={6} max={0.5} color={C.oro} />
		</AbsoluteFill>
	);
};

// ---------- 2. La cumbre (10–14 s) ----------
const Portada: React.FC = () => {
	const f = useCurrentFrame();
	const datos: [string, string, number][] = [['FECHA', 'Viernes 4 de diciembre', 26], ['HORA', 'Desde las 2:00 PM', 32], ['LUGAR', 'Club Parapata · Puerto Ayacucho', 38]];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="por" />
			<AbsoluteFill style={{alignItems: 'center', top: 380}}>
				<Txt size={44} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 4)}}>CUMBRE DE</Txt>
				<Txt size={118} style={{opacity: entra(f, 2, 3), transform: `scale(${golpe(f, 2, 1.4)})`}}>TRANSFORMACIÓN</Txt>
				<Txt size={118} color={C.oro} style={{opacity: entra(f, 6, 3), transform: `scale(${golpe(f, 6, 1.4)})`}}>EMPRESARIAL</Txt>
				<div style={{marginTop: 16, opacity: entra(f, 12, 4)}}><Pildora fondo={C.azul} color={C.blanco} size={36}>AMAZONAS 2026</Pildora></div>
				<div style={{marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16, width: 880}}>
					{datos.map(([k, v, d]) => (
						<div key={k} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: entra(f, d, 4), transform: `translateX(${interpolate(f, [d, d + 8], [-80, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`, background: 'rgba(255,255,255,0.08)', border: `2px solid ${C.celeste}55`, borderRadius: 20, padding: '14px 26px'}}>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: C.oro, width: 120}}>{k}</span>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 40, color: C.blanco}}>{v}</span>
						</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 3. Ponentes sobre fondo limpio (14–30 s) + panel (30–33 s) ----------
const PONENTES = [
	{nombre: ['JOSÉ', 'RODRÍGUEZ'], cargo: 'Asesor en Ventas y Liderazgo Comercial', tema: 'Conecta, vende y lidera con estrategia', foto: 'img/jose-recorte.png'},
	{nombre: ['JUAN ERNESTO', 'SIERRA'], cargo: 'Asesor en Finanzas', tema: 'Finanzas inteligentes y ganancias reales', foto: 'img/juan-recorte.png'},
	{nombre: ['DANIELA', 'SILVA'], cargo: 'Desarrolladora de Soluciones Digitales', tema: 'Tu negocio en piloto automático digital', foto: 'img/daniela-recorte.png'},
	{nombre: ['TANIA', 'ALZURU'], cargo: 'Asesora en Neuromarketing', tema: 'De emprendedor a empresario exitoso', foto: 'img/tania-recorte.png'},
];
const Ponente: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const p = PONENTES[i];
	const lado = i % 2 ? -1 : 1;
	const x = interpolate(f, [0, 14], [lado * 700, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const sal = interpolate(f, [S(4) - 5, S(4)], [0, 1], clamp);
	return (
		<AbsoluteFill style={{opacity: 1 - sal * 0.6}}>
			<FondoMarca />
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 72%, ${C.azul}AA 0%, transparent 45%)`}} />
			<div style={{position: 'absolute', left: 540 - 330, top: 900, width: 660, height: 660, borderRadius: '50%', border: `6px solid ${C.oro}`, opacity: entra(f, 2, 8), transform: `scale(${golpe(f, 2, 0.6)})`, boxShadow: `0 0 60px ${C.oro}55, inset 0 0 60px ${C.oro}33`}} />
			<Brillos semilla={`p${i}`} n={18} />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 230}}>
				<Txt size={30} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 4), marginBottom: 18}}>PONENTE {i + 1} DE 4</Txt>
				<Txt size={108} style={{opacity: entra(f, 3, 3), transform: `scale(${golpe(f, 3, 1.4)})`, lineHeight: 1}}>{p.nombre[0]}</Txt>
				<Txt size={108} color={C.oro} style={{opacity: entra(f, 6, 3), transform: `scale(${golpe(f, 6, 1.4)})`, lineHeight: 1}}>{p.nombre[1]}</Txt>
				<Txt size={32} font={F.texto} peso={700} color={C.celeste} style={{marginTop: 8, opacity: entra(f, 10, 5)}}>{p.cargo}</Txt>
				<div style={{marginTop: 22, opacity: entra(f, 16, 5), transform: `translateY(${sube(f, 16, 30)}px)`, background: C.blanco, borderRadius: 18, padding: '12px 28px', boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>
					<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.azul}}>TEMA · </span>
					<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 36, color: C.marino}}>{p.tema}</span>
				</div>
			</AbsoluteFill>
			<Img src={staticFile(p.foto)} style={{position: 'absolute', bottom: 0, left: '50%', height: 1060, transform: `translateX(calc(-50% + ${x}px))`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, transparent 85%, ${C.marino} 100%)`}} />
		</AbsoluteFill>
	);
};
const Panel: React.FC = () => {
	const f = useCurrentFrame();
	const fotos = PONENTES.map((p) => p.foto);
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 400, gap: 14}}>
				<Txt size={34} font={F.texto} peso={800} color={C.celeste} style={{letterSpacing: 6, opacity: entra(f, 0, 4)}}>Y PARA CERRAR</Txt>
				<Txt size={120} color={C.oro} style={{opacity: entra(f, 3, 3), transform: `scale(${golpe(f, 3, 1.5)})`}}>PANEL CENTRAL</Txt>
				<Txt size={40} font={F.texto} peso={700} style={{opacity: entra(f, 10, 5)}}>Los cuatro ponentes, junto a:</Txt>
				<div style={{display: 'flex', gap: 14, opacity: entra(f, 16, 5)}}>
					<Pildora fondo={C.azul} color={C.blanco} size={32}>Experto tributario</Pildora>
					<Pildora fondo={C.azul} color={C.blanco} size={32}>Asesor laboral</Pildora>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 900, display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
				{fotos.map((src, i) => (
					<Img key={src} src={staticFile(src)} style={{height: i === 1 || i === 2 ? 700 : 650, marginLeft: i ? -190 : 0, zIndex: i === 1 || i === 2 ? 2 : 1, opacity: entra(f, 4 + i * 3, 4), transform: `translateY(${sube(f, 4 + i * 3, 200)}px)`, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'}} />
				))}
			</div>
			<AbsoluteFill style={{background: `linear-gradient(180deg, transparent 88%, ${C.marino} 100%)`}} />
		</AbsoluteFill>
	);
};

// ---------- 4. Patrocinadores (33–42 s) ----------
const FILAS = [[1, 2, 3, 4, 5, 14], [6, 7, 8, 9, 15], [10, 11, 12, 13, 16]];
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
			<AbsoluteFill style={{alignItems: 'center', top: 250, padding: '0 70px'}}>
				<Txt size={44} font={F.texto} peso={700} style={{opacity: entra(f, 0, 5)}}>Esta cumbre ya cuenta con el respaldo de</Txt>
				<Txt size={92} color={C.oro} style={{opacity: entra(f, 6, 4), transform: `scale(${golpe(f, 6, 1.4)})`}}>16 COMERCIOS</Txt>
				<Txt size={58} style={{opacity: entra(f, 10, 4)}}>DE LA CAPITAL AMAZONENSE</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{top: 680, gap: 30, display: 'flex', flexDirection: 'column'}}>
				<FilaLogos ids={FILAS[0]} dir={-1} vel={3.2} f={f} d={12} />
				<FilaLogos ids={FILAS[1]} dir={1} vel={2.8} f={f} d={18} />
				<FilaLogos ids={FILAS[2]} dir={-1} vel={3.4} f={f} d={24} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 230}}>
				<Txt size={44} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, S(5.5), 6)}}>¿Y la tuya?</Txt>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 5. Por qué patrocinar: antes, durante y después (42–56 s) ----------
const ETAPAS: {titulo: string; sub: string; items: string[]}[] = [
	{titulo: 'ANTES', sub: 'del evento', items: ['3 menciones radiales exclusivas', 'Perifoneo masivo por la ciudad', 'Tu marca en las redes de los 4 ponentes', 'Tu logo en todo el material físico y digital']},
	{titulo: 'DURANTE', sub: 'la cumbre', items: ['Stand para exhibir y vender cara a cara', '2 recorridos del público por los stands', 'Tu marca en las pantallas del evento', 'Mención en vivo desde la tarima']},
	{titulo: 'DESPUÉS', sub: 'del evento', items: ['Contactos directos con dueños de negocio', 'Tu marca asociada a los especialistas', 'Networking final con tomadores de decisión']},
];
const PorQue: React.FC = () => {
	const f = useCurrentFrame();
	const dur = S(4.2);
	const k = Math.min(2, Math.floor(f / dur));
	const lf = f - k * dur;
	const e = ETAPAS[k];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pq" />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 240}}>
				<Txt size={40} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, 0, 5)}}>¿Por qué patrocinar?</Txt>
				<Txt size={58} font={F.texto} peso={900} style={{opacity: entra(f, 4, 5), maxWidth: 940}}>No pagas por un día. <span style={{color: C.oro}}>Pagas por una campaña.</span></Txt>
			</AbsoluteFill>
			{/* barra de progreso de las etapas */}
			<AbsoluteFill style={{top: 470, flexDirection: 'row', justifyContent: 'center', gap: 16, height: 80}}>
				{ETAPAS.map((x, i) => (
					<div key={x.titulo} style={{width: 290, height: 70, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titulo, fontSize: 40, color: i === k ? C.marino : C.blanco, background: i === k ? C.oro : i < k ? `${C.azul}` : 'rgba(255,255,255,0.08)', border: `2px solid ${i <= k ? C.oro : C.celeste + '55'}`, transition: 'none'}}>{x.titulo}</div>
				))}
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', top: 600}}>
				<Txt size={120} color={C.oro} style={{opacity: entra(lf, 0, 3), transform: `scale(${golpe(lf, 0, 1.5)})`, lineHeight: 1}}>{e.titulo}</Txt>
				<Txt size={44} font={F.texto} peso={700} color={C.celeste} style={{opacity: entra(lf, 3, 4)}}>{e.sub}</Txt>
				<div style={{marginTop: 34, width: 920, display: 'flex', flexDirection: 'column', gap: 16}}>
					{e.items.map((t, i) => (
						<div key={t} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: entra(lf, 10 + i * 9, 4), transform: `translateX(${interpolate(lf, [10 + i * 9, 20 + i * 9], [60, 0], clamp)}px)`, background: 'rgba(255,255,255,0.08)', border: `2px solid ${C.celeste}33`, borderRadius: 20, padding: '18px 24px'}}>
							<Check />
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 40, color: C.blanco, lineHeight: 1.2}}>{t}</span>
						</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 6. Paquetes (56–61 s) ----------
const Paquetes: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="paq" />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 300}}>
				<Txt size={46} font={F.texto} peso={800} style={{opacity: entra(f, 0, 5)}}>Todo eso, en dos niveles:</Txt>
				<div style={{display: 'flex', gap: 24, marginTop: 50}}>
					{[['ORO', '2', 'entradas VIP'], ['DIAMANTE', '3', 'entradas VIP']].map(([n, v, t], i) => (
						<div key={n} style={{width: 440, borderRadius: 30, border: `4px solid ${C.oro}`, background: i ? `linear-gradient(160deg, ${C.azul}, ${C.marino})` : 'rgba(7,26,74,0.85)', padding: '34px 10px', textAlign: 'center', opacity: entra(f, 8 + i * 8, 4), transform: `scale(${golpe(f, 8 + i * 8, 1.4)})`, boxShadow: i ? `0 0 50px ${C.celeste}55` : 'none'}}>
							<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 28, color: C.celeste, letterSpacing: 4}}>PATROCINIO</div>
							<div style={{fontFamily: F.titulo, fontSize: 96, color: C.oro, lineHeight: 1.05}}>{n}</div>
							<div style={{fontFamily: F.titulo, fontSize: 150, color: C.blanco, lineHeight: 1}}>{v}</div>
							<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: C.blanco}}>{t}</div>
						</div>
					))}
				</div>
				<Txt size={36} font={F.texto} peso={700} color={C.celeste} style={{marginTop: 40, opacity: entra(f, 30, 6), maxWidth: 900}}>Ambos incluyen stand, radio, perifoneo, redes de los ponentes, pantallas y mención en tarima.</Txt>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 7. Llamado (61–68 s) ----------
const Llamado: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="ll" />
			<AbsoluteFill style={{alignItems: 'center', top: 230, padding: '0 60px'}}>
				<Txt size={58} font={F.texto} peso={900} style={{opacity: entra(f, 0, 5)}}>Pon tu marca frente a los</Txt>
				<Txt size={58} font={F.texto} peso={900} color={C.oro} style={{opacity: entra(f, 4, 5)}}>dueños de negocio de Amazonas.</Txt>
				<div style={{marginTop: 60, fontFamily: F.texto, fontWeight: 900, fontSize: 46, whiteSpace: 'nowrap', color: C.marino, background: C.oro, padding: '22px 50px', borderRadius: 70, boxShadow: `0 0 0 ${6 + 4 * Math.sin(f / 5)}px ${C.oro}55, 0 0 40px ${C.oro}`, transform: `scale(${golpe(f, 12, 0.4)})`}}>QUIERO SER PATROCINADOR</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 60, opacity: entra(f, 22, 6)}}>
					<Img src={staticFile('img/qr.png')} style={{width: 230, height: 230, borderRadius: 16, border: `8px solid ${C.blanco}`}} />
					<div style={{fontFamily: F.texto, color: C.blanco, lineHeight: 1.35}}>
						<div style={{fontWeight: 700, fontSize: 30, color: C.celeste}}>Escríbenos por WhatsApp</div>
						<div style={{fontWeight: 900, fontSize: 52, color: C.oro}}>wa.link/8e9pr6</div>
					</div>
				</div>
				<div style={{marginTop: 60, fontFamily: F.texto, fontWeight: 800, fontSize: 34, color: C.blanco, textAlign: 'center', lineHeight: 1.4, opacity: entra(f, 32, 6)}}>
					Cumbre de Transformación Empresarial · Amazonas 2026<br />Viernes 4 de diciembre · 2:00 PM · Club Parapata
				</div>
			</AbsoluteFill>
			<Destello en={12} dur={8} max={0.5} color={C.oro} />
		</AbsoluteFill>
	);
};

const ESCENAS: [number, number, React.FC][] = [
	[0, 10, Gancho],
	[10, 14, Portada],
	[14, 18, () => <Ponente i={0} />],
	[18, 22, () => <Ponente i={1} />],
	[22, 26, () => <Ponente i={2} />],
	[26, 30, () => <Ponente i={3} />],
	[30, 33, Panel],
	[33, 42, Patrocinadores],
	[42, 55, PorQue],
	[55, 61, Paquetes],
	[61, 68, Llamado],
];
export const DURACION_DIRECTO = 68;
export const Directo: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			<Audio src={staticFile('audio/efectos-directo.wav')} />
			{ESCENAS.map(([a, b, Comp]) => <Sequence key={a} from={S(a)} durationInFrames={S(b) - S(a)}><Comp /></Sequence>)}
		</AbsoluteFill>
	);
};
