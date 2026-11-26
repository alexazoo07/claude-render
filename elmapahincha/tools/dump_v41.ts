import {V41_TOTAL, v41Sfx, v41Music, V41_START} from '../src/v41/Video41';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v41.json', JSON.stringify(v41Sfx()));
fs.writeFileSync('out/music_v41.txt', v41Music());
console.log('TOTAL', V41_TOTAL, (V41_TOTAL/60).toFixed(2), JSON.stringify(V41_START));
