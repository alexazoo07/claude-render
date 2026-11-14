import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Hook, SFX as HOOK_SFX, hookEndCam} from './Hook3';
import {planRound, Round, roundSfx, OVERVIEW} from './Round3';
import {Checkpoint, CHECK_DUR, checkSfx, Champion, CHAMP_DUR, champSfx, FinalIntro, FINAL_INTRO_DUR, finalIntroSfx} from './Extras3';
import {Cam} from './MapLayer3';
import {LOG} from './game3';
import type {Iso} from './flagimg3';
import {FlagPreload} from '../v2/Preload';
import {TEAMS} from './data3';

type Seg = {kind: 'hook' | 'round' | 'check' | 'finalIntro' | 'champ'; dur: number; from: number; idx?: number; start?: Cam; isFinal?: boolean; cta?: boolean; round?: number; sfx: {f: number; name: string; vol: number}[]};

const HOOK_DUR = 960;
const CHECK_AFTER = [6, 12, 16]; // after these LOG indexes, show standings
const CTA_ROUND = 9;

export const SEGMENTS: Seg[] = (() => {
	const segs: Seg[] = [];
	let t = 0;
	const push = (s: Omit<Seg, 'from'>) => { segs.push({...s, from: t}); t += s.dur; };
	push({kind: 'hook', dur: HOOK_DUR, sfx: HOOK_SFX});
	let cam: Cam = hookEndCam;
	const last = LOG.length - 1;
	for (let i = 0; i <= last; i++) {
		const isFinal = i === last;
		if (isFinal) {
			const e = LOG[i] as any;
			push({kind: 'finalIntro', dur: FINAL_INTRO_DUR, sfx: finalIntroSfx(), idx: i});
			cam = OVERVIEW;
		}
		const pl = planRound(i, isFinal);
		push({kind: 'round', dur: pl.P.END, idx: i, start: cam, isFinal, cta: i === CTA_ROUND, sfx: roundSfx(pl)});
		cam = pl.endCam;
		if (CHECK_AFTER.includes(i)) {
			push({kind: 'check', dur: CHECK_DUR, idx: i + 1, start: cam, round: i + 1, sfx: checkSfx()});
			cam = OVERVIEW;
		}
	}
	push({kind: 'champ', dur: CHAMP_DUR, start: cam, sfx: champSfx()});
	return segs;
})();
export const TOTAL3 = SEGMENTS.reduce((a, s) => a + s.dur, 0);

export const allSfx = () => SEGMENTS.flatMap((s) => s.sfx.map((e) => ({...e, f: e.f + s.from})));

export const Main3: React.FC = () => (
	<AbsoluteFill style={{background: '#0B1E3F'}}>
		<FlagPreload flags={TEAMS.map((t) => t.flag)} />
		{SEGMENTS.map((s, i) => (
			<Sequence key={i} from={s.from} durationInFrames={s.dur}>
				{s.kind === 'hook' && <Hook />}
				{s.kind === 'round' && <Round idx={s.idx!} start={s.start!} isFinal={s.isFinal} cta={s.cta} />}
				{s.kind === 'check' && <Checkpoint stateIdx={s.idx!} start={s.start!} round={s.round!} />}
				{s.kind === 'finalIntro' && <FinalIntro a={(LOG[s.idx!] as any).a as Iso} b={(LOG[s.idx!] as any).d as Iso} />}
				{s.kind === 'champ' && <Champion start={s.start!} />}
			</Sequence>
		))}
	</AbsoluteFill>
);
