import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './Intro';
import cfg from '../config/recorrido.json';

// Una sola composición: el formato, la duración y la cantidad de cuadros capturados llegan como props
// (scripts/render.sh los pasa con --props). El tamaño final sale de config/recorrido.json.
type P = {formato: string; cuadros: number; duracion: number; cierre?: 'titulo' | 'sede'};
const formatos = cfg.formatos as Record<string, {ancho: number; alto: number}>;
export const Root: React.FC = () => (
	<Composition
		id="Intro"
		component={Intro as React.FC<P>}
		defaultProps={{formato: 'prueba_vertical', cuadros: Math.round(cfg.duracion_s * cfg.fps), duracion: cfg.duracion_s}}
		calculateMetadata={({props}) => ({durationInFrames: Math.round(props.duracion * cfg.fps), width: formatos[props.formato].ancho, height: formatos[props.formato].alto, fps: cfg.fps})}
		durationInFrames={Math.round(cfg.duracion_s * cfg.fps)} fps={cfg.fps} width={1080} height={1920}
	/>
);
