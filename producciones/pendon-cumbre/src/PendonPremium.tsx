import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import LOGOS from './logosLibres.json';

// PROPUESTA PREMIUM · 90 × 150 cm (3:5) · 1800 × 3000 px de diseño = 20 px/cm. Pendón con tubos.
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
const centro = (top: number, children: React.ReactNode) => <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>;

// Ponentes: mismo ancho visible = mismo tamaño de rostro (medido); cabezas alineadas en una sola línea.
const PONENTES = [
	{nombre: 'JOSÉ RODRÍGUEZ', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png', w: 452},
	{nombre: 'TANIA ALZURU', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png', w: 384},
	{nombre: 'JUAN E. SIERRA', tema: 'Finanzas y tributos', foto: 'img/juan-recorte.png', w: 421},
	{nombre: 'DANIELA SILVA', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png', w: 440},
];

// 32 patrocinadores, grilla abierta 6-7-6-7-6, sin tarjetas. Tamaño por ÁREA visual (escala óptica):
// las placas de color pesan más a la vista, así que reciben menos área que las marcas sobre blanco.
const FILAS = [
	['ferreconi', 'perfumes', 'gran-hotel-apure', 'navas', 'reyes-rivero', 'galaxia'],
	['condimentos', 'mas-network', 'amavision', 'parapata', 'shamanika', 'multiempresariales', 'esquina-caliente'],
	['tecnoama', 'jesus-nazareth', 'cefoage', 'marco', 'betty-guillen', 'puerto-venado'],
	['orthosmile', 'wahari', 'delicias', 'moto-daniel', 'tania', 'shabono', 'milsi'],
	['broaster', 'divino-nino', 'kubia', 'farma', 'jac', 'casita'],
];
const CW = 232, CH = 140;
const Logo: React.FC<{l: string}> = ({l}) => {
	const {tipo, r} = (LOGOS as Record<string, {tipo: string; r: number}>)[l];
	const A = (tipo === 'placa' ? 0.42 : 0.52) * CW * CH;
	let w = Math.sqrt(A * r), h = Math.sqrt(A / r);
	const k = Math.min(1, (0.86 * CW) / w, (0.8 * CH) / h);
	w *= k; h *= k;
	return (
		<div style={{width: CW, height: CH, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Img src={staticFile(`patroLibre/${l}.png`)} style={{width: w, height: h, display: 'block'}} />
		</div>
	);
};

export const PendonPremium: React.FC = () => {
	useFuentes();
	const Y = 900; // línea de cabezas de los ponentes
	return (
		<AbsoluteFill style={{background: '#FFFFFF'}}>
			{/* ZONA 1 · identidad del evento: clara, pero por debajo del mensaje */}
			{centro(118, <>
				<T s={40} p={900} c={C.azul} ls={18}>CUMBRE DE</T>
				<T s={112} f={F.titulo} p={400} style={{marginTop: 12, whiteSpace: 'nowrap'}}>TRANSFORMACIÓN EMPRESARIAL</T>
				<T s={36} p={900} c={C.azul} ls={22} style={{marginTop: 14}}>AMAZONAS 2026</T>
			</>)}
			{/* ZONA 2 · mensaje principal: el elemento dominante */}
			{centro(392, <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
				{['LIDERA', 'VENDE', 'CRECE'].map((w, i) => (
					<React.Fragment key={w}>
						{i > 0 && <div style={{width: 22, height: 22, borderRadius: 22, background: C.oro}} />}
						<div style={{fontFamily: F.titulo, fontSize: 196, lineHeight: 1, color: C.marino}}>{w}</div>
					</React.Fragment>
				))}
			</div>)}
			{centro(640, <>
				<T s={58} p={900} c={C.azul}>VIERNES 4 DE DICIEMBRE · 2:00 PM</T>
				<T s={40} p={700} ls={6} style={{marginTop: 12}}>CLUB PARAPATA · PUERTO AYACUCHO</T>
				<T s={32} p={500} c={C.gris} style={{marginTop: 26}}>Herramientas reales para vender más, ganar más y competir en lo que viene.</T>
			</>)}
			{/* ZONA 3 · ponentes: una sola franja de bruma azul, sin marcos individuales */}
			<div style={{position: 'absolute', left: 0, right: 0, top: Y - 40, height: 500, background: `linear-gradient(180deg, #FFFFFF 0%, ${C.bruma} 22%, #D9E5F8 100%)`, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 80, right: 80, top: 40, display: 'flex', justifyContent: 'space-between'}}>
					{PONENTES.map((p) => (
						<div key={p.nombre} style={{width: 410, display: 'flex', justifyContent: 'center'}}>
							<Img src={staticFile(p.foto)} style={{width: p.w, display: 'block'}} />
						</div>
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: 80, right: 80, top: Y + 474, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 410, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<T s={58} f={F.titulo} p={400} style={{whiteSpace: 'nowrap'}}>{p.nombre}</T>
						<T s={31} p={700} c={C.azul} style={{marginTop: 6, whiteSpace: 'nowrap'}}>{p.tema}</T>
					</div>
				))}
			</div>
			{centro(Y + 610, <>
				<T s={32} p={800}>+ Panel central con experto tributario y asesor laboral</T>
				<T s={28} p={500} c={C.gris} style={{marginTop: 10}}>Para dueños de comercio, líderes de equipo y emprendedores con negocio en marcha.</T>
			</>)}
			{/* ZONA 4 · patrocinadores: ecosistema de marcas en grilla abierta */}
			{centro(1640, <>
				<div style={{display: 'flex', alignItems: 'center', gap: 26, width: 1640}}>
					<div style={{flex: 1, height: 2, background: `${C.marino}26`}} />
					<T s={38} p={900} ls={10}>PATROCINADORES OFICIALES</T>
					<div style={{flex: 1, height: 2, background: `${C.marino}26`}} />
				</div>
				<T s={26} p={600} c={C.azul} style={{marginTop: 8}}>Gracias a las marcas que hacen posible esta cumbre.</T>
				<div style={{marginTop: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
					{FILAS.map((fila, i) => <div key={i} style={{display: 'flex'}}>{fila.map((l) => <Logo key={l} l={l} />)}</div>)}
				</div>
			</>)}
			{/* ZONA 5 · conversión: franja azul marino a sangre */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 2486, bottom: 0, background: C.marino}} />
			<div style={{position: 'absolute', left: 100, right: 100, top: 2530, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
					<T s={30} p={900} c={C.oro} ls={10}>AFORO LIMITADO</T>
					<T s={44} p={900} c="#FFFFFF" ls={2} style={{marginTop: 14}}>ENTRADAS A LA VENTA</T>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 4}}>
						<div style={{fontFamily: F.titulo, fontSize: 168, lineHeight: 1, color: C.oro}}>50$</div>
						<div style={{fontFamily: F.titulo, fontSize: 76, lineHeight: 1, color: '#FFFFFF'}}>A BCV</div>
					</div>
					<T s={30} p={600} c="#C9D6F2" style={{marginTop: 18, fontStyle: 'italic', textAlign: 'left'}}>El 2027 de tu negocio se construye el 4 de diciembre.</T>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 30}}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
						<T s={44} p={900} c="#FFFFFF" style={{textAlign: 'right', lineHeight: 1.12}}>ESCANEA Y<br />ASEGURA<br />TU LUGAR</T>
						<div style={{marginTop: 10, fontFamily: F.texto, fontWeight: 900, fontSize: 60, color: C.oro, lineHeight: 1}}>→</div>
						<T s={36} p={800} c="#FFFFFF" style={{marginTop: 18}}>0426-761-7944</T>
					</div>
					<div style={{background: '#FFFFFF', padding: 26, width: 330, height: 330, boxSizing: 'border-box', borderRadius: 8}}>
						<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
