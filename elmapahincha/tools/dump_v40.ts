import {V40_TOTAL, v40Sfx, v40Music, V40_START} from '../src/v40/Video40';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v40.json', JSON.stringify(v40Sfx()));
fs.writeFileSync('out/music_v40.txt', v40Music());
console.log('TOTAL', V40_TOTAL, (V40_TOTAL/60).toFixed(2), JSON.stringify(V40_START));
