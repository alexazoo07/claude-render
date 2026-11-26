import fs from 'fs';
import {neverSfx} from '../src/shorts/Never';
import {duelSfx} from '../src/shorts/Duel';
import {simSfx} from '../src/shorts/Sim';
import {fortSfx} from '../src/shorts/Fortress';
import {C_BRA, C_ESP, C_MEX, D_ARGBRA, D_ESPPRT} from '../src/shorts/configs';
const all: Record<string, unknown> = {S1: neverSfx(C_BRA), S2: duelSfx(D_ARGBRA), S3: simSfx(), S4: neverSfx(C_ESP), S5: duelSfx(D_ESPPRT), S6: neverSfx(C_MEX), S7: fortSfx()};
for (const [k, v] of Object.entries(all)) fs.writeFileSync(`out/sh/sfx_${k}.json`, JSON.stringify(v));
console.log('ok');
