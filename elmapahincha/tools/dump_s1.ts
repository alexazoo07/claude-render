import {s1Sfx, s1Music, S1_TOTAL} from '../src/shorts/Short1';
import fs from 'fs';
fs.writeFileSync('out/sfx_s1.json', JSON.stringify(s1Sfx()));
fs.writeFileSync('out/music_s1.txt', s1Music());
console.log(S1_TOTAL);
