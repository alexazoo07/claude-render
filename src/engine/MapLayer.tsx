import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import type { Cam, Fill } from './builder';
import { C, mix } from './theme';
import { COUNTRIES, H, W } from './world';
import { LAY } from './layout';

export const VW = 1920, VH = 1080;
// Texturas de relieve/océano (3830x1720 en su espacio original, NaturalEarth scale 700, translate [1915,1000])
// -> en nuestro espacio (scale 688.98, translate [1920,1000]): factor 0.98433
const TK = 688.98097629501 / 700;
export const TEX = { x: 1920 - 1915 * TK, y: 1000 - 980 * TK, w: 3830 * TK, h: 1720 * TK };
export type View = { x: number; y: number; w: number; h: number }; // centro + ancho visible (espacio mundo)

// CÁMARA FLUIDA (v3.1): sin "rebote".
// 1) Cada viaje arranca EXACTAMENTE desde donde está la cámara (incluida la deriva lenta): antes la deriva
//    acercaba hasta un 7 % y al empezar el viaje saltaba de golpe hacia atrás.
// 2) Trayectoria zoom+desplazamiento óptima de van Wijk & Nuij: el país destino se acerca al centro de forma
//    monótona (con posición lineal + zoom exponencial el destino primero se alejaba y luego volvía).
// 3) "smootherstep" (aceleración nula al principio y al final) en vez de quint (muy brusco a mitad).
const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
type V3 = { x: number; y: number; w: number };
const RHO = 1.15; // cuánto se aleja a mitad de un viaje largo (1.42 = clásico; menor = menos arco)
const flyTo = (a: V3, b: V3, e: number): V3 => {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
  const w0 = a.w, w1 = b.w, r2 = RHO * RHO;
  if (d < 1e-6 * Math.max(w0, w1)) { const w = w0 * Math.pow(w1 / w0, e); return { x: a.x + dx * e, y: a.y + dy * e, w }; }
  const b0 = (w1 * w1 - w0 * w0 + r2 * r2 * d * d) / (2 * w0 * r2 * d);
  const b1 = (w1 * w1 - w0 * w0 - r2 * r2 * d * d) / (2 * w1 * r2 * d);
  const R0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), R1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (R1 - R0) / RHO, s = e * S;
  const u = (w0 / r2) * (Math.cosh(R0) * Math.tanh(RHO * s + R0) - Math.sinh(R0));
  const w = (w0 * Math.cosh(R0)) / Math.cosh(RHO * s + R0);
  const f = e >= 1 ? 1 : u / d;
  return { x: a.x + dx * f, y: a.y + dy * f, w: e >= 1 ? w1 : Math.min(w, W * 1.15) };
};
// deriva lenta (Ken Burns) mientras la cámara está quieta: arranca y se frena sola (curva gaussiana, máx. 4,5 %)
const driftW = (w: number, dt: number) => w * (1 - 0.045 * (1 - Math.exp(-(dt * dt) / 50)));
// vista de un tramo: viaje desde `from` hasta el destino k, y luego deriva
const segAt = (from: V3, k: Cam, tau: number): V3 => {
  if (tau < k.dur && k.dur > 0.01) return flyTo(from, { x: k.x, y: k.y, w: k.w }, ease(Math.max(0, tau / k.dur)));
  return { x: k.x, y: k.y, w: driftW(k.w, tau - Math.max(0, k.dur)) };
};
export const camAt = (t: number, cams: Cam[]): View => {
  if (!cams.length) return { x: W / 2, y: H / 2, w: W, h: (W * LAY.h) / LAY.w };
  let from: V3 = { x: cams[0].x, y: cams[0].y, w: cams[0].w };
  let cur = cams[0];
  for (let i = 1; i < cams.length; i++) {
    const k = cams[i];
    if (t < k.t) break;
    from = segAt(from, cur, k.t - cur.t); // posición real de la cámara al empezar este viaje
    cur = k;
  }
  const v = segAt(from, cur, t - cur.t);
  return { ...v, h: (v.w * LAY.h) / LAY.w };
};
export const toScreen = (v: View, x: number, y: number): [number, number] => [((x - (v.x - v.w / 2)) / v.w) * LAY.w, ((y - (v.y - v.h / 2)) / v.h) * LAY.h];

// ---------- banderas como data-URL (para que el SVG nunca salga vacío) ----------
export const FLAG_CACHE: Record<string, string> = {};
const flagFile = (id: string) => staticFile(`flags/${id.toLowerCase()}.svg`);
export const flagUrl = (id: string) => FLAG_CACHE[id] || flagFile(id); // usa la caché en memoria si ya está
export const useFlags = (ids: string[]) => {
  const key = ids.join(',');
  const [ready, setReady] = useState(ids.every((i) => FLAG_CACHE[i]));
  useEffect(() => {
    const missing = ids.filter((i) => !FLAG_CACHE[i]);
    if (!missing.length) return;
    const h = delayRender('flags');
    Promise.all(
      missing.map((id) =>
        fetch(flagFile(id))
          .then((r) => (r.ok ? r.text() : ''))
          .then((txt) => { FLAG_CACHE[id] = txt ? 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(txt))) : ''; })
          .catch(() => { FLAG_CACHE[id] = ''; }),
      ),
    ).then(() => { setReady(true); continueRender(h); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return ready ? FLAG_CACHE : null;
};

// ---------- estado de relleno de cada país en el instante t ----------
type St = { from: string; to: string; t: number; dur: number; flag0: number; flag1: number; ft: number; fdur: number };
export const fillState = (t: number, fills: Fill[]) => {
  const st: Record<string, St> = {};
  const colorAt = (s: St, tt: number) => mix(s.from, s.to, (tt - s.t) / s.dur);
  const flagAt = (s: St, tt: number) => s.flag0 + (s.flag1 - s.flag0) * Math.max(0, Math.min(1, (tt - s.ft) / s.fdur));
  for (const f of fills) {
    if (f.t > t) break;
    for (const id of f.ids) {
      const s = st[id] ?? { from: C.land, to: C.land, t: 0, dur: 0.01, flag0: 0, flag1: 0, ft: 0, fdur: 0.01 };
      if (f.flag) { const cur = flagAt(s, f.t); Object.assign(s, { flag0: cur, flag1: 1, ft: f.t, fdur: f.dur }); }
      else {
        const cur = colorAt(s, f.t); const curF = flagAt(s, f.t);
        Object.assign(s, { from: cur, to: f.color!, t: f.t, dur: f.dur, flag0: curF, flag1: 0, ft: f.t, fdur: f.dur });
      }
      st[id] = s;
    }
  }
  const out: Record<string, { color: string; flag: number }> = {};
  for (const id in st) out[id] = { color: colorAt(st[id], t), flag: flagAt(st[id], t) };
  return out;
};

// Oleaje en espacio pantalla (textura del canal) con paralaje suave
export const Waves: React.FC<{ v: View; t: number; opacity?: number }> = ({ v, t, opacity = 0.32 }) => {
  const sc = Math.max(0.6, Math.min(1.6, 1500 / v.w));
  const ox = -(v.x / v.w) * 600 + t * 6, oy = -(v.y / v.w) * 600;
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('tex/waves.png')})`, backgroundSize: `${448 * sc}px ${112 * sc}px`, backgroundPosition: `${ox}px ${oy}px`, opacity, mixBlendMode: 'screen', pointerEvents: 'none' }} />
  );
};

export const MapLayer: React.FC<{ v: View; fills: Fill[]; t: number; flags: Record<string, string>; relief?: boolean }> = ({ v, fills, t, flags, relief = true }) => {
  const st = fillState(t, fills);
  const k = v.w / LAY.w; // unidades mundo por píxel
  const vb = `${v.x - v.w / 2} ${v.y - v.h / 2} ${v.w} ${v.h}`;
  const flagged = COUNTRIES.filter((c) => st[c.id]?.flag > 0.001 && flags[c.id]);
  const colored = COUNTRIES.filter((c) => st[c.id] && st[c.id].color !== C.land);
  return (
    <svg width={LAY.w} height={LAY.h} viewBox={vb} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        {flagged.map((c) => {
          const [[x0, y0], [x1, y1]] = c.bb;
          const bw = x1 - x0, bh = y1 - y0;
          // países muy alargados (Rusia, Chile, Noruega…): la bandera se estira al recuadro
          const long = bw / bh > 1.8 || bh / bw > 1.8;
          const fw = long ? bw : Math.max(bw, bh * (4 / 3)), fh = long ? bh : fw * 0.75;
          const fx = x0 + bw / 2 - fw / 2, fy = y0 + bh / 2 - fh / 2;
          return (
            <pattern key={c.id} id={`fl-${c.id}`} patternUnits="userSpaceOnUse" x={fx} y={fy} width={fw} height={fh}>
              <image href={flags[c.id]} x={0} y={0} width={fw} height={fh} preserveAspectRatio="none" />
            </pattern>
          );
        })}
      </defs>
      {/* océano: color base + batimetría */}
      <rect x={-4000} y={-3000} width={W + 8000} height={H + 6000} fill={C.oceanDeep} />
      <image href={staticFile('tex/ocean.jpg')} x={TEX.x} y={TEX.y} width={TEX.w} height={TEX.h} preserveAspectRatio="none" />
      {/* sombra suave de la tierra */}
      <g transform={`translate(${3 * k},${6 * k})`} fill={C.shadow}>
        {COUNTRIES.map((c) => <path key={c.id} d={c.d} />)}
      </g>
      <g strokeLinejoin="round">
        {COUNTRIES.map((c) => (
          <path key={c.id} d={c.d} fill={st[c.id]?.color ?? C.land} stroke={C.border} strokeWidth={1.1 * k} />
        ))}
      </g>
      <g strokeLinejoin="round">
        {flagged.map((c) => (
          <path key={c.id} d={c.d} fill={`url(#fl-${c.id})`} opacity={st[c.id].flag} />
        ))}
      </g>
      {/* relieve multiplicado sobre tierra, colores y banderas */}
      {relief && <image href={staticFile('tex/relief.jpg')} x={TEX.x} y={TEX.y} width={TEX.w} height={TEX.h} preserveAspectRatio="none" style={{ mixBlendMode: 'multiply' }} opacity={0.9} />}
      {/* contorno de tinta en países destacados */}
      <g fill="none" stroke={C.ink} strokeLinejoin="round">
        {[...new Set([...colored, ...flagged])].map((c) => (
          <path key={c.id} d={c.d} strokeWidth={(st[c.id].flag > 0.5 ? 3.6 : 2) * k} strokeOpacity={0.85} />
        ))}
      </g>
    </svg>
  );
};
