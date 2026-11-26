import {SEGS, RANK0, OUTRO0, V11_TOTAL, v11Sfx, v11Music} from '../src/v11/Video11';
import fs from 'fs';
fs.writeFileSync('out/sfx_v11.json', JSON.stringify(v11Sfx()));
fs.writeFileSync('out/music_v11.txt', v11Music());
const m=(f:number)=>Math.floor(f/3600)+':'+String(Math.floor(f/60)%60).padStart(2,'0');
console.log('TOTAL', V11_TOTAL, m(V11_TOTAL), (V11_TOTAL/60).toFixed(2));
for (const s of SEGS) console.log(s.kind, s.kind==='ed'? s.e.y : 'war', s.from, m(s.from));
console.log('rank', RANK0, m(RANK0), 'outro', OUTRO0, m(OUTRO0));
