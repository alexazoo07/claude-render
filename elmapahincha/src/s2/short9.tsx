// Short 9 · ¿Qué pasaría si Uruguay desapareciera del fútbol?  (VRef)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, Side, Cap, Col, Laugh, YL, RD} from './VRef';
import {mkW} from './fastkit';
import {Cup} from './kit';
import {Teeth, Hand, Mate, Medal} from './kit2';
import TL from './short9.json';
const tl = TL as Timeline, W = mkW(tl);
export const DEF9: RDef = {
	k: 'URY', years: '1902-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['URUGUAY', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UN MATE!'],
	orbit: [<Cup s={80} />, <Mate s={90} f={0} />, <Medal s={70} f={0} text="1924" />, <Teeth s={80} bite={0} />],
	scenes: [
		{k: 'URY', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['ARG', 'BRA']},
		{k: 'BOL', mood: 'shock', moods: [['tres', 'worried']], props: (t) => <>
			{[240, 400].map((x, q) => <At key={x} x={x} y={1130} t={t} d={W(1, 'mundiales') - 4 + q * 7}><Cup s={180} /></At>)}
			{[680, 840].map((x, q) => <At key={x} x={x} y={1130} t={t} d={W(1, 'oros') - 4 + q * 7}><Medal s={130} f={t} text={q ? '1928' : '1924'} /></At>)}
			<Tag t={t} d={W(1, 'quince') - 2} x={540} y={600} text="15 COPAS AMÉRICA" c={YL} size={70} />
			<Tag t={t} d={W(1, 'tres') - 2} x={540} y={1270} text="CON 3,5 MILLONES" c="#fff" size={52} rot={3} />
		</>},
		{k: 'ARG', mood: 'happy', moods: [['mía', 'love'], ['perdí', 'sad']], props: (t) => <>
			<Side t={t} d={W(2, 'mía') - 4}><Cup s={190} /></Side>
			<Score t={t} d={W(2, 'cuatro') - 4} y={1180} a="URY" b="ARG" sc="4-2" label="FINAL 1930 · MONTEVIDEO" greyA />
		</>},
		{k: 'BRA', mood: 'happy', moods: [['maracanazo', 'laugh']], props: (t) => (
			<Score t={t} d={W(3, 'maracanazo') - 6} y={1180} a="BRA" b="URY" sc="1-2" label="MARACANAZO · 1950" greyB />
		)},
		{k: 'ITA', mood: 'angry', moods: [['chiellini', 'sad']], props: (t) => {
			const mw = W(4, 'mordido');
			const bite = t < mw ? 0 : 0.5 - 0.5 * Math.cos(Math.min(1, (t - mw) / 16) * Math.PI * 3);
			return <><Side t={t} d={W(4, 'suárez') - 4}><Teeth s={180} bite={bite} /></Side>
				<Score t={t} d={mw + 10} y={1180} a="ITA" b="URY" sc="0-1" label="MUNDIAL 2014" greyA /></>;
		}},
		{k: 'GHA', mood: 'angry', moods: [['semifinales', 'sad']], props: (t) => <>
			<Side t={t} d={W(5, 'mano') - 6}><Hand s={170} f={t} c="#C98F66" /></Side>
			<Score t={t} d={W(5, 'semifinales') - 4} y={1180} a="URY" b="GHA" sc="1-1" label="CUARTOS 2010 · PENALTIS" greyA />
		</>},
		{k: 'ENG', acc: 'tophat', mood: 'angry', moods: [['eliminó', 'sad']], props: (t) => (
			<Score t={t} d={W(6, 'dos') - 4} y={1180} a="URY" b="ENG" sc="2-1" label="MUNDIAL 2014 · DOBLETE DE SUÁREZ" greyA />
		)},
		{k: 'PRT', mood: 'sad', moods: [['doblete', 'angry']], props: (t) => (
			<Score t={t} d={W(7, 'cavani') - 4} y={1180} a="URY" b="PRT" sc="2-1" label="OCTAVOS 2018 · DOBLETE DE CAVANI" greyA />
		)},
		{k: 'URY', mood: 'peace'},
	],
};
export const VS9: React.FC = () => <VRef tl={tl} def={DEF9} />;
export const VS9_TOTAL = tl.total;
