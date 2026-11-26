import {SEGS, FIN0} from '../src/v37/Video37';
console.log(JSON.stringify(SEGS.map(s=>[s.kind, (s.e as any).k ?? (s.e as any).title ?? 'cta', s.from, s.dur])), FIN0);
