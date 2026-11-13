import React from 'react';
import { Img } from 'remotion';
import type { Banner, Big, Board, Card, Chapter, Gauge, Outro, Progress, Stamp, Title } from './builder';
import { flagUrl } from './MapLayer';
import { BODY, C, DISPLAY, fmt, scaleColor, stroke } from './theme';

// ---------- utilidades de animación ----------
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const backOut = (x: number) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
/** 0..1 (con rebote) al entrar, 1..0 al salir */
export const pop = (t: number, t0: number, t1: number, inD = 0.35, outD = 0.25) => {
  if (t < t0 || t > t1) return 0;
  const a = backOut(clamp((t - t0) / inD));
  const b = clamp((t1 - t) / outD);
  return Math.min(a, b < 1 ? b * b : 1);
};
export const vis = (t: number, x: { t0: number; t1: number }) => t >= x.t0 && t <= x.t1;
const cardBox = (bg: string, border = C.ink): React.CSSProperties => ({ background: bg, border: `5px solid ${border}`, borderRadius: 22, boxShadow: `0 9px 0 ${C.ink}` });

export const Flag: React.FC<{ id: string; w: number; round?: boolean }> = ({ id, w, round }) => (
  <div style={{ width: w, height: round ? w : w * 0.75, borderRadius: round ? '50%' : 8, overflow: 'hidden', border: `${Math.max(3, w / 22)}px solid ${C.ink}`, flexShrink: 0, background: '#ddd' }}>
    <Img src={flagUrl(id)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

// Icono simple por clave (sin emojis -> render fiable)
export const Icon: React.FC<{ name?: string; size: number; color?: string }> = ({ name = 'globe', size, color = C.gold }) => {
  const p: Record<string, React.ReactNode> = {
    people: (<g fill={color}><circle cx={-22} cy={-18} r={13} /><circle cx={22} cy={-18} r={13} /><circle cx={0} cy={-26} r={17} /><path d="M-48,40 Q-48,0 -22,0 Q-8,0 -4,10 Q0,4 4,10 Q8,0 22,0 Q48,0 48,40 Z" /></g>),
    star: <path fill={color} d="M0,-46 L13,-14 L46,-12 L20,9 L29,42 L0,23 L-29,42 L-20,9 L-46,-12 L-13,-14 Z" />,
    flame: <path fill={color} d="M0,-48 C20,-20 40,0 30,26 C22,46 -22,46 -30,26 C-38,4 -14,-6 -6,-24 C-2,-10 6,-6 8,-2 C12,-18 6,-32 0,-48 Z" />,
    snow: (<g stroke={color} strokeWidth={9} strokeLinecap="round">{[0, 60, 120].map((a) => <path key={a} transform={`rotate(${a})`} d="M0,-44 V44 M-12,-34 L0,-22 L12,-34 M-12,34 L0,22 L12,34" fill="none" />)}</g>),
    trophy: <path fill={color} d="M-30,-44 H30 V-10 C30,12 14,22 6,24 V34 H20 V46 H-20 V34 H-6 V24 C-14,22 -30,12 -30,-10 Z M-30,-36 H-46 V-20 C-46,-6 -36,0 -28,2 M30,-36 H46 V-20 C46,-6 36,0 28,2" stroke={color} strokeWidth={6} />,
    globe: (<g fill="none" stroke={color} strokeWidth={8}><circle r={42} /><ellipse rx={18} ry={42} /><path d="M-42,0 H42 M-36,-22 H36 M-36,22 H36" /></g>),
    ban: (<g fill="none" stroke={color} strokeWidth={11}><circle r={38} /><path d="M-27,-27 L27,27" /></g>),
    mountain: <path fill={color} d="M-48,40 L-14,-30 L2,0 L16,-40 L48,40 Z" />,
    money: (<g><circle r={42} fill={color} /><text y={20} textAnchor="middle" fontSize={58} fontFamily={DISPLAY} fill={C.ink}>$</text></g>),
  };
  return <svg width={size} height={size} viewBox="-50 -50 100 100">{p[name] ?? p.globe}</svg>;
};

// ---------- Portada inicial ----------
export const TitleCard: React.FC<{ x: Title; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.5, 0.35);
  const b = pop(t, x.t0 + 0.25, x.t1, 0.5, 0.35);
  const c = pop(t, x.t0 + 0.6, x.t1, 0.5, 0.35);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 92, color: C.white, textShadow: stroke(9), transform: `scale(${a}) rotate(-2deg)`, letterSpacing: 1 }}>{x.top}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 150, color: x.color ?? C.gold, textShadow: stroke(12), transform: `scale(${b}) rotate(-2deg)`, lineHeight: 1.05 }}>{x.main}</div>
      {x.sub && (
        <div style={{ ...cardBox(C.red), transform: `scale(${c}) rotate(1.5deg)`, padding: '10px 34px', fontFamily: DISPLAY, fontSize: 52, color: C.white, marginTop: 18 }}>{x.sub}</div>
      )}
    </div>
  );
};

// ---------- Píldora de capítulo (arriba izquierda) ----------
export const ChapterPill: React.FC<{ x: Chapter; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1);
  return (
    <div style={{ position: 'absolute', left: 36, top: 30, transform: `translateX(${(a - 1) * 120}px)`, opacity: Math.min(1, a * 1.5), display: 'flex', alignItems: 'center', gap: 12, background: C.ink, borderRadius: 40, padding: '10px 26px 10px 14px', border: `4px solid ${C.gold}`, boxShadow: `0 6px 0 rgba(0,0,0,.35)` }}>
      <Icon name={x.icon} size={40} />
      {x.idx !== undefined && <span style={{ fontFamily: DISPLAY, fontSize: 38, color: C.gold }}>{x.idx}/{x.total}</span>}
      <span style={{ fontFamily: DISPLAY, fontSize: 38, color: C.white, letterSpacing: 1 }}>{x.label.toUpperCase()}</span>
    </div>
  );
};

// ---------- Barra de progreso de etapas (arriba centro) ----------
export const ProgressBar: React.FC<{ x: Progress; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.5);
  const done = x.steps.filter((s) => s.t <= t);
  const cur = done.length ? done[done.length - 1].idx : -1;
  const n = x.labels.length;
  const W = 860;
  return (
    <div style={{ position: 'absolute', left: 960 - W / 2, top: 26, width: W, height: 74, transform: `translateY(${(a - 1) * 120}px)`, background: C.ink, borderRadius: 40, border: `4px solid ${C.ink}`, boxShadow: `0 6px 0 rgba(0,0,0,.35)` }}>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 33, height: 6, borderRadius: 3, background: '#3B3A55' }} />
      <div style={{ position: 'absolute', left: 50, top: 33, height: 6, borderRadius: 3, background: C.gold, width: cur < 0 ? 0 : ((W - 100) * cur) / (n - 1) }} />
      {x.labels.map((l, i) => {
        const step = x.steps.find((s) => s.idx === i && s.t <= t);
        const left = 50 + ((W - 100) * i) / (n - 1);
        const isCur = i === cur;
        const sz = isCur ? 54 + 4 * Math.sin(t * 6) : step ? 44 : 22;
        return (
          <div key={i} style={{ position: 'absolute', left: left - sz / 2, top: 36 - sz / 2, width: sz, height: sz }}>
            {step?.flag ? <Flag id={step.flag} w={sz} round /> : <div style={{ width: sz, height: sz, borderRadius: '50%', background: step ? C.gold : '#55546F', border: `3px solid ${C.ink}` }} />}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Tarjeta inferior (bandera + nombre + cifra que cuenta) ----------
export const InfoCard: React.FC<{ x: Card; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.45);
  const k = clamp((t - x.t0 - 0.25) / 1.0);
  const val = x.value !== undefined ? x.value * (1 - Math.pow(1 - k, 3)) : undefined;
  return (
    <div style={{ position: 'absolute', left: 40, bottom: 36, transform: `translateY(${(1 - a) * 260}px)`, ...cardBox(C.cream), padding: '18px 30px 18px 20px', display: 'flex', alignItems: 'center', gap: 24, minWidth: 760 }}>
      <Flag id={x.flag} w={150} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 66, color: C.ink, lineHeight: 1 }}>{x.name}</div>
        {x.sub && <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 30, color: '#6B6478', marginTop: 6 }}>{x.sub}</div>}
      </div>
      {val !== undefined && (
        <div style={{ marginLeft: 'auto', paddingLeft: 30, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 92, color: x.color ?? C.orange, textShadow: stroke(5), lineHeight: 1 }}>{fmt(val, x.dec ?? 0)}</span>
          {x.unit && <span style={{ fontFamily: DISPLAY, fontSize: 44, color: C.ink }}>{x.unit}</span>}
        </div>
      )}
      {x.badge && (
        <div style={{ position: 'absolute', top: -30, right: 26, background: C.gold, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '4px 20px', fontFamily: DISPLAY, fontSize: 30, color: C.ink, transform: `rotate(3deg) scale(${pop(t, x.t0 + 0.5, x.t1)})` }}>★ {x.badge}</div>
      )}
    </div>
  );
};

// ---------- Banner de dato curioso (arriba) ----------
export const BannerBox: React.FC<{ x: Banner; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.4);
  return (
    <div style={{ position: 'absolute', left: 0, right: 380, top: x.y ?? 128, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ ...cardBox(x.color ?? C.red), transform: `scale(${a}) rotate(-1.5deg)`, padding: '12px 38px', fontFamily: DISPLAY, fontSize: 54, color: C.white, textShadow: `0 4px 0 rgba(0,0,0,.25)` }}>{x.text}</div>
    </div>
  );
};

// ---------- Sello (¡RÉCORD!, ¡EL MÁS…!) ----------
export const StampBox: React.FC<{ x: Stamp; t: number }> = ({ x, t }) => {
  if (t < x.t0 || t > x.t1) return null;
  const p = clamp((t - x.t0) / 0.18);
  const s = p < 1 ? 2.6 - 1.6 * p : 1 + 0.03 * Math.sin((t - x.t0) * 9);
  const out = clamp((x.t1 - t) / 0.2);
  const col = x.color ?? C.gold;
  return (
    <div style={{ position: 'absolute', left: (x.x ?? 860) , top: x.y ?? 300, transform: `translate(-50%,-50%) scale(${s}) rotate(${x.rot ?? -7}deg)`, opacity: Math.min(p * 2, out) }}>
      <div style={{ background: col, border: `7px solid ${C.ink}`, borderRadius: 18, padding: '6px 34px', boxShadow: `0 10px 0 ${C.ink}`, fontFamily: DISPLAY, fontSize: x.size ?? 84, color: C.ink, whiteSpace: 'nowrap' }}>{x.text}</div>
    </div>
  );
};

// ---------- Cifra gigante centrada ----------
export const BigText: React.FC<{ x: Big; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.4);
  return (
    <div style={{ position: 'absolute', left: 0, right: 380, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${a})` }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 190, color: x.color ?? C.gold, textShadow: stroke(13), lineHeight: 1 }}>{x.text}</div>
      {x.sub && <div style={{ fontFamily: DISPLAY, fontSize: 56, color: C.white, textShadow: stroke(7), marginTop: 10 }}>{x.sub}</div>}
    </div>
  );
};

// ---------- Clasificación lateral (derecha) ----------
export const BoardBox: React.FC<{ x: Board; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.5);
  let rows = x.rows.filter((r) => r.t <= t);
  if (x.sort) rows = [...rows].sort((p, q) => q.value - p.value);
  const maxV = Math.max(1, ...x.rows.map((r) => r.value));
  return (
    <div style={{ position: 'absolute', right: 30, top: 130, width: 370, transform: `translateX(${(1 - a) * 420}px)` }}>
      <div style={{ background: C.ink, borderRadius: '18px 18px 0 0', padding: '10px 16px', fontFamily: DISPLAY, fontSize: 30, color: C.gold, textAlign: 'center', border: `4px solid ${C.ink}` }}>{x.title}</div>
      <div style={{ background: 'rgba(27,26,46,.82)', borderRadius: '0 0 18px 18px', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, border: `4px solid ${C.ink}`, borderTop: 'none' }}>
        {rows.map((r, i) => {
          const k = clamp((t - r.t) / 0.35);
          return (
            <div key={r.flag + r.t} style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.cream, borderRadius: 12, padding: '6px 10px', transform: `translateX(${(1 - backOut(k)) * 300}px)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.value / maxV) * 100 * k}%`, background: 'rgba(255,200,61,.35)' }} />
              <span style={{ fontFamily: DISPLAY, fontSize: 26, color: C.ink, width: 26, zIndex: 1 }}>{x.sort ? i + 1 : ''}</span>
              <div style={{ zIndex: 1 }}><Flag id={r.flag} w={44} /></div>
              <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: BODY, fontWeight: 900, fontSize: 21, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                {r.note && <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 15, color: '#7A7286' }}>{r.note}</span>}
              </div>
              <span style={{ zIndex: 1, fontFamily: DISPLAY, fontSize: 26, color: C.ink, whiteSpace: 'nowrap' }}>{fmt(r.value, r.dec ?? 0)}{r.unit ? ' ' + r.unit : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Medidor vertical (termómetro genérico) ----------
export const GaugeBox: React.FC<{ x: Gauge; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.5);
  const marks = x.marks.filter((m) => m.t <= t);
  const last = marks[marks.length - 1];
  const prev = marks[marks.length - 2];
  const k = last ? clamp((t - last.t) / 0.9) : 0;
  const e = 1 - Math.pow(1 - k, 3);
  const min = x.min ?? 0;
  const norm = (v: number) => (x.log ? Math.log10(Math.max(v, 1e-9) / Math.max(min, 1e-9)) / Math.log10(x.max / Math.max(min, 1e-9)) : (v - min) / (x.max - min));
  const v = last ? (prev ? prev.value : min) + (last.value - (prev ? prev.value : min)) * e : min;
  const f = clamp(norm(v));
  const Hh = 640;
  return (
    <div style={{ position: 'absolute', right: 30, top: 120, width: 150, transform: `translateX(${(1 - a) * 260}px)` }}>
      <div style={{ ...cardBox(C.ink, C.ink), borderRadius: 18, padding: '6px 4px', textAlign: 'center', fontFamily: DISPLAY, fontSize: 40, color: C.orange }}>{fmt(v, x.dec ?? 0)}<span style={{ fontSize: 22, color: C.white }}> {x.unit}</span></div>
      <div style={{ position: 'relative', margin: '16px auto 0', width: 64, height: Hh, borderRadius: 32, background: '#2A2940', border: `5px solid ${C.ink}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: scaleColor(x.scale ?? 'heat', 0.25 + f * 0.75), borderTop: `4px solid rgba(255,255,255,.5)` }} />
      </div>
      {marks.map((m) => (
        <div key={m.flag} style={{ position: 'absolute', left: -18, top: 120 + 16 + Hh * (1 - clamp(norm(m.value))) - 14, transform: `scale(${pop(t, m.t + 0.8, x.t1)})` }}>
          <Flag id={m.flag} w={36} round />
        </div>
      ))}
      <div style={{ textAlign: 'center', fontFamily: DISPLAY, fontSize: 24, color: C.white, textShadow: stroke(4), marginTop: 8 }}>{x.label}</div>
    </div>
  );
};

// ---------- Cierre ----------
export const OutroBox: React.FC<{ x: Outro; t: number }> = ({ x, t }) => {
  const a = pop(t, x.t0, x.t1, 0.5);
  const b = pop(t, x.t0 + 0.6, x.t1, 0.5);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div style={{ ...cardBox(C.cream), transform: `scale(${a}) rotate(-1deg)`, padding: '16px 44px', fontFamily: DISPLAY, fontSize: 58, color: C.ink }}>{x.question}</div>
      {x.cta && <div style={{ ...cardBox(C.red), transform: `scale(${b}) rotate(1.5deg)`, padding: '10px 34px', fontFamily: DISPLAY, fontSize: 44, color: C.white }}>{x.cta}</div>}
    </div>
  );
};
