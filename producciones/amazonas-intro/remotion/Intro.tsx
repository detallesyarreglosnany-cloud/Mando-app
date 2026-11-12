import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import cfg from '../config/recorrido.json';

// Capa gráfica sobre los cuadros satelitales capturados de CesiumJS. Todo lo editable (textos, tiempos de las paradas,
// logo, música) sale de config/recorrido.json.
export type Props = {formato: string; cuadros: number};

const ORO = '#F2C230', CELESTE = '#7FD3FF', BLANCO = '#FFFFFF';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const suave = Easing.bezier(0.22, 1, 0.36, 1);
// Opacidad de una ventana [a, b] (en u) con entrada y salida suaves
const ventana = (u: number, a: number, b: number, f = 0.02) => interpolate(u, [a, a + f, b - f, b], [0, 1, 1, 0], clamp);

const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [new FontFace('Anton', `url(${staticFile('fuentes/Anton-Regular.ttf')})`), new FontFace('Montserrat', `url(${staticFile('fuentes/Montserrat.ttf')})`, {weight: '100 900'})];
		Promise.all(caras.map((c) => c.load())).then((cs) => { cs.forEach((c) => document.fonts.add(c)); continueRender(h); });
	}, [h]);
};

export const Intro: React.FC<Props> = ({formato, cuadros}) => {
	useFuentes();
	const f = useCurrentFrame();
	const {width: W, height: H, durationInFrames} = useVideoConfig();
	const u = durationInFrames > 1 ? f / (durationInFrames - 1) : 0;
	const vertical = H > W;
	const k = W / (vertical ? 1080 : 1920); // escala tipográfica relativa al diseño base
	const idx = Math.min(cuadros - 1, Math.round(u * (cuadros - 1)));
	const T = cfg.textos;
	const paradas = cfg.paradas;
	const activa = paradas.findIndex((p) => u >= p.t - 0.045 && u < p.t + 0.045);
	const finalU = 0.94;

	const etiquetaGrande = (texto: string, a: number, b: number, color = BLANCO, tam = 96) => {
		const o = ventana(u, a, b, 0.025);
		const esp = interpolate(u, [a, b], [0.5, 0.32], clamp);
		return (
			<div style={{opacity: o, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 300, fontSize: tam * k, letterSpacing: `${esp}em`, color, textShadow: '0 4px 30px rgba(0,0,0,0.7)', marginRight: `-${esp}em`}}>{texto}</div>
		);
	};
	const linea = (a: number, b: number) => (
		<div style={{height: 2 * k, width: interpolate(u, [a, a + 0.04], [0, 360 * k], {...clamp, easing: suave}), background: `linear-gradient(90deg, transparent, ${ORO}, transparent)`, opacity: ventana(u, a, b, 0.025), margin: `${14 * k}px auto`}} />
	);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			{cfg.musica && <Audio src={staticFile(cfg.musica)} />}
			<Img src={staticFile(`cuadros/${formato}/${String(idx).padStart(4, '0')}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			{/* acabado cinematográfico: viñeta y degradados para que los textos respiren */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(3,10,30,0.55) 0%, transparent ${vertical ? 22 : 28}%, transparent 62%, rgba(3,10,30,0.75) 100%)`}} />

			{/* identificación geográfica */}
			<AbsoluteFill style={{justifyContent: vertical ? 'flex-start' : 'center', paddingTop: vertical ? 260 * k : 0, alignItems: 'center'}}>
				{etiquetaGrande(T.pais, 0.10, 0.25)}
				{linea(0.11, 0.25)}
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: vertical ? 'flex-start' : 'center', paddingTop: vertical ? 260 * k : 0, alignItems: 'center'}}>
				{etiquetaGrande(T.estado, 0.255, 0.355, ORO, 70)}
				{linea(0.26, 0.355)}
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: vertical ? 'flex-start' : 'center', paddingTop: vertical ? 260 * k : 0, alignItems: 'center'}}>
				{etiquetaGrande(T.ciudad, 0.355, 0.415, BLANCO, 74)}
				<div style={{opacity: ventana(u, 0.36, 0.415), fontFamily: 'monospace', fontSize: 26 * k, color: CELESTE, letterSpacing: '0.1em'}}>5.6663° N · 67.6283° O</div>
			</AbsoluteFill>

			{/* rótulo de cada parada */}
			{paradas.map((p, i) => {
				const o = ventana(u, p.t - 0.045, p.t + 0.045, 0.018);
				if (o <= 0) return null;
				const x = interpolate(u, [p.t - 0.045, p.t - 0.02], [-40, 0], {...clamp, easing: suave});
				return (
					<div key={p.id} style={{position: 'absolute', left: (vertical ? 70 : 110) * k, bottom: (vertical ? 300 : 150) * k, opacity: o, transform: `translateX(${x * k}px)`}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 14 * k, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 24 * k, letterSpacing: '0.25em', color: ORO}}>
							<span style={{width: 46 * k, height: 2 * k, background: ORO}} />{String(i + 1).padStart(2, '0')} / {String(paradas.length).padStart(2, '0')}
						</div>
						<div style={{fontFamily: 'Anton', fontSize: (vertical ? 92 : 84) * k, color: BLANCO, lineHeight: 1.05, marginTop: 8 * k, textShadow: '0 4px 30px rgba(0,0,0,0.75)', maxWidth: (vertical ? 940 : 1400) * k}}>{p.nombre.toUpperCase()}</div>
						<div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 30 * k, color: CELESTE, marginTop: 6 * k}}>{p.detalle} · <span style={{fontFamily: 'monospace'}}>{p.lat.toFixed(4)}°, {p.lng.toFixed(4)}°</span></div>
					</div>
				);
			})}

			{/* cierre: identidad de la Cumbre (espacio reservado para el logo oficial) */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 18 * k, opacity: interpolate(u, [finalU, finalU + 0.03], [0, 1], clamp), background: `rgba(3,10,30,${interpolate(u, [finalU, 1], [0, 0.45], clamp)})`}}>
				{cfg.logo ? (
					<Img src={staticFile(cfg.logo)} style={{height: 200 * k, objectFit: 'contain'}} />
				) : (
					<div style={{width: 300 * k, height: 170 * k, border: `2px dashed ${BLANCO}88`, borderRadius: 16 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 * k, letterSpacing: '0.2em', color: `${BLANCO}AA`}}>LOGO OFICIAL</div>
				)}
				<div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 34 * k, letterSpacing: '0.3em', color: BLANCO, textAlign: 'center', padding: `0 ${40 * k}px`}}>{T.titulo_1}</div>
				<div style={{fontFamily: 'Anton', fontSize: 120 * k, color: ORO, letterSpacing: '0.04em', textShadow: `0 0 40px ${ORO}66`}}>{T.titulo_2}</div>
			</AbsoluteFill>

			{/* atribución obligatoria de las fuentes (CC BY 4.0 y Copernicus) */}
			<div style={{position: 'absolute', left: 24 * k, right: 24 * k, bottom: 18 * k, fontFamily: 'Montserrat', fontWeight: 500, fontSize: (vertical ? 13 : 12) * k, lineHeight: 1.35, color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 4px rgba(0,0,0,0.9)'}}>{T.atribucion}</div>
		</AbsoluteFill>
	);
};
