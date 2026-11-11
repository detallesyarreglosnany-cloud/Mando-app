import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Brillos, C, Destello, F, FondoMarca, Pildora, S, clamp, entra, golpe, sombra, sube, useFuentes} from './comun';
import {T} from './tiempos';
const EMOJI = 'Montserrat, "Noto Color Emoji", sans-serif';

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
	const fase2 = S(T.gancho.fases[1]), fase3 = S(T.gancho.fases[2]);
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
	const durP = T.ponentes[i].dur;
	const lado = i % 2 ? -1 : 1;
	const x = interpolate(f, [0, 14], [lado * 700, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const sal = interpolate(f, [S(durP) - 5, S(durP)], [0, 1], clamp);
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
				<Txt size={44} font={F.texto} peso={800} color={C.celeste} style={{opacity: entra(f, S(T.patro.dur - 1.6), 6)}}>¿Y la tuya?</Txt>
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
	const fases = T.ben.fases;
	const etapa = [S(fases[1]), S(fases[2]), S(fases[3])];
	const k = f < etapa[0] ? -1 : f < etapa[1] ? 0 : f < etapa[2] ? 1 : 2;
	const lf = k < 0 ? 0 : f - etapa[k];
	const e = ETAPAS[Math.max(0, k)];
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="pq" />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: k < 0 ? 560 : 230}}>
				<Txt size={k < 0 ? 104 : 62} color={C.oro} style={{opacity: entra(f, 0, 4), transform: `scale(${golpe(f, 0, 1.4)})`, lineHeight: 1}}>BENEFICIOS DE SER PATROCINADOR</Txt>
				<Txt size={k < 0 ? 64 : 40} font={F.texto} peso={900} style={{marginTop: 18, opacity: entra(f, 10, 5), maxWidth: 940}}>No pagas por un día. <span style={{color: C.celeste}}>Pagas por una campaña.</span></Txt>
			</AbsoluteFill>
			{k >= 0 && (
				<>
					<AbsoluteFill style={{top: 470, flexDirection: 'row', justifyContent: 'center', gap: 16, height: 80}}>
						{ETAPAS.map((x, i) => (
							<div key={x.titulo} style={{width: 290, height: 70, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.titulo, fontSize: 40, color: i === k ? C.marino : C.blanco, background: i === k ? C.oro : i < k ? C.azul : 'rgba(255,255,255,0.08)', border: `2px solid ${i <= k ? C.oro : C.celeste + '55'}`}}>{x.titulo}</div>
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
				</>
			)}
		</AbsoluteFill>
	);
};

// ---------- 6. Paquetes: Oro y Diamante con sus beneficios ----------
const COMUNES: [string, string][] = [['🏪', 'Stand publicitario'], ['📻', '3 menciones radiales'], ['📢', 'Perifoneo masivo'], ['📱', 'Redes de los 4 ponentes'], ['🖥️', 'Pantallas del evento'], ['🎤', 'Mención en tarima'], ['🗂️', 'Logo en material físico y digital']];
const Paquetes: React.FC = () => {
	const f = useCurrentFrame();
	const columna = (i: number) => {
		const diamante = i === 1;
		const d = 10 + i * 16;
		return (
			<div style={{width: 500, display: 'flex', flexDirection: 'column', alignItems: 'stretch', opacity: entra(f, d, 5), transform: `translateY(${sube(f, d, 80)}px)`}}>
				<div style={{position: 'relative', borderRadius: 30, border: `${diamante ? 6 : 3}px solid ${diamante ? C.celeste : C.oro}`, background: diamante ? `linear-gradient(160deg, #2D6BFF, ${C.marino})` : 'rgba(7,26,74,0.9)', padding: '40px 10px 30px', textAlign: 'center', boxShadow: diamante ? `0 0 ${50 + 15 * Math.sin(f / 6)}px ${C.celeste}88` : 'none'}}>
					{diamante && <div style={{position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: EMOJI, fontWeight: 900, fontSize: 26, color: C.marino, background: C.oro, padding: '8px 22px', borderRadius: 30, boxShadow: `0 0 20px ${C.oro}`}}>⭐ EL MÁS COMPLETO</div>}
					<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 4}}>PATROCINIO</div>
					<div style={{fontFamily: EMOJI, fontSize: 64, margin: '6px 0'}}>{diamante ? '💎' : '🥇'}</div>
					<div style={{fontFamily: F.titulo, fontSize: 104, color: diamante ? C.blanco : C.oro, lineHeight: 1}}>{diamante ? 'DIAMANTE' : 'ORO'}</div>
				</div>
				<div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, background: diamante ? C.oro : 'rgba(242,194,48,0.18)', borderRadius: 18, padding: '18px 16px', opacity: entra(f, d + 12, 4)}}>
						<span style={{fontFamily: EMOJI, fontSize: 40}}>🎟️</span>
						<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 36, color: diamante ? C.marino : C.oro}}>{diamante ? '3 entradas VIP' : '2 entradas VIP'}</span>
					</div>
					{diamante && <div style={{fontFamily: EMOJI, fontWeight: 800, fontSize: 28, color: C.oro, textAlign: 'center', marginTop: -2, opacity: entra(f, d + 16, 4)}}>👥 +1 entrada para tu equipo</div>}
					{COMUNES.map(([em, t], k) => (
						<div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)', opacity: entra(f, d + 18 + k * 4, 4)}}>
							<span style={{fontFamily: EMOJI, fontSize: 38, width: 50, textAlign: 'center'}}>{em}</span>
							<span style={{fontFamily: F.texto, fontWeight: 700, fontSize: 32, color: C.blanco, lineHeight: 1.2}}>{t}</span>
						</div>
					))}
				</div>
			</div>
		);
	};
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="paq" />
			<Marca />
			<AbsoluteFill style={{alignItems: 'center', top: 230}}>
				<Txt size={86} style={{opacity: entra(f, 0, 4), transform: `scale(${golpe(f, 0, 1.4)})`}}>ELIGE TU NIVEL</Txt>
			</AbsoluteFill>
			<AbsoluteFill style={{top: 410, flexDirection: 'row', justifyContent: 'center', gap: 26, alignItems: 'flex-start'}}>
				{columna(0)}
				{columna(1)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 7. Llamado con teléfono y detalles ----------
const DETALLES: [string, string][] = [
	['🏆', 'Cumbre de Transformación Empresarial · Amazonas 2026'],
	['📅', 'Viernes 4 de diciembre'],
	['🕑', 'Desde las 2:00 PM'],
	['📍', 'Club Parapata, Puerto Ayacucho'],
	['🎤', '4 ponentes + panel tributario y laboral'],
	['☕', '2 coffee breaks con recorrido por los stands'],
	['🤝', 'Networking con empresarios de la región'],
];
const Llamado: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<FondoMarca />
			<Brillos semilla="ll" />
			<AbsoluteFill style={{alignItems: 'center', top: 170, padding: '0 50px'}}>
				<Txt size={58} font={F.texto} peso={900} style={{opacity: entra(f, 0, 5)}}>Pon tu marca frente a los</Txt>
				<Txt size={58} font={F.texto} peso={900} color={C.oro} style={{opacity: entra(f, 4, 5)}}>dueños de negocio de Amazonas.</Txt>
				<div style={{marginTop: 50, fontFamily: F.texto, fontWeight: 900, fontSize: 50, whiteSpace: 'nowrap', color: C.marino, background: C.oro, padding: '20px 50px', borderRadius: 70, boxShadow: `0 0 0 ${6 + 4 * Math.sin(f / 5)}px ${C.oro}55, 0 0 40px ${C.oro}`, transform: `scale(${golpe(f, 12, 0.4)})`}}>QUIERO SER PATROCINADOR</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 56, opacity: entra(f, 20, 6)}}>
					<Img src={staticFile('img/qr.png')} style={{width: 270, height: 270, borderRadius: 16, border: `8px solid ${C.blanco}`}} />
					<div style={{fontFamily: EMOJI, color: C.blanco, lineHeight: 1.35}}>
						<div style={{fontWeight: 700, fontSize: 32, color: C.celeste}}>Escríbenos por WhatsApp</div>
						<div style={{fontWeight: 900, fontSize: 54, color: C.oro}}>wa.link/8e9pr6</div>
						<div style={{fontWeight: 900, fontSize: 50, color: C.blanco, marginTop: 8}}>📞 0412-272-1986</div>
					</div>
				</div>
				<div style={{marginTop: 60, width: 980, borderRadius: 30, border: `2px solid ${C.celeste}55`, background: 'rgba(255,255,255,0.06)', padding: '34px 32px', display: 'flex', flexDirection: 'column', gap: 24}}>
					{DETALLES.map(([em, t], k) => (
						<div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: entra(f, 30 + k * 5, 5), transform: `translateX(${interpolate(f, [30 + k * 5, 40 + k * 5], [40, 0], clamp)}px)`}}>
							<span style={{fontFamily: EMOJI, fontSize: 46, width: 62, textAlign: 'center'}}>{em}</span>
							<span style={{fontFamily: F.texto, fontWeight: k === 0 ? 900 : 700, fontSize: k === 0 ? 34 : 38, color: k === 0 ? C.oro : C.blanco, lineHeight: 1.2}}>{t}</span>
						</div>
					))}
				</div>
			</AbsoluteFill>
			<Destello en={12} dur={8} max={0.5} color={C.oro} />
		</AbsoluteFill>
	);
};

type Tramo = {start: number; dur: number};
const ESCENAS: [Tramo, React.FC][] = [
	[T.gancho, Gancho],
	[T.portada, Portada],
	[T.ponentes[0], () => <Ponente i={0} />],
	[T.ponentes[1], () => <Ponente i={1} />],
	[T.ponentes[2], () => <Ponente i={2} />],
	[T.ponentes[3], () => <Ponente i={3} />],
	[T.panel, Panel],
	[T.patro, Patrocinadores],
	[T.ben, PorQue],
	[T.paq, Paquetes],
	[T.fin, Llamado],
];
export const DURACION_VOZ = T.total;
export const DirectoVoz: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			<Audio src={staticFile('audio/mezcla-directo.wav')} />
			{ESCENAS.map(([tr, Comp], i) => {
				const fin = i < ESCENAS.length - 1 ? S(ESCENAS[i + 1][0].start) : S(T.total);
				return <Sequence key={i} from={S(tr.start)} durationInFrames={fin - S(tr.start)}><Comp /></Sequence>;
			})}
		</AbsoluteFill>
	);
};
