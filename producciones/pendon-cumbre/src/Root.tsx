import React from 'react';
import {Still} from 'remotion';
import {PendonA, PendonB, PendonC} from './Pendon';
import {PendonFinal} from './PendonFinal';
import {PendonMarcas} from './PendonMarcas';
import {PendonOOH} from './PendonOOH';
// 1600 × 2400 px de diseño = 80 × 120 cm. Se exporta con --scale 2.953125 → 4725 × 7088 px = 150 ppp reales.
export const Root: React.FC = () => (
	<>
		<Still id="PendonFinal" component={PendonFinal} width={1600} height={2400} />
		<Still id="PendonMarcas" component={PendonMarcas} width={1600} height={2400} />
		<Still id="PendonOOH" component={PendonOOH} width={1800} height={3000} />
		<Still id="PendonA" component={PendonA} width={1600} height={2400} />
		<Still id="PendonB" component={PendonB} width={1600} height={2400} />
		<Still id="PendonC" component={PendonC} width={1600} height={2400} />
	</>
);
