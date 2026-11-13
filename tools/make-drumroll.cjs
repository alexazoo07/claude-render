// Sintetiza los efectos de intriga del canal (sin copyright, generados aquí):
//   public/sfx2/roll.wav  -> redoble de caja + pandereta en crescendo, dura EXACTAMENTE ROLL s y se corta en seco
//   public/sfx2/hit.wav   -> golpe final (bombo + caja + platillo + pandereta) que suena justo con el veredicto
// Uso: node tools/make-drumroll.cjs [segundos=2.4] [nombre=roll]   (Shorts: node tools/make-drumroll.cjs 1.4 roll_s)
const fs = require('fs');
const path = require('path');
const SR = 48000;
const ROLL = parseFloat(process.argv[2] || '2.4');
const NAME = process.argv[3] || 'roll'; // p. ej. 'roll_s' para el redoble corto de los Shorts (1.4 s)
let seed = 12345;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; };

// --- piezas ---
function snare(buf, at, amp, pan) {
  const i0 = Math.round(at * SR), n = Math.round(0.09 * SR);
  let hp = 0, prev = 0;
  for (let i = 0; i < n && i0 + i < buf[0].length; i++) {
    const t = i / SR;
    const w = rnd(); hp = 0.85 * (hp + w - prev); prev = w; // ruido con paso alto (bordonero)
    const noise = hp * Math.exp(-t / 0.028);
    const body = Math.sin(2 * Math.PI * (185 + 60 * Math.exp(-t / 0.01)) * t) * Math.exp(-t / 0.018) * 0.55;
    const s = (noise * 0.9 + body) * amp;
    buf[0][i0 + i] += s * (1 - pan * 0.3); buf[1][i0 + i] += s * (1 + pan * 0.3);
  }
}
const JF = [5230, 6840, 7390, 8950, 10350, 11800];
function jingle(buf, at, amp, len = 0.11) {
  const i0 = Math.round(at * SR), n = Math.round(len * SR);
  let hp = 0, prev = 0;
  const ph = JF.map(() => Math.random() * 6.28);
  for (let i = 0; i < n && i0 + i < buf[0].length; i++) {
    const t = i / SR;
    const w = rnd(); hp = 0.6 * (hp + w - prev); prev = w;
    let m = 0; JF.forEach((f, k) => { m += Math.sin(2 * Math.PI * f * t + ph[k]) / JF.length; });
    const env = Math.exp(-t / (len * 0.35)) * Math.min(1, t / 0.002);
    const s = (m * 0.7 + hp * 0.5) * env * amp;
    buf[0][i0 + i] += s * 0.85; buf[1][i0 + i] += s * 1.15;
  }
}
function kick(buf, at, amp) {
  const i0 = Math.round(at * SR), n = Math.round(0.5 * SR);
  let phase = 0;
  for (let i = 0; i < n && i0 + i < buf[0].length; i++) {
    const t = i / SR;
    phase += 2 * Math.PI * (48 + 110 * Math.exp(-t / 0.035)) / SR;
    const s = Math.sin(phase) * Math.exp(-t / 0.16) * amp;
    buf[0][i0 + i] += s; buf[1][i0 + i] += s;
  }
}
function crash(buf, at, amp, len = 1.6) {
  const i0 = Math.round(at * SR), n = Math.round(len * SR);
  let hpL = 0, pL = 0, hpR = 0, pR = 0;
  for (let i = 0; i < n && i0 + i < buf[0].length; i++) {
    const t = i / SR;
    const a = rnd(), b = rnd();
    hpL = 0.55 * (hpL + a - pL); pL = a; hpR = 0.55 * (hpR + b - pR); pR = b;
    const env = Math.exp(-t / (len * 0.28)) * Math.min(1, t / 0.003);
    buf[0][i0 + i] += hpL * env * amp; buf[1][i0 + i] += hpR * env * amp;
  }
}

function writeWav(file, buf) {
  const n = buf[0].length;
  let peak = 0; for (const ch of buf) for (const x of ch) peak = Math.max(peak, Math.abs(x));
  const g = 0.89 / (peak || 1); // pico a -1 dBFS
  const out = Buffer.alloc(44 + n * 4);
  out.write('RIFF', 0); out.writeUInt32LE(36 + n * 4, 4); out.write('WAVE', 8);
  out.write('fmt ', 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
  out.write('data', 36); out.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[c][i] * g * 32767))), 44 + i * 4 + c * 2);
  fs.writeFileSync(file, out);
  console.log('ok', file, (n / SR).toFixed(3) + ' s');
}

const dir = path.join(__dirname, '..', 'public', 'sfx2');

// --- redoble ---
{
  const n = Math.round(ROLL * SR), buf = [new Float32Array(n), new Float32Array(n)];
  let t = 0, k = 0;
  while (t < ROLL - 0.004) {
    const p = t / ROLL;
    const amp = 0.22 + 0.78 * Math.pow(p, 1.6);             // crescendo
    const acc = k % 2 ? 0.82 : 1;                            // mano izquierda/derecha
    snare(buf, t, amp * acc * (0.92 + 0.08 * rnd()), k % 2 ? -1 : 1);
    if (k % 2 === 0) jingle(buf, t + 0.004, amp * 0.55, 0.09); // pandereta a la mitad de golpes
    const rate = 15 + 13 * Math.pow(p, 1.3);                  // golpes/s: se acelera
    t += 1 / rate; k++;
  }
  // corte en seco: 8 ms de fundido final
  const f = Math.round(0.008 * SR);
  for (let i = 0; i < f; i++) { const g = 1 - i / f; buf[0][n - f + i] *= g; buf[1][n - f + i] *= g; }
  writeWav(path.join(dir, NAME + '.wav'), buf);
}
// --- golpe final ---
{
  const n = Math.round(1.8 * SR), buf = [new Float32Array(n), new Float32Array(n)];
  kick(buf, 0, 1.0);
  snare(buf, 0, 1.0, 0);
  crash(buf, 0.002, 0.55);
  jingle(buf, 0.003, 0.9, 0.35);
  jingle(buf, 0.12, 0.35, 0.25);
  writeWav(path.join(dir, 'hit.wav'), buf);
}
