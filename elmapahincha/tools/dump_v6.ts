import {SEGMENTS, TOTAL6, allSfx6, music6, PHASE2} from '../src/v6/Main6';
import fs from 'fs';
fs.writeFileSync('out/sfx_v6.json', JSON.stringify(allSfx6()));
fs.writeFileSync('out/music_v6.txt', music6());
console.log('TOTAL', TOTAL6, (TOTAL6/60).toFixed(1), Math.floor(TOTAL6/3600)+':'+String(Math.floor(TOTAL6/60)%60).padStart(2,'0'), 'PHASE2', PHASE2);
for (const s of SEGMENTS) if (s.kind!=='quick') console.log(s.kind, s.idx ?? '', s.from, s.dur);
console.log(music6());
