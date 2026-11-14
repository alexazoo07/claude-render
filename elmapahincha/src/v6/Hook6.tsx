import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MapLayer, FaceState, labelPt, Cam} from './MapLayer6';
import {FlagChip, Iso} from './flagimg6';
import {C, T, TEAMS} from './data6';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic, Panel, Pill, strokeText} from './ui6';
import {blinkAt, camPath} from './common6';
import odds from './odds6.json';

export const HOOK_DUR = 1080;
const ODDS = odds as Record<string, number>;
const FAV = Object.entries(ODDS).slice(0, 6) as [Iso, number][];
const NEVER = TEAMS.filter((t) => !ODDS[t.iso]).map((t) => t.iso);
const ALL = TEAMS.map((t) => t.iso);
const OWN = Object.fromEntries(ALL.map((i) => [i, i]));
const VIEW: Cam = {x: 1060, y: 640, z: 0.88};
export const hookEndCam: Cam = {x: 1330, y: 640, z: 0.88};
// pop order: wave from Spain outwards
const ES = labelPt('ESP');
const POPT: Record<string, number> = Object.fromEntries(ALL.map((k) => { const [x, y] = labelPt(k); return [k, Math.hypot(x - ES[0], y - ES[1]) / 22]; }));

export const HOOK_SFX = (() => {
	const s: {f: number; name: string; vol: number}[] = [];
	const S = (f: number, name: string, vol = 0.45) => s.push({f, name, vol});
	S(0, 'whoosh_2', 0.4); for (let k = 0; k < 12; k++) S(4 + k * 5, `pop_${(k % 4) + 1}`, 0.22); S(30, 'slap', 0.45);
	S(96, 'glitch', 0.35); for (let k = 0; k < 24; k++) S(100 + k * 3, 'tick', 0.18); S(176, 'confirm', 0.45);
	S(200, 'whoosh_4', 0.45); S(214, 'slap', 0.45); FAV.forEach((_, i) => S(240 + i * 20, 'click', 0.4)); S(372, 'pop_3', 0.4); S(400, 'error', 0.3);
	S(440, 'whoosh_3', 0.45); S(452, 'boom', 0.55); S(456, 'crowd_ohh', 0.45); S(500, 'drumroll', 0.4); S(560, 'boom', 0.5); S(562, 'glass', 0.35);
	S(620, 'whoosh_1', 0.45); S(626, 'slap', 0.5); S(636, 'whistle_long', 0.3); S(700, 'click', 0.45);
	S(880, 'whoosh_2', 0.4); [0, 1, 2].forEach((i) => S(900 + i * 30, `pop_${i + 1}`, 0.42)); S(1000, 'riser', 0.3);
	return s;
})();

const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; p: number; shadow?: string}> = ({children, size = 84, color = '#fff', p, shadow = C.navy}) => (
	<div style={{transform: `scale(${Math.max(0, p)})`, fontFamily: LILITA, fontSize: size, color, ...strokeText(size * 0.16), textShadow: `0 ${size * 0.09}px 0 ${shadow}`, whiteSpace: 'nowrap', lineHeight: 1.05}}>{children}</div>
);

export const Hook: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camPath([[0, VIEW.x, VIEW.y, VIEW.z * 0.92], [200, VIEW.x, VIEW.y, VIEW.z], [440, VIEW.x - 40, VIEW.y, VIEW.z * 1.03], [620, VIEW.x, VIEW.y, VIEW.z * 0.95], [HOOK_DUR, hookEndCam.x, hookEndCam.y, hookEndCam.z]], f, 3);
	const pop = Object.fromEntries(ALL.map((k) => [k, Math.max(0.001, elastic((f - POPT[k]) / 60))]));
	const faces: Partial<Record<Iso, FaceState>> = {};
	ALL.forEach((k, i) => (faces[k] = {mood: f >= 440 && f < 620 ? 'miedo' : f >= 200 && f < 440 && FAV.some(([x]) => x === k) ? 'grito' : 'feliz', blink: blinkAt(f, i), open: 0.5 + 0.5 * Math.sin(f / 4 + i), look: [0, 0]}));
	const sims = Math.round(20000 * easeOut((f - 96) / 80));
	const flash = f >= 96 && f < 180 ? TEAMS[Math.floor(f / 3) % 12].iso : null;
	const dark = f >= 440 && f < 620 ? clamp01((f - 440) / 16) * (1 - clamp01((f - 600) / 20)) : 0;
	return (
		<AbsoluteFill style={{background: C.navy}}>
			<Fonts />
			<MapLayer cam={cam} owners={OWN} pop={pop} faces={faces} unified={false} dim={f >= 200 && f < 440 ? 0.5 : 0} highlight={f >= 200 && f < 440 ? Object.fromEntries(FAV.map(([k]) => [k, 0.6])) : {}} />
			{dark > 0 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.25) 20%, rgba(10,4,20,0.85) 100%)', opacity: dark}} />}

			{f < 196 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 1 - clamp01((f - 184) / 12)}}>
					{f < 96 ? (
						<>
							<Big p={backOut((f - 6) / 12)} size={110}>51 SELECCIONES</Big>
							<Big p={backOut((f - 30) / 12)} size={70} color={C.yellow}>UN SOLO CONTINENTE</Big>
						</>
					) : (
						<>
							<Big p={backOut((f - 96) / 10)} size={66}>HEMOS SIMULADO ESTA GUERRA</Big>
							<div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${backOut((f - 104) / 10)})`}}>
								<span style={{fontFamily: LILITA, fontSize: 150, lineHeight: 1, color: '#2EC46B', ...strokeText(18), textShadow: `0 10px 0 ${C.navy}`}}>{sims.toLocaleString('es-ES')}</span>
								<span style={{fontFamily: LILITA, fontSize: 70, color: '#fff', ...strokeText(12)}}>VECES</span>
								{flash && <FlagChip iso={flash} w={110} />}
							</div>
						</>
					)}
				</div>
			)}

			{/* sportsbook board */}
			{f >= 196 && f < 450 && (
				<div style={{position: 'absolute', right: 70, top: 70, transform: `translateX(${(1 - backOut((f - 200) / 16)) * 900 + easeInOut((f - 424) / 20) * 1000}px)`}}>
					<Panel style={{width: 760, padding: '18px 26px 20px'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
							<span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>FAVORITOS</span>
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: C.yellow}}>% DE VECES QUE CONQUISTÓ EUROPA</span>
						</div>
						{FAV.map(([k, v], i) => {
							const p = clamp01((f - 240 - i * 20) / 16);
							return (
								<div key={k} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: clamp01(p * 3), transform: `translateX(${(1 - easeOut(p)) * 80}px)`}}>
									<div style={{width: 40, fontFamily: LILITA, fontSize: 34, color: i === 0 ? C.yellow : '#fff'}}>{i + 1}</div>
									<FlagChip iso={k} w={62} />
									<div style={{width: 220, fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#fff'}}>{T[k].name.toUpperCase()}</div>
									<div style={{flex: 1, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
										<div style={{width: `${(v / FAV[0][1]) * 100 * easeOut(p)}%`, height: '100%', background: i === 0 ? C.yellow : '#2EC46B', borderRadius: 13}} />
									</div>
									<div style={{width: 110, textAlign: 'right', fontFamily: LILITA, fontSize: 36, color: '#fff'}}>{v.toLocaleString('es-ES')}%</div>
								</div>
							);
						})}
						{f >= 372 && (
							<div style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 14, background: 'rgba(230,57,70,0.2)', border: `3px solid ${C.red}`, transform: `scale(${backOut((f - 372) / 12)})`}}>
								<div style={{display: 'flex', gap: 4}}>{NEVER.slice(0, 7).map((k) => <FlagChip key={k} iso={k} w={36} dim />)}</div>
								<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: '#fff'}}>{NEVER.length} SELECCIONES NO GANARON NI UNA VEZ</span>
							</div>
						)}
					</Panel>
				</div>
			)}
			{f >= 196 && f < 450 && (
				<div style={{position: 'absolute', left: 60, top: 70, opacity: 1 - clamp01((f - 430) / 16)}}>
					<Big p={backOut((f - 206) / 12)} size={70}>¿QUIÉN</Big>
					<Big p={backOut((f - 214) / 12)} size={70} color={C.yellow}>GANA EUROPA?</Big>
				</div>
			)}

			{/* the spoiler */}
			{f >= 440 && f < 620 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
					<Big p={backOut((f - 444) / 10)} size={80}>PERO EN LA DE VERDAD...</Big>
					{f >= 500 && <Big p={backOut((f - 500) / 10)} size={66} color="#FF8A94">UNA SELECCIÓN DEL PUESTO 41</Big>}
					{f >= 560 && <Big p={backOut((f - 560) / 8)} size={100} color={C.yellow} shadow={C.red}>LLEGARÁ A TENER 22 TERRITORIOS</Big>}
					{f >= 576 && <div style={{transform: `scale(${backOut((f - 576) / 10)})`}}><Pill size={30} bg="#fff">¿ADIVINAS CUÁL? (GANÓ 2 DE CADA 20.000 SIMULACIONES)</Pill></div>}
				</div>
			)}
			{f >= 604 && f < 630 && <AbsoluteFill style={{background: '#fff', opacity: 0.85 * Math.sin(clamp01((f - 604) / 26) * Math.PI)}} />}

			{/* title */}
			{f >= 616 && f < 900 && (() => {
				const pin = backOut((f - 616) / 16), pout = easeInOut((f - 870) / 22);
				return (
					<div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', transform: `translateY(${pout * -900}px) scale(${pin}) rotate(${-2 - pout * 6}deg)`}}>
						<div style={{background: '#FFF6E0', border: `7px solid ${C.navy}`, borderRadius: 34, padding: '26px 70px 32px', boxShadow: '0 16px 0 rgba(0,0,0,0.35)', textAlign: 'center'}}>
							<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: C.red}}>EL MAPA HINCHA</div>
							<div style={{fontFamily: LILITA, fontSize: 120, lineHeight: 1.0, color: C.navy, marginTop: 6}}>IMPERIALISMO</div>
							<div style={{fontFamily: LILITA, fontSize: 120, lineHeight: 1.0, color: '#2F7DE1', WebkitTextStroke: `5px ${C.navy}`, paintOrder: 'stroke fill'}}>EUROPEO</div>
							<div style={{marginTop: 16, transform: `scale(${backOut((f - 690) / 14)})`}}><Pill size={30}>51 SELECCIONES · SOLO PUEDE QUEDAR UNA</Pill></div>
						</div>
					</div>
				);
			})()}
			{/* rules */}
			{f >= 880 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: 1 - clamp01((f - HOOK_DUR + 24) / 20)}}>
					<div style={{display: 'flex', gap: 22}}>
						{[['1', 'UNA SELECCIÓN AL AZAR ATACA A UN VECINO', '#2F7DE1'], ['2', 'GANA SEGÚN SU ELO REAL + 15 POR TERRITORIO', '#2EC46B'], ['3', 'LOS PAÍSES CONQUISTADOS PUEDEN REBELARSE', '#8E5BD9']].map(([n, t, c], i) => (
							<div key={n} style={{transform: `scale(${backOut((f - 900 - i * 30) / 14)})`, width: 420, padding: '18px 20px', borderRadius: 22, background: 'rgba(11,30,63,0.95)', border: `5px solid ${c}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 16}}>
								<div style={{width: 64, height: 64, borderRadius: 32, background: c, border: `4px solid ${C.navy}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 40, color: '#fff', flexShrink: 0}}>{n}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: '#fff', lineHeight: 1.2}}>{t}</div>
							</div>
						))}
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
