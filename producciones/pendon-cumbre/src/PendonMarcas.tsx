import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// 1600 × 2400 px de diseño = 80 × 120 cm. Lona BLANCA: el blanco del diseño es la lona sin tinta.
const M = 80;
const C = {marino: '#071A4A', azul: '#1E4FD8', celeste: '#2FA8E0', oro: '#F2B705', tinta: '#0B1B3F', gris: '#5B6478', hielo: '#EEF3FB'};
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

// Intercalados: hombre, mujer, hombre, mujer
const PONENTES = [
	{nombre: 'JOSÉ RODRÍGUEZ', logro: 'Vende más', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png'},
	{nombre: 'TANIA ALZURU', logro: 'Que te elijan', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png'},
	{nombre: 'JUAN E. SIERRA', logro: 'Gana más', tema: 'Finanzas y ganancias', foto: 'img/juan-recorte.png'},
	{nombre: 'DANIELA SILVA', logro: 'Vende 24/7', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png'},
];
const PUBLICO = ['Líderes con personal a su cargo', 'Dueños de comercio', 'Emprendedores en marcha', 'De marca personal a empresarial'];
// 31 patrocinadores en 5 filas (6-6-7-6-6), cada uno en su tarjeta 3:2 con su fondo original, borde blanco y sombra.
// Fila central (la que más se mira): Club Parapata al centro, rodeado por los medios aliados.
const FILAS = [
	['ferreconi', 'perfumes', 'gran-hotel-apure', 'navas', 'reyes-rivero', 'galaxia'],
	['tecnoama', 'jesus-nazareth', 'esquina-caliente', 'marco', 'betty-guillen', 'puerto-venado'],
	['condimentos', 'mas-network', 'amavision', 'parapata', 'shamanika', 'multiempresariales', 'orthosmile'],
	['wahari', 'delicias', 'moto-daniel', 'tania', 'shabono', 'milsi'],
	['broaster', 'divino-nino', 'kubia', 'farma', 'jac', 'casita'],
];

// ---------- Título de la cumbre (bloque protagonista) ----------
const Cabecera: React.FC = () => (
	<div style={{position: 'absolute', left: M, right: M, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
			<div style={{width: 120, height: 5, background: C.oro, borderRadius: 3}} />
			<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 52, letterSpacing: 14, color: C.azul, marginBottom: 22, lineHeight: 1}}>CUMBRE DE</div>
			<div style={{width: 120, height: 5, background: C.oro, borderRadius: 3}} />
		</div>
		<div style={{fontFamily: F.titulo, fontSize: 116, lineHeight: 1.02, color: C.marino, letterSpacing: 1, whiteSpace: 'nowrap'}}>TRANSFORMACIÓN EMPRESARIAL</div>
		<div style={{marginTop: 8, fontFamily: F.texto, fontWeight: 900, fontSize: 34, letterSpacing: 14, color: '#FFFFFF', background: C.azul, padding: '8px 36px', borderRadius: 40}}>AMAZONAS 2026</div>
	</div>
);

// ---------- Título en escalera: LIDERA → VENDE → CRECE ----------
const ESCALONES = [
	{palabra: 'LIDERA', sub: 'a tu equipo', alto: 60, color: C.azul, font: 118},
	{palabra: 'VENDE', sub: 'más y mejor', alto: 98, color: C.marino, font: 126},
	{palabra: 'CRECE', sub: 'hacia el 2027', alto: 136, color: C.oro, font: 138},
];
const Escalera: React.FC<{base: number}> = ({base}) => {
	const ancho = 470, gap = 15;
	return (
		<>
			{ESCALONES.map((e, i) => {
				const x = M + i * (ancho + gap);
				const top = base - e.alto;
				const final = i === 2;
				return (
					<React.Fragment key={e.palabra}>
						<div style={{position: 'absolute', left: x, top: top - e.font - 4, width: ancho, textAlign: 'center', fontFamily: F.titulo, fontSize: e.font, lineHeight: 1, color: final ? '#F5A800' : i === 0 ? C.azul : C.marino, WebkitTextStroke: final ? `5px ${C.marino}` : undefined, paintOrder: 'stroke fill'}}>{e.palabra}</div>
						<div style={{position: 'absolute', left: x, top, width: ancho, height: e.alto, background: e.color, borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 14, paddingTop: 12, boxSizing: 'border-box'}}>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 28, color: final ? C.marino : C.oro}}>{`0${i + 1}`}</span>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 30, color: final ? C.marino : '#FFFFFF'}}>{e.sub}</span>
						</div>
					</React.Fragment>
				);
			})}
		</>
	);
};

const QR: React.FC<{tam: number}> = ({tam}) => (
	<div style={{background: '#FFFFFF', padding: tam * 0.07, borderRadius: tam * 0.08, width: tam, height: tam, boxSizing: 'border-box'}}>
		<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
	</div>
);

const Tarjeta: React.FC<{l: string; w: number}> = ({l, w}) => (
	<div style={{width: w, height: w * 2 / 3, borderRadius: 16, overflow: 'hidden', border: '6px solid #FFFFFF', boxSizing: 'border-box', boxShadow: `0 10px 22px ${C.marino}55, 0 0 0 2px ${C.marino}26`}}>
		<Img src={staticFile(`patroHD/${l}.webp`)} style={{width: '100%', height: '100%', display: 'block', objectFit: 'cover'}} />
	</div>
);

const TW = 184; // ancho de cada tarjeta = 9,2 cm
export const PendonMarcas: React.FC = () => {
	useFuentes();
	const BASE = 596; // suelo de la escalera
	return (
		<AbsoluteFill style={{background: '#FFFFFF'}}>
			<Cabecera />
			<Escalera base={BASE} />
			<AbsoluteFill style={{top: BASE + 12, alignItems: 'center'}}>
				<div style={{width: 1400, fontFamily: F.texto, fontWeight: 700, fontSize: 33, lineHeight: 1.3, color: C.tinta, textAlign: 'center'}}>
					Herramientas reales para vender más, ganar más y <span style={{color: C.azul, fontWeight: 900}}>competir en lo que viene para Venezuela.</span>
				</div>
			</AbsoluteFill>
			{/* ponentes: más grandes */}
			<div style={{position: 'absolute', left: M - 10, right: M - 10, top: 708, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 330, height: 290, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '165px 165px 24px 24px', background: `linear-gradient(180deg, #3D6BE0, ${C.marino})`, border: `6px solid ${C.oro}`, boxSizing: 'border-box'}}>
							<Img src={staticFile(p.foto)} style={{height: 276, objectFit: 'contain'}} />
						</div>
						<div style={{marginTop: 8, fontFamily: F.titulo, fontSize: 44, color: C.marino, whiteSpace: 'nowrap', lineHeight: 1.05}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, color: C.azul, lineHeight: 1.15}}>{p.logro}</div>
						<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 24, color: C.gris}}>{p.tema}</div>
					</div>
				))}
			</div>
			{/* panel: justo debajo de los ponentes */}
			<AbsoluteFill style={{top: 1128, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 28, color: C.marino, border: `3px solid ${C.azul}`, padding: '8px 30px', borderRadius: 40}}>+ Panel central con experto tributario y asesor laboral</div>
			</AbsoluteFill>
			{/* diseñada para: con aire */}
			<AbsoluteFill style={{top: 1194, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 24, letterSpacing: 6, color: C.marino, background: C.oro, padding: '4px 22px', borderRadius: 10}}>DISEÑADA PARA</div>
				<div style={{marginTop: 10, width: 1440, display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: 8}}>
					{PUBLICO.map((t) => <div key={t} style={{fontFamily: F.texto, fontWeight: 800, fontSize: 21, color: '#FFFFFF', background: C.azul, padding: '6px 15px', borderRadius: 40, whiteSpace: 'nowrap'}}>{t}</div>)}
				</div>
			</AbsoluteFill>
			{/* cinta de escasez: separada de la tarjeta */}
			<AbsoluteFill style={{top: 1308, alignItems: 'center'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{width: 90, height: 4, background: C.oro, borderRadius: 2}} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: C.marino}}>AFORO LIMITADO · INSCRIPCIÓN POR ORDEN DE LLEGADA</div>
					<div style={{width: 90, height: 4, background: C.oro, borderRadius: 2}} />
				</div>
			</AbsoluteFill>
			{/* tarjeta de compra */}
			<div style={{position: 'absolute', left: M, right: M, top: 1352, height: 206, borderRadius: 30, background: C.marino, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 10, fontFamily: F.texto, color: '#FFFFFF'}}>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>VIERNES </span><span style={{fontWeight: 900, fontSize: 44}}>4 DE DICIEMBRE</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>DESDE LAS </span><span style={{fontWeight: 900, fontSize: 44}}>2:00 PM</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 900, fontSize: 40}}>Club Parapata</span><span style={{fontWeight: 700, fontSize: 28, color: C.celeste}}> · Puerto Ayacucho</span></div>
					<div style={{fontWeight: 800, fontStyle: 'italic', fontSize: 29, color: C.oro}}>El 2027 de tu negocio se construye el 4 de diciembre.</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<div style={{textAlign: 'right', fontFamily: F.texto}}>
						<div style={{fontWeight: 900, fontSize: 48, color: C.oro, lineHeight: 1}}>ESCANEA</div>
						<div style={{fontWeight: 900, fontSize: 31, color: '#FFFFFF', lineHeight: 1.15}}>Y ASEGURA<br />TU LUGAR</div>
						<div style={{marginTop: 10, fontWeight: 800, fontSize: 25, color: '#FFFFFF'}}>50$ a BCV</div>
						<div style={{fontWeight: 800, fontSize: 25, color: C.celeste}}>Info: 0426-761-7944</div>
					</div>
					<QR tam={186} />
				</div>
			</div>
			{/* patrocinadores oficiales: el protagonismo de las marcas */}
			<div style={{position: 'absolute', left: 40, right: 40, top: 1576, bottom: 34, borderRadius: 30, background: C.hielo, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 14}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, width: 1440}}>
					<div style={{flex: 1, height: 4, background: C.oro, borderRadius: 2}} />
					<div style={{textAlign: 'center'}}>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, letterSpacing: 6, color: C.marino, lineHeight: 1.1}}>PATROCINADORES OFICIALES</div>
						<div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 21, color: C.azul, marginTop: 2}}>Gracias a las marcas que hacen posible esta cumbre</div>
					</div>
					<div style={{flex: 1, height: 4, background: C.oro, borderRadius: 2}} />
				</div>
				{FILAS.map((fila, i) => (
					<div key={i} style={{display: 'flex', gap: 18, justifyContent: 'center'}}>
						{fila.map((l) => <Tarjeta key={l} l={l} w={TW} />)}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
