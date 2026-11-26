import {V37_TOTAL, v37Sfx, v37Music} from '../src/v37/Video37';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v37.json', JSON.stringify(v37Sfx()));
fs.writeFileSync('out/music_v37.txt', v37Music());
console.log('TOTAL', V37_TOTAL, (V37_TOTAL/60).toFixed(2));
