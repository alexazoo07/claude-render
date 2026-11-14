import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import {ALL, FL} from './data21';
import {Wheel} from './Video21';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.07}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const wide = (k: string) => { const b = WORLD[k].b; return b[1][0] - b[0][0] > 22 && b[1][1] - b[0][1] > 14; };
const Map: React.FC<{cam: {x: number; y: number; z: number}; grey?: (k: string) => boolean; big?: Record<string, FaceMood>; mood?: FaceMood; dark?: number}> = ({cam, grey = () => false, big = {}, mood = 'worried', dark = 0.15}) => {
	const fills: Record<string, Fill> = {}, faces: Record<string, FaceSpec> = {};
	for (const k of ALL) {
		if (!WORLD[k]) continue;
		if (grey(k)) { fills[k] = {color: '#5B616D'}; continue; }
		fills[k] = big[k] ? {flag: FL[k], lift: 1} : {flag: FL[k]};
		if (big[k]) faces[k] = {mood: big[k], size: 1.5, max: 300};
		else if (wide(k)) faces[k] = {mood, size: 0.8, max: 80};
	}
	return <><FlagPreload flags={ALL.map((k) => FL[k])} /><Atlas cam={cam} fills={fills} faces={faces} dark={dark} /></>;
};
const used = (n: number) => Array.from({length: n}, (_, i) => i);
export const T21a: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1700, y: 900, z: 0.62}} big={{BRA: 'scared', ARG: 'panic'}} />
		<div style={{position: 'absolute', right: 30, top: 150}}><Wheel ang={-15} used={[]} hit={null} hitP={0} size={760} title="RULETA" /></div>
		<div style={{position: 'absolute', left: 50, top: 40}}><Txt size={150}>¿CUÁL</Txt><Txt size={150} color="#FFD23F">SOBREVIVE?</Txt></div>
	</AbsoluteFill>
);
export const T21b: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1880, y: 860, z: 0.52}} grey={(k) => !['BRA', 'ARG', 'ESP', 'DEU', 'URY', 'ITA'].includes(k)} big={{BRA: 'scared', ARG: 'scared', ESP: 'panic', DEU: 'worried', URY: 'worried', ITA: 'scared'}} dark={0.2} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center', gap: 40, alignItems: 'center'}}><Txt size={180}>211</Txt><Txt size={150} color="#FFD23F">→</Txt><Txt size={180} color="#E63946">1</Txt></div>
	</AbsoluteFill>
);
export const T21c: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1700, y: 860, z: 0.7}} grey={(k) => ['FRA', 'USA', 'PRT', 'JPN', 'SWE', 'RUS', 'NOR', 'ECU', 'VEN'].includes(k)} big={{ESP: 'panic', BRA: 'scared'}} />
		<div style={{position: 'absolute', left: 50, bottom: 60}}><Txt size={120}>TU SELECCIÓN</Txt><Txt size={150} color="#E63946">DESAPARECE</Txt></div>
		<div style={{position: 'absolute', right: 40, top: 40}}><Wheel ang={40} used={[0, 1, 2]} hit={null} hitP={0} size={560} title="RONDA 4" /></div>
	</AbsoluteFill>
);
export const T21d: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1380, y: 1150, z: 1.15}} grey={(k) => !['ARG', 'BRA', 'URY'].includes(k)} big={{ARG: 'panic', BRA: 'scared', URY: 'worried'}} dark={0.2} />
		<div style={{position: 'absolute', right: 60, top: 60, textAlign: 'right'}}><Txt size={130}>¿QUIÉN</Txt><Txt size={170} color="#FFD23F">SE SALVA?</Txt></div>
	</AbsoluteFill>
);
export const T21e: React.FC = () => (
	<AbsoluteFill><Fonts />
		<Map cam={{x: 1800, y: 520, z: 2.2}} big={{ESP: 'panic'}} />
		<div style={{position: 'absolute', left: 30, top: 200}}><Wheel ang={-75} used={[]} hit={null} hitP={0} size={620} title="¿TU SELECCIÓN?" /></div>
		<div style={{position: 'absolute', right: 50, bottom: 60, textAlign: 'right'}}><Txt size={120}>¿SOBREVIVE</Txt><Txt size={150} color="#E63946">ESPAÑA?</Txt></div>
	</AbsoluteFill>
);
