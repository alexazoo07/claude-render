import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Video 19 thumbnails: world of flags with faces, darkened, big country characters.
const FLAG = iso as Record<string, string>;
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.075}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const HB = (() => { const b = WORLD.ARG.b; return {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]}; })();
const BigArg: React.FC<{h: number; x: number; y: number; mood: FaceMood; look?: [number, number]; rot?: number}> = ({h, x, y, mood, look = [0, 0], rot = 0}) => {
	const S = h / (HB.y1 - HB.y0), W = (HB.x1 - HB.x0) * S;
	return (
		<div style={{position: 'absolute', left: x - W / 2, top: y, width: W, height: h, transform: `rotate(${rot}deg) scaleX(1.18)`}}>
			<svg width={W + 80} height={h + 80} style={{position: 'absolute', left: -40, top: -40, overflow: 'visible'}}>
				<defs><clipPath id="tA"><path d={WORLD.ARG.d} /></clipPath></defs>
				<g transform={`translate(40 40) scale(${S}) translate(${-HB.x0} ${-HB.y0})`}>
					<path d={WORLD.ARG.d} fill="#06142A" opacity={0.4} transform={`translate(${6 / S} ${12 / S})`} />
					<path d={WORLD.ARG.d} fill="none" stroke={INK} strokeWidth={30 / S} strokeLinejoin="round" />
					<path d={WORLD.ARG.d} fill="none" stroke="#fff" strokeWidth={20 / S} strokeLinejoin="round" />
					<g clipPath="url(#tA)">
						<image href={staticFile('flags/ar.svg')} x={HB.x0 - 120} y={HB.y0 + 10} width={(HB.x1 - HB.x0) + 240} height={(HB.y1 - HB.y0) * 0.75} preserveAspectRatio="none" />
						<rect x={HB.x0 - 10} y={HB.y0 + (HB.y1 - HB.y0) * 0.75} width={HB.x1 - HB.x0 + 20} height={(HB.y1 - HB.y0) * 0.3} fill="#6CB4EE" />
						<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" style={{mixBlendMode: 'multiply'}} />
					</g>
					<path d={WORLD.ARG.d} fill="none" stroke={INK} strokeWidth={5 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={W * 1.6} height={W * 1.6} viewBox="0 0 200 200" style={{position: 'absolute', left: W * 0.52 - W * 0.8, top: h * 0.27 - W * 0.75, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} />
			</svg>
		</div>
	);
};
const Spark: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s} viewBox="-20 -20 40 40" style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}><path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" fill="#FFE066" stroke={INK} strokeWidth={2.5} /></svg>
);
const CountryFace: React.FC<{k: string; flag: string; x: number; y: number; w: number; mood: FaceMood; rot?: number}> = ({k, flag, x, y, w, mood, rot = 0}) => {
	const b = WORLD[k].b; const bw = b[1][0] - b[0][0], bh = b[1][1] - b[0][1];
	const S = w / bw, h = bh * S;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<svg width={w + 60} height={h + 60} style={{position: 'absolute', left: -30, top: -30, overflow: 'visible'}}>
				<defs><clipPath id={`tf${k}`}><path d={WORLD[k].d} /></clipPath></defs>
				<g transform={`translate(30 30) scale(${S}) translate(${-b[0][0]} ${-b[0][1]})`}>
					<path d={WORLD[k].d} fill="#06142A" opacity={0.4} transform={`translate(${5 / S} ${10 / S})`} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={26 / S} strokeLinejoin="round" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={16 / S} strokeLinejoin="round" />
					<g clipPath={`url(#tf${k})`}><image href={staticFile(`flags/${flag}.svg`)} x={b[0][0] - 2} y={b[0][1] - 2} width={bw + 4} height={bh + 4} preserveAspectRatio="none" /></g>
					<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" clipPath={`url(#tf${k})`} style={{mixBlendMode: 'multiply'}} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={4 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={w * 0.8} height={w * 0.8} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.1, top: h / 2 - w * 0.4, overflow: 'visible'}}><Face12 mood={mood} /></svg>
		</div>
	);
};
const ALLK = Object.keys(FLAG).filter((k) => k !== 'FLK');
const MOODS: FaceMood[] = ['scared', 'worried', 'shock', 'neutral', 'panic', 'sad'];
const WorldFlags: React.FC<{cam: {x: number; y: number; z: number}}> = ({cam}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	ALLK.forEach((k, i) => { if (!WORLD[k] || k === 'ESP') return; fills[k] = {flag: FLAG[k]}; faces[k] = {mood: MOODS[(i * 7) % MOODS.length], size: 0.85, max: 110, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]}; });
	return (
		<>
			<Atlas cam={cam} fills={fills} faces={faces} dark={0} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 78% 74% at 50% 50%, rgba(4,10,26,0) 20%, rgba(4,10,26,0.12) 38%, rgba(4,10,26,0.3) 56%, rgba(4,10,26,0.52) 74%, rgba(4,10,26,0.72) 88%, rgba(4,10,26,0.85) 100%)'}} />
		</>
	);
};
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#163E6E', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={Object.values(FLAG)} />
		{children}
	</AbsoluteFill>
);
const RED2 = '#F0141F';
const Top: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 150}) => <div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={size} color="#FFFFFF">{children}</Txt></div>;
const Bottom: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 170, color = RED2}) => <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}><Txt size={size} color={color}>{children}</Txt></div>;
const VSb: React.FC = () => <div style={{position: 'absolute', left: 960 - 115, top: 470, width: 230, height: 230, borderRadius: '50%', background: '#FFD23F', border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={115} color="#E8394A">VS</Txt></div>;
const CAM = {x: 1900, y: 720, z: 0.85};

const Heart: React.FC<{x: number; y: number; s: number; col?: string; rot?: number; broken?: boolean}> = ({x, y, s, col = '#FF4FA0', rot = 0, broken}) => (
	<svg width={s} height={s} viewBox="-16 -16 32 32" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
		<path d="M0 12 C-18 -2 -10 -17 0 -7 C10 -17 18 -2 0 12Z" fill={col} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
		{broken && <path d="M0 -7 L-3 -1 L2 3 L-2 8" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />}
		<path d="M-9 -6 C-10 -2 -8 1 -6 2" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
	</svg>
);
// 1: QUIÉN AMA Y ODIA / A ESPAÑA
export const T19a: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<Heart x={420} y={560} s={330} rot={-12} />
		<Heart x={1500} y={560} s={330} col="#E63946" rot={12} broken />
		<CountryFace k="ESP" flag="es" x={960} y={560} w={720} mood="shock" rot={-2} />
		<Top size={140}>¿QUIÉN AMA Y ODIA</Top>
		<Bottom size={160}>A ESPAÑA?</Bottom>
	</Base>
);
// 2: the dating app
export const T19b: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={560} y={570} w={720} mood="love" rot={-4} />
		<div style={{position: 'absolute', left: 1090, top: 210, width: 470, height: 660, transform: 'rotate(6deg)', borderRadius: 50, background: '#111318', border: `8px solid ${INK}`, boxShadow: '0 0 0 6px #fff', padding: 16, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 36, background: '#FFF7EE', overflow: 'hidden'}}>
				<img src={staticFile('flags/it.svg')} style={{width: '100%', height: 330, objectFit: 'cover', borderBottom: `5px solid ${INK}`}} />
				<div style={{position: 'absolute', left: 30, top: 70, transform: 'rotate(14deg)', padding: '4px 20px', borderRadius: 14, border: '9px solid #E63946', background: 'rgba(255,255,255,0.85)'}}><Txt size={90} color="#E63946" style={{WebkitTextStroke: '0px', textShadow: 'none'}}>NOPE</Txt></div>
				<div style={{padding: '16px 22px'}}><Txt size={64} color={INK} style={{WebkitTextStroke: '0px', textShadow: 'none'}}>ITALIA</Txt></div>
			</div>
		</div>
		<Top size={130}>SI ESPAÑA TUVIERA</Top>
		<Bottom size={140} color="#FF4FA0">UNA APP DE CITAS</Bottom>
	</Base>
);
// 3: the enemy
export const T19c: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 1950, y: 600, z: 0.9}} />
		<CountryFace k="ESP" flag="es" x={520} y={590} w={680} mood="angry" rot={-4} />
		<CountryFace k="ITA" flag="it" x={1430} y={590} w={520} mood="angry" rot={4} />
		<VSb />
		<Top size={120}>EL PAÍS QUE MÁS ODIA A</Top>
		<Bottom size={170}>ESPAÑA</Bottom>
	</Base>
);
// 4: who loves Spain the most
export const T19d: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={600} y={580} w={700} mood="love" rot={-4} />
		<Heart x={1090} y={520} s={170} rot={-10} /><Heart x={1180} y={760} s={110} rot={12} />
		<div style={{position: 'absolute', left: 1220, top: 270, width: 520, height: 520, borderRadius: '50%', background: '#16181F', border: '10px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(6deg)'}}>
			<Txt size={420} color="#FF4FA0">?</Txt>
		</div>
		<Top size={124}>EL PAÍS QUE MÁS AMA A</Top>
		<Bottom size={170}>ESPAÑA</Bottom>
	</Base>
);
// 5: thermometer
export const T19e: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={960} y={520} w={640} mood="worried" rot={-2} />
		<div style={{position: 'absolute', left: 260, right: 260, top: 760, height: 70, borderRadius: 35, border: `8px solid ${INK}`, background: 'linear-gradient(90deg, #FF4FA0, #F2B33D, #FF8A3D, #E63946)'}} />
		<Heart x={220} y={795} s={170} rot={-10} /><Heart x={1700} y={795} s={170} col="#E63946" rot={10} broken />
		<Top size={150}>AMOR U ODIO</Top>
		<Bottom size={110} color="#FFD23F">¿QUÉ SIENTEN POR ESPAÑA?</Bottom>
	</Base>
);
