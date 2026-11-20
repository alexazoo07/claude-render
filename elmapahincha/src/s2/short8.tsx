// Short 8 · ¿Qué pasaría si Inglaterra desapareciera del fútbol?  (VRef)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, Side, Cap, Col, Laugh, YL, RD} from './VRef';
import {mkW} from './fastkit';
import {Euro} from './kit';
import {Goal, RuleBook, Ball, TeaCup, Sign} from './kit2';
import TL from './short8.json';
const tl = TL as Timeline, W = mkW(tl);
export const DEF8: RDef = {
	k: 'ENG', years: '1872-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['INGLATERRA', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UNA TAZA DE TÉ!'],
	orbit: [<RuleBook s={80} f={0} />, <TeaCup s={90} f={0} />, <Goal s={80} f={0} />, <Euro s={80} />],
	scenes: [
		{k: 'ENG', acc: 'tophat', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['SCT', 'WLS']},
		{k: 'NLD', mood: 'shock', moods: [['primer', 'worried']], props: (t) => <>
			<Side t={t} d={W(1, 'reglas') - 6}><Col><RuleBook s={190} f={t} /><Cap>1863</Cap></Col></Side>
			<Score t={t} d={W(1, 'primer') - 4} y={1180} a="SCT" b="ENG" sc="0-0" label="1872 · PRIMER PARTIDO DE LA HISTORIA" />
		</>},
		{k: 'DEU', mood: 'smug', moods: [['fantasma', 'laugh']], props: (t) => <>
			<Side t={t} d={W(2, 'fantasma') - 6}><Goal s={260} f={t} line /></Side>
			<Score t={t} d={W(2, 'wembley') - 4} y={1180} a="ENG" b="DEU" sc="4-2" label="FINAL 1966 · WEMBLEY" />
		</>},
		{k: 'ARG', mood: 'shock', moods: [['maradona', 'sad'], ['siglo', 'love']], props: (t) => <>
			<Side t={t} d={W(3, 'gol') - 4}><Ball s={170} f={t} gold /></Side>
			<BigNum t={t} d={W(3, 'siglo') - 2} y={1180} size={100}>¡GOL DEL SIGLO!</BigNum>
		</>},
		{k: 'ITA', mood: 'happy', moods: [['wembley', 'cool'], ['penaltis', 'laugh']], props: (t) => <>
			<Side t={t} d={W(4, 'eurocopa') - 4}><Euro s={210} /></Side>
			<Score t={t} d={W(4, 'wembley') - 4} y={1180} a="ENG" b="ITA" sc="1-1" label="FINAL EURO 2020 · PENALTIS" greyA />
		</>},
		{k: 'ESP', mood: 'happy', moods: [['berlín', 'cool'], ['oyarzabal', 'laugh']], props: (t) => <>
			<Side t={t} d={W(5, 'veinticuatro') - 4}><Euro s={210} /></Side>
			<Score t={t} d={W(5, 'berlín') - 4} y={1180} a="ESP" b="ENG" sc="2-1" label="FINAL EURO 2024 · BERLÍN" greyB />
		</>},
		{k: 'USA', mood: 'happy', moods: [['uno', 'laugh']], props: (t) => <>
			<Score t={t} d={W(6, 'uno') - 4} y={1180} a="USA" b="ENG" sc="1-0" label="MUNDIAL 1950 · BELO HORIZONTE" greyB />
			<Tag t={t} d={W(6, 'cincuenta') - 2} x={540} y={630} text="¡BATACAZO!" c={RD} size={80} />
		</>},
		{k: 'FRA', acc: 'beret', mood: 'cool', moods: [['premier', 'shock']], props: (t) => <>
			<At x={540} y={1150} t={t} d={W(7, 'premier') - 8}><Sign text="PREMIER LEAGUE" size={66} bg="#5B2A86" c="#fff" /></At>
			<Tag t={t} d={W(7, 'league') + 2} x={540} y={1260} text="¡NO EXISTIRÍA!" c={RD} size={62} rot={4} />
		</>},
		{k: 'ENG', mood: 'peace'},
	],
};
export const VS8: React.FC = () => <VRef tl={tl} def={DEF8} />;
export const VS8_TOTAL = tl.total;
