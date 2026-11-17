// "¿Y si España jugara la Copa América?" · formato: Sudamérica con caras + España gigante encima
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts} from '../fonts';
import {Map, Sticker} from '../v21/Thumbs21b';
import {FaceMood, Face12, INK} from '../v21/Atlas21';
import F3 from '../iso3flag.json';
const FLG = (k: string) => (F3 as Record<string, string>)[k];
const Ball: React.FC<{k: string; d: number; x: number; y: number; mood: FaceMood; look?: [number, number]}> = ({k, d, x, y, mood, look}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `translate(${d * 0.02}px, ${d * 0.06}px)`, background: 'rgba(0,0,0,0.45)'}} />
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${d * 0.045}px solid #fff`, boxShadow: `0 0 0 ${d * 0.025}px ${INK}`}}>
			<img src={staticFile(`flags/${FLG(k)}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)'}} />
		</div>
		<svg width={d * 0.72} height={d * 0.72} viewBox="0 0 200 200" style={{position: 'absolute', left: d * 0.14, top: d * 0.15}}><Face12 mood={mood} look={look} /></svg>
	</div>
);
import {TT, Vig, Cup, Sparkles} from '../v22/Thumbs22b';

const YEL = '#FFD23F';
type P = {mood?: FaceMood; around?: FaceMood; w?: number; x?: number; y?: number; rot?: number; glow?: string; cup?: boolean; z?: number; cx?: number};
const EspAm: React.FC<P> = ({mood = 'smug', around = 'shock', w = 720, x = 960, y = 560, rot = -6, glow, cup, z = 1.9, cx = 1290}) => {
	const cam = {x: cx, y: 1215, z};
	const S = <Sticker k="ESP" w={w} x={x} y={y} mood={mood} rot={rot} look={[0.15, 0.25]} face={0.7} />;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<Map cam={cam} mood={around} dark={0.18} big={['BRA', 'ARG', 'PER', 'COL', 'BOL', 'VEN', 'CHL', 'PRY', 'URY', 'ECU']} />
			<Vig o={0.45} />
			<Ball k="MEX" d={210} x={230} y={360} mood={around} look={[0.6, 0.2]} /><Ball k="USA" d={190} x={330} y={700} mood={around} look={[0.6, 0]} /><Ball k="URY" d={170} x={160} y={880} mood={around} look={[0.6, -0.3]} />
			{!cup && <><Ball k="ARG" d={220} x={1690} y={420} mood={around} look={[-0.6, 0.2]} /><Ball k="COL" d={180} x={1590} y={740} mood={around} look={[-0.6, 0]} /><Ball k="CAN" d={160} x={1800} y={860} mood={around} look={[-0.6, -0.3]} /></>}
			{cup && <Cup x={1600} y={640} h={380} rot={10} />}
			{cup && <Sparkles seed={4} n={14} box={[1350, 380, 500, 520]} />}
			<div style={{position: 'absolute', inset: 0, filter: glow ? `drop-shadow(0 0 12px ${glow}) drop-shadow(0 0 30px ${glow})` : undefined}}>{S}</div>
			<TT parts={[['¿Y SI ESPAÑA JUGARA']]} size={108} sw={0.1} style={{top: 18}} />
			<TT parts={[['LA COPA AMÉRICA?', YEL]]} size={118} sw={0.1} style={{top: 905}} />
		</AbsoluteFill>
	);
};
export const T28f: React.FC = () => <EspAm />;
export const T28g: React.FC = () => <EspAm mood="cool" around="scared" w={780} />;
export const T28h: React.FC = () => <EspAm mood="angry" around="panic" glow="#FF3B3B" w={760} />;
export const T28i: React.FC = () => <EspAm mood="happy" around="shock" x={860} w={680} cup cx={1330} />;
export const T28j: React.FC = () => <EspAm mood="smug" around="worried" glow="#FFD23F" w={800} rot={4} />;
