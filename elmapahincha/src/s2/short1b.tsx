// Short 1 (v2) · ¿Qué pasaría si Sudamérica desapareciera del fútbol?
import React from 'react';
import {interpolate, staticFile} from 'remotion';
import {INK} from '../v21/Atlas21';
import {FL} from '../v21/data21';
import {VShort2, ShortDef, Timeline, T, YEL, RED, PopIn, Stat, Ball, pop} from './VShort2';
import TL from './short1b.json';

const tl = TL as Timeline;
const SA_ORDER = ['URY', 'ARG', 'BRA', 'PRY', 'CHL', 'BOL', 'PER', 'ECU', 'COL', 'VEN', 'GUY', 'SUR', 'GUF'];
const w0 = tl.lines[0].words.find((w) => w.w.toLowerCase().startsWith('desapare'))?.s ?? 120;
const BOOMS = SA_ORDER.map((k, j) => ({k, at: w0 + 2 + (j < 3 ? j * 10 : 26 + (j - 3) * 3)}));

const Star: React.FC<{s: number; c?: string; grey?: boolean}> = ({s, c = YEL, grey}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{overflow: 'visible', filter: grey ? 'grayscale(1) opacity(0.45)' : 'drop-shadow(0 0 10px rgba(255,210,63,0.9))'}}><path d="M0 -46 L13 -14 L46 -12 L20 9 L29 42 L0 23 L-29 42 L-20 9 L-46 -12 L-13 -14 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></svg>
);
const Cup: React.FC<{s: number; grey?: boolean}> = ({s, grey}) => (
	<svg width={s * 0.8} height={s} viewBox="-4 -4 88 108" style={{overflow: 'visible', filter: grey ? 'grayscale(1) brightness(0.6)' : 'drop-shadow(0 4px 0 rgba(0,0,0,0.35))'}}>
		<g stroke="#fff" strokeWidth={14} strokeLinejoin="round" fill="#fff"><path d="M14 4 H66 C66 40 56 56 40 58 C24 56 14 40 14 4 Z" /><rect x={20} y={58} width={40} height={30} /></g>
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke="#F2B705" strokeWidth={4} strokeLinecap="round" />
		<path d="M14 4 H66 C66 40 56 56 40 58 C24 56 14 40 14 4 Z" fill="#F2B705" stroke={INK} strokeWidth={5} />
		<path d="M24 10 C24 30 30 44 38 50" fill="none" stroke="#FFF3B0" strokeWidth={5} strokeLinecap="round" />
		<rect x={33} y={58} width={14} height={16} fill="#D69A00" stroke={INK} strokeWidth={5} />
		<rect x={20} y={74} width={40} height={14} rx={3} fill="#7A4A1A" stroke={INK} strokeWidth={5} />
	</svg>
);
const Mini: React.FC<{k: string; s: number; grey?: boolean}> = ({k, s, grey}) => (
	<div style={{width: s, height: s, borderRadius: '50%', overflow: 'hidden', border: `${s * 0.07}px solid #fff`, boxShadow: `0 0 0 ${s * 0.05}px ${INK}`, flex: 'none', filter: grey ? 'grayscale(1) brightness(0.7)' : undefined}}><img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
);
const Row: React.FC<{y: number; children: React.ReactNode; gap?: number}> = ({y, children, gap = 18}) => <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap}}>{children}</div>;
const Chip: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#fff'}) => <div style={{background: bg, border: `6px solid ${INK}`, borderRadius: 20, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 7px 0 ${INK}`}}>{children}</div>;
const WIN = ['URY', 'ITA', 'ITA', 'URY', 'DEU', 'BRA', 'BRA', 'ENG', 'BRA', 'DEU', 'ARG', 'ITA', 'ARG', 'DEU', 'BRA', 'FRA', 'BRA', 'ITA', 'ESP', 'DEU', 'FRA', 'ARG', 'ESP'];
const wordAt = (li: number, pre: string) => { const l = tl.lines[li]; const w = l.words.find((x) => x.w.toLowerCase().replace(/[¡!¿?,.]/g, '').startsWith(pre)); return (w?.s ?? l.start) - l.start; };

export const DEF1B: ShortDef = {
	title: [[['¿QUÉ PASARÍA SI']], [['SUDAMÉRICA', YEL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: BOOMS,
	flashAt: [BOOMS[0].at],
	cta: ['BRA', 'ARG', 'URY', 'COL', 'CHL', 'PER', 'ECU', 'PRY', 'VEN', 'BOL'],
	scenes: [
		// 0 · gancho: Brasil, Argentina y Uruguay sobre el mapa… y explotan
		{cam: {x: 1300, y: 1290, z: 1.75}, qmarks: true, spk: [
			{k: 'BRA', mood: 'scared', endMood: 'panic', d: 250, dx: 30, dy: -60, talker: true},
			{k: 'ARG', mood: 'worried', endMood: 'panic', d: 190, dx: 20, dy: -330, talker: false},
			{k: 'URY', mood: 'scared', endMood: 'panic', d: 140, dx: 120, dy: -170, talker: false},
		]},
		// 1 · Brasil fantasma protesta
		{cam: {x: 1330, y: 1150, z: 2.2}, spk: [{k: 'BRA', mood: 'shock', endMood: 'angry', ghost: true}], props: (t) => {
			const cw = wordAt(1, 'cinco');
			return <Row y={900} gap={8}>{[0, 1, 2, 3, 4].map((j) => <PopIn key={j} t={t} d={cw + j * 5}><Star s={120} /></PopIn>)}</Row>;
		}},
		// 2 · narrador: 10 de 23 Mundiales sin campeón
		{cam: {x: 1880, y: 980, z: 0.55}, props: (t) => {
			const gw = wordAt(2, 'diez');
			return <>
				<div style={{position: 'absolute', top: 560, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6}}>
					{WIN.map((k, j) => { const sa = ['URY', 'BRA', 'ARG'].includes(k); const gone = sa && t > gw + j * 2; const fall = gone ? interpolate(t, [gw + j * 2, gw + j * 2 + 40], [0, 500], {extrapolateRight: 'clamp'}) : 0; return <div key={j} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transform: `translateY(${fall}px) rotate(${fall * 0.15}deg)`, opacity: gone ? interpolate(fall, [0, 500], [1, 0]) : 1}}><PopIn t={t} d={8 + j * 2}><Cup s={92} grey={gone} /></PopIn><PopIn t={t} d={10 + j * 2}><Mini k={k} s={44} /></PopIn></div>; })}
				</div>
				<Stat t={t} d={gw} y={940} size={170}>10/23</Stat>
			</>;
		}},
		// 2 · Francia
		{focus: 'FRA', spk: [{k: 'FRA', mood: 'smug', endMood: 'love'}], props: (t) => {
			const sw = wordAt(3, 'estrellas');
			return <Row y={890} gap={22}><PopIn t={t} d={30}><Star s={130} /></PopIn><PopIn t={t} d={38}><Star s={130} /></PopIn><PopIn t={t} d={sw}><div style={{transform: `rotate(${interpolate(t, [sw, sw + 30], [-180, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}deg)`}}><Star s={170} c="#FFE680" /></div></PopIn></Row>;
		}},
		// 3 · Italia
		{focus: 'ITA', z: 4.6, spk: [{k: 'ITA', mood: 'sad', endMood: 'happy'}], props: (t, len) => {
			const sw = wordAt(4, 'seis');
			return <>
				<Row y={880}>{['1970', '1994'].map((y, j) => <PopIn key={y} t={t} d={wordAt(4, j ? 'noventa' : 'setenta')} out={sw - 4}><Chip><Mini k="BRA" s={60} /><T size={64} c={RED}>{y}</T><Mini k="ITA" s={60} /></Chip></PopIn>)}</Row>
				<Row y={900} gap={10}><PopIn t={t} d={sw}><T size={150} c="#fff">4</T></PopIn><PopIn t={t} d={sw + 6}><T size={110} c="#fff">→</T></PopIn><PopIn t={t} d={sw + 12}><T size={170} c={YEL} sh="#7A2E00">6</T></PopIn><PopIn t={t} d={sw + 16}><Cup s={140} /></PopIn></Row>
			</>;
		}},
		// 4 · Alemania
		{focus: 'DEU', spk: [{k: 'DEU', mood: 'cool', endMood: 'shock'}], props: (t) => {
			const fw = wordAt(5, 'finales');
			return <>
				<Row y={880} gap={12}>{['1986', '1990', '2014'].map((y, j) => <PopIn key={y} t={t} d={fw + j * 8}><Chip><Mini k="DEU" s={52} /><T size={50} c={INK} sw={0} sh="transparent">{y}</T><Mini k="ARG" s={52} /></Chip></PopIn>)}</Row>
				<Stat t={t} d={wordAt(5, 'repetida')} y={1010} size={78} c="#fff">¡LA MÁS REPETIDA!</Stat>
			</>;
		}},
		// 5 · Inglaterra
		{focus: 'ENG', z: 6.5, spk: [{k: 'ENG', mood: 'angry', endMood: 'smug'}], props: (t) => {
			const mw = wordAt(6, 'mano');
			return <>
				<Row y={880}><PopIn t={t} d={mw - 10}><Chip><Mini k="ARG" s={80} /><T size={84} c={INK} sw={0} sh="transparent">2-1</T><Mini k="ENG" s={80} /></Chip></PopIn></Row>
				<div style={{position: 'absolute', top: 1010, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><PopIn t={t} d={mw + 6}><div style={{transform: 'rotate(-7deg)', border: `9px solid ${RED}`, borderRadius: 18, padding: '0 24px', background: 'rgba(255,255,255,0.92)', boxShadow: `0 0 0 5px ${INK}`}}><T size={80} c={RED} sw={0.06} sh="transparent">¡MANO DE DIOS!</T></div></PopIn></div>
			</>;
		}},
		// 6 · España
		{focus: 'ESP', z: 5.2, spk: [{k: 'ESP', mood: 'happy', endMood: 'worried'}], props: (t) => {
			const fw = wordAt(7, 'final');
			const aw = wordAt(7, 'ahora');
			return <>
				<Row y={880}><PopIn t={t} d={fw}><Chip><Mini k="ESP" s={84} /><T size={90} c={INK} sw={0} sh="transparent">1-0</T><Mini k="ARG" s={84} grey={t > aw} /></Chip></PopIn></Row>
				<Stat t={t} d={aw} y={1020} size={80} c="#fff">¿Y AHORA QUÉ RIVAL?</Stat>
			</>;
		}},
		// 7 · CTA
		{cam: {x: 1300, y: 1220, z: 1.55}, spk: [
			{k: 'BRA', mood: 'love', ghost: true, d: 220, dx: 20, dy: -40, talker: false},
			{k: 'ARG', mood: 'love', ghost: true, d: 190, dy: -30, talker: false},
			{k: 'COL', mood: 'love', ghost: true, d: 160, dy: -20, talker: false},
		], props: (t) => <div style={{position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<PopIn t={t} d={30}><svg width={150} height={160} viewBox="0 0 100 110" style={{transform: `translateY(${Math.sin(t / 7) * 16}px)`}}><path d="M30 0 H70 V55 H95 L50 105 L5 55 H30 Z" fill={YEL} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></svg></PopIn>
		</div>},
	],
};
export const VS1B: React.FC = () => <VShort2 tl={tl} def={DEF1B} />;
export const VS1B_TOTAL = tl.total;
export const BOOM_FRAMES = BOOMS;
