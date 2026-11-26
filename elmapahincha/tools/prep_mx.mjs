import fs from 'fs';
import {geoMercator, geoPath, geoCentroid} from 'd3-geo';
import {feature} from 'topojson-client';
const proj = geoMercator().center([-102, 23]).scale(5400).translate([2000, 2000]);
const path = geoPath(proj);
const r = (d) => (d || '').replace(/(\.\d)\d+/g, '$1');
const adm = JSON.parse(fs.readFileSync('/home/claude/geo/adm1.geojson'));
const states = {};
for (const f of adm.features) {
	if (f.properties.adm0_a3 !== 'MEX') continue;
	const n = f.properties.name || 'Ciudad de México';
	const c = proj(geoCentroid(f));
	const b = path.bounds(f); states[n] = {d: r(path(f)), c: [Math.round(c[0]), Math.round(c[1])], b: b.flat().map(Math.round)};
}
const w = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const cs = feature(w, w.objects.countries).features;
const countries = {};
for (const f of cs) {
	const b = path.bounds(f);
	if (['Russia', 'Kiribati'].includes(f.properties.name)) continue;
	if (b[1][0] < -500 || b[0][0] > 4500 || b[1][1] < -500 || b[0][1] > 4500) continue;
	const c = proj(geoCentroid(f));
	countries[f.properties.name] = {d: r(path(f)), c: [Math.round(c[0]), Math.round(c[1])]};
}
fs.writeFileSync('src/sh/mx.json', JSON.stringify({states, countries}));
console.log(Object.keys(states).length, Object.keys(countries), fs.statSync('src/sh/mx.json').size);
