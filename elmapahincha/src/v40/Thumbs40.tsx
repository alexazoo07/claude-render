import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {Atlas, Fill, FaceSpec, INK} from '../v12/Atlas';
import {TT, Vig, Cup, Sparkles} from '../v22/Thumbs22b';
import {fitCam, boxCam, FL} from '../vs/Story';

const YEL = '#FFD23F', SW = 0.1;
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}><Fonts />{children}</AbsoluteFill>;
const Pill: React.FC<{t: string; x: number; y: number; bg?: string; c?: string; size?: number; rot?: number}> = ({t, x, y, bg = YEL, c = INK, size = 80, rot = -4}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.15}px ${size * 0.4}px`, borderRadius: size * 0.3, background: bg, border: `${size * 0.1}px solid ${INK}`, boxShadow: `0 ${size * 0.12}px 0 rgba(0,0,0,0.45)`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1}}>{t}</div>
);
const col = (mood: FaceSpec['mood'], s = 3.2, extra: Record<string, FaceSpec> = {}) => ({COL: {mood, size: s, max: 300, dy: 10}, ...extra});
const Storm: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #7B3FE4 0%, #3B1478 55%, #12052B 100%)'}}>
		<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.55}}><path d="M620 0 L540 260 L640 270 L520 560" stroke="#E9D8FF" strokeWidth={10} fill="none" /><path d="M200 120 L150 330 L230 340 L170 520" stroke="#E9D8FF" strokeWidth={7} fill="none" /></svg>
	</div>
);
export const T40a: React.FC = () => (
	<Base>
		<Atlas cam={fitCam(['COL'], 640, 560, 900, 760)} fills={{COL: {flag: FL.COL, lift: 1}}} faces={col('love', 3.4)} />
		<Vig o={0.45} />
		<Sparkles seed={2} n={20} />
		<Cup x={1400} y={540} h={560} rot={8} />
		<TT parts={[['¿Y SI COLOMBIA']]} size={124} sw={SW} style={{top: 20}} />
		<TT parts={[['GANABA EL ', '#fff'], ['MUNDIAL?', YEL]]} size={124} sw={SW} style={{top: 915}} />
	</Base>
);
export const T40b: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={fitCam(['COL'], 960, 560, 760, 700)} fills={{COL: {color: '#9AA3B5', lift: 1}}} faces={col('sad', 3.2)} /></div>
		</div>
		<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
			<Storm />
			<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080}}>
				<Cup x={300} y={560} h={460} rot={-8} />
				<img src={staticFile(`flags/${FL.COL}.svg`)} style={{position: 'absolute', left: 470, top: 360, width: 420, height: 280, objectFit: 'cover', borderRadius: 20, border: `10px solid ${INK}`, transform: 'rotate(5deg)', boxShadow: '0 12px 0 rgba(0,0,0,0.4)'}} />
			</div>
		</div>
		<div style={{position: 'absolute', left: 951, top: 0, width: 18, height: 1080, background: INK}} />
		<Pill t="REALIDAD" x={480} y={110} size={92} bg="#fff" />
		<Pill t="¿Y SI...?" x={1440} y={110} size={92} />
		<TT parts={[['COLOMBIA ', '#fff'], ['CAMPEONA', YEL]]} size={130} sw={SW} style={{top: 910}} />
	</Base>
);
export const T40c: React.FC = () => (
	<Base>
		<Atlas cam={boxCam([1000, 350, 2000, 1050], 960, 560, 1500, 800)} fills={{COL: {flag: FL.COL, lift: 1}, ESP: {flag: FL.ESP, lift: 1}}} faces={{COL: {mood: 'angry', size: 3, max: 260}, ESP: {mood: 'shock', size: 3, max: 260}}} />
		<Vig o={0.45} />
		<Cup x={960} y={560} h={420} />
		<TT parts={[['LA FINAL ', '#fff'], ['SOÑADA', YEL]]} size={124} sw={SW} style={{top: 20}} />
		<TT parts={[['COLOMBIA VS ESPAÑA']]} size={110} sw={SW} style={{top: 920}} />
	</Base>
);
export const T40d: React.FC = () => (
	<Base>
		<Atlas cam={fitCam(['COL'], 620, 560, 900, 760)} fills={{COL: {flag: FL.COL, lift: 1}}} faces={col('panic', 3.4)} />
		<Vig o={0.5} />
		<svg width={700} height={500} style={{position: 'absolute', left: 1120, top: 260}} viewBox="0 0 700 500">
			<rect x={40} y={40} width={620} height={380} fill="none" stroke="#fff" strokeWidth={22} />
			<path d="M40 40 L40 420 M660 40 L660 420" stroke={INK} strokeWidth={6} />
			{Array.from({length: 12}, (_, i) => <path key={i} d={`M${40 + i * 52} 40 L${40 + i * 52} 420`} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />)}
			{Array.from({length: 7}, (_, i) => <path key={'h' + i} d={`M40 ${40 + i * 54} L660 ${40 + i * 54}`} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />)}
			<circle cx={540} cy={130} r={56} fill="#fff" stroke={INK} strokeWidth={8} />
			<path d="M540 90 L575 115 L562 155 L518 155 L505 115Z" fill={INK} />
		</svg>
		<Pill t="3-4" x={1470} y={820} size={110} bg="#fff" rot={4} />
		<TT parts={[['¿Y SI ESE ', '#fff'], ['PENALTI', YEL]]} size={124} sw={SW} style={{top: 20}} />
		<TT parts={[['HUBIERA ENTRADO?']]} size={124} sw={SW} style={{top: 915}} />
	</Base>
);
const CH = ['uy', 'it', 'de', 'br', 'gb-eng', 'ar', 'fr', 'es'];
export const T40e: React.FC = () => (
	<Base>
		<Storm />
		<Sparkles seed={7} n={24} />
		<div style={{position: 'absolute', left: 110, top: 260, display: 'grid', gridTemplateColumns: 'repeat(4, 230px)', gap: 26}}>
			{CH.map((c) => <img key={c} src={staticFile(`flags/${c}.svg`)} style={{width: 230, height: 153, objectFit: 'cover', borderRadius: 14, border: `7px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.45)', filter: 'saturate(0.8)'}} />)}
		</div>
		<div style={{position: 'absolute', left: 1220, top: 300, transform: 'rotate(4deg)'}}>
			<img src={staticFile(`flags/${FL.COL}.svg`)} style={{width: 560, height: 373, objectFit: 'cover', borderRadius: 24, border: `12px solid ${INK}`, boxShadow: `0 0 60px ${YEL}, 0 14px 0 rgba(0,0,0,0.45)`}} />
			<div style={{position: 'absolute', left: 230, top: -110, fontSize: 150, color: YEL, WebkitTextStroke: `8px ${INK}`, fontFamily: LILITA}}>★</div>
		</div>
		<TT parts={[['¿LA ', '#fff'], ['9ª CAMPEONA?', YEL]]} size={124} sw={SW} style={{top: 30}} />
		<TT parts={[['COLOMBIA EN EL MUNDIAL']]} size={100} sw={SW} style={{top: 930}} />
	</Base>
);
