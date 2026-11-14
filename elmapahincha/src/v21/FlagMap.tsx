import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {FlagCover} from '../flagCover';
import {FlagPreload} from '../v2/Preload';
import {ALL, FL} from './data21';
// static texture: every FIFA country filled with its flag, in world coords (REL box 0,20,3830,1720) at 2x
export const FlagMap: React.FC = () => (
	<AbsoluteFill style={{background: 'transparent'}}>
		<FlagPreload flags={ALL.map((k) => FL[k])} />
		<svg width={7660} height={3440}>
			<defs>{ALL.map((k) => <clipPath key={k} id={'fm' + k}><path d={WORLD[k].d} /></clipPath>)}</defs>
			<g transform="scale(2) translate(0 -20)">
				{ALL.map((k) => {
					const W = WORLD[k];
					const boxes = W.pb && W.pb.length ? W.pb : [[W.b[0][0], W.b[0][1], W.b[1][0], W.b[1][1]]];
					return <g key={k} clipPath={`url(#fm${k})`}>{boxes.map((q, i) => <FlagCover key={i} flag={FL[k]} x={q[0] - 1.5} y={q[1] - 1.5} w={q[2] - q[0] + 3} h={q[3] - q[1] + 3} />)}</g>;
				})}
			</g>
		</svg>
	</AbsoluteFill>
);
