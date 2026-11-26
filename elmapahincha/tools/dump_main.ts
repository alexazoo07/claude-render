import {SEGMENTS, TOTAL, allSfx} from '../src/Main';
import {planRound} from '../src/Round';
import {winProbO, STATES, LOG} from '../src/game';
import fs from 'fs';
fs.writeFileSync('out/sfx_main.json', JSON.stringify(allSfx()));
fs.writeFileSync('out/segments.json', JSON.stringify(SEGMENTS.map(s=>({kind:s.kind,from:s.from,dur:s.dur,idx:s.idx}))));
console.log('TOTAL', TOTAL, (TOTAL/60).toFixed(1)+'s', Math.floor(TOTAL/3600)+':'+String(Math.round((TOTAL/60)%60)).padStart(2,'0'));
for (const s of SEGMENTS) console.log(s.kind, s.idx ?? '', s.from, s.dur, (s.from/60).toFixed(1));
console.log('p bol', 1-winProbO(STATES[12], 'BRA','BOL'), LOG[12]);
