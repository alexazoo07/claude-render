import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WORLD, WCam} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FaceSpec, Fill, INK} from '../v12/Atlas';
import {Atlas21} from '../v21/Atlas21';
import {fitBox, Star} from '../v22/Video22';
import {FIRST, FL, Mood} from './data23';
import {MiniFace, colAt} from './Video23';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.05}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.05}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const SKY = '#6CB4EE', GOLD = '#FFD23F';
const M: React.FC<{cam: WCam; mood: Mood; color?: boolean; size?: number}> = ({cam, mood, color, size = 420}) => {
	const fills: Record<string, Fill> = {ARG: {flag: FL.ARG, lift: 1}};
	if (color) for (const k in FIRST) if (WORLD[k] && k !== 'ARG') fills[k] = {color: colAt(k, 2026) ?? undefined};
	const faces: Record<string, FaceSpec> = {ARG: {mood: mood as any, max: size, size: 3}};
	return <Atlas21 cam={cam} fills={fills} faces={faces} />;
};
const argCam = (cx: number, cy: number, h: number) => fitBox(['ARG'], cx, cy, h * 0.7, h, 200, 4);
export const T23a: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={argCam(480, 560, 1000)} mood="love" />
		<div style={{position: 'absolute', right: 60, top: 150, textAlign: 'right'}}><Txt size={110}>LA EVOLUCIÓN</Txt><Txt size={110}>DE</Txt><Txt size={170} color={SKY}>ARGENTINA</Txt><Txt size={100} color={GOLD} style={{marginTop: 20}}>1902 → 2026</Txt></div>
	</AbsoluteFill>
);
export const T23b: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={argCam(1450, 560, 1000)} mood="cool" />
		<div style={{position: 'absolute', left: 60, top: 80, display: 'flex', gap: 10}}>{[0, 1, 2].map((i) => <Star key={i} s={260} />)}</div>
		<div style={{position: 'absolute', left: 70, top: 380, display: 'flex', gap: 60}}>{['1978', '1986', '2022'].map((y) => <Txt key={y} size={110}>{y}</Txt>)}</div>
		<div style={{position: 'absolute', left: 60, bottom: 90}}><Txt size={120} color={SKY}>3 ESTRELLAS</Txt></div>
	</AbsoluteFill>
);
export const T23c: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={argCam(1500, 560, 1000)} mood="shock" />
		<div style={{position: 'absolute', left: 60, top: 80}}><Txt size={120}>DE PERDER</Txt><Txt size={200} color="#E63946">6-1</Txt><Txt size={120}>A CAMPEONA</Txt><Txt size={120} color={GOLD}>DEL MUNDO</Txt></div>
	</AbsoluteFill>
);
export const T23d: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={argCam(960, 600, 900)} mood="worried" size={300} />
		<div style={{position: 'absolute', left: 80, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center'}}><MiniFace mood="panic" size={380} /><Txt size={130} style={{marginTop: 10}}>1958</Txt></div>
		<div style={{position: 'absolute', right: 80, top: 260, display: 'flex', flexDirection: 'column', alignItems: 'center'}}><MiniFace mood="love" size={380} /><Txt size={130} color={GOLD} style={{marginTop: 10}}>2022</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}><Txt size={120}>¿CÓMO CAMBIÓ TANTO?</Txt></div>
	</AbsoluteFill>
);
export const T23e: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={{x: 1750, y: 930, z: 0.56}} mood="smug" size={260} color />
		<div style={{position: 'absolute', right: 50, top: 60, textAlign: 'right'}}><Txt size={170} color={GOLD}>1.079</Txt><Txt size={110}>PARTIDOS</Txt></div>
		<div style={{position: 'absolute', left: 50, top: 60}}><Txt size={100} color={SKY}>ARGENTINA</Txt><Txt size={80}>VS EL MUNDO</Txt></div>
	</AbsoluteFill>
);
