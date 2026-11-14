import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Hook, SFX as HOOK_SFX, hookEndCam} from './Hook';
import {planRound, Round, roundSfx, OVERVIEW} from './Round';
import {Checkpoint, CHECK_DUR, checkSfx, Champion, CHAMP_DUR, champSfx, FinalIntro, FINAL_INTRO_DUR, finalIntroSfx} from './Extras';
import {Cam} from './MapLayer';
import {LOG} from './game';
import type {Iso} from './flags';

type Seg = {kind: 'hook' | 'round' | 'check' | 'finalIntro' | 'champ'; dur: number; from: number; idx?: number; start?: Cam; isFinal?: boolean; cta?: boolean; round?: number; sfx: {f: number; name: string; vol: number}[]};

const HOOK_DUR = 1800;
const CHECK_AFTER = [5, 10, 14]; // after these LOG indexes, show standings
const CTA_ROUND = 8;

export const SEGMENTS: Seg[] = (() => {
	const segs: Seg[] = [];
	let t = 0;
	const push = (s: Omit<Seg, 'from'>) => { segs.push({...s, from: t}); t += s.dur; };
	push({kind: 'hook', dur: HOOK_DUR, sfx: HOOK_SFX});
	let cam: Cam = hookEndCam;
	const last = LOG.length - 1;
	for (let i = 1; i <= last; i++) {
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
export const TOTAL = SEGMENTS.reduce((a, s) => a + s.dur, 0);

export const allSfx = () => SEGMENTS.flatMap((s) => s.sfx.map((e) => ({...e, f: e.f + s.from})));

export const Main: React.FC = () => (
	<AbsoluteFill style={{background: '#0B1E3F'}}>
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
