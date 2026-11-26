import {SEGMENTS, TOTAL3, allSfx} from '../src/v3/Main3';
import fs from 'fs';
fs.writeFileSync('out/sfx_v3.json', JSON.stringify(allSfx()));
fs.writeFileSync('out/segments_v3.json', JSON.stringify(SEGMENTS.map(s=>({kind:s.kind,from:s.from,dur:s.dur,idx:s.idx}))));
console.log('TOTAL', TOTAL3, (TOTAL3/60).toFixed(1), Math.floor(TOTAL3/3600)+':'+String(Math.floor(TOTAL3/60)%60).padStart(2,'0'));
for (const s of SEGMENTS) console.log(s.kind, s.idx ?? '', s.from, s.dur);
