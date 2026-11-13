// Preprocesa world-atlas -> public/world.json con trazados SVG ya proyectados.
// Espacio mundo: W x H (la cámara hace zoom sobre este espacio).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { geoNaturalEarth1, geoPath, geoArea } from 'd3-geo';
import { feature } from 'topojson-client';
const require = createRequire(import.meta.url);
const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const W = 3840, H = 2000;
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));
const fc = feature(topo, topo.objects.countries);
const proj = geoNaturalEarth1().fitExtent([[20, 20], [W - 20, H - 20]], { type: 'Sphere' });
const path = geoPath(proj).digits(1);

// Territorios sin código numérico ISO en world-atlas
const MANUAL = { Kosovo: 'XK', 'N. Cyprus': 'CY-N', Somaliland: 'SO-SL', 'Indian Ocean Ter.': 'IO', 'Ashmore and Cartier Is.': 'AU-AC', 'Siachen Glacier': 'IN-SG' };
const ESNAME = { XK: 'Kosovo', 'CY-N': 'Chipre del Norte', 'SO-SL': 'Somalilandia' };
// Nombres cortos en español (los de ISO son largos)
const SHORT = { US: 'Estados Unidos', GB: 'Reino Unido', RU: 'Rusia', KR: 'Corea del Sur', KP: 'Corea del Norte', IR: 'Irán', SY: 'Siria', VE: 'Venezuela', BO: 'Bolivia', TZ: 'Tanzania', CD: 'R. D. del Congo', CG: 'Congo', LA: 'Laos', VN: 'Vietnam', MD: 'Moldavia', MK: 'Macedonia del Norte', CZ: 'Chequia', TW: 'Taiwán', PS: 'Palestina', FM: 'Micronesia', BN: 'Brunéi', DO: 'Rep. Dominicana', CF: 'Rep. Centroafricana', AE: 'Emiratos Árabes', VA: 'Vaticano', BA: 'Bosnia', CI: 'Costa de Marfil', SZ: 'Esuatini', TL: 'Timor Oriental', MM: 'Myanmar', NL: 'Países Bajos', EH: 'Sáhara Occidental', FK: 'Malvinas', GL: 'Groenlandia', PG: 'Papúa N. Guinea', SB: 'Islas Salomón' };
const CONT = { // continente por código (para filtros/tours)
};

const out = [];
for (const f of fc.features) {
  const nm = f.properties.name;
  let a2 = f.id && f.id !== '-99' ? countries.numericToAlpha2(f.id) : undefined;
  if (!a2) a2 = MANUAL[nm];
  if (!a2) { console.warn('sin código:', f.id, nm); continue; }
  const d = path(f);
  if (!d) continue;
  // polígono más grande -> punto para la cara y bbox principal
  const polys = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates];
  let best = null, bestA = -1;
  for (const p of polys) { const g = { type: 'Polygon', coordinates: p }; const a = path.area(g); if (a > bestA) { bestA = a; best = g; } }
  // el polígono puede partirse al cruzar el antimeridiano (Rusia, Fiyi): nos quedamos con el subtrazado mayor
  const subs = (path(best) || '').split(/(?=M)/).filter(Boolean);
  const pts = (s) => s.replace(/[MZ]/g, ' ').trim().split(/L/).map((p) => p.trim().split(',').map(Number)).filter((p) => p.length === 2 && !isNaN(p[0]));
  const shoe = (P) => { let a = 0; for (let i = 0; i < P.length; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length]; a += x1 * y2 - x2 * y1; } return Math.abs(a / 2); };
  let mainSub = subs[0], mainA = -1;
  for (const s of subs) { const a = shoe(pts(s)); if (a > mainA) { mainA = a; mainSub = s; } }
  const MP = pts(mainSub);
  const bb = subs.length > 1 ? [[Math.min(...MP.map((p) => p[0])), Math.min(...MP.map((p) => p[1]))], [Math.max(...MP.map((p) => p[0])), Math.max(...MP.map((p) => p[1]))]] : path.bounds(best);
  const c = subs.length > 1 ? [(bb[0][0] + bb[1][0]) / 2, (bb[0][1] + bb[1][1]) / 2] : path.centroid(best);
  const fb = path.bounds(f);
  const prev = out.find((o) => o.id === a2);
  if (prev) { // territorio duplicado (islotes): se fusiona con el país principal
    if (path.area(best) > path.area({ type: 'Polygon', coordinates: [] }) && prev.area >= path.area(f)) { prev.d += d; continue; }
  }
  out.push({
    id: a2,
    name: ESNAME[a2] || SHORT[a2] || countries.getName(a2, 'es') || nm,
    en: countries.getName(a2, 'en') || nm,
    d,
    dm: subs.length > 1 ? mainSub : path(best),
    c: [Math.round(c[0]), Math.round(c[1])],
    bb: bb.map((v) => v.map((x) => Math.round(x))),   // bbox del polígono principal
    fb: fb.map((v) => v.map((x) => Math.round(x))),   // bbox completo
    area: Math.round(path.area(f)),
  });
}
// segunda pasada: duplicados restantes -> se queda el mayor con todos los trazados
for (let i = out.length - 1; i >= 0; i--) { const j = out.findIndex((o) => o.id === out[i].id); if (j !== i) { const [a, b] = out[j].area >= out[i].area ? [out[j], out[i]] : [out[i], out[j]]; a.d += b.d; out[j] = a; out.splice(i, 1); } }
// graticula/esfera para el océano
const sphere = path({ type: 'Sphere' });
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/world.json', JSON.stringify({ W, H, sphere, countries: out }));
console.log('países:', out.length, 'KB:', Math.round(fs.statSync('public/world.json').size / 1024));

// banderas
fs.mkdirSync('public/flags', { recursive: true });
for (const f of fs.readdirSync('node_modules/flag-icons/flags/4x3')) fs.copyFileSync('node_modules/flag-icons/flags/4x3/' + f, 'public/flags/' + f);
console.log('banderas copiadas');




