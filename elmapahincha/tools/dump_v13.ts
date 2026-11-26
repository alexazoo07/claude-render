import {SEGS, FIN0, OUT0, V13_TOTAL, v13Sfx, v13Music} from '../src/v13/Video13';
import fs from 'fs';
fs.writeFileSync('out/sfx_v13.json', JSON.stringify(v13Sfx()));
fs.writeFileSync('out/music_v13.txt', v13Music());
const m = (f: number) => `${Math.floor(f / 3600)}:${String(Math.floor(f / 60) % 60).padStart(2, '0')}`;
console.log('TOTAL', V13_TOTAL, m(V13_TOTAL));
for (const s of SEGS) console.log(m(s.from), s.from, s.kind, s.kind === 'focus' ? s.e.k : s.kind === 'group' ? s.e.title : 'CTA');
console.log('FIN', m(FIN0), FIN0, 'OUT', m(OUT0), OUT0);
