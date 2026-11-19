// Short 4 · ¿Qué pasaría si Italia no volviera nunca a un Mundial?  (motor v3, iconos propios kit2)
import React from 'react';
import {VShort3, ShortDef, Timeline, T, YEL, RED, PopIn, Stat, center} from './VShort3';
import {Row, Score, Euro, mkWordAt} from './kit';
import {Calendar, Stadium, Teeth, RedCard, Ticket, Cake, TV, Pizza, GoldStar, Sign, prog} from './kit2';
import {Mini} from './kit';
import TL from './short4.json';

const tl = TL as Timeline;
const wordAt = mkWordAt(tl);
const w0 = tl.lines[0].words.find((w) => w.w.toLowerCase().startsWith('nunca'))?.s ?? 120;
const BOOMS = [{k: 'ITA', at: w0 + 4}];
type M = 'sad' | 'angry' | 'shock' | 'worried' | 'smug' | 'love' | 'cool' | 'happy' | 'scared';
const ghost = (dx: number, mood: M, at?: string, moods?: [string, M][]) => ({k: 'ITA', mood, moods, ghost: true, d: 150, dx, dy: -30, talker: false, at});
const ci = center('ITA');
const sway = (t: number, a = 4, p = 40) => Math.sin(t / p) * a;

export const DEF4: ShortDef = {
	title: [[['¿QUÉ PASARÍA SI']], [['ITALIA', YEL]], [['NO VOLVIERA NUNCA A UN MUNDIAL?']]],
	booms: BOOMS,
	flashAt: [BOOMS[0].at],
	cta: ['ITA'],
	scenes: [
		// 0 · gancho
		{cam: {x: ci.x + 10, y: ci.y + 15, z: 3.1}, spk: [
			{k: 'ITA', mood: 'smug', moods: [['tetracampeona', 'cool'], ['nunca', 'panic']], d: 280, dx: 10, dy: -40, talker: true, map: true, ghost: false},
			{k: 'FRA', mood: 'worried', moods: [['nunca', 'shock']], d: 170, dx: 40, dy: 60, talker: false, map: true},
			{k: 'DEU', mood: 'worried', moods: [['nunca', 'shock']], d: 150, dx: 0, dy: 0, talker: false, map: true},
		]},
		// 1 · narrador: 4 estrellas + 3 Mundiales sin ir
		{cam: {x: ci.x - 20, y: ci.y - 230, z: 2.3}, props: (t) => {
			const cw = wordAt(1, 'cuatro'), tw = wordAt(1, 'tres');
			const xs = [wordAt(1, 'dieciocho'), wordAt(1, 'veintidós'), wordAt(1, 'veintiséis')];
			return <>
				<Row y={560} gap={10}>{[0, 1, 2, 3].map((j) => <PopIn key={j} t={t} d={cw + j * 7}><div style={{transform: `translateY(${Math.sin((t + j * 15) / 18) * 6}px)`}}><GoldStar s={118} f={t} grey={t > tw + 10} /></div></PopIn>)}</Row>
				<Row y={830} gap={26}>{['2018', '2022', '2026'].map((y, j) => <PopIn key={y} t={t} d={tw + j * 6}><div style={{transform: `rotate(${(j - 1) * 4}deg)`}}><Calendar s={230} year={y} x={prog(t, xs[j] + 4, xs[j] + 22)} /></div></PopIn>)}</Row>
			</>;
		}},
		// 2 · Suecia: San Siro 2017
		{focus: 'SWE', z: 3.0, spk: [{k: 'SWE', dx: -80, mood: 'happy', moods: [['empezó', 'cool'], ['fuera', 'smug']]}, ghost(300, 'sad', 'diecisiete')], props: (t) => {
			const dw = wordAt(2, 'diecisiete'), sw = wordAt(2, 'siro');
			return <>
				<Row y={880}><PopIn t={t} d={sw - 14}><Stadium s={420} on={t > sw ? 1 : 0} label="SAN SIRO" f={t} /></PopIn></Row>
				<Row y={1115}><PopIn t={t} d={dw}><Score a="ITA" b="SWE" sc="0-0" s={62} label="REPESCA · NOV 2017" greyA={t > sw + 30} /></PopIn></Row>
			</>;
		}},
		// 3 · Uruguay: último partido, mordisco
		{focus: 'URY', z: 8.5, spk: [{k: 'URY', mood: 'smug', moods: [['último', 'cool'], ['mordisco', 'happy']]}, ghost(300, 'sad', 'último', [['mordisco', 'angry']])], props: (t) => {
			const uw = wordAt(3, 'último'), mw = wordAt(3, 'mordisco');
			const bite = t < mw ? 0 : 0.5 - 0.5 * Math.cos(Math.min(1, (t - mw) / 18) * Math.PI * 3);
			return <>
				<Row y={900}><PopIn t={t} d={uw}><Score a="ITA" b="URY" sc="0-1" label="MUNDIAL 2014 · NATAL" greyA={t > mw} /></PopIn></Row>
				<Row y={1050}><PopIn t={t} d={mw - 6}><div style={{transform: `rotate(${sway(t, 5, 12)}deg)`}}><Teeth s={190} bite={bite} /></div></PopIn></Row>
			</>;
		}},
		// 4 · Inglaterra: final Euro y 8 meses después fuera
		{focus: 'ENG', z: 5.0, spk: [{k: 'ENG', mood: 'angry', moods: [['wembley', 'sad'], ['ocho', 'shock']]}, ghost(300, 'happy', 'final', [['ocho', 'sad']])], props: (t) => {
			const ew = wordAt(4, 'eurocopa'), ow = wordAt(4, 'ocho'), fw = wordAt(4, 'fuera');
			return <>
				<Row y={870} gap={30}>
					<PopIn t={t} d={ew}><div style={{transform: `rotate(${sway(t, 4, 30)}deg)`}}><Euro s={210} grey={t > fw} /></div></PopIn>
					<PopIn t={t} d={ow}><Calendar s={190} year="2022" top="MARZO" x={prog(t, fw, fw + 20)} /></PopIn>
				</Row>
				<Stat t={t} d={ow + 6} y={1105} size={74} c="#fff">+8 MESES → ¡SIN MUNDIAL!</Stat>
			</>;
		}},
		// 5 · Francia: final 2006 y la roja de Zidane
		{focus: 'FRA', z: 2.9, spk: [{k: 'FRA', mood: 'cool', moods: [['nadie', 'happy'], ['roja', 'love']]}, ghost(300, 'smug', 'final', [['roja', 'shock']])], props: (t) => {
			const fw = wordAt(5, 'final'), rw = wordAt(5, 'roja');
			const flip = prog(t, rw - 4, rw + 16);
			return <>
				<Row y={900}><PopIn t={t} d={fw}><Score a="ITA" b="FRA" sc="1-1" label="FINAL 2006 · BERLÍN" /></PopIn></Row>
				<Row y={1050}><PopIn t={t} d={rw - 4}><div style={{transform: `perspective(600px) rotateY(${(1 - flip) * 180}deg) rotate(${8 + sway(t, 3, 20)}deg)`}}><RedCard s={170} /></div></PopIn></Row>
			</>;
		}},
		// 6 · España: Mundial 2030 en casa, Italia de turista
		{focus: 'ESP', z: 3.0, spk: [{k: 'ESP', mood: 'happy', moods: [['casa', 'love'], ['turista', 'smug']]}, ghost(300, 'worried', 'italia', [['turista', 'angry']])], props: (t) => {
			const tw = wordAt(6, 'treinta'), uw = wordAt(6, 'turista');
			return <>
				<Row y={880}><PopIn t={t} d={tw}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}><Sign text="MUNDIAL 2030" size={58} bg={YEL} /><div style={{display: 'flex', gap: 14}}>{['ESP', 'PRT', 'MAR'].map((k, j) => <PopIn key={k} t={t} d={tw + 8 + j * 6}><Mini k={k} s={86} /></PopIn>)}</div></div></PopIn></Row>
				<Row y={1100}><PopIn t={t} d={uw - 4}><div style={{transform: `rotate(${-6 + sway(t, 3, 24)}deg)`}}><Ticket s={330} text="TURISTA" sub="ITALIA · 2030" /></div></PopIn></Row>
			</>;
		}},
		// 7 · Italia: un niño de 12 años nunca la ha visto
		{cam: {x: ci.x + 10, y: ci.y + 60, z: 3.4}, spk: [{k: 'ITA', mood: 'angry', moods: [['niño', 'sad'], ['nunca', 'sad']], ghost: true, d: 280, dx: 0, dy: -150, talker: true, map: true}], props: (t) => {
			const dw = wordAt(7, 'doce'), vw = wordAt(7, 'visto');
			return <>
				<Row y={930} gap={34}>
					<PopIn t={t} d={dw - 6}><Cake s={220} n={12} f={t} /></PopIn>
					<PopIn t={t} d={vw - 6}><TV s={230} f={t} /></PopIn>
				</Row>
				<Stat t={t} d={dw + 4} y={1150} size={70} c={YEL}>12 AÑOS SIN VERLA</Stat>
			</>;
		}},
		// 8 · CTA
		{cam: {x: ci.x + 10, y: ci.y + 40, z: 4.2}, spk: [{k: 'ITA', mood: 'love', ghost: true, d: 280, dx: 0, dy: -180, talker: false, map: true}], props: (t) => (
			<Row y={930}><PopIn t={t} d={wordAt(8, 'pizza') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px) rotate(${sway(t, 8, 14)}deg)`}}><Pizza s={300} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS4: React.FC = () => <VShort3 tl={tl} def={DEF4} />;
export const VS4_TOTAL = tl.total;
void RED; void T;
