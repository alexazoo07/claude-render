import React, {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {LILITA_DATA, RUBIK600_DATA, RUBIK800_DATA} from './fontdata';

export const LILITA = "'Lilita', 'Arial Black', sans-serif";
export const RUBIK = "'RubikX', 'Arial Black', sans-serif";

const CSS = `
@font-face{font-family:'Lilita';src:url(${LILITA_DATA}) format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'RubikX';src:url(${RUBIK800_DATA}) format('woff2');font-weight:800;font-display:block}
@font-face{font-family:'RubikX';src:url(${RUBIK600_DATA}) format('woff2');font-weight:600;font-display:block}
`;

export const Fonts: React.FC = () => {
	const [h] = useState(() => delayRender('fonts-css', {timeoutInMilliseconds: 20000}));
	useEffect(() => {
		let done = false;
		const finish = () => {
			if (!done) {
				done = true;
				continueRender(h);
			}
		};
		const d: any = document;
		Promise.all([d.fonts.load("400 40px 'Lilita'"), d.fonts.load("800 40px 'RubikX'"), d.fonts.load("600 40px 'RubikX'")]).then(finish, finish);
		const t = setTimeout(finish, 12000);
		return () => clearTimeout(t);
	}, [h]);
	return <style>{CSS}</style>;
};
