// Short 5 · ¿Qué pasaría si Alemania desapareciera del fútbol?  (VRef)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, Side, Cap, Col, Laugh, YL, RD} from './VRef';
import {mkW} from './fastkit';
import {Cup, Euro} from './kit';
import {Goal, Sausage} from './kit2';
import TL from './short5.json';
const tl = TL as Timeline, W = mkW(tl);
export const DEF5: RDef = {
	k: 'DEU', years: '1908-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['ALEMANIA', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UNA SALCHICHA!'],
	orbit: [<Cup s={80} />, <Euro s={80} />, <Goal s={80} f={0} />, <Sausage s={90} f={0} />],
	scenes: [
		{k: 'DEU', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['FRA', 'NLD', 'POL']},
		{k: 'FRA', acc: 'beret', mood: 'shock', moods: [['ocho', 'worried']], props: (t) => <>
			<IconRow t={t} d={W(1, 'cuatro') - 4} n={4} y={1100} gap={150} icon={() => <Cup s={160} />} />
			<IconRow t={t} d={W(1, 'tres') - 4} n={3} y={1260} gap={160} step={6} icon={() => <Euro s={150} />} />
			<Tag t={t} d={W(1, 'ocho') - 2} x={540} y={640} text="¡8 FINALES!" c={YL} size={72} />
		</>},
		{k: 'NLD', mood: 'happy', moods: [['mío', 'love'], ['perdí', 'sad']], props: (t) => <>
			<Side t={t} d={W(2, 'mundial') - 4}><Cup s={190} /></Side>
			<Score t={t} d={W(2, 'final') - 4} y={1180} a="NLD" b="DEU" sc="1-2" label="FINAL 1974 · MÚNICH" />
		</>},
		{k: 'BRA', mood: 'happy', moods: [['siete', 'laugh']], props: (t) => <>
			<BigNum t={t} d={W(3, 'siete') + 4} y={640} c={RD} size={150}>¡7-1!</BigNum>
			<Score t={t} d={W(3, 'siete') - 6} y={1180} a="BRA" b="DEU" sc="1-7" label="SEMIFINAL 2014 · BELO HORIZONTE" greyA />
		</>},
		{k: 'ARG', mood: 'angry', moods: [['finales', 'sad']], props: (t) => <>
			<Score t={t} d={W(4, 'noventa') - 4} out={W(4, 'catorce') - 6} y={1180} a="ARG" b="DEU" sc="0-1" label="FINAL 1990 · ROMA" greyA />
			<Score t={t} d={W(4, 'catorce') - 2} y={1180} a="ARG" b="DEU" sc="0-1" label="FINAL 2014 · MARACANÁ" greyA />
		</>},
		{k: 'ENG', acc: 'tophat', mood: 'laugh', moods: [['echó', 'angry']], props: (t) => <>
			<Laugh t={t} d={4} y={560} />
			<Side t={t} d={W(5, 'penaltis') - 4}><Goal s={250} f={t} /></Side>
			<Score t={t} d={W(5, 'noventa') - 4} out={W(5, 'seis') - 6} y={1180} a="ENG" b="DEU" sc="1-1" label="SEMIFINAL 1990 · PENALTIS" greyA />
			<Score t={t} d={W(5, 'seis') - 2} y={1180} a="ENG" b="DEU" sc="1-1" label="SEMIFINAL EURO 96 · PENALTIS" greyA />
		</>},
		{k: 'ITA', mood: 'happy', moods: [['siglo', 'cool'], ['cuatro', 'laugh']], props: (t) => <>
			<Tag t={t} d={W(6, 'partido') - 2} x={540} y={640} text="PARTIDO DEL SIGLO" c={YL} size={64} />
			<Score t={t} d={W(6, 'cuatro') - 4} y={1180} a="ITA" b="DEU" sc="4-3" label="SEMIFINAL 1970 · MÉXICO" greyB />
		</>},
		{k: 'ESP', mood: 'cool', moods: [['torres', 'happy'], ['puyol', 'laugh']], props: (t) => <>
			<Score t={t} d={W(7, 'final') - 4} out={W(7, 'semifinal') - 6} y={1180} a="ESP" b="DEU" sc="1-0" label="FINAL EURO 2008 · GOL DE TORRES" greyB />
			<Score t={t} d={W(7, 'semifinal') - 2} y={1180} a="ESP" b="DEU" sc="1-0" label="SEMIFINAL 2010 · GOL DE PUYOL" greyB />
		</>},
		{k: 'DEU', mood: 'peace'},
	],
};
export const VS5: React.FC = () => <VRef tl={tl} def={DEF5} />;
export const VS5_TOTAL = tl.total;
