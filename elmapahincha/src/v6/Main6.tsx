import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Hook, HOOK_SFX, HOOK_DUR, hookEndCam} from './Hook6';
import {planRound, Round, roundSfx, OVERVIEW} from './Round6';
import {planQuick, QuickWar, quickSfx} from './Quick6';
import {Checkpoint, CHECK_DUR, checkSfx, Champion, CHAMP_DUR, champSfx, FinalIntro, FINAL_INTRO_DUR, finalIntroSfx} from './Extras6';
import {Cam} from './MapLayer6';
import {LOG, STATES, aliveOf} from './game6';
import type {Iso} from './flagimg6';
import {FlagPreload} from '../v2/Preload';
import {C, TEAMS} from './data6';
import {LILITA, RUBIK} from '../fonts';

type Seg = {kind: 'hook' | 'quick' | 'round' | 'check' | 'finalIntro' | 'champ'; dur: number; from: number; idx?: number; start?: Cam; isFinal?: boolean; cta?: boolean; round?: number; sfx: {f: number; name: string; vol: number}[]};

// phase 1 (quick wars) until 10 nations remain, then full rounds with roulette + match
export const PHASE2 = LOG.findIndex((_, i) => aliveOf(STATES[i]).length <= 10);
const CHECK_AFTER = [19, 39, PHASE2 - 1];
const CTA_ROUND = PHASE2 + 2;

export const SEGMENTS: Seg[] = (() => {
	const segs: Seg[] = [];
	let t = 0;
	const push = (s: Omit<Seg, 'from'>) => { segs.push({...s, from: t}); t += s.dur; };
	push({kind: 'hook', dur: HOOK_DUR, sfx: HOOK_SFX});
	let cam: Cam = hookEndCam;
	const last = LOG.length - 1;
	for (let i = 0; i <= last; i++) {
		const isFinal = i === last;
		if (i < PHASE2) {
			const q = planQuick(i);
			push({kind: 'quick', dur: q.Q.END, idx: i, start: cam, sfx: quickSfx(q)});
			cam = q.cam;
		} else {
			if (isFinal) { push({kind: 'finalIntro', dur: FINAL_INTRO_DUR, sfx: finalIntroSfx(), idx: i}); cam = OVERVIEW; }
			const pl = planRound(i, isFinal);
			push({kind: 'round', dur: pl.P.END, idx: i, start: cam, isFinal, cta: i === CTA_ROUND, sfx: roundSfx(pl)});
			cam = pl.endCam;
		}
		if (CHECK_AFTER.includes(i)) {
			push({kind: 'check', dur: CHECK_DUR, idx: i + 1, start: cam, round: i + 1, sfx: checkSfx()});
			cam = OVERVIEW;
		}
	}
	push({kind: 'champ', dur: CHAMP_DUR, start: cam, sfx: champSfx()});
	return segs;
})();
export const TOTAL6 = SEGMENTS.reduce((a, s) => a + s.dur, 0);
export const allSfx6 = () => SEGMENTS.flatMap((s) => s.sfx.map((e) => ({...e, f: e.f + s.from})));
export const music6 = () => {
	const sec = (f: number) => (f / 60).toFixed(2);
	const p2 = SEGMENTS.find((s) => s.kind === 'round')!.from;
	const fin = SEGMENTS.find((s) => s.kind === 'finalIntro')!.from;
	const ch = SEGMENTS.find((s) => s.kind === 'champ')!.from;
	return [`m_tense:0:${sec(HOOK_DUR + 40)}`, `m_happy:${sec(HOOK_DUR)}:${sec(p2 + 40)}`, `m_tense:${sec(p2)}:${sec(ch + 40)}`, `m_triumph:${sec(ch)}:${sec(TOTAL6)}`].join(',');
};

const TICKER = [
	'EUROCOPAS: ESPAÑA 4 (1964, 2008, 2012 Y 2024) · ALEMANIA 3 · FRANCIA 2 · ITALIA 2',
	'MUNDIALES DE SELECCIONES EUROPEAS: ITALIA 4 · ALEMANIA 4 · FRANCIA 2 · ESPAÑA 2 (2010 Y 2026) · INGLATERRA 1 (1966)',
	'1992: DINAMARCA GANÓ LA EUROCOPA SIN HABERSE CLASIFICADO, ENTRÓ POR LA EXCLUSIÓN DE YUGOSLAVIA',
	'2004: GRECIA GANÓ LA EUROCOPA, UNA DE LAS MAYORES SORPRESAS DE LA HISTORIA',
	'LA URSS GANÓ LA PRIMERA EUROCOPA, EN 1960',
	'ISLANDIA, CON MENOS DE 400.000 HABITANTES, JUGÓ LA EUROCOPA 2016 Y EL MUNDIAL 2018',
	'FUERZA DE CADA SELECCIÓN: RATING ELO CALCULADO CON 49.945 PARTIDOS INTERNACIONALES (HASTA OCT. 2026) · +15 POR TERRITORIO',
	'51 SELECCIONES DE LA UEFA · SIN LOS MICROESTADOS (ANDORRA, SAN MARINO, LIECHTENSTEIN Y GIBRALTAR)',
];
const Ticker: React.FC<{f: number; y: number}> = ({f, y}) => {
	const text = TICKER.join('     •     ') + '     •     ';
	const w = useMemo(() => { try { const c = document.createElement('canvas').getContext('2d')!; c.font = `800 22px ${RUBIK}`; return c.measureText(text).width; } catch { return text.length * 14; } }, [text]);
	const x = -((f * 2.2) % w);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, transform: `translateY(${y}px)`, background: 'linear-gradient(180deg, #0E2A55, #081A38)', borderTop: `4px solid ${C.yellow}`, overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 300, top: 0, bottom: 0, right: 0, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: x, top: 13, whiteSpace: 'pre', fontFamily: RUBIK, fontWeight: 800, fontSize: 22, color: '#fff'}}>{text + text + text}</div>
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: C.yellow, fontFamily: LILITA, fontSize: 28, color: C.navy, boxShadow: '6px 0 12px rgba(0,0,0,0.4)'}}>
				<img src={staticFile('flags/eu.svg')} style={{width: 40, height: 28, borderRadius: 4, border: `2px solid ${C.navy}`, objectFit: 'cover'}} />
				EUROPA EN DATOS
			</div>
		</div>
	);
};

export const Main6: React.FC = () => {
	const f = useCurrentFrame();
	const champ = SEGMENTS[SEGMENTS.length - 1].from;
	const tIn = f >= HOOK_DUR && f < champ + 900 ? Math.min(1, (f - HOOK_DUR) / 24, 1 - (f - champ - 870) / 30) : 0;
	return (
		<AbsoluteFill style={{background: '#0B1E3F'}}>
			<FlagPreload flags={[...TEAMS.map((t) => t.flag), 'eu']} />
			{SEGMENTS.map((s, i) => (
				<Sequence key={i} from={s.from} durationInFrames={s.dur}>
					{s.kind === 'hook' && <Hook />}
					{s.kind === 'quick' && <QuickWar idx={s.idx!} start={s.start!} total={LOG.length} />}
					{s.kind === 'round' && <Round idx={s.idx!} start={s.start!} isFinal={s.isFinal} cta={s.cta} />}
					{s.kind === 'check' && <Checkpoint stateIdx={s.idx!} start={s.start!} round={s.round!} />}
					{s.kind === 'finalIntro' && <FinalIntro a={(LOG[s.idx!] as any).a as Iso} b={(LOG[s.idx!] as any).d as Iso} />}
					{s.kind === 'champ' && <Champion start={s.start!} />}
				</Sequence>
			))}
			{tIn > 0 && <Ticker f={f} y={(1 - Math.max(0, tIn)) * 80} />}
		</AbsoluteFill>
	);
};
