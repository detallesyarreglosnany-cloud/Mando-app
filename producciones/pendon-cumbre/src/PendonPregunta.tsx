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
	{nombre: 'JOSÉ RODRÍGUEZ', tema: 'Ventas y liderazgo', foto: 'img/jose-oscuro.png', w: 400},
	{nombre: 'TANIA ALZURU', tema: 'Neuromarketing y marca', foto: 'img/tania-oscuro.png', w: 340},
	{nombre: 'JUAN E. SIERRA', tema: 'Finanzas y tributos', foto: 'img/juan-oscuro.png', w: 372},
	{nombre: 'DANIELA SILVA', tema: 'Tu negocio digital', foto: 'img/daniela-oscuro.png', w: 390},
];
// Recortes sin halo (public/img/*-oscuro.png) y la base de la foto se funde con el azul, sin corte seco.
const Ponente: React.FC<{p: typeof PONENTES[number]}> = ({p}) => (
	<div style={{width: 410, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{width: 410, height: 420, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
			WebkitMaskImage: 'linear-gradient(180deg, #000 72%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 72%, transparent 100%)'}}>
			<Img src={staticFile(p.foto)} style={{width: p.w, height: 'auto', display: 'block', flexShrink: 0}} />
		</div>
		<div style={{width: 120, height: 4, background: C.oro, borderRadius: 2, marginTop: 6}} />
		<T s={60} f={F.titulo} p={400} c="#FFFFFF" style={{marginTop: 16, whiteSpace: 'nowrap'}}>{p.nombre}</T>
		<T s={31} p={800} c={C.celeste} style={{marginTop: 8, whiteSpace: 'nowrap'}}>{p.tema}</T>
	</div>
);
const FILAS = [
	['ferreconi', 'perfumes', 'gran-hotel-apure', 'navas', 'reyes-rivero', 'galaxia', 'condimentos', 'mas-network'],
	['amavision', 'parapata', 'cefoage', 'betty-guillen', 'esquina-caliente', 'tecnoama', 'jesus-nazareth', 'multiempresariales'],
	['marco', 'shamanika', 'puerto-venado', 'orthosmile', 'wahari', 'delicias', 'farma', 'tania'],
	['shabono', 'milsi', 'broaster', 'divino-nino', 'kubia', 'moto-daniel', 'jac', 'casita'],
];
const CW = 188, CH = 186, PESO = 0.6 * 196 * 150;
const Logo: React.FC<{l: string}> = ({l}) => {
	const {r, tinta} = (LOGOS as Record<string, {r: number; tinta: number}>)[l];
	const A = PESO * Math.pow(0.35 / Math.max(0.12, tinta), 0.55);
	let w = Math.sqrt(A * r), h = Math.sqrt(A / r);
	const k = Math.min(1, (r > 3 ? 240 : 180) / w, 160 / h); w *= k; h *= k;
	return <div style={{width: Math.max(CW, w + 14), height: CH, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile(`patroBlanco/${l}.png`)} style={{width: w, height: h, display: 'block'}} /></div>;
};

export const PendonPregunta: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: C.marino}}>
			{centro(96, <>
				<div style={{background: C.oro, borderRadius: 40, padding: '14px 46px'}}>
					<T s={50} p={900} c={NOCHE}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</T>
					<T s={50} p={900} c={NOCHE} ls={8} style={{marginTop: 4}}>AMAZONAS 2026</T>
				</div>
			</>)}
			{centro(300, <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
				{['LIDERA', 'VENDE', 'CRECE'].map((w, i) => (
					<React.Fragment key={w}>
						{i > 0 && <div style={{width: 24, height: 24, borderRadius: 24, background: C.oro}} />}
						<div style={{fontFamily: F.titulo, fontSize: 200, lineHeight: 1, color: '#FFFFFF'}}>{w}</div>
					</React.Fragment>
				))}
			</div>)}
			{centro(530, <T s={40} p={700} c="#C9D6F2">4 expertos. 1 tarde. Herramientas reales para tu negocio.</T>)}
			{centro(610, <div style={{display: 'flex', gap: 18, alignItems: 'center', background: C.oro, borderRadius: 60, padding: '16px 44px'}}>
				<T s={50} p={900} c={NOCHE}>VIERNES 4 DE DICIEMBRE · 2:00 PM</T>
			</div>)}
			{centro(715, <T s={38} p={800} c="#FFFFFF" ls={6}>CLUB PARAPATA · PUERTO AYACUCHO</T>)}
			{/* LAS RESPUESTAS */}
			<div style={{position: 'absolute', left: 70, right: 70, top: 860, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => <Ponente key={p.nombre} p={p} />)}
			</div>
			{centro(1462, <T s={32} p={700} c="#C9D6F2">+ Panel central con experto tributario y asesor laboral </T>)}
			{/* RESPALDO */}
			{centro(1548, <>
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
						<div style={{fontFamily: F.titulo, fontSize: 200, lineHeight: 1, color: C.oro}}>USD 50</div>
						<div style={{fontFamily: F.titulo, fontSize: 64, color: '#FFFFFF'}}>BCV</div>
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
