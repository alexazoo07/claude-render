import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapLayer, labelPt, FaceState} from './MapLayer3';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Flag, hi} from './flagimg3';
import {C, GEO, T, TEAMS} from './data3';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';

const ALL = TEAMS.map((t) => t.iso);
const OWN = Object.fromEntries(ALL.map((i) => [i, i]));
const FLAGS = TEAMS.map((t) => t.flag);
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.11}px #10131C`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #10131C, 0 ${size * 0.1}px ${size * 0.12}px rgba(0,0,0,0.55)`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)'}} />;
const facesAll = (mood: Mood, toMex = true): Record<string, FaceState> => {
	const MX = labelPt('MEX');
	return Object.fromEntries(ALL.map((k) => {
		const [x, y] = labelPt(k); const dx = MX[0] - x, dy = MX[1] - y, dl = Math.hypot(dx, dy) || 1;
		return [k, {mood: k === 'MEX' ? 'grito' : mood, look: toMex && k !== 'MEX' ? [dx / dl, dy / dl] : [0, 0], scale: 1.3}];
	}));
};

const Cut: React.FC<{iso: string; h: number; mood: Mood; glow?: string; faceScale?: number; crown?: boolean}> = ({iso, h, mood, glow = '#FFD23F', faceScale = 1, crown}) => {
	const g = GEO.teams[iso];
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 14, vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const [lx, ly] = labelPt(iso);
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	return (
		<svg width={(h * vw) / vh} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 0 ${h * 0.02}px ${glow}) drop-shadow(0 ${h * 0.025}px 0 rgba(0,0,0,0.45))`}}>
			<defs><clipPath id={'cut' + iso}><path d={g.d} /></clipPath></defs>
			<path d={g.d} fill="none" stroke={glow} strokeWidth={vh * 0.02} strokeLinejoin="round" />
			<g clipPath={`url(#cut${iso})`}><Flag iso={iso} x={x0} y={y0} w={x1 - x0} h={y1 - y0} /></g>
			<path d={g.d} fill="none" stroke={C.navy} strokeWidth={vh * 0.007} />
			<g transform={`translate(${lx} ${ly}) scale(${fs / 100}) translate(-100 -98)`}>
				<Eyes mood={mood} />
				<Mouth mood={mood} open={1} />
			</g>
			{crown && (
				<g transform={`translate(${lx + fs * 0.2} ${ly - fs * 0.95}) scale(${fs / 85})`}>
					<path d="M-40 10 L-46 -30 L-22 -8 L0 -40 L22 -8 L46 -30 L40 10 Z" fill="#FFD23F" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
					<circle cx={0} cy={-40} r={6} fill={C.red} stroke={C.navy} strokeWidth={3} />
				</g>
			)}
		</svg>
	);
};

export const T3a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<MapLayer cam={{x: 1230, y: 860, z: 1.5}} owners={OWN} faces={Object.fromEntries(ALL.map((k) => [k, {mood: 'enfado' as Mood, look: [-1, -0.3] as [number, number], scale: 1.3}]))} dim={0.3} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={104}>¿QUIÉN FRENA A</Txt></div>
		<div style={{position: 'absolute', left: 360, top: 215}}><Cut iso="MEX" h={340} mood="grito" faceScale={1.0} crown /></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={112} color="#2EC46B">MÉXICO?</Txt></div>
	</AbsoluteFill>
);

export const T3b: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 660, height: 720, background: 'linear-gradient(160deg, #1BA34E, #0B5C2B)'}} />
		<div style={{position: 'absolute', left: 620, top: 0, width: 660, height: 720, background: 'linear-gradient(200deg, #2C6BE0, #10357F)'}} />
		<svg width={1280} height={720} style={{position: 'absolute'}}>
			<path d="M690 -10 L600 330 L680 330 L590 730 L760 300 L670 300 L760 -10 Z" fill="#FFD23F" stroke="#10131C" strokeWidth={10} strokeLinejoin="round" />
		</svg>
		<div style={{position: 'absolute', left: 30, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>MÉXICO</Txt></div>
		<div style={{position: 'absolute', left: 690, top: 30, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={96}>BELICE</Txt></div>
		<div style={{position: 'absolute', left: 130, top: 150}}><Hincha iso={hi('MEX')} mood="grito" size={380} scarf={T.MEX.scarf} /></div>
		<div style={{position: 'absolute', left: 800, top: 200}}><Hincha iso={hi('BLZ')} mood="miedo" size={300} scarf={T.BLZ.scarf} sweat /></div>
		<div style={{position: 'absolute', left: 40, top: 560, width: 580, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#FFD23F">#10</Txt></div>
		<div style={{position: 'absolute', left: 680, top: 560, width: 560, display: 'flex', justifyContent: 'center'}}><Txt size={120} color="#FF3B30">#180</Txt></div>
	</AbsoluteFill>
);

export const T3c: React.FC = () => {
	const MX = labelPt('MEX');
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts /><FlagPreload flags={FLAGS} />
			<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
				<MapLayer cam={{x: 960, y: 640, z: 0.95}} owners={OWN} faces={facesAll('enfado')}>
					{ALL.filter((k) => k !== 'MEX').map((k) => {
						const [x, y] = labelPt(k);
						return <path key={k} d={`M${x} ${y} Q${(x + MX[0]) / 2} ${(y + MX[1]) / 2 - 40} ${MX[0]} ${MX[1]}`} fill="none" stroke="#FF3B30" strokeWidth={6} strokeLinecap="round" opacity={0.9} />;
					})}
				</MapLayer>
			</div>
			<Vignette />
			<div style={{position: 'absolute', left: 36, top: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
				<Txt size={104}>16 CONTRA</Txt>
				<Txt size={104} color="#2EC46B">MÉXICO</Txt>
			</div>
			<div style={{position: 'absolute', right: 36, bottom: 40}}><Txt size={84} color="#FFD23F">¿QUIÉN GANA?</Txt></div>
		</AbsoluteFill>
	);
};

export const T3d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
			<MapLayer cam={{x: 900, y: 520, z: 0.8}} owners={OWN} faces={facesAll('miedo', false)} dim={0.5} />
		</div>
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', justifyContent: 'center'}}><Txt size={100}>IMPERIALISMO</Txt></div>
		<div style={{position: 'absolute', left: 120, top: 190}}><Hincha iso={hi('USA')} mood="enfado" size={330} scarf={T.USA.scarf} look={[0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 830, top: 190}}><Hincha iso={hi('MEX')} mood="enfado" size={330} scarf={T.MEX.scarf} look={[-0.6, 0]} /></div>
		<div style={{position: 'absolute', left: 540, top: 300}}><Txt size={140} color="#FFD23F">VS</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><Txt size={104} color="#2EC46B">CONCACAF</Txt></div>
	</AbsoluteFill>
);
