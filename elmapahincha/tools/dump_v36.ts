import {V36_TOTAL, v36Sfx, v36Music} from '../src/v36/Video36';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v36.json', JSON.stringify(v36Sfx()));
fs.writeFileSync('out/music_v36.txt', v36Music());
console.log('TOTAL', V36_TOTAL, (V36_TOTAL/60).toFixed(2));
