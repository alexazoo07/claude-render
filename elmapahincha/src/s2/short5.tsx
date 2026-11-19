// Short 5 · ¿Qué pasaría si Alemania desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn, RED} from './VShort3';
import {Row, Euro, Cup} from './kit';
import {Goal, Sausage} from './kit2';
import {mkW, ghostOf, hookScene, Fly, Sc, Big, wob} from './fastkit';
import TL from './short5.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('DEU');
const C0 = center('DEU');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF5: ShortDef = {
	pace: 'hype', title: [[['¿QUÉ PASARÍA SI']], [['ALEMANIA', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'DEU', at: at0 + 4}], flashAt: [at0 + 4], cta: ['DEU'],
	scenes: [
		hookScene('DEU', 3.4, [['FRA', 0, 0], ['NLD', 0, -10]], 40),
		{cam: {x: C0.x, y: C0.y - 120 / 1.5, z: 1.5}, props: (t) => <>
			<Fly t={t} d={W(1, 'cuatro') + 0} x={285} y={600} from={[540, 1080]}><Cup s={130} /></Fly>
			<Fly t={t} d={W(1, 'cuatro') + 4} x={455} y={600} from={[540, 1080]}><Cup s={130} /></Fly>
			<Fly t={t} d={W(1, 'cuatro') + 8} x={625} y={600} from={[540, 1080]}><Cup s={130} /></Fly>
			<Fly t={t} d={W(1, 'cuatro') + 12} x={795} y={600} from={[540, 1080]}><Cup s={130} /></Fly>
			<Fly t={t} d={W(1, 'tres') + 0} x={370} y={790} from={[540, 1080]}><Euro s={140} /></Fly>
			<Fly t={t} d={W(1, 'tres') + 4} x={540} y={790} from={[540, 1080]}><Euro s={140} /></Fly>
			<Fly t={t} d={W(1, 'tres') + 8} x={710} y={790} from={[540, 1080]}><Euro s={140} /></Fly>
			<Big t={t} d={W(1, 'quién') - 2} y={1000} size={92} c="#FF5A5A">¿QUIÉN SE LOS QUEDA?</Big>
		</>},
		{focus: 'NLD', z: 7, spk: [{k: 'NLD', mood: 'happy', moods: [['mío', 'love'], ['perdí', 'sad']]}, g(300, 'smug', 'mundial')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'mío') - 4}><div style={{transform: `rotate(${wob(t, 8)}deg)`}}><Cup s={150} /></div></PopIn></Row>
			<Sc t={t} d={W(2, 'final')} a="NLD" b="DEU" sc="1-2" label="FINAL 1974 · MÚNICH" y={1090} />
		</>},
		{focus: 'BRA', z: 1.5, spk: [{k: 'BRA', mood: 'happy', moods: [['siete', 'love']]}, g(300, 'sad', 'nadie', [['siete', 'smug']])], props: (t) => <>
			<Sc t={t} d={W(3, 'siete') - 8} a="BRA" b="DEU" sc="1-7" label="SEMIFINAL 2014" y={890} greyA />
			<Big t={t} d={W(3, 'siete') + 6} y={1090} c={RED} size={150}>¡7-1!</Big>
		</>},
		{focus: 'ARG', z: 1.6, spk: [{k: 'ARG', mood: 'angry', moods: [['finales', 'sad']]}, g(300, 'smug', 'ganó')], props: (t) => <>
			<Sc t={t} d={W(4, 'noventa')} a="ARG" b="DEU" sc="0-1" label="FINAL 1990 · ROMA" y={890} greyA />
			<Sc t={t} d={W(4, 'catorce')} a="ARG" b="DEU" sc="0-1" label="FINAL 2014 · MARACANÁ" y={1090} greyA />
		</>},
		{focus: 'ENG', z: 5, spk: [{k: 'ENG', mood: 'happy', moods: [['echó', 'angry']]}, g(300, 'cool', 'echó')], props: (t) => <>
			<Row y={880}><PopIn t={t} d={W(5, 'penaltis') - 6}><Goal s={200} f={t} /></PopIn></Row>
			<Sc t={t} d={W(5, 'noventa')} a="ENG" b="DEU" sc="1-1" label="SEMIS 1990 · PENALTIS" y={1010} greyA />
			<Sc t={t} d={W(5, 'seis')} a="ENG" b="DEU" sc="1-1" label="EURO 96 · PENALTIS" y={1120} greyA />
		</>},
		{focus: 'ITA', z: 4.2, spk: [{k: 'ITA', mood: 'happy', moods: [['siglo', 'cool'], ['cuatro', 'love']]}, g(300, 'sad', 'partido')], props: (t) => <>
			<Big t={t} d={W(6, 'partido')} y={890} size={76} c="#fff">PARTIDO DEL SIGLO</Big>
			<Sc t={t} d={W(6, 'cuatro')} a="ITA" b="DEU" sc="4-3" label="SEMIFINAL 1970 · MÉXICO" y={1090} greyB />
		</>},
		{focus: 'ESP', z: 3.2, spk: [{k: 'ESP', mood: 'cool', moods: [['torres', 'happy'], ['puyol', 'love']]}, g(300, 'worried', 'final', [['torres', 'sad']])], props: (t) => <>
			<Sc t={t} d={W(7, 'final')} a="ESP" b="DEU" sc="1-0" label="FINAL EURO 2008 · TORRES" y={890} greyB />
			<Sc t={t} d={W(7, 'semifinal')} a="ESP" b="DEU" sc="1-0" label="SEMIS 2010 · PUYOL" y={1090} greyB />
		</>},
		{cam: {x: C0.x, y: C0.y + 160 / 3.6, z: 3.6}, spk: [{k: 'DEU', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={940}><PopIn t={t} d={W(8, 'salchicha') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><Sausage s={330} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS5: React.FC = () => <VShort3 tl={tl} def={DEF5} />;
export const VS5_TOTAL = tl.total;
