import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam} from './MapLayer3';
import {Hincha, Mood} from '../Hincha';
import {FlagChip, Iso} from './flagimg3';
import {hi} from './flagimg3';
import {C, T} from './data3';
import {LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic, Pill, strokeText} from './ui3';

export const FPS = 60;

export const blinkAt = (f: number, seed: number) => {
	const period = 170 + (seed % 5) * 23;
	const ph = (((f + seed * 37) % period) + period) % period;
	return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0;
};

export type Key = [number, number, number, number]; // frame, x, y, z
export const camPath = (keys: Key[], f: number, seed = 0): Cam => {
	let k = 0;
	while (k < keys.length - 1 && f > keys[k + 1][0]) k++;
	const a = keys[k], b = keys[Math.min(k + 1, keys.length - 1)];
	const t = b[0] === a[0] ? 1 : easeInOut((f - a[0]) / (b[0] - a[0]));
	const z = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * t);
	const x = a[1] + (b[1] - a[1]) * t;
	const y = a[2] + (b[2] - a[2]) * t;
	const g = f + seed * 1000;
	return {x: x + (Math.sin(g / 97) * 6) / z, y: y + (Math.cos(g / 83) * 4) / z, z: z * (1 + 0.006 * Math.sin(g / 71))};
};

// Text-segment wheel ("¿QUÉ HARÁ X?")
export const ACTION_SLICES: ('ATACAR' | 'REBELIÓN')[] = ['ATACAR', 'ATACAR', 'REBELIÓN', 'ATACAR', 'ATACAR', 'ATACAR', 'REBELIÓN', 'ATACAR'];
export const ActionWheel: React.FC<{angle: number; size: number; title: string; result?: string | null; resultP?: number}> = ({angle, size, title, result, resultP = 0}) => {
	const n = ACTION_SLICES.length;
	const R = size / 2;
	return (
		<div style={{position: 'relative', width: size, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{marginBottom: 18, padding: '10px 30px', borderRadius: 999, background: '#fff', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 44, color: C.navy, boxShadow: '0 6px 0 rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>{title}</div>
			<div style={{position: 'relative', width: size, height: size}}>
				<svg width={size} height={size} style={{position: 'absolute', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,0.35))'}}>
					<circle cx={R} cy={R} r={R - 2} fill={C.navy} />
					<g transform={`rotate(${angle} ${R} ${R})`}>
						{ACTION_SLICES.map((lab, i) => {
							const a0 = ((i / n) * 360 - 90) * (Math.PI / 180);
							const a1 = (((i + 1) / n) * 360 - 90) * (Math.PI / 180);
							const am = (a0 + a1) / 2;
							const r = R - 10;
							const d = `M${R} ${R} L${R + Math.cos(a0) * r} ${R + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${R + Math.cos(a1) * r} ${R + Math.sin(a1) * r} Z`;
							const reb = lab === 'REBELIÓN';
							return (
								<g key={i}>
									<path d={d} fill={reb ? '#8E5BD9' : i % 2 ? C.red : '#FF6B4A'} stroke={C.navy} strokeWidth={4} />
									<g transform={`translate(${R + Math.cos(am) * r * 0.6} ${R + Math.sin(am) * r * 0.6}) rotate(${(am * 180) / Math.PI})`}>
										<text x={0} y={9} textAnchor="middle" fontFamily="RubikX" fontWeight={800} fontSize={size * 0.05} fill="#fff" stroke={C.navy} strokeWidth={4} paintOrder="stroke">{lab}</text>
									</g>
								</g>
							);
						})}
					</g>
					<circle cx={R} cy={R} r={R * 0.14} fill="#fff" stroke={C.navy} strokeWidth={6} />
					<circle cx={R} cy={R} r={R * 0.06} fill={C.yellow} />
				</svg>
				<svg width={60} height={70} style={{position: 'absolute', left: R - 30, top: -30}}>
					<path d="M8 6 L52 6 L30 60 Z" fill={C.yellow} stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
				</svg>
			</div>
			{result && (
				<div style={{marginTop: 20, padding: '10px 30px', borderRadius: 18, background: result === 'REBELIÓN' ? '#8E5BD9' : C.red, border: `5px solid ${C.navy}`, transform: `scale(${backOut(resultP)})`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: 52, color: '#fff'}}>
					{result === 'REBELIÓN' ? '¡REBELIÓN!' : '¡A LA GUERRA!'}
				</div>
			)}
		</div>
	);
};

// Stadium VS scene (cold open / final intro)
export const StadiumVS: React.FC<{f: number; a: Iso; b: Iso; top: React.ReactNode; bottom: string; extras?: [Iso, number, number, number, Mood][]; outStart?: number}> = ({f, a, b, top, bottom, extras = [], outStart = 1e9}) => {
	const enter = (d: number) => elastic((f - d) / FPS);
	const vs = backOut((f - 36) / 14);
	const flash = f >= 36 ? Math.max(0, 1 - (f - 36) / 14) : 0;
	const outZ = 1 + Math.pow(clamp01((f - outStart) / 20), 2) * 0.5;
	const bob = (s: number) => Math.sin((f + s) / 7) * 6;
	return (
		<AbsoluteFill style={{background: C.navy, transform: `scale(${outZ})`}}>
			<div style={{position: 'absolute', inset: 0, height: 700, opacity: 0.4, backgroundImage: `radial-gradient(circle, ${C.yellow} 5px, transparent 6px), radial-gradient(circle, ${C.red} 5px, transparent 6px), radial-gradient(circle, #fff 4px, transparent 5px), radial-gradient(circle, #4FA3E3 5px, transparent 6px)`, backgroundSize: '46px 40px, 58px 44px, 38px 52px, 66px 36px', backgroundPosition: `${f * 0.3}px 0px, 20px ${12 + Math.sin(f / 9) * 3}px, 9px 26px, 31px ${5 + Math.cos(f / 8) * 3}px`}} />
			<div style={{position: 'absolute', left: -300, top: -420, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 62%)'}} />
			<div style={{position: 'absolute', left: 1120, top: -420, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 62%)'}} />
			<div style={{position: 'absolute', left: 0, top: 700, width: 1920, height: 380, background: 'repeating-linear-gradient(90deg, #1E8E4E 0px, #1E8E4E 120px, #24A05A 120px, #24A05A 240px)', borderTop: '10px solid #fff'}} />
			<div style={{position: 'absolute', left: 140 + (1 - enter(0)) * -900, top: 300 + bob(0)}}>
				<Hincha iso={hi(a)} mood="enfado" size={560} scarf={T[a as keyof typeof T]?.scarf} blink={blinkAt(f, 2)} look={[0.6, 0]} />
			</div>
			<div style={{position: 'absolute', left: 1220 + (1 - enter(4)) * 900, top: 300 + bob(20)}}>
				<Hincha iso={hi(b)} mood="grito" size={560} scarf={T[b as keyof typeof T]?.scarf} open={0.5 + 0.5 * Math.sin(f / 4)} look={[-0.6, 0]} />
			</div>
			{extras.map(([iso, x, y, d, m]) => {
				const p = elastic((f - d) / FPS);
				return (
					<div key={iso} style={{position: 'absolute', left: x, top: y + (1 - p) * 260}}>
						<Hincha iso={hi(iso)} mood={m} size={200} scarf={T[iso].scarf} look={[0, -0.6]} />
					</div>
				);
			})}
			{f >= 36 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', transform: `scale(${1 + (1 - vs) * 2})`, opacity: clamp01((f - 36) / 4)}}>
					<span style={{fontFamily: LILITA, fontSize: 250, color: C.yellow, ...strokeText(26), textShadow: `0 14px 0 ${C.red}`}}>VS</span>
				</div>
			)}
			{f >= 56 && <div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', transform: `translateY(${(1 - easeOut((f - 56) / 12)) * -200}px)`}}>{top}</div>}
			{f >= 84 && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', transform: `scale(${backOut((f - 84) / 14)})`}}>
					<Pill size={50} bg="#fff">{bottom}</Pill>
				</div>
			)}
			{flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8}} />}
		</AbsoluteFill>
	);
};

// TV scoreboard with clock
export const Scoreboard: React.FC<{a: Iso; d: Iso; ga: number; gd: number; minute: number | null; p: number; flashA?: number; flashD?: number}> = ({a, d, ga, gd, minute, p, flashA = 0, flashD = 0}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - easeOut(p)) * -220}px)`}}>
		<div style={{display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 12, background: flashA > 0 ? C.yellow : '#fff', padding: '10px 20px'}}>
				<FlagChip iso={a} w={56} />
				<span style={{fontFamily: LILITA, fontSize: 48, color: C.navy}}>{T[a].short}</span>
			</div>
			<div style={{background: C.navy, padding: '6px 26px', fontFamily: LILITA, fontSize: 64, color: C.yellow, display: 'flex', alignItems: 'center'}}>
				<span style={{display: 'inline-block', transform: `scale(${1 + flashA * 0.3})`}}>{ga}</span>
				<span style={{margin: '0 12px'}}>-</span>
				<span style={{display: 'inline-block', transform: `scale(${1 + flashD * 0.3})`}}>{gd}</span>
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 12, background: flashD > 0 ? C.yellow : '#fff', padding: '10px 20px'}}>
				<span style={{fontFamily: LILITA, fontSize: 48, color: C.navy}}>{T[d].short}</span>
				<FlagChip iso={d} w={56} />
			</div>
			{minute !== null && (
				<div style={{background: C.red, padding: '6px 18px', fontFamily: LILITA, fontSize: 44, color: '#fff', display: 'flex', alignItems: 'center', minWidth: 96, justifyContent: 'center'}}>{minute}'</div>
			)}
		</div>
	</div>
);

export const Confetti: React.FC<{f: number; start: number; n?: number}> = ({f, start, n = 140}) => {
	if (f < start) return null;
	const t = (f - start) / FPS;
	const cols = [C.yellow, C.red, '#fff', '#009C3B', '#4FA3E3', '#FF8A3D'];
	const items = [];
	for (let i = 0; i < n; i++) {
		const r1 = Math.sin(i * 91.7) * 0.5 + 0.5, r2 = Math.sin(i * 37.3) * 0.5 + 0.5, r3 = Math.sin(i * 13.1) * 0.5 + 0.5;
		const x0 = r1 * 1920;
		const delay = r2 * 1.2;
		const tt = t - delay;
		if (tt < 0) continue;
		const y = -40 + tt * (260 + r3 * 220);
		if (y > 1120) continue;
		const x = x0 + Math.sin(tt * (2 + r3 * 3) + i) * 40;
		const rot = tt * (200 + r2 * 300) + i * 30;
		items.push(<div key={i} style={{position: 'absolute', left: x, top: y, width: 14 + r3 * 10, height: 8 + r1 * 8, background: cols[i % cols.length], transform: `rotate(${rot}deg) scaleX(${Math.cos(tt * 6 + i)})`, borderRadius: 2}} />);
	}
	return <AbsoluteFill style={{pointerEvents: 'none'}}>{items}</AbsoluteFill>;
};

export const Trophy: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 200 220">
		<path d="M50 20 H150 V70 Q150 130 100 140 Q50 130 50 70 Z" fill="#FFC93C" stroke={C.navy} strokeWidth={7} />
		<path d="M50 35 Q14 35 18 64 Q22 92 56 98" fill="none" stroke={C.navy} strokeWidth={16} />
		<path d="M50 35 Q14 35 18 64 Q22 92 56 98" fill="none" stroke="#FFC93C" strokeWidth={8} />
		<path d="M150 35 Q186 35 182 64 Q178 92 144 98" fill="none" stroke={C.navy} strokeWidth={16} />
		<path d="M150 35 Q186 35 182 64 Q178 92 144 98" fill="none" stroke="#FFC93C" strokeWidth={8} />
		<rect x={88} y={138} width={24} height={30} fill="#FFC93C" stroke={C.navy} strokeWidth={6} />
		<rect x={58} y={166} width={84} height={34} rx={6} fill="#8C5A2B" stroke={C.navy} strokeWidth={7} />
		<ellipse cx={80} cy={50} rx={10} ry={20} fill="#fff" opacity={0.45} />
	</svg>
);

export const Subscribe: React.FC<{f: number; start: number; style?: React.CSSProperties}> = ({f, start, style}) => {
	if (f < start) return null;
	const p = backOut((f - start) / 14);
	const click = f - start > 50;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${p})`, ...style}}>
			<div style={{padding: '16px 38px', borderRadius: 16, background: click ? '#3A3A3A' : '#E1251B', border: `5px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 40, color: '#fff', boxShadow: '0 8px 0 rgba(0,0,0,0.35)', transform: `scale(${click && f - start < 58 ? 0.92 : 1})`}}>
				{click ? 'SUSCRITO' : 'SUSCRÍBETE'}
			</div>
			<svg width={74} height={74} viewBox="0 0 24 24" style={{transform: `rotate(${click ? Math.sin((f - start) / 3) * 18 * Math.max(0, 1 - (f - start - 50) / 40) : 0}deg)`}}>
				<path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill={C.yellow} stroke={C.navy} strokeWidth={1.2} />
			</svg>
		</div>
	);
};
