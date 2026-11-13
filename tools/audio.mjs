// Genera música original (sin derechos) y efectos de sonido -> public/audio
// Uso: node tools/audio.mjs            (todo)
//      node tools/audio.mjs music      (solo música)
import fs from 'node:fs';
const SR = 44100;
fs.mkdirSync('public/audio/sfx', { recursive: true });
fs.mkdirSync('public/music', { recursive: true });

// ---------- utilidades ----------
let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const noise = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function writeWav(file, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, (R ?? L)[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}
function normalize(L, R, peak = 0.89) {
  let m = 1e-9; for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R ? R[i] : 0));
  const g = peak / m; for (let i = 0; i < L.length; i++) { L[i] *= g; if (R) R[i] *= g; }
}
const add = (buf, start, sig, gain = 1) => { const s = Math.round(start * SR); for (let i = 0; i < sig.length && s + i < buf.length; i++) if (s + i >= 0) buf[s + i] += sig[i] * gain; };

// ---------- instrumentos ----------
function pluckKS(freq, dur, bright = 0.5, decay = 0.996) { // Karplus-Strong (ukelele/guitarra)
  const n = Math.round(dur * SR), p = Math.max(2, Math.round(SR / freq)), d = new Float32Array(p), out = new Float32Array(n);
  for (let i = 0; i < p; i++) d[i] = noise() * (1 - bright) + (i < p / 2 ? 1 : -1) * bright * 0.6;
  let idx = 0;
  for (let i = 0; i < n; i++) { const a = d[idx], b = d[(idx + 1) % p]; out[i] = a; d[idx] = (a + b) * 0.5 * decay; idx = (idx + 1) % p; }
  for (let i = 0; i < 200 && i < n; i++) out[n - 1 - i] *= i / 200;
  return out;
}
function marimba(freq, dur = 0.6) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; o[i] = (Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 7) + 0.35 * Math.sin(2 * Math.PI * freq * 4 * t) * Math.exp(-t * 28) + 0.12 * Math.sin(2 * Math.PI * freq * 10 * t) * Math.exp(-t * 60)) * Math.min(1, t * 800); }
  return o;
}
function bell(freq, dur = 1.2) {
  const n = Math.round(dur * SR), o = new Float32Array(n), P = [[1, 1, 3], [2.76, 0.5, 6], [5.4, 0.25, 10], [8.93, 0.12, 16]];
  for (let i = 0; i < n; i++) { const t = i / SR; let s = 0; for (const [m, a, d] of P) s += a * Math.sin(2 * Math.PI * freq * m * t) * Math.exp(-t * d); o[i] = s * Math.min(1, t * 2000) * 0.5; }
  return o;
}
function bass(freq, dur) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, ph = (freq * t) % 1; const tri = 1 - 4 * Math.abs(ph - 0.5); o[i] = (0.7 * Math.sin(2 * Math.PI * freq * t) + 0.3 * tri) * Math.min(1, t * 300) * Math.min(1, (dur - t) * 30) * (0.85 + 0.15 * Math.exp(-t * 6)); }
  return o;
}
function kick() { const n = Math.round(0.35 * SR), o = new Float32Array(n); let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; const f = 45 + 110 * Math.exp(-t * 30); ph += f / SR; o[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 9) + (i < 60 ? noise() * 0.3 : 0); } return o; }
function clap() { const n = Math.round(0.25 * SR), o = new Float32Array(n); let lp = 0, prev = 0; for (let i = 0; i < n; i++) { const t = i / SR; const env = (t < 0.03 ? (Math.floor(t * 300) % 2 ? 0.6 : 1) : 1) * Math.exp(-t * 18); const x = noise(); const hp = x - prev; prev = x; lp += (hp - lp) * 0.35; o[i] = (lp * 1.6 + 0.25 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 30)) * env; } return o; }
function hat(open = false) { const n = Math.round((open ? 0.22 : 0.05) * SR), o = new Float32Array(n); let prev = 0; for (let i = 0; i < n; i++) { const t = i / SR, x = noise(); o[i] = (x - prev) * Math.exp(-t * (open ? 14 : 70)) * 0.5; prev = x; } return o; }
function shaker() { const n = Math.round(0.09 * SR), o = new Float32Array(n); let prev = 0; for (let i = 0; i < n; i++) { const t = i / SR, x = noise(); o[i] = (x - prev) * Math.sin(Math.PI * t / 0.09) * 0.25; prev = x; } return o; }

// reverb sencilla (combs + allpass) sobre un envío
function reverb(x, mix = 0.22) {
  const out = new Float32Array(x.length), combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  for (let n = 0; n < x.length; n++) { let s = 0; for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x[n] + y * 0.78; c.i = (c.i + 1) % c.d; s += y; } out[n] = s * 0.25; }
  for (const d of [225, 556]) { const b = new Float32Array(d); let i = 0; for (let n = 0; n < out.length; n++) { const y = b[i]; const v = out[n] + y * 0.5; b[i] = v; out[n] = y - v * 0.5; i = (i + 1) % d; } }
  for (let n = 0; n < x.length; n++) out[n] *= mix;
  return out;
}

// ---------- compositor de canciones ----------
const PROGS = { pop: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], sunny: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]], quest: [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]] };
function song({ name, bpm, key, prog, secs = 150, s = 7, swing = 0.04, lead = 'marimba' }) {
  seed = s;
  const N = Math.round(secs * SR), L = new Float32Array(N), R = new Float32Array(N), SEND = new Float32Array(N);
  const beat = 60 / bpm, bar = beat * 4, bars = Math.floor(secs / bar);
  const P = PROGS[prog];
  const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21]; // pentatónica mayor
  // motivos de melodía (índices de escala, null = silencio) - 8 corcheas
  const motifs = Array.from({ length: 4 }, () => Array.from({ length: 8 }, (_, i) => (rnd() < (i % 2 ? 0.55 : 0.85) ? Math.floor(rnd() * 7) : null)));
  const K = kick(), CL = clap(), HC = hat(), HO = hat(true), SH = shaker();
  for (let b = 0; b < bars; b++) {
    const t0 = b * bar, ch = P[b % 4];
    const sec = b < 4 ? 'intro' : b % 16 >= 12 && b % 16 < 14 && b > 16 ? 'break' : b % 32 >= 16 ? 'B' : 'A';
    const end = b >= bars - 2;
    const drums = sec !== 'intro' && sec !== 'break' && !end;
    // batería
    for (let q = 0; q < 4; q++) {
      const tq = t0 + q * beat;
      if (drums && (q === 0 || q === 2 || (sec === 'B' && q === 3 && b % 2))) { add(L, tq, K, 0.9); add(R, tq, K, 0.9); }
      if (drums && (q === 1 || q === 3)) { add(L, tq, CL, 0.42); add(R, tq, CL, 0.5); add(SEND, tq, CL, 0.3); }
      for (let e = 0; e < 2; e++) {
        const te = tq + e * beat / 2 + (e ? swing : 0);
        if (sec !== 'break' && !end) { add(L, te, e ? HC : SH, 0.32); add(R, te, e ? HC : SH, 0.22); }
      }
      if (drums && q === 3 && b % 4 === 3) add(R, tq + beat / 2, HO, 0.25);
    }
    // bajo
    if (sec !== 'intro') {
      const root = mtof(key - 24 + ch[0]);
      for (const [o, d, f] of [[0, beat * 1.5, root], [beat * 1.5, beat * 0.5, root], [beat * 2, beat * 1.5, root], [beat * 3.5, beat * 0.5, root * 2]]) { const sg = bass(f, d * 0.95); add(L, t0 + o, sg, 0.5); add(R, t0 + o, sg, 0.5); }
    }
    // ukelele (acordes rasgueados en contratiempo)
    for (const o of [0.5, 1.5, 2.5, 3, 3.5]) {
      if (end && o > 0.5) continue;
      ch.forEach((n, j) => { const sg = pluckKS(mtof(key + n), 0.6, 0.35, 0.994); const tt = t0 + o * beat + j * 0.012 + (o % 1 ? swing : 0); add(L, tt, sg, 0.16); add(R, tt, sg, 0.2); add(SEND, tt, sg, 0.08); });
    }
    // melodía
    if (sec === 'A' || sec === 'B' || sec === 'break') {
      const m = motifs[(b % 4) + (sec === 'B' ? 0 : 0)] ;
      const mm = sec === 'B' ? motifs[(b + 2) % 4] : m;
      mm.forEach((deg, i) => {
        if (deg === null) return;
        const midi = key + 12 + scale[deg] + (sec === 'B' ? 12 : 0) - (scale[deg] > 12 ? 12 : 0);
        const tt = t0 + i * beat / 2 + (i % 2 ? swing : 0);
        const sg = lead === 'bell' ? bell(mtof(midi), 0.8) : marimba(mtof(midi), 0.7);
        add(L, tt, sg, 0.26); add(R, tt, sg, 0.2); add(SEND, tt, sg, 0.22);
      });
    }
    // brillo cada 8 compases
    if (b % 8 === 7 && !end) { const sg = bell(mtof(key + 24 + ch[2]), 1.4); add(L, t0 + beat * 3, sg, 0.12); add(R, t0 + beat * 3, sg, 0.16); add(SEND, t0 + beat * 3, sg, 0.2); }
  }
  // final: acorde largo
  const tf = bars * bar - bar * 2;
  P[0].forEach((n) => { const sg = pluckKS(mtof(key + n), 3, 0.3, 0.999); add(L, tf, sg, 0.2); add(R, tf, sg, 0.2); });
  const rv = reverb(SEND, 0.5);
  for (let i = 0; i < N; i++) { L[i] = Math.tanh((L[i] + rv[i]) * 1.1); R[i] = Math.tanh((R[i] + rv[Math.max(0, i - 300)]) * 1.1); }
  normalize(L, R, 0.85);
  writeWav(`public/music/${name}.wav`, L, R);
  console.log('música:', name, bars, 'compases', (bars * bar).toFixed(1) + 's');
}

// ---------- efectos ----------
function sfx() {
  const mk = (dur, fn) => { const n = Math.round(dur * SR), o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = fn(i / SR, i); return o; };
  seed = 3;
  let lp = 0;
  const whoosh = mk(0.7, (t) => { const env = Math.sin(Math.PI * Math.min(1, t / 0.7)) ** 2; const c = 0.02 + 0.25 * env; lp += (noise() - lp) * c; return lp * env * 2.2; });
  let ph = 0;
  const pop = mk(0.16, (t) => { ph += (300 + 900 * Math.exp(-t * 40)) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-t * 22); });
  const ding = bell(1318.5, 1.3);
  const ding2 = bell(1760, 1.3); for (let i = 0; i < ding.length; i++) ding[i] = ding[i] * 0.7 + (ding2[i - 3000] || 0) * 0.6;
  let p2 = 0, lp2 = 0;
  const stamp = mk(0.6, (t) => { p2 += (55 + 60 * Math.exp(-t * 25)) / SR; lp2 += (noise() - lp2) * 0.3; return Math.sin(2 * Math.PI * p2) * Math.exp(-t * 7) * 1.1 + lp2 * Math.exp(-t * 30) * 1.4; });
  let prev = 0;
  const swipe = mk(0.3, (t) => { const x = noise(); const h = x - prev; prev = x; return h * Math.sin(Math.PI * t / 0.3) * 0.6; });
  const tick = mk(0.05, (t) => Math.sin(2 * Math.PI * 2200 * t) * Math.exp(-t * 120) * 0.8);
  let p3 = 0, lp3 = 0;
  const riser = mk(1.6, (t) => { p3 += (200 + 900 * (t / 1.6) ** 2) / SR; lp3 += (noise() - lp3) * (0.05 + 0.3 * t / 1.6); return (Math.sin(2 * Math.PI * p3) * 0.3 + lp3 * 1.2) * (t / 1.6) ** 1.5 * Math.min(1, (1.6 - t) * 20); });
  const sparkle = new Float32Array(Math.round(1.2 * SR)); [2093, 2637, 3136, 4186].forEach((f, i) => add(sparkle, i * 0.06, bell(f, 0.8), 0.4));
  const tada = new Float32Array(Math.round(2 * SR)); [0, 4, 7, 12].forEach((n, i) => add(tada, i * 0.07, pluckKS(mtof(72 + n), 1.8, 0.4, 0.998), 0.5)); add(tada, 0.28, bell(mtof(84), 1.5), 0.3);
  const boing = mk(0.5, (t) => Math.sin(2 * Math.PI * (180 + 120 * Math.sin(t * 40) * Math.exp(-t * 5)) * t) * Math.exp(-t * 6));
  const sad = new Float32Array(Math.round(1.4 * SR)); [67, 66, 65, 64].forEach((n, i) => add(sad, i * 0.28, marimba(mtof(n), 0.6), 0.6));
  const all = { whoosh, pop, ding, stamp, swipe, tick, riser, sparkle, tada, boing, sad };
  for (const [k, v] of Object.entries(all)) { normalize(v, null, 0.9); writeWav(`public/audio/sfx/${k}.wav`, v, v); }
  console.log('sfx:', Object.keys(all).join(', '));
}

const only = process.argv[2];
if (!only || only === 'sfx') sfx();
if (!only || only === 'music') {
  song({ name: 'alegre', bpm: 112, key: 60, prog: 'pop', s: 11 });
  song({ name: 'soleado', bpm: 104, key: 62, prog: 'sunny', s: 23, lead: 'bell' });
  song({ name: 'aventura', bpm: 120, key: 57, prog: 'quest', s: 41 });
}
