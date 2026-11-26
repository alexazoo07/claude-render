import {SCENES, V7_TOTAL, v7Sfx, v7Music} from '../src/v7/Video7';
import fs from 'fs';
fs.writeFileSync('out/sfx_v7.json', JSON.stringify(v7Sfx()));
fs.writeFileSync('out/music_v7.txt', v7Music());
console.log('TOTAL', V7_TOTAL, (V7_TOTAL/60).toFixed(1));
for (const s of SCENES) console.log(s.kind, s.i ?? '', s.from, s.dur);
console.log(v7Music());
