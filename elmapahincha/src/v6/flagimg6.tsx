import React from 'react';
import {staticFile} from 'remotion';
import {T} from './data6';
import {FlagCover} from '../flagCover';

export type Iso = string;
export const flagUrl = (k: string) => staticFile(`flags/${T[k]?.flag ?? k}.svg`);
export const hi = (k: string) => (k === 'balon' ? 'balon' : 'img:' + (T[k]?.flag ?? k));

// flag that always covers the whole box (no grey margins)
export const Flag: React.FC<{iso: Iso; x: number; y: number; w: number; h: number; mode?: string}> = ({iso, x, y, w, h}) => (
	<FlagCover flag={T[iso]?.flag ?? iso} x={x} y={y} w={w} h={h} />
);
export const FlagChip: React.FC<{iso: Iso; w: number; h?: number; style?: React.CSSProperties; dim?: boolean}> = ({iso, w, h, style, dim}) => (
	<img src={flagUrl(iso)} style={{width: w, height: h ?? (w * 3) / 4, objectFit: 'cover', borderRadius: Math.max(3, w * 0.08), boxShadow: '0 0 0 3px #0B1E3F', filter: dim ? 'grayscale(1) brightness(0.55)' : undefined, ...style}} />
);
