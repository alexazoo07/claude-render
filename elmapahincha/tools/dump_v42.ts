import {V42_TOTAL, v42Sfx, v42Music, V42_START} from '../src/v42/Video42';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v42.json', JSON.stringify(v42Sfx()));
fs.writeFileSync('out/music_v42.txt', v42Music());
console.log('TOTAL', V42_TOTAL, (V42_TOTAL/60).toFixed(2), JSON.stringify(V42_START));
