// Short 8 · ¿Qué pasaría si Inglaterra desapareciera del fútbol?  (v3 fast)
import React from 'react';
import {VShort3, ShortDef, Timeline, center, PopIn, RED} from './VShort3';
import {Row, Euro} from './kit';
import {Goal, RuleBook, Ball, TeaCup, Sign} from './kit2';
import {mkW, ghostOf, hookScene, Sc, Big, wob} from './fastkit';
import TL from './short8.json';
const tl = TL as Timeline, W = mkW(tl), g = ghostOf('ENG');
const C0 = center('ENG');
const at0 = tl.lines[0].start + W(0, 'desapare');
export const DEF8: ShortDef = {
	pace: 'fast', title: [[['¿QUÉ PASARÍA SI']], [['INGLATERRA', '#FFD23F']], [['DESAPARECIERA DEL FÚTBOL?']]],
	booms: [{k: 'ENG', at: at0 + 4}], flashAt: [at0 + 4], cta: ['ENG'],
	scenes: [
		hookScene('ENG', 4.2, [['SCT', 0, 0], ['FRA', 0, 0]], 30),
		{cam: {x: C0.x, y: C0.y - 120 / 2.4, z: 2.4}, props: (t) => <>
			<Row y={700}><PopIn t={t} d={W(1, 'reglas') - 6}><RuleBook s={230} f={t} /></PopIn></Row>
			<Sc t={t} d={W(1, 'primer')} a="SCT" b="ENG" sc="0-0" label="1872 · PRIMER PARTIDO DE LA HISTORIA" y={1020} />
		</>},
		{focus: 'DEU', z: 4.2, spk: [{k: 'DEU', mood: 'smug', moods: [['fantasma', 'cool']]}, g(300, 'angry', 'fantasma')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(2, 'fantasma') - 6}><Goal s={260} f={t} line /></PopIn></Row>
			<Sc t={t} d={W(2, 'wembley')} a="ENG" b="DEU" sc="4-2" label="FINAL 1966 · WEMBLEY" y={1090} />
		</>},
		{focus: 'ARG', z: 1.6, spk: [{k: 'ARG', mood: 'shock', moods: [['maradona', 'sad'], ['siglo', 'love']]}, g(300, 'sad', 'maradona')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(3, 'gol') - 4}><Ball s={170} f={t} gold /></PopIn></Row>
			<Big t={t} d={W(3, 'siglo')} y={1090} size={90}>¡GOL DEL SIGLO!</Big>
		</>},
		{focus: 'ITA', z: 4.2, spk: [{k: 'ITA', mood: 'happy', moods: [['wembley', 'cool'], ['penaltis', 'love']]}, g(300, 'sad', 'final')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(4, 'eurocopa') - 4}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Euro s={160} /></div></PopIn></Row>
			<Sc t={t} d={W(4, 'wembley')} a="ENG" b="ITA" sc="1-1" label="FINAL EURO 2020 · PENALTIS" y={1090} greyA />
		</>},
		{focus: 'ESP', z: 3.2, spk: [{k: 'ESP', mood: 'happy', moods: [['berlín', 'cool'], ['oyarzabal', 'love']]}, g(300, 'sad', 'veinticuatro')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(5, 'veinticuatro') - 4}><div style={{transform: `rotate(${wob(t, 6)}deg)`}}><Euro s={160} /></div></PopIn></Row>
			<Sc t={t} d={W(5, 'berlín')} a="ESP" b="ENG" sc="2-1" label="FINAL EURO 2024 · BERLÍN" y={1090} greyB />
		</>},
		{focus: 'USA', z: 1.4, spk: [{k: 'USA', mood: 'happy', moods: [['uno', 'love']]}, g(300, 'shock', 'gané')], props: (t) => <>
			<Sc t={t} d={W(6, 'uno') - 4} a="USA" b="ENG" sc="1-0" label="MUNDIAL 1950 · BELO HORIZONTE" y={890} greyB />
			<Big t={t} d={W(6, 'cincuenta')} y={1090} size={84} c={RED}>¡BATACAZO!</Big>
		</>},
		{focus: 'FRA', z: 3.2, spk: [{k: 'FRA', mood: 'cool', moods: [['premier', 'shock']]}, g(300, 'worried', 'sin')], props: (t) => <>
			<Row y={890}><PopIn t={t} d={W(7, 'premier') - 8}><Sign text="PREMIER LEAGUE" size={66} bg="#5B2A86" c="#fff" /></PopIn></Row>
			<Big t={t} d={W(7, 'league') + 2} y={1090} size={80} c={RED}>¡NO EXISTIRÍA!</Big>
		</>},
		{cam: {x: C0.x, y: C0.y + 160 / 4.2, z: 4.2}, spk: [{k: 'ENG', mood: 'love', ghost: true, d: 280, dx: 0, dy: -200, talker: false, map: true}], props: (t) => (
			<Row y={940}><PopIn t={t} d={W(8, 'taza') - 6}><div style={{transform: `translateY(${Math.sin(t / 9) * 14}px)`}}><TeaCup s={300} f={t} /></div></PopIn></Row>
		)},
	],
};
export const VS8: React.FC = () => <VShort3 tl={tl} def={DEF8} />;
export const VS8_TOTAL = tl.total;
