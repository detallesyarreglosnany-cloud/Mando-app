import React from 'react';
import {Composition} from 'remotion';
import {Cumbre} from './Cumbre';
import {Sencilla} from './Sencilla';
import {Directo, DURACION_DIRECTO} from './Directo';
import {DirectoVoz, DURACION_VOZ} from './DirectoVoz';
export const Root: React.FC = () => (
	<>
		<Composition id="CumbrePatrocinadores" component={Cumbre} defaultProps={{version: 'A' as const, conAudio: true}} durationInFrames={86 * 30} fps={30} width={1080} height={1920} />
		<Composition id="CumbrePublico" component={Cumbre} defaultProps={{version: 'B' as const, conAudio: true}} durationInFrames={84 * 30} fps={30} width={1080} height={1920} />
		<Composition id="CumbreSencilla" component={Sencilla} durationInFrames={54 * 30} fps={30} width={1080} height={1920} />
		<Composition id="CumbreDirecto" component={Directo} durationInFrames={DURACION_DIRECTO * 30} fps={30} width={1080} height={1920} />
		<Composition id="CumbreDirectoVoz" component={DirectoVoz} durationInFrames={Math.ceil(DURACION_VOZ * 30)} fps={30} width={1080} height={1920} />
	</>
);
