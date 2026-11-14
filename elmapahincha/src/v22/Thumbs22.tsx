import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {WORLD, WCam, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA} from '../fonts';
import {FaceMood, FaceSpec, Fill, INK} from '../v12/Atlas';
import {Atlas21} from '../v21/Atlas21';
import {FL, L} from './data22';
import {Star, Union} from './Video22';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#FFF6E0', style}) => (
	<div style={{fontFamily: LILITA, fontSize: size, lineHeight: 1, color, WebkitTextStroke: `${size * 0.05}px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.05}px 0 ${INK}`, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
const fit = (cx: number, cy: number, h: number): WCam => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of L) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = h / (y1 - y0);
	return {x: (x0 + x1) / 2 + (960 - cx) / z, y: (y0 + y1) / 2 + (540 - cy) / z, z};
};
const M: React.FC<{cam: WCam; mood: FaceMood; fills?: Record<string, Fill>; faces?: Record<string, FaceSpec>; pop?: number}> = ({cam, mood, fills = {}, faces = {}, pop = 1.15}) => (
	<Atlas21 cam={cam} fills={fills} faces={faces}><Union cam={cam} op={1} mood={mood} pop={pop} f={0} /></Atlas21>
);
const Fl: React.FC<{k: string; w: number; style?: React.CSSProperties}> = ({k, w, style}) => <img src={staticFile(`flags/${FL[k]}.svg`)} style={{width: w, height: w * 0.66, border: `${Math.max(3, w / 30)}px solid ${INK}`, borderRadius: w * 0.08, objectFit: 'cover', ...style}} />;

export const T22a: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={fit(560, 600, 1000)} mood="love" />
		<div style={{position: 'absolute', right: 50, top: 170, textAlign: 'right'}}><Txt size={120}>¿Y SI</Txt><Txt size={128} color="#FFD23F">LATINOAMÉRICA</Txt><Txt size={120}>FUESE UNA</Txt><Txt size={128} color="#FFD23F">SELECCIÓN?</Txt></div>
	</AbsoluteFill>
);
export const T22b: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={fit(1350, 640, 900)} mood="happy" />
		<div style={{position: 'absolute', left: 50, top: 60}}><Txt size={240}>20</Txt></div>
		<div style={{position: 'absolute', left: 60, top: 330, display: 'flex', flexWrap: 'wrap', width: 640, gap: 12}}>{L.map((k) => <Fl key={k} k={k} w={112} />)}</div>
		<div style={{position: 'absolute', left: 740, top: 360}}><Txt size={200} color="#FFD23F">→</Txt></div>
		<div style={{position: 'absolute', right: 60, top: 40}}><Txt size={240} color="#FFD23F">1</Txt></div>
	</AbsoluteFill>
);
export const T22c: React.FC = () => (
	<AbsoluteFill><Fonts /><M cam={fit(1380, 600, 1000)} mood="smug" />
		<div style={{position: 'absolute', left: 60, top: 120}}><Txt size={300} color="#FFD23F">10</Txt><Txt size={150}>MUNDIALES</Txt></div>
		<div style={{position: 'absolute', left: 60, top: 640, display: 'grid', gridTemplateColumns: 'repeat(5, 120px)', gap: 8}}>{Array.from({length: 10}).map((_, i) => <Star key={i} s={120} />)}</div>
	</AbsoluteFill>
);
export const T22d: React.FC = () => {
	const cam = fit(480, 600, 950);
	return (
		<AbsoluteFill><Fonts /><M cam={cam} mood="scared" />
			<div style={{position: 'absolute', right: 70, top: 300}}><Fl k="ESP" w={720} /></div>
			<div style={{position: 'absolute', left: 880, top: 380}}><Txt size={170} color="#FFD23F">VS</Txt></div>
			<div style={{position: 'absolute', right: 70, top: 40, textAlign: 'right'}}><Txt size={130}>SU PESADILLA</Txt></div>
			<div style={{position: 'absolute', right: 70, bottom: 60, textAlign: 'right'}}><Txt size={120} color="#E63946">13 V · 49 D</Txt></div>
		</AbsoluteFill>
	);
};
export const T22e: React.FC = () => {
	const pl: [string, string][] = [['PELÉ', 'BRA'], ['MARADONA', 'ARG'], ['MESSI', 'ARG'], ['RONALDO', 'BRA']];
	return (
		<AbsoluteFill><Fonts /><M cam={fit(450, 620, 900)} mood="cool" />
			<div style={{position: 'absolute', right: 60, top: 40, textAlign: 'right'}}><Txt size={130}>EL ONCE</Txt><Txt size={150} color="#FFD23F">DEFINITIVO</Txt></div>
			<div style={{position: 'absolute', right: 60, top: 400, display: 'grid', gridTemplateColumns: 'repeat(2, 470px)', gap: 24}}>
				{pl.map(([n, k]) => <div key={n} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 18px', borderRadius: 24, background: '#FFF7E6', border: `6px solid ${INK}`}}><Fl k={k} w={130} /><Txt size={64} color={INK} style={{WebkitTextStroke: '0px', textShadow: 'none'}}>{n}</Txt></div>)}
			</div>
		</AbsoluteFill>
	);
};
