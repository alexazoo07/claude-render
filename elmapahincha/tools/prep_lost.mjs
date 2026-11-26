import fs from 'fs';
import {geoNaturalEarth1, geoPath, geoArea} from 'd3-geo';
import {feature, merge} from 'topojson-client';
const proj = geoNaturalEarth1().scale(700).translate([1915, 1000]);
const path = geoPath(proj);
const us = JSON.parse(fs.readFileSync('/home/claude/npmx/node_modules/us-atlas/states-10m.json'));
const ids = ['06', '32', '49', '04', '35', '08'];
const cession = merge(us, us.objects.states.geometries.filter((g) => ids.includes(g.id)));
const texas = merge(us, us.objects.states.geometries.filter((g) => g.id === '48'));
// hand-drawn approximate historical areas (lon, lat), rings closed by d3
const ring = (pts) => { const a = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [[...pts, pts[0]]]}}; const b = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [[...pts, pts[0]].reverse()]}}; return geoArea(a) < geoArea(b) ? a : b; };
const R = {
	LITORAL: [[-70.1, -21.4], [-68.5, -21.3], [-67.9, -22.8], [-67.2, -23.0], [-67.3, -24.0], [-70.6, -24.0], [-70.4, -23.0]],
	TARAPACA: [[-70.4, -18.35], [-69.5, -17.5], [-68.9, -18.9], [-68.4, -19.4], [-68.5, -21.3], [-70.1, -21.4], [-70.3, -19.5]],
	ACRE: [[-73.9, -7.4], [-72.6, -7.5], [-70.5, -8.0], [-68.9, -8.6], [-67.0, -9.6], [-66.6, -9.9], [-67.6, -10.7], [-68.8, -11.1], [-69.6, -10.95], [-70.6, -9.6], [-70.6, -11.0], [-72.3, -10.0], [-72.8, -9.4], [-73.2, -9.4], [-73.0, -8.9]],
	CHACO: [[-62.6, -22.2], [-61.0, -20.1], [-59.0, -19.3], [-58.2, -19.8], [-58.0, -20.6], [-58.8, -22.3], [-60.0, -23.2], [-62.3, -22.4]],
	FORMOSA: [[-62.3, -22.4], [-60.0, -23.2], [-58.2, -24.6], [-58.4, -26.2], [-60.0, -25.4], [-62.6, -24.0]],
	MATOGROSSO: [[-57.9, -20.0], [-57.8, -22.1], [-55.6, -22.6], [-54.3, -23.9], [-54.0, -22.4], [-55.0, -21.0]],
	AMAZONIA_EC: [[-75.25, -0.2], [-75.6, -1.5], [-76.6, -2.6], [-78.0, -3.4], [-78.4, -4.5], [-77.0, -4.9], [-75.0, -4.6], [-73.2, -4.0], [-71.8, -4.2], [-70.3, -3.8], [-70.0, -2.5], [-72.0, -2.4], [-73.6, -1.3]],
	ESEQUIBO: [[-60.0, 8.5], [-58.6, 6.9], [-58.4, 5.4], [-58.6, 3.9], [-58.8, 1.4], [-59.7, 1.3], [-60.1, 2.6], [-59.8, 3.6], [-60.7, 4.4], [-61.4, 5.2], [-60.7, 5.2], [-60.3, 6.5], [-61.1, 7.0]],
};
const out = {};
const put = (k, f) => { const d = path(f); const b = path.bounds(f); const c = path.centroid(f); out[k] = {d: d.replace(/(\.\d)\d+/g, '$1'), c: [Math.round(c[0] * 10) / 10, Math.round(c[1] * 10) / 10], b: [[b[0][0], b[0][1]], [b[1][0], b[1][1]]]}; };
put('CESION', {type: 'Feature', geometry: cession});
put('TEXAS', {type: 'Feature', geometry: texas});
for (const [k, pts] of Object.entries(R)) put(k, ring(pts));
fs.writeFileSync('src/v42/lost.json', JSON.stringify(out));
for (const [k, v] of Object.entries(out)) console.log(k, v.c, v.b.map((p) => p.map(Math.round)), v.d.length);
