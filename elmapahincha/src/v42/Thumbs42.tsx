import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, LILITA} from '../fonts';
import {Atlas, Fill, FaceSpec, INK} from '../v12/Atlas';
import {TT, Vig} from '../v22/Thumbs22b';
import {fitCam, boxCam, FL} from '../vs/Story';
import {Lost} from './Video42';

const YEL = '#FFD23F', SW = 0.1;
const Base: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: '#2A72BA', overflow: 'hidden'}}><Fonts />{children}</AbsoluteFill>;
const Pill: React.FC<{t: string; x: number; y: number; bg?: string; c?: string; size?: number; rot?: number}> = ({t, x, y, bg = YEL, c = INK, size = 80, rot = -4}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, padding: `${size * 0.15}px ${size * 0.4}px`, borderRadius: size * 0.3, background: bg, border: `${size * 0.1}px solid ${INK}`, boxShadow: `0 ${size * 0.12}px 0 rgba(0,0,0,0.45)`, fontFamily: LILITA, fontSize: size, color: c, whiteSpace: 'nowrap', lineHeight: 1}}>{t}</div>
);
const fl = (ks: string[], lift = 0.5): Record<string, Fill> => Object.fromEntries(ks.map((k) => [k, {flag: FL[k], lift}]));
const F = (m: Record<string, [FaceSpec['mood'], number]>): Record<string, FaceSpec> => Object.fromEntries(Object.entries(m).map(([k, [mood, mx]]) => [k, {mood, size: 3, max: mx}]));
const ALLK = ['TEXAS', 'CESION', 'LITORAL', 'ACRE', 'CHACO', 'TARAPACA', 'FORMOSA', 'MATOGROSSO', 'AMAZONIA_EC', 'PAN', 'ESEQUIBO', 'FLK', 'BLZ'];
const LATK = ['MEX', 'GTM', 'SLV', 'HND', 'NIC', 'CRI', 'CUB', 'HTI', 'DOM', 'COL', 'VEN', 'ECU', 'PER', 'BOL', 'BRA', 'PRY', 'CHL', 'ARG', 'URY'];
const MBOX: [number, number, number, number] = [660, 450, 1000, 760];
export const T42a: React.FC = () => (
	<Base>
		<Atlas cam={boxCam(MBOX, 760, 560, 1300, 820)} fills={{...fl(['MEX'], 0.8), USA: {color: '#9AA3B5'}}} faces={F({MEX: ['love', 170], USA: ['shock', 200]})}><Lost keys={['TEXAS', 'CESION']} t={999} /></Atlas>
		<Vig o={0.45} />
		<Pill t="¡MÁS DEL DOBLE!" x={1500} y={560} size={92} />
		<TT parts={[['¿Y SI MÉXICO ', '#fff'], ['RECUPERARA', YEL]]} size={110} sw={SW} style={{top: 20}} />
		<TT parts={[['SU TERRITORIO PERDIDO?']]} size={110} sw={SW} style={{top: 920}} />
	</Base>
);
export const T42b: React.FC = () => (
	<Base>
		<Atlas cam={boxCam([1060, 1080, 1400, 1360], 760, 560, 1200, 860)} fills={fl(['BOL', 'CHL', 'PER', 'PRY'], 0.4)} faces={F({BOL: ['love', 220], CHL: ['shock', 110]})}><Lost keys={['LITORAL', 'ACRE', 'CHACO']} t={999} /></Atlas>
		<Vig o={0.45} />
		<Pill t="¡CON MAR!" x={1520} y={540} size={120} bg="#4FB3FF" c="#fff" />
		<TT parts={[['¿Y SI BOLIVIA ', '#fff'], ['RECUPERARA', YEL]]} size={110} sw={SW} style={{top: 20}} />
		<TT parts={[['SU SALIDA AL MAR?']]} size={120} sw={SW} style={{top: 915}} />
	</Base>
);
export const T42c: React.FC = () => {
	const cam = boxCam(MBOX, 960, 600, 820, 820);
	return (
		<Base>
			<div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={cam} fills={fl(['MEX', 'USA'], 0.5)} faces={F({MEX: ['sad', 150], USA: ['smug', 170]})} /></div></div>
			<div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}><div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}><Atlas cam={cam} fills={{...fl(['MEX'], 0.5), USA: {color: '#9AA3B5'}}} faces={F({MEX: ['love', 150], USA: ['panic', 170]})}><Lost keys={['TEXAS', 'CESION']} t={999} /></Atlas></div></div>
			<div style={{position: 'absolute', left: 951, top: 0, width: 18, height: 1080, background: INK}} />
			<Pill t="HOY" x={480} y={110} size={96} bg="#fff" />
			<Pill t="¿Y SI...?" x={1440} y={110} size={96} />
			<TT parts={[['TERRITORIO ', '#fff'], ['PERDIDO', YEL]]} size={124} sw={SW} style={{top: 915}} />
		</Base>
	);
};
export const T42d: React.FC = () => (
	<Base>
		<Atlas cam={fitCam([...LATK, 'USA'], 720, 560, 1250, 880)} fills={{...fl(LATK, 0.3), USA: {color: '#9AA3B5'}}} faces={F({MEX: ['love', 110], BOL: ['love', 90], USA: ['angry', 120]})}><Lost keys={ALLK} t={999} /></Atlas>
		<Vig o={0.4} />
		<Pill t="13 TERRITORIOS" x={1520} y={520} size={90} />
		<TT parts={[['EL NUEVO MAPA DE']]} size={112} sw={SW} style={{top: 20}} />
		<TT parts={[['LATINOAMÉRICA', YEL]]} size={140} sw={SW} style={{top: 905}} />
	</Base>
);
export const T42e: React.FC = () => (
	<Base>
		<Atlas cam={boxCam(MBOX, 900, 560, 1500, 860)} fills={{USA: {flag: FL.USA, lift: 0.8}, MEX: {flag: FL.MEX, lift: 0.4}}} faces={F({USA: ['panic', 280]})}><Lost keys={['TEXAS', 'CESION']} t={999} /></Atlas>
		<Vig o={0.45} />
		<Pill t="-25%" x={1560} y={520} size={150} bg="#E8394A" c="#fff" />
		<TT parts={[['ESTADOS UNIDOS ', '#fff'], ['PIERDE', YEL]]} size={110} sw={SW} style={{top: 20}} />
		<TT parts={[['SI LATINOAMÉRICA RECUPERA...']]} size={92} sw={SW} style={{top: 930}} />
	</Base>
);
