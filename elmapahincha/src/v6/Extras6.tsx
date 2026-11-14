import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, Cam, FaceState} from './MapLayer6';
import {Hincha} from '../Hincha';
import {FlagChip, Iso} from './flagimg6';
import {hi} from './flagimg6';
import {C, T, TEAMS} from './data6';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, Counter, easeInOut, easeOut, FlagBar, Footer, Panel, Pill, RoundTag, strokeText} from './ui6';
import {blinkAt, camPath, Confetti, StadiumVS, Subscribe, Trophy} from './common6';
import {aliveOf, CHAMP, LOG, STATES, territoriesOf} from './game6';
import {LastPlays, logIso, logLine, OVERVIEW} from './Round6';

const ORDER = TEAMS.map((t) => t.iso);

// ---------------- Checkpoint (standings) ----------------
export const CHECK_DUR = 700;
export const checkSfx = () => {
	const s = [{f: 0, name: 'whoosh_2', vol: 0.35}, {f: 24, name: 'whoosh_4', vol: 0.4}, {f: 30, name: 'slap', vol: 0.4}];
	for (let i = 0; i < 6; i++) s.push({f: 60 + i * 16, name: 'click', vol: 0.35});
	s.push({f: CHECK_DUR - 30, name: 'whoosh_1', vol: 0.35});
	return s;
};
export const Checkpoint: React.FC<{stateIdx: number; start: Cam; round: number}> = ({stateIdx, start, round}) => {
	const f = useCurrentFrame();
	const owners = STATES[stateIdx];
	const alive = aliveOf(owners).sort((a, b) => territoriesOf(owners, b).length - territoriesOf(owners, a).length || ORDER.indexOf(a) - ORDER.indexOf(b));
	const cam = camPath([[0, start.x, start.y, start.z], [40, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z], [CHECK_DUR, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z * 1.03]], f, stateIdx + 50);
	const faces: Partial<Record<Iso, FaceState>> = {};
	alive.forEach((o, i) => (faces[o] = {mood: i === 0 ? 'grito' : 'feliz', blink: blinkAt(f, ORDER.indexOf(o)), open: 0.5 + 0.5 * Math.sin(f / 4), look: [1, 0], scale: i === 0 ? 1.12 : 1}));
	const pin = easeOut((f - 24) / 22), pout = easeInOut((f - CHECK_DUR + 30) / 24);
	const hist = LOG.slice(0, stateIdx).map((x) => [logIso(x), logLine(x)] as [Iso, string]).reverse().slice(0, 3);
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={owners} faces={faces} />
			<Counter value={alive.length} total={TEAMS.length} />
			<RoundTag n={round} />
			<FlagBar alive={Object.fromEntries(ORDER.map((i) => [i, alive.includes(i)]))} />
			<LastPlays lines={hist} p={1 - clamp01((f - 10) / 14)} />
			<div style={{position: 'absolute', right: 40, top: 40, transform: `translateX(${(1 - pin) * 1000 + pout * 1000}px)`}}>
				<Panel style={{width: 760}}>
					<div style={{fontFamily: LILITA, fontSize: 52, color: '#fff'}}>CLASIFICACIÓN</div>
					<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 22, color: C.yellow, marginBottom: 14}}>Quedan {alive.length} selecciones · los imperios más grandes</div>
					{alive.slice(0, 8).map((o, i) => {
						const terr = territoriesOf(owners, o);
						const p = clamp01((f - 60 - i * 16) / 22);
						return (
							<div key={o} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4, opacity: clamp01(p * 3), transform: `translateX(${(1 - easeOut(p)) * 120}px)`}}>
								<div style={{width: 46, fontFamily: LILITA, fontSize: 40, color: i === 0 ? C.yellow : '#fff', textAlign: 'center'}}>{i + 1}</div>
								<Hincha iso={hi(o)} mood={i === 0 ? 'grito' : 'feliz'} size={60} scarf={T[o].scarf} open={0.5 + 0.5 * Math.sin(f / 4)} />
								<div style={{width: 190, fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>{T[o].name.toUpperCase()}</div>
								<div style={{display: 'flex', gap: 6, flexWrap: 'wrap', width: 300}}>
									{terr.slice(0, 6).map((c) => <FlagChip key={c} iso={c} w={40} />)}
									{terr.length > 6 && <span style={{fontFamily: LILITA, fontSize: 26, color: '#fff'}}>+{terr.length - 6}</span>}
								</div>
								<div style={{fontFamily: LILITA, fontSize: 40, color: C.yellow}}>{terr.length}</div>
							</div>
						);
					})}
					{alive.length > 8 && <div style={{marginTop: 10, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,0.8)', opacity: clamp01((f - 200) / 14)}}>...y otras {alive.length - 8} selecciones que solo conservan su propio territorio</div>}
				</Panel>
			</div>
		</AbsoluteFill>
	);
};

// ---------------- Final intro ----------------
export const FINAL_INTRO_DUR = 300;
export const finalIntroSfx = () => [
	{f: 0, name: 'whoosh_3', vol: 0.45}, {f: 8, name: 'whoosh_1', vol: 0.4}, {f: 36, name: 'boom', vol: 0.6}, {f: 38, name: 'crowd_roar', vol: 0.5},
	{f: 56, name: 'slap', vol: 0.45}, {f: 84, name: 'whoosh_2', vol: 0.35}, {f: 90, name: 'whistle_long', vol: 0.3}, {f: 270, name: 'whoosh_4', vol: 0.5},
];
export const FinalIntro: React.FC<{a: Iso; b: Iso}> = ({a, b}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Fonts />
			<StadiumVS
				f={f}
				a={a}
				b={b}
				outStart={270}
				top={
					<span>
						<span style={{fontFamily: LILITA, fontSize: 150, color: C.yellow, ...strokeText(20), textShadow: `0 12px 0 ${C.red}`}}>LA GRAN FINAL</span>
					</span>
				}
				bottom={`${T[a].name.toUpperCase()} CONTRA ${T[b].name.toUpperCase()}: SOLO PUEDE QUEDAR UNO`}
			/>
			{f >= 284 && <AbsoluteFill style={{background: '#fff', opacity: clamp01((f - 284) / 16)}} />}
		</AbsoluteFill>
	);
};

// ---------------- Champion + outro ----------------
export const CHAMP_DUR = 1860;
const OUT0 = 1080;
export const champSfx = () => [
	{f: 0, name: 'glass', vol: 0.3}, {f: 20, name: 'boom', vol: 0.55}, {f: 22, name: 'crowd_roar', vol: 0.6}, {f: 60, name: 'confirm', vol: 0.5},
	{f: 120, name: 'crowd_roar', vol: 0.4}, {f: 330, name: 'whoosh_4', vol: 0.4}, ...[0, 1, 2, 3, 4].map((i) => ({f: 370 + i * 22, name: 'click', vol: 0.35})),
	{f: OUT0 - 20, name: 'whoosh_2', vol: 0.4}, {f: OUT0 + 10, name: 'slap', vol: 0.45}, ...[0, 1, 2].map((i) => ({f: OUT0 + 60 + i * 14, name: `pop_${i + 1}`, vol: 0.4})),
	{f: OUT0 + 300, name: 'pop_4', vol: 0.4}, {f: OUT0 + 350, name: 'click', vol: 0.5}, {f: OUT0 + 352, name: 'bong', vol: 0.35},
];
export const Champion: React.FC<{start: Cam}> = ({start}) => {
	const f = useCurrentFrame();
	const owners = STATES[STATES.length - 1];
	const ch = CHAMP;
	const center: Cam = {x: 1060, y: 640, z: 0.9};
	const cam = camPath([[0, start.x, start.y, start.z], [70, center.x, center.y, center.z], [OUT0, center.x, center.y, center.z * 1.04], [OUT0 + 60, 1500, 660, 0.85], [CHAMP_DUR, 1500, 660, 0.87]], f, 99);
	const faces: Partial<Record<Iso, FaceState>> = {[ch]: {mood: 'grito', open: 0.5 + 0.5 * Math.sin(f / 4), scale: 1.5 + 0.08 * Math.sin(f / 9), look: [0, -0.3]}};
	const titleP = backOut((f - 40) / 18);
	const sumIn = easeOut((f - 330) / 22), sumOut = easeInOut((f - OUT0 + 40) / 24);
	const wars = LOG.filter((e) => e.t === 'war') as any[];
	const champWars = wars.filter((e) => e.a === ch || e.d === ch).length;
	let cin = '', cinMax = 0;
	for (const o of STATES) for (const k of new Set(Object.values(o))) { const n = territoriesOf(o, k as Iso).length; if (T[k as Iso].rank >= 30 && n > cinMax) { cinMax = n; cin = k as string; } }
	const up = wars.map((e) => ({e, pw: e.win === e.a ? e.p : 1 - e.p})).sort((x, y) => x.pw - y.pw)[0];
	const upL = up.e.win === up.e.a ? up.e.d : up.e.a;
	const rows: [string, string][] = [
		['RONDAS', `${LOG.length}`],
		['REBELIONES', `${LOG.filter((e) => e.t === 'rebel').length}`],
		['EL CAMPEÓN', `${T[ch].name} ganó sus ${champWars} guerras`],
		['EL IMPERIO SORPRESA', `${T[cin].name} (n.º ${T[cin].rank} de Europa) llegó a controlar ${cinMax} territorios`],
		['MAYOR SORPRESA', `${T[up.e.win].name} ${Math.max(...up.e.s)}-${Math.min(...up.e.s)} ${T[upL].name} (solo un ${Math.round(up.pw * 100)} % de opciones)`],
	];
	const outP = (d: number) => backOut((f - OUT0 - d) / 14);
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={owners} faces={faces} unified />
			{f < OUT0 + 20 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${titleP * (1 - easeInOut((f - OUT0) / 20))})`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
						<Trophy size={150} />
						<div style={{textAlign: 'center'}}>
							<div style={{fontFamily: LILITA, fontSize: 120, lineHeight: 1, color: C.yellow, ...strokeText(18), textShadow: `0 10px 0 ${C.red}`}}>¡{T[ch].name.toUpperCase()}!</div>
							<div style={{fontFamily: LILITA, fontSize: 62, color: '#fff', ...strokeText(12)}}>EMPERADOR DE EUROPA</div>
						</div>
						<Trophy size={150} />
					</div>
				</div>
			)}
			{f >= 330 && f < OUT0 + 10 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - sumIn) * 700 + sumOut * 700}px)`}}>
					<Panel style={{width: 1180, padding: '20px 34px'}}>
						<div style={{fontFamily: LILITA, fontSize: 44, color: '#fff', marginBottom: 10}}>RESUMEN DEL IMPERIALISMO</div>
						{rows.map(([k, v], i) => (
							<div key={k} style={{display: 'flex', gap: 18, alignItems: 'baseline', marginTop: 8, opacity: clamp01((f - 370 - i * 22) / 12), transform: `translateX(${(1 - easeOut((f - 370 - i * 22) / 16)) * 80}px)`}}>
								<div style={{width: 260, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: C.yellow}}>{k}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#fff'}}>{v}</div>
							</div>
						))}
					</Panel>
				</div>
			)}
			{/* outro */}
			{f >= OUT0 && (
				<div style={{position: 'absolute', right: 60, top: 70, width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
					<div style={{transform: `scale(${outP(0)})`, textAlign: 'center'}}>
						<div style={{fontFamily: LILITA, fontSize: 74, lineHeight: 1.05, color: '#fff', ...strokeText(14)}}>¿QUÉ CONTINENTE</div>
						<div style={{fontFamily: LILITA, fontSize: 74, lineHeight: 1.05, color: C.yellow, ...strokeText(14)}}>QUIERES VER AHORA?</div>
					</div>
					<div style={{display: 'flex', gap: 22}}>
						{['ÁFRICA', 'ASIA', 'EL MUNDO'].map((t, i) => (
							<div key={t} style={{transform: `scale(${outP(60 + i * 14)}) rotate(${(i - 1) * 3}deg)`, padding: '18px 30px', borderRadius: 20, background: ['#2F7DE1', '#FF8A3D', C.red][i], border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', fontFamily: LILITA, fontSize: 52, color: '#fff'}}>{t}</div>
						))}
					</div>
					<div style={{transform: `scale(${outP(150)})`}}><Pill size={34} bg="#fff">¡DÍMELO EN LOS COMENTARIOS!</Pill></div>
					<div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 20}}>
						<div style={{transform: `scale(${outP(240)}) rotate(${Math.sin(f / 10) * 4}deg)`}}>
							<Hincha iso="balon" mood="feliz" size={190} scarf={['#FFD23F', '#E63946']} blink={blinkAt(f, 3)} />
						</div>
						<Subscribe f={f} start={OUT0 + 300} />
					</div>
					<div style={{transform: `scale(${outP(260)})`, fontFamily: LILITA, fontSize: 46, color: '#fff', ...strokeText(10)}}>EL MAPA HINCHA</div>
				</div>
			)}
			<Confetti f={f} start={20} n={160} />
			{f >= 0 && f < 16 && <AbsoluteFill style={{background: '#fff', opacity: 0.8 * (1 - f / 16)}} />}
			{f >= CHAMP_DUR - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((f - CHAMP_DUR + 40) / 40)}} />}
		</AbsoluteFill>
	);
};
