import fs from 'fs';
import {SEGS, V14_TOTAL, v14Sfx, v14Music} from '../src/v14/Video14';
fs.writeFileSync('out/sfx_v14.json', JSON.stringify(v14Sfx()));
fs.writeFileSync('out/music_v14.txt', v14Music());
console.log(V14_TOTAL, (V14_TOTAL / 60).toFixed(1), 's');
for (const s of SEGS) console.log(s.kind, s.from, (s.from / 60).toFixed(1), s.dur, (s as any).m?.tag ?? (s as any).e?.k ?? (s as any).e?.title ?? '');
