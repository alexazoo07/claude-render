// Short 6 · ¿Qué pasaría si Francia desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn} from './VShort3';
import {Row, Euro, Cup} from './kit';
import {Goal, Stadium, Ball, Baguette, Sign} from './kit2';
import {mkW, ghostOf, hookScene, Sc, Big, wob} from './fastkit';
import TL from './short6.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('FRA');
const C0 = center('FRA');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF6: ShortDef = {
	pace: 'fast', title: [[['¿QUÉ PASARÍA SI']], [['FRANCIA', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'FRA', at: at0 + 4}], flashAt: [at0 + 4], cta: ['FRA'],
	scenes: [
		hookScene('FRA', 3.0, [['ESP', 0, 0], ['ITA', 0, 0]], 60),
		{cam: {x: C0.x, y: C0.y - 120 / 1.8, z: 1.8}, props: (t) => <>
			<Row y={560} gap={16}>{[0, 1].map((j) => <PopIn key={j} t={t} d={W(1, 'mundiales') - 6 + j * 6}><div style={{transform: `rotate(${wob(t + j * 9, 6)}deg)`}}><Cup s={150} /></div></PopIn>)}{[0, 1].map((j) => <PopIn key={'e' + j} t={t} d={W(1, 'eurocopas') - 4 + j * 6}><Euro s={160} /></PopIn>)}</Row>
			<Big t={t} d={W(1, 'cuatro')} y={830}>4 FINALES</Big>
			<Big t={t} d={W(1, 'siete')} y={970} size={70} c="#fff">EN 7 MUNDIALES</Big>
		</>},
		{focus: 'BRA', z: 1.5, spk: [{k: 'BRA', mood: 'happy', moods: [['mía', 'love'], ['tres', 'sad']]}, g(300, 'smug', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'stade') - 6}><Stadium s={280} label="STADE DE FRANCE" f={t} /></PopIn></Row>
			<Sc t={t} d={W(2, 'tres')} a="FRA" b="BRA" sc="3-0" label="FINAL 1998" y={1090} greyB />
		</>},
		{focus: 'ITA', z: 4.2, spk: [{k: 'ITA', mood: 'angry', moods: [['oro', 'sad']]}, g(300, 'cool', 'final')], props: (t) => <>
			<Sc t={t} d={W(3, 'final')} a="FRA" b="ITA" sc="2-1" label="FINAL EURO 2000" y={890} greyB />
			<Row y={1090}><PopIn t={t} d={W(3, 'oro') - 4}><div style={{display: 'flex', alignItems: 'center', gap: 16}}><Ball s={110} f={t} gold /><Sign text="GOL DE ORO" size={56} bg="#FFD23F" /></div></PopIn></Row>
		</>},
		{focus: 'PRT', z: 6, spk: [{k: 'PRT', mood: 'happy', moods: [['casa', 'cool'], ['éder', 'love']]}, g(300, 'sad', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(4, 'final')}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Euro s={160} /></div></PopIn></Row>
			<Sc t={t} d={W(4, 'casa')} a="PRT" b="FRA" sc="1-0" label="FINAL EURO 2016 · SAINT-DENIS" y={1090} greyB />
		</>},
		{focus: 'ESP', z: 3.2, spk: [{k: 'ESP', mood: 'angry', moods: [['final', 'sad']]}, g(300, 'cool', 'ganó')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(5, 'eurocopa') - 4}><Euro s={160} grey /></PopIn></Row>
			<Sc t={t} d={W(5, 'parís') - 6} a="FRA" b="ESP" sc="2-0" label="FINAL EURO 1984 · PARÍS" y={1090} greyB />
		</>},
		{focus: 'MAR', z: 3.2, spk: [{k: 'MAR', mood: 'sad', moods: [['sin', 'happy'], ['final', 'love']]}, g(300, 'smug', 'semifinal')], props: (t) => <>
			<Sc t={t} d={W(6, 'semifinal')} a="FRA" b="MAR" sc="2-0" label="SEMIFINAL 2022" y={890} greyB />
			<Big t={t} d={W(6, 'final')} y={1090} size={90}>¡A LA FINAL!</Big>
		</>},
		{focus: 'ARG', z: 1.6, spk: [{k: 'ARG', mood: 'cool', moods: [['tranquilos', 'smug'], ['penaltis', 'happy']]}, g(300, 'sad', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(7, 'penaltis') - 6}><Goal s={200} f={t} /></PopIn></Row>
			<Sc t={t} d={W(7, 'final')} a="ARG" b="FRA" sc="3-3" label="FINAL 2022 · PENALTIS" y={1090} greyB />
		</>},
		{cam: {x: C0.x, y: C0.y + 160 / 3.4, z: 3.4}, spk: [{k: 'FRA', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={940}><PopIn t={t} d={W(8, 'baguette') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><Baguette s={380} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS6: React.FC = () => <VShort3 tl={tl} def={DEF6} />;
export const VS6_TOTAL = tl.total;
