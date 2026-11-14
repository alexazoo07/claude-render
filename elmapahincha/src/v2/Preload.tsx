import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {TOUR} from './data2';

const ALL_FLAGS = Array.from(new Set(['ar', 'cm', ...TOUR.map((r) => r.flag)]));

// Make sure every flag image is downloaded and decoded before a frame is captured
export const FlagPreload: React.FC<{flags?: string[]}> = ({flags}) => {
	const LIST = flags ?? ALL_FLAGS;
	const [h] = useState(() => delayRender('flags', {timeoutInMilliseconds: 60000}));
	useEffect(() => {
		let left = LIST.length;
		let done = false;
		const fin = () => { if (!done) { done = true; continueRender(h); } };
		LIST.forEach((fl) => {
			const img = new Image();
			img.onload = img.onerror = () => {
				const d = (img as any).decode ? (img as any).decode().catch(() => null) : Promise.resolve();
				d.then(() => { left--; if (left <= 0) setTimeout(fin, 50); });
			};
			img.src = staticFile(`flags/${fl}.svg`);
		});
		const t = setTimeout(fin, 30000);
		return () => clearTimeout(t);
	}, [h]);
	return (
		<div style={{position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none'}}>
			{LIST.map((fl) => <img key={fl} src={staticFile(`flags/${fl}.svg`)} width={4} height={3} />)}
		</div>
	);
};
