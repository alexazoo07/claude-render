import {V38_TOTAL, v38Sfx, v38Music} from '../src/v38/Video38';
import fs from 'fs';
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/sfx_v38.json', JSON.stringify(v38Sfx()));
fs.writeFileSync('out/music_v38.txt', v38Music());
console.log('TOTAL', V38_TOTAL, (V38_TOTAL/60).toFixed(2));
