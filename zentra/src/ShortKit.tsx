// Zentra shorts kit: neon-purple vertical style (1080x1920, 60 fps). Times are in seconds of the final voice track.
import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import GAINS from './s1gains.json';

export const FPS = 60;
export const F = (s: number) => Math.round(s * FPS);
export const EO = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
export const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const lerp = (f: number, a: number, b: number, v0: number, v1: number, e = EO) => interpolate(f, [a, b], [v0, v1], {...cl, easing: e});
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export const PINK = '#ff4fa3';
export const PINK2 = '#ff8fcb';
export const YEL = '#ffd23f';
export const GRN = '#5dff8f';
export const RED = '#ff4d5e';
export const CYAN = '#4fe3ff';
export const PANEL = 'rgba(16,8,26,0.82)';
export const H1 = "'Rubik', 'Inter Display', sans-serif";
export const LB = "'Inter', sans-serif";

export type Wd = {w: string; t: number; e: number};
export type Shot = {src: string; a: number; b: number; off?: number; dim?: number; cover?: boolean; topCover?: boolean; fit?: boolean; fitTop?: number};
export type Sfx = {t: number; s: string; v?: number; peak?: number};

// time of the n-th occurrence (1-based) of a word in the voice
export const at = (W: Wd[], word: string, n = 1) => {
  let k = 0;
  for (const w of W) {
    if (w.w.toLowerCase().replace(/[^a-z0-9']/g, '') === word.toLowerCase()) {
      k++;
      if (k === n) return w.t;
    }
  }
  throw new Error('word not found: ' + word + ' #' + n);
};

export const ShotLayer: React.FC<{s: Shot}> = ({s}) => {
  const f = useCurrentFrame();
  const len = F(s.b) - F(s.a);
  const zin = lerp(f, 0, 16, 1.22, 1.0);
  const push = interpolate(f, [0, len], [1.06, 1.14], cl);
  const blur = lerp(f, 0, 14, 16, 0);
  const d = s.dim ?? 0.5;
  if (s.fit) {
    const vsrc = staticFile(`s1/v/${s.src}.mp4`);
    const vw = 1720, vh = vw * 9 / 16, top = s.fitTop ?? 960 - vh / 2;
    return (
      <AbsoluteFill style={{overflow: 'hidden', background: '#07030c'}}>
        <AbsoluteFill style={{transform: `scale(${1.25 * push})`, filter: `blur(38px) saturate(1.3) brightness(${0.25 + d * 0.4})`}}>
          <OffthreadVideo src={vsrc} muted startFrom={F(s.off ?? 0)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,6,60,0.6) 0%, rgba(10,4,20,0.2) 45%, rgba(10,4,20,0.8) 100%)'}} />
        <div style={{position: 'absolute', left: (1080 - vw) / 2, width: vw, top, height: vh, overflow: 'hidden', borderTop: `3px solid ${'#ff4fa3'}`, borderBottom: `3px solid ${'#ff4fa3'}`, boxShadow: '0 0 50px #ff4fa388', transform: `scale(${zin})`, filter: `blur(${blur}px)`}}>
          <OffthreadVideo src={vsrc} muted startFrom={F(s.off ?? 0)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${push})`, filter: 'saturate(1.15) contrast(1.06)'}} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zin * push})`, filter: `blur(${blur}px) saturate(1.15) contrast(1.06) brightness(${0.4 + d})`}}>
        <OffthreadVideo src={staticFile(`s1/v/${s.src}.mp4`)} muted startFrom={F(s.off ?? 0)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,6,60,0.55) 0%, rgba(70,10,80,0.25) 45%, rgba(10,4,20,0.75) 100%)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(8,2,16,0.75) 100%)'}} />
      {s.topCover && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 300, background: 'linear-gradient(180deg, #07030c 0%, rgba(7,3,12,0.92) 55%, rgba(7,3,12,0) 100%)'}} />}
      {s.cover && <div style={{position: 'absolute', left: 0, right: 0, top: 1560, bottom: 0, background: 'linear-gradient(180deg, rgba(7,3,12,0) 0%, rgba(7,3,12,0.97) 30%, #07030c 100%)'}} />}
    </AbsoluteFill>
  );
};

export const Pop: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'down' | 'left' | 'right' | 'zoom'; dur?: number}> = ({a, b, children, style, from = 'up', dur = 16}) => {
  const f = useCurrentFrame();
  const fa = F(a), fb = F(b);
  if (f < fa - 1 || f > fb + 14) return null;
  const p = lerp(f, fa, fa + dur, 0, 1);
  const q = lerp(f, fb, fb + 12, 0, 1, IO);
  const dist = 70;
  const dx = from === 'left' ? -dist : from === 'right' ? dist : 0;
  const dy = from === 'up' ? dist : from === 'down' ? -dist : 0;
  const sc = from === 'zoom' ? 0.82 + 0.18 * p : 0.94 + 0.06 * p;
  return (
    <div style={{position: 'absolute', ...style, opacity: p * (1 - q), transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p) - 30 * q}px) scale(${sc * (1 - 0.06 * q)})`, filter: `blur(${(1 - p) * 10 + q * 8}px)`}}>
      {children}
    </div>
  );
};

export const panel = (c = PINK): React.CSSProperties => ({
  background: PANEL,
  border: `3px solid ${c}`,
  borderRadius: 26,
  boxShadow: `0 0 34px ${c}88, inset 0 0 26px ${c}33`,
});
export const Tag: React.FC<{children: React.ReactNode; c?: string; size?: number}> = ({children, c = PINK, size = 30}) => (
  <div style={{display: 'inline-block', padding: '10px 26px', borderRadius: 999, border: `2.5px solid ${c}`, background: 'rgba(12,6,20,0.85)', color: '#fff', fontFamily: LB, fontWeight: 800, fontSize: size, letterSpacing: 5, textTransform: 'uppercase', boxShadow: `0 0 22px ${c}88`, whiteSpace: 'nowrap'}}>{children}</div>
);
export const Big: React.FC<{children: React.ReactNode; size?: number; c?: string; glow?: string}> = ({children, size = 120, c = '#fff', glow = PINK}) => (
  <div style={{fontFamily: H1, fontWeight: 900, fontSize: size, color: c, lineHeight: 1, letterSpacing: -1, textShadow: `0 0 28px ${glow}aa, 0 6px 0 rgba(0,0,0,0.35)`, whiteSpace: 'nowrap'}}>{children}</div>
);
export const Lab: React.FC<{children: React.ReactNode; c?: string; size?: number}> = ({children, c = PINK2, size = 26}) => (
  <div style={{fontFamily: LB, fontWeight: 800, fontSize: size, letterSpacing: 8, color: c, textTransform: 'uppercase'}}>{children}</div>
);
export const C: React.CSSProperties = {left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'};

// ---------- icons ----------
export const ic = (d: React.ReactNode, s = 90, c = '#fff', sw = 7) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
export const IClock: React.FC<{s?: number; t: number; c?: string}> = ({s = 150, t, c = '#fff'}) => ic(<><circle cx="50" cy="50" r="40" /><line x1="50" y1="50" x2={50 + 26 * Math.sin(t)} y2={50 - 26 * Math.cos(t)} /><line x1="50" y1="50" x2={50 + 18 * Math.sin(t / 12)} y2={50 - 18 * Math.cos(t / 12)} /><circle cx="50" cy="50" r="3" fill={c} /></>, s, c);
export const ICheck = (s = 60, c = GRN) => ic(<polyline points="22,52 42,70 78,30" />, s, c, 10);
export const IX = (s = 60, c = RED) => ic(<><line x1="26" y1="26" x2="74" y2="74" /><line x1="74" y1="26" x2="26" y2="74" /></>, s, c, 10);
export const IUser = (s = 90, c = '#fff') => ic(<><circle cx="50" cy="36" r="16" /><path d="M20 84 Q22 58 50 58 Q78 58 80 84" /></>, s, c);
export const IEye = (s = 90, c = '#fff') => ic(<><path d="M10 50 Q50 14 90 50 Q50 86 10 50 Z" /><circle cx="50" cy="50" r="12" /></>, s, c);
export const IPin = (s = 90, c = PINK) => ic(<><path d="M50 90 C30 64 22 52 22 38 A28 28 0 0 1 78 38 C78 52 70 64 50 90 Z" fill={c + '55'} /><circle cx="50" cy="38" r="10" fill="#fff" stroke="none" /></>, s, c);
export const IPhone = (s = 70, c = '#fff') => ic(<><rect x="30" y="12" width="40" height="76" rx="8" /><line x1="45" y1="78" x2="55" y2="78" /></>, s, c);
export const ICar = (s = 70, c = '#fff') => ic(<><path d="M18 62 L26 38 Q28 32 35 32 H65 Q72 32 74 38 L82 62 Z" /><rect x="14" y="60" width="72" height="16" rx="5" /><circle cx="30" cy="80" r="5" /><circle cx="70" cy="80" r="5" /></>, s, c);
export const ISearch = (s = 90, c = '#fff') => ic(<><circle cx="42" cy="42" r="24" /><line x1="60" y1="60" x2="84" y2="84" /></>, s, c);
export const ILock = (s = 80, c = '#fff') => ic(<><rect x="24" y="44" width="52" height="40" rx="8" /><path d="M34 44 V32 A16 16 0 0 1 66 32 V44" /></>, s, c);
export const IUfo = (s = 90, c = '#fff') => ic(<><ellipse cx="50" cy="56" rx="38" ry="12" /><path d="M30 52 Q32 30 50 30 Q68 30 70 52" /><line x1="34" y1="72" x2="26" y2="88" /><line x1="66" y1="72" x2="74" y2="88" /></>, s, c);
export const ITrophy = (s = 90, c = YEL) => ic(<><path d="M30 16 H70 V40 A20 20 0 0 1 30 40 Z" /><path d="M30 24 H16 Q16 44 32 46M70 24 H84 Q84 44 68 46" /><line x1="50" y1="60" x2="50" y2="74" /><line x1="34" y1="84" x2="66" y2="84" /></>, s, c);

export const SectionNum: React.FC<{n: string; a: number; b: number; title: string; tc?: string; top?: number}> = ({n, a, b, title, tc = '#fff', top = 470}) => {
  const f = useCurrentFrame();
  const fa = F(a);
  const ring = lerp(f, fa, fa + 30, 0.6, 1.25);
  const ro = lerp(f, fa, fa + 30, 0.9, 0);
  return (
    <>
      <Pop a={a} b={b} from="zoom" style={{...C, top}}>
        <div style={{position: 'relative', minWidth: 340, height: 340, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...panel(), borderRadius: 50}}>
          <div style={{position: 'absolute', inset: -10, borderRadius: 60, border: `4px solid ${PINK}`, transform: `scale(${ring})`, opacity: ro}} />
          <Big size={210}>{n}</Big>
        </div>
      </Pop>
      <Pop a={a + 0.12} b={b} style={{...C, top: top + 390}}>
        <Big size={78} c={tc} glow={tc === '#fff' ? PINK : tc}>{title}</Big>
      </Pop>
    </>
  );
};

// flip-digit counter (like 2-0-2-1)
export const Digits: React.FC<{text: string; c?: string; size?: number}> = ({text, c = PINK, size = 170}) => (
  <div style={{display: 'flex', gap: 14}}>
    {text.split('').map((d, i) => (
      <div key={i} style={{width: size * 0.78, height: size * 1.15, ...panel(c), borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: 'rgba(0,0,0,0.5)'}} />
        <Big size={size} glow={c}>{d}</Big>
      </div>
    ))}
  </div>
);

// ---------- transitions ----------
export const Streak: React.FC<{at: number}> = ({at: t}) => {
  const f = useCurrentFrame();
  const a = F(t) - 8;
  if (f < a || f > a + 18) return null;
  const p = interpolate(f, [a, a + 18], [0, 1], {...cl, easing: IO});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -900 + p * 2900, top: -400, width: 260, height: 2800, transform: 'rotate(20deg)', background: `linear-gradient(90deg, transparent, ${PINK}cc, #fff, ${PINK}cc, transparent)`, filter: 'blur(14px)', opacity: 0.95}} />
    </AbsoluteFill>
  );
};
export const Flash: React.FC<{at: number}> = ({at: t}) => {
  const f = useCurrentFrame();
  const a = F(t);
  const o = interpolate(f, [a - 2, a, a + 10], [0, 0.35, 0], cl);
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};
export const glitchK = (f: number, list: number[]) => {
  let k = 0;
  for (const g of list) {
    const d = f - F(g);
    if (d < -3 || d > 11) continue;
    const env = d < 0 ? (d + 3) / 3 : d < 3 ? 1 : 1 - (d - 3) / 8;
    k = Math.max(k, env * (0.55 + 0.45 * rnd(Math.floor(f / 2) * 3.1 + g)));
  }
  return k;
};
export const GlitchDefs: React.FC<{k: number; seed: number; id: string}> = ({k, seed, id}) => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.000001 0.022" numOctaves={1} seed={seed} result="n" />
        <feComponentTransfer in="n" result="q">
          <feFuncR type="discrete" tableValues="0.5 0.5 0.15 0.5 0.85 0.5 0.5 0.3 0.5 0.7 0.5" />
          <feFuncG type="discrete" tableValues="0.5" />
          <feFuncA type="discrete" tableValues="1" />
        </feComponentTransfer>
        <feDisplacementMap in="SourceGraphic" in2="q" scale={90 * k} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feColorMatrix in="d" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={16 * k} result="ro" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
        <feOffset in="gb" dx={-16 * k} result="gbo" />
        <feBlend in="ro" in2="gbo" mode="screen" />
      </filter>
    </defs>
  </svg>
);

// ---------- subtitles ----------
export const makeSubs = (W: Wd[], END: number, colors: Record<string, string>) => {
  const HL: Record<number, string> = {};
  W.forEach((w, i) => {
    const k = w.w.toLowerCase().replace(/[^a-z0-9']/g, '');
    if (colors[k]) HL[i] = colors[k];
  });
  const out: {a: number; b: number; idx: number[]}[] = [];
  let cur: number[] = [];
  const flush = (end: number) => { if (cur.length) { out.push({a: W[cur[0]].t, b: end, idx: cur}); cur = []; } };
  W.forEach((w, i) => {
    if (cur.length && (cur.length >= 3 || w.t - W[i - 1].e > 0.28 || /[.,:?!]$/.test(W[i - 1].w))) flush(w.t);
    cur.push(i);
  });
  flush(END);
  for (let i = 0; i < out.length; i++) {
    const last = W[out[i].idx[out[i].idx.length - 1]];
    const nxt = i + 1 < out.length ? out[i + 1].a : END;
    out[i].b = Math.min(nxt, last.e + 0.35);
  }
  const Subs: React.FC = () => {
    const f = useCurrentFrame();
    const t = f / FPS;
    const ch = out.find((c) => t >= c.a - 0.02 && t < c.b);
    if (!ch) return null;
    return (
      <div style={{position: 'absolute', left: 60, right: 60, top: 1400, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px'}}>
        {ch.idx.map((i) => {
          const fa = F(W[i].t);
          const p = lerp(f, fa - 2, fa + 9, 0, 1);
          if (f < fa - 2) return <span key={i} style={{opacity: 0, fontFamily: H1, fontWeight: 900, fontSize: 84}}>{W[i].w}</span>;
          const c = HL[i] ?? '#fff';
          return (
            <span key={i} style={{fontFamily: H1, fontWeight: 900, fontSize: 84, color: c, opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 26}px) scale(${0.85 + 0.15 * p})`, WebkitTextStroke: '3px rgba(0,0,0,0.85)', paintOrder: 'stroke fill', textShadow: `0 6px 18px rgba(0,0,0,0.9)${c !== '#fff' ? `, 0 0 26px ${c}88` : ''}`, letterSpacing: -0.5}}>{W[i].w}</span>
          );
        })}
      </div>
    );
  };
  return Subs;
};

// ---------- sound ----------
const PEAK: Record<string, number> = {riser1: 1.8, riser2: 1.67, riserimp: 1.76, rrise: 1.15, metal: 1.67, bassrise: 0.74};
const G = GAINS as Record<string, number>;
export const SFX_MASTER = 0.18; // approved level (Short1 v3)
export const SfxLayer: React.FC<{list: Sfx[]}> = ({list}) => (
  <>
    {list.map((x, i) => {
      const pk = x.peak ?? PEAK[x.s] ?? 0;
      const st = F(x.t) - F(pk);
      return (
        <Sequence key={i} from={Math.max(0, st)} layout="none">
          <Audio src={staticFile(`s1/sfx/${x.s}.wav`)} volume={Math.min(1, (x.v ?? 0.6) * (G[x.s] ?? 1) * SFX_MASTER)} startFrom={st < 0 ? -st : 0} />
        </Sequence>
      );
    })}
  </>
);

// ---------- the whole short ----------
export const ShortFrame: React.FC<{shots: Shot[]; end: number; voice: string; sfx: Sfx[]; Subs: React.FC; streaks?: number[]; glitches?: number[]; id: string; children: React.ReactNode}> = ({shots, end, voice, sfx, Subs, streaks = [], glitches = [], id, children}) => {
  const f = useCurrentFrame();
  const gk = glitchK(f, glitches);
  const wrap: React.CSSProperties = gk > 0.02 ? {filter: `url(#${id})`, transform: `scale(${1 + 0.035 * gk}) translateX(${(rnd(Math.floor(f / 2)) - 0.5) * 14 * gk}px)`} : {};
  return (
    <AbsoluteFill style={{background: '#07030c'}}>
      <GlitchDefs k={gk} seed={Math.floor(f / 2) % 97} id={id} />
      <AbsoluteFill style={wrap}>
        {shots.map((s, i) => (
          <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)}>
            <ShotLayer s={s} />
          </Sequence>
        ))}
        {children}
      </AbsoluteFill>
      {shots.slice(1).map((s) => <Flash key={'f' + s.a} at={s.a} />)}
      {streaks.map((c) => <Streak key={'s' + c} at={c} />)}
      <Subs />
      <Audio src={staticFile(voice)} volume={1} />
      <Audio src={staticFile('music/bed.mp3')} volume={(fr) => interpolate(fr, [0, 20, F(end) - 40, F(end)], [0, 0.08, 0.08, 0], cl)} />
      <SfxLayer list={sfx} />
    </AbsoluteFill>
  );
};
