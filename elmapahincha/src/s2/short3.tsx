// Short 3 · ¿Qué pasaría si Brasil desapareciera del fútbol?
import React from 'react';
import {VShort2, ShortDef, Timeline, T, YEL, RED, PopIn, Stat} from './VShort2';
import {Star, Cup, Crown, Mini, Row, Score, spin, mkWordAt} from './kit';
import TL from './short3.json';

const tl = TL as Timeline;
const wordAt = mkWordAt(tl);
const w0 = tl.lines[0].words.find((w) => w.w.toLowerCase().startsWith('desapare'))?.s ?? 120;
const BOOMS = [{k: 'BRA', at: w0 + 4}];
type M = 'sad' | 'angry' | 'shock' | 'worried' | 'smug' | 'love' | 'cool';
const ghost = (dx: number, mood: M, at?: string, moods?: [string, M][]) => ({k: 'BRA', mood, moods, ghost: true, d: 150, dx, dy: -30, talker: false, at});

export const DEF3: ShortDef = {
	title: [[['¿QUÉ PASARÍA SI']], [['BRASIL', YEL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: BOOMS,
	flashAt: [BOOMS[0].at],
	cta: ['BRA'],
	scenes: [
		// 0 · gancho
		{cam: {x: 1300, y: 1250, z: 1.75}, qmarks: true, spk: [
			{k: 'BRA', mood: 'smug', moods: [['pentacampeón', 'cool'], ['desapare', 'panic']], d: 270, dx: 30, dy: -60, talker: true, map: true},
			{k: 'ARG', mood: 'worried', moods: [['desapare', 'shock']], d: 180, dx: 20, dy: -330, talker: false, map: true},
			{k: 'URY', mood: 'worried', moods: [['desapare', 'shock']], d: 140, dx: 120, dy: -170, talker: false, map: true},
			{k: 'COL', mood: 'worried', moods: [['desapare', 'shock']], d: 160, dx: -40, dy: -30, talker: false, map: true},
		]},
		// 1 · narrador: 5 Mundiales sin campeón + el único que los jugó todos
		{cam: {x: 1700, y: 900, z: 0.95}, props: (t) => {
			const cw = wordAt(1, 'cinco'), uw = wordAt(1, 'único'), fw = wordAt(1, 'fuera');
			return <>
				<Row y={620} gap={12}>{['1958', '1962', '1970', '1994', '2002'].map((y, j) => <div key={y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}><PopIn t={t} d={cw + j * 6}><Cup s={120} grey={t > cw + 50 + j * 4} /></PopIn><PopIn t={t} d={cw + 3 + j * 6}><div style={{background: '#1B1F2A', borderRadius: 10, padding: '0 10px'}}><T size={34} sw={0} sh="transparent">{y}</T></div></PopIn></div>)}</Row>
				<Row y={900}><PopIn t={t} d={uw}><div style={{position: 'relative', background: '#fff', border: '6px solid #1B1F2A', borderRadius: 20, padding: '6px 22px', boxShadow: '0 7px 0 #1B1F2A'}}><T size={60} c="#1B1F2A" sw={0} sh="transparent">23 DE 23 MUNDIALES</T>
					{t > fw && <svg width={560} height={90} viewBox="0 0 560 90" style={{position: 'absolute', left: 0, top: 0}}><path d="M10 80 L550 10" stroke={RED} strokeWidth={14} strokeLinecap="round" /></svg>}</div></PopIn></Row>
			</>;
		}},
		// 2 · Argentina
		{focus: 'ARG', z: 1.7, spk: [{k: 'ARG', dx: -90, mood: 'happy', moods: [['alegría', 'love'], ['reyes', 'cool'], ['boludo', 'smug']]}, ghost(-300, 'angry', 'alegría')], props: (t) => {
			const rw = wordAt(2, 'reyes');
			return <div style={{position: 'absolute', top: 440, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><PopIn t={t} d={rw}><div style={{transform: `rotate(${Math.sin(t / 10) * 6}deg)`}}><Crown s={190} /></div></PopIn></div>;
		}},
		// 3 · Uruguay
		{focus: 'URY', z: 9, spk: [{k: 'URY', mood: 'shock', moods: [['victoria', 'sad']]}, ghost(300, 'smug', 'maracanazo', [['victoria', 'love']])], props: (t) => {
			const mw = wordAt(3, 'maracanazo');
			return <Row y={925}><PopIn t={t} d={mw}><Score a="URY" b="BRA" sc="2-1" label="MARACANAZO 1950" /></PopIn></Row>;
		}},
		// 4 · Alemania
		{focus: 'DEU', spk: [{k: 'DEU', mood: 'smug', moods: [['partido', 'cool'], ['siete', 'happy']]}, ghost(300, 'worried', 'favorito', [['siete', 'angry']])], props: (t) => {
			const sw = wordAt(4, 'siete');
			return <>
				<Row y={925}><PopIn t={t} d={sw - 6}><Score a="DEU" b="BRA" sc="7-1" label="SEMIFINAL 2014" /></PopIn></Row>
				<Stat t={t} d={sw + 10} y={1060} size={120} c={RED}>¡7-1!</Stat>
			</>;
		}},
		// 5 · Suecia
		{focus: 'SWE', z: 3.2, spk: [{k: 'SWE', mood: 'happy', moods: [['final', 'cool'], ['primer', 'love']]}, ghost(-300, 'sad', 'brasil')], props: (t) => {
			const fw = wordAt(5, 'final'), pw = wordAt(5, 'primer');
			return <>
				<Row y={925}><PopIn t={t} d={fw}><Score a="BRA" b="SWE" sc="5-2" label="FINAL 1958" greyA={t > pw - 20} /></PopIn></Row>
				<Row y={1075}><PopIn t={t} d={pw}><div style={{transform: `rotate(${spin(t, pw)}deg)`}}><Star s={130} /></div></PopIn></Row>
			</>;
		}},
		// 6 · Portugal
		{focus: 'PRT', z: 5.6, spk: [{k: 'PRT', mood: 'shock', moods: [['ocho', 'worried'], ['brasileñas', 'sad']]}, ghost(300, 'cool', 'ocho')], props: (t) => {
			const ow = wordAt(6, 'ocho');
			return <>
				<Row y={930} gap={6}>{Array.from({length: 10}, (_, j) => <PopIn key={j} t={t} d={ow + j * 3}><Mini k={j < 8 ? 'BRA' : 'PRT'} s={72} /></PopIn>)}</Row>
				<Stat t={t} d={ow + 40} y={1040} size={110} c={YEL}>8 DE 10</Stat>
			</>;
		}},
		// 7 · Francia
		{focus: 'FRA', spk: [{k: 'FRA', mood: 'cool', moods: [['final', 'happy'], ['ahora', 'worried']]}, ghost(300, 'sad', 'brasil')], props: (t) => {
			const fw = wordAt(7, 'final'), aw = wordAt(7, 'ahora');
			return <>
				<Row y={925}><PopIn t={t} d={fw}><Score a="FRA" b="BRA" sc="3-0" label="FINAL 1998" greyB={t > aw} /></PopIn></Row>
				<Stat t={t} d={aw} y={1060} size={84} c="#fff">¿Y AHORA CONTRA QUIÉN?</Stat>
			</>;
		}},
		// 8 · CTA
		{cam: {x: 1320, y: 1150, z: 2.0}, spk: [{k: 'BRA', mood: 'love', ghost: true, d: 280, dx: 0, dy: -60, talker: false, map: true}], props: (t) => (
			<div style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<PopIn t={t} d={30}><svg width={150} height={160} viewBox="0 0 100 110" style={{transform: `translateY(${Math.sin(t / 7) * 16}px)`}}><path d="M30 0 H70 V55 H95 L50 105 L5 55 H30 Z" fill={YEL} stroke="#1B1F2A" strokeWidth={7} strokeLinejoin="round" /></svg></PopIn>
			</div>
		)},
	],
};
export const VS3: React.FC = () => <VShort2 tl={tl} def={DEF3} />;
export const VS3_TOTAL = tl.total;
