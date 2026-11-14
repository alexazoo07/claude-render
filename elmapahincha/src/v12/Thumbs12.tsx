import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {Atlas, Face12, FaceMood, FaceSpec, Fill, INK} from './Atlas';
import {CAT_COL, Cat, OPP} from './data12';

// thumbnails are designed at 1920x1080 and downscaled to 1280x720 (no glow, thin outline)
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.075}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.06}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const catMood = (c: Cat): FaceMood => (c === 'PAN' ? 'panic' : c === 'MIE' ? 'scared' : c === 'RES' ? 'cool' : 'angry');
const ALL = Object.keys(OPP).filter((k) => WORLD[k]);
const FLAGS = Array.from(new Set(['ar', ...ALL.map((k) => OPP[k].flag)]));

const MapBg: React.FC<{mode: 'flags' | 'cats' | 'panic'; cam?: {x: number; y: number; z: number}}> = ({mode, cam = {x: 1700, y: 760, z: 0.78}}) => {
	const fills: Record<string, Fill> = {};
	const faces: Record<string, FaceSpec> = {};
	for (const k of ALL) {
		const o = OPP[k];
		if (mode === 'flags') fills[k] = {flag: o.flag};
		else if (mode === 'cats') fills[k] = {color: CAT_COL[o.cat]};
		else if (o.cat === 'PAN' || o.cat === 'MIE') fills[k] = {color: CAT_COL[o.cat]};
		faces[k] = {mood: mode === 'flags' ? (o.cat === 'SIN' ? 'angry' : 'scared') : catMood(o.cat), size: 0.8, max: 80};
	}
	fills.ARG = {color: '#9CCFF2'};
	return <Atlas cam={cam} fills={fills} faces={faces} />;
};
const HB = (() => { const b = WORLD.ARG.b; return {x0: b[0][0], y0: b[0][1], x1: b[1][0], y1: b[1][1]}; })();
const BigArg: React.FC<{h: number; x: number; y: number; mood: FaceMood; look?: [number, number]; rot?: number}> = ({h, x, y, mood, look = [0, 0], rot = 0}) => {
	const S = h / (HB.y1 - HB.y0), W = (HB.x1 - HB.x0) * S;
	return (
		<div style={{position: 'absolute', left: x - W / 2, top: y, width: W, height: h, transform: `rotate(${rot}deg)`}}>
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
			<svg width={W * 1.25} height={W * 1.25} viewBox="0 0 200 200" style={{position: 'absolute', left: W * 0.52 - W * 0.625, top: h * 0.2 - W * 0.62, overflow: 'visible'}}>
				<Face12 mood={mood} look={look} />
			</svg>
		</div>
	);
};
const Spark: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<svg width={s} height={s} viewBox="-20 -20 40 40" style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}><path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" fill="#FFE066" stroke={INK} strokeWidth={2.5} /></svg>
);
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}>
		<Fonts />
		<FlagPreload flags={FLAGS} />
		{children}
	</AbsoluteFill>
);
const CountryFace: React.FC<{k: string; x: number; y: number; w: number; mood: FaceMood; color?: string; rot?: number}> = ({k, x, y, w, mood, color, rot = 0}) => {
	const b = WORLD[k].b; const bw = b[1][0] - b[0][0], bh = b[1][1] - b[0][1];
	const S = w / bw, h = bh * S;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
			<svg width={w + 60} height={h + 60} style={{position: 'absolute', left: -30, top: -30, overflow: 'visible'}}>
				<defs><clipPath id={`tc${k}`}><path d={WORLD[k].d} /></clipPath></defs>
				<g transform={`translate(30 30) scale(${S}) translate(${-b[0][0]} ${-b[0][1]})`}>
					<path d={WORLD[k].d} fill="#06142A" opacity={0.4} transform={`translate(${5 / S} ${10 / S})`} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={26 / S} strokeLinejoin="round" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={16 / S} strokeLinejoin="round" />
					{color ? <path d={WORLD[k].d} fill={color} /> : <g clipPath={`url(#tc${k})`}><image href={staticFile(`flags/${OPP[k].flag}.svg`)} x={b[0][0] - 2} y={b[0][1] - 2} width={bw + 4} height={bh + 4} preserveAspectRatio="none" /></g>}
					<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" clipPath={`url(#tc${k})`} style={{mixBlendMode: 'multiply'}} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={4 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={w * 0.8} height={w * 0.8} viewBox="0 0 200 200" style={{position: 'absolute', left: w * 0.1, top: h / 2 - w * 0.4, overflow: 'visible'}}><Face12 mood={mood} /></svg>
		</div>
	);
};

// 1: PAÍSES QUE LE TEMEN A ARGENTINA (reference layout)
export const T12a: React.FC = () => (
	<Base>
		<MapBg mode="flags" />
		<BigArg h={760} x={960} y={190} mood="smug" look={[0.2, 0.1]} rot={-4} />
		<Spark x={1220} y={250} s={70} /><Spark x={700} y={430} s={50} /><Spark x={1250} y={560} s={44} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Txt size={150}>PAÍSES QUE</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}><Txt size={142} color="#FF4D5E">LE TEMEN A ARGENTINA</Txt></div>
	</Base>
);
// 2: ¿QUIÉN LE TIENE MIEDO A ARGENTINA? with scared neighbours
export const T12b: React.FC = () => (
	<Base>
		<MapBg mode="cats" cam={{x: 2150, y: 1000, z: 0.85}} />
		<BigArg h={740} x={700} y={260} mood="angry" look={[0.6, 0]} rot={-3} />
		<CountryFace k="CHL" x={1180} y={640} w={150} mood="panic" rot={6} />
		<CountryFace k="URY" x={1520} y={520} w={300} mood="scared" rot={-4} />
		<CountryFace k="PRY" x={1430} y={840} w={250} mood="scared" rot={5} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
			<Txt size={118}>¿QUIÉN LE TIENE <span style={{color: '#FF4D5E'}}>MIEDO</span></Txt>
			<Txt size={118}>A <span style={{color: '#7CC4F5'}}>ARGENTINA</span>?</Txt>
		</div>
	</Base>
);
// 3: VS split: Argentina vs the ones that don't fear it
export const T12c: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', inset: 0, background: '#2A72BA'}} />
		<div style={{position: 'absolute', left: 0, top: 0, width: 1060, height: 1080, background: 'linear-gradient(160deg, #7CC4F5, #2A72BA)'}} />
		<div style={{position: 'absolute', right: 0, top: 0, width: 1000, height: 1080, background: 'linear-gradient(200deg, #B385F0, #4A1F8A)', clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)'}} />
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke="#fff" strokeWidth={26} strokeLinejoin="round" /><path d="M1010 0 L900 470 L1010 470 L880 1080" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
		<BigArg h={720} x={470} y={300} mood="worried" look={[0.7, 0]} rot={-3} />
		<CountryFace k="BRA" x={1420} y={640} w={640} mood="angry" color={CAT_COL.SIN} rot={4} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 28, display: 'flex', justifyContent: 'center'}}><Txt size={110}>¿QUIÉN <span style={{color: '#FFD23F'}}>NO</span> LE TEME A ARGENTINA?</Txt></div>
		<div style={{position: 'absolute', right: 70, bottom: 60}}><Txt size={190} color="#FFD23F">?</Txt></div>
	</Base>
);
// 4: 48 países nunca le ganaron
export const T12d: React.FC = () => (
	<Base>
		<MapBg mode="panic" cam={{x: 1900, y: 820, z: 0.62}} />
		<BigArg h={700} x={380} y={300} mood="happy" look={[0.6, -0.1]} rot={-4} />
		<Spark x={640} y={330} s={70} /><Spark x={170} y={420} s={50} />
		<div style={{position: 'absolute', left: 560, right: 20, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
			<Txt size={210} color="#FF4D5E">48 PAÍSES</Txt>
			<Txt size={96}>NUNCA LE HAN GANADO</Txt>
			<Txt size={96} color="#7CC4F5">A ARGENTINA</Txt>
		</div>
	</Base>
);
// 5: world painted by fear
export const T12e: React.FC = () => (
	<Base>
		<MapBg mode="cats" cam={{x: 1760, y: 820, z: 0.66}} />
		<BigArg h={660} x={960} y={300} mood="cool" look={[0, 0.1]} rot={3} />
		<Spark x={1170} y={360} s={60} /><Spark x={760} y={500} s={46} />
		<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}><Txt size={128}>¿QUIÉN LE TEME A</Txt></div>
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center'}}><Txt size={150} color="#7CC4F5">ARGENTINA?</Txt></div>
	</Base>
);
