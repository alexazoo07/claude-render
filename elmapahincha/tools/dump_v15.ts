import {SEGS, FIN0, OUT0, V15_TOTAL, v15Sfx, v15Music} from '../src/v15/Video15';
import fs from 'fs';
fs.writeFileSync('out/sfx_v15.json', JSON.stringify(v15Sfx()));
fs.writeFileSync('out/music_v15.txt', v15Music());
const m = (f: number) => `${Math.floor(f / 3600)}:${String(Math.floor(f / 60) % 60).padStart(2, '0')}`;
console.log('TOTAL', V15_TOTAL, m(V15_TOTAL));
for (const s of SEGS) console.log(m(s.from), s.from, s.kind, s.kind === 'focus' ? s.e.k : s.kind === 'group' ? s.e.title : 'CTA');
console.log('FIN', m(FIN0), FIN0, 'OUT', m(OUT0), OUT0);
