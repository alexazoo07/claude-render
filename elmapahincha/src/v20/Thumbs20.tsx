import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Video 20 thumbnails: world of flags with faces, darkened, big country characters.
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
	ALLK.forEach((k, i) => { if (!WORLD[k] || k === 'VEN') return; fills[k] = {flag: FLAG[k]}; faces[k] = {mood: MOODS[(i * 7) % MOODS.length], size: 0.85, max: 110, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]}; });
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
// 1: PAÍSES QUE NUNCA / HAN IDO A UN MUNDIAL
export const T20a: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="VEN" flag="ve" x={960} y={560} w={600} mood="sad" rot={-2} />
		<div style={{position: 'absolute', left: 1330, top: 300, transform: 'rotate(12deg)'}}><Trophy size={300} /></div>
		<Top size={140}>PAÍSES QUE NUNCA</Top>
		<Bottom size={130}>HAN IDO A UN MUNDIAL</Bottom>
	</Base>
);
// 2: the waiting room
export const T20b: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="VEN" flag="ve" x={600} y={580} w={600} mood="worried" rot={-4} />
		<div style={{position: 'absolute', left: 1080, top: 300, width: 520, padding: '24px 20px', transform: 'rotate(6deg)', background: '#FFF7E0', border: `10px solid ${INK}`, borderRadius: 18, textAlign: 'center', boxShadow: '0 16px 0 rgba(0,0,0,0.4)'}}>
			<div style={{fontFamily: LILITA, fontSize: 50, color: '#7A6E57'}}>SU TURNO</div>
			<Txt size={130} color={INK} style={{WebkitTextStroke: '0px', textShadow: 'none'}}>VEN</Txt>
			<div style={{fontFamily: LILITA, fontSize: 56, color: '#E63946'}}>ESPERANDO...</div>
		</div>
		<Top size={140}>LA SALA DE ESPERA</Top>
		<Bottom size={150} color="#FFD23F">DEL MUNDIAL</Bottom>
	</Base>
);
// 3: Kosovo, one match away
export const T20c: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2000, y: 640, z: 1.1}} />
		<CountryFace k="KOS" flag="xk" x={720} y={580} w={560} mood="sad" rot={-4} />
		<div style={{position: 'absolute', left: 1150, top: 300, transform: 'rotate(8deg)'}}><Trophy size={380} /></div>
		<Top size={140}>A UN PARTIDO</Top>
		<Bottom size={150}>DEL MUNDIAL</Bottom>
	</Base>
);
// 4: 128 países
export const T20d: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="VEN" flag="ve" x={480} y={560} w={500} mood="sad" rot={-3} />
		<div style={{position: 'absolute', left: 900, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Txt size={360} color="#E63946">128</Txt>
			<Txt size={100}>PAÍSES</Txt>
		</div>
		<Top size={124}>NUNCA HAN JUGADO</Top>
		<Bottom size={150}>UN MUNDIAL</Bottom>
	</Base>
);
// 5: Burkina Faso, the closest
export const T20e: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 1900, y: 1000, z: 0.9}} />
		<CountryFace k="BFA" flag="bf" x={640} y={580} w={600} mood="shock" rot={-3} />
		<div style={{position: 'absolute', left: 1120, top: 330, transform: 'rotate(6deg)', padding: '20px 40px', borderRadius: 30, background: '#16181F', border: '10px solid #fff'}}><Txt size={220} color="#FFD23F">3-3</Txt></div>
		<Top size={124}>EL PAÍS QUE MÁS CERCA</Top>
		<Bottom size={124}>ESTUVO DEL MUNDIAL</Bottom>
	</Base>
);
