import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';

// Paleta tomada de las piezas oficiales de la cumbre
export const C = {
	marino: '#071A4A',
	azul: '#1E4FD8',
	celeste: '#4FC3F7',
	oro: '#F2C230',
	blanco: '#FFFFFF',
	rojo: '#E5383B',
	gris: '#9AA3B2',
};
export const F = {titulo: 'Anton, sans-serif', texto: 'Montserrat, sans-serif'};
export const S = (s: number) => Math.round(s * 30);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const sombra = '0 6px 24px rgba(0,0,0,0.85)';

export const golpe = (f: number, d = 0, desde = 1.7) =>
	interpolate(spring({frame: f - d, fps: 30, config: {damping: 12, stiffness: 190, mass: 0.7}}), [0, 1], [desde, 1]);
export const entra = (f: number, d: number, dur = 6) => interpolate(f, [d, d + dur], [0, 1], clamp);
export const sube = (f: number, d: number, px = 60) => interpolate(spring({frame: f - d, fps: 30, config: {damping: 14}}), [0, 1], [px, 0]);
export const sacudir = (f: number, d: number, fuerza = 12, dur = 9) => {
	const k = f - d;
	if (k < 0 || k > dur) return 'none';
	const a = fuerza * (1 - k / dur);
	return `translate(${(random(`x${d}${k}`) - 0.5) * 2 * a}px,${(random(`y${d}${k}`) - 0.5) * 2 * a}px)`;
};

export const useFuentes = () => {
	const [h] = useState(() => delayRender('fuentes'));
	useEffect(() => {
		const caras = [
			new FontFace('Anton', `url(${staticFile('fonts/Anton-Regular.ttf')})`),
			new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat.ttf')})`, {weight: '100 900'}),
		];
		Promise.all(caras.map((c) => c.load())).then((cs) => {
			cs.forEach((c) => document.fonts.add(c));
			continueRender(h);
		});
	}, [h]);
};

export const Destello: React.FC<{en: number; dur?: number; max?: number; color?: string}> = ({en, dur = 6, max = 0.7, color = '#fff'}) => {
	const f = useCurrentFrame();
	const o = f >= en ? interpolate(f, [en, en + dur], [max, 0], clamp) : 0;
	return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

// Foto a pantalla completa con acercamiento lento
export const Foto: React.FC<{src: string; dur: number; zoom?: [number, number]; pos?: string; filtro?: string}> = ({src, dur, zoom = [1.04, 1.14], pos = 'center', filtro}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${interpolate(f, [0, dur], zoom, clamp)})`, filter: filtro}} />
		</AbsoluteFill>
	);
};

export const Velo: React.FC<{arriba?: number; abajo?: number; medio?: number}> = ({arriba = 0.8, abajo = 0.92, medio = 0.1}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(7,26,74,${arriba}) 0%, rgba(7,26,74,${medio}) 28%, rgba(7,26,74,${medio}) 50%, rgba(7,26,74,${abajo}) 78%)`}} />
);

// Partículas celestes de fondo (estilo de las piezas oficiales)
export const Brillos: React.FC<{n?: number; semilla: string}> = ({n = 26, semilla}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{new Array(n).fill(0).map((_, i) => {
				const x = random(`${semilla}x${i}`) * 1080;
				const y = 1960 - ((f * (1 + random(`${semilla}v${i}`) * 3) + random(`${semilla}y${i}`) * 2200) % 2100);
				const s = 3 + random(`${semilla}s${i}`) * 5;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: C.celeste, opacity: 0.3 + 0.5 * Math.abs(Math.sin(f / 8 + i)), boxShadow: `0 0 ${s * 3}px ${C.celeste}`}} />;
			})}
		</AbsoluteFill>
	);
};

export const FondoMarca: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, #12358F 0%, ${C.marino} 60%, #030B24 100%)`}}>
			<AbsoluteFill style={{opacity: 0.25, background: `repeating-linear-gradient(${110 + Math.sin(f / 40) * 4}deg, transparent 0 60px, ${C.celeste}22 60px 62px)`}} />
		</AbsoluteFill>
	);
};

// Píldora de etiqueta
export const Pildora: React.FC<{children: React.ReactNode; color?: string; fondo?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.marino, fondo = C.oro, size = 34, style}) => (
	<span style={{fontFamily: F.texto, fontWeight: 900, fontSize: size, letterSpacing: 3, color, background: fondo, padding: `${size * 0.25}px ${size * 0.8}px`, borderRadius: 60, boxShadow: `0 0 26px ${fondo}88`, whiteSpace: 'nowrap', ...style}}>{children}</span>
);
