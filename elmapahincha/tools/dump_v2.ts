import {ITEMS, V2_TOTAL, v2Sfx} from '../src/v2/Video2';
import fs from 'fs';
fs.writeFileSync('out/sfx_v2.json', JSON.stringify(v2Sfx()));
fs.writeFileSync('out/items_v2.json', JSON.stringify(ITEMS.map(i=>({kind:i.kind,from:i.from,dur:i.dur,conf:i.conf,key:i.r?.key,es:i.r?.es}))));
console.log('TOTAL', V2_TOTAL, (V2_TOTAL/60).toFixed(1), Math.floor(V2_TOTAL/3600)+':'+String(Math.floor(V2_TOTAL/60)%60).padStart(2,'0'));
