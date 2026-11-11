import React from 'react';
import {Still} from 'remotion';
import {PendonA, PendonB, PendonC} from './Pendon';
// 1600 × 2400 px de diseño = 80 × 120 cm. Se exporta con --scale 2.953 → 4725 × 7087 px = 150 ppp reales.
export const Root: React.FC = () => (
	<>
		<Still id="PendonA" component={PendonA} width={1600} height={2400} />
		<Still id="PendonB" component={PendonB} width={1600} height={2400} />
		<Still id="PendonC" component={PendonC} width={1600} height={2400} />
	</>
);
