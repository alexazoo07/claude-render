import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, Cam, FaceState} from './MapLayer3';
import {Hincha} from '../Hincha';
import {FlagChip, Iso} from './flagimg3';
import {hi} from './flagimg3';
import {C, T, TEAMS} from './data3';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, Counter, easeInOut, easeOut, FlagBar, Footer, Panel, Pill, RoundTag, strokeText} from './ui3';
import {blinkAt, camPath, Confetti, StadiumVS, Subscribe, Trophy} from './common3';
import {aliveOf, CHAMP, LOG, STATES, territoriesOf} from './game3';
import {LastPlays, logIso, logLine, OVERVIEW} from './Round3';

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
			<Footer text="Simulación · Probabilidad: fórmula del ranking FIFA (7 oct 2026) + 25 pts por territorio conquistado" />
			<LastPlays lines={hist} p={1 - clamp01((f - 10) / 14)} />
			<div style={{position: 'absolute', right: 40, top: alive.length > 7 ? 40 : 90, transform: `translateX(${(1 - pin) * 1000 + pout * 1000}px)`}}>
				<Panel style={{width: 760}}>
					<div style={{fontFamily: LILITA, fontSize: 52, color: '#fff'}}>CLASIFICACIÓN</div>
					<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 22, color: C.yellow, marginBottom: 14}}>Quedan {alive.length} selecciones · territorios controlados</div>
					{alive.map((o, i) => {
						const terr = territoriesOf(owners, o);
						const p = clamp01((f - 60 - i * 16) / 22);
						return (
							<div key={o} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: alive.length > 7 ? 2 : 12, opacity: clamp01(p * 3), transform: `translateX(${(1 - easeOut(p)) * 120}px)`}}>
								<div style={{width: 46, fontFamily: LILITA, fontSize: 40, color: i === 0 ? C.yellow : '#fff', textAlign: 'center'}}>{i + 1}</div>
								<Hincha iso={hi(o)} mood={i === 0 ? 'grito' : 'feliz'} size={alive.length > 7 ? 56 : 74} scarf={T[o].scarf} open={0.5 + 0.5 * Math.sin(f / 4)} />
								<div style={{width: 190, fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>{T[o].name.toUpperCase()}</div>
								<div style={{display: 'flex', gap: 6, flexWrap: 'wrap', width: 300}}>
									{terr.map((c) => <FlagChip key={c} iso={c} w={40} />)}
								</div>
								<div style={{fontFamily: LILITA, fontSize: 40, color: C.yellow}}>{terr.length}</div>
							</div>
						);
					})}
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
	const center: Cam = {x: 960, y: 590, z: 0.92};
	const cam = camPath([[0, start.x, start.y, start.z], [70, center.x, center.y, center.z], [OUT0, center.x, center.y, center.z * 1.04], [OUT0 + 60, 1330, 600, 0.9], [CHAMP_DUR, 1330, 600, 0.92]], f, 99);
	const faces: Partial<Record<Iso, FaceState>> = {[ch]: {mood: 'grito', open: 0.5 + 0.5 * Math.sin(f / 4), scale: 1.5 + 0.08 * Math.sin(f / 9), look: [0, -0.3]}};
	const titleP = backOut((f - 40) / 18);
	const sumIn = easeOut((f - 330) / 22), sumOut = easeInOut((f - OUT0 + 40) / 24);
	const rows: [string, string][] = [
		['RONDAS', `${LOG.length}`],
		['REBELIONES', `${LOG.filter((e) => e.t === 'rebel').length}`],
		['EL CAMPEÓN', 'México jugó 4 duelos y los ganó todos'],
		['LA SORPRESA', `Curazao, debutante en el Mundial 2026, llegó a controlar ${Math.max(...STATES.map((o) => territoriesOf(o, 'CUW').length))} territorios`],
		['MAYOR SORPRESA', 'Honduras 2-1 Costa Rica (solo un 43 % de opciones)'],
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
							<div style={{fontFamily: LILITA, fontSize: 62, color: '#fff', ...strokeText(12)}}>CAMPEÓN DE CONCACAF</div>
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
						{['EUROPA', 'ÁFRICA', 'EL MUNDO'].map((t, i) => (
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
