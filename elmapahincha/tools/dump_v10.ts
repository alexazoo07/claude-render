import {SEGS, MATCHES, CHAMP0, OUTRO0, V10_TOTAL, v10Sfx, v10Music} from '../src/v10/Video10';
import fs from 'fs';
fs.writeFileSync('out/sfx_v10.json', JSON.stringify(v10Sfx()));
fs.writeFileSync('out/music_v10.txt', v10Music());
const m=(f:number)=>Math.floor(f/3600)+':'+String(Math.floor(f/60)%60).padStart(2,'0');
console.log('TOTAL', V10_TOTAL, m(V10_TOTAL));
for (const s of SEGS) console.log(s.kind, s.kind==='match'? s.mi.m.a+'-'+s.mi.m.b+' K='+s.mi.K+' E='+s.mi.E : 'r'+s.r, s.from, m(s.from), s.dur);
console.log('champ', CHAMP0, m(CHAMP0), 'outro', OUTRO0, m(OUTRO0));
