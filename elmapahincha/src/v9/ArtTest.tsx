import React from 'react';
import {AbsoluteFill} from 'remotion';
import {STADIUMS} from './data9';
import {StadiumArt} from './StadiumArt';
export const ArtTest: React.FC = () => (
	<AbsoluteFill style={{background: '#223', display: 'flex', flexWrap: 'wrap', gap: 10, padding: 10}}>
		{STADIUMS.map((s) => <div key={s.key} style={{border: '4px solid #000'}}><StadiumArt art={s.art} id={s.key} w={370} h={211} t={30} /></div>)}
	</AbsoluteFill>
);
