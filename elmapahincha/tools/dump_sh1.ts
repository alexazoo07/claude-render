import {SH1_TOTAL, sh1Sfx, sh1Music} from '../src/sh/Short1';
import fs from 'fs';
fs.writeFileSync('out/sfx_sh1.json', JSON.stringify(sh1Sfx()));
fs.writeFileSync('out/music_sh1.txt', sh1Music());
console.log('TOTAL', SH1_TOTAL, (SH1_TOTAL/60).toFixed(2));
