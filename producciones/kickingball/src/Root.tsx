import React from 'react';
import {Composition, Still} from 'remotion';
import {Promo} from './Promo';
import {Flyer} from './Flyer';
import {FlyerB} from './FlyerB';
import {FlyerC} from './FlyerC';
export const Root: React.FC = () => (
	<>
		<Composition id="Promo" component={Promo} durationInFrames={900} fps={30} width={1080} height={1920} />
		<Still id="Flyer" component={Flyer} width={1080} height={1350} />
		<Still id="FlyerB" component={FlyerB} width={1080} height={1350} />
		<Still id="FlyerC" component={FlyerC} width={1080} height={1350} />
	</>
);
