import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {bboxOf} from '../v5/WorldLayer5';
import {Fonts, LILITA, RUBIK} from '../fonts';
import {FlagPreload} from '../v2/Preload';
import {backOut, clamp01, easeInOut, easeOut, elastic} from '../ui';
import {camPath, Key} from '../common';
import {Atlas, FaceMood, Fill, INK} from '../v12/Atlas';
import {Center, CountryFace, FLAG, Flag, MiniFace, SH, SW, Spark, Stamp, SubCta, T, blinkOf} from './kit';
import sim from '../v10/sim10.json';

// Short 3: Brasil 1970 vs Argentina 2022 (simulation from video 10)
const YEL = '#FFD23F', INKD = '#1B1D26';
const COL = {BRA: '#2EB24C', ARG: '#5AA9E6'};
const S = sim as unknown as {T: Record<string, number[]>; rounds: {a: string; b: string; ga: number; gb: number; goals: {t: string; m: number; who: string}[]; pos: number; sha: number; shb: number; p: number[]}[][]};
const FINAL = S.rounds[S.rounds.length - 1][0];
const CATS = ['ATAQUE', 'CENTRO', 'DEFENSA', 'ESTRELLA'];
const H = 220, R0 = 220, M0 = 620, MPF = 9.5, F0 = M0 + Math.round(92 * MPF) + 20, CTA0 = 1690;
export const SIM_TOTAL = 1980;
const mf = (m: number) => M0 + m * MPF; // frame of match minute
const minuteAt = (f: number) => Math.max(0, Math.min(90, Math.floor((f - M0) / MPF)));

export const simSfx = () => {
	const s: {f: number; name: string; vol: number}[] = [];
	const A = (f: number, name: string, vol = 0.45) => s.push({f: Math.round(f), name, vol});
	A(0, 'boom', 0.55); A(6, 'whoosh_4', 0.45); A(26, 'slap', 0.5); A(44, 'slap', 0.5); A(70, 'boom', 0.5); A(72, 'glass', 0.3); A(120, 'crowd_ohh', 0.3);
	A(R0, 'whoosh_2', 0.5);
	CATS.forEach((_, i) => { A(R0 + 40 + i * 50, 'pop_1', 0.4); A(R0 + 60 + i * 50, 'tick', 0.25); });
	A(R0 + 300, 'pop_2', 0.45);
	A(M0, 'whistle_long', 0.55); A(M0 + 4, 'crowd_roar', 0.3);
	FINAL.goals.forEach((g) => { const f = mf(g.m); A(f - 6, 'kick', 0.5); A(f, 'boom', 0.55); A(f + 2, 'crowd_roar', 0.55); A(f + 10, 'slap', 0.4); });
	A(mf(45), 'whistle_short', 0.4); A(mf(90), 'whistle_long', 0.55);
	A(F0, 'drumroll', 0.35); A(F0 + 30, 'boom', 0.6); A(F0 + 32, 'crowd_roar', 0.5); A(F0 + 40, 'glass', 0.3);
	A(CTA0, 'whoosh_2', 0.45); A(CTA0 + 20, 'pop_1', 0.45); A(CTA0 + 80, 'pop_2', 0.4); A(CTA0 + 200, 'click', 0.55); A(CTA0 + 202, 'bong', 0.4);
	s.sort((x, y) => x.f - y.f);
	return s;
};

export const SimShort: React.FC = () => {
	const f = useCurrentFrame();
	let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
	for (const k of ['ARG', 'BRA']) { const b = bboxOf(k); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
	const z = Math.min(1000 / (x1 - x0), 1300 / (y1 - y0));
	const KC: Key[] = [[0, (x0 + x1) / 2, (y0 + y1) / 2, z * 0.9], [SIM_TOTAL, (x0 + x1) / 2, (y0 + y1) / 2, z * 1.12]];
	const cam = camPath(KC, f, 2);
	const fills: Record<string, Fill> = {BRA: {flag: FLAG.BRA}, ARG: {flag: FLAG.ARG}};
	const min = minuteAt(f);
	const scored = FINAL.goals.filter((g) => f >= mf(g.m));
	const gB = scored.filter((g) => g.t === 'BRA').length, gA = scored.filter((g) => g.t === 'ARG').length;
	const last = scored[scored.length - 1];
	const since = last ? f - mf(last.m) : 999;
	const moodOf = (k: 'BRA' | 'ARG'): FaceMood => {
		if (f >= F0 + 30) return k === 'ARG' ? 'happy' : 'sad';
		if (f >= M0) {
			if (last && since < 90) return last.t === k ? 'happy' : 'shock';
			const me = k === 'BRA' ? gB : gA, op = k === 'BRA' ? gA : gB;
			return me > op ? 'smug' : me < op ? 'worried' : 'angry';
		}
		return k === 'BRA' ? 'cool' : 'angry';
	};
	const shake = last && since < 14 ? Math.sin(since * 2.6) * (14 - since) * 1.4 : 0;
	return (
		<AbsoluteFill style={{background: '#2A72BA'}}>
			<Fonts />
			<FlagPreload flags={[FLAG.BRA, FLAG.ARG]} />
			<div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
				<Atlas cam={cam} fills={fills} faces={{}} W={SW} H={SH} dark={0.4} />
			</div>
			{/* HOOK */}
			{f < H + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - H) / 10)}}>
					<Center y={100} gap={4}>
						<T size={96} p={backOut((f - 2) / 10)} rot={-2}>¿QUIÉN GANARÍA?</T>
					</Center>
					<CountryFace k="BRA" x={720} y={760} w={600} mood="cool" look={[-0.6, 0.2]} blink={blinkOf(f, 1)} p={elastic((f - 14) / 60)} rot={4} />
					<Year y="1970" x={720} yy={1040} col={COL.BRA} p={backOut((f - 40) / 10)} />
					<CountryFace k="ARG" x={220} y={1240} w={290} mood="angry" look={[0.6, -0.3]} blink={blinkOf(f, 2)} p={elastic((f - 30) / 60)} rot={-5} />
					<Year y="2022" x={220} yy={1560} col={COL.ARG} p={backOut((f - 50) / 10)} />
					<div style={{position: 'absolute', left: 470, top: 1250, width: 220, height: 220, borderRadius: '50%', background: YEL, border: `11px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(-8deg) scale(${backOut((f - 66) / 10)})`}}><T size={110} color="#E8394A">VS</T></div>
					<Center y={1660} gap={2}>
						<T size={60} p={backOut((f - 84) / 10)}>EL BRASIL DE PELÉ</T>
						<T size={60} color={YEL} p={backOut((f - 94) / 10)}>VS LA ARGENTINA DE MESSI</T>
					</Center>
				</AbsoluteFill>
			)}
			{/* RATINGS */}
			{f >= R0 && f < M0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - M0) / 10)}}>
					<AbsoluteFill style={{background: 'rgba(5,12,30,0.35)'}} />
					<Center y={110}><T size={92} p={backOut((f - R0 - 2) / 10)}>CARA A CARA</T></Center>
					<div style={{position: 'absolute', left: 50, right: 50, top: 300, transform: `translateY(${(1 - backOut((f - R0 - 10) / 14)) * 900}px)`, borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '26px 30px'}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}><Flag f={FLAG.BRA} w={90} /><span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>BRASIL 70</span></div>
							<div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{fontFamily: LILITA, fontSize: 52, color: INK}}>ARG 22</span><Flag f={FLAG.ARG} w={90} /></div>
						</div>
						{CATS.map((c, i) => {
							const u = f - R0 - 40 - i * 50;
							const a = S.T.BRA[i], b = S.T.ARG[i];
							const p = easeOut(u / 24);
							return (
								<div key={c} style={{marginTop: 18, opacity: clamp01(u / 6)}}>
									<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 28, color: '#6B6250'}}>{c}</div>
									<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
										<span style={{fontFamily: LILITA, fontSize: 64, width: 90, color: a >= b ? COL.BRA : '#9A917C', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>{Math.round(a * p)}</span>
										<div style={{flex: 1, height: 38, display: 'flex', justifyContent: 'flex-end', borderRadius: 19, background: '#E6DCC6', border: `4px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${((a - 60) / 40) * 100 * p}%`, background: COL.BRA}} /></div>
										<div style={{flex: 1, height: 38, borderRadius: 19, background: '#E6DCC6', border: `4px solid ${INK}`, overflow: 'hidden'}}><div style={{width: `${((b - 60) / 40) * 100 * p}%`, height: '100%', background: COL.ARG}} /></div>
										<span style={{fontFamily: LILITA, fontSize: 64, width: 90, textAlign: 'right', color: b >= a ? COL.ARG : '#9A917C', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>{Math.round(b * p)}</span>
									</div>
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 50, right: 50, top: 1210, transform: `scale(${backOut((f - R0 - 300) / 12)})`, borderRadius: 30, background: INKD, border: '6px solid #fff', padding: '22px 30px'}}>
						<div style={{textAlign: 'center', fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#fff', marginBottom: 12}}>PROBABILIDAD ANTES DEL PARTIDO</div>
						<div style={{display: 'flex', height: 70, borderRadius: 20, overflow: 'hidden', border: `5px solid ${INK}`}}>
							{([[FINAL.p[0], COL.BRA, 'BRASIL'], [FINAL.p[1], '#8C8471', 'EMPATE'], [FINAL.p[2], COL.ARG, 'ARG']] as [number, string, string][]).map(([v, c, l]) => (
								<div key={l} style={{width: `${v}%`, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LILITA, fontSize: 40, color: '#fff', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>{v}%</div>
							))}
						</div>
						<div style={{display: 'flex', fontFamily: RUBIK, fontWeight: 800, fontSize: 24, color: 'rgba(255,255,255,0.8)', marginTop: 8}}>
							<span style={{width: `${FINAL.p[0]}%`, textAlign: 'center'}}>GANA BRASIL</span><span style={{width: `${FINAL.p[1]}%`, textAlign: 'center'}}>EMPATE</span><span style={{width: `${FINAL.p[2]}%`, textAlign: 'center'}}>GANA ARG</span>
						</div>
					</div>
					<Center y={1560}><T size={64} color={YEL} p={backOut((f - R0 - 330) / 10)}>¡BRASIL ES FAVORITO!</T></Center>
				</AbsoluteFill>
			)}
			{/* MATCH */}
			{f >= M0 && f < F0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - F0) / 10)}}>
					<Board gB={gB} gA={gA} min={min} p={backOut((f - M0) / 12)} f={f} />
					<CountryFace k="BRA" x={720} y={980} w={560} mood={moodOf('BRA')} look={[-0.5, 0]} blink={blinkOf(f, 1)} rot={4} />
					<CountryFace k="ARG" x={290} y={1300} w={280} mood={moodOf('ARG')} look={[0.6, -0.3]} blink={blinkOf(f, 2)} rot={-5} />
					{last && since < 100 && (
						<>
							<Stamp text="¡GOOOL!" col={last.t === 'BRA' ? COL.BRA : COL.ARG} t={since} y={560} size={120} rot={last.t === 'BRA' ? 4 : -4} />
							<Center y={760}><div style={{transform: `scale(${backOut((since - 10) / 10)})`, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 28px', borderRadius: 20, background: INKD, border: '5px solid #fff'}}><Flag f={FLAG[last.t]} w={70} /><T size={58}>{last.who.toUpperCase()} {last.m}'</T></div></Center>
						</>
					)}
					{f >= mf(45) && f < mf(45) + 50 && <Center y={600}><T size={80} color={YEL} p={backOut((f - mf(45)) / 8)}>DESCANSO</T></Center>}
					<GoalList f={f} />
				</AbsoluteFill>
			)}
			{/* FINAL */}
			{f >= F0 && f < CTA0 + 10 && (
				<AbsoluteFill style={{opacity: 1 - easeInOut((f - CTA0) / 10)}}>
					<Center y={110}><T size={96} p={backOut((f - F0 - 2) / 10)}>RESULTADO FINAL</T></Center>
					<Center y={260}>
						<div style={{transform: `scale(${backOut((f - F0 - 10) / 12)})`, display: 'flex', alignItems: 'center', gap: 26, padding: '16px 40px', borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)'}}>
							<Flag f={FLAG.BRA} w={120} /><span style={{fontFamily: LILITA, fontSize: 130, color: INK}}>{FINAL.ga} - {FINAL.gb}</span><Flag f={FLAG.ARG} w={120} />
						</div>
					</Center>
					{f >= F0 + 30 && <Stamp text="¡GANA ARGENTINA!" col={COL.ARG} t={f - F0 - 30} y={520} size={90} />}
					<CountryFace k="ARG" x={420} y={1080} w={360} mood="happy" blink={blinkOf(f, 2)} rot={-4} p={elastic((f - F0 - 30) / 50) * 0.3 + 0.7} />
					<CountryFace k="BRA" x={860} y={1220} w={300} mood="sad" blink={blinkOf(f, 1)} rot={6} />
					<div style={{position: 'absolute', left: 50, right: 50, top: 1500, transform: `translateY(${(1 - backOut((f - F0 - 70) / 14)) * 600}px)`, borderRadius: 30, background: '#FFF7E6', border: `7px solid ${INK}`, boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '18px 28px', display: 'flex', justifyContent: 'space-around'}}>
						{([['POSESIÓN', `${FINAL.pos}%`, `${100 - FINAL.pos}%`], ['TIROS', `${FINAL.sha}`, `${FINAL.shb}`]] as [string, string, string][]).map(([l, a, b]) => (
							<div key={l} style={{textAlign: 'center'}}>
								<div style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 26, color: '#6B6250'}}>{l}</div>
								<div style={{fontFamily: LILITA, fontSize: 64, color: INK}}><span style={{color: COL.BRA}}>{a}</span> · <span style={{color: COL.ARG}}>{b}</span></div>
							</div>
						))}
					</div>
					<Spark x={150} y={620} s={70} f={f} /><Spark x={930} y={680} s={56} f={f} />
				</AbsoluteFill>
			)}
			{f >= CTA0 && <SimCta t={f - CTA0} />}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'rgba(14,16,22,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RUBIK, fontWeight: 600, fontSize: 18, color: 'rgba(255,255,255,0.75)'}}>Simulación basada en valoraciones de cada selección · Vídeo completo en el canal</div>
		</AbsoluteFill>
	);
};
const Year: React.FC<{y: string; x: number; yy: number; col: string; p: number}> = ({y, x, yy, col, p}) => (
	<div style={{position: 'absolute', left: x - 150, width: 300, top: yy, display: 'flex', justifyContent: 'center', transform: `scale(${Math.max(0, p)})`}}>
		<div style={{padding: '6px 26px', borderRadius: 18, background: col, border: `6px solid ${INK}`, boxShadow: '0 8px 0 rgba(0,0,0,0.35)'}}><T size={72} color="#fff">{y}</T></div>
	</div>
);
const Board: React.FC<{gB: number; gA: number; min: number; p: number; f: number}> = ({gB, gA, min, p}) => (
	<div style={{position: 'absolute', left: 60, right: 60, top: 110, transform: `scale(${Math.max(0, p)})`}}>
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 30, background: INKD, border: '6px solid #fff', boxShadow: '0 12px 0 rgba(0,0,0,0.35)', padding: '18px 30px'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}><Flag f={FLAG.BRA} w={100} /><span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>BRA 70</span></div>
			<span style={{fontFamily: LILITA, fontSize: 110, color: '#fff', WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>{gB}-{gA}</span>
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}><span style={{fontFamily: LILITA, fontSize: 46, color: '#fff'}}>ARG 22</span><Flag f={FLAG.ARG} w={100} /></div>
		</div>
		<div style={{display: 'flex', justifyContent: 'center', marginTop: -6}}>
			<div style={{padding: '6px 30px', borderRadius: '0 0 18px 18px', background: YEL, border: `5px solid ${INK}`, fontFamily: LILITA, fontSize: 52, color: INK}}>{min}'</div>
		</div>
	</div>
);
const GoalList: React.FC<{f: number}> = ({f}) => {
	const shown = FINAL.goals.filter((g) => f >= mf(g.m) + 100);
	if (!shown.length) return null;
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 1580, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
			{shown.map((g, i) => (
				<div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 14, background: 'rgba(22,24,31,0.9)', border: `4px solid ${g.t === 'BRA' ? COL.BRA : COL.ARG}`, transform: `scale(${backOut((f - mf(g.m) - 100) / 10)})`}}>
					<span style={{fontSize: 30}}>⚽</span><span style={{fontFamily: RUBIK, fontWeight: 800, fontSize: 30, color: '#fff'}}>{g.who} {g.m}'</span>
				</div>
			))}
		</div>
	);
};
const SimCta: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: 'rgba(5,10,25,0.5)', opacity: easeOut(t / 16)}} />
		<Center y={260} gap={10}>
			<T size={84} p={backOut((t - 4) / 10)}>¿QUIÉN CREES</T>
			<T size={110} color={YEL} p={backOut((t - 12) / 10)}>QUE GANARÍA?</T>
		</Center>
		<Center y={760} gap={30}>
			<div style={{transform: `scale(${backOut((t - 50) / 10)})`, padding: '14px 30px', borderRadius: 20, background: '#fff', border: `6px solid ${INK}`, fontFamily: LILITA, fontSize: 52, color: INK}}>¡Dímelo en comentarios!</div>
			<div style={{transform: `scale(${backOut((t - 90) / 12)})`, marginTop: 30}}><SubCta u={t} at={200} /></div>
			<div style={{transform: `scale(${backOut((t - 120) / 10)})`, display: 'flex', alignItems: 'center', gap: 14}}>
				<MiniFace mood="happy" s={80} bg={YEL} />
				<T size={50}>¡EL TORNEO ENTERO EN EL CANAL!</T>
			</div>
		</Center>
	</AbsoluteFill>
);
