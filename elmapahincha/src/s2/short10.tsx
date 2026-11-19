// Short 10 · ¿Qué pasaría si Portugal desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn} from './VShort3';
import {Row, Euro} from './kit';
import {Goal, Bubble, Nata, Medal} from './kit2';
import {mkW, ghostOf, hookScene, Fly, Sc, Big, Chip, wob} from './fastkit';
import TL from './short10.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('PRT');
const C0 = center('PRT');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF10: ShortDef = {
	pace: 'hype', title: [[['¿QUÉ PASARÍA SI']], [['PORTUGAL', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'PRT', at: at0 + 4}], flashAt: [at0 + 4], cta: ['PRT'],
	scenes: [
		hookScene('PRT', 5.5, [['ESP', -40, 0]], 40),
		{cam: {x: C0.x, y: C0.y - 120 / 5, z: 5}, props: (t) => <>
			<Fly t={t} d={W(1, 'eurocopa') + 0} x={540} y={620} from={[540, 1080]}><Euro s={180} /></Fly>
			<Row y={790} gap={24}><PopIn t={t} d={W(1, 'ligas') - 6}><Chip size={60}>LIGA DE NACIONES 2019</Chip></PopIn></Row>
			<Row y={880} gap={24}><PopIn t={t} d={W(1, 'naciones') - 2}><Chip size={60}>LIGA DE NACIONES 2025</Chip></PopIn></Row>
			<Big t={t} d={W(1, 'quién') - 2} y={1010} size={92} c="#FF5A5A">¿QUIÉN SE LAS QUEDA?</Big>
		</>},
		{focus: 'FRA', z: 2.4, spk: [{k: 'FRA', mood: 'happy', moods: [['perdí', 'sad']]}, g(300, 'smug', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'euro') - 4}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Euro s={160} /></div></PopIn></Row>
			<Sc t={t} d={W(2, 'perdí') - 4} a="PRT" b="FRA" sc="1-0" label="FINAL EURO 2016 · PARÍS" y={1090} greyA />
		</>},
		{focus: 'ESP', z: 2.6, spk: [{k: 'ESP', mood: 'angry', moods: [['penaltis', 'sad']]}, g(-300, 'smug', 'ganó')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(3, 'liga') - 4}><Medal s={140} f={t} text="2025" /></PopIn></Row>
			<Sc t={t} d={W(3, 'ganó') - 4} a="PRT" b="ESP" sc="2-2" label="FINAL LIGA DE NACIONES 2025 · PENALTIS" y={1090} greyA />
		</>},
		{focus: 'BRA', z: 1.5, spk: [{k: 'BRA', mood: 'shock', moods: [['portugués', 'panic']]}, g(-300, 'smug', 'portugal')], props: (t) => (
			<Row y={960}><PopIn t={t} d={W(4, 'hablaría') - 4}><div style={{transform: `rotate(${wob(t, 5)}deg)`}}><Bubble text="¿¡OLÁ!?" size={90} /></div></PopIn></Row>
		)},
		{focus: 'ENG', z: 4.5, spk: [{k: 'ENG', mood: 'angry', moods: [['seis', 'sad']]}, g(300, 'cool', 'penaltis')], props: (t) => <>
			<Row y={880}><PopIn t={t} d={W(5, 'penaltis') - 6}><Goal s={180} f={t} /></PopIn></Row>
			<Sc t={t} d={W(5, 'cuatro') - 4} a="PRT" b="ENG" sc="2-2" label="EURO 2004 · PENALTIS" y={1010} greyA />
			<Sc t={t} d={W(5, 'seis') - 4} a="PRT" b="ENG" sc="0-0" label="MUNDIAL 2006 · PENALTIS" y={1120} greyA />
		</>},
		{focus: 'MAR', z: 2.6, spk: [{k: 'MAR', mood: 'happy', moods: [['semifinales', 'love']]}, g(300, 'sad', 'catar')], props: (t) => <>
			<Sc t={t} d={W(6, 'catar') - 4} a="MAR" b="PRT" sc="1-0" label="CUARTOS MUNDIAL 2022" y={890} greyB />
			<Big t={t} d={W(6, 'semifinales') - 4} y={1040} size={90}>¡SEMIFINAL!</Big>
		</>},
		{focus: 'GRC', z: 3.5, spk: [{k: 'GRC', mood: 'cool', moods: [['grecia', 'love']], talker: false}, g(-300, 'sad', 'lisboa')], props: (t) => <>
			<Row y={880}><PopIn t={t} d={W(7, 'euro') - 4}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Euro s={150} /></div></PopIn></Row>
			<Sc t={t} d={W(7, 'grecia') - 6} a="PRT" b="GRC" sc="0-1" label="FINAL EURO 2004 · LISBOA" y={1090} greyB />
		</>},
		{cam: {x: C0.x, y: C0.y + 160 / 5.5, z: 5.5}, spk: [{k: 'PRT', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={940}><PopIn t={t} d={W(8, 'pastel') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><Nata s={280} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS10: React.FC = () => <VShort3 tl={tl} def={DEF10} />;
export const VS10_TOTAL = tl.total;
