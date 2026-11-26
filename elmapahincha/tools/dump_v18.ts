import {SEGS, FIN0, OUT0, V18_TOTAL, v18Sfx, v18Music} from '../src/v18/Video18';
import fs from 'fs';
fs.writeFileSync('out/sfx_v18.json', JSON.stringify(v18Sfx()));
fs.writeFileSync('out/music_v18.txt', v18Music());
const m = (f: number) => `${Math.floor(f / 3600)}:${String(Math.floor(f / 60) % 60).padStart(2, '0')}`;
console.log('TOTAL', V18_TOTAL, m(V18_TOTAL));
for (const s of SEGS) console.log(m(s.from), s.from, s.kind, s.kind === 'focus' ? s.e.k : s.kind === 'group' ? s.e.title : 'CTA');
console.log('FIN', m(FIN0), FIN0, 'OUT', m(OUT0), OUT0);
