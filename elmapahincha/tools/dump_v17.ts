import {SEGS, V17_TOTAL, v17Sfx, v17Music} from '../src/v17/Video17';
import fs from 'fs';
fs.writeFileSync('out/sfx_v17.json', JSON.stringify(v17Sfx()));
fs.writeFileSync('out/music_v17.txt', v17Music());
const m = (f: number) => `${Math.floor(f / 3600)}:${String(Math.floor(f / 60) % 60).padStart(2, '0')}`;
console.log('TOTAL', V17_TOTAL, m(V17_TOTAL));
for (const s of SEGS) console.log(m(s.from), s.from, s.dur, s.kind, s.kind === 'focus' ? s.e.k : s.kind === 'match' ? s.m.tag : s.kind === 'star' ? s.i : '');
