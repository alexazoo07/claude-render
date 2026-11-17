// Short 1 · ¿Qué pasaría si Sudamérica desapareciera del fútbol?
import React from 'react';
import {interpolate, spring, staticFile} from 'remotion';
import {INK} from '../v21/Atlas21';
import {FL} from '../v21/data21';
import {VShort, ShortDef, Timeline, T, YEL, RED, FPS, Ball} from './VShort';
import TL from './short1.json';

const SA = ['BRA', 'ARG', 'URY', 'COL', 'CHL', 'PER', 'ECU', 'PRY', 'VEN', 'BOL', 'GUY', 'SUR', 'GUF'];
const pop = (t: number, d = 0) => spring({frame: t - d, fps: FPS, config: {damping: 11, stiffness: 170}});
const Panel: React.FC<{t: number; y?: number; children: React.ReactNode; w?: number}> = ({t, y = 1130, children, w = 860}) => {
	const p = pop(t, 12);
	return <div style={{position: 'absolute', left: 540 - w / 2, top: y, width: w, transform: `scale(${p})`, transformOrigin: '50% 0%', background: '#FFF6E0', border: `7px solid ${INK}`, borderRadius: 30, boxShadow: `0 12px 0 ${INK}`, padding: '18px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>{children}</div>;
};
const Star: React.FC<{s: number; c?: string; grey?: boolean}> = ({s, c = YEL, grey}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{overflow: 'visible', filter: grey ? 'grayscale(1) opacity(0.45)' : 'drop-shadow(0 0 8px rgba(255,210,63,0.9))'}}><path d="M0 -46 L13 -14 L46 -12 L20 9 L29 42 L0 23 L-29 42 L-20 9 L-46 -12 L-13 -14 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></svg>
);
const Cup: React.FC<{s: number; grey?: boolean}> = ({s, grey}) => (
	<svg width={s * 0.8} height={s} viewBox="0 0 80 100" style={{overflow: 'visible', filter: grey ? 'grayscale(1) brightness(0.7) opacity(0.5)' : undefined}}>
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke="#F2B705" strokeWidth={4} strokeLinecap="round" />
		<path d="M14 4 H66 C66 40 56 56 40 58 C24 56 14 40 14 4 Z" fill="#F2B705" stroke={INK} strokeWidth={5} />
		<rect x={33} y={58} width={14} height={16} fill="#D69A00" stroke={INK} strokeWidth={5} />
		<rect x={20} y={74} width={40} height={14} rx={3} fill="#7A4A1A" stroke={INK} strokeWidth={5} />
	</svg>
);
const Mini: React.FC<{k: string; s: number}> = ({k, s}) => (
	<div style={{width: s, height: s, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${INK}`, flex: 'none'}}><img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
);

// 1930..2026 winners (23 tournaments); South American ones vanish
const WIN = ['URY', 'ITA', 'ITA', 'URY', 'DEU', 'BRA', 'BRA', 'ENG', 'BRA', 'DEU', 'ARG', 'ITA', 'ARG', 'DEU', 'BRA', 'FRA', 'BRA', 'ITA', 'ESP', 'DEU', 'FRA', 'ARG', 'ESP'];

export const DEF1: ShortDef = {
	title: [[['¿QUÉ PASARÍA SI']], [['SUDAMÉRICA', YEL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	greyStart: 90,
	grey: (k, f) => { const j = SA.indexOf(k); if (j < 0) return 0; return f >= 90 + j * 6 ? 1 : 0; },
	dust: SA,
	cta: true,
	scenes: [
		// 0 narrador: mundo → Sudamérica se desintegra
		{cam: {x: 1300, y: 1200, z: 1.15}},
		// 1 Brasil fantasma
		{cam: {x: 1320, y: 1150, z: 1.5}, speaker: 'BRA', ghost: true, mood: 'shock', endMood: 'angry',
			card: (t) => <Panel t={t}><T size={64} c={INK} sw={0}>5 MUNDIALES</T><div style={{display: 'flex', gap: 12}}>{[0, 1, 2, 3, 4].map((j) => <div key={j} style={{transform: `scale(${pop(t, 16 + j * 6)})`}}><Star s={110} grey={t > 200} /></div>)}</div></Panel>},
		// 2 narrador: 10 de 23 Mundiales sin campeón
		{cam: {x: 1900, y: 820, z: 0.42},
			card: (t) => <Panel t={t} y={760} w={980}>
				<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, width: 900}}>{WIN.map((k, j) => { const sa = ['URY', 'BRA', 'ARG'].includes(k); const gone = sa && t > 60 + j * 4; return <div key={j} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(t, 10 + j * 2)})`, opacity: gone ? 0.35 : 1}}><Cup s={88} grey={gone} /><Mini k={k} s={40} /></div>; })}</div>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 14, transform: `scale(${pop(t, 110)})`}}><T size={130} c={RED}>10</T><T size={70} c={INK} sw={0}>DE 23 MUNDIALES</T></div>
				<T size={52} c={INK} sw={0}>¡SIN CAMPEÓN!</T>
			</Panel>},
		// 3 Francia
		{cam: {x: 1945, y: 520, z: 3.4}, speaker: 'FRA', mood: 'smug', endMood: 'love', lift: ['FRA'],
			card: (t) => <Panel t={t}><T size={56} c={INK} sw={0}>FINAL CATAR 2022</T><div style={{display: 'flex', gap: 18, alignItems: 'center'}}><Star s={120} /><Star s={120} /><div style={{transform: `scale(${pop(t, 150)}) rotate(${interpolate(t, [150, 190], [-90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}deg)`}}><Star s={150} c="#FFE680" /></div></div><T size={44} c={INK} sw={0}>¿LA 3.ª ESTRELLA?</T></Panel>},
		// 4 Italia
		{cam: {x: 2040, y: 560, z: 3.4}, speaker: 'ITA', mood: 'sad', endMood: 'happy', lift: ['ITA'],
			card: (t) => <Panel t={t}><T size={52} c={INK} sw={0}>FINALES PERDIDAS CON BRASIL</T><div style={{display: 'flex', gap: 30}}><T size={70} c={RED}>1970</T><T size={70} c={RED}>1994</T></div><div style={{display: 'flex', alignItems: 'center', gap: 22, transform: `scale(${pop(t, 170)})`}}><T size={120} c={INK} sw={0}>4</T><T size={90} c={INK} sw={0}>→</T><T size={140} c="#2EAD4B">6</T><Cup s={110} /></div></Panel>},
		// 5 Alemania
		{cam: {x: 2010, y: 470, z: 3.6}, speaker: 'DEU', mood: 'cool', endMood: 'shock', lift: ['DEU'],
			card: (t) => <Panel t={t}><T size={52} c={INK} sw={0}>FINALES ALEMANIA - ARGENTINA</T><div style={{display: 'flex', gap: 18}}>{['1986', '1990', '2014'].map((y, j) => <div key={y} style={{transform: `scale(${pop(t, 30 + j * 25)})`, background: INK, borderRadius: 18, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 10}}><Mini k="DEU" s={46} /><T size={56}>{y}</T><Mini k="ARG" s={46} /></div>)}</div><T size={46} c={RED} sw={0}>¡LA FINAL MÁS REPETIDA!</T></Panel>},
		// 6 Inglaterra
		{cam: {x: 1890, y: 440, z: 4.2}, speaker: 'ENG', mood: 'angry', endMood: 'smug', lift: ['ENG'],
			card: (t) => <Panel t={t}><div style={{display: 'flex', alignItems: 'center', gap: 20}}><Mini k="ARG" s={80} /><T size={90} c={INK} sw={0}>2-1</T><Mini k="ENG" s={80} /></div><T size={50} c={INK} sw={0}>CUARTOS · MÉXICO 1986</T><div style={{transform: `scale(${pop(t, 60)}) rotate(-6deg)`, border: `8px solid ${RED}`, borderRadius: 16, padding: '2px 22px'}}><T size={70} c={RED} sw={0.05}>¡LA MANO DE DIOS!</T></div></Panel>},
		// 7 España
		{cam: {x: 1895, y: 600, z: 3.2}, speaker: 'ESP', mood: 'happy', endMood: 'worried', lift: ['ESP'],
			card: (t) => <Panel t={t}><T size={54} c={INK} sw={0}>FINAL DEL MUNDIAL 2026</T><div style={{display: 'flex', alignItems: 'center', gap: 20}}><Mini k="ESP" s={90} /><T size={100} c={INK} sw={0}>1-0</T><div style={{filter: t > 120 ? 'grayscale(1) opacity(0.4)' : undefined}}><Mini k="ARG" s={90} /></div></div><div style={{transform: `scale(${pop(t, 130)})`}}><T size={64} c={RED}>¿Y AHORA QUÉ RIVAL?</T></div></Panel>},
		// 8 CTA
		{cam: {x: 1300, y: 1250, z: 1.2},
			card: (t) => <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `scale(${pop(t, 6)})`}}>
				<T size={88}>SI ERES</T><T size={104} c={YEL}>SUDAMERICANO</T><T size={88}>DEJA TU BANDERA</T>
				<svg width={140} height={150} viewBox="0 0 100 110" style={{transform: `translateY(${Math.sin(t / 8) * 14}px)`}}><path d="M30 0 H70 V55 H95 L50 105 L5 55 H30 Z" fill={YEL} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></svg>
			</div>},
	],
};
export const VS1: React.FC = () => <VShort tl={TL as Timeline} def={DEF1} />;
export const VS1_TOTAL = (TL as Timeline).total;
