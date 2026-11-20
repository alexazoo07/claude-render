// Short 4 · ¿Qué pasaría si Italia no volviera nunca a un Mundial?  (motor v3, iconos propios kit2)
import React from 'react';
import {VShort3, ShortDef, Timeline, T, YEL, RED, PopIn, Stat, center} from './VShort3';
import {Row, Score, Euro, mkWordAt} from './kit';
import {Calendar, Stadium, Teeth, RedCard, Ticket, Cake, TV, Pizza, GoldStar, Sign, prog} from './kit2';
import {Mini} from './kit';
import {VRef, RDef, At, IconRow, Tag as RTag, Side as RSide, YL, RD, Score as RScore} from './VRef';
import TL from './short4.json';

const tl = TL as Timeline;
const wordAt = mkWordAt(tl);
const w0 = tl.lines[0].words.find((w) => w.w.toLowerCase().startsWith('nunca'))?.s ?? 120;
const BOOMS = [{k: 'ITA', at: w0 + 4}];
type M = 'sad' | 'angry' | 'shock' | 'worried' | 'smug' | 'love' | 'cool' | 'happy' | 'scared';
const ghost = (dx: number, mood: M, at?: string, moods?: [string, M][]) => ({k: 'ITA', mood, moods, ghost: true, d: 150, dx, dy: -30, talker: false, at});
const ci = center('ITA');
const sway = (t: number, a = 4, p = 40) => Math.sin(t / p) * a;

const W = mkWordAt(tl);
export const DEF4: RDef = {
	k: 'ITA', years: '1934-2014',
	title: [[['¿QUÉ PASARÍA SI']], [['ITALIA', YL]], [['NO VOLVIERA NUNCA A UN MUNDIAL?']]],
	cta: ['SI QUIERES QUE VUELVA...', '¡DEJA UNA PIZZA!'],
	orbit: [<GoldStar s={80} f={0} />, <Pizza s={90} f={0} />, <RedCard s={70} />, <Euro s={80} />],
	scenes: [
		{k: 'ITA', mood: 'cry', moods: [['nunca', 'shock']], eyes: ['FRA', 'CHE', 'AUT']},
		{k: 'DEU', mood: 'shock', moods: [['tres', 'worried']], props: (t) => {
			const tw = W(1, 'tres'), xs = [W(1, 'dieciocho'), W(1, 'veintidós'), W(1, 'veintiséis')];
			return <>
				{[0, 1, 2, 3].map((q) => <At key={q} x={330 + q * 140} y={620} t={t} d={W(1, 'cuatro') - 4 + q * 7}><GoldStar s={110} f={t} grey={t > tw + 10} /></At>)}
				{['2018', '2022', '2026'].map((y, q) => <At key={y} x={250 + q * 290} y={1170} t={t} d={tw - 4 + q * 7} rot={(q - 1) * 4}><Calendar s={200} year={y} x={prog(t, xs[q] + 4, xs[q] + 22)} /></At>)}
			</>;
		}},
		{k: 'SWE', mood: 'happy', moods: [['empezó', 'cool'], ['fuera', 'laugh']], props: (t) => {
			const dw = W(2, 'diecisiete'), sw = W(2, 'siro');
			return <>
				<RScore t={t} d={dw - 4} out={sw - 10} y={1180} a="ITA" b="SWE" sc="0-0" label="REPESCA · NOV 2017" greyA />
				<At x={540} y={1170} t={t} d={sw - 4}><Stadium s={330} on={0} label="SAN SIRO" f={t} /></At>
			</>;
		}},
		{k: 'URY', mood: 'smug', moods: [['último', 'cool'], ['mordisco', 'laugh']], props: (t) => {
			const mw = W(3, 'mordisco');
			const bite = t < mw ? 0 : 0.5 - 0.5 * Math.cos(Math.min(1, (t - mw) / 18) * Math.PI * 3);
			return <>
				<RSide t={t} d={mw - 6}><Teeth s={190} bite={bite} /></RSide>
				<RScore t={t} d={W(3, 'último') - 4} y={1180} a="ITA" b="URY" sc="0-1" label="MUNDIAL 2014 · NATAL" greyA />
			</>;
		}},
		{k: 'ENG', acc: 'tophat', mood: 'angry', moods: [['wembley', 'sad'], ['fuera', 'laugh']], props: (t) => {
			const fw = W(4, 'fuera');
			return <>
				<RSide t={t} d={W(4, 'eurocopa') - 4}><Euro s={210} /></RSide>
				<At x={540} y={1170} t={t} d={W(4, 'ocho') - 4}><Calendar s={200} year="2022" top="MARZO" x={prog(t, fw, fw + 20)} /></At>
				<RTag t={t} d={fw - 2} x={540} y={620} text="¡FUERA DEL MUNDIAL!" c={RD} size={66} />
			</>;
		}},
		{k: 'FRA', acc: 'beret', mood: 'cool', moods: [['nadie', 'happy'], ['roja', 'laugh']], props: (t) => <>
			<RSide t={t} d={W(5, 'roja') - 6}><RedCard s={170} /></RSide>
			<RScore t={t} d={W(5, 'final') - 4} y={1180} a="ITA" b="FRA" sc="1-1" label="FINAL 2006 · BERLÍN" />
		</>},
		{k: 'ESP', mood: 'happy', moods: [['casa', 'love'], ['turista', 'smug']], props: (t) => {
			const uw = W(6, 'turista');
			return <>
				<RTag t={t} d={W(6, 'treinta') - 2} x={540} y={620} text="MUNDIAL 2030" c={YL} size={72} />
				{['ESP', 'PRT', 'MAR'].map((k, q) => <At key={k} x={370 + q * 170} y={1170} t={t} d={W(6, 'casa') - 4 + q * 7} out={uw - 8}><Mini k={k} s={130} /></At>)}
				<At x={540} y={1170} t={t} d={uw - 2} rot={-6}><Ticket s={330} text="TURISTA" sub="ITALIA · 2030" /></At>
			</>;
		}},
		{k: 'ITA', mood: 'angry', moods: [['niño', 'sad']], props: (t) => <>
			<RTag t={t} d={W(7, 'doce') + 4} x={540} y={600} text="12 AÑOS SIN VERLA" c={YL} size={64} />
			<At x={330} y={1170} t={t} d={W(7, 'doce') - 6}><Cake s={210} n={12} f={t} /></At>
			<At x={750} y={1170} t={t} d={W(7, 'visto') - 6}><TV s={220} f={t} /></At>
		</>},
		{k: 'ITA', mood: 'peace'},
	],
};
export const VS4: React.FC = () => <VRef tl={tl} def={DEF4} />;
export const VS4_TOTAL = tl.total;
void RED; void T;

// miniatura del short (sin texto)
import {AbsoluteFill} from 'remotion';
import {Atlas21} from '../v21/Atlas21';
import {ALL, FL} from '../v21/data21';
import {WORLD} from '../v5/WorldLayer5';
import {Fonts} from '../fonts';
import {Ball} from './VShort3';
export const TS4I: React.FC = () => {
	const fills: Record<string, any> = {};
	for (const c of ALL) if (WORLD[c]) fills[c] = c === 'ITA' ? {color: '#4E535C'} : {flag: FL[c]};
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<Atlas21 cam={{x: ci.x, y: ci.y - 40, z: 3.4}} fills={fills} faces={{}} W={1080} H={1920} dark={0.15} cullPad={2000} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
			<div style={{position: 'absolute', left: 540 - 300, top: 640, transform: 'rotate(-4deg)'}}><Ball k="ITA" d={600} mood="sad" ghost name={false} f={10} /></div>
			<div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>{['2018', '2022', '2026'].map((y, j) => <div key={y} style={{transform: `rotate(${(j - 1) * 6}deg) translateY(${j === 1 ? -20 : 10}px)`}}><Calendar s={280} year={y} x={1} top="" /></div>)}</div>
			<div style={{position: 'absolute', top: 1360, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14}}>{[0, 1, 2, 3].map((j) => <GoldStar key={j} s={170} f={0} grey />)}</div>
			<div style={{position: 'absolute', left: 90, top: 1600, transform: 'rotate(-12deg)'}}><Pizza s={220} f={0} /></div>
			<div style={{position: 'absolute', right: 80, top: 1590, transform: 'rotate(10deg)'}}><TV s={260} f={4} text="" /></div>
		</AbsoluteFill>
	);
};

// miniaturas estilo El Mapa Animado (2 versiones)
import {TBase, Big, Hero, Side, Tag, Tomb} from './thumbs';
const tcam = {x: ci.x - 10, y: ci.y - 60, z: 3.0};
export const TS4A: React.FC = () => (
	<TBase cam={tcam} grey={['ITA']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="ITALIA?!" size={210} top={250} c="#FFD23F" />
		<Hero k="ITA" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<div style={{position: 'absolute', left: 60, top: 1430, transform: 'rotate(-8deg)'}}><Tomb s={250} name="ITALIA" years="2014-2026" /></div>
		<Side k="SWE" d={200} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="ESP" d={220} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<div style={{position: 'absolute', left: 90, top: 690}}><Tag text="¡SIN MUNDIAL!" size={64} bg="#FF4D5E" c="#fff" rot={-8} /></div>
	</TBase>
);
export const TS4B: React.FC = () => (
	<TBase cam={{...tcam, y: tcam.y + 40}} grey={['ITA']}>
		<Big text="¿3 MUNDIALES" size={140} top={90} />
		<Big text="SIN IR?!" size={220} top={240} c="#FF3B3B" />
		<div style={{position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>{['2018', '2022', '2026'].map((y, j) => <div key={y} style={{transform: `rotate(${(j - 1) * 7}deg) translateY(${j === 1 ? -14 : 8}px)`}}><Calendar s={230} year={y} x={1} /></div>)}</div>
		<Hero k="ITA" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="URY" d={200} x={150} y={1620} mood="smug" look={[0.6, -0.3]} />
		<Side k="FRA" d={210} x={930} y={1620} mood="happy" look={[-0.6, -0.3]} />
	</TBase>
);
