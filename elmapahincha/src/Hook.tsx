import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {MapLayer, Cam, FaceState, labelPt} from './MapLayer';
import {Hincha, Mood} from './Hincha';
import {FlagChip, Iso} from './flags';
import {C, P, POP_ORDER, T, TEAMS, winProb} from './data';
import {Fonts, LILITA, RUBIK} from './fonts';
import {backOut, clamp01, Counter, easeInOut, easeOut, elastic, FlagBar, Footer, Panel, Pill, RankRow, RoundTag, strokeText, Wheel} from './ui';

const FPS = 60;
const ALLISO = TEAMS.map((t) => t.iso);

// ---------- timeline (frames) ----------
const MAP_IN = 150;
const POP0 = 170, POPSTEP = 16;
const TITLE_IN = 360, TITLE_OUT = 576;
const SIL_IN = 600, SIL_Q = 640, SIL_OUT = 740;
const RANK_IN = 790, RANK_OUT = 990;
const HUD_IN = 1025, GO_IN = 1045, GO_OUT = 1125;
const WHEEL_IN = 1150, SPIN0 = 1172, SPIN1 = 1322, WHEEL_OUT = 1352;
const ARROW0 = 1428, ARROW1 = 1470, DERBY = 1478, VS_IN = 1500, VS_OUT = 1652;
const KICK = 1656, GOAL = 1694, SCORE = 1698, CARD = 1716, WIPE0 = 1722, WIPE1 = 1772, COUNT = 1762, LOG = 1768;

const WHEEL_TEAMS: Iso[] = ALLISO;
const WIN_IDX = WHEEL_TEAMS.indexOf('CHL');
const THETA_F = -(WIN_IDX * 36 + 18) + 360 * 6; // lands Chile under the pointer
const spinEase = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
const wheelAngle = (f: number) => (f < SPIN0 ? -6 * Math.sin((f - WHEEL_IN) / 8) * clamp01((f - WHEEL_IN) / 10) : THETA_F * spinEase((f - SPIN0) / (SPIN1 - SPIN0)));
const wheelTicks = (() => {
	const out: number[] = [];
	let prev = 0;
	for (let f = SPIN0; f <= SPIN1; f++) {
		const k = Math.floor(wheelAngle(f) / 36);
		if (k !== prev && f > SPIN0) out.push(f);
		prev = k;
	}
	// thin out ticks closer than 3 frames
	return out.filter((f, i) => i === 0 || f - out[i - 1] >= 3);
})();

// ---------- camera ----------
const FOCUS = P(-70.5, -14.5);
const KEYS: [number, number, number, number][] = [
	[MAP_IN, 960, 560, 0.74],
	[330, 960, 575, 0.9],
	[576, 960, 578, 0.92],
	[780, 962, 580, 0.93],
	[825, 1350, 585, 0.9],
	[985, 1350, 585, 0.91],
	[1030, 960, 580, 0.9],
	[1140, 960, 580, 0.92],
	[1175, 1300, 580, 0.9],
	[1345, 1300, 580, 0.91],
	[1408, FOCUS[0], FOCUS[1], 1.3],
	[1652, FOCUS[0] + 4, FOCUS[1] - 3, 1.37],
	[1700, FOCUS[0] + 8, FOCUS[1] - 5, 1.42],
	[1795, FOCUS[0] + 30, FOCUS[1] + 10, 1.2],
];
const camAt = (f: number): Cam => {
	let k = 0;
	while (k < KEYS.length - 1 && f > KEYS[k + 1][0]) k++;
	const a = KEYS[k], b = KEYS[Math.min(k + 1, KEYS.length - 1)];
	const t = b[0] === a[0] ? 1 : easeInOut((f - a[0]) / (b[0] - a[0]));
	const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * t);
	// weight pan by zoom so the target stays put while zooming
	const x = a[1] + (b[1] - a[1]) * t;
	const y = a[2] + (b[2] - a[2]) * t;
	const drift = 1 / z;
	return {x: x + Math.sin(f / 97) * 6 * drift, y: y + Math.cos(f / 83) * 4 * drift, z: z * (1 + 0.006 * Math.sin(f / 71))};
};

export const hookEndCam = camAt(1799);

const blinkAt = (f: number, seed: number) => {
	const period = 170 + (seed % 5) * 23;
	const ph = (f + seed * 37) % period;
	return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0;
};

// ---------- audio ----------
const S = (f: number, name: string, vol = 0.5) => ({f, name, vol});
export const SFX = [
	S(0, 'whoosh_3', 0.45), S(8, 'whoosh_1', 0.4), S(36, 'boom', 0.6), S(38, 'crowd_roar', 0.4), S(56, 'slap', 0.45), S(84, 'whoosh_2', 0.35),
	S(108, 'pop_1', 0.35), S(116, 'pop_2', 0.35), S(124, 'pop_3', 0.35),
	S(140, 'whoosh_4', 0.5), S(150, 'glass', 0.25),
	...POP_ORDER.map((_, i) => S(POP0 + i * POPSTEP, `pop_${(i % 4) + 1}`, 0.42)),
	S(TITLE_IN + 4, 'slap', 0.5), S(TITLE_IN + 14, 'whistle_long', 0.32), S(TITLE_IN + 52, 'click', 0.5),
	S(TITLE_OUT, 'whoosh_1', 0.4), S(SIL_IN - 2, 'drumroll', 0.45), S(SIL_Q, 'boom', 0.55), S(SIL_Q + 30, 'whoosh_3', 0.3), S(SIL_OUT, 'whoosh_2', 0.4),
	S(RANK_IN - 6, 'whoosh_4', 0.4), ...TEAMS.map((_, i) => S(RANK_IN + 14 + i * 10, 'click', 0.35)), S(RANK_IN + 130, 'confirm', 0.35), S(RANK_OUT, 'whoosh_1', 0.35),
	S(HUD_IN, 'whoosh_3', 0.35), S(HUD_IN + 14, 'drop', 0.4), S(GO_IN, 'whistle_short', 0.45), S(GO_IN + 2, 'crowd_roar', 0.35), S(GO_IN + 4, 'slap', 0.4),
	S(WHEEL_IN - 6, 'whoosh_2', 0.4), ...wheelTicks.map((f) => S(f, 'tick', 0.42)), S(SPIN1 + 2, 'confirm', 0.5), S(WHEEL_OUT, 'whoosh_4', 0.45),
	S(1410, 'whoosh_1', 0.3), S(ARROW0, 'up', 0.35), S(ARROW1, 'drop', 0.4), S(DERBY, 'slap', 0.45), S(VS_IN, 'whoosh_3', 0.4), S(VS_IN + 18, 'boom', 0.35),
	S(VS_IN + 50, 'drumroll', 0.4), S(VS_IN + 100, 'drumroll', 0.45),
	S(KICK, 'kick', 0.7), S(KICK + 4, 'whoosh_3', 0.35), S(GOAL, 'boom', 0.55), S(GOAL + 1, 'crowd_roar', 0.55), S(SCORE + 4, 'slap', 0.4),
	S(CARD, 'slap', 0.6), S(CARD + 4, 'whistle_short', 0.3), S(WIPE0, 'whoosh_2', 0.45), S(COUNT, 'confirm', 0.5), S(LOG, 'click', 0.4),
];

// ---------- scene 1: VS cold open ----------
const Stadium: React.FC<{f: number}> = ({f}) => {
	const enter = (d: number) => elastic((f - d) / FPS);
	const vs = backOut((f - 36) / 14);
	const flash = f >= 36 ? Math.max(0, 1 - (f - 36) / 14) : 0;
	const outZ = 1 + Math.pow(clamp01((f - 136) / 20), 2) * 0.5;
	const bob = (s: number) => Math.sin((f + s) / 7) * 6;
	return (
		<AbsoluteFill style={{background: C.navy, transform: `scale(${outZ})`}}>
			<div style={{position: 'absolute', inset: 0, height: 700, opacity: 0.4, backgroundImage: `radial-gradient(circle, ${C.yellow} 5px, transparent 6px), radial-gradient(circle, ${C.red} 5px, transparent 6px), radial-gradient(circle, #fff 4px, transparent 5px), radial-gradient(circle, #4FA3E3 5px, transparent 6px)`, backgroundSize: '46px 40px, 58px 44px, 38px 52px, 66px 36px', backgroundPosition: `${f * 0.3}px 0px, 20px ${12 + Math.sin(f / 9) * 3}px, 9px 26px, 31px ${5 + Math.cos(f / 8) * 3}px`}} />
			<div style={{position: 'absolute', left: -300, top: -420, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 62%)'}} />
			<div style={{position: 'absolute', left: 1120, top: -420, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 62%)'}} />
			<div style={{position: 'absolute', left: 0, top: 700, width: 1920, height: 380, background: 'repeating-linear-gradient(90deg, #1E8E4E 0px, #1E8E4E 120px, #24A05A 120px, #24A05A 240px)', borderTop: '10px solid #fff'}} />
			<div style={{position: 'absolute', left: 140 + (1 - enter(0)) * -900, top: 300 + bob(0)}}>
				<Hincha iso="ARG" mood="enfado" size={560} scarf={T.ARG.scarf} blink={blinkAt(f, 2)} look={[0.6, 0]} />
			</div>
			<div style={{position: 'absolute', left: 1220 + (1 - enter(4)) * 900, top: 300 + bob(20)}}>
				<Hincha iso="BRA" mood="grito" size={560} scarf={T.BRA.scarf} open={0.5 + 0.5 * Math.sin(f / 4)} look={[-0.6, 0]} />
			</div>
			{[['COL', 40, 860, 108, 'miedo'], ['URY', 1690, 860, 116, 'enfado'], ['CHL', 820, 900, 124, 'miedo']].map(([iso, x, y, d, m]) => {
				const p = elastic((f - (d as number)) / FPS);
				return (
					<div key={iso as string} style={{position: 'absolute', left: x as number, top: (y as number) + (1 - p) * 260}}>
						<Hincha iso={iso as Iso} mood={m as Mood} size={200} scarf={T[iso as Iso].scarf} look={[0, -0.6]} />
					</div>
				);
			})}
			{f >= 36 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', transform: `scale(${1 + (1 - vs) * 2})`, opacity: clamp01((f - 36) / 4)}}>
					<span style={{fontFamily: LILITA, fontSize: 250, color: C.yellow, ...strokeText(26), textShadow: `0 14px 0 ${C.red}`}}>VS</span>
				</div>
			)}
			{f >= 56 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', transform: `translateY(${(1 - easeOut((f - 56) / 12)) * -200}px)`}}>
					<span style={{fontFamily: LILITA, fontSize: 132, color: '#9FD0FF', ...strokeText(18)}}>ARGENTINA</span>
					<span style={{fontFamily: LILITA, fontSize: 90, color: '#fff', ...strokeText(14), margin: '0 30px'}}>o</span>
					<span style={{fontFamily: LILITA, fontSize: 132, color: C.yellow, ...strokeText(18)}}>BRASIL</span>
				</div>
			)}
			{f >= 84 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 84) / 14)})`}}>
					<Pill size={50} bg="#fff">¿QUIÉN SE QUEDA CON SUDAMÉRICA?</Pill>
				</div>
			)}
			{flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />}
		</AbsoluteFill>
	);
};

export const Hook: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camAt(f);

	// ownership: Peru falls to Chile at the end
	const owners = Object.fromEntries(ALLISO.map((i) => [i, i])) as Record<Iso, Iso>;
	const conquered = f >= WIPE1;
	if (conquered) owners.PER = 'CHL';

	// pop-in
	const pop: Partial<Record<Iso, number>> = {};
	POP_ORDER.forEach((iso, i) => (pop[iso] = Math.max(0, elastic((f - (POP0 + i * POPSTEP)) / FPS))));

	// faces
	const faces: Partial<Record<Iso, FaceState>> = {};
	const lookWheel: [number, number] = f > WHEEL_IN && f < WHEEL_OUT ? [1, 0] : [0, 0];
	for (const [i, iso] of ALLISO.entries()) {
		let mood: Mood = 'feliz';
		let scale = 1;
		let look: [number, number] = lookWheel;
		if (f >= RANK_IN + 40 && f < RANK_OUT + 20) {
			if (iso === 'ARG') { mood = 'feliz'; scale = 1.15; }
			if (iso === 'BRA') mood = 'feliz';
			if (iso === 'BOL' || iso === 'PER') mood = 'miedo';
			if (iso === 'VEN' || iso === 'CHL') mood = 'triste';
		}
		if (f >= SPIN1 && f < WHEEL_OUT + 40) {
			if (iso === 'CHL') { mood = 'grito'; scale = 1.25; }
			else if (iso === 'PER' || iso === 'BOL' || iso === 'ARG') mood = 'miedo';
		}
		if (f >= 1410) {
			if (iso === 'CHL') { mood = f < KICK ? 'enfado' : 'grito'; scale = 0.9; look = [0.2, -0.8]; }
			if (iso === 'PER') { mood = f < CARD ? 'miedo' : 'ko'; look = [-0.3, 0.6]; }
			if (iso === 'BOL') { mood = 'miedo'; look = [-1, 0]; }
			if (iso === 'ECU' || iso === 'COL') { mood = 'miedo'; look = [0, 1]; }
			if (iso === 'ARG' || iso === 'BRA') look = [-1, -0.2];
		}
		if (f >= GOAL && iso === 'CHL') scale = 0.95 + 0.15 * Math.max(0, 1 - (f - GOAL) / 30);
		if (iso === 'PER' && f >= WIPE0 + 10) {
			if (f >= WIPE0 + 30) continue;
			scale = 1 - (f - WIPE0 - 10) / 20;
		}
		faces[iso] = {mood, blink: mood === 'ko' ? 0 : blinkAt(f, i), open: 0.5 + 0.5 * Math.sin(f / 4 + i), look, scale};
	}

	// highlights
	const highlight: Partial<Record<Iso, number>> = {};
	if (f >= SPIN1 && f < 1660) highlight.CHL = 0.6 + 0.4 * Math.sin(f / 6);
	if (f >= ARROW1 && f < CARD) highlight.PER = 0.5 + 0.5 * Math.sin(f / 5);
	const dim = f >= 1410 && f < WIPE1 ? clamp01((f - 1410) / 20) * 0.6 : f >= WIPE1 ? 0.6 * (1 - clamp01((f - WIPE1) / 20)) : 0;
	if (dim > 0) { highlight.CHL = Math.max(highlight.CHL ?? 0, 0.001); highlight.PER = Math.max(highlight.PER ?? 0, 0.001); }

	const silhouette = f >= SIL_IN && f < SIL_OUT + 30 ? Math.min(clamp01((f - SIL_IN) / 30), 1 - clamp01((f - SIL_OUT) / 30)) : 0;

	const conquest = f >= WIPE0 && f < WIPE1 ? {countries: ['PER' as Iso], to: 'CHL' as Iso, p: easeInOut((f - WIPE0) / (WIPE1 - WIPE0)), from: labelPt('CHL')} : null;

	// arrow Chile -> Peru
	const A = labelPt('CHL'), B = labelPt('PER');
	const mx = (A[0] + B[0]) / 2 - 70, my = (A[1] + B[1]) / 2;
	const arrowP = clamp01((f - ARROW0) / (ARROW1 - ARROW0));
	const arrowVis = f >= ARROW0 && f < KICK;

	// ball flight
	const ballT = clamp01((f - KICK) / (GOAL - KICK));
	const bx = (1 - ballT) * (1 - ballT) * A[0] + 2 * (1 - ballT) * ballT * (mx - 20) + ballT * ballT * B[0];
	const by = (1 - ballT) * (1 - ballT) * A[1] + 2 * (1 - ballT) * ballT * (my - 90) + ballT * ballT * B[1];

	const alive = Object.fromEntries(ALLISO.map((i) => [i, !(i === 'PER' && f >= COUNT)]));
	const pChl = winProb('CHL', 'PER');

	const hudY = (d: number) => (1 - easeOut((f - d) / 16)) * -300;

	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			{f >= MAP_IN - 2 && (
				<MapLayer cam={cam} owners={owners} pop={pop} faces={faces} highlight={highlight} dim={dim} silhouette={silhouette} conquest={conquest} unified>
					{arrowVis && (
						<g>
							<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.navy} strokeWidth={14 / cam.z} strokeLinecap="round"
								pathLength={1} strokeDasharray={`${arrowP} 1`} />
							<path d={`M${A[0]} ${A[1]} Q${mx} ${my} ${B[0]} ${B[1]}`} fill="none" stroke={C.red} strokeWidth={8 / cam.z} strokeLinecap="round"
								pathLength={1} strokeDasharray={`${arrowP} 1`} />
						</g>
					)}
					{f >= KICK && f < GOAL + 6 && (
						<g transform={`translate(${bx} ${by}) rotate(${f * 18}) scale(${0.24 / Math.sqrt(cam.z)})`}>
							<g transform="translate(-100 -92)">
								<circle cx={100} cy={92} r={76} fill="#fff" stroke={C.navy} strokeWidth={8} />
								<polygon points="100,44 128,64 118,96 82,96 72,64" fill={C.navy} />
							</g>
						</g>
					)}
					{f >= SIL_Q && silhouette > 0 && (
						<g opacity={silhouette} transform={`translate(${P(-60, -16)[0]} ${P(-60, -16)[1]}) scale(${backOut((f - SIL_Q) / 16)})`}>
							<text x={0} y={70} textAnchor="middle" fontFamily="Lilita" fontSize={360} fill="#fff" stroke={C.navy} strokeWidth={10} paintOrder="stroke">?</text>
						</g>
					)}
				</MapLayer>
			)}

			{/* Title card */}
			{f >= TITLE_IN && f < TITLE_OUT + 24 && (() => {
				const pin = backOut((f - TITLE_IN) / 16);
				const pout = easeInOut((f - TITLE_OUT) / 20);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 + pout * -6}deg)`}}>
						<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 70px 34px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 112, lineHeight: 1.0, color: C.navy, marginTop: 6}}>IMPERIALISMO</div>
							<div style={{fontFamily: LILITA, fontSize: 112, lineHeight: 1.0, color: C.red}}>SUDAMERICANO</div>
							<div style={{marginTop: 18, transform: `scale(${backOut((f - TITLE_IN - 50) / 14)})`}}>
								<Pill size={32}>10 SELECCIONES · SOLO 1 QUEDA EN PIE</Pill>
							</div>
						</div>
					</div>
				);
			})()}

			{/* Teaser text */}
			{f >= SIL_Q && f < SIL_OUT + 30 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: silhouette}}>
					<div style={{transform: `scale(${backOut((f - SIL_Q - 6) / 14)})`, fontFamily: LILITA, fontSize: 76, color: '#fff', ...strokeText(14)}}>¿QUIÉN CONQUISTARÁ EL CONTINENTE?</div>
					{f >= SIL_Q + 34 && <div style={{transform: `scale(${backOut((f - SIL_Q - 34) / 12)})`}}><Pill size={30} bg={C.red} color="#fff">LA RESPUESTA, AL FINAL DEL VÍDEO</Pill></div>}
				</div>
			)}

			{/* Ranking panel */}
			{f >= RANK_IN && f < RANK_OUT + 30 && (() => {
				const pin = easeOut((f - RANK_IN) / 20);
				const pout = easeInOut((f - RANK_OUT) / 24);
				return (
					<div style={{position: 'absolute', right: 40, top: 70, transform: `translateX(${(1 - pin) * 1000 + pout * 1000}px)`}}>
						<Panel style={{width: 760}}>
							<div style={{fontFamily: LILITA, fontSize: 50, color: '#fff', lineHeight: 1.05}}>LA FUERZA DE CADA SELECCIÓN</div>
							<div style={{fontFamily: RUBIK, fontWeight: 600, fontSize: 22, color: C.yellow, marginBottom: 12, letterSpacing: 1}}>Ranking FIFA · 7 de octubre de 2026 · puntos</div>
							{TEAMS.map((t, i) => (
								<RankRow key={t.iso} iso={t.iso} p={clamp01((f - RANK_IN - 14 - i * 10) / 24)} maxPts={1972.8} minPts={1322.19} />
							))}
							<div style={{marginTop: 14, opacity: clamp01((f - RANK_IN - 130) / 10), transform: `scale(${backOut((f - RANK_IN - 130) / 14)})`, transformOrigin: 'left center'}}>
								<Pill size={24} bg={C.red} color="#fff">MÁS PUNTOS = MÁS PROBABILIDAD DE GANAR</Pill>
							</div>
						</Panel>
					</div>
				);
			})()}

			{/* HUD */}
			{f >= HUD_IN && (
				<>
					<Counter value={f >= COUNT ? 9 : 10} total={10} style={{transform: `translateY(${hudY(HUD_IN)}px)`}} flash={f >= COUNT ? Math.max(0, 1 - (f - COUNT) / 24) : 0} />
					<RoundTag n={1} style={{transform: `translateY(${hudY(HUD_IN + 8)}px)`}} />
					<div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - easeOut((f - HUD_IN - 10) / 18)) * 200}px)`}}>
						<FlagBar alive={alive} pulse={{CHL: f >= SPIN1 && f < SPIN1 + 30 ? Math.sin(((f - SPIN1) / 30) * Math.PI) : 0, PER: f >= COUNT && f < COUNT + 20 ? Math.sin(((f - COUNT) / 20) * Math.PI) : 0}} />
					</div>
					<Footer text="Simulación con datos reales · Probabilidades: fórmula del ranking FIFA (7 oct 2026)" />
				</>
			)}

			{/* GO text */}
			{f >= GO_IN && f < GO_OUT + 16 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', transform: `scale(${backOut((f - GO_IN) / 14) * (1 - easeInOut((f - GO_OUT) / 16))})`}}>
					<div style={{fontFamily: LILITA, fontSize: 64, color: '#fff', ...strokeText(12)}}>¡QUE EMPIECE EL</div>
					<div style={{fontFamily: LILITA, fontSize: 150, lineHeight: 1, color: C.yellow, ...strokeText(20), textShadow: `0 12px 0 ${C.red}`}}>IMPERIALISMO!</div>
				</div>
			)}

			{/* Wheel */}
			{f >= WHEEL_IN && f < WHEEL_OUT + 24 && (
				<div style={{position: 'absolute', left: 1180, top: 120, transform: `translateX(${(1 - backOut((f - WHEEL_IN) / 18)) * 800 + easeInOut((f - WHEEL_OUT) / 22) * 900}px)`}}>
					<Wheel teams={WHEEL_TEAMS} angle={wheelAngle(f)} size={560} title="¿QUIÉN ATACA?" result={f >= SPIN1 ? 'Chile' : null} resultIso="CHL" resultP={(f - SPIN1) / 12} />
				</div>
			)}

			{/* Target question + derby */}
			{f >= 1414 && f < VS_OUT && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: 1 - clamp01((f - VS_OUT + 12) / 12)}}>
					<div style={{transform: `scale(${backOut((f - 1414) / 14)})`, padding: '10px 34px', borderRadius: 999, background: '#fff', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 52, color: C.navy, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>
						¿A QUIÉN ATACA CHILE?
					</div>
					{f >= DERBY && <div style={{transform: `scale(${backOut((f - DERBY) / 14)})`}}><Pill size={30} bg={C.red} color="#fff">¡CLÁSICO DEL PACÍFICO!</Pill></div>}
				</div>
			)}

			{/* VS card */}
			{f >= VS_IN && f < VS_OUT + 16 && (() => {
				const pin = backOut((f - VS_IN) / 18);
				const pout = easeInOut((f - VS_OUT) / 14);
				const cnt = easeOut((f - VS_IN - 30) / 50);
				const a = Math.round(pChl * 100 * cnt), b = Math.round((1 - pChl) * 100 * cnt);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - pin) * 600 + pout * 700}px)`}}>
						<Panel style={{width: 1080, padding: '18px 36px 26px'}}>
							<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
								<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
									<Hincha iso="CHL" mood="enfado" size={170} scarf={T.CHL.scarf} look={[0.5, 0]} />
									<div>
										<div style={{fontFamily: LILITA, fontSize: 56, color: '#fff'}}>CHILE</div>
										<div style={{fontFamily: LILITA, fontSize: 84, color: C.yellow, lineHeight: 0.9}}>{a}%</div>
									</div>
								</div>
								<div style={{fontFamily: LILITA, fontSize: 110, color: C.yellow, ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>VS</div>
								<div style={{display: 'flex', alignItems: 'center', gap: 18, flexDirection: 'row-reverse'}}>
									<Hincha iso="PER" mood="miedo" size={170} scarf={T.PER.scarf} look={[-0.5, 0]} />
									<div style={{textAlign: 'right'}}>
										<div style={{fontFamily: LILITA, fontSize: 56, color: '#fff'}}>PERÚ</div>
										<div style={{fontFamily: LILITA, fontSize: 84, color: '#FF8A94', lineHeight: 0.9}}>{b}%</div>
									</div>
								</div>
							</div>
							<div style={{position: 'relative', height: 30, borderRadius: 15, overflow: 'hidden', border: `4px solid ${C.navy}`, background: '#D91023', marginTop: 8}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${50 + (pChl * 100 - 50) * cnt}%`, background: '#0039A6'}} />
							</div>
							<div style={{marginTop: 10, textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,0.8)'}}>
								Ranking FIFA: Chile n.º 50 ({T.CHL.pts.toFixed(2)} pts) · Perú n.º 53 ({T.PER.pts.toFixed(2)} pts)
							</div>
						</Panel>
					</div>
				);
			})()}

			{/* GOAL + scoreboard */}
			{f >= GOAL && f < GOAL + 40 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', transform: `scale(${backOut((f - GOAL) / 12) * (1 - easeInOut((f - GOAL - 26) / 14))})`}}>
					<span style={{fontFamily: LILITA, fontSize: 210, color: C.yellow, ...strokeText(24), textShadow: `0 14px 0 ${C.red}`}}>¡GOOOL!</span>
				</div>
			)}
			{f >= SCORE && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - easeOut((f - SCORE) / 14)) * -200}px)`}}>
					<div style={{display: 'flex', alignItems: 'center', borderRadius: 18, overflow: 'hidden', border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
							<FlagChip iso="CHL" w={56} />
							<span style={{fontFamily: LILITA, fontSize: 48, color: C.navy}}>CHI</span>
						</div>
						<div style={{background: C.navy, padding: '6px 26px', fontFamily: LILITA, fontSize: 64, color: C.yellow}}>2 - 1</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 20px'}}>
							<span style={{fontFamily: LILITA, fontSize: 48, color: C.navy}}>PER</span>
							<FlagChip iso="PER" w={56} />
						</div>
					</div>
				</div>
			)}
			{/* red card on Peru */}
			{f >= CARD && f < WIPE1 + 10 && (() => {
				const p = backOut((f - CARD) / 10);
				const z = cam.z;
				const sx = 960 + (B[0] - cam.x) * z, sy = 540 + (B[1] - cam.y) * z;
				return (
					<div style={{position: 'absolute', left: sx - 70, top: sy - 150, opacity: 1 - clamp01((f - WIPE1) / 10), transform: `scale(${p * 1.0 + (1 - p) * 3}) rotate(${12 - 6 * p}deg)`}}>
						<div style={{width: 110, height: 150, borderRadius: 12, background: '#E1251B', border: `6px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}} />
						<div style={{position: 'absolute', left: -80, top: 160, transform: 'rotate(-8deg)'}}>
							<Pill size={30} bg="#fff" color={C.red}>ELIMINADO</Pill>
						</div>
					</div>
				);
			})()}
			{/* last plays log */}
			{f >= LOG && (
				<div style={{position: 'absolute', right: 36, top: 30, transform: `translateX(${(1 - easeOut((f - LOG) / 14)) * 520}px)`}}>
					<Panel style={{width: 430, padding: '14px 20px', borderColor: '#fff'}}>
						<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.yellow, marginBottom: 6}}>ÚLTIMAS JUGADAS</div>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<FlagChip iso="CHL" w={42} />
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>Chile conquista Perú</span>
						</div>
					</Panel>
				</div>
			)}

			{f < MAP_IN + 14 && (
				<AbsoluteFill style={{opacity: 1 - clamp01((f - MAP_IN) / 12)}}>
					<Stadium f={f} />
				</AbsoluteFill>
			)}
			{f >= MAP_IN - 6 && f < MAP_IN + 14 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - MAP_IN + 6) / 20) * Math.PI)}} />}

		</AbsoluteFill>
	);
};
