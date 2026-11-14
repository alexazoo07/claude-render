import React from 'react';
import {Art} from './data9';

// Parametric cartoon stadium in 3/4 view. viewBox 1000 x 570.
const W = 1000, H = 570;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const shade = (hex: string, k: number) => {
	const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
	const f = (c: number) => Math.max(0, Math.min(255, Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k))));
	r = f(r); g = f(g); b = f(b);
	return `rgb(${r},${g},${b})`;
};
const sp = (a: number, e: number) => Math.sign(a) * Math.pow(Math.abs(a), e);
// superellipse point
const pt = (cx: number, cy: number, rx: number, ry: number, n: number, a: number): [number, number] => [cx + rx * sp(Math.cos(a), 2 / n), cy + ry * sp(Math.sin(a), 2 / n)];
const shape = (cx: number, cy: number, rx: number, ry: number, n: number, N = 120) => {
	let d = '';
	for (let i = 0; i < N; i++) { const [x, y] = pt(cx, cy, rx, ry, n, (i / N) * Math.PI * 2); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
	return d + 'Z';
};
const ring = (cx: number, cy: number, rx: number, ry: number, n: number, s0: number, s1: number, dy0: number, dy1: number) => shape(cx, cy + dy0, rx * s0, ry * s0, n) + shape(cx, cy + dy1, rx * s1, ry * s1, n, 120).replace(/^M/, 'M');

export const StadiumArt: React.FC<{art: Art; t?: number; w?: number; h?: number; id: string; bare?: boolean}> = ({art, t = 0, w = 1000, h = 570, id, bare}) => {
	const asp = art.aspect ?? 1.12;
	const CX = 500, CY = 290, RY = 150, RX = Math.min(440, RY * 2.55 * asp), FH = 92;
	const n = art.n;
	const night = !!art.night;
	// facade (lower half of the rim extruded down)
	let fd = '';
	const N = 80;
	for (let i = 0; i <= N; i++) { const [x, y] = pt(CX, CY, RX, RY, n, (i / N) * Math.PI); fd += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
	for (let i = N; i >= 0; i--) { const [x, y] = pt(CX, CY + FH, RX, RY, n, (i / N) * Math.PI); fd += 'L' + x.toFixed(1) + ' ' + y.toFixed(1); }
	fd += 'Z';
	const tiers = [0.95, 0.8, 0.67];
	const dys = [2, 14, 26];
	const PS = 0.55, PDY = 36;
	const pcy = CY + PDY;
	const prx = RX * PS * 0.8, pry = RY * PS * 0.62;
	// pitch trapezoid (perspective)
	const top = pcy - pry, bot = pcy + pry, wt = prx * 0.9, wb = prx;
	const px = (u: number, v: number): [number, number] => { const y = top + (bot - top) * v; const hw = wt + (wb - wt) * v; return [CX - hw + 2 * hw * u, y]; };
	const poly = (ps: [number, number][]) => ps.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + 'Z';
	const line = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
	const extras = art.extras ?? [];
	// crowd dots: two static paths + a few camera flashes
	const crowd = React.useMemo(() => {
		let light = '', dark = '';
		const pos: [number, number][] = [];
		for (let i = 0; i < 520; i++) {
			const a = rnd(i) * Math.PI * 2; const s = 0.6 + rnd(i + 999) * 0.34; const dy = 2 + (0.95 - s) * 70;
			const [x, y] = pt(CX, CY + dy, RX * s, RY * s, n, a);
			pos.push([x, y]);
			const c = `M${(x - 2.1).toFixed(1)} ${y.toFixed(1)}a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0 -4.2 0`;
			if (rnd(i + 7) > 0.5) light += c; else dark += c;
		}
		return {light, dark, pos};
	}, [CX, CY, RX, RY, n]);
	const flashes: React.ReactNode[] = [];
	if (night) crowd.pos.forEach(([x, y], i) => { if (rnd(i * 3 + Math.floor(t / 7)) > 0.985) flashes.push(<circle key={i} cx={x} cy={y} r={3.2} fill="#FFFFFF" />); });
	const dots = <><path d={crowd.light} fill="rgba(255,255,255,0.35)" /><path d={crowd.dark} fill="rgba(0,0,0,0.28)" />{flashes}</>;
	const fcol = art.facadeCol;
	const pattern = (() => {
		const pid = `${id}_fp`;
		switch (art.facade) {
			case 'diamonds': return <pattern id={pid} width={36} height={22} patternUnits="userSpaceOnUse"><rect width={36} height={22} fill={fcol} /><path d="M0 11 L18 0 L36 11 L18 22Z" fill={shade(fcol, 0.25)} stroke={shade(fcol, -0.25)} strokeWidth={1.5} /></pattern>;
			case 'gold': return <pattern id={pid} width={30} height={30} patternUnits="userSpaceOnUse"><rect width={30} height={30} fill={fcol} /><path d="M0 30 L15 0 L30 30 M0 0 L15 30 L30 0" stroke={shade(fcol, -0.35)} strokeWidth={2} fill="none" /></pattern>;
			case 'metal': return <pattern id={pid} width={40} height={14} patternUnits="userSpaceOnUse"><rect width={40} height={14} fill={fcol} /><rect y={9} width={40} height={4} fill={shade(fcol, -0.3)} /></pattern>;
			case 'brick': return <pattern id={pid} width={28} height={14} patternUnits="userSpaceOnUse"><rect width={28} height={14} fill={fcol} /><path d="M0 7H28M14 0V7M0 7V14M28 7V14" stroke={shade(fcol, -0.35)} strokeWidth={1.4} /></pattern>;
			case 'concrete': return <pattern id={pid} width={34} height={92} patternUnits="userSpaceOnUse"><rect width={34} height={92} fill={fcol} /><rect x={4} y={8} width={6} height={84} fill={shade(fcol, -0.28)} /></pattern>;
			case 'glass': return <pattern id={pid} width={26} height={26} patternUnits="userSpaceOnUse"><rect width={26} height={26} fill={fcol} /><path d="M0 0H26V26" stroke={shade(fcol, -0.3)} strokeWidth={1.5} fill="none" /><rect x={3} y={3} width={8} height={8} fill="rgba(255,255,255,0.35)" /></pattern>;
			case 'blue': return <pattern id={pid} width={22} height={92} patternUnits="userSpaceOnUse"><rect width={22} height={92} fill={fcol} /><rect x={16} width={4} height={92} fill="#F2C230" /></pattern>;
			default: return <pattern id={pid} width={40} height={30} patternUnits="userSpaceOnUse"><rect width={40} height={30} fill={fcol} /><path d="M0 22 Q20 4 40 22" stroke={shade(fcol, -0.18)} strokeWidth={3} fill="none" /></pattern>;
		}
	})();
	const roofCol = art.roofCol ?? '#FFFFFF';
	const floodGlow = 0.65 + 0.2 * Math.sin(t / 9);
	return (
		<svg width={w} height={h} viewBox={`0 0 ${W} ${H}`} style={{display: 'block'}}>
			<defs>
				<linearGradient id={`${id}_sky`} x1="0" y1="0" x2="0" y2="1">
					{night ? (<><stop offset="0" stopColor="#0B1638" /><stop offset="0.7" stopColor="#24335F" /><stop offset="1" stopColor="#3B3E6E" /></>) : (<><stop offset="0" stopColor="#5FB4F2" /><stop offset="0.75" stopColor="#B9E3FF" /><stop offset="1" stopColor="#FFE9C2" /></>)}
				</linearGradient>
				<linearGradient id={`${id}_fs`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#000" stopOpacity="0.35" /><stop offset="0.45" stopColor="#000" stopOpacity="0" /><stop offset="0.8" stopColor="#fff" stopOpacity="0.12" /><stop offset="1" stopColor="#000" stopOpacity="0.3" />
				</linearGradient>
				<radialGradient id={`${id}_glow`}><stop offset="0" stopColor="#FFF7D6" stopOpacity="0.9" /><stop offset="1" stopColor="#FFF7D6" stopOpacity="0" /></radialGradient>
				{pattern}
				<clipPath id={`${id}_pitch`}><path d={poly([px(0, 0), px(1, 0), px(1, 1), px(0, 1)])} /></clipPath>
			</defs>
			{!bare && (
				<>
					<rect width={W} height={H} fill={`url(#${id}_sky)`} />
					{night && Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i) * W} cy={rnd(i + 50) * 200} r={1 + rnd(i + 9) * 1.5} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t / 15 + i)} />)}
					{!night && [0, 1, 2].map((i) => { const x = ((rnd(i) * W + t * (0.25 + i * 0.1)) % (W + 300)) - 150; const y = 50 + i * 45; return <g key={i} opacity={0.9}><ellipse cx={x} cy={y} rx={70} ry={20} fill="#fff" /><ellipse cx={x + 40} cy={y - 12} rx={45} ry={22} fill="#fff" /></g>; })}
					{/* skyline */}
					<path d={'M0 300' + Array.from({length: 26}, (_, i) => { const x = i * 40; const hh = 230 - rnd(i + 3) * 90; return `L${x} ${hh}L${x + 34} ${hh}L${x + 34} 300`; }).join('') + 'L1000 300L1000 570L0 570Z'} fill={night ? '#1A2347' : '#8FB3CF'} opacity={0.85} />
					<rect y={300} width={W} height={270} fill={night ? '#1E3B2A' : '#5FAE5A'} />
					<rect y={300} width={W} height={270} fill={night ? '#000' : '#fff'} opacity={0.08} />
				</>
			)}
			{/* ground shadow */}
			<ellipse cx={CX + 20} cy={CY + FH + 18} rx={RX * 1.08} ry={RY * 0.7} fill="#000" opacity={0.28} />
			{extras.includes('tower') && (
				<g>
					<rect x={CX - 40} y={CY - 250} width={80} height={270} fill="#F4F1EA" stroke="#5E6470" strokeWidth={4} />
					{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={CX - 30} y={CY - 230 + i * 40} width={60} height={14} fill="#C9CDD4" />)}
					<rect x={CX - 52} y={CY - 262} width={104} height={20} fill="#E8E2D2" stroke="#5E6470" strokeWidth={4} />
				</g>
			)}
			{/* facade */}
			<path d={fd} fill={`url(#${id}_fp)`} stroke="#10131C" strokeWidth={4} strokeLinejoin="round" />
			<path d={fd} fill={`url(#${id}_fs)`} />
			{extras.includes('towers') && [0.08, 0.2, 0.33, 0.5, 0.67, 0.8, 0.92].map((u, i) => {
				const [x, y] = pt(CX, CY, RX * 1.02, RY * 1.02, n, u * Math.PI);
				return (
					<g key={i}>
						<rect x={x - 17} y={y - 30} width={34} height={FH + 36} rx={6} fill="#D9D5CC" stroke="#10131C" strokeWidth={3} />
						{[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M${x - 17} ${y - 20 + j * 24} L${x + 17} ${y - 8 + j * 24}`} stroke="#8E8B84" strokeWidth={4} />)}
					</g>
				);
			})}
			{/* rim + seating bowl */}
			<path d={shape(CX, CY, RX, RY, n)} fill={shade(fcol, -0.15)} stroke="#10131C" strokeWidth={4} />
			{tiers.map((s, i) => <path key={i} d={shape(CX, CY + dys[i], RX * s, RY * s, n)} fill={art.seats[i % art.seats.length]} stroke={shade(art.seats[i % art.seats.length], -0.45)} strokeWidth={2.5} />)}
			<g>{dots}</g>
			<path d={shape(CX, pcy, RX * PS, RY * PS, n)} fill="#2E8B3E" stroke="#10131C" strokeWidth={3} />
			{/* pitch */}
			<g clipPath={`url(#${id}_pitch)`}>
				{Array.from({length: 10}, (_, i) => <path key={i} d={poly([px(i / 10, 0), px((i + 1) / 10, 0), px((i + 1) / 10, 1), px(i / 10, 1)])} fill={i % 2 ? '#3FA34D' : '#4DB55A'} />)}
			</g>
			<g stroke="#fff" strokeWidth={2.4} fill="none" opacity={0.9}>
				<path d={poly([px(0.02, 0.04), px(0.98, 0.04), px(0.98, 0.96), px(0.02, 0.96)])} />
				<path d={line(px(0.5, 0.04), px(0.5, 0.96))} />
				<ellipse cx={px(0.5, 0.5)[0]} cy={px(0.5, 0.5)[1]} rx={prx * 0.16} ry={pry * 0.26} />
				<path d={poly([px(0.02, 0.25), px(0.15, 0.25), px(0.15, 0.75), px(0.02, 0.75)])} />
				<path d={poly([px(0.98, 0.25), px(0.85, 0.25), px(0.85, 0.75), px(0.98, 0.75)])} />
			</g>
			{/* roofs */}
			{art.roof === 'ring' && (
				<g>
					<path d={ring(CX, CY, RX, RY, n, 1.0, 0.8, -2, 6)} fill={roofCol} fillRule="evenodd" opacity={0.95} stroke="#10131C" strokeWidth={3} />
					{Array.from({length: 36}, (_, i) => { const a = (i / 36) * Math.PI * 2; const [x0, y0] = pt(CX, CY - 2, RX, RY, n, a); const [x1, y1] = pt(CX, CY + 6, RX * 0.8, RY * 0.8, n, a); return <path key={i} d={`M${x0} ${y0}L${x1} ${y1}`} stroke={shade(roofCol, -0.25)} strokeWidth={2} />; })}
				</g>
			)}
			{art.roof === 'full' && (
				<g>
					<path d={ring(CX, CY, RX, RY, n, 1.0, 0.66, -2, 18)} fill={roofCol} fillRule="evenodd" opacity={0.97} stroke="#10131C" strokeWidth={3} />
					{Array.from({length: 8}, (_, i) => <path key={i} d={shape(CX, CY - 2 + i * 2.6, RX * (0.97 - i * 0.04), RY * (0.97 - i * 0.04), n)} fill="none" stroke={shade(roofCol, -0.3)} strokeWidth={1.6} />)}
				</g>
			)}
			{art.roof === 'beams' && (
				<g>
					<path d={ring(CX, CY, RX, RY, n, 1.0, 0.8, -2, 6)} fill={roofCol} fillRule="evenodd" opacity={0.85} stroke="#10131C" strokeWidth={3} />
					{[-0.6, -0.2, 0.2, 0.6].map((u, i) => <path key={i} d={`M${CX + u * RX} ${CY - RY * 1.05} L${CX + u * RX * 1.05} ${CY + RY * 1.05}`} stroke="#D7262E" strokeWidth={14} strokeLinecap="round" />)}
					{[-0.5, 0.5].map((v, i) => <path key={'h' + i} d={`M${CX - RX * 1.02} ${CY + v * RY} L${CX + RX * 1.02} ${CY + v * RY}`} stroke="#D7262E" strokeWidth={14} strokeLinecap="round" />)}
				</g>
			)}
			{art.roof === 'canopy' && (
				<g>
					<path d={shape(CX, CY - 38, RX * 1.12, RY * 1.12, n)} fill={roofCol} opacity={0.42} stroke="#fff" strokeWidth={4} />
					{Array.from({length: 13}, (_, i) => <path key={i} d={`M${CX - RX * 1.1 + i * RX * 0.183} ${CY - 38 - RY * 1.0} L${CX - RX * 1.1 + i * RX * 0.183} ${CY - 38 + RY * 1.0}`} stroke="#fff" strokeWidth={1.6} opacity={0.6} />)}
					<path d={shape(CX, CY - 38, RX * 0.55, RY * 0.5, 3)} fill="#0B1E3F" opacity={0.25} />
				</g>
			)}
			{art.roof === 'petals' && (
				<g>
					{Array.from({length: 16}, (_, i) => {
						const a0 = (i / 16) * Math.PI * 2, a1 = ((i + 1) / 16) * Math.PI * 2, am = (a0 + a1) / 2;
						const [x0, y0] = pt(CX, CY, RX * 1.01, RY * 1.01, n, a0); const [x1, y1] = pt(CX, CY, RX * 1.01, RY * 1.01, n, a1);
						const [xm, ym] = pt(CX, CY, RX * 0.9, RY * 0.9, n, am);
						const back = Math.sin(am) < 0;
						return <path key={i} d={`M${x0} ${y0} Q${xm} ${ym - (back ? 95 : 38)} ${x1} ${y1} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + 10} ${x0} ${y0}Z`} fill={roofCol} opacity={back ? 0.9 : 0.97} stroke="#10131C" strokeWidth={3} strokeLinejoin="round" />;
					})}
				</g>
			)}
			{extras.includes('dstand') && (
				<g>
					<path d={`M${CX + RX * 0.62} ${CY - RY * 0.85} L${CX + RX * 0.98} ${CY - RY * 0.3} L${CX + RX * 0.98} ${CY + RY * 0.55 + FH} L${CX + RX * 0.62} ${CY + RY * 0.1 + FH}Z`} fill="#1D4AA8" stroke="#10131C" strokeWidth={4} />
					{Array.from({length: 6}, (_, i) => <path key={i} d={`M${CX + RX * 0.62} ${CY - RY * 0.85 + i * 34} L${CX + RX * 0.98} ${CY - RY * 0.3 + i * 34}`} stroke="#F2C230" strokeWidth={6} />)}
				</g>
			)}
			{extras.includes('pylons') && [0.1, 0.4, 0.6, 0.9, 1.1, 1.4, 1.6, 1.9].map((u, i) => {
				const [x, y] = pt(CX, CY, RX * 1.04, RY * 1.04, n, u * Math.PI);
				return <g key={i}><rect x={x - 7} y={y - 150} width={14} height={150} fill="#FFD100" stroke="#10131C" strokeWidth={3} /><path d={`M${x} ${y - 150} L${CX + (x - CX) * 0.82} ${CY + (y - CY) * 0.82}`} stroke="#333" strokeWidth={2} /></g>;
			})}
			{extras.includes('floods') && [[-0.92, -0.75], [0.92, -0.75], [-0.98, 0.55], [0.98, 0.55]].map(([u, v], i) => {
				const x = CX + u * RX, y = CY + v * RY;
				return <g key={i}><rect x={x - 5} y={y - 125} width={10} height={125} fill="#9AA1AD" stroke="#10131C" strokeWidth={2.5} /><rect x={x - 26} y={y - 151} width={52} height={30} rx={4} fill="#F7F3D9" stroke="#10131C" strokeWidth={3} /><circle cx={x} cy={y - 136} r={70} fill={`url(#${id}_glow)`} opacity={floodGlow} /></g>;
			})}
			{extras.includes('arch') && (
				<g>
					<path d={`M${CX - RX * 0.95} ${CY - RY * 0.2} Q${CX} ${CY - RY * 3.2} ${CX + RX * 0.95} ${CY - RY * 0.2}`} stroke="#10131C" strokeWidth={24} fill="none" strokeLinecap="round" />
					<path d={`M${CX - RX * 0.95} ${CY - RY * 0.2} Q${CX} ${CY - RY * 3.2} ${CX + RX * 0.95} ${CY - RY * 0.2}`} stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" />
					<path d={`M${CX - RX * 0.95} ${CY - RY * 0.2} Q${CX} ${CY - RY * 3.2} ${CX + RX * 0.95} ${CY - RY * 0.2}`} stroke="#B8C0CC" strokeWidth={4} fill="none" strokeDasharray="10 8" />
				</g>
			)}
			{night && <ellipse cx={CX} cy={pcy} rx={RX * 0.6} ry={RY * 0.5} fill="#FFFBE0" opacity={0.08 + 0.03 * Math.sin(t / 11)} />}
		</svg>
	);
};
