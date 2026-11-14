import React from 'react';
import {staticFile} from 'remotion';
import {Eyes, Mood, Mouth} from '../Hincha';
import {WORLD, bboxOf, isTiny} from './data2';

export type WCam = {x: number; y: number; z: number};
export type Vis = {flag: string; pop: number; mood?: Mood; look?: [number, number]; blink?: number; open?: number; color?: string; colorMix?: number; face?: boolean; faceScale?: number};

const KEYS = Object.keys(WORLD);

export const WorldLayer: React.FC<{
	cam: WCam;
	vis: Record<string, Vis>;
	ring?: {key: string; p: number; color: string} | null;
	silhouettes?: {key: string; p: number}[];
	dimOthers?: number;
	children?: React.ReactNode;
}> = ({cam, vis, ring, silhouettes = [], dimOthers = 0, children}) => {
	const z = cam.z;
	const tf = `translate(960 540) scale(${z}) translate(${-cam.x} ${-cam.y})`;
	const gx = (((-cam.x * z * 0.35) % 120) + 120) % 120;
	const gy = (((-cam.y * z * 0.35) % 120) + 120) % 120;
	const visKeys = Object.keys(vis).filter((k) => WORLD[k] && vis[k].pop > 0.001);
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #16467F 0%, #123A6B 55%, #0C2850 100%)'}} />
			<div style={{position: 'absolute', inset: 0, opacity: 0.55, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 2px, transparent 2px, transparent 120px), repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 2px, transparent 2px, transparent 120px)', backgroundPosition: `${gx}px ${gy}px`}} />
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<defs>
					{visKeys.map((k) => (
						<clipPath id={`w_${k}`} key={k}><path d={WORLD[k].d} /></clipPath>
					))}
				</defs>
				<g transform={tf}>
					<g transform={`translate(${3 / z} ${5 / z})`} opacity={0.4}>
						{KEYS.map((k) => <path key={k} d={WORLD[k].d} fill="#06142B" />)}
					</g>
					{KEYS.map((k) => (
						<path key={k} d={WORLD[k].d} fill="#2A3B58" stroke="#4A5D7E" strokeWidth={0.9 / z} />
					))}
					{visKeys.map((k) => {
						const v = vis[k];
						const b = WORLD[k].b;
						const [cx, cy] = WORLD[k].c;
						const s = v.pop;
						const tr = s < 1 ? `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})` : undefined;
						return (
							<g key={k} transform={tr}>
								<path d={WORLD[k].d} fill="#04101F" opacity={0.45} transform={`translate(${3 / z} ${5 / z})`} />
								<g clipPath={`url(#w_${k})`}>
									<rect x={b[0][0] - 2} y={b[0][1] - 2} width={b[1][0] - b[0][0] + 4} height={b[1][1] - b[0][1] + 4} fill="#2A3B58" />
									<image href={staticFile(`flags/${v.flag}.svg`)} x={b[0][0]} y={b[0][1]} width={b[1][0] - b[0][0]} height={b[1][1] - b[0][1]} preserveAspectRatio="xMidYMid slice" />
									{v.colorMix ? <path d={WORLD[k].d} fill={v.color} opacity={v.colorMix} /> : null}
								</g>
								<path d={WORLD[k].d} fill="none" stroke="#0B1E3F" strokeWidth={1.8 / z} strokeLinejoin="round" />
							</g>
						);
					})}
					{dimOthers > 0 && <rect x={-5000} y={-5000} width={20000} height={20000} fill="#0B1E3F" opacity={0} />}
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
