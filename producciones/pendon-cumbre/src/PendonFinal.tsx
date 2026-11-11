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

const PONENTES = [
	{nombre: 'JOSÉ RODRÍGUEZ', logro: 'Vende más', tema: 'Ventas y liderazgo', foto: 'img/jose-recorte.png'},
	{nombre: 'TANIA ALZURU', logro: 'Que te elijan', tema: 'Neuromarketing y marca', foto: 'img/tania-recorte.png'},
	{nombre: 'JUAN E. SIERRA', logro: 'Gana más', tema: 'Finanzas y ganancias', foto: 'img/juan-recorte.png'},
	{nombre: 'DANIELA SILVA', logro: 'Vende 24/7', tema: 'Tu negocio digital', foto: 'img/daniela-recorte.png'},
];
const PUBLICO = ['Líderes con personal a su cargo', 'Dueños de comercio', 'Emprendedores con negocio en marcha', 'De marca personal a marca empresarial'];
// Logos con dibujo oscuro → franja clara; logos con dibujo claro → franja azul noche
const CLAROS = [3, 4, 6, 8, 9, 12, 14, 16];
const OSCUROS = [1, 2, 5, 10, 11, 13, 15];

// ---------- Título en escalera: LIDERA → VENDE → CRECE ----------
const ESCALONES = [
	{palabra: 'LIDERA', sub: 'a tu equipo', alto: 120, color: C.azul},
	{palabra: 'VENDE', sub: 'más y mejor', alto: 230, color: C.marino},
	{palabra: 'CRECE', sub: 'hacia el 2027', alto: 340, color: C.oro},
];
const Escalera: React.FC = () => {
	const ancho = 470, gap = 15, base = 690; // base = línea del suelo
	return (
		<div style={{position: 'absolute', left: M, top: 0, width: 1600 - 2 * M, height: base}}>
			{ESCALONES.map((e, i) => {
				const x = i * (ancho + gap);
				const top = base - e.alto;
				const final = i === 2;
				return (
					<React.Fragment key={e.palabra}>
						<div style={{position: 'absolute', left: x, top: top - 200, width: ancho, textAlign: 'center', fontFamily: F.titulo, fontSize: final ? 210 : 176, lineHeight: 1, color: final ? C.oro : i === 0 ? C.azul : C.marino, textShadow: final ? '0 4px 0 rgba(7,26,74,0.12)' : 'none'}}>{e.palabra}</div>
						<div style={{position: 'absolute', left: x, top, width: ancho, height: e.alto, background: e.color, borderRadius: '18px 18px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 26}}>
							<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: final ? C.marino : '#FFFFFF'}}>{`0${i + 1}`}</div>
							<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 36, color: final ? C.marino : '#FFFFFF'}}>{e.sub}</div>
						</div>
					</React.Fragment>
				);
			})}
			{/* sin flecha: la escalera ya comunica el ascenso */}
			<svg width={1440} height={base} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<path opacity={0} d={`M 235 ${base - 120 - 230} Q 600 ${base - 230 - 280} 1180 ${base - 340 - 250}`} fill="none" stroke={C.oro} strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" />
			</svg>
		</div>
	);
};

const QR: React.FC<{tam: number}> = ({tam}) => (
	<div style={{background: '#FFFFFF', padding: tam * 0.07, borderRadius: tam * 0.08, width: tam, height: tam, boxSizing: 'border-box'}}>
		<Img src={staticFile('img/qr.svg')} style={{width: '100%', height: '100%', display: 'block'}} />
	</div>
);

// Proporción (ancho/alto) de cada logo ya recortado: se usa para que todos pesen igual a la vista
const PROP: Record<number, number> = {1: 743 / 296, 2: 650 / 493, 3: 818 / 275, 4: 656 / 761, 5: 903 / 259, 6: 871 / 210, 8: 868 / 313, 9: 854 / 803, 10: 952 / 461, 11: 1, 12: 912 / 162, 13: 867 / 459, 14: 833 / 778, 15: 993 / 992, 16: 634 / 139};
const tamanos = (ids: number[], anchoUtil: number, hMax: number, gap: number) => {
	const medir = (A: number) => ids.map((n) => {
		const r = PROP[n];
		let w = Math.sqrt(A * r), h = Math.sqrt(A / r);
		if (h > hMax) { h = hMax; w = h * r; }
		return {n, w, h};
	});
	let lo = 100, hi = 200000;
	for (let k = 0; k < 40; k++) {
		const mid = (lo + hi) / 2;
		const total = medir(mid).reduce((s, x) => s + x.w, 0) + gap * (ids.length - 1);
		if (total > anchoUtil) hi = mid; else lo = mid;
	}
	return medir(lo);
};
const Franja: React.FC<{ids: number[]; oscura: boolean; alto: number}> = ({ids, oscura, alto}) => {
	const padX = 30, gap = 30;
	const items = tamanos(ids, 1600 - 2 * M - 2 * padX, alto - 40, gap);
	return (
		<div style={{height: alto, borderRadius: 26, background: oscura ? C.marino : C.hielo, border: oscura ? 'none' : `3px solid ${C.marino}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap, padding: `0 ${padX}px`, boxSizing: 'border-box'}}>
			{items.map(({n, w, h}) => (
				<Img key={n} src={staticFile(`logos-t/logo${n}.png`)} style={{width: w, height: h, objectFit: 'contain'}} />
			))}
		</div>
	);
};

export const PendonFinal: React.FC = () => {
	useFuentes();
	return (
		<AbsoluteFill style={{background: '#FFFFFF'}}>
			{/* encabezado */}
			<AbsoluteFill style={{alignItems: 'center', top: M}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 46, letterSpacing: 4, color: C.marino}}>CUMBRE DE TRANSFORMACIÓN EMPRESARIAL</div>
				<div style={{marginTop: 10, fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 10, color: '#FFFFFF', background: C.azul, padding: '6px 30px', borderRadius: 40}}>AMAZONAS 2026</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 0, right: 0, top: 210}}><Escalera /></div>
			<AbsoluteFill style={{top: 912, alignItems: 'center'}}>
				<div style={{width: 1380, fontFamily: F.texto, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: C.tinta, textAlign: 'center'}}>
					Herramientas reales para vender más, ganar más y <span style={{color: C.azul, fontWeight: 900}}>competir en lo que viene para Venezuela.</span>
				</div>
			</AbsoluteFill>
			{/* ponentes */}
			<div style={{position: 'absolute', left: M, right: M, top: 1020, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 350, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 300, height: 310, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '150px 150px 22px 22px', background: `linear-gradient(180deg, #3D6BE0, ${C.marino})`, border: `5px solid ${C.oro}`}}>
							<Img src={staticFile(p.foto)} style={{height: 295, objectFit: 'contain'}} />
						</div>
						<div style={{marginTop: 10, fontFamily: F.titulo, fontSize: 40, color: C.marino, whiteSpace: 'nowrap'}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, color: C.azul}}>{p.logro}</div>
						<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 23, color: C.gris}}>{p.tema}</div>
					</div>
				))}
			</div>
			{/* para quién */}
			<AbsoluteFill style={{top: 1472, alignItems: 'center'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 28, letterSpacing: 5, color: C.oro}}>DISEÑADA PARA</span>
					<span style={{fontFamily: F.texto, fontWeight: 700, fontSize: 26, color: C.gris}}>· + panel con experto tributario y asesor laboral</span>
				</div>
				<div style={{marginTop: 10, width: 1440, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10}}>
					{PUBLICO.map((t) => <div key={t} style={{fontFamily: F.texto, fontWeight: 800, fontSize: 27, color: '#FFFFFF', background: C.azul, padding: '7px 22px', borderRadius: 40}}>{t}</div>)}
				</div>
			</AbsoluteFill>
			{/* tarjeta de compra con urgencia */}
			<div style={{position: 'absolute', left: M, right: M, top: 1660, height: 285, borderRadius: 30, background: C.marino, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 34px 0'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 9, fontFamily: F.texto, color: '#FFFFFF'}}>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>VIERNES </span><span style={{fontWeight: 900, fontSize: 44}}>4 DE DICIEMBRE</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>DESDE LAS </span><span style={{fontWeight: 900, fontSize: 44}}>2:00 PM</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 900, fontSize: 40}}>Club Parapata</span><span style={{fontWeight: 700, fontSize: 28, color: C.celeste}}> · Puerto Ayacucho</span></div>
					<div style={{marginTop: 6, fontWeight: 800, fontStyle: 'italic', fontSize: 31, color: C.oro, lineHeight: 1.2}}>Mientras lo piensas, tu competencia<br />aparta su lugar.</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<div style={{textAlign: 'right', fontFamily: F.texto}}>
						<div style={{fontWeight: 900, fontSize: 46, color: C.oro, lineHeight: 1}}>ESCANEA</div>
						<div style={{fontWeight: 900, fontSize: 30, color: '#FFFFFF', lineHeight: 1.15}}>Y COMPRA<br />TU ENTRADA</div>
						<div style={{marginTop: 8, fontFamily: F.titulo, fontSize: 66, color: C.marino, background: C.oro, padding: '0 18px', borderRadius: 14, display: 'inline-block', lineHeight: 1.1}}>$50</div>
						<div style={{marginTop: 6, fontWeight: 800, fontSize: 24, color: C.celeste}}>Info: 0412-272-1986</div>
					</div>
					<QR tam={230} />
				</div>
			</div>
			{/* cinta de escasez */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 1636, display: 'flex', justifyContent: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: C.marino, background: C.oro, padding: '9px 34px', borderRadius: 40, boxShadow: '0 6px 16px rgba(7,26,74,0.35)', border: '4px solid #FFFFFF'}}>AFORO LIMITADO · TU LUGAR SE CONFIRMA AL PAGAR</div>
			</div>
			{/* patrocinadores oficiales */}
			<div style={{position: 'absolute', left: M, right: M, top: 1958, bottom: M, display: 'flex', flexDirection: 'column', gap: 12}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{flex: 1, height: 3, background: `${C.marino}33`}} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 28, letterSpacing: 6, color: C.marino}}>PATROCINADORES OFICIALES</div>
					<div style={{flex: 1, height: 3, background: `${C.marino}33`}} />
				</div>
				<Franja ids={CLAROS} oscura={false} alto={156} />
				<Franja ids={OSCUROS} oscura alto={156} />
			</div>
		</AbsoluteFill>
	);
};
