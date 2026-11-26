import fs from 'fs';
import {geoMercator, geoPath, geoArea, geoCentroid} from 'd3-geo';
import {topology} from 'topojson-server';
import {presimplify, simplify, quantile} from 'topojson-simplify';
import * as topo from 'topojson-client';
const g = JSON.parse(fs.readFileSync('/home/claude/ne/subunits50.geojson','utf8'));
const TEAM = ['MEX','USA','CAN','GTM','BLZ','SLV','HND','NIC','CRI','PAN','CUB','JAM','HTI','DOM','PRI','TTO','CUW'];
const groups = {};
for (const f of g.features) {
  const p = f.properties; let k = p.ADM0_A3;
  if (k==='ATA') continue;
  if (k==='USA' && !['USA','USK'].includes(p.SU_A3)) { /* drop Hawaii etc */ if (p.SU_A3==='USH') continue; }
  (groups[k] ??= []).push(f.geometry);
}
const feats = {};
for (const [k, geoms] of Object.entries(groups)) {
  const polys = [];
  for (const gm of geoms) { if (gm.type==='Polygon') polys.push(gm.coordinates); else polys.push(...gm.coordinates); }
  feats[k] = {type:'Feature', properties:{k}, geometry:{type:'MultiPolygon', coordinates: polys}};
}
let tp = topology(feats, 1e5); tp = presimplify(tp); tp = simplify(tp, quantile(tp, 0.3));
const proj = geoMercator().center([-88, 33]).scale(1000).translate([960, 540]);
const path = geoPath(proj).digits(1);
const out = {teams:{}, bg:[]};
for (const k of Object.keys(feats)) {
  const f = topo.feature(tp, tp.objects[k]);
  const c0 = geoCentroid(feats[k]);
  if (!TEAM.includes(k)) {
    if (c0[0] < -175 || c0[0] > -20 || c0[1] < -25) continue;
    const d = path(f); if (d) out.bg.push(d); continue;
  }
  let best=null, ba=-1;
  for (const poly of feats[k].geometry.coordinates) { const a=geoArea({type:'Polygon',coordinates:poly}); if (a>ba){ba=a;best=poly;} }
  const mp = {type:'Polygon', coordinates: best};
  const c = proj(geoCentroid(mp)); const b = path.bounds(mp);
  out.teams[k] = {d: path(f), c:[+c[0].toFixed(1),+c[1].toFixed(1)], b: b.map(p=>p.map(v=>+v.toFixed(1)))};
}
fs.writeFileSync('src/v3/geo3.json', JSON.stringify(out));
for (const k of TEAM) console.log(k, out.teams[k]?.c, out.teams[k]?.b);
console.log('bg', out.bg.length, fs.statSync('src/v3/geo3.json').size);
