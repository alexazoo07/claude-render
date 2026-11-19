// utilidades para los shorts rápidos (v3 fast)
import React from 'react';
import {Timeline, Scene, Spk, center, PopIn, T, YEL} from './VShort3';
import {Row, Score} from './kit';
import {INK} from '../v21/Atlas21';
import {FaceMood} from '../v21/Atlas21';
export const mkW = (tl: Timeline) => (li: number, pre: string) => {
	const l = tl.lines[li];
	const w = l.words.find((x) => x.w.toLowerCase().replace(/[¡!¿?,.…]/g, '').startsWith(pre));
	if (!w) throw new Error(`palabra no encontrada: línea ${li} "${pre}"`);
	return w.s - l.start;
};
export const ghostOf = (k: string) => (dx: number, mood: FaceMood, at?: string, moods?: [string, FaceMood][]): Spk => ({k, mood, moods, ghost: true, d: 150, dx, dy: -30, talker: false, at});
export const hookScene = (k: string, z: number, others: [string, number, number][], dy = 0): Scene => {
	const c = center(k);
	return {cam: {x: c.x, y: c.y + dy, z}, spk: [
		{k, mood: 'smug', moods: [['desapare', 'panic']], d: 280, dx: 0, dy: -30, talker: true, map: true},
		...others.map(([o, dx, dy2]): Spk => ({k: o, mood: 'worried', moods: [['desapare', 'shock']], d: 160, dx, dy: dy2, talker: false, map: true})),
	]};
};
// marcador con etiqueta, en una fila
export const Sc: React.FC<{t: number; d: number; a: string; b: string; sc: string; label: string; y: number; greyA?: boolean; greyB?: boolean}> = ({t, d, a, b, sc, label, y, greyA, greyB}) => (
	<Row y={y}><PopIn t={t} d={d}><Score a={a} b={b} sc={sc} label={label} greyA={greyA} greyB={greyB} /></PopIn></Row>
);
export const Big: React.FC<{t: number; d: number; y: number; children: React.ReactNode; c?: string; size?: number}> = ({t, d, y, children, c = YEL, size = 110}) => (
	<Row y={y}><PopIn t={t} d={d}><T size={size} c={c} sw={0.12} sh="#7A2E00">{children}</T></PopIn></Row>
);
export const Chip: React.FC<{children: React.ReactNode; bg?: string; c?: string; size?: number}> = ({children, bg = '#fff', c = INK, size = 48}) => (
	<div style={{background: bg, border: `6px solid ${INK}`, borderRadius: 16, padding: '2px 18px', boxShadow: `0 6px 0 ${INK}`}}><T size={size} c={c} sw={0} sh="transparent">{children}</T></div>
);
export const wob = (t: number, a = 5, p = 14) => Math.sin(t / p) * a;
