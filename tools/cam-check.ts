// Comprueba la fluidez de la cámara de un vídeo: busca saltos (cambio de vista enorme entre 2 fotogramas)
// y "tirones" (cambio brusco de velocidad). Uso: npx esbuild tools/cam-check.ts --bundle --platform=node --outfile=out/cam-check.cjs && node out/cam-check.cjs
import { camAt } from '../src/engine/MapLayer';
import { VIDEOS } from '../src/videos';

const id = process.argv[2] || 'chicle';
const spec: any = VIDEOS.find((x) => x.spec.id === id)!.spec;
const fps = spec.fps || 60, N = Math.round(spec.dur * fps);
// velocidad en "pantallas por segundo": desplazamiento / ancho visible, y zoom en log
const vel: number[] = [];
let prev = camAt(0, spec.cams);
for (let f = 1; f < N; f++) {
  const v = camAt(f / fps, spec.cams);
  const dp = Math.hypot(v.x - prev.x, v.y - prev.y) / v.w, dz = Math.abs(Math.log(v.w / prev.w));
  vel.push((dp + dz) * fps);
  prev = v;
}
let worstJump = { f: 0, v: 0 }, worstJerk = { f: 0, v: 0 };
for (let i = 1; i < vel.length; i++) {
  if (vel[i] > worstJump.v) worstJump = { f: i + 1, v: vel[i] };
  const jerk = Math.abs(vel[i] - vel[i - 1]) * fps;
  if (jerk > worstJerk.v) worstJerk = { f: i + 1, v: jerk };
}
const bad = vel.map((x, i) => ({ i, j: i ? Math.abs(x - vel[i - 1]) * fps : 0 })).filter((x) => x.j > 6);
console.log(`frames ${N} · vel máx ${worstJump.v.toFixed(2)} pant/s @ ${(worstJump.f / fps).toFixed(2)} s · tirón máx ${worstJerk.v.toFixed(2)} @ ${(worstJerk.f / fps).toFixed(2)} s · fotogramas con tirón > 6: ${bad.length}`);
bad.slice(0, 15).forEach((b) => console.log(`  t=${((b.i + 1) / fps).toFixed(2)} tirón ${b.j.toFixed(1)}`));

// salto = pico de velocidad de UN fotograma respecto a sus vecinos (lo que se ve como "rebote")
let spike = { t: 0, v: 0 };
for (let i = 1; i < vel.length - 1; i++) { const s = vel[i] - (vel[i - 1] + vel[i + 1]) / 2; if (Math.abs(s) > Math.abs(spike.v)) spike = { t: (i + 1) / fps, v: s }; }
console.log(`pico de 1 fotograma máx: ${spike.v.toFixed(3)} pant/s @ ${spike.t.toFixed(2)} s (≈0 = continuo; >0,5 = salto visible)`);
const top = vel.map((x, i) => ({ t: (i + 1) / fps, x })).sort((a, b) => b.x - a.x).filter((a, i, arr) => arr.findIndex((b) => Math.abs(b.t - a.t) < 2) === i).slice(0, 6);
console.log('viajes más rápidos (pantallas/s):', top.map((a) => `${a.t.toFixed(1)}s=${a.x.toFixed(2)}`).join('  '));
