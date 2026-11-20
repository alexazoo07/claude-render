// Short 10 · ¿Qué pasaría si Portugal desapareciera del fútbol?  (VRef: estilo referencia)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, At, IconRow, Tag, Score, Bubble2, BigNum, YL} from './VRef';
import {Euro} from './kit';
import {LILITA} from '../fonts';
import {Goal, Nata, Medal} from './kit2';
import {mkW} from './fastkit';
import TL from './short10.json';
const tl = TL as Timeline, W = mkW(tl);
const yr = (y: string) => <span style={{fontFamily: LILITA, fontSize: 40, color: '#fff', WebkitTextStroke: '10px #1B1B22', paintOrder: 'stroke fill'}}>{y}</span>;
export const DEF10: RDef = {
	k: 'PRT', years: '1921-2026',
	title: [[['¿QUÉ PASARÍA SI']], [['PORTUGAL', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UN PASTEL DE NATA!'],
	orbit: [<Euro s={80} />, <Medal s={70} f={0} text="NL" />, <Nata s={80} f={0} />, <Goal s={80} f={0} />],
	scenes: [
		{k: 'PRT', mood: 'cry', moods: [['desapare', 'shock']], eyes: ['ESP', 'MAR']},
		{k: 'NLD', mood: 'shock', moods: [['ligas', 'worried']], props: (t) => <>
			<IconRow t={t} d={W(1, 'eurocopa') - 4} n={1} y={1170} icon={() => <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Euro s={230} />{yr('2016')}</div>} />
		</>},
		{k: 'FRA', acc: 'beret', mood: 'happy', moods: [['perdí', 'sad']], props: (t) => <>
			<At x={870} y={840} t={t} d={W(2, 'euro') - 4} rot={8}><Euro s={220} /></At>
			<Score t={t} d={W(2, 'perdí') - 4} y={1180} a="PRT" b="FRA" sc="1-0" label="FINAL EURO 2016 · PARÍS" greyA />
		</>},
		{k: 'ESP', mood: 'angry', moods: [['penaltis', 'sad']], props: (t) => <>
			<At x={870} y={840} t={t} d={W(3, 'liga') - 4} rot={8}><Medal s={210} f={t} text="NL" /></At>
			<Score t={t} d={W(3, 'ganó') - 4} y={1180} a="PRT" b="ESP" sc="2-2" label="FINAL NATIONS LEAGUE 2025 · PENALTIS" greyA />
		</>},
		{k: 'BRA', mood: 'shock', moods: [['portugués', 'worried']], props: (t) => <>
			<Bubble2 t={t} d={W(4, 'portugal') - 4} x={250} y={700} text="¡OLÁ!" />
			<Bubble2 t={t} d={W(4, 'portugal') + 6} x={840} y={660} text="¡OLÁ!" />
			<Bubble2 t={t} d={W(4, 'hablaría') - 2} x={230} y={1080} text="¿HOLA?" size={40} />
			<Bubble2 t={t} d={W(4, 'portugués') - 2} x={850} y={1060} text="¿¡OLÁ!?" size={40} />
		</>},
		{k: 'ENG', acc: 'tophat', mood: 'angry', props: (t) => <>
			<At x={300} y={1150} t={t} d={W(5, 'cuatro') - 4} rot={-6}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Goal s={250} f={t} />{yr('EURO 2004')}</div></At>
			<At x={780} y={1150} t={t} d={W(5, 'seis') - 4} rot={6}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><Goal s={250} f={t} />{yr('MUNDIAL 2006')}</div></At>
			<Tag t={t} d={W(5, 'penaltis') - 4} x={540} y={640} text="PENALTIS" size={70} />
		</>},
		{k: 'MAR', mood: 'happy', moods: [['semifinales', 'love']], props: (t) => <>
			<Tag t={t} d={W(6, 'primer') - 4} x={540} y={640} text="¡1.º AFRICANO EN SEMIS!" c={YL} size={58} />
			<Score t={t} d={W(6, 'catar') - 4} y={1180} a="MAR" b="PRT" sc="1-0" label="CUARTOS · MUNDIAL 2022" greyB />
		</>},
		{k: 'GRC', mood: 'smug', moods: [['gané', 'laugh']], props: (t) => <>
			<At x={870} y={840} t={t} d={W(7, 'euro') - 4} rot={8}><Euro s={220} /></At>
			<Score t={t} d={W(7, 'lisboa') - 4} y={1180} a="PRT" b="GRC" sc="0-1" label="FINAL EURO 2004 · LISBOA" greyA />
		</>},
		{k: 'PRT', mood: 'peace'},
	],
};
export const VS10: React.FC = () => <VRef tl={tl} def={DEF10} />;
export const VS10_TOTAL = tl.total;
