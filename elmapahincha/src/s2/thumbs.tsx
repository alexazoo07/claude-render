// Miniaturas de shorts al estilo El Mapa Animado (vertical 1080x1920):
// título enorme arriba en 2 líneas, mapa de fondo con mar azul, bola protagonista gigante muy expresiva
// (lágrimas a chorro, sudor), bolas secundarias reaccionando y algún objeto (lápida, calendario...).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Atlas21, INK, Fill} from '../v21/Atlas21';
import {ALL, FL} from '../v21/data21';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {TT} from '../v22/Thumbs22b';
import {Ball, Cam} from './VShort3';
import {FaceMood} from '../v21/Atlas21';

export const TBase: React.FC<{cam: Cam; grey?: string[]; dim?: string[]; children: React.ReactNode}> = ({cam, grey = [], dim = [], children}) => {
	const fills: Record<string, Fill> = {};
	for (const c of ALL) if (WORLD[c]) fills[c] = grey.includes(c) ? {color: '#5A5F69'} : {flag: FL[c], lift: dim.includes(c) ? 0 : 0};
	return (
		<AbsoluteFill style={{background: '#245E9E', overflow: 'hidden'}}>
			<Fonts />
			<FlagPreload flags={ALL.map((c) => FL[c]).filter(Boolean)} />
			<Atlas21 cam={cam} fills={fills} faces={{}} W={1080} H={1920} dark={0.38} cullPad={2500} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,30,70,0.55) 0%, rgba(10,30,70,0) 28%, rgba(10,30,70,0) 75%, rgba(10,30,70,0.5) 100%)'}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)'}} />
			{children}
		</AbsoluteFill>
	);
};

// texto gigante: mismo estilo que las miniaturas de los vídeos largos (TT, contorno fino sw 0.1, sombra dura)
export const Big: React.FC<{text: string; size: number; top: number; c?: string; rot?: number}> = ({text, size, top, c = '#fff', rot = -2}) => (
	<TT parts={[[text, c]]} size={size} sw={0.1} rot={rot} style={{top}} />
);

// bola gigante con lágrimas a chorro / sudor
export const Hero: React.FC<{k: string; d: number; x: number; y: number; mood: FaceMood; tears?: boolean; sweat?: boolean; rot?: number; ghost?: boolean; look?: [number, number]}> = ({k, d, x, y, mood, tears, sweat, rot = 0, ghost, look}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, transform: `rotate(${rot}deg)`}}>
		<Ball k={k} d={d} mood={mood} ghost={ghost} name={false} f={20} look={look} />
		{tears && <svg width={d * 1.2} height={d * 0.75} viewBox="0 0 160 100" style={{position: 'absolute', left: -d * 0.1, top: d * 0.42, overflow: 'visible'}}>
			{[[-1, 58], [1, 102]].map(([s, x0]) => (
				<g key={s}>
					<path d={`M${x0} 4 Q${x0 + s * 26} 6 ${x0 + s * 38} 30 Q${x0 + s * 44} 46 ${x0 + s * 40} 62`} fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
					<path d={`M${x0} 4 Q${x0 + s * 26} 6 ${x0 + s * 38} 30 Q${x0 + s * 44} 46 ${x0 + s * 40} 62`} fill="none" stroke="#7FD3FF" strokeWidth={7} strokeLinecap="round" />
					{[0, 1, 2].map((j) => <ellipse key={j} cx={x0 + s * (40 + j * 6)} cy={74 + j * 13} rx={4.5} ry={6.5} fill="#7FD3FF" stroke={INK} strokeWidth={2.5} />)}
				</g>
			))}
		</svg>}
		{sweat && <svg width={d * 0.22} height={d * 0.3} viewBox="0 0 60 80" style={{position: 'absolute', right: -d * 0.04, top: d * 0.02}}><path d="M30 4 C44 30 54 44 54 56 A24 24 0 0 1 6 56 C6 44 16 30 30 4 Z" fill="#7FD3FF" stroke={INK} strokeWidth={6} /><path d="M20 50 Q20 40 26 34" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" /></svg>}
	</div>
);

// bola secundaria (pequeña) con un posible bocadillo
export const Side: React.FC<{k: string; d: number; x: number; y: number; mood: FaceMood; say?: string; rot?: number; look?: [number, number]}> = ({k, d, x, y, mood, say, rot = 0, look}) => (
	<div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, transform: `rotate(${rot}deg)`}}>
		<Ball k={k} d={d} mood={mood} name={false} f={40} look={look} />
		{say && <div style={{position: 'absolute', left: d * 0.55, top: -d * 0.45, transform: 'rotate(4deg)'}}><Tag text={say} size={d * 0.3} /></div>}
	</div>
);
// rótulo amarillo tipo "¡ISLA!"
export const Tag: React.FC<{text: string; size?: number; bg?: string; c?: string; rot?: number}> = ({text, size = 60, bg = '#FFD23F', c = INK, rot = -4}) => (
	<div style={{display: 'inline-block', transform: `rotate(${rot}deg)`, background: bg, border: `${size * 0.1}px solid ${INK}`, borderRadius: size * 0.25, padding: `${size * 0.02}px ${size * 0.25}px`, boxShadow: `0 ${size * 0.12}px 0 ${INK}`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1.15}}>{text}</div>
);
// lápida R.I.P.
export const Tomb: React.FC<{s: number; name: string; years: string}> = ({s, name, years}) => (
	<svg width={s} height={s * 1.15} viewBox="-6 -6 112 124" style={{overflow: 'visible', filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.35))'}}>
		<path d="M8 112 V44 Q8 4 50 4 Q92 4 92 44 V112 Z" fill="#B8BEC8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<path d="M20 44 Q22 18 46 14" stroke="#E2E6EC" strokeWidth={6} fill="none" strokeLinecap="round" />
		<path d="M70 70 l8 8 M26 92 l6 -4" stroke="#8E95A1" strokeWidth={3} strokeLinecap="round" />
		<text x={50} y={46} textAnchor="middle" fontFamily={LILITA} fontSize={17} fill={INK}>R.I.P.</text>
		<text x={50} y={68} textAnchor="middle" fontFamily={LILITA} fontSize={name.length > 8 ? 11 : 14} fill={INK}>{name}</text>
		<text x={50} y={86} textAnchor="middle" fontFamily={LILITA} fontSize={12} fill={INK}>{years}</text>
		<path d="M0 112 H100" stroke={INK} strokeWidth={6} strokeLinecap="round" />
		<path d="M4 112 q8 -12 14 0 q6 -10 12 0 M70 112 q6 -12 12 0 q6 -9 12 0" stroke="#2F8F4E" strokeWidth={5} fill="none" strokeLinecap="round" />
	</svg>
);
