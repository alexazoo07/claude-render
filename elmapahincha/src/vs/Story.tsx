// Story engine: "¿Qué pasaría si...?" videos on the Atlas map (no voice: titles, cards, rankings, big numbers, bubbles)
import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key, Subscribe, Confetti} from '../common';
import {Atlas, FaceMood, FaceSpec, Fill, INK, toScreen} from '../v12/Atlas';
import F3 from '../iso3flag.json';

const FPS = 60;
const CREAM = '#FFF7E6';
const GOLD = '#FFD23F';
const RED = '#FF4D5E';
export const FL: Record<string, string> = {...(F3 as Record<string, string>), ENG: 'gb-eng', SCT: 'gb-sct', WLS: 'gb-wls', NIR: 'gb-nir'};

export type Row = {k?: string; flag?: string; label: string; v: number; hl?: boolean; col?: string};
export type El =
	| {t: 'title'; text: string; hl?: string; sub?: string; at?: number; y?: number; size?: number}
	| {t: 'card'; title: string; lines: string[]; tag?: string; flag?: string; at?: number; pos?: 'bl' | 'br' | 'tr' | 'r'; col?: string}
	| {t: 'rank'; title: string; unit: string; rows: Row[]; at?: number; dec?: number; side?: 'r' | 'l'}
	| {t: 'big'; n: number; pre?: string; suf?: string; cap: string; at?: number; dec?: number; col?: string; x?: number; y?: number}
	| {t: 'bubble'; k: string; text: string; at?: number; dur?: number; side?: 'l' | 'r'}
	| {t: 'chips'; title?: string; items: {flag?: string; text: string; sub?: string}[]; at?: number; step?: number; y?: number}
	| {t: 'stamp'; text: string; at?: number; col?: string; x?: number; y?: number}
	| {t: 'vs'; a: {flag: string; label: string; sub?: string}; b: {flag: string; label: string; sub?: string}; at?: number}
	| {t: 'sub'; f: number; x?: number; y?: number}
	| {t: 'confetti'; at?: number};
export type Scene = {
	dur: number; label?: string; cam?: string[] | WCam; camBox?: [number, number, number, number]; fills?: Record<string, Fill>; pop?: string[]; popStep?: number;
	faces?: Record<string, FaceSpec>; talk?: string[]; map?: (t: number, dur: number) => React.ReactNode; els: El[]; dark?: number; music?: string; sfx?: [number, string, number][];
};
export type StoryCfg = {scenes: Scene[]; source: string; region?: string; endAsk: string};

// ---------------------------------------------------------------- helpers
const T: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; shadow?: number; style?: React.CSSProperties}> = ({children, size, color = '#fff', stroke, shadow, style}) => (
	<span style={{fontFamily: LILITA, fontSize: size, color, lineHeight: 1.05, WebkitTextStroke: `${stroke ?? size * 0.1}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${shadow ?? size * 0.07}px 0 ${INK}`, ...style}}>{children}</span>
);
const Flag: React.FC<{f: string; w: number; r?: number}> = ({f, w, r = 6}) => <img src={staticFile(`flags/${f}.svg`)} style={{width: w, height: w * 0.66, objectFit: 'cover', borderRadius: r, border: `3px solid ${INK}`, display: 'block', flexShrink: 0}} />;
export const fitCam = (keys: string[], cx = 700, cy = 560, w = 1150, h = 840, minSpan = 160, zMax = 5): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of keys) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	return boxCam([x0, y0, x1, y1], cx, cy, w, h, minSpan, zMax);
};
export const boxCam = ([x0, y0, x1, y1]: [number, number, number, number], cx = 700, cy = 560, w = 1150, h = 840, minSpan = 160, zMax = 5): WCam => {
	if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; }
	if (y1 - y0 < minSpan * 0.6) { const c = (y0 + y1) / 2; y0 = c - minSpan * 0.3; y1 = c + minSpan * 0.3; }
	const z = Math.max(0.5, Math.min(zMax, Math.min(w / (x1 - x0), h / (y1 - y0))));
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const fmt = (v: number, dec = 0) => v.toLocaleString('es-ES', {minimumFractionDigits: dec, maximumFractionDigits: dec}).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

// ---------------------------------------------------------------- overlay widgets
const Title: React.FC<{e: Extract<El, {t: 'title'}>; u: number; out: number}> = ({e, u, out}) => {
	const sz = e.size ?? 88;
	const parts = e.hl ? e.text.split(e.hl) : [e.text];
	return (
		<div style={{position: 'absolute', left: 40, right: 40, top: e.y ?? 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 1 - out}}>
			<div style={{transform: `scale(${backOut(u / 12)}) rotate(-1.5deg)`, textAlign: 'center', maxWidth: 1700}}>
				<T size={sz}>{parts[0]}{e.hl && <span style={{color: GOLD, display: 'inline-block', transform: `rotate(${Math.sin(u / 4) * 1.5}deg)`}}>{e.hl}</span>}{parts[1]}</T>
			</div>
			{e.sub && <div style={{transform: `scale(${backOut((u - 14) / 12)})`, padding: '6px 22px', borderRadius: 14, background: '#1B1D26', border: '4px solid #fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}><T size={38} stroke={0} shadow={0}>{e.sub}</T></div>}
		</div>
	);
};
const Card: React.FC<{e: Extract<El, {t: 'card'}>; u: number; out: number}> = ({e, u, out}) => {
	const pos = e.pos ?? 'bl';
	const st: React.CSSProperties = pos === 'bl' ? {left: 40, bottom: 60} : pos === 'br' ? {right: 40, bottom: 60} : pos === 'tr' ? {right: 40, top: 150} : {right: 40, top: 300};
	const p = backOut(u / 14);
	return (
		<div style={{position: 'absolute', width: 760, ...st, transform: `translateY(${(1 - p) * 300}px)`, opacity: clamp01(u / 6) * (1 - out)}}>
			{e.tag && <div style={{display: 'inline-block', marginLeft: 22, padding: '4px 14px', borderRadius: '10px 10px 0 0', background: e.col ?? '#E8394A', fontFamily: LILITA, fontSize: 24, color: '#fff', border: `3px solid ${INK}`, borderBottom: 'none'}}>{e.tag}</div>}
			<div style={{borderRadius: 22, background: CREAM, border: `5px solid ${INK}`, boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '16px 22px'}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
					{e.flag && <Flag f={e.flag} w={64} />}
					<span style={{fontFamily: LILITA, fontSize: 44, color: INK, lineHeight: 1.05}}>{e.title}</span>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8}}>
					{e.lines.map((l, i) => (
						<div key={i} style={{display: 'flex', gap: 10, alignItems: 'flex-start', opacity: clamp01((u - 20 - i * 26) / 10), transform: `translateX(${(1 - easeOut((u - 20 - i * 26) / 14)) * -40}px)`}}>
							<span style={{marginTop: 9, width: 12, height: 12, borderRadius: 6, background: e.col ?? '#E8394A', flexShrink: 0, border: `2px solid ${INK}`}} />
							<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#2B2A26', lineHeight: 1.2}}>{l}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
const Rank: React.FC<{e: Extract<El, {t: 'rank'}>; u: number; out: number}> = ({e, u, out}) => {
	const rows = e.rows.slice().sort((a, b) => b.v - a.v);
	const max = rows[0].v;
	const hl = rows.findIndex((r) => r.hl);
	const N = rows.length;
	const rh = Math.min(74, 640 / N);
	const p = backOut(u / 14);
	const enter = 30 + N * 10 + 40; // highlighted row drops in after others
	return (
		<div style={{position: 'absolute', [e.side === 'l' ? 'left' : 'right']: 40, top: 170, width: 780, transform: `translateX(${(1 - p) * (e.side === 'l' ? -900 : 900)}px)`, opacity: 1 - out}}>
			<div style={{borderRadius: 24, background: 'rgba(18,20,28,0.93)', border: '4px solid #fff', boxShadow: '0 10px 0 rgba(0,0,0,0.35)', padding: '16px 20px 18px'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10}}>
					<T size={40} stroke={0} shadow={0}>{e.title}</T>
					<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.7)'}}>{e.unit}</span>
				</div>
				<div style={{position: 'relative', height: N * rh}}>
					{rows.map((r, i) => {
						const isH = i === hl;
						const others = rows.filter((x) => !x.hl);
						const iNo = isH ? -1 : others.indexOf(r);
						// before entering, rows sit at their positions without the highlighted row
						const ent = isH ? easeInOut((u - enter) / 30) : 1;
						const yBefore = isH ? i : (iNo);
						const yAfter = i;
						const hEnter = easeInOut((u - enter) / 30);
						const y = isH ? i * rh : ((hl >= 0 ? (hEnter * yAfter + (1 - hEnter) * yBefore) : yAfter)) * rh;
						const appear = isH ? ent : easeOut((u - 20 - iNo * 8) / 14);
						const w = (r.v / max) * 420 * (isH ? easeOut((u - enter - 10) / 40) : easeOut((u - 24 - iNo * 8) / 30));
						const col = r.col ?? (isH ? GOLD : '#4C8DFF');
						return (
							<div key={r.label} style={{position: 'absolute', left: 0, right: 0, top: y, height: rh - 8, display: 'flex', alignItems: 'center', gap: 10, opacity: appear, transform: isH ? `scale(${1 + 0.06 * Math.sin(clamp01((u - enter - 30) / 20) * Math.PI)}) translateX(${(1 - ent) * 400}px)` : undefined}}>
								<span style={{width: 40, fontFamily: LILITA, fontSize: Math.min(32, rh * 0.5), color: isH ? GOLD : '#fff', textAlign: 'right'}}>{i + 1}º</span>
								{(r.flag || r.k) && <Flag f={r.flag ?? FL[r.k!]} w={Math.min(54, rh * 0.95)} r={4} />}
								<span style={{width: 190, fontFamily: RUBIK, fontWeight: 800, fontSize: Math.min(25, rh * 0.42), color: isH ? GOLD : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{r.label}</span>
								<div style={{height: rh * 0.5, width: Math.max(4, w), borderRadius: 8, background: col, border: `3px solid ${INK}`, boxShadow: isH ? `0 0 18px ${GOLD}` : undefined}} />
								<span style={{fontFamily: LILITA, fontSize: Math.min(28, rh * 0.45), color: isH ? GOLD : '#fff', whiteSpace: 'nowrap'}}>{fmt(r.v, e.dec)}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
const Big: React.FC<{e: Extract<El, {t: 'big'}>; u: number; out: number}> = ({e, u, out}) => {
	const v = e.n * easeOut(u / 50);
	return (
		<div style={{position: 'absolute', left: (e.x ?? 1340) - 500, width: 1000, top: e.y ?? 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 1 - out, transform: `scale(${backOut(u / 14)}) rotate(-2deg)`}}>
			<T size={150} color={e.col ?? GOLD}>{e.pre ?? ''}{fmt(v, e.dec)}{e.suf ?? ''}</T>
			<div style={{padding: '6px 20px', borderRadius: 14, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', maxWidth: 900, textAlign: 'center'}}><span style={{fontFamily: LILITA, fontSize: 40, color: INK}}>{e.cap}</span></div>
		</div>
	);
};
const Bubble: React.FC<{x: number; y: number; text: string; p: number; side: 'l' | 'r'}> = ({x, y, text, p, side}) => (
	<div style={{position: 'absolute', left: side === 'r' ? x + 30 : x - 30, top: y - 140, transform: `translateX(${side === 'r' ? 0 : -100}%) scale(${p})`, transformOrigin: side === 'r' ? '0% 100%' : '100% 100%'}}>
		<div style={{position: 'relative', padding: '12px 22px', borderRadius: 22, background: '#fff', border: `5px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)', fontFamily: LILITA, fontSize: 38, color: INK, whiteSpace: 'nowrap'}}>
			{text}
			<svg width={44} height={30} style={{position: 'absolute', [side === 'r' ? 'left' : 'right']: 16, bottom: -27}}><path d={side === 'r' ? 'M2 0 L4 28 L36 0' : 'M42 0 L40 28 L8 0'} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={4} y={-6} width={36} height={8} fill="#fff" /></svg>
		</div>
	</div>
);
const Chips: React.FC<{e: Extract<El, {t: 'chips'}>; u: number; out: number}> = ({e, u, out}) => (
	<div style={{position: 'absolute', left: 60, right: 60, top: e.y ?? 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: 1 - out}}>
		{e.title && <div style={{transform: `scale(${backOut(u / 12)})`}}><T size={46}>{e.title}</T></div>}
		<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14}}>
			{e.items.map((it, i) => (
				<div key={i} style={{transform: `scale(${backOut((u - 10 - i * (e.step ?? 10)) / 10)})`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 16, background: CREAM, border: `4px solid ${INK}`, boxShadow: '0 6px 0 rgba(0,0,0,0.3)'}}>
					{it.flag && <Flag f={it.flag} w={52} r={4} />}
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<span style={{fontFamily: LILITA, fontSize: 38, color: INK, lineHeight: 1}}>{it.text}</span>
						{it.sub && <span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#6B6250'}}>{it.sub}</span>}
					</div>
				</div>
			))}
		</div>
	</div>
);
const Stamp: React.FC<{e: Extract<El, {t: 'stamp'}>; u: number; out: number}> = ({e, u, out}) => {
	const s = u < 0 ? 0 : 1 + 1.6 * Math.max(0, 1 - u / 8);
	return (
		<div style={{position: 'absolute', left: (e.x ?? 960) - 600, width: 1200, top: e.y ?? 470, display: 'flex', justifyContent: 'center', opacity: (u >= 0 ? 1 : 0) * (1 - out)}}>
			<div style={{transform: `scale(${s}) rotate(-6deg)`, padding: '10px 34px', borderRadius: 18, border: `8px solid ${e.col ?? RED}`, background: 'rgba(255,255,255,0.93)', boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
				<span style={{fontFamily: LILITA, fontSize: 84, color: e.col ?? RED, whiteSpace: 'nowrap'}}>{e.text}</span>
			</div>
		</div>
	);
};
const VSel: React.FC<{e: Extract<El, {t: 'vs'}>; u: number; out: number}> = ({e, u, out}) => {
	const side = (s: {flag: string; label: string; sub?: string}, d: number) => (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `translateX(${(1 - backOut((u - 6) / 14)) * d * 700}px)`}}>
			<Flag f={s.flag} w={300} r={14} />
			<T size={56}>{s.label}</T>
			{s.sub && <div style={{padding: '4px 16px', borderRadius: 12, background: '#fff', border: `4px solid ${INK}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: INK}}>{s.sub}</div>}
		</div>
	);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 90, opacity: 1 - out}}>
			{side(e.a, -1)}
			<div style={{width: 170, height: 170, borderRadius: '50%', background: GOLD, border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${backOut((u - 20) / 10)}) rotate(-8deg)`, fontFamily: LILITA, fontSize: 84, color: INK}}>VS</div>
			{side(e.b, 1)}
		</div>
	);
};

// ---------------------------------------------------------------- engine
export function makeStory(C: StoryCfg) {
	const SC = C.scenes;
	const START: number[] = [];
	let t = 0;
	for (const s of SC) { START.push(t); t += s.dur; }
	const TOTAL = t;
	const camOf = (s: Scene): WCam => (s.camBox ? boxCam(s.camBox) : !s.cam ? {x: 1880, y: 880, z: 0.52} : Array.isArray(s.cam) ? fitCam(s.cam) : s.cam);
	const KEYS: Key[] = [];
	SC.forEach((s, i) => { const c = camOf(s); KEYS.push([START[i] + Math.min(50, s.dur * 0.3), c.x, c.y, c.z]); KEYS.push([START[i] + s.dur, c.x, c.y, c.z * 1.04]); });
	KEYS.unshift([0, KEYS[0][1], KEYS[0][2], KEYS[0][3] * 0.9]);

	const sfx = () => {
		const out: {f: number; name: string; vol: number}[] = [];
		const S = (f: number, name: string, vol = 0.4) => out.push({f: Math.round(f), name, vol});
		SC.forEach((s, i) => {
			const f0 = START[i];
			if (i > 0) S(f0 - 6, `whoosh_${(i % 4) + 1}`, 0.32);
			(s.pop ?? []).forEach((_, j) => { if (j < 24) S(f0 + 20 + j * (s.popStep ?? 6), `pop_${(j % 4) + 1}`, 0.22); });
			for (const e of s.els) {
				const at = f0 + ('at' in e && e.at ? e.at : 0);
				if (e.t === 'title') S(at + 2, 'slap', 0.35);
				else if (e.t === 'card') S(at, 'select', 0.3);
				else if (e.t === 'rank') { S(at, 'whoosh_2', 0.3); S(at + 30 + e.rows.length * 10 + 40, 'up', 0.45); S(at + 30 + e.rows.length * 10 + 72, 'confirm', 0.35); }
				else if (e.t === 'big') { S(at, 'riser', 0.25); S(at + 50, 'boom', 0.35); }
				else if (e.t === 'bubble') S(at, 'pop_2', 0.35);
				else if (e.t === 'chips') e.items.forEach((_, j) => S(at + 10 + j * (e.step ?? 10), `pop_${(j % 4) + 1}`, 0.25));
				else if (e.t === 'stamp') S(at, 'slap', 0.5);
				else if (e.t === 'vs') { S(at + 6, 'whoosh_3', 0.4); S(at + 22, 'kick', 0.4); }
				else if (e.t === 'confetti') S(at, 'crowd_roar', 0.25);
			}
			(s.sfx ?? []).forEach(([df, n, v]) => S(f0 + df, n, v));
		});
		return out.sort((a, b) => a.f - b.f);
	};
	const music = () => {
		const segs: string[] = [];
		let cur = SC[0].music ?? 'm_tense', a = 0;
		SC.forEach((s, i) => { const m = s.music ?? cur; if (m !== cur) { segs.push(`${cur}:${(a / FPS).toFixed(2)}:${((START[i] + 40) / FPS).toFixed(2)}`); cur = m; a = START[i]; } });
		segs.push(`${cur}:${(a / FPS).toFixed(2)}:${(TOTAL / FPS).toFixed(2)}`);
		return segs.join(',');
	};

	const Video: React.FC = () => {
		const f = useCurrentFrame();
		let i = 0;
		while (i < SC.length - 1 && f >= START[i + 1]) i++;
		const s = SC[i];
		const u = f - START[i];
		const out = easeInOut((u - s.dur + 16) / 14);
		const cam = camPath(KEYS, f, 3);
		const fills: Record<string, Fill> = {};
		for (const [k, v] of Object.entries(s.fills ?? {})) {
			const pj = (s.pop ?? []).indexOf(k);
			if (pj >= 0) { const g = u - 20 - pj * (s.popStep ?? 6); if (g < 0) continue; fills[k] = {...v, pop: (v.pop ?? 1) * (0.85 + 0.15 * elastic(g / FPS)) }; }
			else fills[k] = v;
		}
		const faces: Record<string, FaceSpec> = {};
		for (const [k, v] of Object.entries(s.faces ?? {})) {
			const pj = (s.pop ?? []).indexOf(k);
			const g = pj >= 0 ? u - 24 - pj * (s.popStep ?? 6) : u - 10;
			if (g < 0) continue;
			const seed = k.charCodeAt(0) * 7 + k.charCodeAt(1);
			const ph = (f + seed * 37) % (170 + (seed % 5) * 23);
			const talking = (s.talk ?? []).includes(k) || s.els.some((e) => e.t === 'bubble' && e.k === k && u >= (e.at ?? 0) && u < (e.at ?? 0) + (e.dur ?? 150));
			faces[k] = {...v, pop: (v.pop ?? 1) * elastic(g / FPS), blink: ph < 8 ? Math.sin((ph / 8) * Math.PI) : 0, talk: talking ? Math.abs(Math.sin(f / 3.2)) : 0};
		}
		const elU = (e: El) => u - ('at' in e && e.at ? e.at : 0);
		return (
			<AbsoluteFill style={{background: '#2A72BA'}}>
				<Fonts />
				<Atlas cam={cam} fills={fills} faces={faces} dark={s.dark ?? 0}>{s.map ? s.map(u, s.dur) : null}</Atlas>
				{s.label && (
					<div style={{position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 12, background: '#1B1D26', border: '3px solid #fff', opacity: clamp01(u / 10), boxShadow: '0 4px 0 rgba(0,0,0,0.35)'}}>
						<span style={{width: 14, height: 14, borderRadius: 7, background: GOLD}} />
						<span style={{fontFamily: LILITA, fontSize: 26, color: '#fff'}}>{s.label}</span>
					</div>
				)}
				{s.els.map((e, j) => {
					const eu = elU(e);
					if (eu < 0 && e.t !== 'stamp') return null;
					if (e.t === 'title') return <Title key={j} e={e} u={eu} out={out} />;
					if (e.t === 'card') return <Card key={j} e={e} u={eu} out={out} />;
					if (e.t === 'rank') return <Rank key={j} e={e} u={eu} out={out} />;
					if (e.t === 'big') return <Big key={j} e={e} u={eu} out={out} />;
					if (e.t === 'chips') return <Chips key={j} e={e} u={eu} out={out} />;
					if (e.t === 'stamp') return <Stamp key={j} e={e} u={eu} out={out} />;
					if (e.t === 'vs') return <VSel key={j} e={e} u={eu} out={out} />;
					if (e.t === 'sub') return <Subscribe key={j} f={u} start={e.f} style={{position: 'absolute', left: e.x ?? 60, top: e.y ?? 160}} />;
					if (e.t === 'confetti') return <Confetti key={j} f={u} start={e.at ?? 0} />;
					if (e.t === 'bubble') {
						const d = e.dur ?? 150;
						if (eu > d) return null;
						const W = WORLD[e.k];
						const [x, y] = toScreen(cam, W.c[0], W.c[1]);
						const p = backOut(eu / 10) * (1 - easeInOut((eu - d + 10) / 10));
						return <Bubble key={j} x={x} y={y - 20} text={e.text} p={p} side={e.side ?? (x > 1200 ? 'l' : 'r')} />;
					}
					return null;
				})}
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 26, background: 'rgba(10,12,18,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.85)'}}>{C.source}</div>
				{f >= TOTAL - 40 && <AbsoluteFill style={{background: '#000', opacity: clamp01((f - TOTAL + 40) / 40)}} />}
			</AbsoluteFill>
		);
	};
	return {Video, TOTAL, sfx, music, START};
}
export const OutroEls = (ask: string): El[] => [
	{t: 'title', text: ask, at: 10, y: 300, size: 76},
	{t: 'title', text: 'Déjalo en los comentarios ↓', at: 70, y: 420, size: 48},
	{t: 'sub', f: 200, x: 1150, y: 700},
];
export type {FaceMood};
