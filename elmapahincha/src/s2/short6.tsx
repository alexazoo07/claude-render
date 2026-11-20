// Short 6 · ¿Qué pasaría si Francia desapareciera del fútbol?  (VRef)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, Side, Cap, Col, Laugh, YL, RD} from './VRef';
import {mkW} from './fastkit';
import {Cup, Euro} from './kit';
import {Goal, Baguette, Stadium, Ball} from './kit2';
import TL from './short6.json';
const tl = TL as Timeline, W = mkW(tl);
export const DEF6: RDef = {
	k: 'FRA', years: '1904-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['FRANCIA', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UNA BAGUETTE!'],
	orbit: [<Cup s={80} />, <Euro s={80} />, <Goal s={80} f={0} />, <Baguette s={100} f={0} />],
	scenes: [
		{k: 'FRA', acc: 'beret', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['ESP', 'ITA', 'DEU']},
		{k: 'ENG', acc: 'tophat', mood: 'shock', moods: [['cuatro', 'worried']], props: (t) => <>
			{[240, 400].map((x, q) => <At key={x} x={x} y={1150} t={t} d={W(1, 'mundiales') - 4 + q * 7}><Cup s={180} /></At>)}
			{[680, 840].map((x, q) => <At key={x} x={x} y={1150} t={t} d={W(1, 'eurocopas') - 4 + q * 7}><Euro s={190} /></At>)}
			<Tag t={t} d={W(1, 'cuatro') - 2} x={540} y={600} text="4 FINALES EN 7 MUNDIALES" c={YL} size={54} />
		</>},
		{k: 'BRA', mood: 'happy', moods: [['mía', 'love'], ['tres', 'sad']], props: (t) => <>
			<Side t={t} d={W(2, 'final') - 4}><Cup s={190} /></Side>
			<Score t={t} d={W(2, 'tres') - 4} y={1180} a="FRA" b="BRA" sc="3-0" label="FINAL 1998 · STADE DE FRANCE" greyA />
		</>},
		{k: 'ITA', mood: 'angry', moods: [['oro', 'sad']], props: (t) => <>
			<Side t={t} d={W(3, 'oro') - 4}><Col><Ball s={150} f={t} gold /><Cap>GOL DE ORO</Cap></Col></Side>
			<Score t={t} d={W(3, 'final') - 4} y={1180} a="FRA" b="ITA" sc="2-1" label="FINAL EURO 2000 · ROTTERDAM" greyA />
		</>},
		{k: 'PRT', mood: 'happy', moods: [['casa', 'cool'], ['éder', 'laugh']], props: (t) => <>
			<Side t={t} d={W(4, 'final') - 4}><Euro s={210} /></Side>
			<Score t={t} d={W(4, 'casa') - 4} y={1180} a="PRT" b="FRA" sc="1-0" label="FINAL EURO 2016 · SAINT-DENIS" greyB />
		</>},
		{k: 'ESP', mood: 'angry', moods: [['final', 'sad']], props: (t) => <>
			<Side t={t} d={W(5, 'eurocopa') - 4}><Euro s={210} /></Side>
			<Score t={t} d={W(5, 'parís') - 6} y={1180} a="FRA" b="ESP" sc="2-0" label="FINAL EURO 1984 · PARÍS" greyA />
		</>},
		{k: 'MAR', mood: 'sad', moods: [['sin', 'happy'], ['final', 'love']], props: (t) => <>
			<Score t={t} d={W(6, 'semifinal') - 4} y={1180} a="FRA" b="MAR" sc="2-0" label="SEMIFINAL 2022 · CATAR" greyA />
			<Tag t={t} d={W(6, 'final') - 2} x={540} y={630} text="¡A LA FINAL!" c={YL} size={76} />
		</>},
		{k: 'ARG', mood: 'cool', moods: [['tranquilos', 'smug'], ['penaltis', 'laugh']], props: (t) => <>
			<Side t={t} d={W(7, 'penaltis') - 4}><Goal s={250} f={t} /></Side>
			<Score t={t} d={W(7, 'final') - 4} y={1180} a="ARG" b="FRA" sc="3-3" label="FINAL 2022 · PENALTIS" greyB />
		</>},
		{k: 'FRA', mood: 'peace'},
	],
};
export const VS6: React.FC = () => <VRef tl={tl} def={DEF6} />;
export const VS6_TOTAL = tl.total;
