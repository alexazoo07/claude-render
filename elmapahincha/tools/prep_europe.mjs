import fs from 'fs';
import {geoMercator, geoPath, geoArea, geoCentroid} from 'd3-geo';
import {topology} from 'topojson-server';
import {presimplify, simplify, quantile} from 'topojson-simplify';
import * as topo from 'topojson-client';
const g = JSON.parse(fs.readFileSync('/home/claude/ne/subunits50.geojson','utf8'));
const TEAM = ['ALB','ARM','AUT','AZE','BLR','BEL','BIH','BGR','HRV','CYP','CZE','DNK','ENG','EST','FRO','FIN','FRA','GEO','DEU','GRC','HUN','ISL','IRL','ISR','ITA','KAZ','KOS','LVA','LTU','LUX','MLT','MDA','MNE','NLD','MKD','NIR','NOR','POL','PRT','ROU','RUS','SCT','SRB','SVK','SVN','ESP','SWE','CHE','TUR','UKR','WLS'];
const keyOf = (p) => {
  const su=p.SU_A3, a=p.ADM0_A3;
  if (a==='ATA') return null;
  if (a==='GBR') return su;
  if (a==='FRA') return (su==='FXX'||su==='FXC') ? 'FRA' : su;
  if (a==='NLD') return su==='NLD' ? 'NLD' : su;
  if (a==='NOR') return 'NOR';
  if (a==='DNK') return su==='DNK' ? 'DNK' : su;
  if (a==='CYN') return 'CYP';
  return a;
};
const groups = {};
for (const f of g.features) { const k = keyOf(f.properties); if (!k) continue; (groups[k] ??= []).push(f.geometry); }
const feats = {};
for (const [k, geoms] of Object.entries(groups)) {
  const polys = [];
  for (const gm of geoms) { if (gm.type==='Polygon') polys.push(gm.coordinates); else polys.push(...gm.coordinates); }
  feats[k] = {type:'Feature', properties:{k}, geometry:{type:'MultiPolygon', coordinates: polys}};
}
let tp0 = topology(feats, 1e5);
// adjacency (shared borders) before simplification
const keys = Object.keys(feats);
const coll = {type:'GeometryCollection', geometries: keys.map(k => tp0.objects[k])};
const nbIdx = topo.neighbors(coll.geometries);
const NB = {};
keys.forEach((k,i)=>{ if (TEAM.includes(k)) NB[k] = nbIdx[i].map(j=>keys[j]).filter(x=>TEAM.includes(x) && x!==k); });
let tp = presimplify(tp0); tp = simplify(tp, quantile(tp, 0.3));
const proj = geoMercator().center([14, 55]).scale(900).translate([960, 540]);
const path = geoPath(proj).digits(1);
const out = {teams:{}, bg:[], nb: NB};
for (const k of keys) {
  const f = topo.feature(tp, tp.objects[k]);
  const c0 = geoCentroid(feats[k]);
  if (!TEAM.includes(k)) {
    if (c0[0] < -60 || c0[0] > 110 || c0[1] < 0) continue;
    const d = path(f); if (d) out.bg.push(d); continue;
  }
  let best=null, ba=-1;
  for (const poly of feats[k].geometry.coordinates) { const a=geoArea({type:'Polygon',coordinates:poly}); if (a>ba){ba=a;best=poly;} }
  const mp = {type:'Polygon', coordinates: best};
  const c = proj(geoCentroid(mp)); const b = path.bounds(mp);
  // part boxes: main box grows with near islands, far parts separate
  let main=[b[0][0],b[0][1],b[1][0],b[1][1]], rest=[];
  for (const poly of feats[k].geometry.coordinates) { if (poly===best) continue; const bb=path.bounds({type:'Polygon',coordinates:poly}); if (!isFinite(bb[0][0])) continue; rest.push([bb[0][0],bb[0][1],bb[1][0],bb[1][1]]); }
  const near=(A,B,M)=>A[0]-M<=B[2]&&B[0]-M<=A[2]&&A[1]-M<=B[3]&&B[1]-M<=A[3];
  let grow=true; while(grow){grow=false; rest=rest.filter(q=>{ if(near(main,q,30)){main=[Math.min(main[0],q[0]),Math.min(main[1],q[1]),Math.max(main[2],q[2]),Math.max(main[3],q[3])];grow=true;return false;} return true;});}
  let ch=true; while(ch){ch=false; o: for(let i=0;i<rest.length;i++)for(let j=i+1;j<rest.length;j++){const A=rest[i],B=rest[j]; if(near(A,B,14)){rest[i]=[Math.min(A[0],B[0]),Math.min(A[1],B[1]),Math.max(A[2],B[2]),Math.max(A[3],B[3])];rest.splice(j,1);ch=true;break o;}}}
  out.teams[k] = {d: path(f), c:[+c[0].toFixed(1),+c[1].toFixed(1)], b: b.map(p=>p.map(v=>+v.toFixed(1))), pb:[main,...rest.slice(0,30)].map(q=>q.map(v=>+v.toFixed(1)))};
}
fs.writeFileSync('src/v6/geo6.json', JSON.stringify(out));
console.log('teams', Object.keys(out.teams).length, 'missing', TEAM.filter(k=>!out.teams[k]), 'bg', out.bg.length, fs.statSync('src/v6/geo6.json').size);
for (const k of TEAM) console.log(k, out.teams[k]?.c, JSON.stringify(NB[k]));
