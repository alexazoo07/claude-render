import {V9_ITEMS, V9_TOTAL, TEASES, RECAP0, OUTRO0, v9Sfx, v9Music} from '../src/v9/Video9';
import fs from 'fs';
fs.writeFileSync('out/sfx_v9.json', JSON.stringify(v9Sfx()));
fs.writeFileSync('out/music_v9.txt', v9Music());
const m=(f:number)=>Math.floor(f/3600)+':'+String(Math.floor(f/60)%60).padStart(2,'0');
console.log('TOTAL', V9_TOTAL, m(V9_TOTAL));
for (const s of V9_ITEMS) console.log(s.s.rank, s.s.key, s.from, m(s.from));
console.log('teases', TEASES.map(t=>t.from).join(','), 'recap', RECAP0, m(RECAP0), 'outro', OUTRO0, m(OUTRO0));
