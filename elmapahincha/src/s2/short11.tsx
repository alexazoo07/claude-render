// Short 11 · ¿Qué pasaría si Croacia desapareciera del fútbol?  (VRef plus: más movimiento, emotes y SFX)
import React from 'react';
import {Timeline} from './VShort3';
import {VRef, RDef, RScene, At, Tag, Score, Side, Laugh, YL, RD} from './VRef';
import {Cup} from './kit';
import {GoldStar} from './kit2';
import {mkW} from './fastkit';
import {INK} from '../v21/Atlas21';
import {LILITA} from '../fonts';
import META from './short11.meta.json';
import TL from './short11.json';
const tl = TL as Timeline, W = mkW(tl);
const MED = {oro: ['#FFD23F', '#E0A800'], plata: ['#E3E8EE', '#A9B3BE'], bronce: ['#E3A06B', '#B0703F']} as const;
const MedalC: React.FC<{s: number; c: keyof typeof MED; text: string}> = ({s, c, text}) => (
	<svg width={s * 0.8} height={s} viewBox="-6 -6 92 122"><path d="M18 0 L40 48 L52 48 L30 0 Z" fill="#E8394A" stroke={INK} strokeWidth={5} /><path d="M66 0 L44 48 L32 48 L54 0 Z" fill="#fff" stroke={INK} strokeWidth={5} />
		<circle cx={42} cy={78} r={30} fill={MED[c][0]} stroke={INK} strokeWidth={6} /><circle cx={42} cy={78} r={21} fill="none" stroke={MED[c][1]} strokeWidth={4} />
		<text x={42} y={86} textAnchor="middle" fontFamily={LILITA} fontSize={20} fill={INK}>{text}</text></svg>
);
const Chess: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s} viewBox="0 0 100 100"><rect x={4} y={4} width={92} height={92} rx={10} fill="#fff" stroke={INK} strokeWidth={7} />
		{Array.from({length: 25}, (_, q) => (q % 2 === 0 ? <rect key={q} x={9 + (q % 5) * 16.4} y={9 + Math.floor(q / 5) * 16.4} width={16.4} height={16.4} fill="#E3262F" /> : null))}
		<rect x={4} y={4} width={92} height={92} rx={10} fill="none" stroke={INK} strokeWidth={7} /></svg>
);
const Pen: React.FC<{ok: boolean}> = ({ok}) => (
	<svg width={84} height={84} viewBox="0 0 100 100"><circle cx={50} cy={50} r={42} fill={ok ? '#38B26B' : '#E8394A'} stroke={INK} strokeWidth={7} />
		{ok ? <path d="M28 52 L44 68 L74 34" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M32 32 L68 68 M68 32 L32 68" stroke="#fff" strokeWidth={12} strokeLinecap="round" />}</svg>
);
const yr = (y: string) => <span style={{fontFamily: LILITA, fontSize: 38, color: '#fff', WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill'}}>{y}</span>;
const P: Record<number, RScene['props']> = {
	1: (t) => { const m = W(1, 'metió'); return <>
		{([['bronce', '1998'], ['plata', '2018'], ['bronce', '2022']] as const).map(([c, y], q) => <At key={y} x={300 + q * 240} y={1150} t={t} d={W(1, 'tres') - 4 + q * 8} out={m - 8}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><MedalC s={170} c={c} text={c === 'plata' ? '2º' : '3º'} />{yr(y)}</div></At>)}
		<Tag t={t} d={W(1, 'millones') - 4} x={540} y={620} text="¡MENOS DE 4 MILLONES!" c={YL} size={60} />
		<Score t={t} d={m - 2} y={1180} a="HRV" b="DEU" sc="3-0" label="CUARTOS 1998 · LYON" greyA />
	</>; },
	2: (t) => <>
		<Side t={t} d={W(2, 'final') - 4}><Cup s={200} /></Side>
		<Score t={t} d={W(2, 'cuatro') - 4} y={1180} a="FRA" b="HRV" sc="4-2" label="FINAL 2018 · MOSCÚ" greyB />
	</>,
	3: (t) => <>
		<Score t={t} d={W(3, 'semifinal') - 4} y={1180} a="HRV" b="ENG" sc="2-1" label="SEMIFINAL 2018 · PRÓRROGA" greyA />
		<Tag t={t} d={W(3, 'casa') - 4} x={540} y={620} text="IT'S COMING HOME" c={YL} size={64} />
		<Side t={t} d={W(3, 'casa') + 4}><Cup s={190} /></Side>
	</>,
	4: (t) => { const sx = W(4, 'sexta'); return <>
		{Array.from({length: 6}, (_, q) => <At key={q} x={240 + q * 120} y={610} t={t} d={q < 5 ? W(4, 'sin') + q * 5 : sx - 2}><div style={{opacity: q === 5 ? 0.55 + 0.45 * Math.abs(Math.sin(t / 8)) : 1}}><GoldStar s={100} f={t} grey={q === 5 && t < sx} /></div></At>)}
		<Score t={t} d={W(4, 'penaltis') - 4} y={1180} a="HRV" b="BRA" sc="1-1" label="CUARTOS 2022 · PENALTIS" greyA />
	</>; },
	5: (t) => <>
		<Score t={t} d={W(5, 'penaltis') - 4} y={1180} a="HRV" b="JPN" sc="1-1" label="OCTAVOS 2022 · PENALTIS" greyA />
		{[false, false, true, false].map((ok, q) => <At key={q} x={330 + q * 140} y={620} t={t} d={W(5, 'fallamos') - 4 + q * 9}><Pen ok={ok} /></At>)}
	</>,
	6: (t) => { const dv = W(6, 'devolví'); return <>
		<Score t={t} d={W(6, 'rusia') - 4} out={dv - 8} y={1180} a="ARG" b="HRV" sc="0-3" label="MUNDIAL 2018 · GRUPO" greyB />
		<Score t={t} d={dv - 2} y={1180} a="ARG" b="HRV" sc="3-0" label="SEMIFINAL 2022 · LUSAIL" greyB />
		{t >= dv && <Laugh t={t} d={dv} y={560} />}
	</>; },
	7: (t) => <>
		<Side t={t} d={W(7, 'tercer') - 4}><MedalC s={190} c="bronce" text="3º" /></Side>
		<Score t={t} d={W(7, 'puesto') - 4} y={1180} a="HRV" b="MAR" sc="2-1" label="TERCER PUESTO 2022" greyA />
	</>,
	8: (t) => <>
		<Side t={t} d={W(8, 'liga') - 4}><MedalC s={190} c="oro" text="NL" /></Side>
		<Score t={t} d={W(8, 'final') - 4} y={1180} a="HRV" b="ESP" sc="0-0" label="FINAL NATIONS LEAGUE 2023 · PENALTIS" greyA />
	</>,
};
export const DEF11: RDef = {
	k: 'HRV', years: '1940-2026', plus: true,
	title: [[['¿QUÉ PASARÍA SI']], [['CROACIA', YL]], [['DESAPARECIERA DEL FÚTBOL?']]],
	cta: ['SI ME VAS A ECHAR DE MENOS...', '¡DEJA UN TABLERO DE AJEDREZ!'],
	orbit: [<Cup s={80} />, <MedalC s={80} c="plata" text="2º" />, <Chess s={70} />, <GoldStar s={70} f={0} />],
	scenes: (META.scenes as unknown as RScene[]).map((s, j) => ({...s, sfx: (s as RScene).sfx, props: P[j]})),
};
export const VS11: React.FC = () => <VRef tl={tl} def={DEF11} />;
export const VS11_TOTAL = tl.total;
