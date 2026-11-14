import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD} from '../v5/WorldLayer5';
import {LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeOut} from '../ui';
import {Face12, FaceMood, INK} from '../v12/Atlas';
import iso from '../iso3flag.json';

// Shared kit for vertical Shorts (1080x1920)
export const SW = 1080, SH = 1920;
export const FLAG = iso as Record<string, string>;
export const toS = (cam: {x: number; y: number; z: number}, x: number, y: number): [number, number] => [SW / 2 + (x - cam.x) * cam.z, SH / 2 + (y - cam.y) * cam.z];

export const T: React.FC<{children: React.ReactNode; size: number; color?: string; p?: number; rot?: number; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', p = 1, rot = 0, style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1.02, color, WebkitTextStroke: `${size * 0.11}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 ${INK}`, whiteSpace: 'nowrap', textAlign: 'center', transform: `scale(${Math.max(0, p)}) rotate(${rot}deg)`, ...style}}>{children}</div>
);
export const Center: React.FC<{y: number; children: React.ReactNode; gap?: number}> = ({y, children, gap = 6}) => (
	<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
// big country sticker with face
export const CountryFace: React.FC<{k: string; x: number; y: number; w: number; mood: FaceMood; rot?: number; flag?: string; color?: string; look?: [number, number]; blink?: number; talk?: number; p?: number; faceK?: number}> = ({k, x, y, w, mood, rot = 0, flag, color, look, blink, talk, p = 1, faceK = 0.8}) => {
	const b = WORLD[k].b; const bw = b[1][0] - b[0][0], bh = b[1][1] - b[0][1];
	const S = w / bw, h = bh * S;
	const fl = flag ?? FLAG[k];
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${Math.max(0, p)})`}}>
			<svg width={w + 60} height={h + 60} style={{position: 'absolute', left: -30, top: -30, overflow: 'visible'}}>
				<defs><clipPath id={`sc${k}`}><path d={WORLD[k].d} /></clipPath></defs>
				<g transform={`translate(30 30) scale(${S}) translate(${-b[0][0]} ${-b[0][1]})`}>
					<path d={WORLD[k].d} fill="#06142A" opacity={0.4} transform={`translate(${5 / S} ${10 / S})`} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={26 / S} strokeLinejoin="round" />
					<path d={WORLD[k].d} fill="none" stroke="#fff" strokeWidth={16 / S} strokeLinejoin="round" />
					{color ? <path d={WORLD[k].d} fill={color} /> : <g clipPath={`url(#sc${k})`}><image href={staticFile(`flags/${fl}.svg`)} x={b[0][0] - 2} y={b[0][1] - 2} width={bw + 4} height={bh + 4} preserveAspectRatio="none" /></g>}
					<image href={staticFile('tex/relief.jpg')} x={0} y={20} width={3830} height={1720} preserveAspectRatio="none" clipPath={`url(#sc${k})`} style={{mixBlendMode: 'multiply'}} />
					<path d={WORLD[k].d} fill="none" stroke={INK} strokeWidth={4 / S} strokeLinejoin="round" />
				</g>
			</svg>
			<svg width={w * faceK} height={w * faceK} viewBox="0 0 200 200" style={{position: 'absolute', left: w * (1 - faceK) / 2, top: h / 2 - w * faceK / 2, overflow: 'visible'}}><Face12 mood={mood} look={look} blink={blink} talk={talk} /></svg>
		</div>
	);
};
export const Flag: React.FC<{f: string; w: number; style?: React.CSSProperties}> = ({f, w, style}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.66, borderRadius: Math.max(3, w * 0.12), border: `${w > 50 ? 4 : 3}px solid ${INK}`, objectFit: 'cover', flexShrink: 0, ...style}} />;
export const Stamp: React.FC<{text: string; col: string; t: number; y: number; size?: number; rot?: number}> = ({text, col, t, y, size = 92, rot = -5}) => {
	const p = t < 12 ? 2.2 - 1.2 * easeOut(t / 12) : 1;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
			<div style={{transform: `rotate(${rot}deg) scale(${p})`, opacity: clamp01(t / 5), padding: '12px 34px', borderRadius: 24, background: col, border: `7px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)'}}><T size={size} color="#fff">{text}</T></div>
		</div>
	);
};
export const Bubble: React.FC<{x: number; y: number; text: string; p: number; size?: number}> = ({x, y, text, p, size = 50}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${Math.max(0, p)})`, transformOrigin: '50% 100%'}}>
		<div style={{position: 'relative', padding: '16px 28px', borderRadius: 24, background: '#fff', border: `6px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: size, color: INK, whiteSpace: 'nowrap'}}>
			{text}
			<svg width={50} height={34} style={{position: 'absolute', left: 'calc(50% - 25px)', bottom: -31}}><path d="M3 0 L25 30 L47 0" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><rect x={5} y={-7} width={40} height={9} fill="#fff" /></svg>
		</div>
	</div>
);
export const Spark: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
	<svg width={s} height={s} viewBox="-20 -20 40 40" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${0.8 + 0.2 * Math.sin(f / 6 + x)}) rotate(${f * 1.5}deg)`}}><path d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18Z" fill="#FFE066" stroke={INK} strokeWidth={2.5} /></svg>
);
export const MiniFace: React.FC<{mood: FaceMood; s: number; bg?: string}> = ({mood, s, bg}) => (
	<svg width={s} height={s} viewBox="0 0 200 200" style={{flexShrink: 0}}>{bg && <circle cx={100} cy={100} r={96} fill={bg} stroke={INK} strokeWidth={8} />}<g transform={bg ? 'translate(18 14) scale(0.82)' : undefined}><Face12 mood={mood} noBlush /></g></svg>
);
// subscribe CTA block with cursor click
export const SubCta: React.FC<{u: number; at: number; s?: number}> = ({u, at, s = 1}) => {
	const click = u >= at;
	const press = u >= at - 4 && u < at + 6;
	const cur = easeOut((u - at + 34) / 30);
	return (
		<div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20 * s}}>
			<div style={{padding: `${16 * s}px ${40 * s}px`, borderRadius: 18 * s, background: click ? '#3A3A3A' : '#E1251B', border: `${6 * s}px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 52 * s, color: '#fff', boxShadow: '0 8px 0 rgba(0,0,0,0.35)', transform: `scale(${press ? 0.9 : 1})`}}>{click ? 'SUSCRITO' : 'SUSCRÍBETE'}</div>
			<svg width={84 * s} height={84 * s} viewBox="0 0 24 24" style={{transform: `rotate(${click ? Math.sin((u - at) / 2.5) * 22 * Math.max(0, 1 - (u - at) / 50) : 0}deg)`}}>
				<path d="M12 2a6 6 0 0 0-6 6v4l-2 3v1h16v-1l-2-3V8a6 6 0 0 0-6-6zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="#FFD23F" stroke={INK} strokeWidth={1.3} />
			</svg>
			{u >= at - 34 && u < at + 40 && (
				<svg width={90 * s} height={90 * s} viewBox="0 0 24 24" style={{position: 'absolute', left: 180 * s, top: 50 * s, transform: `translate(${(1 - cur) * 220}px, ${(1 - cur) * 160}px)`}}>
					<path d="M5 2 L5 20 L9.5 15.5 L13 22 L16 20.5 L12.5 14 L19 14 Z" fill="#fff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
				</svg>
			)}
		</div>
	);
};
export const Card: React.FC<{children: React.ReactNode; y: number; p: number; col?: string; x0?: number; w?: number}> = ({children, y, p, col = INK, x0 = 50, w = 980}) => (
	<div style={{position: 'absolute', left: x0, width: w, top: y, transform: `translateY(${(1 - p) * 700}px)`}}>
		<div style={{borderRadius: 30, background: '#FFF7E6', border: `7px solid ${col}`, boxShadow: `0 0 0 4px ${INK}, 0 12px 0 rgba(0,0,0,0.35)`, padding: '22px 30px 26px'}}>{children}</div>
	</div>
);
export const blinkOf = (f: number, seed: number) => { const ph = (f + seed * 37) % 220; return ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0; };
export const pop = (t: number) => backOut(t / 12);
export {AbsoluteFill};
