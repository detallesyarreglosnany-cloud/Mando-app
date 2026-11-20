import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// MAQUETA 90 × 150 cm · 1800 × 3000 px de diseño = 20 px por cm. Lona blanca.
// Zona segura: 4 cm a los lados (80 px) y 5 cm arriba y abajo (100 px) por tubos/ojales.
// Jerarquía para lectura en 3-5 s: 1) qué es  2) promesa  3) cuándo/dónde  4) quiénes  5) quién respalda  6) cómo comprar.
const C = {marino: '#071A4A', azul: '#1E4FD8', celeste: '#2FA8E0', oro: '#F2B705', gris: '#5B6478', fondo: '#F3F6FB'};
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
	{nombre: 'JOSÉ RODRÍGUEZ', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png'},
	{nombre: 'TANIA ALZURU', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png'},
	{nombre: 'JUAN E. SIERRA', tema: 'Finanzas y tributos', foto: 'img/juan-recorte.png'},
	{nombre: 'DANIELA SILVA', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png'},
];
// 32 patrocinadores en ladrillo 9-7-9-7. Fila 2 (la más mirada): Club Parapata al centro con los medios.
const FILAS = [
	['ferreconi', 'perfumes', 'gran-hotel-apure', 'navas', 'reyes-rivero', 'galaxia', 'tecnoama', 'jesus-nazareth', 'cefoage'],
	['condimentos', 'mas-network', 'amavision', 'parapata', 'shamanika', 'multiempresariales', 'esquina-caliente'],
	['marco', 'betty-guillen', 'puerto-venado', 'orthosmile', 'wahari', 'delicias', 'moto-daniel', 'tania', 'shabono'],
	['milsi', 'broaster', 'divino-nino', 'kubia', 'farma', 'jac', 'casita'],
];
const TW = 168; // 8,4 cm por tarjeta: la fila de 9 queda dentro de la zona segura de 4 cm
const Tarjeta: React.FC<{l: string}> = ({l}) => (
	<div style={{width: TW, height: TW * 2 / 3, borderRadius: 14, overflow: 'hidden', border: '5px solid #FFFFFF', boxSizing: 'border-box', boxShadow: `0 8px 18px ${C.marino}40, 0 0 0 2px ${C.marino}1F`}}>
		<Img src={staticFile(`patroHD/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block', objectFit: 'cover'}} />
	</div>
);
const Linea: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = `${C.marino}33`}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 22, width: 1640}}>
		<div style={{flex: 1, height: 3, background: color}} />
		{children}
		<div style={{flex: 1, height: 3, background: color}} />
	</div>
);

export const PendonOOH: React.FC = () => {
	useFuentes();
	const col = (top: number, children: React.ReactNode) => <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>;
	return (
		<AbsoluteFill style={{background: '#FFFFFF'}}>
			{/* 1. QUÉ ES */}
			{col(110, <>
				<Linea color={C.azul}><div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 52, letterSpacing: 16, color: C.azul, lineHeight: 1}}>CUMBRE DE</div></Linea>
				<div style={{fontFamily: F.titulo, fontSize: 134, lineHeight: 1.04, color: C.marino, whiteSpace: 'nowrap', marginTop: 34}}>TRANSFORMACIÓN EMPRESARIAL</div>
				<div style={{marginTop: 10, fontFamily: F.texto, fontWeight: 900, fontSize: 36, letterSpacing: 16, color: '#FFFFFF', background: C.azul, padding: '8px 40px', borderRadius: 40}}>AMAZONAS 2026</div>
			</>)}
			{/* 2. PROMESA */}
			{col(452, <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
				{['LIDERA', 'VENDE', 'CRECE'].map((w, i) => (
					<React.Fragment key={w}>
						{i > 0 && <div style={{width: 20, height: 20, borderRadius: 20, background: C.azul}} />}
						<div style={{fontFamily: F.titulo, fontSize: 196, lineHeight: 1, color: C.marino}}>{w}</div>
					</React.Fragment>
				))}
			</div>)}
			{/* 3. CUÁNDO Y DÓNDE: arriba también, para quien pasa caminando */}
			{col(688, <div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 50, letterSpacing: 3, color: C.azul}}>VIERNES 4 DIC · 2:00 PM · CLUB PARAPATA</div>)}
			{col(770, <div style={{width: 1500, fontFamily: F.texto, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: C.gris, textAlign: 'center'}}>Herramientas reales para vender más, ganar más y competir en lo que viene.</div>)}
			{/* 4. QUIÉNES */}
			<div style={{position: 'absolute', left: 80, right: 80, top: 872, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 390, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 380, height: 430, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '190px 190px 24px 24px', background: `linear-gradient(180deg, #3D6BE0, ${C.marino})`}}>
							<Img src={staticFile(p.foto)} style={{height: 418, objectFit: 'contain'}} />
						</div>
						<div style={{marginTop: 14, fontFamily: F.titulo, fontSize: 56, color: C.marino, whiteSpace: 'nowrap', lineHeight: 1.05}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: C.azul, whiteSpace: 'nowrap'}}>{p.tema}</div>
					</div>
				))}
			</div>
			{col(1440, <div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: C.marino, border: `3px solid ${C.azul}`, padding: '8px 32px', borderRadius: 40}}>+ Panel central con experto tributario y asesor laboral</div>)}
			{col(1514, <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 32, color: C.gris}}>Para dueños de comercio, líderes de equipo y emprendedores con negocio en marcha</div>)}
			{/* 5. QUIÉN RESPALDA */}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1590, height: 696, borderRadius: 30, background: C.fondo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16}}>
				<Linea>
					<div style={{textAlign: 'center'}}>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 38, letterSpacing: 8, color: C.marino, lineHeight: 1.1}}>PATROCINADORES OFICIALES</div>
						<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 25, color: C.azul, marginTop: 4}}>Gracias a las marcas que hacen posible esta cumbre</div>
					</div>
				</Linea>
				{FILAS.map((fila, i) => <div key={i} style={{display: 'flex', gap: 14}}>{fila.map((l) => <Tarjeta key={l} l={l} />)}</div>)}
			</div>
			{/* 6. CÓMO COMPRAR: un solo bloque, QR de 15 cm */}
			<div style={{position: 'absolute', left: 80, right: 80, top: 2320, height: 560, borderRadius: 34, background: C.marino, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px', boxSizing: 'border-box'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 12, fontFamily: F.texto, color: '#FFFFFF'}}>
					<div style={{fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.celeste}}>ENTRADAS A LA VENTA</div>
					<div style={{fontFamily: F.titulo, fontSize: 150, lineHeight: 1, color: '#FFFFFF'}}>50$ <span style={{fontSize: 70, color: C.celeste}}>a BCV</span></div>
					<div style={{fontWeight: 900, fontSize: 46, lineHeight: 1.1}}>Viernes 4 de diciembre · 2:00 PM</div>
					<div style={{fontWeight: 700, fontSize: 38}}>Club Parapata · Puerto Ayacucho</div>
					<div style={{marginTop: 8, fontWeight: 800, fontStyle: 'italic', fontSize: 34, color: C.oro}}>El 2027 de tu negocio se construye el 4 de diciembre.</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 52, color: C.oro, lineHeight: 1}}>ESCANEA</div>
					<div style={{background: '#FFFFFF', padding: 22, borderRadius: 22, width: 344, height: 344, boxSizing: 'border-box'}}>
						<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
					</div>
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 38, color: '#FFFFFF'}}>0426-761-7944</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
