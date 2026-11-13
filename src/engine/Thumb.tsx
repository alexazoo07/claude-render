// Miniaturas 1280x720 al estilo del nicho:
// textos ENORMES a 2 colores (blanco + acento) con contorno grueso, fondo sencillo (mar o mapa del vídeo),
// y UN foco central (país con cara exagerada u objeto) muy resaltado: borde blanco, brillo, rayos.
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import type { Mood } from './builder';
import { FaceSvg } from './Face';
import { MapLayer, TEX, toScreen, useFlags, VH, VW, Waves, type View } from './MapLayer';
import { C, DISPLAY } from './theme';
import { BY_ID, geoBox } from './world';
import { OBJ, type ObjName } from './objects';

const INK = '#141320';
type Box = [number, number, number, number];
export type ThumbBg = { kind: 'sea' | 'map' | 'dark' | 'fire' | 'ice'; view?: Box; flags?: string[]; faces?: string[] };
export type ThumbHero =
  | { kind: 'country'; id: string; mood?: Mood; glow?: string; silhouette?: boolean; mark?: string; face?: number; faceDx?: number; faceDy?: number }
  | { kind: 'object'; name: ObjName; mood?: Mood; glow?: string; face?: number; label?: string };
export type ThumbSide = { hero: ThumbHero; bg: ThumbBg; label?: string; labelColor?: string; scale?: number };
export type ThumbV = {
  layout: 'hero' | 'versus' | 'grid' | 'number';
  top?: string; bottom?: string; accent?: string;     // *palabra* = color de acento
  bg?: ThumbBg; hero?: ThumbHero; x?: number; y?: number; size?: number; rays?: boolean;
  left?: ThumbSide; right?: ThumbSide;                 // versus
  grid?: { ids: string[]; moods?: Mood[] };            // grid de banderas con cara
  big?: string; bigColor?: string;                     // cifra gigante (layout number)
};

// ---------- texto gigante con contorno, degradado y sombra ----------
const grad = (c: string): [string, string] => (c === '#FFFFFF' ? ['#FFFFFF', '#DCE6F5'] : [c, shade(c, -0.28)]);
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return '#' + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
};
export const BigLine: React.FC<{ text: string; accent: string; size: number; y: number; maxW?: number; rot?: number; allAccent?: boolean }> = ({ text, accent, size, y, maxW = 1200, rot = -2, allAccent }) => {
  const parts = text.split('*');
  const est = text.replace(/\*/g, '').length * size * 0.56;
  const fit = est > maxW ? { textLength: maxW, lengthAdjust: 'spacingAndGlyphs' as const } : {};
  const sw = size * 0.16;
  const id = 'g' + Math.abs([...text].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 1e6);
  const segs = parts.map((p, i) => ({ p, c: allAccent || i % 2 ? accent : '#FFFFFF' }));
  const tspans = (fill: (c: string, i: number) => string) => segs.map((s, i) => <tspan key={i} fill={fill(s.c, i)}>{s.p}</tspan>);
  return (
    <svg width={1280} height={size * 1.5} style={{ position: 'absolute', left: 0, top: y - size * 0.75, overflow: 'visible', transform: `rotate(${rot}deg)` }}>
      <defs>
        {segs.map((s, i) => { const [a, b] = grad(s.c); return <linearGradient key={i} id={`${id}-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>; })}
      </defs>
      <g fontFamily={DISPLAY} fontSize={size} textAnchor="middle" style={{ letterSpacing: 1 }}>
        {/* sombra 3D */}
        <text x={640} y={size * 1.12 + size * 0.09} stroke={INK} strokeWidth={sw * 2.1} strokeLinejoin="round" fill={INK} {...fit}>{tspans(() => INK)}</text>
        {/* contorno */}
        <text x={640} y={size * 1.12} stroke={INK} strokeWidth={sw * 2} strokeLinejoin="round" fill={INK} {...fit}>{tspans(() => INK)}</text>
        {/* relleno con degradado */}
        <text x={640} y={size * 1.12} {...fit}>{tspans((_, i) => `url(#${id}-${i})`)}</text>
      </g>
    </svg>
  );
};

// ---------- fondos ----------
const viewOf = (b: Box): View => { const [x0, y0, x1, y1] = b; const w = Math.max(x1 - x0, ((y1 - y0) * VW) / VH); return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w, h: (w * VH) / VW }; };
const BgLayer: React.FC<{ bg: ThumbBg; flags: Record<string, string>; w?: number }> = ({ bg, flags, w = 1280 }) => {
  if (bg.kind === 'dark') return <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #2A2335 0%, #0D0B14 75%)' }} />;
  if (bg.kind === 'fire') return <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 60%, #FF7A1A 0%, #C2210F 40%, #3A0606 85%)' }} />;
  if (bg.kind === 'ice') return <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, #DFF4FF 0%, #74C3F2 45%, #1F5EA8 100%)' }} />;
  const v = viewOf(bg.view ?? (bg.kind === 'sea' ? geoBox(-40, -10, -10, 20) : geoBox(-130, -50, 150, 70)));
  const fills = bg.kind === 'map' && bg.flags?.length ? [{ t: 0, ids: bg.flags, flag: true, dur: 0.01 }] : [];
  const s = w / VW;
  const moods: Mood[] = ['cry', 'worried', 'wow', 'sad', 'shocked'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, transform: `scale(${Math.max(s, 720 / VH)})`, transformOrigin: '0 0' }}>
        {bg.kind === 'sea' ? (
          <svg width={VW} height={VH} viewBox={`${v.x - v.w / 2} ${v.y - v.h / 2} ${v.w} ${v.h}`} style={{ position: 'absolute', inset: 0 }}>
            <rect x={-5000} y={-5000} width={20000} height={20000} fill={C.oceanDeep} />
            <image href={staticFile('tex/ocean.jpg')} x={TEX.x} y={TEX.y} width={TEX.w} height={TEX.h} preserveAspectRatio="none" />
          </svg>
        ) : (
          <MapLayer v={v} fills={fills} t={1} flags={flags} />
        )}
        <Waves v={v} t={0} opacity={0.45} />
        {bg.kind === 'map' && (bg.faces ?? []).map((id, i) => {
          const c = BY_ID[id]; if (!c) return null;
          const [x, y] = toScreen(v, c.c[0], c.c[1]); const sz = 74;
          return <div key={id} style={{ position: 'absolute', left: x - sz / 2, top: y - sz / 2 }}><FaceSvg mood={moods[i % moods.length]} t={0.5 + i} size={sz} /></div>;
        })}
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0) 35%, rgba(5,20,50,.45) 100%)' }} />
    </AbsoluteFill>
  );
};

// ---------- rayos detrás del foco ----------
const Rays: React.FC<{ x: number; y: number; r: number; color?: string }> = ({ x, y, r, color = 'rgba(255,255,255,.22)' }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: `repeating-conic-gradient(${color} 0deg 9deg, transparent 9deg 22deg)`, WebkitMaskImage: 'radial-gradient(circle, #000 25%, transparent 70%)' }} />
);

// ---------- país "pegatina hinchada" con cara ----------
export const CountryHero: React.FC<{ h: Extract<ThumbHero, { kind: 'country' }>; cx: number; cy: number; size: number; flag?: string }> = ({ h, cx, cy, size, flag }) => {
  const c = BY_ID[h.id];
  if (!c) return null;
  const [[x0, y0], [x1, y1]] = c.bb;
  const bw = x1 - x0, bh = y1 - y0, m = Math.max(bw, bh), pad = m * 0.12;
  const long = bw / bh > 1.8 || bh / bw > 1.8;
  const fw = long ? bw : Math.max(bw, bh * (4 / 3)), fh = long ? bh : fw * 0.75;
  const k = m / size;
  const glow = h.glow ?? '#FFD23F';
  const fs = size * (h.face ?? 0.62);
  const uid = `ch-${h.id}-${Math.round(cx)}`;
  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size }}>
      <svg width={size} height={size} viewBox={`${(x0 + x1) / 2 - m / 2 - pad} ${(y0 + y1) / 2 - m / 2 - pad} ${m + 2 * pad} ${m + 2 * pad}`} style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${size * 0.04}px ${glow}) drop-shadow(0 0 ${size * 0.09}px ${glow}) drop-shadow(0 ${size * 0.03}px 0 rgba(0,0,0,.45))` }}>
        <defs>
          <pattern id={`${uid}-f`} patternUnits="userSpaceOnUse" x={x0 + bw / 2 - fw / 2} y={y0 + bh / 2 - fh / 2} width={fw} height={fh}>
            {flag && <image href={flag} width={fw} height={fh} preserveAspectRatio="none" />}
          </pattern>
          <radialGradient id={`${uid}-g`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0" stopColor="#fff" stopOpacity={0.45} />
            <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.35} />
          </radialGradient>
        </defs>
        <path d={c.dm} fill="#fff" stroke="#fff" strokeWidth={26 * k} strokeLinejoin="round" />
        <path d={c.dm} fill={h.silhouette ? '#120F18' : `url(#${uid}-f)`} stroke={INK} strokeWidth={7 * k} strokeLinejoin="round" />
        {!h.silhouette && <path d={c.dm} fill={`url(#${uid}-g)`} />}
      </svg>
      {h.silhouette && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: size * 0.17, color: '#fff', WebkitTextStroke: `12px ${INK}`, paintOrder: 'stroke fill', textShadow: `0 0 18px ${glow}, 0 0 40px ${glow}` }}>{h.mark ?? '?'}</div>
      )}
      {!h.silhouette && h.mood && (
        <div style={{ position: 'absolute', left: size / 2 - fs / 2 + (h.faceDx ?? 0) * size, top: size / 2 - fs / 2 + (h.faceDy ?? 0) * size, filter: 'drop-shadow(0 4px 0 rgba(0,0,0,.3))' }}>
          <FaceSvg mood={h.mood} t={0.55} size={fs} />
        </div>
      )}
    </div>
  );
};

// ---------- objetos (cuando el tema no es un país) ----------
export const ObjectHero: React.FC<{ h: Extract<ThumbHero, { kind: 'object' }>; cx: number; cy: number; size: number }> = ({ h, cx, cy, size }) => {
  const glow = h.glow ?? '#FFD23F';
  const fs = size * (h.face ?? 0.45);
  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, filter: `drop-shadow(0 0 ${size * 0.05}px ${glow}) drop-shadow(0 0 ${size * 0.1}px ${glow})` }}>
      <svg width={size} height={size} viewBox="-110 -110 220 220" style={{ overflow: 'visible' }}>{OBJ[h.name]}</svg>
      {h.mood && <div style={{ position: 'absolute', left: size / 2 - fs / 2, top: size * 0.42 - fs / 2 }}><FaceSvg mood={h.mood} t={0.55} size={fs} /></div>}
    </div>
  );
};
const HeroAny: React.FC<{ h: ThumbHero; cx: number; cy: number; size: number; flags: Record<string, string> }> = ({ h, cx, cy, size, flags }) =>
  h.kind === 'country' ? <CountryHero h={h} cx={cx} cy={cy} size={size} flag={flags[h.id]} /> : <ObjectHero h={h} cx={cx} cy={cy} size={size} />;

// ---------- bandera-tarjeta con cara (layout grid) ----------
const FlagCard: React.FC<{ id: string; flag?: string; mood: Mood; x: number; y: number; w: number }> = ({ id, flag, mood, x, y, w }) => {
  const h = w * 0.68;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${(id.charCodeAt(0) % 5) - 2}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', border: `7px solid #fff`, boxShadow: `0 0 0 5px ${INK}, 0 10px 0 5px rgba(0,0,0,.35)` }}>
        {flag && <img src={flag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,.25) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', left: w / 2 - h * 0.6, top: -h * 0.1 }}><FaceSvg mood={mood} t={0.5} size={h * 1.2} /></div>
    </div>
  );
};

// ---------- composición ----------
export const Thumb: React.FC<{ cfg: ThumbV }> = ({ cfg }) => {
  const ids = [
    ...(cfg.bg?.flags ?? []), ...(cfg.hero?.kind === 'country' ? [cfg.hero.id] : []), ...(cfg.grid?.ids ?? []),
    ...[cfg.left, cfg.right].flatMap((s) => (s ? [...(s.bg.flags ?? []), ...(s.hero.kind === 'country' ? [s.hero.id] : [])] : [])),
  ];
  const flags = useFlags([...new Set(ids)]);
  if (!flags) return null;
  const acc = cfg.accent ?? '#FFD23F';
  const hx = cfg.x ?? 640, hy = cfg.y ?? 372, hs = cfg.size ?? 470;
  return (
    <AbsoluteFill style={{ background: C.oceanDeep, overflow: 'hidden' }}>
      {cfg.layout !== 'versus' && <BgLayer bg={cfg.bg ?? { kind: 'sea' }} flags={flags} />}

      {cfg.layout === 'versus' && cfg.left && cfg.right && (
        <>
          {[cfg.left, cfg.right].map((s, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, clipPath: i === 0 ? 'polygon(0 0, 54% 0, 46% 100%, 0 100%)' : 'polygon(54% 0, 100% 0, 100% 100%, 46% 100%)' }}>
              <BgLayer bg={s.bg} flags={flags} />
            </div>
          ))}
          <Rays x={330} y={380} r={430} />
          <Rays x={950} y={380} r={430} color={cfg.right.bg.kind === 'dark' ? 'rgba(255,60,40,.18)' : undefined} />
          <HeroAny h={cfg.left.hero} cx={320} cy={390} size={hs * 0.95 * (cfg.left.scale ?? 1)} flags={flags} />
          <HeroAny h={cfg.right.hero} cx={960} cy={390} size={hs * 0.95 * (cfg.right.scale ?? 1)} flags={flags} />
          {/* rayo divisor */}
          <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}>
            <path d="M700,-10 L612,300 L676,300 L578,730 L560,730 L640,380 L578,380 L668,-10 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          </svg>
          {[cfg.left, cfg.right].map((s, i) => s.label && (
            <BigLine key={i} text={s.label} accent={s.labelColor ?? acc} allAccent={!!s.labelColor} size={84} y={632} maxW={560} rot={0} />
          )).map((el, i) => el && <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateX(${i === 0 ? -320 : 320}px)` }}>{el}</div>)}
        </>
      )}

      {cfg.layout === 'hero' && cfg.hero && (
        <>
          {cfg.rays !== false && <Rays x={hx} y={hy} r={hs * 0.95} />}
          <HeroAny h={cfg.hero} cx={hx} cy={hy} size={hs} flags={flags} />
        </>
      )}

      {cfg.layout === 'number' && cfg.hero && (
        <>
          <Rays x={340} y={400} r={420} />
          <HeroAny h={cfg.hero} cx={340} cy={400} size={hs} flags={flags} />
          <div style={{ position: 'absolute', inset: 0, transform: 'translateX(300px)' }}>
            <BigLine text={cfg.big ?? ''} accent={cfg.bigColor ?? acc} allAccent size={230} y={330} maxW={600} rot={-5} />
          </div>
        </>
      )}

      {cfg.layout === 'grid' && cfg.grid && (() => {
        const n = cfg.grid.ids.length, cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols);
        const w = cols === 3 ? 262 : 320, gx = 40, gy = 26;
        const totW = cols * w + (cols - 1) * gx, x0 = 640 - totW / 2, y0 = 168 + (rows === 1 ? 80 : 0);
        return cfg.grid.ids.map((id, i) => (
          <FlagCard key={id} id={id} flag={flags[id]} mood={cfg.grid!.moods?.[i % cfg.grid!.moods.length] ?? 'terror'} x={x0 + (i % cols) * (w + gx)} y={y0 + Math.floor(i / cols) * (w * 0.68 + gy)} w={w} />
        ));
      })()}

      {cfg.top && <BigLine text={cfg.top} accent={acc} size={cfg.layout === 'grid' ? 104 : 96} y={cfg.layout === 'versus' ? 58 : 70} maxW={1180} />}
      {cfg.bottom && <BigLine text={cfg.bottom} accent={acc} size={112} y={640} maxW={1180} rot={-1.5} />}
    </AbsoluteFill>
  );
};
