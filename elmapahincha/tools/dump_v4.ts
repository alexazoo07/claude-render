import {ITEMS4, V4_TOTAL, v4Sfx, v4Music} from '../src/v4/Video4';
import fs from 'fs';
fs.writeFileSync('out/sfx_v4.json', JSON.stringify(v4Sfx()));
fs.writeFileSync('out/music_v4.txt', v4Music());
console.log('TOTAL', V4_TOTAL, (V4_TOTAL/60).toFixed(1), Math.floor(V4_TOTAL/3600)+':'+String(Math.floor(V4_TOTAL/60)%60).padStart(2,'0'));
for (const s of ITEMS4) console.log(s.kind, s.e?.key ?? s.cat ?? '', s.from, s.dur);
console.log(v4Music());
