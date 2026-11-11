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
const PUBLICO = ['Líderes con personal a su cargo', 'Dueños de comercio', 'Emprendedores con negocio en marcha', 'De marca personal a marca empresarial'];
// Logos con dibujo oscuro → franja clara; logos con dibujo claro → franja azul noche
const CLAROS = [3, 4, 6, 8, 9, 12, 14, 16];
const OSCUROS = [1, 2, 5, 10, 11, 13, 15, 17];

// ---------- Título de la cumbre (bloque protagonista) ----------
const Cabecera: React.FC = () => (
	<div style={{position: 'absolute', left: M, right: M, top: M, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
			<div style={{width: 120, height: 5, background: C.oro, borderRadius: 3}} />
			<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 46, letterSpacing: 14, color: C.azul}}>CUMBRE DE</div>
			<div style={{width: 120, height: 5, background: C.oro, borderRadius: 3}} />
		</div>
		<div style={{fontFamily: F.titulo, fontSize: 116, lineHeight: 1.02, color: C.marino, letterSpacing: 1, whiteSpace: 'nowrap'}}>TRANSFORMACIÓN EMPRESARIAL</div>
		<div style={{marginTop: 8, fontFamily: F.texto, fontWeight: 900, fontSize: 34, letterSpacing: 14, color: '#FFFFFF', background: C.azul, padding: '8px 36px', borderRadius: 40}}>AMAZONAS 2026</div>
	</div>
);

// ---------- Título en escalera: LIDERA → VENDE → CRECE ----------
const ESCALONES = [
	{palabra: 'LIDERA', sub: 'a tu equipo', alto: 86, color: C.azul, font: 168},
	{palabra: 'VENDE', sub: 'más y mejor', alto: 166, color: C.marino, font: 176},
	{palabra: 'CRECE', sub: 'hacia el 2027', alto: 246, color: C.oro, font: 196},
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
						<div style={{position: 'absolute', left: x, top: top - e.font - 4, width: ancho, textAlign: 'center', fontFamily: F.titulo, fontSize: e.font, lineHeight: 1, color: final ? C.oro : i === 0 ? C.azul : C.marino}}>{e.palabra}</div>
						<div style={{position: 'absolute', left: x, top, width: ancho, height: e.alto, background: e.color, borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 14, paddingTop: 20, boxSizing: 'border-box'}}>
							<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: 32, color: final ? C.marino : C.oro}}>{`0${i + 1}`}</span>
							<span style={{fontFamily: F.texto, fontWeight: 800, fontSize: 34, color: final ? C.marino : '#FFFFFF'}}>{e.sub}</span>
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

// Proporción (ancho/alto) de cada logo ya recortado: se usa para que todos pesen igual a la vista
const PROP: Record<number, number> = {1: 743 / 296, 2: 650 / 493, 3: 818 / 275, 4: 656 / 761, 5: 903 / 259, 6: 871 / 210, 8: 868 / 313, 9: 854 / 803, 10: 952 / 461, 11: 1, 12: 912 / 162, 13: 867 / 459, 14: 833 / 778, 15: 993 / 992, 16: 634 / 139, 17: 417 / 151};
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
	const items = tamanos(ids, 1600 - 2 * M - 2 * padX, alto - 34, gap);
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
	const BASE = 762; // suelo de la escalera
	return (
		<AbsoluteFill style={{background: '#FFFFFF'}}>
			<Cabecera />
			<Escalera base={BASE} />
			<AbsoluteFill style={{top: BASE + 16, alignItems: 'center'}}>
				<div style={{width: 1400, fontFamily: F.texto, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: C.tinta, textAlign: 'center'}}>
					Herramientas reales para vender más, ganar más y <span style={{color: C.azul, fontWeight: 900}}>competir en lo que viene para Venezuela.</span>
				</div>
			</AbsoluteFill>
			{/* ponentes: más grandes */}
			<div style={{position: 'absolute', left: M - 10, right: M - 10, top: 888, display: 'flex', justifyContent: 'space-between'}}>
				{PONENTES.map((p) => (
					<div key={p.nombre} style={{width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<div style={{width: 350, height: 380, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', borderRadius: '175px 175px 24px 24px', background: `linear-gradient(180deg, #3D6BE0, ${C.marino})`, border: `6px solid ${C.oro}`, boxSizing: 'border-box'}}>
							<Img src={staticFile(p.foto)} style={{height: 362, objectFit: 'contain'}} />
						</div>
						<div style={{marginTop: 12, fontFamily: F.titulo, fontSize: 48, color: C.marino, whiteSpace: 'nowrap', lineHeight: 1.05}}>{p.nombre}</div>
						<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 36, color: C.azul, lineHeight: 1.2}}>{p.logro}</div>
						<div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 26, color: C.gris}}>{p.tema}</div>
					</div>
				))}
			</div>
			{/* panel: justo debajo de los ponentes */}
			<AbsoluteFill style={{top: 1432, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 800, fontSize: 32, color: C.marino, border: `3px solid ${C.azul}`, padding: '8px 30px', borderRadius: 40}}>+ Panel central con experto tributario y asesor laboral</div>
			</AbsoluteFill>
			{/* diseñada para: con aire */}
			<AbsoluteFill style={{top: 1516, alignItems: 'center'}}>
				<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.marino, background: C.oro, padding: '6px 26px', borderRadius: 10}}>DISEÑADA PARA</div>
				<div style={{marginTop: 16, width: 1440, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14}}>
					{PUBLICO.map((t) => <div key={t} style={{fontFamily: F.texto, fontWeight: 800, fontSize: 29, color: '#FFFFFF', background: C.azul, padding: '8px 24px', borderRadius: 40}}>{t}</div>)}
				</div>
			</AbsoluteFill>
			{/* cinta de escasez: separada de la tarjeta */}
			<AbsoluteFill style={{top: 1726, alignItems: 'center'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{width: 90, height: 4, background: C.oro, borderRadius: 2}} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: C.marino}}>AFORO LIMITADO · TU LUGAR SE CONFIRMA AL PAGAR</div>
					<div style={{width: 90, height: 4, background: C.oro, borderRadius: 2}} />
				</div>
			</AbsoluteFill>
			{/* tarjeta de compra */}
			<div style={{position: 'absolute', left: M, right: M, top: 1786, height: 220, borderRadius: 30, background: C.marino, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px'}}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 10, fontFamily: F.texto, color: '#FFFFFF'}}>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>VIERNES </span><span style={{fontWeight: 900, fontSize: 44}}>4 DE DICIEMBRE</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 700, fontSize: 26, color: C.celeste, letterSpacing: 3}}>DESDE LAS </span><span style={{fontWeight: 900, fontSize: 44}}>2:00 PM</span></div>
					<div style={{lineHeight: 1}}><span style={{fontWeight: 900, fontSize: 40}}>Club Parapata</span><span style={{fontWeight: 700, fontSize: 28, color: C.celeste}}> · Puerto Ayacucho</span></div>
					<div style={{fontWeight: 800, fontStyle: 'italic', fontSize: 29, color: C.oro}}>Mientras lo piensas, tu competencia aparta su lugar.</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
					<div style={{textAlign: 'right', fontFamily: F.texto}}>
						<div style={{fontWeight: 900, fontSize: 48, color: C.oro, lineHeight: 1}}>ESCANEA</div>
						<div style={{fontWeight: 900, fontSize: 31, color: '#FFFFFF', lineHeight: 1.15}}>Y COMPRA<br />TU ENTRADA</div>
						<div style={{marginTop: 10, fontWeight: 800, fontSize: 25, color: '#FFFFFF'}}>$50 a tasa BCV</div>
						<div style={{fontWeight: 800, fontSize: 25, color: C.celeste}}>Info: 0412-272-1986</div>
					</div>
					<QR tam={200} />
				</div>
			</div>
			{/* patrocinadores oficiales */}
			<div style={{position: 'absolute', left: M, right: M, top: 2024, bottom: M, display: 'flex', flexDirection: 'column', gap: 10}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{flex: 1, height: 3, background: `${C.marino}33`}} />
					<div style={{fontFamily: F.texto, fontWeight: 900, fontSize: 28, letterSpacing: 6, color: C.marino}}>PATROCINADORES OFICIALES</div>
					<div style={{flex: 1, height: 3, background: `${C.marino}33`}} />
				</div>
				<Franja ids={CLAROS} oscura={false} alto={122} />
				<Franja ids={OSCUROS} oscura alto={122} />
			</div>
		</AbsoluteFill>
	);
};
