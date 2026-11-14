import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, FaceState, labelPt, Cam} from './MapLayer3';
import {Hincha, Mood} from '../Hincha';
import {FlagChip, hi} from './flagimg3';
import {C, GEO, POP_ORDER, T, TEAMS} from './data3';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic, Pill, strokeText} from './ui3';
import {blinkAt, camPath, Key} from './common3';
import {OVERVIEW} from './Round3';

// Hook 3: "the king and the conspiracy" — extreme close-up on Mexico, pull out,
// every country turns its eyes to Mexico, breaking-news ticker, title, David vs Goliath.
const FPS = 60;
const ALL = TEAMS.map((t) => t.iso);
const MX = labelPt('MEX');

const KEYS: Key[] = [
	[0, MX[0] + 6, MX[1] + 4, 9.0],
	[110, MX[0], MX[1], 7.5],
	[190, 860, 600, 0.95],
	[420, 880, 600, 1.0],
	[470, 880, 560, 0.9],
	[700, 880, 560, 0.92],
	[930, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z],
	[960, OVERVIEW.x, OVERVIEW.y, OVERVIEW.z],
];
export const hookEndCam: Cam = OVERVIEW;

const S = (f: number, name: string, vol = 0.45) => ({f, name, vol});
export const SFX = [
	S(0, 'riser', 0.3), S(20, 'tick', 0.3), S(50, 'tick', 0.3), S(80, 'tick', 0.3), S(108, 'slap', 0.45), S(116, 'whoosh_4', 0.55),
	...ALL.filter((k) => k !== 'MEX').map((_, i) => S(200 + i * 7, `pop_${(i % 4) + 1}`, 0.3)),
	S(250, 'boom', 0.5), S(254, 'crowd_ohh', 0.4), S(300, 'error', 0.4),
	S(350, 'glitch', 0.4), S(356, 'whoosh_2', 0.4), S(360, 'confirm', 0.3),
	S(470, 'whoosh_1', 0.45), S(476, 'slap', 0.5), S(486, 'whistle_long', 0.3), S(530, 'click', 0.45),
	S(700, 'whoosh_3', 0.45), S(716, 'pop_1', 0.45), S(740, 'pop_2', 0.45), S(790, 'boom', 0.45), S(840, 'pop_3', 0.4),
	S(905, 'whoosh_4', 0.4),
];

export const Hook: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath(KEYS, f, 3);
	const owners = Object.fromEntries(ALL.map((i) => [i, i]));
	// countries appear during the pull-out
	const pop: Record<string, number> = {MEX: 1};
	ALL.filter((k) => k !== 'MEX').forEach((k, i) => (pop[k] = Math.max(0, elastic((f - 196 - i * 7) / FPS))));
	const faces: Record<string, FaceState> = {};
	ALL.forEach((k, i) => {
		const [lx, ly] = labelPt(k);
		let look: [number, number] = [0, 0];
		let mood: Mood = 'feliz';
		if (k === 'MEX') {
			mood = f < 110 ? 'feliz' : f < 250 ? 'miedo' : f < 470 ? 'miedo' : 'grito';
			look = f < 110 ? [Math.sin(f / 9), 0] : [0, -0.2];
			if (f >= 700 && f < 930) mood = 'grito';
		} else {
			const dx = MX[0] - lx, dy = MX[1] - ly, dl = Math.hypot(dx, dy) || 1;
			look = f >= 240 ? [dx / dl, dy / dl] : [0, 0];
			mood = f >= 240 && f < 470 ? 'enfado' : 'feliz';
			if (f >= 700 && f < 930) mood = k === 'BLZ' ? 'grito' : 'miedo';
		}
		faces[k] = {mood, look, blink: blinkAt(f, i), open: 0.5 + 0.5 * Math.sin(f / 4 + i), scale: k === 'MEX' ? (f < 190 ? 0.9 : 1.15) : 1};
	});
	const highlight: Record<string, number> = {};
	if (f >= 240 && f < 470) highlight.MEX = 0.6 + 0.4 * Math.sin(f / 5);
	if (f >= 700 && f < 930) { highlight.MEX = 0.8; highlight.BLZ = 0.6 + 0.4 * Math.sin(f / 4); }
	const arrows = f >= 250 && f < 470;
	const arrowP = clamp01((f - 250) / 30);
	const crownP = backOut((f - 120) / 14);
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={owners} pop={pop} faces={faces} highlight={highlight}>
				{arrows && ALL.filter((k) => k !== 'MEX').map((k, i) => {
					const [x, y] = labelPt(k);
					const mx = (x + MX[0]) / 2, my = (y + MX[1]) / 2 - 40;
					return (
						<path key={k} d={`M${x} ${y} Q${mx} ${my} ${MX[0]} ${MX[1]}`} fill="none" stroke="#E63946" strokeWidth={4 / cam.z} strokeLinecap="round" pathLength={1} strokeDasharray={`${clamp01(arrowP * 1.4 - i * 0.03)} 1`} opacity={0.85 * (1 - clamp01((f - 440) / 30))} />
					);
				})}
				{f >= 120 && f < 700 && (
					<g transform={`translate(${MX[0]} ${MX[1] - 70 / Math.max(1, cam.z * 0.6)}) scale(${(crownP * 1.2) / Math.max(1, cam.z * 0.6)})`} opacity={1 - clamp01((f - 660) / 30)}>
						<path d="M-40 10 L-46 -30 L-22 -8 L0 -40 L22 -8 L46 -30 L40 10 Z" fill="#FFD23F" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
						<circle cx={0} cy={-40} r={6} fill={C.red} stroke={C.navy} strokeWidth={3} />
					</g>
				)}
			</MapLayer>

			{/* close-up caption */}
			{f >= 20 && f < 190 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', transform: `scale(${backOut((f - 20) / 14)})`, opacity: 1 - clamp01((f - 170) / 18)}}>
					<div style={{fontFamily: LILITA, fontSize: 96, color: '#fff', ...strokeText(16)}}>MÉXICO ES EL REY</div>
					<div style={{fontFamily: LILITA, fontSize: 96, color: C.yellow, ...strokeText(16)}}>DE LA CONCACAF...</div>
				</div>
			)}
			{f >= 250 && f < 470 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', transform: `scale(${backOut((f - 256) / 14)})`, opacity: 1 - clamp01((f - 450) / 18)}}>
					<div style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14)}}>...PERO <span style={{color: '#FF6B6B'}}>16 SELECCIONES</span></div>
					<div style={{fontFamily: LILITA, fontSize: 84, color: '#fff', ...strokeText(14)}}>QUIEREN SU CORONA</div>
				</div>
			)}
			{/* breaking news ticker */}
			{f >= 350 && f < 480 && (() => {
				const p = easeOut((f - 350) / 14), out = easeInOut((f - 455) / 20);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 60, transform: `translateX(${(1 - p) * -1920 + out * 1920}px)`, display: 'flex', alignItems: 'stretch', height: 92, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
						<div style={{background: '#E1251B', padding: '0 34px', display: 'flex', alignItems: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: 3, borderTop: '5px solid #0B1E3F', borderBottom: '5px solid #0B1E3F', opacity: Math.floor(f / 15) % 2 ? 1 : 0.85}}>ÚLTIMA HORA</div>
						<div style={{flex: 1, background: '#fff', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '5px solid #0B1E3F', borderBottom: '5px solid #0B1E3F'}}>
							<div style={{whiteSpace: 'nowrap', fontFamily: LILITA, fontSize: 48, color: C.navy, transform: `translateX(${200 - (f - 350) * 6}px)`}}>
								ESTALLA EL IMPERIALISMO EN LA CONCACAF · 17 SELECCIONES · SOLO 1 QUEDARÁ EN PIE · ESTALLA EL IMPERIALISMO EN LA CONCACAF
							</div>
						</div>
					</div>
				);
			})()}
			{/* title */}
			{f >= 470 && f < 720 && (() => {
				const pin = backOut((f - 470) / 16), pout = easeInOut((f - 690) / 22);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
						<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 70px 34px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 112, lineHeight: 1.0, color: C.navy, marginTop: 6}}>IMPERIALISMO</div>
							<div style={{fontFamily: LILITA, fontSize: 112, lineHeight: 1.0, color: '#0A7A45'}}>CONCACAF</div>
							<div style={{marginTop: 18, transform: `scale(${backOut((f - 530) / 14)})`}}><Pill size={32}>¿PUEDE ALGUIEN FRENAR A MÉXICO?</Pill></div>
						</div>
					</div>
				);
			})()}
			{/* David vs Goliath */}
			{f >= 700 && f < 940 && (() => {
				const out = easeInOut((f - 905) / 24);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, opacity: 1 - out}}>
						<div style={{transform: `translateX(${(1 - backOut((f - 712) / 16)) * -700}px)`, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 26px', borderRadius: 24, background: 'rgba(11,30,63,0.94)', border: `5px solid ${C.yellow}`}}>
							<Hincha iso={hi('MEX')} mood="grito" size={170} scarf={T.MEX.scarf} open={0.5 + 0.5 * Math.sin(f / 4)} />
							<div>
								<div style={{fontFamily: LILITA, fontSize: 48, color: '#fff'}}>MÉXICO</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: C.yellow}}>N.º {T.MEX.rank} FIFA · {Math.round(T.MEX.pts)} PTS</div>
							</div>
						</div>
						<div style={{transform: `scale(${backOut((f - 790) / 12)})`, fontFamily: LILITA, fontSize: 110, color: C.yellow, ...strokeText(14), textShadow: `0 8px 0 ${C.red}`}}>VS</div>
						<div style={{transform: `translateX(${(1 - backOut((f - 736) / 16)) * 700}px)`, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 26px', borderRadius: 24, background: 'rgba(11,30,63,0.94)', border: `5px solid ${C.red}`}}>
							<div>
								<div style={{fontFamily: LILITA, fontSize: 48, color: '#fff'}}>BELICE</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#FF8A94'}}>N.º {T.BLZ.rank} FIFA · {Math.round(T.BLZ.pts)} PTS</div>
							</div>
							<Hincha iso={hi('BLZ')} mood="miedo" size={170} scarf={T.BLZ.scarf} sweat />
						</div>
					</div>
				);
			})()}
			{f >= 840 && f < 940 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 840) / 12)})`, opacity: 1 - easeInOut((f - 905) / 24)}}>
					<Pill size={32} bg="#fff">DEL N.º 10 AL N.º 180 DEL MUNDO · LAS PROBABILIDADES SALEN DEL RANKING FIFA</Pill>
				</div>
			)}
			{f < 12 && <AbsoluteFill style={{background: '#000', opacity: 1 - f / 12}} />}
		</AbsoluteFill>
	);
};
