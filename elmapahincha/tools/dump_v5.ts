import {ITEMS5, V5_TOTAL, v5Sfx, v5Music} from '../src/v5/Video5';
import fs from 'fs';
fs.writeFileSync('out/sfx_v5.json', JSON.stringify(v5Sfx()));
fs.writeFileSync('out/music_v5.txt', v5Music());
console.log('TOTAL', V5_TOTAL, (V5_TOTAL/60).toFixed(1), Math.floor(V5_TOTAL/3600)+':'+String(Math.floor(V5_TOTAL/60)%60).padStart(2,'0'));
for (const s of ITEMS5) console.log(s.kind, s.r?.key ?? s.rs?.map(r=>r.key).join('+') ?? s.conf ?? '', s.from, s.dur);
