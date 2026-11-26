// node tools/prep_geo.mjs <out.json> <lon> <lat> <scale> <HERO_A3> [extraA3:name,...] [asStates: country names from world-atlas, comma]
// states of hero keyed by name; extra foreign states keyed "A3:name"; countries from world-atlas 50m.
import fs from 'fs';
import {geoMercator, geoPath, geoCentroid, geoArea} from 'd3-geo';
import {feature} from 'topojson-client';
const [out, lon, lat, scale, hero, extra = '', asStates = ''] = process.argv.slice(2);
const proj = geoMercator().center([+lon, +lat]).scale(+scale).translate([2000, 2000]);
const path = geoPath(proj);
const r = (d) => (d || '').replace(/(\.\d)\d+/g, '$1');
const adm = JSON.parse(fs.readFileSync('/home/claude/geo/adm1.geojson'));
const ex = extra ? extra.split(',') : [];
const states = {};
const put = (key, f, o) => {
	const c = proj(geoCentroid(f));
	const b = path.bounds(f);
	states[key] = {d: r(path(f)), c: [Math.round(c[0]), Math.round(c[1])], b: b.flat().map(Math.round), a: Math.round(geoArea(f) * 6371 * 6371), o};
};
for (const f of adm.features) {
	const a3 = f.properties.adm0_a3; const n = f.properties.name || (a3 === 'MEX' ? 'Ciudad de México' : '?');
	if (a3 === hero) put(n, f, hero);
	else if (ex.includes(`${a3}:${n}`)) put(`${a3}:${n}`, f, a3);
}
const w = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const cs = feature(w, w.objects.countries).features;
const countries = {};
const AS = asStates ? asStates.split(',') : [];
for (const f of cs) {
	const n = f.properties.name;
	if (AS.includes(n)) { put(n, f, hero); continue; }
	const b = path.bounds(f);
	if (['Russia', 'Kiribati', 'Fiji', 'Antarctica'].includes(n) && hero !== 'USA') continue;
	if (n === 'Antarctica') continue;
	if (b[1][0] < -1500 || b[0][0] > 5500 || b[1][1] < -1500 || b[0][1] > 5500) continue;
	const c = proj(geoCentroid(f));
	countries[n] = {d: r(path(f)), c: [Math.round(c[0]), Math.round(c[1])]};
}
fs.writeFileSync(out, JSON.stringify({states, countries}));
const tot = Object.values(states).filter((s) => s.o === hero).reduce((a, s) => a + s.a, 0);
console.log(Object.keys(states).length, 'hero area', tot, fs.statSync(out).size);
