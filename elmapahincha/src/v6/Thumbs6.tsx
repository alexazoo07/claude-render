import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MapLayer, labelPt, FaceState} from './MapLayer6';
import {Eyes, Hincha, Mood, Mouth} from '../Hincha';
import {Flag, FlagChip, hi} from './flagimg6';
import {C, GEO, T, TEAMS} from './data6';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {GTxt, Sparkle} from '../v5/Thumbs5';
import odds from './odds6.json';
import {STATES, territoriesOf} from './game6';

const ALL = TEAMS.map((t) => t.iso);
const OWN = Object.fromEntries(ALL.map((i) => [i, i]));
const FLAGS = TEAMS.map((t) => t.flag);
const facesAll = (mood: Mood, look: [number, number] = [0, 0]): Record<string, FaceState> => Object.fromEntries(ALL.map((k) => [k, {mood, look, scale: 1.2}]));
const MapBg: React.FC<{x: number; y: number; z: number; owners?: Record<string, string>; faces?: Record<string, FaceState>; dim?: number}> = ({x, y, z, owners = OWN, faces, dim = 0}) => (
	<div style={{position: 'absolute', left: -320, top: -180, width: 1920, height: 1080}}>
		<MapLayer cam={{x, y, z}} owners={owners} faces={faces ?? facesAll('feliz')} unified={owners !== OWN} dim={dim} />
	</div>
);
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />;

const Cut: React.FC<{k: string; h: number; mood: Mood; glow?: string; faceScale?: number; crown?: boolean}> = ({k, h, mood, glow = '#FFFFFF', faceScale = 1, crown}) => {
	const g = GEO.teams[k];
	const [[x0, y0], [x1, y1]] = g.b;
	const pad = 10, vw = x1 - x0 + pad * 2, vh = y1 - y0 + pad * 2;
	const [lx, ly] = labelPt(k);
	const fs = Math.min(vw, vh) * 0.42 * faceScale;
	return (
		<svg width={(h * vw) / vh} height={h} viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`} style={{overflow: 'visible', filter: `drop-shadow(0 0 ${h * 0.012}px ${glow}) drop-shadow(0 0 ${h * 0.03}px ${glow}) drop-shadow(0 0 ${h * 0.05}px ${glow}) drop-shadow(0 ${h * 0.02}px ${h * 0.01}px rgba(0,0,0,0.5))`}}>
			<defs><clipPath id={'t6' + k}><path d={g.d} /></clipPath></defs>
			<g clipPath={`url(#t6${k})`}>{(g.pb ?? [[x0, y0, x1, y1]]).map((q, i) => <Flag key={i} iso={k} x={q[0] - 1} y={q[1] - 1} w={q[2] - q[0] + 2} h={q[3] - q[1] + 2} />)}</g>
			<path d={g.d} fill="none" stroke={C.navy} strokeWidth={vh * 0.008} strokeLinejoin="round" />
			<g transform={`translate(${lx} ${ly}) scale(${fs / 100}) translate(-100 -98)`}>
				<Eyes mood={mood} />
				<Mouth mood={mood} open={1} />
			</g>
			{crown && (
				<g transform={`translate(${lx + fs * 0.15} ${ly - fs * 0.95}) scale(${fs / 85})`}>
					<path d="M-40 10 L-46 -30 L-22 -8 L0 -40 L22 -8 L46 -30 L40 10 Z" fill="#FFD23F" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
					<circle cx={0} cy={-40} r={6} fill={C.red} stroke={C.navy} strokeWidth={3} />
				</g>
			)}
		</svg>
	);
};

// 1) who conquers Europe? Spain glowing with crown on the flag map
export const T6a: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<MapBg x={1000} y={640} z={0.95} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><GTxt size={96}>¿QUIÉN CONQUISTA</GTxt></div>
		<div style={{position: "absolute", left: 500, top: 215}}><Cut k="ESP" h={320} mood="grito" crown faceScale={1.15} /></div>
		<Sparkle x={460} y={220} s={70} /><Sparkle x={860} y={190} s={50} /><Sparkle x={840} y={500} s={60} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><GTxt size={112} color="#2F7DE1">EUROPA?</GTxt></div>
	</AbsoluteFill>
);

// 2) the cinderella: Estonia
export const T6b: React.FC = () => {
	const st = STATES.reduce((best, o) => (territoriesOf(o, 'EST').length > territoriesOf(best, 'EST').length ? o : best), STATES[0]);
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts /><FlagPreload flags={FLAGS} />
			<MapBg x={1150} y={600} z={0.85} owners={st} faces={{EST: {mood: 'grito', scale: 1.3}}} />
			<Vignette />
			<div style={{position: 'absolute', left: 30, top: 24}}><GTxt size={92}>DEL PUESTO 41...</GTxt></div>
			<div style={{position: 'absolute', left: 30, top: 590}}><GTxt size={100} color={C.yellow}>A 22 TERRITORIOS</GTxt></div>
			<div style={{position: 'absolute', left: 900, top: 120, filter: 'drop-shadow(0 0 16px #fff) drop-shadow(0 0 32px #fff)'}}><Hincha iso={hi('EST')} mood="grito" size={330} scarf={T.EST.scarf} /></div>
			<Sparkle x={900} y={150} s={60} /><Sparkle x={1220} y={420} s={50} />
		</AbsoluteFill>
	);
};

// 3) the odds board
export const T6c: React.FC = () => {
	const o = odds as Record<string, number>;
	const rows: [string, string, string][] = [['ESP', `${o.ESP.toLocaleString('es-ES')}%`, C.yellow], ['ENG', `${o.ENG.toLocaleString('es-ES')}%`, '#2EC46B'], ['EST', `${o.EST.toLocaleString('es-ES')}%`, '#FF3B30']];
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts /><FlagPreload flags={FLAGS} />
			<MapBg x={1000} y={640} z={0.95} dim={0.6} />
			<Vignette />
			<div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><GTxt size={84}>20.000 SIMULACIONES</GTxt></div>
			<div style={{position: 'absolute', left: 170, top: 140, display: 'flex', flexDirection: 'column', gap: 18}}>
				{rows.map(([k, v, c]) => (
					<div key={k} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '10px 26px', borderRadius: 24, background: 'rgba(11,30,63,0.95)', border: `6px solid ${c}`, boxShadow: `0 0 24px ${c}`}}>
						<Hincha iso={hi(k)} mood={k === 'EST' ? 'miedo' : 'grito'} size={110} scarf={T[k].scarf} />
						<span style={{width: 420, fontFamily: LILITA, fontSize: 64, color: '#fff'}}>{T[k].name.toUpperCase()}</span>
						<span style={{fontFamily: LILITA, fontSize: 80, color: c, WebkitTextStroke: '8px #10131C', paintOrder: 'stroke fill'}}>{v}</span>
					</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}><GTxt size={92} color="#FF3B30">¿Y EN LA DE VERDAD?</GTxt></div>
		</AbsoluteFill>
	);
};

// 4) 51 -> 1
export const T6d: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<MapBg x={1000} y={640} z={0.95} faces={facesAll('enfado', [0.3, 0])} />
		<AbsoluteFill style={{background: 'rgba(8,20,40,0.35)'}} />
		<div style={{position: 'absolute', left: 60, top: 120, display: 'flex', alignItems: 'center', gap: 20}}>
			<GTxt size={260} color="#FFFFFF">51</GTxt>
			<svg width={200} height={120} viewBox="0 0 200 120" style={{filter: 'drop-shadow(0 0 12px #fff)'}}><path d="M10 45 H130 V15 L190 60 L130 105 V75 H10 Z" fill={C.yellow} stroke="#10131C" strokeWidth={10} strokeLinejoin="round" /></svg>
			<GTxt size={260} color={C.yellow}>1</GTxt>
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}><GTxt size={104} color="#FF3B30">GUERRA EN EUROPA</GTxt></div>
	</AbsoluteFill>
);

// 5) imperialismo europeo title + three favourites
export const T6e: React.FC = () => (
	<AbsoluteFill style={{background: C.navy}}>
		<Fonts /><FlagPreload flags={FLAGS} />
		<MapBg x={1000} y={640} z={0.95} />
		<Vignette />
		<div style={{position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', justifyContent: 'center'}}><GTxt size={110}>IMPERIALISMO</GTxt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', gap: 30}}>
			{['ESP', 'ENG', 'FRA'].map((k, i) => (
				<div key={k} style={{transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -20 : 0}px)`, filter: 'drop-shadow(0 0 14px #fff) drop-shadow(0 0 28px #fff)'}}><Hincha iso={hi(k)} mood={i === 0 ? 'grito' : 'enfado'} size={280} scarf={T[k].scarf} look={[(1 - i) * 0.5, 0]} /></div>
			))}
		</div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}><GTxt size={112} color="#2F7DE1">EUROPEO</GTxt></div>
	</AbsoluteFill>
);
