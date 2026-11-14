import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {Eyes, Mood, Mouth} from '../Hincha';
import world from '../world.json';
import {FlagCover} from '../flagCover';

export type WCam = {x: number; y: number; z: number};
export type Vis = {flag: string; pop: number; mood?: Mood; look?: [number, number]; blink?: number; open?: number; color?: string; colorMix?: number; face?: boolean; faceScale?: number; glow?: string};
type W = {d: string; c: [number, number]; b: [[number, number], [number, number]]; pb: number[][]};
export const WORLD = world as unknown as Record<string, W>;
const KEYS = Object.keys(WORLD);
// overseas parts that should wear the same flag
export const EXTRA_PARTS: Record<string, string[]> = {FRA: ['GUF'], NLD: [], NOR: []};

export const bboxOf = (k: string) => {
	const b = WORLD[k].b;
	let [x0, y0] = b[0], [x1, y1] = b[1];
	const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
	const minS = 14;
	if (x1 - x0 < minS) { x0 = cx - minS / 2; x1 = cx + minS / 2; }
	if (y1 - y0 < minS) { y0 = cy - minS / 2; y1 = cy + minS / 2; }
	return {x0, y0, x1, y1, cx, cy, w: x1 - x0, h: y1 - y0};
};
export const isTiny = (k: string) => {
	const b = WORLD[k].b;
	return Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]) < 14;
};

const FlagFill: React.FC<{k: string; flag: string; id: string}> = ({k, flag, id}) => {
	const boxes = WORLD[k].pb && WORLD[k].pb.length ? WORLD[k].pb : [[WORLD[k].b[0][0], WORLD[k].b[0][1], WORLD[k].b[1][0], WORLD[k].b[1][1]]];
	return (
		<g clipPath={`url(#${id})`}>
			{boxes.map((q, i) => {
				const pad = 1.5;
				return <FlagCover key={i} flag={flag} x={q[0] - pad} y={q[1] - pad} w={q[2] - q[0] + pad * 2} h={q[3] - q[1] + pad * 2} />;
			})}
		</g>
	);
};

export const WorldLayer: React.FC<{
	cam: WCam;
	vis: Record<string, Vis>;
	ring?: {key: string; p: number; color: string} | null;
	silhouettes?: {key: string; p: number}[];
	children?: React.ReactNode;
	under?: React.ReactNode;
}> = ({cam, vis, ring, silhouettes = [], children, under}) => {
	const f = useCurrentFrame();
	const z = cam.z;
	const tf = `translate(960 540) scale(${z}) translate(${-cam.x} ${-cam.y})`;
	// ocean texture follows the map (parallax) and drifts slowly
	const S = 760 * Math.pow(z, 0.55);
	const ox = 960 - cam.x * z * 0.9 + f * 0.25;
	const oy = 540 - cam.y * z * 0.9 + f * 0.12;
	const visKeys = Object.keys(vis).filter((k) => WORLD[k] && vis[k].pop > 0.001);
	const parts: {k: string; owner: string}[] = [];
	for (const k of visKeys) for (const e of EXTRA_PARTS[k] ?? []) if (WORLD[e]) parts.push({k: e, owner: k});
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, backgroundColor: '#1B5592', backgroundImage: `url(${staticFile('tex/ocean.png')})`, backgroundSize: `${S}px ${S}px`, backgroundPosition: `${ox}px ${oy}px`}} />
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(120,190,255,0.10) 0%, rgba(0,0,0,0) 45%, rgba(4,16,40,0.45) 100%)'}} />
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>
					{[...visKeys, ...parts.map((p) => p.k)].map((k) => <clipPath id={`w5_${k}`} key={k}><path d={WORLD[k].d} /></clipPath>)}
				</defs>
				<g transform={tf}>
					{/* shallow-water halo along every coast */}
					<g fill="none" strokeLinejoin="round">
						<g stroke="#8FD0FF" strokeWidth={18 / z} opacity={0.13}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
						<g stroke="#B9E4FF" strokeWidth={7 / z} opacity={0.22}>{KEYS.map((k) => <path key={k} d={WORLD[k].d} />)}</g>
					</g>
					<g transform={`translate(${3 / z} ${5 / z})`} opacity={0.45}>
						{KEYS.map((k) => <path key={k} d={WORLD[k].d} fill="#06142B" />)}
					</g>
					{KEYS.map((k) => <path key={k} d={WORLD[k].d} fill="#3A4862" stroke="#5B6C8C" strokeWidth={0.9 / z} />)}
					{under}
					{parts.map(({k, owner}) => (
						<g key={'p' + k}>
							<FlagFill k={k} flag={vis[owner].flag} id={`w5_${k}`} />
							<path d={WORLD[k].d} fill="none" stroke="#0B1E3F" strokeWidth={1.6 / z} />
						</g>
					))}
					{visKeys.map((k) => {
						const v = vis[k];
						const [cx, cy] = WORLD[k].c;
						const s = v.pop;
						const tr = s < 1 ? `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})` : undefined;
						return (
							<g key={k} transform={tr}>
								<path d={WORLD[k].d} fill="#04101F" opacity={0.45} transform={`translate(${3 / z} ${5 / z})`} />
								{v.glow && <path d={WORLD[k].d} fill="none" stroke={v.glow} strokeWidth={9 / z} opacity={0.75} strokeLinejoin="round" />}
								<path d={WORLD[k].d} fill="#3A4862" />
								<FlagFill k={k} flag={v.flag} id={`w5_${k}`} />
								{v.colorMix ? <path d={WORLD[k].d} fill={v.color} opacity={v.colorMix} /> : null}
								<path d={WORLD[k].d} fill="none" stroke="#0B1E3F" strokeWidth={1.8 / z} strokeLinejoin="round" />
							</g>
						);
					})}
					{silhouettes.map(({key, p}) => (
						<g key={'s' + key} opacity={p}>
							<path d={WORLD[key].d} fill="#0A1224" stroke="#E63946" strokeWidth={3 / z} strokeLinejoin="round" />
						</g>
					))}
					{ring && (() => {
						const bb = bboxOf(ring.key);
						const r = Math.max(bb.w, bb.h) * 0.75 + 6 / z;
						return (
							<g opacity={ring.p}>
								<circle cx={bb.cx} cy={bb.cy} r={r * (1 + 0.06 * Math.sin(ring.p * 20))} fill="none" stroke={ring.color} strokeWidth={4 / z} />
								<circle cx={bb.cx} cy={bb.cy} r={r * 1.18} fill="none" stroke={ring.color} strokeWidth={2 / z} opacity={0.5} strokeDasharray={`${6 / z} ${6 / z}`} />
							</g>
						);
					})()}
					{children}
					{visKeys.map((k) => {
						const v = vis[k];
						if (v.face === false || v.pop < 0.05) return null;
						const bb = bboxOf(k);
						const [cx, cy] = WORLD[k].c;
						const tiny = isTiny(k);
						const base = tiny ? 9 : Math.max(7, Math.min(60, Math.min(bb.w, bb.h) * 0.55));
						const sz = Math.min(base * (v.faceScale ?? 1), 150 / z) * Math.min(1, v.pop);
						return (
							<g key={'f' + k} transform={`translate(${cx} ${cy}) scale(${sz / 100}) translate(-100 -98)`}>
								<Eyes mood={v.mood ?? 'feliz'} blink={v.blink} look={v.look} />
								<Mouth mood={v.mood ?? 'feliz'} open={v.open} />
							</g>
						);
					})}
				</g>
			</svg>
		</div>
	);
};
