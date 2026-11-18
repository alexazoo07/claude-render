// Short 2 · ¿Qué pasaría si España desapareciera del fútbol?
import React from 'react';
import {interpolate} from 'remotion';
import {VShort2, ShortDef, Timeline, T, YEL, RED, PopIn, Stat} from './VShort2';
import {Star, Cup, Euro, Crown, Mini, Row, Score, Stamp, spin, mkWordAt} from './kit';
import TL from './short2.json';

const tl = TL as Timeline;
const wordAt = mkWordAt(tl);
const w0 = tl.lines[0].words.find((w) => w.w.toLowerCase().startsWith('desapare'))?.s ?? 120;
const BOOMS = [{k: 'ESP', at: w0 + 4}];
const ghostESP = (dx: number, mood: 'sad' | 'angry' | 'shock' | 'worried' | 'smug', at?: string) => ({k: 'ESP', mood, ghost: true, d: 150, dx, dy: -30, talker: false, at});

export const DEF2: ShortDef = {
	title: [[['¿QUÉ PASARÍA SI']], [['ESPAÑA', YEL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: BOOMS,
	flashAt: [BOOMS[0].at],
	cta: ['ESP'],
	scenes: [
		// 0 · gancho: España habla rodeada de vecinos… y revienta
		{cam: {x: 1895, y: 548, z: 4.2}, qmarks: true, spk: [
			{k: 'ESP', mood: 'worried', moods: [['yo', 'scared'], ['desapare', 'panic']], d: 270, dx: 10, dy: -20, talker: true, map: true},
			{k: 'PRT', mood: 'worried', moods: [['desapare', 'shock']], d: 170, dx: -10, dy: -90, talker: false, map: true},
			{k: 'FRA', mood: 'worried', moods: [['desapare', 'shock']], d: 170, dx: -40, dy: 40, talker: false, map: true},
			{k: 'MAR', mood: 'worried', moods: [['desapare', 'shock']], d: 160, dx: 40, dy: -330, talker: false, map: true},
		]},
		// 1 · Portugal se queda con la península
		{focus: 'PRT', z: 5.6, spk: [{k: 'PRT', mood: 'smug', moods: [['península', 'love'], ['solito', 'cool']]}], props: (t) => {
			const pw = wordAt(1, 'península');
			return <div style={{position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><PopIn t={t} d={pw}><div style={{transform: `rotate(${Math.sin(t / 10) * 6}deg)`}}><Crown s={190} /></div></PopIn></div>;
		}},
		// 2 · narrador: 2 Mundiales y 4 Eurocopas sin campeón
		{cam: {x: 1960, y: 560, z: 1.8}, props: (t) => {
			const dw = wordAt(2, 'dos'), cw = wordAt(2, 'cuatro'), sw = wordAt(2, 'quedarían');
			const W = [['2010', 'c'], ['2026', 'c'], ['1964', 'e'], ['2008', 'e'], ['2012', 'e'], ['2024', 'e']];
			return <>
				<Row y={640} gap={14}>{W.map(([y, k], j) => { const d = (k === 'c' ? dw : cw) + (k === 'c' ? j : j - 2) * 7; const g = t > sw + j * 3; return <div key={y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}><PopIn t={t} d={d}>{k === 'c' ? <Cup s={130} grey={g} /> : <Euro s={140} grey={g} />}</PopIn><PopIn t={t} d={d + 3}><div style={{background: '#1B1F2A', borderRadius: 10, padding: '0 10px'}}><T size={36} sw={0} sh="transparent">{y}</T></div></PopIn></div>; })}</Row>
				<Stat t={t} d={sw} y={900} size={110} c="#fff">¡SIN CAMPEÓN!</Stat>
			</>;
		}},
		// 3 · Países Bajos
		{focus: 'NLD', z: 9, spk: [{k: 'NLD', mood: 'happy', moods: [['sería', 'cool'], ['primer', 'love']]}, ghostESP(300, 'sad', 'españa')], props: (t) => {
			const fw = wordAt(3, 'final'), pw = wordAt(3, 'primer');
			return <>
				<Row y={925}><PopIn t={t} d={fw}><Score a="ESP" b="NLD" sc="1-0" label="FINAL 2010" greyA={t > pw - 20} /></PopIn></Row>
				<Row y={1075}><PopIn t={t} d={pw}><div style={{transform: `rotate(${spin(t, pw)}deg)`}}><Star s={130} c="#FF8A00" /></div></PopIn></Row>
			</>;
		}},
		// 4 · Argentina
		{focus: 'ARG', z: 1.7, spk: [{k: 'ARG', mood: 'shock', moods: [['nuestra', 'smug'], ['cuatro', 'love']]}, ghostESP(-300, 'angry', 'final')], props: (t) => {
			const fw = wordAt(4, 'final'), cw = wordAt(4, 'cuatro');
			return <>
				<Row y={925}><PopIn t={t} d={fw} out={cw - 6}><Score a="ESP" b="ARG" sc="1-0" label="FINAL 2026" greyA={t > fw + 40} /></PopIn></Row>
				<Row y={950} gap={10}>{[0, 1, 2].map((j) => <PopIn key={j} t={t} d={cw + j * 4}><Star s={120} /></PopIn>)}<PopIn t={t} d={cw + 16}><div style={{transform: `rotate(${spin(t, cw + 16)}deg)`}}><Star s={160} c="#FFE680" /></div></PopIn></Row>
			</>;
		}},
		// 5 · Inglaterra
		{focus: 'ENG', z: 6.5, spk: [{k: 'ENG', mood: 'sad', moods: [['por', 'happy'], ['casa', 'love']]}, ghostESP(300, 'smug', 'euro')], props: (t) => {
			const ew = wordAt(5, 'euro'), cw = wordAt(5, 'casa');
			return <>
				<Row y={925}><PopIn t={t} d={ew}><Score a="ESP" b="ENG" sc="2-1" label="FINAL EURO 2024" greyA={t > cw - 10} /></PopIn></Row>
				<Stamp t={t} d={cw} c="#1F6FD1" y={1085} size={64}>IT'S COMING HOME</Stamp>
			</>;
		}},
		// 6 · Italia
		{focus: 'ITA', z: 4.6, spk: [{k: 'ITA', mood: 'shock', moods: [['aquel', 'sad'], ['mejor', 'angry']]}, ghostESP(-300, 'smug', 'cuatro')], props: (t) => {
			const cw = wordAt(6, 'cuatro');
			return <>
				<Row y={925}><PopIn t={t} d={cw}><Score a="ESP" b="ITA" sc="4-0" label="FINAL EURO 2012" /></PopIn></Row>
				
			</>;
		}},
		// 7 · Alemania
		{focus: 'DEU', spk: [{k: 'DEU', mood: 'happy', moods: [['rey', 'cool']]}], props: (t) => {
			const rw = wordAt(7, 'rey'), ew = wordAt(7, 'eurocopas');
			return <>
				<Row y={905} gap={8}>{[0, 1, 2, 3].map((j) => <PopIn key={j} t={t} d={(j < 3 ? 10 : ew) + j * 6}><Euro s={130} /></PopIn>)}</Row>
				<div style={{position: 'absolute', top: 440, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><PopIn t={t} d={rw}><div style={{transform: `rotate(${Math.sin(t / 10) * 6}deg)`}}><Crown s={180} /></div></PopIn></div>
				
			</>;
		}},
		// 8 · Marruecos
		{focus: 'MAR', z: 3.6, spk: [{k: 'MAR', mood: 'smug', moods: [['ahora', 'worried'], ['penaltis', 'sad']]}, ghostESP(300, 'worried', 'penaltis')], props: (t) => {
			const pw = wordAt(8, 'penaltis');
			return <>
				<Row y={925}><PopIn t={t} d={20}><Score a="MAR" b="ESP" sc="0-0" label="MUNDIAL 2022 · OCTAVOS" /></PopIn></Row>
				<Row y={1085}><PopIn t={t} d={pw}><div style={{background: '#1B1F2A', border: '6px solid #fff', borderRadius: 18, padding: '4px 22px'}}><T size={64} c={YEL}>PENALTIS 3-0</T></div></PopIn></Row>
			</>;
		}},
		// 9 · CTA
		{cam: {x: 1895, y: 548, z: 3.6}, spk: [{k: 'ESP', mood: 'love', ghost: true, d: 260, dx: 0, dy: -40, talker: false, map: true}], props: (t) => (
			<div style={{position: 'absolute', top: 920, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<PopIn t={t} d={30}><svg width={150} height={160} viewBox="0 0 100 110" style={{transform: `translateY(${Math.sin(t / 7) * 16}px)`}}><path d="M30 0 H70 V55 H95 L50 105 L5 55 H30 Z" fill={YEL} stroke="#1B1F2A" strokeWidth={7} strokeLinejoin="round" /></svg></PopIn>
			</div>
		)},
	],
};
export const VS2: React.FC = () => <VShort2 tl={tl} def={DEF2} />;
export const VS2_TOTAL = tl.total;
