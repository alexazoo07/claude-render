import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, OffthreadVideo, staticFile, Easing} from 'remotion';

/* all overlay timings are written in 30-fps units; useF() maps the real frame (60 fps) onto them so motion is sampled twice as smoothly */
export const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f * 30 / fps; };

export const PINK = '#ff3d86';
export const NAVY = '#1c2236';
export const NAVY_DEEP = '#141a2b';
export const INK = '#121829';
export const HEAD = "'Inter Display', 'Inter', sans-serif";
export const BODY = "'Inter', sans-serif";

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------- footage ---------- */
export const Clip: React.FC<{src: string; dur: number; from?: number; zoom?: [number, number]; blur?: number; dim?: number; rate?: number; origin?: string; crop?: number}> = ({src, dur, from = 0, zoom = [1.0, 1.07], blur = 0, dim = 0, rate = 1, origin = '50% 50%'}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], zoom, clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo src={staticFile(`clips/${src}.mp4`)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s * (blur ? 1.06 : 1)})`, transformOrigin: origin, filter: blur ? `blur(${blur}px) brightness(${1 - dim})` : dim ? `brightness(${1 - dim})` : undefined}} />
    </AbsoluteFill>
  );
};

/* the reference's text entrance: ~5 frames from big+blurred+transparent to sharp, then a slow drift; fade out at the end */
export const useEnter = (dur: number, delay = 0, out = 8) => {
  const f = useF() - delay;
  const t = interpolate(f, [0, 8], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const exit = interpolate(f, [dur - delay - out, dur - delay], [1, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const drift = interpolate(f, [0, dur], [1, 1.035], clamp);
  return {
    opacity: t * exit,
    transform: `scale(${(1.12 - 0.12 * t) * drift * (0.97 + 0.03 * exit)})`,
    filter: `blur(${(1 - t) * 12 + (1 - exit) * 6}px)`,
    tracking: (1 - t),
    f,
  };
};

/* big centered title + small tracked subtitle */
export const BigTitle: React.FC<{text: string; sub?: string; dur: number; size?: number; color?: string; top?: number | string; delay?: number}> = ({text, sub, dur, size = 190, color = '#fff', top = '50%', delay = 0}) => {
  const e = useEnter(dur, delay);
  if (e.f < 0) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top, transform: `translateY(-50%) ${e.transform}`, opacity: e.opacity, filter: e.filter, textAlign: 'center', width: '100%'}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: '-0.045em', lineHeight: 0.95, color, textShadow: '0 6px 30px rgba(0,0,0,0.45)'}}>{text}</div>
        {sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: size * 0.17, letterSpacing: `${0.16 + e.tracking * 0.25}em`, color: '#fff', marginTop: size * 0.1, textShadow: '0 3px 14px rgba(0,0,0,0.6)'}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* lower-left location label: "LEONIDA KEYS / AQUÍ DESPIERTAS" */
export const Label: React.FC<{text: string; sub?: string; dur: number; delay?: number; size?: number}> = ({text, sub, dur, delay = 0, size = 118}) => {
  const e = useEnter(dur, delay);
  if (e.f < 0) return null;
  return (
    <div style={{position: 'absolute', left: 96, bottom: 150, transformOrigin: '0% 100%', transform: e.transform, opacity: e.opacity, filter: e.filter}}>
      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: '-0.045em', lineHeight: 0.95, color: '#fff', textShadow: '0 6px 28px rgba(0,0,0,0.5)'}}>{text}</div>
      {sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 25, letterSpacing: `${0.16 + e.tracking * 0.3}em`, color: '#fff', marginTop: 16, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>{sub}</div>}
    </div>
  );
};

/* pink pill badge that pops (the "2x" badge) */
export const Badge: React.FC<{text: string; sub?: string; x: number; y: number; dur: number; delay?: number; size?: number}> = ({text, sub, x, y, dur, delay = 0, size = 120}) => {
  const f = useF() - delay;
  const fps = 30;
  if (f < 0) return null;
  const s = spring({frame: f, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
  const exit = interpolate(f, [dur - delay - 6, dur - delay], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: exit}}>
      <div style={{background: PINK, borderRadius: 22, padding: `${size * 0.08}px ${size * 0.3}px ${size * 0.12}px`, boxShadow: '0 14px 40px rgba(0,0,0,0.35)', textAlign: 'center'}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1}}>{text}</div>
      </div>
      {sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 21, letterSpacing: '0.16em', color: '#fff', marginTop: 12, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>{sub}</div>}
    </div>
  );
};

/* exclamation in big white heavy text bottom-center (¡GIGANTE!) */
export const Shout: React.FC<{text: string; dur: number; delay?: number; x?: number; y?: number; size?: number; color?: string}> = ({text, dur, delay = 0, x = 960, y = 880, size = 120, color = '#fff'}) => {
  const e = useEnter(dur, delay);
  if (e.f < 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) ${e.transform}`, opacity: e.opacity, filter: e.filter, fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: '-0.045em', color, whiteSpace: 'nowrap', textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>{text}</div>;
};

/* source pill: ★ OFICIAL / 👁 PREVIEWS / ▢ FANS / ● TEORÍA */
export const Pill: React.FC<{kind: 'oficial' | 'previews' | 'fans' | 'teoria' | 'prensa'; dark?: boolean; scale?: number}> = ({kind, dark = true, scale = 1}) => {
  const map = {
    oficial: {icon: '★', label: 'OFICIAL', color: '#fff'},
    previews: {icon: '◉', label: 'PREVIEWS', color: '#5ee7ff'},
    fans: {icon: '▯', label: 'FANS', color: '#fff'},
    teoria: {icon: '●', label: 'TEORÍA', color: PINK},
    prensa: {icon: '◆', label: 'PRENSA', color: '#fff'},
  }[kind];
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 8 * scale, background: dark ? NAVY : 'rgba(255,255,255,0.9)', color: map.color, borderRadius: 999, padding: `${5 * scale}px ${14 * scale}px`, fontFamily: BODY, fontWeight: 800, fontSize: 17 * scale, letterSpacing: '0.14em'}}>
      <span style={{fontSize: 15 * scale, color: map.color}}>{map.icon}</span>{map.label}
    </span>
  );
};

/* white tilted quote card (OFICIAL · COMO EL DOBLE DEL MAPA DE GTA V) */
export const QuoteCard: React.FC<{kind: 'oficial' | 'previews' | 'fans' | 'teoria' | 'prensa'; lines: string[]; source: string; x: number; y: number; dur: number; delay?: number; tilt?: number; highlight?: boolean}> = ({kind, lines, source, x, y, dur, delay = 0, tilt = -1.6, highlight}) => {
  const f = useF() - delay;
  const fps = 30;
  if (f < 0) return null;
  const s = spring({frame: f, fps, config: {damping: 15, stiffness: 160}});
  const exit = interpolate(f, [dur - delay - 7, dur - delay], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(1, s * 1.4) * exit, transform: `translateY(${(1 - s) * 60}px) rotate(${tilt - (1 - s) * 3}deg) scale(${0.92 + 0.08 * s})`, transformOrigin: '0% 50%'}}>
      <div style={{background: '#f7f7fa', borderRadius: 18, padding: '30px 40px 28px', boxShadow: '0 24px 60px rgba(0,0,0,0.38)', minWidth: 640}}>
        <Pill kind={kind} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 66, letterSpacing: '-0.04em', lineHeight: 1.0, color: INK, marginTop: 18}}>
          {lines.map((l, i) => <div key={i}><span style={{background: highlight && i === lines.length - 1 ? 'linear-gradient(transparent 58%, rgba(255,61,134,0.35) 58%)' : undefined}}>{l}</span></div>)}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 17, letterSpacing: '0.14em', color: '#3a4258', marginTop: 16}}>{source}</div>
      </div>
    </div>
  );
};

/* tiny footer credit used on every shot */
export const Credit: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 30, bottom: 26, display: 'flex', alignItems: 'center', gap: 10, fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 6px rgba(0,0,0,0.8)'}}>
    <span style={{width: 7, height: 7, borderRadius: 9, background: PINK, display: 'inline-block'}} />{text}
  </div>
);

/* "● REC" camera overlay with red corner brackets + pink identification tag */
export const RecOverlay: React.FC<{box: [number, number, number, number]; tag: string; dur: number; delay?: number}> = ({box, tag, dur, delay = 0}) => {
  const f = useF() - delay;
  if (f < 0) return null;
  const [x, y, w, h] = box;
  const t = interpolate(f, [0, 6], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const op = interpolate(f, [0, 3, dur - delay - 6, dur - delay], [0, 1, 1, 0], clamp);
  const blink = Math.floor(f / 15) % 2 === 0 ? 1 : 0.25;
  const c = '#ff2e45';
  const L = 70, T = 6;
  const corner = (st: React.CSSProperties) => <div style={{position: 'absolute', width: L, height: L, ...st}} />;
  const tagT = interpolate(f, [6, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', left: 60, top: 48, display: 'flex', alignItems: 'center', gap: 12, fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: '0.08em', color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.7)'}}>
        <span style={{width: 18, height: 18, borderRadius: 18, background: c, opacity: blink}} />REC
      </div>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${t})`, transformOrigin: '50% 50%'}}>
        {corner({left: 0, top: 0, borderLeft: `${T}px solid ${c}`, borderTop: `${T}px solid ${c}`})}
        {corner({right: 0, top: 0, borderRight: `${T}px solid ${c}`, borderTop: `${T}px solid ${c}`})}
        {corner({left: 0, bottom: 0, borderLeft: `${T}px solid ${c}`, borderBottom: `${T}px solid ${c}`})}
        {corner({right: 0, bottom: 0, borderRight: `${T}px solid ${c}`, borderBottom: `${T}px solid ${c}`})}
      </div>
      <div style={{position: 'absolute', left: x + w / 2, top: y + h + 18, transform: `translateX(-50%) scaleX(${tagT})`, background: '#e8344f', color: '#fff', padding: '6px 16px', fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: '0.08em', whiteSpace: 'nowrap', borderRadius: 4}}>{tag}</div>
    </AbsoluteFill>
  );
};

/* frosted glass card with thumbnail + caption (the 3-card "sources" layout) */
export const GlassCard: React.FC<{img: string; kind: 'oficial' | 'previews' | 'fans' | 'teoria' | 'prensa'; title: string[]; x: number; y: number; w?: number; delay: number; dur: number; rot?: number}> = ({img, kind, title, x, y, w = 500, delay, dur, rot = 0}) => {
  const f = useF() - delay;
  const fps = 30;
  if (f < 0) return null;
  const s = spring({frame: f, fps, config: {damping: 14, stiffness: 170}});
  const exit = interpolate(f, [dur - delay - 7, dur - delay], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, s * 1.5) * exit, transform: `translateY(${(1 - s) * 80}px) rotate(${rot}deg) scale(${0.9 + 0.1 * s})`}}>
      <div style={{background: 'rgba(255,255,255,0.93)', borderRadius: 20, padding: 18, boxShadow: '0 26px 60px rgba(0,0,0,0.42)'}}>
        <div style={{position: 'relative'}}>
          <img src={staticFile(`img/${img}.jpg`)} style={{width: '100%', height: w * 0.52, objectFit: 'cover', borderRadius: 10, display: 'block'}} />
          <div style={{position: 'absolute', left: 12, top: 12}}><Pill kind={kind} scale={0.9} /></div>
        </div>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 46, letterSpacing: '-0.035em', lineHeight: 1.02, color: INK, marginTop: 16, marginBottom: 4}}>{title.map((t, i) => <div key={i}>{t}</div>)}</div>
      </div>
    </div>
  );
};

/* navy checklist panel: "CHECKLIST DEL DÍA UNO" + pink "AL FINAL DEL VIDEO" */
export const Checklist: React.FC<{title: string; tag: string; rows: number; dur: number; delay?: number}> = ({title, tag, rows, dur, delay = 0}) => {
  const f = useF() - delay;
  const fps = 30;
  if (f < 0) return null;
  const s = spring({frame: f, fps, config: {damping: 16, stiffness: 150}});
  const exit = interpolate(f, [dur - delay - 7, dur - delay], [1, 0], clamp);
  const widths = [420, 360, 450, 330, 400, 470, 380];
  return (
    <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - s) * 70}px) scale(${0.94 + 0.06 * s})`, opacity: Math.min(1, s * 1.5) * exit}}>
      <div style={{background: 'rgba(26,32,52,0.92)', borderRadius: 22, padding: '44px 52px 48px', width: 1040, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 62, letterSpacing: '-0.04em', color: '#fff', whiteSpace: 'nowrap'}}>{title}</div>
          <div style={{background: PINK, color: '#fff', borderRadius: 999, padding: '8px 18px', fontFamily: BODY, fontWeight: 800, fontSize: 18, letterSpacing: '0.14em', whiteSpace: 'nowrap'}}>{tag}</div>
        </div>
        <div style={{width: 72, height: 5, background: PINK, borderRadius: 3, marginTop: 12, marginBottom: 26}} />
        {Array.from({length: rows}).map((_, i) => {
          const rs = interpolate(f, [8 + i * 4, 14 + i * 4], [0, 1], clamp);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, height: 56, opacity: rs, transform: `translateX(${(1 - rs) * -30}px)`}}>
              <div style={{width: 32, height: 32, border: '3px solid rgba(255,255,255,0.75)', borderRadius: 7}} />
              <div style={{width: widths[i % widths.length], height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.22)'}} />
              <div style={{marginLeft: 'auto', fontFamily: BODY, fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.6)'}}>{i + 1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* fast-flash transition: white frame + exposure punch used on montage cuts */
export const Flash: React.FC<{dur?: number}> = ({dur = 5}) => {
  const f = useF();
  const o = interpolate(f, [0, 1, dur], [0.85, 0.5, 0], clamp);
  return <AbsoluteFill style={{background: '#fff', opacity: o}} />;
};

export const FadeFromBlack: React.FC<{frames: number}> = ({frames}) => {
  const f = useF();
  return <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, frames], [1, 0], clamp)}} />;
};
