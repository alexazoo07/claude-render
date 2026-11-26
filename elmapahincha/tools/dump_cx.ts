// npx tsx tools/dump_cx.ts <module e.g. ./src/sh/Short1> <tag>
import fs from 'fs';
const [mod, tag] = process.argv.slice(2);
(async () => {
const m = await import('../' + mod.replace(/^\.\//, ''));
const S = m.SX;
fs.writeFileSync(`out/sfx_${tag}.json`, JSON.stringify(S.sfx()));
fs.writeFileSync(`out/music_${tag}.txt`, S.music());
console.log(tag, S.TOTAL, (S.TOTAL / 60).toFixed(2));
})();
