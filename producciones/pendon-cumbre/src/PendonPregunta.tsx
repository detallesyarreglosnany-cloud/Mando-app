import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import LOGOS from './logosBlancos.json';

// VERSIÓN B · "LA PREGUNTA" · 90 × 150 cm · 1800 × 3000 px de diseño (20 px/cm). Fondo azul noche completo.
// Zona segura: 4 cm laterales, 5 cm arriba y abajo. La franja azul inferior va a sangre.
// Sin contenedores: la separación se resuelve con espacio, alineación y tipografía.
const C = {marino: '#071A4A', azul: '#1E4FD8', celeste: '#6FA8FF', oro: '#F2B705', gris: '#5B6478', bruma: '#E9EFFA'};
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
const T: React.FC<{s: number; f?: string; p?: number; c?: string; ls?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({s, f = F.texto, p = 800, c = C.marino, ls = 0, style, children}) => (
	<div style={{fontFamily: f, fontWeight: p, fontSize: s, color: c, letterSpacing: ls, lineHeight: 1.08, textAlign: 'center', ...style}}>{children}</div>
);
// Ángulo de venta: no se anuncia un evento, se le hace una PREGUNTA al dueño de negocio y cada ponente
// es la respuesta a un dolor concreto. La pieza se lee como conversación, no como cartelera.
const centro = (top: number, children: React.ReactNode) => <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>;
const NOCHE = '#050F2E';
const PONENTES = [
	{nombre: 'JOSÉ RODRÍGUEZ', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png'},
	{nombre: 'TANIA ALZURU', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png'},
	{nombre: 'JUAN E. SIERRA', tema: 'Finanzas y tributos', foto: 'img/juan-recorte.png'},
	{nombre: 'DANIELA SILVA', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png'},
];
// Recorte directo sobre el azul, sin arco ni caja; la base de la foto se apoya en un filete dorado.
const Tarjeta: React.FC<{r: typeof PONENTES[number]}> = ({r}) => (
	<div style={{width: 800, height: 400, display: 'flex', alignItems: 'flex-end', gap: 24, borderBottom: `4px solid ${C.oro}`}}>
		<div style={{width: 330, height: 396, flexShrink: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
			<Img src={staticFile(r.foto)} style={{width: 330, height: 'auto', display: 'block', marginTop: 10}} />
		</div>
		<div style={{paddingBottom: 46, display: 'flex', flexDirection: 'column', gap: 10}}>
			<div style={{fontFamily: F.titulo, fontSize: 70, color: '#FFFFFF', lineHeight: 1}}>{r.nombre}</div>
			<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 31, color: C.celeste, whiteSpace: 'nowrap'}}>{r.tema}</div>
		</div>
	</div>
);
const FILAS = [
	['ferreconi', 'perfumes', 'gran-hotel-apure', 'navas', 'reyes-rivero', 'galaxia', 'condimentos', 'mas-network'],
	['amavision', 'parapata', 'cefoage', 'betty-guillen', 'esquina-caliente', 'tecnoama', 'jesus-nazareth', 'multiempresariales'],
	['marco', 'shamanika', 'puerto-venado', 'orthosmile', 'wahari', 'delicias', 'farma', 'tania'],
	['shabono', 'milsi', 'broaster', 'divino-nino', 'kubia', 'moto-daniel', 'jac', 'casita'],
];
const CW = 196, CH = 118, PESO = 0.6 * CW * CH;
const Logo: React.FC<{l: string}> = ({l}) => {
	const {r, tinta} = (LOGOS as Record<string, {r: number; tinta: number}>)[l];
	const A = PESO * Math.pow(0.35 / Math.max(0.12, tinta), 0.55);
	let w = Math.sqrt(A * r), h = Math.sqrt(A / r);
	const k = Math.min(1, (r > 3 ? 250 : 184) / w, 108 / h); w *= k; h *= k;
	return <div style={{width: Math.max(CW, w + 14), height: CH, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile(`patroBlanco/${l}.png`)} style={{width: w, height: h, display: 'block'}} /></div>;
};

export const PendonPregunta: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{centro(104, <>
				<T s={50} p={900} c={C.celeste} ls={4}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</T>
				<T s={50} p={900} c={C.celeste} ls={14} style={{marginTop: 10}}>AMAZONAS 2026</T>
			</>)}
			{centro(270, <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
				{['LIDERA', 'VENDE', 'CRECE'].map((w, i) => (
					<React.Fragment key={w}>
						{i > 0 && <div style={{width: 24, height: 24, borderRadius: 24, background: C.oro}} />}
						<div style={{fontFamily: F.titulo, fontSize: 200, lineHeight: 1, color: '#FFFFFF'}}>{w}</div>
					</React.Fragment>
				))}
			</div>)}
			{centro(560, <T s={40} p={700} c="#C9D6F2">4 expertos. 1 tarde. Herramientas reales para tu negocio.</T>)}
			{centro(650, <div style={{display: 'flex', gap: 18, alignItems: 'center', background: C.oro, borderRadius: 60, padding: '16px 44px'}}>
				<T s={50} p={900} c={NOCHE}>VIERNES 4 DE DICIEMBRE · 2:00 PM</T>
			</div>)}
			{centro(760, <T s={38} p={800} c="#FFFFFF" ls={6}>CLUB PARAPATA · PUERTO AYACUCHO</T>)}
			{/* LAS RESPUESTAS */}
			<div style={{position: 'absolute', left: 80, right: 80, top: 860, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 34}}>
				{PONENTES.map((r) => <Tarjeta key={r.nombre} r={r} />)}
			</div>
			{centro(1752, <T s={30} p={700} c="#C9D6F2">+ Panel central con experto tributario y asesor laboral </T>)}
			{/* RESPALDO */}
			{centro(1830, <>
				<div style={{display: 'flex', alignItems: 'center', gap: 24, width: 1640}}>
					<div style={{flex: 1, height: 2, background: 'rgba(255,255,255,0.22)'}} />
					<T s={34} p={900} c="#FFFFFF" ls={9}>RESPALDADO POR 32 MARCAS DE AMAZONAS</T>
					<div style={{flex: 1, height: 2, background: 'rgba(255,255,255,0.22)'}} />
				</div>
				<div style={{marginTop: 14}}>{FILAS.map((f, i) => <div key={i} style={{display: 'flex', justifyContent: 'center'}}>{f.map((l) => <Logo key={l} l={l} />)}</div>)}</div>
			</>)}
			{/* EL CIERRE: franja dorada a sangre */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 2400, bottom: 0, background: C.azul}} />
			<div style={{position: 'absolute', left: 100, right: 100, top: 2440, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
					<T s={30} p={900} c={C.oro} ls={10}>AFORO LIMITADO</T>
					<T s={46} p={900} c="#FFFFFF" style={{marginTop: 10}}>ENTRADAS A LA VENTA</T>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
						<div style={{fontFamily: F.titulo, fontSize: 200, lineHeight: 1, color: C.oro}}>50$</div>
						<div style={{fontFamily: F.titulo, fontSize: 80, color: '#FFFFFF'}}>A BCV</div>
					</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
					<div style={{textAlign: 'right'}}>
						<T s={64} p={900} c={C.oro} style={{textAlign: 'right'}}>ESCANEA</T>
						<T s={36} p={900} c="#FFFFFF" style={{textAlign: 'right', marginTop: 6}}>ASEGURA TU LUGAR</T>
						<T s={38} p={800} c="#FFFFFF" style={{textAlign: 'right', marginTop: 22}}>0426-761-7944</T>
					</div>
					<div style={{background: '#FFFFFF', padding: 24, width: 330, height: 330, boxSizing: 'border-box', borderRadius: 10}}>
						<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
					</div>
				</div>
			</div>
			{centro(2846, <T s={44} p={800} c="#FFFFFF" style={{fontStyle: 'italic'}}>El 2027 de tu negocio se construye el 4 de diciembre.</T>)}
		</AbsoluteFill>
	);
};
