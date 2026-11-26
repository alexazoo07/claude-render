import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {Atlas, Fill, FaceSpec, INK} from '../v12/Atlas';
import {TT, Vig, Cup, Sparkles} from '../v22/Thumbs22b';
import {fitCam, FL} from '../vs/Story';

const YEL = '#FFD23F', RED = '#FF3B3B', SW = 0.1, UNI = '#EFA441';
const LAT = ['MEX', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'PAN', 'CUB', 'HTI', 'DOM', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'BRA', 'PRY', 'CHL', 'ARG', 'URY'];
const merged: Record<string, Fill> = Object.fromEntries(LAT.map((k) => [k, {color: UNI, lift: 1}]));
const flagsF: Record<string, Fill> = Object.fromEntries(LAT.map((k) => [k, {flag: FL[k], lift: 0.6}]));
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}><Fonts />{children}</AbsoluteFill>;
const Pill: React.FC<{t: string; x: number; y: number; bg?: string; c?: string; size?: number; rot?: number}> = ({t, x, y, bg = YEL, c = INK, size = 80, rot = -4}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.15}px ${size * 0.4}px`, borderRadius: size * 0.3, background: bg, border: `${size * 0.1}px solid ${INK}`, boxShadow: `0 ${size * 0.12}px 0 rgba(0,0,0,0.45)`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1}}>{t}</div>
);
const face = (mood: FaceSpec['mood'], s = 3.4): Record<string, FaceSpec> => ({BRA: {mood, size: s, max: 420, dx: -40, dy: 60}});
const MapM: React.FC<{dx?: number; z?: number; mood?: FaceSpec['mood']; extra?: Record<string, Fill>; xf?: Record<string, FaceSpec>}> = ({dx = 0, z = 1, mood = 'cool', extra = {}, xf = {}}) => {
	const c = fitCam(LAT, 960 + dx, 560, 1200 * z, 900 * z);
	return <Atlas cam={c} fills={{...merged, ...extra}} faces={{...face(mood), ...xf}} />;
};
export const T39a: React.FC = () => (
	<Base>
		<MapM dx={-380} mood="cool" />
		<Vig o={0.45} />
		<div style={{position: 'absolute', left: 1150, top: 260, display: 'grid', gridTemplateColumns: 'repeat(5, 130px)', gap: 14}}>
			{LAT.map((k) => <img key={k} src={staticFile(`flags/${FL[k]}.svg`)} style={{width: 130, height: 86, objectFit: 'cover', borderRadius: 10, border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.4)'}} />)}
		</div>
		<Pill t="= 1 PAÍS" x={1500} y={760} size={110} />
		<TT parts={[['¿Y SI LATINOAMÉRICA']]} size={110} sw={SW} style={{top: 20}} />
		<TT parts={[['FUERA ', '#fff'], ['UN SOLO PAÍS?', YEL]]} size={110} sw={SW} style={{top: 920}} />
	</Base>
);
export const T39b: React.FC = () => (
	<Base>
		<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={fitCam(LAT, 960, 560, 900, 900)} fills={flagsF} faces={Object.fromEntries(LAT.map((k) => [k, {mood: 'worried', size: 1, max: 90}]))} /></div>
		</div>
		<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={fitCam(LAT, 960, 560, 900, 900)} fills={merged} faces={face('cool', 3.6)} /></div>
		</div>
		<div style={{position: 'absolute', left: 951, top: 0, width: 18, height: 1080, background: INK}} />
		<div style={{position: 'absolute', left: 960 - 95, top: 470, width: 190, height: 190, borderRadius: '50%', background: YEL, border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 130, color: INK}}>→</div>
		<Pill t="20 PAÍSES" x={480} y={110} size={96} bg="#fff" />
		<Pill t="1 SUPERPAÍS" x={1440} y={110} size={96} />
		<TT parts={[['LATINOAMÉRICA ', '#fff'], ['UNIDA', YEL]]} size={120} sw={SW} style={{top: 920}} />
	</Base>
);
export const T39c: React.FC = () => (
	<Base>
		<Atlas cam={{x: 2080, y: 900, z: 0.5}} fills={{...merged, RUS: {color: '#9AA3B5', lift: 0.6}}} faces={{BRA: {mood: 'smug', size: 4, max: 600, dx: -40, dy: 40}, RUS: {mood: 'shock', size: 2.5, max: 500}}} />
		<Vig o={0.45} />
		<Pill t="20 MILLONES DE KM²" x={1250} y={560} size={84} bg={YEL} />
		<TT parts={[['EL PAÍS MÁS GRANDE']]} size={116} sw={SW} style={{top: 20}} />
		<TT parts={[['DEL MUNDO', YEL]]} size={140} sw={SW} style={{top: 905}} />
	</Base>
);
export const T39d: React.FC = () => (
	<Base>
		<MapM dx={-420} mood="happy" />
		<Vig o={0.45} />
		<Sparkles seed={4} n={16} />
		<div style={{position: 'absolute', left: 1020, width: 860, top: 330, textAlign: 'center', fontFamily: LILITA, fontSize: 230, color: YEL, WebkitTextStroke: `20px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 16px 0 ${INK}`, lineHeight: 1}}>655</div>
		<Pill t="MILLONES" x={1450} y={640} size={90} bg="#fff" rot={-3} />
		<TT parts={[['SI LATINOAMÉRICA']]} size={116} sw={SW} style={{top: 20}} />
		<TT parts={[['FUERA ', '#fff'], ['UN PAÍS', YEL]]} size={130} sw={SW} style={{top: 910}} />
	</Base>
);
export const T39e: React.FC = () => (
	<Base>
		<MapM dx={-420} mood="love" extra={{BRA: {flag: FL.BRA, lift: 1}, ARG: {flag: FL.ARG, lift: 1}, URY: {flag: FL.URY, lift: 1}}} />
		<Vig o={0.45} />
		<Cup x={1300} y={520} h={420} rot={-6} />
		<div style={{position: 'absolute', left: 1430, top: 330, fontFamily: LILITA, fontSize: 260, color: YEL, WebkitTextStroke: `20px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 16px 0 ${INK}`, lineHeight: 1}}>10</div>
		<Pill t="MUNDIALES" x={1580} y={700} size={80} bg="#fff" rot={-3} />
		<TT parts={[['LATINOAMÉRICA']]} size={120} sw={SW} style={{top: 20}} />
		<TT parts={[['UN SOLO PAÍS', YEL]]} size={140} sw={SW} style={{top: 905}} />
	</Base>
);
