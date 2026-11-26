import {V39_TOTAL, v39Sfx, v39Music, V39_START} from '../src/v39/Video39';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v39.json', JSON.stringify(v39Sfx()));
fs.writeFileSync('out/music_v39.txt', v39Music());
console.log('TOTAL', V39_TOTAL, (V39_TOTAL/60).toFixed(2), JSON.stringify(V39_START));
