import React from 'react';
import {staticFile} from 'remotion';
// Flag SVGs are 4:3 and Chrome ignores "slice" on SVG <image>, so compute a cover rect by hand.
// The flag always covers the whole box (no grey margins). For very wide/tall countries the flag is
// allowed to stretch up to 1.8x so the whole design stays recognisable instead of zooming into one stripe.
export const FlagCover: React.FC<{flag: string; x: number; y: number; w: number; h: number; clipPath?: string}> = ({flag, x, y, w, h, clipPath}) => {
	const A0 = 4 / 3, k = 1.8;
	const A = Math.min(A0 * k, Math.max(A0 / k, w / h));
	let W = Math.max(w, h * A), H = W / A;
	if (H < h) { H = h; W = H * A; }
	W *= 1.02; H *= 1.02;
	return <image href={staticFile(`flags/${flag}.svg`)} x={x + (w - W) / 2} y={y + (h - H) / 2} width={W} height={H} preserveAspectRatio="none" clipPath={clipPath} />;
};
