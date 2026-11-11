import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// Lienzo de diseño: 1600 × 2400 px = 80 × 120 cm (1 cm = 20 px). Se exporta a 150 ppp reales.
// Margen de seguridad para ojales y tubos: 4 cm = 80 px.
const M = 80;
const C = {marino: '#071A4A', azul: '#1E4FD8', celeste: '#4FC3F7', oro: '#F2C230', blanco: '#FFFFFF', hielo: '#F3F6FC', tinta: '#0B1B3F'};
const F = {titulo: 'Anton, sans-serif', texto: 'Montserrat, sans-serif'};

const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`), new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat.ttf')})`, {weight: '100 900'})];
		Promise.all(caras.map((c) => c.load())).then((cs) => {
			cs.forEach((c) => document.fonts.add(c));
			continueRender(h);
		});
	}, [h]);
};

const PONENTES = [
	{nombre: 'JOSÉ RODRÍGUEZ', logro: 'Vende más', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png'},
	{nombre: 'JUAN E. SIERRA', logro: 'Gana más', tema: 'Finanzas y ganancias', foto: 'img/juan-recorte.png'},
	{nombre: 'DANIELA SILVA', logro: 'Vende 24/7', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png'},
	{nombre: 'TANIA ALZURU', logro: 'Que te elijan', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png'},
];
const PUBLICO = ['Líderes con personal a su cargo', 'Dueños de comercio', 'Emprendedores con negocio en marcha', 'De marca personal a marca empresarial'];

// ---------- Bloques comunes ----------
const Evento: React.FC<{oscuro: boolean}> = ({oscuro}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 44, letterSpacing: 4, color: oscuro ? C.blanco : C.tinta}}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</div>
		<div style={{marginTop: 10, fontFamily: F.texto, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: C.marino, background: C.oro, padding: '6px 26px', borderRadius: 40}}>AMAZONAS 2026</div>
	</div>
);

const QR: React.FC<{tam: number; fondo?: string}> = ({tam, fondo = C.blanco}) => (
	<div style={{background: fondo, padding: tam * 0.07, borderRadius: tam * 0.08, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', width: tam, height: tam, boxSizing: 'border-box'}}>
		<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
	</div>
);

const Datos: React.FC<{color: string; acento: string; size?: number}> = ({color, acento, size = 44}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: size * 0.32, fontFamily: F.texto, color}}>
		{[['VIERNES', '4 DE DICIEMBRE'], ['DESDE LAS', '2:00 PM'], ['CLUB PARAPATA', 'Puerto Ayacucho']].map(([a, b]) => (
			<div key={a} style={{lineHeight: 1.05}}>
				<div style={{fontWeight: 700, fontSize: size * 0.55, letterSpacing: 3, color: acento}}>{a}</div>
				<div style={{fontWeight: 900, fontSize: size}}>{b}</div>
			</div>
		))}
	</div>
);

const Logos: React.FC<{alto?: number}> = ({alto = 300}) => (
	<div style={{background: C.blanco, borderRadius: 26, padding: '18px 26px', height: alto, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 26, letterSpacing: 6, color: C.marino}}>CON EL RESPALDO DE</div>
		<div style={{flex: 1, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 10, minHeight: 0}}>
			{new Array(16).fill(0).map((_, i) => (
				<div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 10, minHeight: 0, minWidth: 0}}>
					<Img src={staticFile(`logos/logo${i + 1}.png`)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
				</div>
			))}
		</div>
	</div>
);

// Íconos vectoriales simples (los emojis se pixelan al imprimir en grande)
const Icono: React.FC<{tipo: number; s: number; color: string}> = ({tipo, s, color}) => {
	const p = {fill: 'none', stroke: color, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	return (
		<svg width={s} height={s} viewBox="0 0 64 64">
			{tipo === 0 && <><path d="M8 44 L24 28 L34 38 L56 16" {...p} /><path d="M42 16 H56 V30" {...p} /></>}
			{tipo === 1 && <><circle cx={32} cy={32} r={22} {...p} /><path d="M32 18 V46 M40 24 Q32 18 25 23 Q20 30 32 32 Q44 34 39 41 Q32 46 24 40" {...p} /></>}
			{tipo === 2 && <><rect x={18} y={6} width={28} height={52} rx={6} {...p} /><path d="M28 50 H36" {...p} /><path d="M26 22 L32 28 L40 18" {...p} /></>}
			{tipo === 3 && <><path d="M32 54 L12 34 Q4 24 12 16 Q20 8 32 20 Q44 8 52 16 Q60 24 52 34 Z" {...p} /></>}
		</svg>
	);
};

// ---------- VERSIÓN A · "Prepara tu negocio para el 2027" (fondo azul noche) ----------
export const PendonA: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #163C9E 0%, ${C.marino} 55%, #030B24 100%)`}}>
			<AbsoluteFill style={{opacity: 0.18, background: `repeating-linear-gradient(112deg, transparent 0 70px, ${C.celeste}33 70px 73px)`}} />
			<AbsoluteFill style={{alignItems: 'center', top: M + 10}}>
				<Evento oscuro />
				<div style={{marginTop: 46, fontFamily: F.titulo, fontSize: 168, lineHeight: 0.95, color: C.blanco, textAlign: 'center'}}>PREPARA TU NEGOCIO</div>
				<div style={{fontFamily: F.titulo, fontSize: 236, lineHeight: 0.95, color: C.oro, textShadow: `0 0 50px ${C.oro}55`}}>PARA EL 2027</div>
				<div style={{marginTop: 22, width: 1300, fontFamily: F.texto, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: C.blanco, textAlign: 'center'}}>
					Herramientas reales para vender más, ganar más y <span style={{color: C.celeste}}>competir en lo que viene para Venezuela.</span>
				</div>
			</AbsoluteFill>
			{/* ponentes */}
			<div style={{position: 'absolute', left: M, right: M, top: 820, height: 560, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
				{PONENTES.map((p, i) => (
					<div key={p.nombre} style={{width: 350, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{position: 'relative', width: 330, height: 420, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '165px 165px 24px 24px', background: `linear-gradient(180deg, ${C.azul}AA, ${C.marino})`, border: `5px solid ${C.oro}`}}>
							<Img src={staticFile(p.foto)} style={{height: 400, objectFit: 'contain'}} />
						</div>
						<div style={{marginTop: 14, fontFamily: F.titulo, fontSize: 40, color: C.blanco, whiteSpace: 'nowrap'}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 34, color: C.oro}}>{p.logro}</div>
						<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 24, color: C.celeste}}>{p.tema}</div>
					</div>
				))}
			</div>
			<AbsoluteFill style={{top: 1400, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.blanco, background: 'rgba(255,255,255,0.10)', border: `2px solid ${C.celeste}66`, padding: '10px 30px', borderRadius: 40}}>+ Panel con experto tributario y asesor laboral</div>
				<div style={{marginTop: 26, fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.oro}}>DISEÑADA PARA</div>
				<div style={{marginTop: 10, width: 1440, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14}}>
					{PUBLICO.map((t) => <div key={t} style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.marino, background: C.blanco, padding: '10px 24px', borderRadius: 40}}>{t}</div>)}
				</div>
			</AbsoluteFill>
			{/* datos + QR */}
			<div style={{position: 'absolute', left: M, right: M, top: 1660, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<Datos color={C.blanco} acento={C.celeste} size={50} />
				<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
					<div style={{textAlign: 'right', fontFamily: F.texto}}>
						<div style={{fontWeight: 900, fontSize: 54, color: C.oro, lineHeight: 1}}>ESCANEA</div>
						<div style={{fontWeight: 900, fontSize: 40, color: C.blanco, lineHeight: 1.15}}>Y COMPRA<br />TU ENTRADA</div>
						<div style={{marginTop: 12, fontWeight: 900, fontSize: 46, color: C.marino, background: C.oro, padding: '4px 18px', borderRadius: 14, display: 'inline-block'}}>$50</div>
						<div style={{marginTop: 10, fontWeight: 700, fontSize: 28, color: C.celeste}}>0412-272-1986</div>
					</div>
					<QR tam={320} />
				</div>
			</div>
			<div style={{position: 'absolute', left: M, right: M, bottom: M}}><Logos alto={290} /></div>
		</AbsoluteFill>
	);
};

// ---------- VERSIÓN B · "Lidera. Vende. Crece." (fondo claro, máxima legibilidad en la calle) ----------
export const PendonB: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.hielo}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1180, background: `linear-gradient(160deg, ${C.azul} 0%, ${C.marino} 70%)`, clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)'}} />
			<AbsoluteFill style={{alignItems: 'center', top: M + 10}}>
				<Evento oscuro />
				<div style={{marginTop: 40, display: 'flex', gap: 30, fontFamily: F.titulo, fontSize: 200, lineHeight: 1}}>
					<span style={{color: C.blanco}}>LIDERA.</span><span style={{color: C.oro}}>VENDE.</span>
				</div>
				<div style={{fontFamily: F.titulo, fontSize: 280, lineHeight: 0.9, color: C.blanco}}>CRECE.</div>
				<div style={{marginTop: 16, width: 1300, fontFamily: F.texto, fontWeight: 700, fontSize: 42, lineHeight: 1.3, color: C.blanco, textAlign: 'center'}}>
					La cumbre para líderes y dueños de negocio que <span style={{color: C.oro}}>se preparan para el 2027.</span>
				</div>
			</AbsoluteFill>
			{/* ponentes en círculos sobre la diagonal */}
			<div style={{position: 'absolute', left: M, right: M, top: 940, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 350, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 330, height: 330, borderRadius: '50%', overflow: 'hidden', background: `radial-gradient(circle at 50% 35%, #DCE6FF, #9FB6F0)`, border: `8px solid ${C.oro}`, boxShadow: '0 14px 30px rgba(7,26,74,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
							<Img src={staticFile(p.foto)} style={{width: 330, marginTop: 10, objectFit: 'cover'}} />
						</div>
						<div style={{marginTop: 16, fontFamily: F.titulo, fontSize: 42, color: C.tinta, whiteSpace: 'nowrap'}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 34, color: C.azul}}>{p.logro}</div>
					</div>
				))}
			</div>
			<AbsoluteFill style={{top: 1460, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.azul}}>PARA QUIENES TIENEN PERSONAL A SU CARGO, UN COMERCIO</div>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.azul}}>O UN NEGOCIO EN MARCHA</div>
			</AbsoluteFill>
			{/* tarjeta de compra */}
			<div style={{position: 'absolute', left: M, right: M, top: 1590, height: 470, borderRadius: 34, background: C.marino, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxShadow: '0 20px 40px rgba(7,26,74,0.35)'}}>
				<Datos color={C.blanco} acento={C.celeste} size={48} />
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<QR tam={330} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 34, color: C.oro}}>ESCANEA Y COMPRA TU ENTRADA</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: F.texto}}>
					<div style={{fontWeight: 700, fontSize: 28, color: C.celeste, letterSpacing: 3}}>ENTRADA</div>
					<div style={{fontFamily: F.titulo, fontSize: 150, color: C.oro, lineHeight: 1}}>$50</div>
					<div style={{fontWeight: 700, fontSize: 28, color: C.blanco}}>0412-272-1986</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: M, right: M, bottom: M}}><Logos alto={250} /></div>
		</AbsoluteFill>
	);
};

// ---------- VERSIÓN C · "¿Tienes personal a tu cargo...?" (respuesta directa, QR protagonista) ----------
const BENEFICIOS = ['Cierra más ventas', 'Controla tu dinero', 'Vende las 24 horas', 'Haz que te elijan'];
export const PendonC: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.marino} 0%, #0C2A78 55%, ${C.marino} 100%)`}}>
			<AbsoluteFill style={{alignItems: 'center', top: M + 10}}>
				<Evento oscuro />
				<div style={{marginTop: 46, width: 1440, fontFamily: F.titulo, fontSize: 124, lineHeight: 1.0, color: C.blanco, textAlign: 'center'}}>
					¿TIENES PERSONAL A TU CARGO O UN <span style={{color: C.oro}}>NEGOCIO EN MARCHA?</span>
				</div>
				<div style={{marginTop: 22, fontFamily: F.texto, fontWeight: 900, fontSize: 60, color: C.celeste}}>Esta cumbre es para ti.</div>
			</AbsoluteFill>
			{/* beneficios con íconos */}
			<div style={{position: 'absolute', left: M, right: M, top: 650, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22}}>
				{BENEFICIOS.map((b, i) => (
					<div key={b} style={{background: 'rgba(255,255,255,0.08)', border: `3px solid ${C.oro}88`, borderRadius: 28, padding: '28px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<Icono tipo={i} s={110} color={C.oro} />
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 34, color: C.blanco, textAlign: 'center', lineHeight: 1.15}}>{b}</div>
					</div>
				))}
			</div>
			{/* ponentes en fila compacta */}
			<div style={{position: 'absolute', left: M, right: M, top: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 350, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{height: 330, display: 'flex', alignItems: 'flex-end'}}><Img src={staticFile(p.foto)} style={{height: 330, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}} /></div>
						<div style={{width: '100%', background: C.oro, borderRadius: 12, padding: '6px 0', textAlign: 'center', fontFamily: F.titulo, fontSize: 36, color: C.marino}}>{p.nombre}</div>
						<div style={{marginTop: 6, fontFamily: F.texto, fontWeight: 700, fontSize: 24, color: C.celeste}}>{p.tema}</div>
					</div>
				))}
			</div>
			{/* QR protagonista */}
			<div style={{position: 'absolute', left: M, right: M, top: 1450, height: 560, borderRadius: 36, background: C.blanco, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					<div style={{fontFamily: F.titulo, fontSize: 96, color: C.marino, lineHeight: 0.95}}>COMPRA TU<br /><span style={{color: C.azul}}>ENTRADA</span></div>
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 40, color: C.tinta}}>Viernes 4 de diciembre · 2:00 PM</div>
					<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 36, color: C.tinta}}>Club Parapata · Puerto Ayacucho</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 6}}>
						<div style={{fontFamily: F.titulo, fontSize: 92, color: C.marino, background: C.oro, padding: '0 26px', borderRadius: 18, lineHeight: 1.15}}>$50</div>
						<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: C.azul, lineHeight: 1.2}}>Escríbenos:<br />0412-272-1986</div>
					</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
					<QR tam={430} fondo={C.blanco} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, color: C.marino}}>ESCANEA CON TU CÁMARA</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: M, right: M, bottom: M}}><Logos alto={230} /></div>
		</AbsoluteFill>
	);
};
