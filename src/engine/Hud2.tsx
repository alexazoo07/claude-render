// Estilo v2: protagonista fijo + cuerdas + etiquetas + bocadillos + cintas + marcadores LED + lista lateral
import React from 'react';
import { Img } from 'remotion';
import type { Bubble, Fx, Group, Hero, Info, Led, Legend, List, Mood, Region, Results, Ribbon, Rope, Subscribe, Tag, Title2, Versus } from './builder';
import { FaceSvg } from './Face';
import { pop } from './Hud';
import { flagUrl, toScreen, type View } from './MapLayer';
import { BODY, C, DISPLAY, fmt, stroke } from './theme';
import { BY_ID } from './world';
import { OBJ, type ObjName } from './objects';
import { LAY, SAFE } from './layout';
const P = () => LAY.portrait; // Short vertical (1080x1920)

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const INK = C.ink;
const panel = (bg: string): React.CSSProperties => ({ background: bg, border: `4px solid ${INK}`, borderRadius: 16, boxShadow: `0 6px 0 ${INK}` });

export const FlagBox: React.FC<{ id: string; w: number; r?: number }> = ({ id, w, r = 5 }) => (
  <div style={{ width: w, height: w * 0.68, borderRadius: r, overflow: 'hidden', border: `${Math.max(2, w / 18)}px solid ${INK}`, flexShrink: 0, background: '#ddd' }}>
    <Img src={flagUrl(id)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

// posición en pantalla del país (o punto lon/lat ya proyectado)
export const screenOf = (v: View, id: string, at?: [number, number]): [number, number] => {
  const c = BY_ID[id];
  const p = at ?? (c ? c.c : [0, 0]);
  return toScreen(v, p[0], p[1]);
};
const topOf = (v: View, id: string, at?: [number, number]): [number, number] => {
  const c = BY_ID[id];
  const [x, cy] = screenOf(v, id, at);
  if (!c) return [x, cy];
  // por encima de la cara (que mide ~0.6 del alto del país, máx. 330 px)
  const bh = ((c.bb[1][1] - c.bb[0][1]) / v.w) * LAY.w, bw = ((c.bb[1][0] - c.bb[0][0]) / v.w) * LAY.w;
  const face = Math.max(200,Math.max(30, Math.min(340, Math.min(bw, bh * 1.3) * 0.7)) * 0.9);
  const [, yTop] = toScreen(v, c.c[0], c.bb[0][1]);
  return [x, at ? cy - face * 0.55 : Math.min(yTop, cy - face * 0.55)];
};

// ---------- Protagonista (fijo en pantalla) ----------
// Protagonista OBJETO (chicle, trofeo…): mismo comportamiento que el país
const ObjHeroSprite: React.FC<{ h: Hero; t: number; gaze?: [number, number] | null }> = ({ h, t, gaze }) => {
  const a = pop(t, h.t0, h.t1, 0.5, 0.3);
  const past = h.moods.filter((m) => m.t <= t);
  const mood = past[past.length - 1]?.mood ?? 'wow';
  const last = past[past.length - 1]?.t ?? h.t0;
  const sq = Math.exp(-(t - last) * 9) * Math.sin((t - last) * 30) * 0.08;
  const breathe = Math.sin(t * 2.6) * 0.025;
  let g: [number, number] = [0, 0];
  if (gaze) { const dx = gaze[0] - h.x, dy = gaze[1] - h.y; const d = Math.hypot(dx, dy) || 1; g = [dx / d, (dy / d) * 0.8]; }
  return (
    <div style={{ position: 'absolute', left: h.x - h.size / 2, top: h.y - h.size / 2, width: h.size, height: h.size, transform: `scale(${a * (1 + sq)}, ${a * (1 - sq + breathe)}) rotate(${Math.sin(t * 1.7) * 3}deg)`, transformOrigin: '50% 85%' }}>
      <svg width={h.size} height={h.size} viewBox="-110 -110 220 220" style={{ overflow: 'visible', filter: 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 10px 0 rgba(20,40,80,.35))' }}>{OBJ[h.obj as ObjName]}</svg>
      <div style={{ position: 'absolute', left: h.size * 0.2, top: h.size * 0.12, width: h.size * 0.6, height: h.size * 0.6 }}>
        <FaceSvg mood={mood as Mood} t={t} size={h.size * 0.6} gaze={gaze ? g : undefined} />
      </div>
      {h.label && (
        <div style={{ position: 'absolute', left: '50%', bottom: -14, transform: 'translateX(-50%)', background: INK, color: '#fff', borderRadius: 10, padding: '3px 14px', fontFamily: DISPLAY, fontSize: 24, whiteSpace: 'nowrap', border: '3px solid #fff' }}>{h.label}</div>
      )}
    </div>
  );
};

export const HeroSprite: React.FC<{ h: Hero; t: number; flag?: string; gaze?: [number, number] | null }> = ({ h, t, flag, gaze }) => {
  if (h.obj) return <ObjHeroSprite h={h} t={t} gaze={gaze} />;
  const c = BY_ID[h.id];
  if (!c) return null;
  const a = pop(t, h.t0, h.t1, 0.5, 0.3);
  const mood = [...h.moods].filter((m) => m.t <= t).pop()?.mood ?? 'wow';
  const lastChange = [...h.moods].filter((m) => m.t <= t).pop()?.t ?? h.t0;
  const sq = Math.exp(-(t - lastChange) * 9) * Math.sin((t - lastChange) * 30) * 0.08; // rebote al cambiar de humor
  const breathe = Math.sin(t * 2.6) * 0.018;
  const [[x0, y0], [x1, y1]] = c.bb;
  const bw = x1 - x0, bh = y1 - y0, m = Math.max(bw, bh), pad = m * 0.1;
  const k = m / h.size;
  const fw = Math.max(bw, bh * (4 / 3)), fh = fw * 0.75;
  let g: [number, number] = [0, 0];
  if (gaze) { const dx = gaze[0] - h.x, dy = gaze[1] - h.y; const d = Math.hypot(dx, dy) || 1; g = [dx / d, dy / d * 0.8]; }
  return (
    <div style={{ position: 'absolute', left: h.x - h.size / 2, top: h.y - h.size / 2, width: h.size, height: h.size, transform: `scale(${a * (1 + sq)}, ${a * (1 - sq + breathe)})`, transformOrigin: '50% 80%' }}>
      <svg width={h.size} height={h.size} viewBox={`${(x0 + x1) / 2 - m / 2 - pad} ${(y0 + y1) / 2 - m / 2 - pad} ${m + 2 * pad} ${m + 2 * pad}`} style={{ overflow: 'visible', filter: 'drop-shadow(0 10px 0 rgba(20,40,80,.35))' }}>
        <defs>
          <pattern id={`hero-${h.id}`} patternUnits="userSpaceOnUse" x={x0 + bw / 2 - fw / 2} y={y0 + bh / 2 - fh / 2} width={fw} height={fh}>
            {flag && <image href={flag} width={fw} height={fh} preserveAspectRatio="none" />}
          </pattern>
        </defs>
        <path d={c.dm} fill="#fff" stroke="#fff" strokeWidth={22 * k} strokeLinejoin="round" />
        <path d={c.dm} fill={`url(#hero-${h.id})`} stroke={INK} strokeWidth={6 * k} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: h.size * 0.18, top: h.size * 0.08, width: h.size * 0.64, height: h.size * 0.64 }}>
        <FaceSvg mood={mood as Mood} t={t} size={h.size * 0.64} gaze={gaze ? g : undefined} />
      </div>
      {h.label && (
        <div style={{ position: 'absolute', left: '50%', bottom: -6, transform: 'translateX(-50%)', background: INK, color: '#fff', borderRadius: 10, padding: '3px 14px', fontFamily: DISPLAY, fontSize: 24, whiteSpace: 'nowrap', border: '3px solid #fff' }}>{h.label}</div>
      )}
    </div>
  );
};

// ---------- Cuerda animada protagonista -> país ----------
export const RopeLine: React.FC<{ r: Rope; t: number; from: [number, number]; to: [number, number] }> = ({ r, t, from, to }) => {
  const pin = easeOut((t - r.t0) / 0.5);
  const pout = clamp((r.t1 - t) / 0.3);
  const p = Math.min(pin, pout);
  if (p <= 0) return null;
  const [ax, ay] = from;
  const d0 = Math.hypot(to[0] - ax, to[1] - ay) || 1;
  const cut = Math.min(95, d0 * 0.3); // termina en el borde de la cara, no encima
  const bx = to[0] - ((to[0] - ax) / d0) * cut, by = to[1] - ((to[1] - ay) / d0) * cut;
  const dist = Math.hypot(bx - ax, by - ay);
  const cx = (ax + bx) / 2, cy = Math.min(ay, by) - dist * 0.28;
  const N = 48, pts: string[] = [];
  const end = pout < 1 ? 1 : p; // al salir se recoge desde el origen
  const start = pout < 1 ? 1 - pout : 0;
  for (let i = 0; i <= N; i++) {
    const u = start + (end - start) * (i / N);
    const x = (1 - u) ** 2 * ax + 2 * (1 - u) * u * cx + u * u * bx;
    const y = (1 - u) ** 2 * ay + 2 * (1 - u) * u * cy + u * u * by;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const d = 'M' + pts.join(' L');
  const tip = pts[pts.length - 1].split(',').map(Number);
  return (
    <svg width={LAY.w} height={LAY.h} style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" opacity={0.85} />
      <path d={d} fill="none" stroke={r.color} strokeWidth={5} strokeLinecap="round" strokeDasharray="16 11" strokeDashoffset={-t * 70} />
      <circle cx={tip[0]} cy={tip[1]} r={9 + 3 * Math.sin(t * 10)} fill={r.color} stroke={INK} strokeWidth={4} />
    </svg>
  );
};

// ---------- Etiqueta de nombre sobre el país ----------
export const TagPill: React.FC<{ x: Tag; t: number; v: View }> = ({ x, t, v }) => {
  const a = pop(t, x.t0, x.t1, 0.3, 0.2);
  const [px, py] = topOf(v, x.id, x.at);
  return (
    <div style={{ position: 'absolute', left: px, top: Math.max(P() ? SAFE.top + 60 : 150, py - 14), transform: `translate(-50%,-100%) scale(${a})`, background: x.color ?? INK, color: '#fff', borderRadius: 10, padding: '3px 14px', fontFamily: DISPLAY, fontSize: P() ? 36 : 26, whiteSpace: 'nowrap', border: '3px solid #fff', boxShadow: '0 4px 0 rgba(0,0,0,.25)' }}>{x.text}</div>
  );
};

// ---------- Bocadillo con texto que se escribe ----------
export const BubbleBox: React.FC<{ x: Bubble; t: number; v: View; hero?: Hero }> = ({ x, t, v, hero }) => {
  const a = pop(t, x.t0, x.t1, 0.3, 0.2);
  const [px, py0] = x.id === 'hero' && hero ? [hero.x + hero.size * 0.22, hero.y - hero.size * 0.42] : topOf(v, x.id, x.at);
  const py = x.id === 'hero' ? py0 : Math.max(P() ? SAFE.top + 120 : 250, py0 - 52); // deja sitio a la etiqueta y no tapa la barra superior
  const n = Math.floor(clamp((t - x.t0 - 0.1) / Math.max(0.4, x.text.length * 0.035)) * x.text.length);
  const right = (x.side ?? 'right') === 'right';
  return (
    <div style={{ position: 'absolute', left: px + (right ? 30 : -30), top: py - 20, transform: `translate(${right ? '0' : '-100%'},-100%) scale(${a})`, transformOrigin: right ? '0% 100%' : '100% 100%' }}>
      <div style={{ ...panel('#fff'), borderRadius: 18, padding: '10px 20px', fontFamily: BODY, fontWeight: 900, fontSize: P() ? 40 : 30, color: INK, whiteSpace: P() ? 'normal' : 'nowrap', maxWidth: P() ? 560 : undefined, position: 'relative' }}>
        <span>{x.text.slice(0, n)}</span><span style={{ opacity: 0 }}>{x.text.slice(n)}</span>
        <svg width={34} height={26} style={{ position: 'absolute', bottom: -26, [right ? 'left' : 'right']: 14 } as React.CSSProperties} viewBox="0 0 34 26"><path d={right ? 'M2,0 L4,24 L26,0' : 'M32,0 L30,24 L8,0'} fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><rect x={0} y={-3} width={34} height={5} fill="#fff" /></svg>
      </div>
    </div>
  );
};

// ---------- Cinta llamativa ("¡LE TEME A MÉXICO!") ----------
export const RibbonBox: React.FC<{ x: Ribbon; t: number }> = ({ x, t }) => {
  if (t < x.t0 || t > x.t1) return null;
  const p = clamp((t - x.t0) / 0.16);
  const s = p < 1 ? 1.9 - 0.9 * p : 1 + 0.02 * Math.sin((t - x.t0) * 8);
  const out = clamp((x.t1 - t) / 0.2);
  return (
    <div style={{ position: 'absolute', left: P() ? LAY.w / 2 - 40 : 640, top: P() ? 1140 : 690, transform: `translate(-50%,-50%) scale(${s * (0.6 + 0.4 * out) * (P() ? 1.3 : 1)}) rotate(-4deg)`, opacity: Math.min(p * 3, out) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: x.color, border: `5px solid ${INK}`, borderRadius: 14, padding: '8px 30px 8px 12px', boxShadow: `0 8px 0 ${INK}`, whiteSpace: 'nowrap' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', border: `4px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 34, color: x.color }}>{x.icon ?? '★'}</div>
        <span style={{ fontFamily: DISPLAY, fontSize: 58, color: '#fff', textShadow: stroke(4) }}>{x.text}</span>
        {x.sub && <span style={{ fontFamily: BODY, fontWeight: 900, fontSize: 22, color: '#fff', textShadow: stroke(2), alignSelf: 'flex-end', marginBottom: 6 }}>{x.sub}</span>}
      </div>
    </div>
  );
};

// ---------- Tarjeta de información (abajo centro) ----------
export const InfoBox: React.FC<{ x: Info; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.4) * clamp((x.t1 - t) / 0.25);
  // chipAt: hasta ese momento la píldora muestra «???» en gris y luego revela la categoría con un pop
  const hidden = x.chipAt !== undefined && t < x.chipAt;
  const chipA = hidden ? pop(t, x.t0 + 0.35, x.t1) : pop(t, x.chipAt ?? x.t0 + 0.35, x.t1);
  x = hidden ? { ...x, chip: '???', chipColor: '#9A96A6', title: x.hideTitle ? '???' : x.title } : x; // hideTitle: la cifra no se ve hasta el veredicto
  return (
    <div style={{ position: 'absolute', left: P() ? 490 : 960, bottom: P() ? SAFE.bottom : 26, width: 780, transform: `translate(-50%, ${(1 - a) * 240}px) scale(${P() ? 1.25 : 1})`, transformOrigin: '50% 100%', ...panel(C.cream), padding: '16px 22px 14px' }}>
      {x.tag && <div style={{ position: 'absolute', top: -20, left: 18, background: INK, color: C.gold, fontFamily: DISPLAY, fontSize: 20, padding: '2px 14px', borderRadius: 8, letterSpacing: 1 }}>{x.tag}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <FlagBox id={x.flag} w={72} />
        <span style={{ fontFamily: DISPLAY, fontSize: x.name.length > 20 ? 34 : x.name.length > 15 ? 40 : 48, color: INK, lineHeight: 1, whiteSpace: 'nowrap' }}>{x.name.toUpperCase()}</span>
        {x.chip && <span style={{ marginLeft: 'auto', transform: `scale(${chipA})`, background: x.chipColor ?? C.yes, color: '#fff', border: `3px solid ${INK}`, borderRadius: 30, padding: '4px 16px', fontFamily: DISPLAY, fontSize: 26, textShadow: stroke(2) }}>{x.chip}</span>}
      </div>
      {(x.label || x.title) && (
        <div style={{ marginTop: 10, display: 'flex', gap: 12, alignItems: 'baseline' }}>
          {x.label && <span style={{ fontFamily: DISPLAY, fontSize: 24, color: x.labelColor ?? C.red }}>{x.label}</span>}
          {x.title && <span style={{ fontFamily: BODY, fontWeight: 900, fontSize: 28, color: INK }}>{x.title}</span>}
        </div>
      )}
      {x.text && !x.texts && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 22, color: '#5E5868', marginTop: 4 }}>{x.text}</div>}
      {x.texts && (() => {
        // datos que van rotando (como en la referencia): cada uno entra deslizando desde abajo
        const seg = (x.t1 - x.t0 - 0.5) / x.texts.length;
        const i = Math.max(0, Math.min(x.texts.length - 1, Math.floor((t - x.t0 - 0.5) / seg)));
        const k = i === 0 ? 1 : easeOut((t - x.t0 - 0.5 - i * seg) / 0.3);
        return (
          <div style={{ marginTop: 6, height: 30, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: x.chipColor ?? C.yes, color: '#fff', fontFamily: DISPLAY, fontSize: 16, padding: '1px 10px', borderRadius: 8, border: `2px solid ${INK}` }}>DATO {i + 1}/{x.texts.length}</span>
            <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 23, color: '#4A4456', transform: `translateY(${(1 - k) * 30}px)`, opacity: k, whiteSpace: 'nowrap' }}>{x.texts[i]}</span>
          </div>
        );
      })()}
    </div>
  );
};

// ---------- Leyenda de categorías ("Cómo lo medimos") ----------
export const LegendBox: React.FC<{ x: Legend; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.4) * clamp((x.t1 - t) / 0.25);
  return (
    <div style={{ position: 'absolute', left: 1010, top: 520, width: 900, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * a})`, opacity: a, ...panel(C.cream), padding: '18px 28px 20px' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 46, color: INK, textAlign: 'center', marginBottom: 10 }}>{x.title}</div>
      {x.rows.map((r, i) => {
        const k = pop(t, x.t0 + 0.35 + i * 0.3, x.t1);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, transform: `translateX(${(1 - Math.min(1, k)) * -60}px)`, opacity: Math.min(1, k * 2) }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: r.color, border: `4px solid ${INK}`, flex: 'none' }} />
            <span style={{ fontFamily: DISPLAY, fontSize: 36, color: r.color, textShadow: stroke(2.5), whiteSpace: 'nowrap', minWidth: 250 }}>{r.label}</span>
            <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 25, color: INK }}>{r.desc}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Aviso de suscripción ----------
export const SubscribeBox: React.FC<{ x: Subscribe; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.35) * clamp((x.t1 - t) / 0.25);
  const press = x.t0 + (x.big ? 1.6 : 1.2);
  const done = t >= press;
  const bs = 1 - 0.12 * Math.exp(-Math.abs(t - press) * 14);
  const bell = done ? Math.sin((t - press) * 30) * 18 * Math.exp(-(t - press) * 3) : 0;
  const btn = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
      <span style={{ transform: `scale(${bs})`, background: done ? '#606060' : '#E8302A', color: '#fff', fontFamily: DISPLAY, fontSize: x.big ? 40 : 26, padding: x.big ? '8px 30px' : '4px 18px', borderRadius: 12, border: `3px solid ${INK}` }}>{done ? 'SUSCRITO' : 'SUSCRÍBETE'}</span>
      <span style={{ fontSize: x.big ? 46 : 30, display: 'inline-block', transform: `rotate(${bell}deg)` }}>🔔</span>
    </div>
  );
  if (x.big) return (
    <div style={{ position: 'absolute', left: P() ? LAY.w / 2 : 1030, top: P() ? 900 : 470, maxWidth: P() ? 960 : undefined, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * a})`, opacity: a, ...panel('#fff'), padding: '26px 46px', textAlign: 'center' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 56, color: INK }}>¿TE ESTÁ GUSTANDO EL VÍDEO?</div>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 24, color: '#5E5868', margin: '6px 0 16px' }}>Si quieres más mapas como este, suscríbete y activa la campanita</div>
      {btn}
    </div>
  );
  return (
    <div style={{ position: 'absolute', right: 24, top: 96, transform: `translateX(${(1 - a) * 480}px)`, ...panel(INK), padding: '10px 16px', width: 380 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 24, color: '#fff' }}>¿Te está gustando el vídeo?</div>
      <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 15, color: 'rgba(255,255,255,.8)', margin: '2px 0 8px' }}>Suscríbete para más mapas como este</div>
      {btn}
    </div>
  );
};

// ---------- Tablero final de resultados ----------
export const ResultsBox: React.FC<{ x: Results; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.45) * clamp((x.t1 - t) / 0.3);
  return (
    <div style={{ position: 'absolute', left: P() ? LAY.w / 2 - 30 : 1040, top: P() ? 880 : 560, width: P() ? 940 : 1160, transform: `translate(-50%,-50%) translateY(${(1 - a) * 120}px)`, opacity: a, ...panel(C.cream), padding: '18px 26px 20px' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 44, color: INK, textAlign: 'center' }}>{x.title}</div>
      {x.sub && <div style={{ fontFamily: BODY, fontWeight: 900, fontSize: 22, color: C.red, textAlign: 'center', marginBottom: 6 }}>{x.sub}</div>}
      {x.cats.map((c, i) => {
        const t0 = x.t0 + 0.4 + i * 0.5;
        return (
          <div key={i} style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: clamp((t - t0) / 0.2) }}>
              <span style={{ background: c.color, color: '#fff', fontFamily: DISPLAY, fontSize: 22, padding: '1px 14px', borderRadius: 10, border: `3px solid ${INK}`, textShadow: stroke(1.5) }}>{c.label}</span>
              <span style={{ fontFamily: DISPLAY, fontSize: 24, color: INK }}>{c.count ?? c.ids.length}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {c.ids.map((id, j) => <div key={id} style={{ transform: `scale(${pop(t, t0 + 0.1 + j * 0.02, x.t1)})` }}><FlagBox id={id} w={44} r={4} /></div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Grupo de países (abajo centro) ----------
export const GroupBox: React.FC<{ x: Group; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.4) * clamp((x.t1 - t) / 0.25);
  return (
    <div style={{ position: 'absolute', left: P() ? 490 : 960, bottom: P() ? SAFE.bottom : 26, transform: `translate(-50%, ${(1 - a) * 240}px) scale(${P() ? 1.25 : 1})`, transformOrigin: '50% 100%', ...panel(C.cream), padding: '12px 30px 14px', textAlign: 'center', minWidth: 520 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 40, color: INK }}>{x.title}</div>
      {x.sub && <div style={{ fontFamily: BODY, fontWeight: 900, fontSize: 19, color: '#5E5868', marginTop: -2 }}>{x.sub}</div>}
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 8 }}>
        {x.items.map((it, i) => (
          <div key={it.flag} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(t, x.t0 + 0.15 + i * 0.12, x.t1)})` }}>
            <FlagBox id={it.flag} w={64} />
            <span style={{ fontFamily: BODY, fontWeight: 900, fontSize: 17, color: INK, marginTop: 4 }}>{it.name}</span>
            {it.color && <span style={{ width: 40, height: 7, borderRadius: 4, background: it.color, marginTop: 3, border: `2px solid ${INK}` }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Barra versus (arriba centro) ----------
export const VersusBar: React.FC<{ x: Versus; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.5);
  const st = x.steps.filter((s) => s.t <= t);
  const cur = st[st.length - 1] ?? x.steps[0];
  const prev = st[st.length - 2] ?? cur;
  const k = easeOut((t - cur.t) / 0.5);
  const l = prev.l + (cur.l - prev.l) * k, r = prev.r + (cur.r - prev.r) * k;
  const fr = l + r > 0 ? l / (l + r) : 0.5;
  const bump = (n: number) => 1 + 0.25 * Math.exp(-(t - cur.t) * 8) * (n ? 1 : 0);
  const BW = P() ? 280 : 470;
  return (
    <div style={{ position: 'absolute', left: P() ? LAY.w / 2 : 960, top: P() ? SAFE.top - 20 : 22, transform: `translate(-50%, ${(a - 1) * 120}px)`, display: 'flex', alignItems: 'center', gap: 12, ...panel('#fff'), borderRadius: 40, padding: '6px 18px' }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 26, color: x.lc, textShadow: stroke(2), whiteSpace: 'nowrap' }}>{x.left}</span>
      <span style={{ fontFamily: DISPLAY, fontSize: 34, color: INK, display: 'inline-block', minWidth: 54, textAlign: 'center', transform: `scale(${bump(cur.l - prev.l)})` }}>{fmt(Math.round(l))}</span>
      <div style={{ position: 'relative', width: BW, height: 24, borderRadius: 12, background: x.rc, border: `3px solid ${INK}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fr * 100}%`, background: x.lc, borderRight: `3px solid ${INK}` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 2px, transparent 2px 12px)' }} />
      </div>
      <span style={{ fontFamily: DISPLAY, fontSize: 34, color: INK, minWidth: 54, textAlign: 'center' }}>{fmt(Math.round(r))}</span>
      <span style={{ fontFamily: DISPLAY, fontSize: 26, color: x.rc, textShadow: stroke(2), whiteSpace: 'nowrap' }}>{x.right}</span>
    </div>
  );
};

// ---------- Marcador LED de 7 segmentos (abajo izquierda) ----------
const SEG: Record<string, string> = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '' };
const SEGP: Record<string, string> = { a: 'M6,2 L34,2 L29,7 L11,7 Z', b: 'M35,3 L35,33 L30,29 L30,8 Z', c: 'M35,37 L35,67 L30,62 L30,41 Z', d: 'M6,68 L34,68 L29,63 L11,63 Z', e: 'M5,37 L5,67 L10,62 L10,41 Z', f: 'M5,3 L5,33 L10,29 L10,8 Z', g: 'M7,35 L12,31 L28,31 L33,35 L28,39 L12,39 Z' };
export const SevenSeg: React.FC<{ text: string; color: string; h: number }> = ({ text, color, h }) => (
  <div style={{ display: 'flex', gap: h * 0.06 }}>
    {text.split('').map((ch, i) => (
      <svg key={i} width={h * 0.58} height={h} viewBox="0 0 40 70">
        {Object.entries(SEGP).map(([s, d]) => {
          const on = (SEG[ch] ?? '').includes(s);
          return <path key={s} d={d} fill={on ? color : 'rgba(255,255,255,.07)'} style={on ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined} />;
        })}
      </svg>
    ))}
  </div>
);
export const LedBoard: React.FC<{ x: Led; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.5);
  return (
    <div style={{ position: 'absolute', left: 24, bottom: 26, transform: `translateX(${(a - 1) * 420}px)`, display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 8, ...panel('#22223A'), padding: 10, borderRadius: 14 }}>
      {x.cells.map((c, i) => {
        const st = c.steps.filter((s) => s.t <= t);
        const cur = st[st.length - 1]?.v ?? 0;
        const prev = st[st.length - 2]?.v ?? 0;
        const tt = st[st.length - 1]?.t ?? 0;
        const val = Math.round(prev + (cur - prev) * easeOut((t - tt) / 0.6));
        const dg = c.digits ?? 2;
        const txt = String(val).padStart(dg, ' ').slice(-dg);
        const glow = Math.exp(-(t - tt) * 5);
        return (
          <div key={i} style={{ background: '#0E0E1C', borderRadius: 10, padding: '8px 10px 6px', border: `2px solid ${c.color}`, boxShadow: `0 0 ${12 * glow}px ${c.color}` }}>
            <SevenSeg text={txt} color={c.color} h={48} />
            <div style={{ fontFamily: BODY, fontWeight: 900, fontSize: 13, color: c.color, marginTop: 4, letterSpacing: 0.5 }}>{c.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Lista lateral (abajo derecha) ----------
export const SideList: React.FC<{ x: List; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.5) * clamp((x.t1 - t) / 0.3);
  const rows = x.rows.filter((r) => r.t <= t);
  const max = x.max ?? 6;
  const RH = 46;
  const last = rows[rows.length - 1];
  const scroll = last && rows.length > max ? (1 - easeOut((t - last.t) / 0.35)) * RH : 0;
  const vis = rows.slice(-max - 1);
  return (
    <div style={{ position: 'absolute', right: 24, bottom: 26, width: 360, height: RH * max, overflow: 'hidden', transform: `translateX(${(1 - a) * 420}px)` }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -scroll + 0 }}>
        {vis.map((r) => {
          const k = easeOut((t - r.t) / 0.35);
          return (
            <div key={r.flag + r.t} style={{ height: RH - 6, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, background: INK, borderRadius: 10, padding: '0 10px', border: '2px solid rgba(255,255,255,.25)', transform: `translateX(${(1 - k) * 380}px)` }}>
              <FlagBox id={r.flag} w={40} r={4} />
              <span style={{ fontFamily: DISPLAY, fontSize: 21, color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name.toUpperCase()}</span>
              <span style={{ background: r.color, color: '#fff', borderRadius: 20, padding: '1px 12px', fontFamily: DISPLAY, fontSize: 20, border: `2px solid ${INK}`, textShadow: stroke(1.5) }}>{r.pill}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Región (arriba izquierda) ----------
export const RegionPill: React.FC<{ x: Region; t: number }> = ({ x, t }) => {
  const a = easeOut((t - x.t0) / 0.4) * clamp((x.t1 - t) / 0.2);
  return (
    <div style={{ position: 'absolute', left: 24, top: 24, transform: `translateX(${(a - 1) * 300}px)`, display: 'flex', alignItems: 'center', gap: 8, ...panel(INK), borderRadius: 30, padding: '6px 18px 6px 12px' }}>
      <svg width={24} height={30} viewBox="0 0 24 30"><path d="M12,29 C4,18 1,14 1,10 A11,11 0 0 1 23,10 C23,14 20,18 12,29 Z" fill={C.gold} /><circle cx={12} cy={10} r={4.5} fill={INK} /></svg>
      <span style={{ fontFamily: DISPLAY, fontSize: 26, color: '#fff' }}>{x.text.toUpperCase()}</span>
    </div>
  );
};

// ---------- Portada v2 (palabras resaltadas con *asteriscos*) ----------
export const Title2Box: React.FC<{ x: Title2; t: number }> = ({ x, t }) => (
  <div style={{ position: 'absolute', left: P() ? 30 : 560, right: P() ? 30 : 60, top: P() ? 700 : 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    {x.lines.map((ln, i) => {
      const a = pop(t, x.t0 + 0.12 + i * 0.22, x.t1, 0.4, 0.25);
      const parts = ln.split('*');
      return (
        <div key={i} style={{ fontFamily: DISPLAY, fontSize: i === 1 ? 128 : 92, lineHeight: 1.05, transform: `scale(${a}) rotate(${i % 2 ? 1.5 : -1.5}deg)`, whiteSpace: 'nowrap' }}>
          {parts.map((p, j) => <span key={j} style={{ color: j % 2 ? x.colors[i] ?? C.gold : '#fff', textShadow: stroke(i === 1 ? 11 : 8) }}>{p}</span>)}
        </div>
      );
    })}
    {x.chips && (
      <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
        {x.chips.map((c, i) => (
          <span key={i} style={{ transform: `scale(${pop(t, x.t0 + 0.9 + i * 0.12, x.t1)})`, background: c.color, color: '#fff', border: `4px solid ${INK}`, borderRadius: 30, padding: '6px 20px', fontFamily: DISPLAY, fontSize: 30, boxShadow: `0 5px 0 ${INK}`, textShadow: stroke(2) }}>{c.text}</span>
        ))}
      </div>
    )}
  </div>
);

// ---------- Efectos: anillos, confeti ----------
export const FxLayer: React.FC<{ fx: Fx[]; t: number; v: View }> = ({ fx, t, v }) => (
  <>
    {fx.map((f, i) => {
      const d = t - f.t;
      if (f.kind === 'pulse' && d >= 0 && d < 0.9) {
        const [px, py] = f.id ? screenOf(v, f.id, f.at) : [960, 540];
        return (
          <svg key={i} width={LAY.w} height={LAY.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[0, 0.15, 0.3].map((o) => { const k = clamp((d - o) / 0.6); return k > 0 && k < 1 ? <circle key={o} cx={px} cy={py} r={30 + k * 220} fill="none" stroke={f.color ?? '#fff'} strokeWidth={10 * (1 - k)} opacity={1 - k} /> : null; })}
          </svg>
        );
      }
      if (f.kind === 'confetti' && d >= 0 && d < 2.6) {
        const cols = [C.gold, C.red, C.teal, C.yes, C.purple, '#fff', C.orange];
        return (
          <svg key={i} width={LAY.w} height={LAY.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 90 }, (_, j) => {
              const r1 = Math.sin(j * 12.9898 + i) * 43758.5453, r = r1 - Math.floor(r1);
              const r2 = Math.sin(j * 78.233 + i) * 12543.21, q = r2 - Math.floor(r2);
              const x = LAY.w / 2 + (r - 0.5) * 300 + (r - 0.5) * 1700 * d;
              const y = LAY.h / 2 - (400 + q * 500) * d + 900 * d * d;
              const rot = (r * 720 + d * 600 * (q - 0.5)) % 360;
              return <rect key={j} x={x} y={y} width={12} height={20} rx={2} fill={cols[j % cols.length]} transform={`rotate(${rot} ${x} ${y}) scale(1 ${Math.cos(d * 12 + j)})`} opacity={clamp((2.6 - d) / 0.5)} />;
            })}
          </svg>
        );
      }
      return null;
    })}
  </>
);
export const punchAt = (fx: Fx[], t: number) => {
  let s = 1;
  for (const f of fx) if (f.kind === 'punch') { const d = t - f.t; if (d >= 0 && d < 0.5) s += (f.amp ?? 0.04) * Math.sin(Math.PI * clamp(d / 0.5)) * (1 - d / 0.5); }
  return s;
};
