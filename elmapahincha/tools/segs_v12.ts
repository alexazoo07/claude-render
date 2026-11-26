import {SEGS, FIN0, OUT0} from '../src/v12/Video12';
for (const s of SEGS) console.log(s.kind, s.kind==='focus'? s.e.k : s.e.title, s.from, s.dur, (s.from/60).toFixed(1));
console.log('FIN', FIN0, 'OUT', OUT0);
