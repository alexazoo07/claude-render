import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {Atlas, Fill, FaceSpec, INK} from '../v12/Atlas';
import {TT, Vig, Sparkles} from '../v22/Thumbs22b';
import {fitCam, FL} from '../vs/Story';
import P from './peaks.json';
import {WORLD, bboxOf} from '../v5/WorldLayer5';
import {FlagCover} from '../flagCover';
import {Face12} from '../v12/Atlas';
// a country drawn ON TOP of the flood (flag + white sticker border + face)
const Top: React.FC<{k: string; mood: FaceSpec['mood']; z: number; fs?: number}> = ({k, mood, z, fs = 150}) => {
	const W = WORLD[k]; const b = bboxOf(k); const [cx, cy] = W.c; const sz = fs / z;
	return (
		<g>
			<defs><clipPath id={'tc' + k}><path d={W.d} /></clipPath></defs>
			<path d={W.d} fill="#06142A" opacity={0.35} transform={`translate(${4 / z} ${9 / z})`} />
			<path d={W.d} fill="none" stroke="#fff" strokeWidth={9 / z} strokeLinejoin="round" />
			<FlagCover flag={FL[k]} x={b.x0} y={b.y0} w={b.w} h={b.h} clipPath={`url(#tc${k})`} />
			<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" clipPath={`url(#tc${k})`} style={{mixBlendMode: 'multiply'}} />
			<path d={W.d} fill="none" stroke={INK} strokeWidth={3 / z} strokeLinejoin="round" />
			<g transform={`translate(${cx} ${cy}) scale(${sz / 100}) translate(-100 -100)`}><Face12 mood={mood} /></g>
		</g>
	);
};

const YEL = '#FFD23F', SW = 0.1;
const LAT = ['MEX', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'PAN', 'CUB', 'HTI', 'DOM', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'BRA', 'PRY', 'CHL', 'ARG', 'URY'];
const Flood: React.FC<{h: number}> = ({h}) => {
	const t = Math.sqrt(h / 7000), K = 70;
	return (
		<g>
			<defs><filter id="tfl" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`0 0 0 0 0.16  0 0 0 0 0.44  0 0 0 0 0.74  ${-K} 0 0 0 ${K * (t + 0.5 / 255)}`} /></filter></defs>
			<image href={staticFile('tex/elev_world.png')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" filter="url(#tfl)" opacity={0.7} />
			<image href={staticFile('tex/elev_latam.png')} x={P.box.x} y={P.box.y} width={P.box.w} height={P.box.h} preserveAspectRatio="none" filter="url(#tfl)" opacity={0.7} />
		</g>
	);
};
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}><Fonts />{children}</AbsoluteFill>;
const Pill: React.FC<{t: string; x: number; y: number; bg?: string; c?: string; size?: number; rot?: number}> = ({t, x, y, bg = YEL, c = INK, size = 80, rot = -4}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.15}px ${size * 0.4}px`, borderRadius: size * 0.3, background: bg, border: `${size * 0.1}px solid ${INK}`, boxShadow: `0 ${size * 0.12}px 0 rgba(0,0,0,0.45)`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1}}>{t}</div>
);
const flags = (keys: string[], lift = 0.3): Record<string, Fill> => Object.fromEntries(keys.map((k) => [k, {flag: FL[k], lift}]));
const faces = (keys: string[], mood: FaceSpec['mood'], max = 90): Record<string, FaceSpec> => Object.fromEntries(keys.map((k) => [k, {mood, size: 1, max}]));
export const T41a: React.FC = () => (
	<Base>
		{(() => { const c = fitCam(LAT, 760, 560, 1100, 880); return <Atlas cam={c} fills={flags(LAT)} faces={faces(['BRA', 'COL', 'MEX'], 'panic', 110)} top={<><Top k="PER" mood="scared" z={c.z} fs={110} /><Top k="ARG" mood="cool" z={c.z} fs={150} /></>}><Flood h={900} /></Atlas>; })()}
		<Vig o={0.45} />
		<Pill t="+900 m" x={1500} y={540} size={130} bg="#4FB3FF" c="#fff" />
		<TT parts={[['SI EL MAR SUBIERA...']]} size={118} sw={SW} style={{top: 20}} />
		<TT parts={[['¿QUIÉN ', '#fff'], ['SOBREVIVE?', YEL]]} size={130} sw={SW} style={{top: 905}} />
	</Base>
);
export const T41b: React.FC = () => {
	const cam = fitCam(LAT, 960, 560, 860, 860);
	return (
		<Base>
			<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={cam} fills={flags(LAT)} faces={faces(['BRA', 'ARG', 'MEX'], 'happy')} /></div></div>
			<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={cam} fills={flags(LAT)} faces={faces(['BRA', 'ARG', 'MEX'], 'panic')}><Flood h={3000} /></Atlas></div></div>
			<div style={{position: 'absolute', left: 951, top: 0, width: 18, height: 1080, background: INK}} />
			<Pill t="+0 m" x={480} y={120} size={100} bg="#fff" />
			<Pill t="+3.000 m" x={1440} y={120} size={100} bg="#4FB3FF" c="#fff" />
			<TT parts={[['¿QUÉ PAÍS ', '#fff'], ['SOBREVIVE?', YEL]]} size={120} sw={SW} style={{top: 910}} />
		</Base>
	);
};
export const T41c: React.FC = () => (
	<Base>
		{(() => { const c = fitCam(['CHL', 'ARG'], 700, 560, 1200, 900); return <Atlas cam={c} fills={{}} top={<><Top k="ARG" mood="angry" z={c.z} fs={190} /><Top k="CHL" mood="panic" z={c.z} fs={110} /></>}><Flood h={1500} /></Atlas>; })()}
		<Vig o={0.45} />
		<div style={{position: 'absolute', left: 1200, top: 440, width: 200, height: 200, borderRadius: '50%', background: YEL, border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 100, color: INK, transform: 'rotate(-8deg)'}}>VS</div>
		<TT parts={[['EL ÚLTIMO EN ', '#fff'], ['HUNDIRSE', YEL]]} size={118} sw={SW} style={{top: 20}} />
		<TT parts={[['¡POR SOLO 68 METROS!']]} size={110} sw={SW} style={{top: 915}} />
	</Base>
);
export const T41d: React.FC = () => (
	<Base>
		{(() => { const c = fitCam(['BRA'], 700, 560, 1100, 820); return <Atlas cam={c} fills={{BRA: {flag: FL.BRA, lift: 0.5}}} faces={{BRA: {mood: 'panic', size: 2.2, max: 240}}}><Flood h={300} /></Atlas>; })()}
		<Vig o={0.45} />
		<Pill t="+300 m" x={1520} y={480} size={120} bg="#4FB3FF" c="#fff" />
		<TT parts={[['¿BRASIL ', '#fff'], ['BAJO EL AGUA?', YEL]]} size={116} sw={SW} style={{top: 20}} />
		<TT parts={[['SI EL MAR SUBIERA SIN PARAR']]} size={92} sw={SW} style={{top: 930}} />
	</Base>
);
export const T41e: React.FC = () => (
	<Base>
		{(() => { const c = fitCam(LAT, 640, 560, 1100, 880); return <Atlas cam={c} fills={flags(LAT, 0.2)} top={<Top k="ARG" mood="love" z={c.z} fs={170} />}><Flood h={4500} /></Atlas>; })()}
		<Vig o={0.45} />
		<Sparkles seed={3} n={14} />
		<div style={{position: 'absolute', left: 1050, width: 820, top: 330, textAlign: 'center', fontFamily: LILITA, fontSize: 190, color: '#fff', WebkitTextStroke: `18px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 14px 0 ${INK}`, lineHeight: 1}}>+4.500 m</div>
		<Pill t="¿Y AHORA QUÉ?" x={1460} y={640} size={84} />
		<TT parts={[['SOLO QUEDA ', '#fff'], ['UNO', YEL]]} size={124} sw={SW} style={{top: 20}} />
		<TT parts={[['LATINOAMÉRICA BAJO EL MAR']]} size={96} sw={SW} style={{top: 925}} />
	</Base>
);
