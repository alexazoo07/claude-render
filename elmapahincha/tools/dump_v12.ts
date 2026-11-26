import {V12_TOTAL, v12Sfx, v12Music} from '../src/v12/Video12';
import fs from 'fs';
fs.writeFileSync('out/sfx_v12.json', JSON.stringify(v12Sfx()));
fs.writeFileSync('out/music_v12.txt', v12Music());
console.log('TOTAL', V12_TOTAL, (V12_TOTAL/60).toFixed(2));
