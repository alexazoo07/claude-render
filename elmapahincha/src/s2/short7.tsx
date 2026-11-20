// Short 7 · ¿Qué pasaría si México desapareciera del fútbol?  (VRef)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, Side, Cap, Col, Laugh, YL, RD} from './VRef';
import {mkW} from './fastkit';
import {Cup, Mini} from './kit';
import {Stadium, Hand, Taco, Sign, Bars} from './kit2';
import TL from './short7.json';
const tl = TL as Timeline, W = mkW(tl);
export const DEF7: RDef = {
	k: 'MEX', years: '1923-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['MÉXICO', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UN TACO!'],
	orbit: [<Cup s={80} />, <Taco s={90} f={0} />, <Hand s={80} f={0} />, <Stadium s={110} f={0} />],
	scenes: [
		{k: 'MEX', acc: 'sombrero', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['USA', 'GTM']},
		{k: 'COL', mood: 'shock', moods: [['tres', 'worried']], props: (t) => <>
			<At x={540} y={1190} t={t} d={W(1, 'azteca') - 6}><Stadium s={270} label="ESTADIO AZTECA" f={t} /></At>
			<Tag t={t} d={W(1, 'finales') - 4} x={540} y={600} text="2 FINALES + 3 INAUGURACIONES" c={YL} size={50} />
		</>},
		{k: 'BRA', mood: 'happy', moods: [['azteca', 'cool'], ['pelé', 'love']], props: (t) => <>
			<Side t={t} d={W(2, 'mundial') - 4}><Cup s={190} /></Side>
			<Score t={t} d={W(2, 'azteca') - 4} y={1180} a="BRA" b="ITA" sc="4-1" label="FINAL 1970 · AZTECA" />
		</>},
		{k: 'ARG', mood: 'happy', moods: [['maradona', 'love'], ['mano', 'smug']], props: (t) => <>
			<Side t={t} d={W(3, 'mano') - 4}><Hand s={180} f={t} /></Side>
			<Score t={t} d={W(3, 'ochenta') - 4} y={1180} a="ARG" b="DEU" sc="3-2" label="FINAL 1986 · AZTECA" />
		</>},
		{k: 'ENG', acc: 'tophat', mood: 'smug', moods: [['mano', 'cool']], props: (t) => <>
			<Side t={t} d={W(4, 'mano') - 4}><div style={{position: 'relative'}}><Hand s={170} f={t} /><svg width={170} height={200} viewBox="0 0 100 120" style={{position: 'absolute', left: 0, top: 0}}><path d="M10 10 L90 110 M90 10 L10 110" stroke="#E8392E" strokeWidth={13} strokeLinecap="round" /></svg></div></Side>
			<Score t={t} d={W(4, 'méxico') - 4} y={1180} a="ARG" b="ENG" sc="2-1" label="CUARTOS 1986 · AZTECA" greyA />
		</>},
		{k: 'USA', mood: 'angry', moods: [['siete', 'cool'], ['diez', 'sad']], props: (t) => (
			<At x={540} y={1160} t={t} d={W(5, 'copas') - 6}><div style={{transform: 'scale(1.5)'}}><Bars t={t} d={W(5, 'siete')} h={120} items={[{k: 'USA', v: 7, c: '#3F7FE0', label: 'EE. UU.'}, {k: 'MEX', v: 10, c: '#3BB273', label: 'MÉXICO'}]} /></div></At>
		)},
		{k: 'DEU', mood: 'angry', moods: [['ganó', 'sad']], props: (t) => (
			<Score t={t} d={W(6, 'uno') - 6} y={1180} a="MEX" b="DEU" sc="1-0" label="MUNDIAL 2018 · MOSCÚ" greyA />
		)},
		{k: 'CAN', mood: 'happy', moods: [['solo', 'cool']], props: (t) => <>
			<Tag t={t} d={W(7, 'mundial') - 4} x={540} y={620} text="MUNDIAL 2026" c={YL} size={70} />
			<IconRow t={t} d={W(7, 'organizado') - 4} n={3} y={1170} gap={180} icon={(q) => <Mini k={['USA', 'CAN', 'MEX'][q]} s={120} grey={q === 2 && t > W(7, 'solo')} />} />
		</>},
		{k: 'MEX', mood: 'peace'},
	],
};
export const VS7: React.FC = () => <VRef tl={tl} def={DEF7} />;
export const VS7_TOTAL = tl.total;
