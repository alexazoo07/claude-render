import fs from 'fs';
import {geoNaturalEarth1, geoPath, geoArea, geoCentroid} from 'd3-geo';
import * as topo from 'topojson-client';
import {topology} from 'topojson-server';
import {presimplify, simplify, quantile} from 'topojson-simplify';
const g = JSON.parse(fs.readFileSync('/home/claude/ne/subunits50.geojson','utf8'));
const keyOf = (p) => {
  const su=p.SU_A3, a=p.ADM0_A3;
  if (a==='ATA') return null;
  if (a==='GBR') return su;
  if (a==='FRA') return (su==='FXX'||su==='FXC') ? 'FRA' : su;
  if (a==='NLD') return su==='NLD' ? 'NLD' : su;
  if (a==='NOR') return su==='NOR' ? 'NOR' : su;
  if (a==='SRB' || a==='KOS') return a;
  return a;
};
const groups = {};
for (const f of g.features) {
  const k = keyOf(f.properties); if (!k) continue;
  (groups[k] ??= []).push(f.geometry);
}
const feats = {};
for (const [k, geoms] of Object.entries(groups)) {
  const polys = [];
  for (const gm of geoms) { if (gm.type==='Polygon') polys.push(gm.coordinates); else if (gm.type==='MultiPolygon') polys.push(...gm.coordinates); }
  feats[k] = {type:'Feature', properties:{k}, geometry:{type:'MultiPolygon', coordinates: polys}};
}
let tp = topology(feats, 1e5);
tp = presimplify(tp);
tp = simplify(tp, quantile(tp, 0.35));
const proj = geoNaturalEarth1().scale(700).translate([1915, 1000]);
const path = geoPath(proj).digits(1);
const out = {};
for (const k of Object.keys(feats)) {
  const f = topo.feature(tp, tp.objects[k]);
  const d = path(f); if (!d) continue;
  // main polygon for centroid/bbox
  let best=null, ba=-1;
  for (const poly of feats[k].geometry.coordinates) { const a=geoArea({type:'Polygon',coordinates:poly}); if (a>ba){ba=a;best=poly;} }
  const mp = {type:'Polygon', coordinates: best};
  const c = proj(geoCentroid(mp)); const b = path.bounds(mp);
  // part boxes: main polygon box grows to swallow nearby islands; far parts get their own flag image
  let main = [b[0][0], b[0][1], b[1][0], b[1][1]];
  let rest = [];
  for (const poly of feats[k].geometry.coordinates) {
    if (poly === best) continue;
    const bb = path.bounds({type:'Polygon', coordinates: poly});
    if (!isFinite(bb[0][0])) continue;
    rest.push([bb[0][0], bb[0][1], bb[1][0], bb[1][1]]);
  }
  const near = (A,B,M) => A[0]-M <= B[2] && B[0]-M <= A[2] && A[1]-M <= B[3] && B[1]-M <= A[3];
  const D = 26;
  let grow = true;
  while (grow) { grow = false; rest = rest.filter(q => { if (near(main,q,D)) { main=[Math.min(main[0],q[0]),Math.min(main[1],q[1]),Math.max(main[2],q[2]),Math.max(main[3],q[3])]; grow = true; return false; } return true; }); }
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i=0;i<rest.length;i++) for (let j=i+1;j<rest.length;j++) {
      const A=rest[i], B=rest[j];
      if (near(A,B,12)) { rest[i]=[Math.min(A[0],B[0]),Math.min(A[1],B[1]),Math.max(A[2],B[2]),Math.max(A[3],B[3])]; rest.splice(j,1); changed=true; break outer; }
    }
  }
  rest.sort((A,B)=>(B[2]-B[0])*(B[3]-B[1])-(A[2]-A[0])*(A[3]-A[1]));
  const boxes = [main, ...rest.slice(0, 30)].map(q=>q.map(v=>+v.toFixed(1)));
  out[k] = {d, c:[+c[0].toFixed(1), +c[1].toFixed(1)], b: b.map(p=>p.map(v=>+v.toFixed(1))), pb: boxes};
}
fs.writeFileSync('src/world.json', JSON.stringify(out));
console.log(Object.keys(out).length, 'bytes', fs.statSync('src/world.json').size);
const need = ['URY','CHL','BRA','ENG','SCT','WLS','NIR','HKG','SGP','CUW','PRI','TTO','CPV','QAT','SRB','FRA','NLD','NOR','DNK','CHN','USA','RUS'];
console.log(need.filter(k=>!out[k]));
console.log('USA', out.USA.c, out.USA.b, 'ARG', out.ARG.c, 'JPN', out.JPN.c);
