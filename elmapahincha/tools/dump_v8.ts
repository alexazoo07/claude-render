import {ITEMS8, V8_TOTAL, v8Sfx, v8Music} from '../src/v8/Video8';
import fs from 'fs';
fs.writeFileSync('out/sfx_v8.json', JSON.stringify(v8Sfx()));
fs.writeFileSync('out/music_v8.txt', v8Music());
console.log('TOTAL', V8_TOTAL, (V8_TOTAL/60).toFixed(1), Math.floor(V8_TOTAL/3600)+':'+String(Math.floor(V8_TOTAL/60)%60).padStart(2,'0'));
for (const s of ITEMS8) console.log(s.kind, s.r?.key ?? s.rs?.map(r=>r.key).join('+') ?? s.conf ?? '', s.from, s.dur);
