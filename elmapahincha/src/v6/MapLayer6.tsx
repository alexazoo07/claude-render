import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {Flag, Iso} from './flagimg6';
import {Eyes, Mood, Mouth} from '../Hincha';
import {GEO, P, T, C, SEA_LINKS, boxOf} from './data6';

export type Cam = {x: number; y: number; z: number};
export type FaceState = {mood: Mood; blink?: number; open?: number; look?: [number, number]; scale?: number; dx?: number; dy?: number};
export type Conquest = {countries: Iso[]; to: Iso; p: number; from: [number, number]; radius?: number};

const ALL = Object.keys(GEO.teams) as Iso[];

const bboxOf = (isos: Iso[]) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const i of isos) {
		const b = boxOf(i);
		x0 = Math.min(x0, b[0][0]); y0 = Math.min(y0, b[0][1]);
		x1 = Math.max(x1, b[1][0]); y1 = Math.max(y1, b[1][1]);
	}
	return {x: x0, y: y0, w: x1 - x0, h: y1 - y0};
};

export const faceSize = (owner: Iso, owners: Record<Iso, Iso>) => {
	const own = ALL.filter((c) => owners[c] === owner);
	const b = bboxOf(own.length ? own : [owner]);
	const self = GEO.teams[owner].b;
	const sw = self[1][0] - self[0][0], sh = self[1][1] - self[0][1];
	const base = Math.sqrt(Math.max(sw * sh, 400)) * 0.55;
	const grow = Math.sqrt((b.w * b.h) / Math.max(sw * sh, 1));
	return Math.max(34, Math.min(150, base * Math.min(1.6, Math.pow(grow, 0.35))));
};

export const labelPt = (iso: Iso): [number, number] => (T[iso].label ? P(T[iso].label![0], T[iso].label![1]) : (GEO.teams[iso].c as [number, number]));

export const MapLayer: React.FC<{
	cam: Cam;
	owners: Record<Iso, Iso>;
	pop?: Partial<Record<Iso, number>>;
	faces?: Partial<Record<Iso, FaceState>>;
	conquest?: Conquest | null;
	highlight?: Partial<Record<Iso, number>>; // glow 0..1
	dim?: number; // dim everything but highlighted
	silhouette?: number;
	unified?: boolean;
	children?: React.ReactNode; // extra world-space overlays
	overlay?: React.ReactNode; // screen-space overlays drawn above
}> = ({cam, owners, pop = {}, faces = {}, conquest, highlight = {}, dim = 0, silhouette = 0, unified = true, children}) => {
	const z = cam.z;
	const fr = useCurrentFrame();
	const oS = 760 * Math.pow(z, 0.55);
	const tf = `translate(960 540) scale(${z}) translate(${-cam.x} ${-cam.y})`;
	const owned = (o: Iso) => ALL.filter((c) => owners[c] === o);
	const rectOf: Record<string, {x: number; y: number; w: number; h: number}> = {};
	for (const o of new Set(Object.values(owners))) rectOf[o] = bboxOf(owned(o as Iso));
	const visible = ALL.filter((c) => (pop[c] ?? 1) > 0.001);
	const gx = (((-cam.x * z * 0.35) % 120) + 120) % 120;
	const gy = (((-cam.y * z * 0.35) % 120) + 120) % 120;
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, backgroundColor: '#1B5592', backgroundImage: `url(${staticFile('tex/ocean.png')})`, backgroundSize: `${oS}px ${oS}px`, backgroundPosition: `${960 - cam.x * z * 0.9 + fr * 0.25}px ${540 - cam.y * z * 0.9 + fr * 0.12}px`}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(120,190,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(4,16,40,0.45) 100%)'}} />
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>
					{ALL.map((c) => (
						<clipPath id={`cp_${c}`} key={c}>
							<path d={GEO.teams[c].d} />
						</clipPath>
					))}
					{conquest && (
						<clipPath id="cq">
							<circle cx={conquest.from[0]} cy={conquest.from[1]} r={Math.max(0.01, conquest.p * (conquest.radius ?? 900))} />
						</clipPath>
					)}
					<clipPath id="allland">
						{ALL.map((c) => (
							<path key={c} d={GEO.teams[c].d} />
						))}
					</clipPath>
				</defs>
				<g transform={tf}>
					{/* shallow-water halo along every coast */}
					<g fill="none" strokeLinejoin="round">
						<g stroke="#8FD0FF" strokeWidth={18 / z} opacity={0.13}>{GEO.bg.map((d, i) => <path key={i} d={d} />)}{ALL.map((c) => <path key={c} d={GEO.teams[c].d} />)}</g>
						<g stroke="#B9E4FF" strokeWidth={7 / z} opacity={0.22}>{GEO.bg.map((d, i) => <path key={i} d={d} />)}{ALL.map((c) => <path key={c} d={GEO.teams[c].d} />)}</g>
					</g>
					{/* neighbouring land */}
					<g transform={`translate(${3 / z} ${5 / z})`} opacity={0.35}>
						{GEO.bg.map((d, i) => (
							<path key={i} d={d} fill="#06142B" />
						))}
					</g>
					{GEO.bg.map((d, i) => (
						<path key={i} d={d} fill="#3A4862" stroke="#5B6C8C" strokeWidth={1.2 / z} />
					))}
					{SEA_LINKS.map(([a, b], i) => {
						const A = GEO.teams[a].c, B = GEO.teams[b].c;
						return <line key={'sl' + i} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="rgba(255,255,255,0.35)" strokeWidth={2.2 / z} strokeDasharray={`${7 / z} ${7 / z}`} />;
					})}
					{/* drop shadow of teams */}
					<g transform={`translate(${5 / z} ${8 / z})`}>
						{visible.map((c) => {
							const s = pop[c] ?? 1;
							const [cx, cy] = GEO.teams[c].c;
							return (
								<path key={c} d={GEO.teams[c].d} fill="#04101F" opacity={0.45}
									transform={s < 1 ? `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})` : undefined} />
							);
						})}
					</g>
					{visible.map((c) => {
						const s = pop[c] ?? 1;
						const [cx, cy] = GEO.teams[c].c;
						const o = owners[c];
						const own = GEO.teams[c].b;
						const r = unified ? rectOf[o] : {x: own[0][0], y: own[0][1], w: own[1][0] - own[0][0], h: own[1][1] - own[0][1]};
						const h = highlight[c] ?? 0;
						const dd = h > 0 ? 0 : dim;
						return (
							<g key={c} transform={s < 1 ? `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})` : undefined}>
								<g clipPath={`url(#cp_${c})`} style={dd > 0.01 ? {filter: `grayscale(${dd}) brightness(${1 - 0.3 * dd})`} : undefined}>
									<rect x={GEO.teams[c].b[0][0] - 400} y={GEO.teams[c].b[0][1] - 400} width={GEO.teams[c].b[1][0] - GEO.teams[c].b[0][0] + 800} height={GEO.teams[c].b[1][1] - GEO.teams[c].b[0][1] + 800} fill={T[o].scarf[0]} />
									{unified ? <Flag iso={o} x={r.x} y={r.y} w={r.w} h={r.h} /> : (GEO.teams[c].pb ?? [[r.x, r.y, r.x + r.w, r.y + r.h]]).map((q, qi) => <Flag key={qi} iso={o} x={q[0] - 1.5} y={q[1] - 1.5} w={q[2] - q[0] + 3} h={q[3] - q[1] + 3} />)}
									{conquest && conquest.countries.includes(c) && conquest.p > 0 && (
										<g clipPath="url(#cq)">
											{(() => {
												const rr = unified ? bboxOf([...owned(conquest.to), ...conquest.countries]) : bboxOf([c]);
												return <Flag iso={conquest.to} x={rr.x} y={rr.y} w={rr.w} h={rr.h} />;
											})()}
										</g>
									)}
									
								</g>
								{h > 0 && <path d={GEO.teams[c].d} fill="none" stroke={C.yellow} strokeWidth={9 / z} opacity={h} strokeLinejoin="round" />}
								<path d={GEO.teams[c].d} fill="none" stroke={C.navy} strokeWidth={2.6 / z} strokeLinejoin="round" />
							</g>
						);
					})}
					{/* territory outer outline (white) when an owner holds more than one */}
					{silhouette > 0 && (
						<g opacity={silhouette}>
							{ALL.map((c) => (
								<path key={c} d={GEO.teams[c].d} fill="#081428" stroke="#081428" strokeWidth={3 / z} />
							))}
						</g>
					)}
					{children}
					{/* faces */}
					{Object.entries(faces).map(([iso, f]) => {
						if (!f) return null;
						const o = iso as Iso;
						if ((pop[o] ?? 1) < 0.05) return null;
						const [lx, ly] = labelPt(o);
						const sz = faceSize(o, owners) * (f.scale ?? 1) * Math.min(1, pop[o] ?? 1);
						const k = sz / 100;
						return (
							<g key={iso} transform={`translate(${lx + (f.dx ?? 0)} ${ly + (f.dy ?? 0)}) scale(${k}) translate(-100 -98)`} opacity={1 - silhouette}>
								<Eyes mood={f.mood} blink={f.blink} look={f.look} />
								<Mouth mood={f.mood} open={f.open} />
							</g>
						);
					})}
				</g>
			</svg>
		</div>
	);
};
