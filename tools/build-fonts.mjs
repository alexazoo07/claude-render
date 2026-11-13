// Incrusta las fuentes de public/fonts en src/engine/fontdata.ts (base64) -> el render no hace peticiones de fuentes.
import fs from 'node:fs';
const f = (n) => fs.readFileSync(`public/fonts/${n}.woff2`).toString('base64');
fs.writeFileSync('src/engine/fontdata.ts',
  `// Generado por tools/build-fonts.mjs. No editar.\nexport const LILITA = 'data:font/woff2;base64,${f('lilita')}';\nexport const RUBIK800 = 'data:font/woff2;base64,${f('rubik800')}';\nexport const RUBIK600 = 'data:font/woff2;base64,${f('rubik600')}';\n`);
console.log('fontdata.ts KB:', Math.round(fs.statSync('src/engine/fontdata.ts').size / 1024));
