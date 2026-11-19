// Short 7 · ¿Qué pasaría si México desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn} from './VShort3';
import {Row, Cup, Mini} from './kit';
import {Stadium, Hand, Taco, Sign, Bars} from './kit2';
import {mkW, ghostOf, hookScene, Fly, Sc, Big, Chip, wob} from './fastkit';
import TL from './short7.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('MEX');
const C0 = center('MEX');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF7: ShortDef = {
	pace: 'hype', title: [[['¿QUÉ PASARÍA SI']], [['MÉXICO', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'MEX', at: at0 + 4}], flashAt: [at0 + 4], cta: ['MEX'],
	scenes: [
		hookScene('MEX', 1.6, [['USA', 0, 60]], 60),
		{cam: {x: C0.x, y: C0.y - 120 / 1.5, z: 1.5}, props: (t) => <>
			<Fly t={t} d={W(1, 'azteca') - 6} x={540} y={700} from={[540, 1080]}><Stadium s={380} label="ESTADIO AZTECA" f={t} /></Fly>
			<Row y={900} gap={14}>
				<PopIn t={t} d={W(1, 'finales') - 6}><Chip>FINAL 1970</Chip></PopIn>
				<PopIn t={t} d={W(1, 'finales')}><Chip>FINAL 1986</Chip></PopIn>
			</Row>
			<Big t={t} d={W(1, 'ahora') - 2} y={1040} size={100} c="#FF5A5A">¿Y AHORA QUÉ?</Big>
		</>},
		{focus: 'BRA', z: 1.5, spk: [{k: 'BRA', mood: 'happy', moods: [['azteca', 'cool'], ['pelé', 'love']]}, g(300, 'sad', 'mundial')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'mundial') - 4}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Cup s={150} /></div></PopIn></Row>
			<Sc t={t} d={W(2, 'azteca')} a="BRA" b="ITA" sc="4-1" label="FINAL 1970 · AZTECA" y={1090} />
		</>},
		{focus: 'ARG', z: 1.6, spk: [{k: 'ARG', mood: 'happy', moods: [['maradona', 'love'], ['mano', 'smug']]}, g(300, 'worried', 'ochenta')], props: (t) => <>
			<Sc t={t} d={W(3, 'ochenta')} a="ARG" b="DEU" sc="3-2" label="FINAL 1986 · AZTECA" y={890} />
			<Row y={1090}><PopIn t={t} d={W(3, 'mano') - 6}><Hand s={160} f={t} /></PopIn></Row>
		</>},
		{focus: 'ENG', z: 5, spk: [{k: 'ENG', mood: 'cool', moods: [['mano', 'smug']]}, g(300, 'shock', 'sin')], props: (t) => <>
			<Sc t={t} d={W(4, 'méxico') - 4} a="ARG" b="ENG" sc="2-1" label="CUARTOS 1986 · AZTECA" y={890} greyA />
			<Row y={1090}><PopIn t={t} d={W(4, 'mano') - 6}><div style={{position: 'relative'}}><Hand s={150} f={t} /><svg width={180} height={220} viewBox="0 0 100 120" style={{position: 'absolute', left: 0, top: 0}}><path d="M10 10 L90 110 M90 10 L10 110" stroke="#1B1F2A" strokeWidth={16} strokeLinecap="round" /><path d="M10 10 L90 110 M90 10 L10 110" stroke="#FF3B3B" strokeWidth={9} strokeLinecap="round" /></svg></div></PopIn></Row>
		</>},
		{focus: 'USA', z: 1.4, spk: [{k: 'USA', mood: 'angry', moods: [['siete', 'cool'], ['diez', 'sad']]}, g(300, 'smug', 'rival')], props: (t) => (
			<Row y={960}><PopIn t={t} d={W(5, 'copas') - 6}><Bars t={t} d={W(5, 'siete')} h={130} items={[{k: 'USA', v: 7, c: '#3F7FE0', label: 'EE. UU.'}, {k: 'MEX', v: 10, c: '#3BB273', label: 'MÉXICO'}]} /></PopIn></Row>
		)},
		{focus: 'DEU', z: 4.2, spk: [{k: 'DEU', mood: 'angry', moods: [['ganó', 'sad']]}, g(300, 'cool', 'dieciocho')], props: (t) => (
			<Sc t={t} d={W(6, 'uno') - 6} a="MEX" b="DEU" sc="1-0" label="MUNDIAL 2018 · MOSCÚ" y={960} greyB />
		)},
		{focus: 'CAN', z: 0.9, spk: [{k: 'CAN', mood: 'happy', moods: [['solo', 'cool']]}, g(300, 'sad', 'mundial')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(7, 'mundial') - 4}><Sign text="MUNDIAL 2026" size={64} bg="#FFD23F" /></PopIn></Row>
			<Row y={1090} gap={18}>{['USA', 'CAN', 'MEX'].map((k, j) => <PopIn key={k} t={t} d={W(7, 'organizado') + j * 6}><Mini k={k} s={110} grey={k === 'MEX' && t > W(7, 'solo')} /></PopIn>)}</Row>
		</>},
		{cam: {x: C0.x, y: C0.y + 160 / 2.4, z: 2.4}, spk: [{k: 'MEX', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={940}><PopIn t={t} d={W(8, 'taco') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><Taco s={320} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS7: React.FC = () => <VShort3 tl={tl} def={DEF7} />;
export const VS7_TOTAL = tl.total;
