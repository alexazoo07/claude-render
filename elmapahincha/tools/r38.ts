import {v38Rnds, v38Fin} from '../src/v38/Video38';
console.log(JSON.stringify(v38Rnds.map((r:any)=>[r.from,r.spinEnd,r.steps.map((s:any)=>s.k+'@'+s.from).join(' ')])), v38Fin);
