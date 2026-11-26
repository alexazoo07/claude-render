import {SEGS, V16_TOTAL, v16Sfx, v16Music} from '../src/v16/Video16';
import fs from 'fs';
fs.writeFileSync('out/sfx_v16.json', JSON.stringify(v16Sfx()));
fs.writeFileSync('out/music_v16.txt', v16Music());
const m = (f: number) => `${Math.floor(f / 3600)}:${String(Math.floor(f / 60) % 60).padStart(2, '0')}`;
console.log('TOTAL', V16_TOTAL, m(V16_TOTAL));
for (const s of SEGS) console.log(m(s.from), s.from, s.dur, s.kind, s.kind === 'tour' ? s.tr.id + ' ' + s.mt.join(',') : s.kind === 'atitle' ? s.i : '');
