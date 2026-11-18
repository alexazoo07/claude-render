// piezas reutilizables para los shorts (copas, estrellas, chips, sellos…)
import React from 'react';
import {interpolate, staticFile} from 'remotion';
import {INK} from '../v21/Atlas21';
import {FL} from '../v21/data21';
import {T, YEL, RED, PopIn, Timeline} from './VShort2';

export const Star: React.FC<{s: number; c?: string; grey?: boolean}> = ({s, c = YEL, grey}) => (
	<svg width={s} height={s} viewBox="-50 -50 100 100" style={{overflow: 'visible', filter: grey ? 'grayscale(1) opacity(0.45)' : 'drop-shadow(0 0 10px rgba(255,210,63,0.9))'}}><path d="M0 -46 L13 -14 L46 -12 L20 9 L29 42 L0 23 L-29 42 L-20 9 L-46 -12 L-13 -14 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></svg>
);
export const Cup: React.FC<{s: number; grey?: boolean}> = ({s, grey}) => (
	<svg width={s * 0.8} height={s} viewBox="-4 -4 88 108" style={{overflow: 'visible', filter: grey ? 'grayscale(1) brightness(0.6)' : 'drop-shadow(0 4px 0 rgba(0,0,0,0.35))'}}>
		<g stroke="#fff" strokeWidth={14} strokeLinejoin="round" fill="#fff"><path d="M14 4 H66 C66 40 56 56 40 58 C24 56 14 40 14 4 Z" /><rect x={20} y={58} width={40} height={30} /></g>
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
		<path d="M18 10 C4 10 4 34 22 40 M62 10 C76 10 76 34 58 40" fill="none" stroke="#F2B705" strokeWidth={4} strokeLinecap="round" />
		<path d="M14 4 H66 C66 40 56 56 40 58 C24 56 14 40 14 4 Z" fill="#F2B705" stroke={INK} strokeWidth={5} />
		<path d="M24 10 C24 30 30 44 38 50" fill="none" stroke="#FFF3B0" strokeWidth={5} strokeLinecap="round" />
		<rect x={33} y={58} width={14} height={16} fill="#D69A00" stroke={INK} strokeWidth={5} />
		<rect x={20} y={74} width={40} height={14} rx={3} fill="#7A4A1A" stroke={INK} strokeWidth={5} />
	</svg>
);
// Euro trophy (silver, tall)
export const Euro: React.FC<{s: number; grey?: boolean}> = ({s, grey}) => (
	<svg width={s * 0.62} height={s} viewBox="-4 -4 70 118" style={{overflow: 'visible', filter: grey ? 'grayscale(1) brightness(0.55)' : 'drop-shadow(0 4px 0 rgba(0,0,0,0.35))'}}>
		<g stroke="#fff" strokeWidth={14} strokeLinejoin="round" fill="#fff"><path d="M14 2 H48 V70 H14 Z" /><rect x={8} y={70} width={46} height={36} /></g>
		<path d="M14 6 C2 6 2 30 16 34 M48 6 C60 6 60 30 46 34" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
		<path d="M14 6 C2 6 2 30 16 34 M48 6 C60 6 60 30 46 34" fill="none" stroke="#D9DEE6" strokeWidth={3.5} strokeLinecap="round" />
		<path d="M14 2 H48 L44 70 H18 Z" fill="#D9DEE6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
		<path d="M22 8 L24 62" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
		<rect x={8} y={70} width={46} height={10} fill="#B8C0CC" stroke={INK} strokeWidth={5} />
		<rect x={12} y={80} width={38} height={24} rx={3} fill="#1F3A8A" stroke={INK} strokeWidth={5} />
	</svg>
);
export const Crown: React.FC<{s: number}> = ({s}) => (
	<svg width={s} height={s * 0.7} viewBox="0 0 100 70" style={{overflow: 'visible', filter: 'drop-shadow(0 0 12px rgba(255,210,63,0.9))'}}><path d="M8 62 L4 16 L28 36 L50 6 L72 36 L96 16 L92 62 Z" fill={YEL} stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle cx={50} cy={44} r={7} fill={RED} stroke={INK} strokeWidth={4} /><circle cx={26} cy={48} r={5} fill="#3FA9F5" stroke={INK} strokeWidth={3} /><circle cx={74} cy={48} r={5} fill="#3FA9F5" stroke={INK} strokeWidth={3} /></svg>
);
export const Mini: React.FC<{k: string; s: number; grey?: boolean}> = ({k, s, grey}) => (
	<div style={{width: s, height: s, borderRadius: '50%', overflow: 'hidden', border: `${s * 0.07}px solid #fff`, boxShadow: `0 0 0 ${s * 0.05}px ${INK}`, flex: 'none', filter: grey ? 'grayscale(1) brightness(0.7)' : undefined, transition: 'none'}}><img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
);
export const Row: React.FC<{y: number; children: React.ReactNode; gap?: number}> = ({y, children, gap = 18}) => <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap}}>{children}</div>;
export const Chip: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#fff'}) => <div style={{background: bg, border: `6px solid ${INK}`, borderRadius: 20, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 7px 0 ${INK}`}}>{children}</div>;
export const Score: React.FC<{a: string; b: string; sc: string; s?: number; greyA?: boolean; greyB?: boolean; label?: string}> = ({a, b, sc, s = 74, greyA, greyB, label}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
		{label && <div style={{background: INK, borderRadius: 12, padding: '2px 16px'}}><T size={34} sw={0} sh="transparent">{label}</T></div>}
		<Chip><Mini k={a} s={s} grey={greyA} /><T size={s * 1.05} c={INK} sw={0} sh="transparent">{sc}</T><Mini k={b} s={s} grey={greyB} /></Chip>
	</div>
);
export const Stamp: React.FC<{t: number; d: number; children: React.ReactNode; c?: string; y?: number; size?: number}> = ({t, d, children, c = RED, y = 1010, size = 74}) => (
	<div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><PopIn t={t} d={d}><div style={{transform: 'rotate(-7deg)', border: `9px solid ${c}`, borderRadius: 18, padding: '0 24px', background: 'rgba(255,255,255,0.93)', boxShadow: `0 0 0 5px ${INK}`}}><T size={size} c={c} sw={0.06} sh="transparent">{children}</T></div></PopIn></div>
);
export const spin = (t: number, d: number) => interpolate(t, [d, d + 30], [-180, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const mkWordAt = (tl: Timeline) => (li: number, pre: string) => { const l = tl.lines[li]; const w = l.words.find((x) => x.w.toLowerCase().replace(/[¡!¿?,.…]/g, '').startsWith(pre)); return (w?.s ?? l.start) - l.start; };
