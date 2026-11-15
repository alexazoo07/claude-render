import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Video 13 thumbnails: world of flags with faces, darkened, big country characters.
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
	ALLK.forEach((k, i) => { if (!WORLD[k] || k === "ESP") return; fills[k] = {flag: FLAG[k]}; faces[k] = {mood: MOODS[(i * 7) % MOODS.length], size: 0.85, max: 110, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]}; });
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

const RoundFace: React.FC<{flag: string; x: number; y: number; s: number; mood: FaceMood; rot?: number}> = ({flag, x, y, s, mood, rot = 0}) => (
	<div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `rotate(${rot}deg)`}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: `${s * 0.035}px solid #fff`, boxShadow: `0 0 0 ${s * 0.025}px ${INK}, 0 ${s * 0.04}px 0 ${s * 0.03}px rgba(0,0,0,0.35)`}}>
			<img src={staticFile(`flags/${flag}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</div>
		<svg width={s * 0.8} height={s * 0.8} viewBox="0 0 200 200" style={{position: 'absolute', left: s * 0.1, top: s * 0.12, overflow: 'visible'}}><Face12 mood={mood} /></svg>
	</div>
);
const BlobQ: React.FC<{x: number; y: number; s: number; rot?: number; hot?: boolean}> = ({x, y, s, rot = 0, hot}) => (
	<div style={{position: 'absolute', left: x - s / 2, top: y - s * 0.42, transform: `rotate(${rot}deg)`}}>
		<svg width={s} height={s * 0.84} viewBox="0 0 360 300" style={{overflow: 'visible'}}>
			<path d="M60 150 C40 90 90 40 150 50 C190 20 260 40 280 90 C330 110 330 190 290 220 C270 270 190 280 150 255 C100 270 50 240 60 200 C30 190 30 165 60 150Z" fill={hot ? '#3B2A55' : '#2B2F3D'} stroke={hot ? '#B385F0' : '#fff'} strokeWidth={10} />
			<g transform="translate(95 70) scale(0.85)"><Face12 mood="smug" noBlush look={[-0.5, 0]} /></g>
			<text x={285} y={85} fontFamily="Lilita" fontSize={110} fill="#FFD23F" stroke={INK} strokeWidth={7} paintOrder="stroke" transform="rotate(12 285 85)">?</text>
		</svg>
	</div>
);
// 1: PAÍSES QUE / LE TEMEN A ESPAÑA
export const T27a: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={960} y={560} w={720} mood="angry" rot={-2} />
		<Spark x={520} y={350} s={64} /><Spark x={1420} y={330} s={52} />
		<Top size={150}>PAÍSES QUE</Top>
		<Bottom size={160}>LE TEMEN A ESPAÑA</Bottom>
	</Base>
);
// 2: question with scared rivals
export const T27b: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={600} y={580} w={680} mood="angry" rot={-4} />
		<RoundFace flag="pt" x={1240} y={480} s={300} mood="panic" rot={8} />
		<RoundFace flag="de" x={1560} y={560} s={280} mood="scared" rot={-6} />
		<RoundFace flag="it" x={1330} y={760} s={250} mood="panic" rot={-4} />
		<Top size={124}>¿QUIÉN LE TIENE MIEDO</Top>
		<Bottom size={170}>A ESPAÑA?</Bottom>
	</Base>
);
// 3: Brazil vs Norway
export const T27c: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 1700, y: 760, z: 0.8}} />
		<CountryFace k="ESP" flag="es" x={520} y={580} w={660} mood="scared" rot={-4} />
		<RoundFace flag="gb-eng" x={1450} y={560} s={500} mood="smug" rot={5} />
		<VSb />
		<Top size={136}>LA PESADILLA DE</Top>
		<Bottom size={170}>ESPAÑA</Bottom>
	</Base>
);
// 4: 52 países
export const T27d: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={540} y={590} w={660} mood="smug" rot={-3} />
		<div style={{position: 'absolute', left: 1140, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
			<Txt size={260} color="#E8394A">50</Txt>
			<Txt size={84}>PAÍSES</Txt>
		</div>
		<Top size={124}>NUNCA LE HAN GANADO</Top>
		<Bottom size={170}>A ESPAÑA</Bottom>
	</Base>
);
// 5: the 5 who don't fear Brazil
export const T27e: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={470} y={590} w={600} mood="scared" rot={-3} />
		<BlobQ x={1000} y={430} s={300} rot={-6} />
		<BlobQ x={1330} y={400} s={300} rot={5} hot />
		<BlobQ x={1640} y={450} s={280} rot={-4} />
		<BlobQ x={1150} y={700} s={280} rot={6} />
		<BlobQ x={1500} y={710} s={290} rot={-5} />
		<Top size={124}>7 PAÍSES QUE NO LE TEMEN</Top>
		<Bottom size={170}>A ESPAÑA</Bottom>
	</Base>
);
