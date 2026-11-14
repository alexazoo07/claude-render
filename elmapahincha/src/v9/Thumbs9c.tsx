import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Trophy} from '../common';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Stadium video thumbnails without stadiums: world of flags with faces, darkened, big country characters.
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
const WorldFlags: React.FC<{cam: {x: number; y: number; z: number}; dark?: number}> = ({cam, dark = 0.34}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	ALLK.forEach((k, i) => { if (!WORLD[k]) return; fills[k] = {flag: FLAG[k]}; faces[k] = {mood: MOODS[(i * 7) % MOODS.length], size: 0.85, max: 110, look: [0.3 * Math.sin(i), 0.2 * Math.cos(i)]}; });
	fills.ARG = {color: '#9CCFF2'};
	return (
		<>
			<Atlas cam={cam} fills={fills} faces={faces} dark={dark} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(5,12,30,0) 30%, rgba(5,12,30,0.45) 100%)'}} />
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


// 1: ¿Qué país tiene el mejor estadio? — Spain in the middle
export const T9q1: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2300, y: 900, z: 0.8}} />
		<CountryFace k="ESP" flag="es" x={960} y={560} w={900} mood="smug" rot={-3} />
		<Spark x={520} y={360} s={64} /><Spark x={1420} y={330} s={52} /><Spark x={1460} y={760} s={44} />
		<Top size={140}>¿QUÉ PAÍS TIENE</Top>
		<Bottom size={150}>EL MEJOR ESTADIO?</Bottom>
	</Base>
);
// 2: Los mejores estadios del mundo — Spain with the trophy
export const T9q2: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} />
		<CountryFace k="ESP" flag="es" x={860} y={560} w={820} mood="happy" rot={-4} />
		<div style={{position: 'absolute', left: 1240, top: 330, transform: 'rotate(10deg)'}}><Trophy size={320} /></div>
		<Spark x={1220} y={300} s={70} /><Spark x={420} y={420} s={50} />
		<Top size={140}>LOS MEJORES ESTADIOS</Top>
		<Bottom size={170}>DEL MUNDO</Bottom>
	</Base>
);
// 3: duel Argentina vs Brazil — Bombonera o Maracaná
export const T9q3: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2100, y: 760, z: 0.8}} dark={0.42} />
		<CountryFace k="BRA" flag="br" x={560} y={580} w={700} mood="angry" rot={-4} />
		<BigArg h={760} x={1400} y={190} mood="angry" look={[-0.5, 0.1]} rot={4} />
		<div style={{position: 'absolute', left: 960 - 115, top: 470, width: 230, height: 230, borderRadius: '50%', background: '#FFD23F', border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)'}}><Txt size={115} color="#E8394A">VS</Txt></div>
		<Top size={140}>¿EL MEJOR ESTADIO?</Top>
		<Bottom size={140}>¿MARACANÁ O BOMBONERA?</Bottom>
	</Base>
);
// 4: ¿Madrid o Barcelona? — Spain shocked, question marks
export const T9q4: React.FC = () => (
	<Base>
		<WorldFlags cam={{x: 2300, y: 900, z: 0.8}} />
		<CountryFace k="ESP" flag="es" x={960} y={570} w={880} mood="shock" rot={3} />
		<div style={{position: 'absolute', left: 300, top: 360, transform: 'rotate(-14deg)'}}><Txt size={220} color="#FFD23F">?</Txt></div>
		<div style={{position: 'absolute', right: 300, top: 330, transform: 'rotate(12deg)'}}><Txt size={240} color="#FFD23F">?</Txt></div>
		<Top size={130}>EL MEJOR ESTADIO DEL MUNDO</Top>
		<Bottom size={150}>¿MADRID O BARCELONA?</Bottom>
	</Base>
);
// 5: top 20 — four countries lined up
export const T9q5: React.FC = () => (
	<Base>
		<WorldFlags cam={CAM} dark={0.4} />
		<CountryFace k="BRA" flag="br" x={300} y={560} w={430} mood="cool" rot={-5} />
		<CountryFace k="ESP" flag="es" x={760} y={540} w={470} mood="smug" rot={3} />
		<CountryFace k="ENG" flag="gb-eng" x={1180} y={560} w={300} mood="angry" rot={-3} />
		<CountryFace k="MEX" flag="mx" x={1620} y={560} w={470} mood="happy" rot={5} />
		<Top size={150}>TOP 20 ESTADIOS</Top>
		<Bottom size={150}>¿CUÁL ES EL Nº 1?</Bottom>
	</Base>
);
