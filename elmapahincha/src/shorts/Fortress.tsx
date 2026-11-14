import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {WORLD, bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key} from '../common';
import {Atlas, FaceSpec, Fill, INK} from '../v12/Atlas';
import {Center, CountryFace, FLAG, Flag, MiniFace, SH, SW, Spark, Stamp, SubCta, T, blinkOf} from './kit';

// Short 7: 48 países nunca le han ganado a Argentina
const YEL = '#FFD23F', INKD = '#1B1D26', RED = '#E8394A', CEL = '#5AA9E6';
const REG: {name: string; ks: string[]}[] = [
	{name: 'AMÉRICA', ks: ['CAN', 'CRI', 'JAM', 'SLV', 'PAN', 'HTI', 'HND', 'GTM', 'TTO', 'PRI', 'NIC', 'CUW']},
	{name: 'EUROPA', ks: ['CHE', 'IRL', 'BIH', 'AUT', 'WLS', 'ISL', 'GRC', 'SVN', 'NIR', 'LTU', 'EST', 'BLR', 'ALB']},
	{name: 'ÁFRICA', ks: ['MAR', 'EGY', 'DZA', 'CIV', 'AGO', 'ZMB', 'TUN', 'MRT', 'LBY', 'GHA', 'CPV', 'BFA', 'BEN']},
	{name: 'ASIA', ks: ['KOR', 'QAT', 'IRN', 'SGP', 'JOR', 'IRQ', 'IND', 'IDN', 'HKG', 'ARE']},
];
const TOP: {k: string; n: string; p: number; w: number; d: number; gf: number; ga: number; note: string}[] = [
	{k: 'CHE', n: 'SUIZA', p: 8, w: 6, d: 2, gf: 18, ga: 4, note: 'La que más lo ha intentado'},
	{k: 'CRI', n: 'COSTA RICA', p: 7, w: 5, d: 2, gf: 15, ga: 6, note: 'Dos empates y nada más'},
	{k: 'IRL', n: 'IRLANDA', p: 5, w: 4, d: 1, gf: 5, ga: 0, note: '¡Ni un solo gol en 5 partidos!'},
];
const H = 230, M0 = 230, RD = 150, P0 = M0 + REG.length * RD + 30, V0 = P0 + 420, CTA0 = 1640;
export const FORT_TOTAL = 1980;

export const fortSfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const A = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	A(0, 'boom', 0.6); A(8, 'whoosh_4', 0.45); A(30, 'slap', 0.5); A(60, 'pop_2', 0.4); A(90, 'glass', 0.3); A(130, 'crowd_ohh', 0.35);
	REG.forEach((r, i) => {
		const f0 = M0 + i * RD; A(f0, 'whoosh_2', 0.45); A(f0 + 10, 'slap', 0.4);
		r.ks.forEach((_, j) => A(f0 + 30 + j * 7, j % 2 ? 'pop_1' : 'pop_3', 0.28));
	});
	A(P0 - 30, 'boom', 0.55); A(P0 - 28, 'crowd_roar', 0.4);
	TOP.forEach((_, i) => { const f0 = P0 + 20 + i * 120; A(f0, 'whoosh_3', 0.4); A(f0 + 14, 'slap', 0.45); A(f0 + 40, 'pop_2', 0.35); });
	A(V0, 'drumroll', 0.4); A(V0 + 60, 'boom', 0.6); A(V0 + 62, 'crowd_roar', 0.5); A(V0 + 70, 'glass', 0.3);
	A(CTA0, 'whoosh_2', 0.45); A(CTA0 + 20, 'pop_1', 0.45); A(CTA0 + 80, 'pop_2', 0.4); A(CTA0 + 200, 'click', 0.55); A(CTA0 + 202, 'bong', 0.4);
	s.sort((x, y) => x.f - y.f);
	return s;
};
const camOf = (ks: string[], fitW = 980, fitH = 1250) => {
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of ks) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	return {x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: Math.min(fitW / (x1 - x0), fitH / (y1 - y0))};
};
export const FortressShort: React.FC = () => {
	const f = useCurrentFrame();
	const ca = camOf(['ARG']);
	const cams = REG.map((r) => camOf(r.ks));
	const wide = camOf(['CAN', 'ARG', 'IDN', 'ISL'], 1000, 900);
	const KC: Key[] = [[0, ca.x, ca.y + 10, ca.z * 0.75], [H - 20, ca.x, ca.y, ca.z * 0.85]];
	cams.forEach((c, i) => { KC.push([M0 + i * RD + 10, c.x, c.y, c.z]); KC.push([M0 + i * RD + RD - 25, c.x, c.y, c.z * 1.05]); });
	KC.push([P0 - 20, wide.x, wide.y, wide.z]); KC.push([FORT_TOTAL, wide.x, wide.y, wide.z * 1.08]);
	const cam = camPath(KC, f, 2);
	const fills: Record<string, Fill> = {ARG: {flag: FLAG.ARG, lift: f >= M0 ? 0.5 : 0}};
	const faces: Record<string, FaceSpec> = {};
	let count = 0;
	REG.forEach((r, i) => r.ks.forEach((k, j) => {
		const u = f - (M0 + i * RD + 30 + j * 7);
		if (u >= 0) { count++; fills[k] = {color: RED, pop: elastic(u / 40)}; if (f < P0) faces[k] = {mood: j % 3 === 0 ? 'panic' : 'scared', size: 0.9, max: 90, pop: elastic(u / 50), blink: blinkOf(f, j)}; }
	}));
	if (f >= M0) faces.ARG = {mood: 'smug', size: 1, max: 120, blink: blinkOf(f, 9)};
	const ri = Math.min(REG.length - 1, Math.max(0, Math.floor((f - M0) / RD)));
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={[FLAG.ARG, ...TOP.map((t) => FLAG[t.k])]} />
			<Atlas cam={cam} fills={fills} faces={faces} W={SW} H={SH} dark={f < H ? 0.45 : 0.2} />
			{f < H + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H) / 10)}}>
					<Center y={110} gap={0}>
						<T size={250} color={RED} p={backOut((f - 2) / 10)} rot={-3}>48</T>
						<T size={110} p={backOut((f - 12) / 10)} rot={-3}>PAÍSES</T>
					</Center>
					<CountryFace k="ARG" x={540} y={1060} w={330} mood="smug" look={[0, 0.3]} blink={blinkOf(f, 1)} p={elastic((f - 20) / 60)} rot={-4} />
					<Center y={1520} gap={4}>
						<T size={84} p={backOut((f - 50) / 10)}>NUNCA LE HAN</T>
						<T size={84} p={backOut((f - 58) / 10)}>GANADO A <span style={{color: CEL}}>ARGENTINA</span></T>
					</Center>
				</AbsoluteFill>
			)}
			{f >= M0 && f < P0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - P0) / 10)}}>
					<Center y={110} gap={8}>
						<div style={{transform: `scale(${backOut((f - M0 - 4) / 10)})`, display: 'flex', alignItems: 'baseline', gap: 16, padding: '10px 36px', borderRadius: 26, background: INKD, border: '6px solid #fff'}}>
							<span style={{fontFamily: LILITA, fontSize: 130, color: RED, WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>{count}</span>
							<span style={{fontFamily: LILITA, fontSize: 60, color: '#fff'}}>/ 48</span>
						</div>
						<T size={74} color={YEL} p={backOut((f - M0 - ri * RD - 4) / 10)} key={ri}>{REG[ri].name}</T>
					</Center>
					<Center y={1640}><div style={{padding: '10px 26px', borderRadius: 18, background: 'rgba(22,24,31,0.9)', border: `5px solid ${RED}`, fontFamily: RUBIK, fontWeight: 800, fontSize: 34, color: '#fff'}}>0 victorias contra Argentina</div></Center>
				</AbsoluteFill>
			)}
			{f >= P0 && f < V0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - V0) / 10)}}>
					<AbsoluteFill style={{background: 'rgba(5,12,30,0.35)'}} />
					<Center y={120} gap={0}><T size={84} p={backOut((f - P0 - 2) / 10)}>LAS QUE MÁS</T><T size={84} color={YEL} p={backOut((f - P0 - 8) / 10)}>LO HAN INTENTADO</T></Center>
					<div style={{position: 'absolute', left: 50, right: 50, top: 440, display: 'flex', flexDirection: 'column', gap: 34}}>
						{TOP.map((t, i) => {
							const u = f - P0 - 20 - i * 120;
							return (
								<div key={t.k} style={{padding: '20px 26px', borderRadius: 30, background: '#FFF7E6', border: `7px solid ${RED}`, boxShadow: `0 0 0 4px ${INK}, 0 10px 0 rgba(0,0,0,0.35)`, transform: `translateX(${(1 - easeOut(u / 14)) * (i % 2 ? 1300 : -1300)}px) rotate(${(i - 1) * 1.5}deg)`, opacity: u < 0 ? 0 : 1}}>
									<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
										<Flag f={FLAG[t.k]} w={120} />
										<div style={{flex: 1}}>
											<div style={{fontFamily: LILITA, fontSize: 60, color: INK, lineHeight: 1}}>{t.n}</div>
											<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#6B6250'}}>{t.p} partidos · {t.d} empates · {t.w} derrotas</div>
										</div>
										<MiniFace mood={i === 2 ? 'panic' : 'scared'} s={100} bg={RED} />
									</div>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, opacity: clamp01((u - 30) / 10)}}>
										<span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#C46A00'}}>{t.note}</span>
										<span style={{padding: '4px 18px', borderRadius: 14, background: RED, border: `4px solid ${INK}`, fontFamily: LILITA, fontSize: 44, color: '#fff'}}>0 VICTORIAS</span>
									</div>
								</div>
							);
						})}
					</div>
				</AbsoluteFill>
			)}
			{f >= V0 && f < CTA0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - CTA0) / 10)}}>
					<Center y={110}><T size={96} p={backOut((f - V0 - 4) / 10)}>ENTRE LOS 48...</T></Center>
					<div style={{position: 'absolute', left: 50, right: 50, top: 300, transform: `scale(${backOut((f - V0 - 14) / 12)})`, borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '24px 30px', display: 'flex', justifyContent: 'space-around'}}>
						{([['98', 'PARTIDOS', INK], ['87', 'GANÓ ARG', CEL], ['11', 'EMPATES', '#8C8471'], ['0', 'DERROTAS', RED]] as [string, string, string][]).map(([v, l, c]) => (
							<div key={l} style={{textAlign: 'center'}}>
								<div style={{fontFamily: LILITA, fontSize: 100, color: c, lineHeight: 1, WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>{v}</div>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: INK}}>{l}</div>
							</div>
						))}
					</div>
					{f >= V0 + 60 && <Stamp text="¡0 DERROTAS!" col={RED} t={f - V0 - 60} y={600} size={100} />}
					<CountryFace k="ARG" x={540} y={1180} w={300} mood="cool" blink={blinkOf(f, 1)} rot={-4} />
					<div style={{position: 'absolute', left: 50, right: 50, top: 1490, transform: `translateY(${(1 - backOut((f - V0 - 110) / 14)) * 600}px)`, borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '18px 28px', fontFamily: RUBIK, fontWeight: 800, fontSize: 32, color: INK, lineHeight: 1.25}}>
						<span style={{color: '#C46A00'}}>DATO </span>Entre las 48 hay selecciones mundialistas como Suiza, Marruecos, Corea del Sur o Irán
					</div>
					<Spark x={150} y={640} s={70} f={f} /><Spark x={930} y={700} s={56} f={f} />
				</AbsoluteFill>
			)}
			{f >= CTA0 && (
				<AbsoluteFill>
					<AbsoluteFill style={{background: 'rgba(5,10,25,0.5)', opacity: easeOut((f - CTA0) / 16)}} />
					<Center y={260} gap={10}>
						<T size={74} p={backOut((f - CTA0 - 4) / 10)}>¿TU SELECCIÓN LE HA</T>
						<T size={100} color={CEL} p={backOut((f - CTA0 - 12) / 10)}>GANADO A ARGENTINA?</T>
					</Center>
					<Center y={760} gap={30}>
						<div style={{transform: `scale(${backOut((f - CTA0 - 50) / 10)})`, padding: '14px 30px', borderRadius: 20, background: '#fff', border: `6px solid ${INK}`, fontFamily: LILITA, fontSize: 52, color: INK}}>¡Dímelo en comentarios!</div>
						<div style={{transform: `scale(${backOut((f - CTA0 - 90) / 12)})`, marginTop: 30}}><SubCta u={f - CTA0} at={200} /></div>
						<div style={{transform: `scale(${backOut((f - CTA0 - 120) / 10)})`, display: 'flex', alignItems: 'center', gap: 14}}>
							<MiniFace mood="happy" s={80} bg={YEL} />
							<T size={56}>¡UN PAÍS CADA DÍA!</T>
						</div>
					</Center>
				</AbsoluteFill>
			)}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'rgba(14,16,22,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.75)'}}>Todos los partidos oficiales y amistosos (1902 - octubre 2026) · Penaltis = empate</div>
		</AbsoluteFill>
	);
};
export {WORLD};
