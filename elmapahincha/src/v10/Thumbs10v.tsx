import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Video 10 VS thumbnails: world of flags with faces, darkened, big country characters.
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
const ALLK = Object.keys(FLAG).filter((k) => k !== 'ARG' && k !== 'FLK');
const MOODS: FaceMood[] = ['happy', 'shock', 'scared', 'worried', 'neutral', 'panic'];
const WorldFlags: React.FC<{cam: {x: number; y: number; z: number}; dark?: number; edge?: boolean}> = ({cam, dark = 0.34, edge}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	ALLK.forEach((k, i) => { if (!WORLD[k]) return; fills[k] = {flag: FLAG[k]}; faces[k] = {mood: MOODS[(i * 7) % MOODS.length], size: 0.85, max: 110, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]}; });
	fills.ARG = {color: '#9CCFF2'};
	return (
		<>
			<Atlas cam={cam} fills={fills} faces={faces} dark={dark} />
			<AbsoluteFill style={{background: edge ? 'radial-gradient(ellipse 78% 74% at 50% 50%, rgba(4,10,26,0) 20%, rgba(4,10,26,0.12) 38%, rgba(4,10,26,0.3) 56%, rgba(4,10,26,0.52) 74%, rgba(4,10,26,0.72) 88%, rgba(4,10,26,0.85) 100%)' : 'radial-gradient(ellipse at 50% 50%, rgba(5,12,30,0) 30%, rgba(5,12,30,0.45) 100%)'}} />
		</>
	);
};
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#163E6E', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={['ar', ...Object.values(FLAG)]} />
		{children}
	</AbsoluteFill>
);
const CAM = {x: 1820, y: 860, z: 0.72};
const Top: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 150}) => <div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center'}}><Txt size={size} color="#FFFFFF">{children}</Txt></div>;
const Bottom: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 170, color = '#FF4D5E'}) => <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}><Txt size={size} color={color}>{children}</Txt></div>;


const VSb: React.FC = () => <div style={{position: 'absolute', left: 960 - 115, top: 470, width: 230, height: 230, borderRadius: '50%', background: '#FFD23F', border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={115} color="#E8394A">VS</Txt></div>;

// 1: Brasil 70 vs Argentina 22
export const T10v1: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2100, y: 760, z: 0.8}} dark={0.42} />
		<CountryFace k="BRA" flag="br" x={560} y={580} w={700} mood="angry" rot={-4} />
		<BigArg h={760} x={1400} y={190} mood="angry" look={[-0.5, 0.1]} rot={4} />
		<VSb />
		<Top size={140}>¿QUIÉN GANARÍA?</Top>
		<Bottom size={124}>¿BRASIL 70 O ARGENTINA 22?</Bottom>
	</Base>
);
// 2: España 2010 vs Brasil 1970
export const T10v2: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2300, y: 900, z: 0.8}} dark={0.42} />
		<CountryFace k="ESP" flag="es" x={520} y={580} w={760} mood="cool" rot={-4} />
		<CountryFace k="BRA" flag="br" x={1430} y={580} w={680} mood="angry" rot={4} />
		<VSb />
		<Top size={130}>¿Y SI SE ENFRENTARAN?</Top>
		<Bottom size={128}>¿ESPAÑA 2010 O BRASIL 70?</Bottom>
	</Base>
);
// 3: Holanda 74 vs Alemania 2014
export const T10v3: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 1650, y: 1000, z: 0.8}} dark={0.42} />
		<CountryFace k="NLD" flag="nl" x={520} y={570} w={620} mood="angry" rot={-4} />
		<CountryFace k="DEU" flag="de" x={1420} y={580} w={560} mood="smug" rot={4} />
		<VSb />
		<Top size={130}>EN SU MEJOR MOMENTO</Top>
		<Bottom size={124}>¿HOLANDA 74 O ALEMANIA 14?</Bottom>
	</Base>
);
// 4: four legends lined up
export const T10v4: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} dark={0.4} />
		<CountryFace k="BRA" flag="br" x={300} y={570} w={430} mood="angry" rot={-5} />
		<BigArg h={560} x={760} y={290} mood="smug" look={[0.3, 0]} rot={3} />
		<CountryFace k="ESP" flag="es" x={1190} y={560} w={430} mood="cool" rot={-3} />
		<CountryFace k="NLD" flag="nl" x={1640} y={560} w={380} mood="shock" rot={5} />
		<Top size={130}>LAS MEJORES SELECCIONES</Top>
		<Bottom size={150}>¿QUIÉN GANARÍA?</Bottom>
	</Base>
);
// 5: Argentina 22 vs Francia 18 (the Qatar final rematch)
export const T10v5: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 1650, y: 1000, z: 0.8}} dark={0.42} />
		<BigArg h={760} x={520} y={190} mood="angry" look={[0.5, 0.1]} rot={-4} />
		<CountryFace k="FRA" flag="fr" x={1420} y={580} w={640} mood="angry" rot={4} />
		<VSb />
		<Top size={130}>EN SU MEJOR MOMENTO</Top>
		<Bottom size={122}>¿ARGENTINA 22 O FRANCIA 18?</Bottom>
	</Base>
);

// Edge-shadow series: no global darkening, only vignette; stronger red
const RED2 = '#F0141F';
const Duel10: React.FC<{a: React.ReactNode; b: React.ReactNode; top: string; bottom: string; cam: {x: number; y: number; z: number}; bs?: number}> = ({a, b, top, bottom, cam, bs = 124}) => (
	<Base>
		<WorldFlags cam={cam} dark={0} edge />
		{a}{b}
		<VSb />
		<Top size={136}>{top}</Top>
		<Bottom size={bs} color={RED2}>{bottom}</Bottom>
	</Base>
);
export const T10w1: React.FC = () => <Duel10 cam={{x: 2100, y: 760, z: 0.8}} top="¿Y SI SE ENFRENTARAN?" bottom="¿BRASIL 70 O ARGENTINA 22?"
	a={<CountryFace k="BRA" flag="br" x={560} y={580} w={700} mood="angry" rot={-4} />} b={<BigArg h={760} x={1400} y={190} mood="angry" look={[-0.5, 0.1]} rot={4} />} />;
export const T10w2: React.FC = () => <Duel10 cam={{x: 2300, y: 900, z: 0.8}} top="EN SU MEJOR MOMENTO" bottom="¿ESPAÑA 2010 O BRASIL 70?" bs={128}
	a={<CountryFace k="ESP" flag="es" x={520} y={580} w={760} mood="smug" rot={-4} />} b={<CountryFace k="BRA" flag="br" x={1430} y={580} w={680} mood="angry" rot={4} />} />;
export const T10w3: React.FC = () => <Duel10 cam={{x: 1650, y: 1000, z: 0.8}} top="¿QUIÉN GANARÍA?" bottom="¿ARGENTINA 22 O FRANCIA 18?" bs={122}
	a={<BigArg h={760} x={520} y={190} mood="angry" look={[0.5, 0.1]} rot={-4} />} b={<CountryFace k="FRA" flag="fr" x={1420} y={580} w={640} mood="angry" rot={4} />} />;
export const T10w4: React.FC = () => <Duel10 cam={{x: 1650, y: 1000, z: 0.8}} top="¿Y SI SE ENFRENTARAN?" bottom="¿HOLANDA 74 O ALEMANIA 14?"
	a={<CountryFace k="NLD" flag="nl" x={520} y={570} w={620} mood="angry" rot={-4} />} b={<CountryFace k="DEU" flag="de" x={1420} y={580} w={560} mood="cool" rot={4} />} />;
export const T10w5: React.FC = () => <Duel10 cam={{x: 1650, y: 1000, z: 0.8}} top="EN SU MEJOR MOMENTO" bottom="¿HUNGRÍA 54 O ALEMANIA 14?"
	a={<CountryFace k="HUN" flag="hu" x={520} y={580} w={640} mood="angry" rot={-4} />} b={<CountryFace k="DEU" flag="de" x={1420} y={580} w={560} mood="smug" rot={4} />} />;
