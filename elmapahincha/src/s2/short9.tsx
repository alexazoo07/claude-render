// Short 9 · ¿Qué pasaría si Uruguay desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn} from './VShort3';
import {Row, Cup} from './kit';
import {Teeth, Hand, Mate, Medal} from './kit2';
import {mkW, ghostOf, hookScene, Fly, Sc, Big, wob} from './fastkit';
import TL from './short9.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('URY');
const C0 = center('URY');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF9: ShortDef = {
	pace: 'hype', title: [[['¿QUÉ PASARÍA SI']], [['URUGUAY', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'URY', at: at0 + 4}], flashAt: [at0 + 4], cta: ['URY'],
	scenes: [
		hookScene('URY', 4.5, [['ARG', 0, -40], ['BRA', -80, 40]], 30),
		{cam: {x: C0.x, y: C0.y - 120 / 2.2, z: 2.2}, props: (t) => <>
			<Fly t={t} d={W(1, 'mundiales') + 0} x={420} y={600} from={[540, 1080]}><Cup s={150} /></Fly>
			<Fly t={t} d={W(1, 'mundiales') + 4} x={660} y={600} from={[540, 1080]}><Cup s={150} /></Fly>
			<Big t={t} d={W(1, 'quince')} y={760} size={96}>15 COPAS AMÉRICA</Big>
			<Big t={t} d={W(1, 'quién') - 2} y={920} size={92} c="#FF5A5A">¿QUIÉN SE LOS QUEDA?</Big>
		</>},
		{focus: 'ARG', z: 1.6, spk: [{k: 'ARG', mood: 'happy', moods: [['mía', 'love'], ['perdí', 'sad']]}, g(300, 'smug', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'mía') - 4}><div style={{transform: `rotate(${wob(t, 7)}deg)`}}><Cup s={150} /></div></PopIn></Row>
			<Sc t={t} d={W(2, 'cuatro') - 4} a="URY" b="ARG" sc="4-2" label="FINAL 1930 · MONTEVIDEO" y={1090} greyB />
		</>},
		{focus: 'BRA', z: 1.5, spk: [{k: 'BRA', mood: 'happy', moods: [['maracanazo', 'love']]}, g(300, 'smug', 'libraría')], props: (t) => (
			<Sc t={t} d={W(3, 'maracanazo') - 6} a="BRA" b="URY" sc="1-2" label="MARACANAZO 1950" y={960} greyA />
		)},
		{focus: 'ITA', z: 4.2, spk: [{k: 'ITA', mood: 'angry', moods: [['chiellini', 'sad']]}, g(300, 'smug', 'suárez')], props: (t) => {
			const mw = W(4, 'mordido');
			const bite = t < mw ? 0 : 0.5 - 0.5 * Math.cos(Math.min(1, (t - mw) / 16) * Math.PI * 3);
			return <><Row y={890}><PopIn t={t} d={W(4, 'suárez') - 4}><Teeth s={170} bite={bite} /></PopIn></Row>
				<Sc t={t} d={mw + 10} a="ITA" b="URY" sc="0-1" label="MUNDIAL 2014" y={1090} greyA /></>;
		}},
		{focus: 'GHA', z: 4.2, spk: [{k: 'GHA', mood: 'sad', moods: [['semifinales', 'happy']], talker: false}, g(300, 'smug', 'ghana', [['mano', 'cool']])], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(5, 'mano') - 6}><Hand s={150} f={t} c="#C98F66" /></PopIn></Row>
			<Sc t={t} d={W(5, 'semifinales') - 4} a="URY" b="GHA" sc="1-1" label="CUARTOS 2010 · PENALTIS" y={1090} greyB />
		</>},
		{focus: 'ENG', z: 5, spk: [{k: 'ENG', mood: 'angry', moods: [['eliminó', 'sad']]}, g(300, 'cool', 'suárez')], props: (t) => (
			<Sc t={t} d={W(6, 'dos') - 4} a="URY" b="ENG" sc="2-1" label="MUNDIAL 2014 · DOBLETE DE SUÁREZ" y={960} greyB />
		)},
		{focus: 'PRT', z: 6, spk: [{k: 'PRT', mood: 'sad', moods: [['doblete', 'angry']]}, g(300, 'cool', 'cavani')], props: (t) => (
			<Sc t={t} d={W(7, 'cavani') - 4} a="URY" b="PRT" sc="2-1" label="OCTAVOS 2018 · DOBLETE DE CAVANI" y={960} greyB />
		)},
		{cam: {x: C0.x, y: C0.y + 160 / 4.5, z: 4.5}, spk: [{k: 'URY', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={920}><PopIn t={t} d={W(8, 'mate') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><Mate s={300} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS9: React.FC = () => <VShort3 tl={tl} def={DEF9} />;
export const VS9_TOTAL = tl.total;
