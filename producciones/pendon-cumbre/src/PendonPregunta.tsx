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
const RESPUESTAS = [
	{dolor: '¿Te preguntan, pero no te compran?', resp: 'Cierre de venta estratégico', nombre: 'JOSÉ RODRÍGUEZ', foto: 'img/jose-recorte.png'},
	{dolor: '¿Te comparan solo por el precio?', resp: 'Neuromarketing y marca', nombre: 'TANIA ALZURU', foto: 'img/tania-recorte.png'},
	{dolor: '¿Te inquietan los nuevos tributos?', resp: 'Finanzas y tributos al día', nombre: 'JUAN E. SIERRA', foto: 'img/juan-recorte.png'},
	{dolor: '¿Tu negocio solo vende si tú estás?', resp: 'Tu tienda vendiendo 24/7', nombre: 'DANIELA SILVA', foto: 'img/daniela-recorte.png'},
];
const Tarjeta: React.FC<{r: typeof RESPUESTAS[number]}> = ({r}) => (
	<div style={{width: 800, height: 400, display: 'flex', alignItems: 'flex-end', gap: 26, borderBottom: `4px solid ${C.oro}`}}>
		<div style={{width: 300, height: 380, flexShrink: 0, overflow: 'hidden', borderRadius: '150px 150px 0 0', background: `linear-gradient(180deg, #2A55C9, #0B2470)`, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
			<Img src={staticFile(r.foto)} style={{width: 300, height: 'auto', display: 'block', marginTop: 14}} />
		</div>
		<div style={{paddingBottom: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
			<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: '#FFFFFF'}}>{r.dolor}</div>
			<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, color: C.oro, letterSpacing: 1}}>→ {r.resp.toUpperCase()}</div>
			<div style={{fontFamily: F.titulo, fontSize: 52, color: C.celeste, lineHeight: 1}}>{r.nombre}</div>
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
		<AbsoluteFill style={{background: `radial-gradient(ellipse 120% 55% at 50% 18%, #13348C 0%, ${C.marino} 45%, ${NOCHE} 100%)`}}>
			{centro(110, <T s={34} p={900} c={C.celeste} ls={9}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL · AMAZONAS 2026</T>)}
			{/* EL GANCHO */}
			{centro(200, <>
				<T s={190} f={F.titulo} p={400} c="#FFFFFF" style={{lineHeight: 0.98}}>¿TU NEGOCIO ESTÁ</T>
				<T s={190} f={F.titulo} p={400} c="#FFFFFF" style={{lineHeight: 0.98}}>LISTO PARA EL <span style={{color: C.oro}}>2027</span>?</T>
			</>)}
			{centro(605, <T s={44} p={700} c="#C9D6F2">4 expertos. 1 tarde. Las respuestas que tu negocio necesita.</T>)}
			{centro(700, <div style={{display: 'flex', gap: 18, alignItems: 'center', background: C.oro, borderRadius: 60, padding: '16px 44px'}}>
				<T s={44} p={900} c={NOCHE}>VIERNES 4 DE DICIEMBRE · 2:00 PM</T>
			</div>)}
			{centro(800, <T s={36} p={800} c="#FFFFFF" ls={6}>CLUB PARAPATA · PUERTO AYACUCHO</T>)}
			{/* LAS RESPUESTAS */}
			<div style={{position: 'absolute', left: 80, right: 80, top: 890, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 34}}>
				{RESPUESTAS.map((r) => <Tarjeta key={r.nombre} r={r} />)}
			</div>
			{centro(1752, <T s={30} p={700} c="#C9D6F2">+ Panel central con experto tributario y asesor laboral · <span style={{color: C.oro}}>LIDERA · VENDE · CRECE</span></T>)}
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
			<div style={{position: 'absolute', left: 0, right: 0, top: 2400, bottom: 0, background: C.oro}} />
			<div style={{position: 'absolute', left: 100, right: 100, top: 2440, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
					<T s={30} p={900} c={NOCHE} ls={10}>AFORO LIMITADO</T>
					<T s={46} p={900} c={NOCHE} style={{marginTop: 10}}>ENTRADAS A LA VENTA</T>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
						<div style={{fontFamily: F.titulo, fontSize: 200, lineHeight: 1, color: NOCHE}}>50$</div>
						<div style={{fontFamily: F.titulo, fontSize: 80, color: NOCHE}}>A BCV</div>
					</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
					<div style={{textAlign: 'right'}}>
						<T s={64} p={900} c={NOCHE} style={{textAlign: 'right'}}>ESCANEA</T>
						<T s={36} p={900} c={NOCHE} style={{textAlign: 'right', marginTop: 6}}>ASEGURA TU LUGAR</T>
						<T s={38} p={800} c={NOCHE} style={{textAlign: 'right', marginTop: 22}}>0426-761-7944</T>
					</div>
					<div style={{background: '#FFFFFF', padding: 24, width: 330, height: 330, boxSizing: 'border-box', borderRadius: 10}}>
						<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
					</div>
				</div>
			</div>
			{centro(2846, <T s={44} p={800} c={NOCHE} style={{fontStyle: 'italic'}}>El 2027 de tu negocio se construye el 4 de diciembre.</T>)}
		</AbsoluteFill>
	);
};
