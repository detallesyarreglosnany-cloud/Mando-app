import React from 'react';
import {Composition, Still} from 'remotion';
import {Llanera} from './Llanera';
import {FlyerAdentro, FlyerElementos, FlyerEntrada} from './Flyers';
export const Root: React.FC = () => (
	<>
		<Composition id="LlaneraVertical" component={Llanera} durationInFrames={1590} fps={30} width={1080} height={1920} />
		<Composition id="LlaneraCuadrado" component={Llanera} durationInFrames={1590} fps={30} width={1080} height={1080} />
		<Still id="FlyerEntrada" component={FlyerEntrada} width={1080} height={1350} />
		<Still id="FlyerAdentro" component={FlyerAdentro} width={1080} height={1350} />
		<Still id="FlyerElementos" component={FlyerElementos} width={1080} height={1350} />
	</>
);
