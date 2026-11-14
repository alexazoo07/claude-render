import React from 'react';
import {interpolate, Easing} from 'remotion';
import {LILITA, RUBIK} from '../fonts';
import {FlagChip, Iso, flagUrl} from './flagimg6';
import {C, T, TEAMS} from './data6';

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const elastic = (t: number) => (t <= 0 ? 0 : t >= 3 ? 1 : 1 - Math.exp(-7 * t) * Math.cos(9.5 * t));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (t: number) => {
	const x = clamp01(t);
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const backOut = (t: number) => {
	const x = clamp01(t), c1 = 1.9, c3 = c1 + 1;
	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
// frames -> seconds helper
export const secs = (f: number, fps = 60) => f / fps;

export const strokeText = (px: number, color = C.navy): React.CSSProperties => ({
	WebkitTextStroke: `${px}px ${color}`,
	paintOrder: 'stroke fill',
});

export const Pill: React.FC<{bg?: string; color?: string; size?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({bg = C.yellow, color = C.navy, size = 30, children, style}) => (
	<div style={{display: 'inline-block', padding: `${size * 0.35}px ${size * 1.1}px`, borderRadius: 999, background: bg, border: `5px solid ${C.navy}`, fontFamily: RUBIK, fontWeight: 800, fontSize: size, letterSpacing: size * 0.08, color, whiteSpace: 'nowrap', ...style}}>
		{children}
	</div>
);

export const Counter: React.FC<{value: number; total: number; label?: string; flash?: number; style?: React.CSSProperties}> = ({value, total, label = 'QUEDAN EN PIE', flash = 0, style}) => (
	<div style={{position: 'absolute', left: 36, top: 30, width: 236, height: 168, boxSizing: 'border-box', borderRadius: 24, background: C.navy, border: `5px solid ${flash > 0 ? '#fff' : C.yellow}`, boxShadow: `0 8px 0 rgba(0,0,0,0.35), 0 0 ${40 * flash}px ${C.yellow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style}}>
		<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: C.yellow}}>{label}</div>
		<div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
			<span style={{fontFamily: LILITA, fontSize: 98, lineHeight: 1, color: '#fff', transform: `scale(${1 + flash * 0.18})`, display: 'inline-block'}}>{value}</span>
			<span style={{fontFamily: LILITA, fontSize: 36, color: 'rgba(255,255,255,0.55)'}}>/{total}</span>
		</div>
	</div>
);

export const RoundTag: React.FC<{n: number; style?: React.CSSProperties}> = ({n, style}) => (
	<div style={{position: 'absolute', left: 36, top: 214, padding: '8px 22px', borderRadius: 14, background: C.red, border: `4px solid ${C.navy}`, boxShadow: '0 5px 0 rgba(0,0,0,0.35)', fontFamily: RUBIK, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: '#fff', ...style}}>
		RONDA {n}
	</div>
);

export const FlagBar: React.FC<{alive: Record<string, boolean>; y?: number; pulse?: Partial<Record<Iso, number>>}> = ({alive, y = 912, pulse = {}}) => {
	const list = TEAMS.filter((t) => alive[t.iso]);
	const n = list.length;
	const w = Math.max(26, Math.min(54, (1700 - 20) / n - 8));
	const gap = Math.max(4, Math.min(12, w * 0.18));
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'center', gap, padding: '10px 18px', borderRadius: 999, background: 'rgba(11,30,63,0.88)', border: '4px solid rgba(255,255,255,0.18)'}}>
				{list.map((t) => {
					const p = pulse[t.iso] ?? 0;
					return (
						<div key={t.iso} style={{position: 'relative', transform: `scale(${1 + p * 0.35}) translateY(${-p * 8}px)`}}>
							<FlagChip iso={t.iso} w={w} />
						</div>
					);
				})}
				<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 18, color: 'rgba(255,255,255,0.75)', marginLeft: 6, whiteSpace: 'nowrap'}}>{TEAMS.length - n} ELIMINADAS</span>
			</div>
		</div>
	);
};

export const Footer: React.FC<{text: string}> = ({text}) => (
	<div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 17, color: 'rgba(255,255,255,0.7)', textShadow: '0 2px 4px rgba(0,0,0,0.6)'}}>{text}</div>
);

// Roulette with team flags. angle in degrees (rotation of wheel). Pointer on top.
export const Wheel: React.FC<{teams: Iso[]; angle: number; size: number; title: string; result?: string | null; resultIso?: Iso | null; resultP?: number}> = ({teams, angle, size, title, result, resultIso, resultP = 0}) => {
	const n = teams.length;
	const R = size / 2;
	const cols = [C.red, C.yellow, '#2F7DE1', C.green2, '#FF8A3D', '#8E5BD9'];
	const slices = teams.map((iso, i) => {
		const a0 = ((i / n) * 360 - 90) * (Math.PI / 180);
		const a1 = (((i + 1) / n) * 360 - 90) * (Math.PI / 180);
		const am = (a0 + a1) / 2;
		const r = R - 10;
		const d = `M${R} ${R} L${R + Math.cos(a0) * r} ${R + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${R + Math.cos(a1) * r} ${R + Math.sin(a1) * r} Z`;
		const fx = R + Math.cos(am) * r * 0.66, fy = R + Math.sin(am) * r * 0.66;
		const fw = size * 0.13;
		return (
			<g key={iso}>
				<path d={d} fill={cols[i % cols.length]} stroke={C.navy} strokeWidth={4} />
				<g transform={`translate(${fx} ${fy}) rotate(${(am * 180) / Math.PI + 90})`}>
					<rect x={-fw / 2 - 3} y={-fw / 3 - 3} width={fw + 6} height={(fw * 2) / 3 + 6} rx={5} fill={C.navy} />
					<image href={flagUrl(iso)} x={-fw / 2} y={-fw / 3} width={fw} height={(fw * 2) / 3} preserveAspectRatio="none" />
				</g>
			</g>
		);
	});
	return (
		<div style={{position: 'relative', width: size, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{marginBottom: 18, padding: '10px 30px', borderRadius: 999, background: '#fff', border: `5px solid ${C.navy}`, fontFamily: LILITA, fontSize: 44, color: C.navy, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>{title}</div>
			<div style={{position: 'relative', width: size, height: size}}>
				<svg width={size} height={size} style={{position: 'absolute', filter: 'drop-shadow(0 12px 0 rgba(0,0,0,0.35))'}}>
					<circle cx={R} cy={R} r={R - 2} fill={C.navy} />
					<circle cx={R} cy={R} r={R - 6} fill="#fff" />
					<g transform={`rotate(${angle} ${R} ${R})`}>{slices}</g>
					{Array.from({length: 24}).map((_, i) => {
						const a = (i / 24) * Math.PI * 2;
						return <circle key={i} cx={R + Math.cos(a) * (R - 5)} cy={R + Math.sin(a) * (R - 5)} r={4.5} fill={i % 2 ? C.yellow : '#fff'} stroke={C.navy} strokeWidth={1.5} />;
					})}
					<circle cx={R} cy={R} r={R * 0.14} fill="#fff" stroke={C.navy} strokeWidth={6} />
					<circle cx={R} cy={R} r={R * 0.06} fill={C.red} />
				</svg>
				<svg width={60} height={70} style={{position: 'absolute', left: R - 30, top: -30}}>
					<path d="M8 6 L52 6 L30 60 Z" fill={C.red} stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
				</svg>
			</div>
			{result && resultIso && (
				<div style={{marginTop: 20, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 28px', borderRadius: 18, background: C.yellow, border: `5px solid ${C.navy}`, transform: `scale(${backOut(resultP)})`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>
					<FlagChip iso={resultIso} w={60} />
					<span style={{fontFamily: LILITA, fontSize: 52, color: C.navy}}>{result}</span>
				</div>
			)}
		</div>
	);
};

export const RankRow: React.FC<{iso: Iso; p: number; maxPts: number; minPts: number}> = ({iso, p, maxPts, minPts}) => {
	const t = T[iso];
	const w = interpolate(t.pts, [minPts, maxPts], [0.12, 1]);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 14, height: 58, opacity: clamp01(p * 3), transform: `translateX(${(1 - easeOut(p)) * 120}px)`}}>
			<div style={{width: 64, fontFamily: LILITA, fontSize: 30, color: C.yellow, textAlign: 'right'}}>#{t.rank}</div>
			<FlagChip iso={iso} w={52} />
			<div style={{width: 170, fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: '#fff'}}>{t.name.toUpperCase()}</div>
			<div style={{position: 'relative', width: 250, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.12)'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100 * easeOut(p * 1.2)}%`, borderRadius: 13, background: `linear-gradient(90deg, ${C.yellow}, #FFB627)`, border: `3px solid ${C.navy}`, boxSizing: 'border-box'}} />
			</div>
			<div style={{width: 80, fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,0.85)'}}>{Math.round(t.pts)}</div>
		</div>
	);
};

export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div style={{background: 'rgba(11,30,63,0.94)', border: `5px solid ${C.yellow}`, borderRadius: 30, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '24px 30px', ...style}}>{children}</div>
);

export const Easing_ = Easing;
