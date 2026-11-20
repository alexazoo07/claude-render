import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import WORDS from './s1words.json';
import WORDS_OLD from './s1words_old.json';
import GAINS from './s1gains.json';

export const S1FPS = 60;
const S1END_OLD = 59.6;
// map times authored on the first voice (old) onto the faster voice (new), word by word
const _O = (WORDS_OLD as {t: number}[]).map((w) => w.t);
const _N = (WORDS as {t: number; e: number}[]).map((w) => w.t);
export const S1END = Math.round(((WORDS as {e: number}[])[(WORDS as unknown[]).length - 1].e + 0.35) * 100) / 100;
const KO = [..._O, S1END_OLD];
const KN = [..._N, S1END];
const M = (t: number) => {
  if (t <= KO[0]) return t;
  for (let i = 0; i < KO.length - 1; i++) {
    if (t <= KO[i + 1]) {
      const a = KO[i], b = KO[i + 1];
      if (b - a < 1e-6) return KN[i + 1];
      return KN[i] + ((t - a) / (b - a)) * (KN[i + 1] - KN[i]);
    }
  }
  return KN[KN.length - 1] + (t - KO[KO.length - 1]);
};
const FR = (s: number) => Math.round(s * S1FPS); // raw seconds -> frames
const F = (s: number) => Math.round(M(s) * S1FPS); // authored (old) seconds -> frames
const EO = Easing.bezier(0.16, 1, 0.3, 1); // smooth expo-out, no overshoot
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const lerp = (f: number, a: number, b: number, v0: number, v1: number, e = EO) => interpolate(f, [a, b], [v0, v1], {...cl, easing: e});

const PINK = '#ff4fa3';
const PINK2 = '#ff8fcb';
const YEL = '#ffd23f';
const GRN = '#5dff8f';
const RED = '#ff4d5e';
const PANEL = 'rgba(16,8,26,0.82)';
const H1 = "'Rubik', 'Inter Display', sans-serif";
const LB = "'Inter', sans-serif";

// word timings
type Wd = {w: string; t: number; e: number};
const W = WORDS as Wd[];
const T = (i: number) => W[i].t;

// ---------- background shots ----------
type Shot = {src: string; a: number; b: number; off?: number; dim?: number};
const SHOTS: Shot[] = [
  {src: 'hook', a: 0, b: 5.52, dim: 0.55},
  {src: 'walk', a: 5.52, b: 8.77, dim: 0.5},
  {src: 'beach', a: 8.77, b: 13.72, dim: 0.45},
  {src: 'night', a: 13.72, b: 18.32, dim: 0.5},
  {src: 'menu', a: 18.32, b: 23.08, dim: 0.35},
  {src: 'drive2', a: 23.08, b: 28.16, dim: 0.5},
  {src: 'glitch', a: 28.16, b: 30.32, dim: 0.6},
  {src: 'seat', a: 30.32, b: 33.32, dim: 0.5},
  {src: 'phone', a: 33.32, b: 35.96, dim: 0.5},
  {src: 'shoot', a: 35.96, b: 39.76, dim: 0.62},
  {src: 'back', a: 39.76, b: 43.88, dim: 0.42},
  {src: 'boat', a: 43.88, b: 51.0, dim: 0.55},
  {src: 'gps', a: 51.0, b: 55.6, dim: 0.42},
  {src: 'outro', a: 55.6, b: S1END_OLD, dim: 0.5},
];

const ShotLayer: React.FC<{s: Shot}> = ({s}) => {
  const f = useCurrentFrame();
  const len = F(s.b) - F(s.a);
  const zin = lerp(f, 0, 16, 1.22, 1.0);
  const push = interpolate(f, [0, len], [1.06, 1.14], cl);
  const blur = lerp(f, 0, 14, 16, 0);
  const d = s.dim ?? 0.5;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zin * push})`, filter: `blur(${blur}px) saturate(1.15) contrast(1.06) brightness(${0.4 + d})`}}>
        <OffthreadVideo src={staticFile(`s1/v/${s.src}.mp4`)} muted startFrom={FR(s.off ?? 0)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* purple neon grade */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,6,60,0.55) 0%, rgba(70,10,80,0.25) 45%, rgba(10,4,20,0.75) 100%)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(8,2,16,0.75) 100%)'}} />
      {s.src === 'night' && <div style={{position: 'absolute', left: 0, right: 0, top: 1560, bottom: 0, background: 'linear-gradient(180deg, rgba(7,3,12,0) 0%, rgba(7,3,12,0.97) 30%, #07030c 100%)'}} />}
    </AbsoluteFill>
  );
};

// ---------- generic animated wrapper ----------
const Pop: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'down' | 'left' | 'right' | 'zoom'; dur?: number}> = ({a, b, children, style, from = 'up', dur = 16}) => {
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

const panel = (c = PINK): React.CSSProperties => ({
  background: PANEL,
  border: `3px solid ${c}`,
  borderRadius: 26,
  boxShadow: `0 0 34px ${c}88, inset 0 0 26px ${c}33`,
});
const Tag: React.FC<{children: React.ReactNode; c?: string; size?: number}> = ({children, c = PINK, size = 30}) => (
  <div style={{display: 'inline-block', padding: '10px 26px', borderRadius: 999, border: `2.5px solid ${c}`, background: 'rgba(12,6,20,0.85)', color: '#fff', fontFamily: LB, fontWeight: 800, fontSize: size, letterSpacing: 5, textTransform: 'uppercase', boxShadow: `0 0 22px ${c}88`}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; c?: string; glow?: string}> = ({children, size = 120, c = '#fff', glow = PINK}) => (
  <div style={{fontFamily: H1, fontWeight: 900, fontSize: size, color: c, lineHeight: 1, letterSpacing: -1, textShadow: `0 0 28px ${glow}aa, 0 6px 0 rgba(0,0,0,0.35)`, whiteSpace: 'nowrap'}}>{children}</div>
);
const Lab: React.FC<{children: React.ReactNode; c?: string; size?: number}> = ({children, c = PINK2, size = 26}) => (
  <div style={{fontFamily: LB, fontWeight: 800, fontSize: size, letterSpacing: 8, color: c, textTransform: 'uppercase'}}>{children}</div>
);
const C: React.CSSProperties = {left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'};

// ---------- icons ----------
const ic = (d: React.ReactNode, s = 90, c = '#fff', sw = 7) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IClock: React.FC<{s?: number; t: number}> = ({s = 150, t}) => ic(<><circle cx="50" cy="50" r="40" /><line x1="50" y1="50" x2={50 + 26 * Math.sin(t)} y2={50 - 26 * Math.cos(t)} /><line x1="50" y1="50" x2={50 + 18 * Math.sin(t / 12)} y2={50 - 18 * Math.cos(t / 12)} /><circle cx="50" cy="50" r="3" fill="#fff" /></>, s);
const IPower = (s = 110, c = '#fff') => ic(<><path d="M32 30 A28 28 0 1 0 68 30" /><line x1="50" y1="16" x2="50" y2="50" /></>, s, c);
const IReload = (s = 90, c = '#fff') => ic(<><path d="M78 50 A28 28 0 1 1 66 27" /><polyline points="68,12 68,30 50,30" /></>, s, c);
const IGear = (s = 70, c = '#fff') => ic(<><circle cx="50" cy="50" r="14" /><path d="M50 12v12M50 76v12M12 50h12M76 50h12M23 23l9 9M68 68l9 9M23 77l9-9M68 32l9-9" /></>, s, c);
const ICar = (s = 70, c = '#fff') => ic(<><path d="M18 62 L26 38 Q28 32 35 32 H65 Q72 32 74 38 L82 62 Z" /><rect x="14" y="60" width="72" height="16" rx="5" /><circle cx="30" cy="80" r="5" /><circle cx="70" cy="80" r="5" /></>, s, c);
const IPhone = (s = 70, c = '#fff') => ic(<><rect x="30" y="12" width="40" height="76" rx="8" /><line x1="45" y1="78" x2="55" y2="78" /></>, s, c);
const IPad = (s = 70, c = '#fff') => ic(<><path d="M20 40 Q22 28 34 28 H66 Q78 28 80 40 L86 66 Q88 78 76 76 L66 66 H34 L24 76 Q12 78 14 66 Z" /><line x1="32" y1="44" x2="32" y2="56" /><line x1="26" y1="50" x2="38" y2="50" /><circle cx="66" cy="46" r="3" /><circle cx="72" cy="54" r="3" /></>, s, c);
const IEye = (s = 90, c = '#fff') => ic(<><path d="M10 50 Q50 14 90 50 Q50 86 10 50 Z" /><circle cx="50" cy="50" r="12" /></>, s, c);
const IBug = (s = 70, c = GRN) => ic(<><ellipse cx="50" cy="56" rx="20" ry="26" /><line x1="50" y1="32" x2="50" y2="82" /><path d="M30 46H16M30 62H14M70 46h14M70 62h16M40 30l-8-12M60 30l8-12" /></>, s, c);
const IPin = (s = 90, c = PINK) => ic(<><path d="M50 90 C30 64 22 52 22 38 A28 28 0 0 1 78 38 C78 52 70 64 50 90 Z" fill={c + '55'} /><circle cx="50" cy="38" r="10" fill="#fff" stroke="none" /></>, s, c);
const IBoat = (s = 90, c = '#fff') => ic(<><path d="M12 60 H88 L76 80 H24 Z" /><path d="M30 60 L38 40 H66 L74 60" /><line x1="50" y1="40" x2="50" y2="24" /></>, s, c);
const ICheck = (s = 60, c = GRN) => ic(<polyline points="22,52 42,70 78,30" />, s, c, 10);
const IX = (s = 60, c = RED) => ic(<><line x1="26" y1="26" x2="74" y2="74" /><line x1="74" y1="26" x2="26" y2="74" /></>, s, c, 10);
const IUser = (s = 90, c = '#fff') => ic(<><circle cx="50" cy="36" r="16" /><path d="M20 84 Q22 58 50 58 Q78 58 80 84" /></>, s, c);
const IBack = (s = 90, c = '#fff') => ic(<><polyline points="40,26 16,50 40,74" /><path d="M16 50 H64 Q84 50 84 70" /></>, s, c);
const INav = (s = 60, c = '#fff') => ic(<polygon points="50,12 78,86 50,70 22,86" fill={c} />, s, c, 4);

// ---------- big section number ----------
const SectionNum: React.FC<{n: string; a: number; b: number; title: string; tc?: string}> = ({n, a, b, title, tc = '#fff'}) => {
  const f = useCurrentFrame();
  const fa = F(a);
  const ring = lerp(f, fa, fa + 30, 0.6, 1.25);
  const ro = lerp(f, fa, fa + 30, 0.9, 0);
  return (
    <>
      <Pop a={a} b={b} from="zoom" style={{...C, top: 470}}>
        <div style={{position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', ...panel(), borderRadius: 50}}>
          <div style={{position: 'absolute', inset: -10, borderRadius: 60, border: `4px solid ${PINK}`, transform: `scale(${ring})`, opacity: ro}} />
          <Big size={210}>{n}</Big>
        </div>
      </Pop>
      <Pop a={a + 0.12} b={b} style={{...C, top: 860}}>
        <Big size={78} c={tc} glow={tc === '#fff' ? PINK : tc}>{title}</Big>
      </Pop>
    </>
  );
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pop a={0} b={5.3} from="down" style={{...C, top: 150}}>
        <Img src={staticFile('gtavi_logo.png')} style={{width: 250, filter: `drop-shadow(0 0 30px ${PINK})`}} />
      </Pop>
      <Pop a={0.05} b={3.0} from="zoom" style={{...C, top: 560}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <div style={{width: 200, height: 200, ...panel(), borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Big size={150}>3</Big></div>
          <Big size={110}>THINGS</Big>
        </div>
      </Pop>
      <Pop a={0.75} b={3.0} style={{...C, top: 820}}><Tag c={YEL}>you need to know</Tag></Pop>
      <Pop a={1.68} b={3.0} style={{...C, top: 930}}><Tag>before playing gta 6</Tag></Pop>
      {/* save you hours */}
      <Pop a={4.15} b={5.35} from="zoom" style={{...C, top: 560}}>
        <div style={{...panel(), borderRadius: 999, padding: 26}}><IClock t={(f - F(4.15)) * 0.35} /></div>
      </Pop>
      <Pop a={4.79} b={5.35} style={{...C, top: 800}}><Big size={110} c={YEL} glow={YEL}>HOURS</Big></Pop>
    </>
  );
};

const AutoSave: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = F(7.4);
  const strike = lerp(f, t0 + 18, t0 + 34, 0, 1);
  const spin = (f - t0) * 6;
  return (
    <>
      <SectionNum n="01" a={5.52} b={7.25} title="DON'T TRUST" tc={RED} />
      <Pop a={7.4} b={8.6} from="zoom" style={{...C, top: 600}}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, padding: '34px 50px', ...panel()}}>
          <div style={{transform: `rotate(${spin}deg)`}}>{IReload(100)}</div>
          <Big size={92}>AUTOSAVE</Big>
          <div style={{position: 'absolute', left: 30, top: '50%', height: 10, width: `calc(${strike * 100}% - 60px)`, background: RED, borderRadius: 6, boxShadow: `0 0 18px ${RED}`}} />
        </div>
      </Pop>
      <Pop a={7.75} b={8.6} from="zoom" style={{...C, top: 830}}>
        <div style={{width: 110, height: 110, borderRadius: 999, background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${RED}`}}>{IX(70, '#fff')}</div>
      </Pop>
    </>
  );
};

const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const a = 8.77, b = 13.6;
  // player dot travels along the track
  const nodes = [
    {p: 0.18, label: 'MISSION', ok: true, t: 10.88},
    {p: 0.5, label: 'CHECKPOINT', ok: true, t: 12.15},
    {p: 0.86, label: 'EXPLORING', ok: false, t: 12.98},
  ];
  // the dot arrives at the exact centre of each node on the frame its tick/cross appears
  const x = interpolate(f, [F(9.9), ...nodes.map((n) => F(n.t))], [0, ...nodes.map((n) => n.p)], {...cl, easing: Easing.bezier(0.45, 0, 0.55, 1)});
  const Wd = 860;
  return (
    <>
      <Pop a={a} b={b} from="down" style={{...C, top: 300}}><Lab>how gta 6 saves</Lab></Pop>
      <Pop a={9.55} b={b} style={{...C, top: 470}}>
        <div style={{position: 'relative', width: Wd + 80, height: 430, ...panel(), padding: 40}}>
          <div style={{position: 'absolute', left: 40, right: 40, top: 200, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.15)'}} />
          <div style={{position: 'absolute', left: 40, top: 200, height: 10, borderRadius: 6, width: Wd * x, background: `linear-gradient(90deg, ${PINK}, ${PINK2})`, boxShadow: `0 0 16px ${PINK}`}} />
          <div style={{position: 'absolute', left: 40 + Wd * x - 22, top: 183, width: 44, height: 44, borderRadius: 999, background: '#fff', boxShadow: `0 0 24px #fff, 0 0 40px ${PINK}`}} />
          {nodes.map((n, i) => {
            const on = lerp(f, F(n.t), F(n.t) + 8, 0, 1);
            const hit = f >= F(n.t);
            const c = n.ok ? GRN : RED;
            return (
              <div key={i} style={{position: 'absolute', left: 40 + Wd * n.p - 50, top: 155, width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: 100, height: 100, borderRadius: 999, background: hit ? '#150a22' : 'transparent', border: `4px solid ${hit ? c : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: hit ? `0 0 ${26 + 30 * (1 - on)}px ${c}` : 'none', transform: `scale(${hit ? 1 + 0.12 * (1 - on) : 1})`}}>
                  <div style={{opacity: hit ? 1 : 0, transform: `scale(${0.55 + 0.45 * on})`}}>{n.ok ? ICheck(56) : IX(56)}</div>
                </div>
                <div style={{marginTop: 22, opacity: 0.4 + 0.6 * on, whiteSpace: 'nowrap'}}><Lab c="#fff" size={22}>{n.label}</Lab></div>
                <div style={{marginTop: 8, opacity: on, whiteSpace: 'nowrap'}}><Lab c={c} size={20}>{n.ok ? 'saved' : 'not saved'}</Lab></div>
              </div>
            );
          })}
        </div>
      </Pop>
    </>
  );
};

const Streamer: React.FC = () => {
  const f = useCurrentFrame();
  const off = F(15.21);
  const scrOff = lerp(f, off, off + 10, 0, 1);
  const hrs = Math.floor(lerp(f, F(16.55), F(17.2), 0, 11, Easing.out(Easing.cubic)));
  const drain = lerp(f, F(17.54), F(18.2), 1, 0, IO);
  const press = f > F(14.83) && f < F(14.83) + 8 ? 0.9 : 1;
  return (
    <>
      <Pop a={14.03} b={15.1} from="left" style={{left: 90, top: 330}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '22px 34px', ...panel()}}>
          <div style={{width: 110, height: 110, borderRadius: 999, border: `3px solid ${PINK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1d0f2c'}}>{IUser(80)}</div>
          <div>
            <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
              <div style={{background: RED, color: '#fff', fontFamily: LB, fontWeight: 800, fontSize: 22, padding: '4px 12px', borderRadius: 8, letterSpacing: 3}}>● LIVE</div>
              <Lab c={PINK2} size={22}>streamer</Lab>
            </div>
            <Big size={56}>11H STREAM</Big>
          </div>
        </div>
      </Pop>
      <Pop a={14.55} b={16.0} from="zoom" style={{...C, top: 620}}>
        <div style={{width: 230, height: 230, borderRadius: 999, ...panel(press < 1 ? RED : PINK), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`}}>{IPower(130, press < 1 ? RED : '#fff')}</div>
      </Pop>
      <Pop a={15.21} b={16.0} style={{...C, top: 900}}>
        <div style={{width: 520, height: 230, ...panel(), display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 14, borderRadius: 14, background: `linear-gradient(135deg, #4b1d6b, #1a0b2a)`, opacity: 1 - scrOff}} />
          <div style={{position: 'absolute', inset: 14, borderRadius: 14, background: '#000', opacity: scrOff}} />
          <div style={{position: 'relative', opacity: scrOff}}><Lab c="#888" size={26}>no signal</Lab></div>
        </div>
      </Pop>
      <Pop a={16.17} b={18.2} from="zoom" style={{...C, top: 480}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
          <Lab c={RED}>progress lost</Lab>
          <div style={{display: 'flex', gap: 14}}>
            {String(hrs).padStart(2, '0').split('').map((d, i) => (
              <div key={i} style={{width: 190, height: 250, ...panel(RED), display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Big size={190} glow={RED}>{d}</Big></div>
            ))}
          </div>
          <Big size={96} c={RED} glow={RED}>HOURS</Big>
        </div>
      </Pop>
      <Pop a={17.54} b={18.2} style={{...C, top: 1100}}>
        <div style={{width: 760, height: 46, borderRadius: 999, border: `3px solid ${RED}`, padding: 6, background: PANEL}}>
          <div style={{height: '100%', width: `${drain * 100}%`, borderRadius: 999, background: `linear-gradient(90deg, ${RED}, ${PINK})`, boxShadow: `0 0 16px ${RED}`}} />
        </div>
      </Pop>
    </>
  );
};

const Menu: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['MAP', 'BRIEF', 'STATS', 'GAME', 'SETTINGS'];
  const sel = f < F(21.19) ? 0 : 3;
  const selY = lerp(f, F(21.0), F(21.19), 0, 3 * 96, IO);
  const sub = lerp(f, F(21.61), F(21.9), 0, 1);
  const saveHi = f >= F(22.08);
  const saved = lerp(f, F(22.43), F(22.7), 0, 1);
  return (
    <>
      <Pop a={19.69} b={22.95} from="down" style={{...C, top: 290}}><Tag c={YEL}>⏸ pause</Tag></Pop>
      <Pop a={19.69} b={22.95} style={{left: 90, top: 420}}>
        <div style={{width: 900, height: 640, ...panel(), position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 30, top: 40 + selY, width: 380, height: 84, borderRadius: 16, background: `${PINK}33`, border: `2.5px solid ${PINK}`, boxShadow: `0 0 20px ${PINK}88`}} />
          {items.map((it, i) => (
            <div key={i} style={{position: 'absolute', left: 64, top: 62 + i * 96}}><Lab c={i === sel ? '#fff' : 'rgba(255,255,255,0.55)'} size={34}>{it}</Lab></div>
          ))}
          <div style={{position: 'absolute', left: 440, top: 30, bottom: 30, width: 3, background: 'rgba(255,255,255,0.15)', opacity: sub}} />
          <div style={{position: 'absolute', left: 470, top: 40, opacity: sub, transform: `translateX(${(1 - sub) * 40}px)`}}>
            {['SAVE GAME', 'LOAD GAME', 'NEW GAME'].map((s, i) => (
              <div key={i} style={{width: 390, height: 84, marginBottom: 12, borderRadius: 16, display: 'flex', alignItems: 'center', paddingLeft: 28, background: i === 0 && saveHi ? `${GRN}22` : 'transparent', border: i === 0 && saveHi ? `2.5px solid ${GRN}` : '2.5px solid transparent', boxShadow: i === 0 && saveHi ? `0 0 20px ${GRN}88` : 'none'}}>
                <Lab c={i === 0 && saveHi ? '#fff' : 'rgba(255,255,255,0.5)'} size={30}>{s}</Lab>
              </div>
            ))}
            <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 14, opacity: saved, transform: `scale(${0.8 + 0.2 * saved})`}}>{ICheck(64)}<Big size={58} c={GRN} glow={GRN}>SAVED</Big></div>
          </div>
        </div>
      </Pop>
      {/* "before you quit" */}
      <Pop a={18.32} b={19.55} from="zoom" style={{...C, top: 600}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '30px 46px', ...panel(YEL)}}>{IPower(90, YEL)}<Big size={80}>BEFORE YOU QUIT</Big></div>
      </Pop>
    </>
  );
};

const NoFP: React.FC = () => {
  const f = useCurrentFrame();
  const knob = lerp(f, F(25.6), F(25.9), 1, 0, IO);
  return (
    <>
      <SectionNum n="02" a={23.08} b={25.2} title="FIRST PERSON?" tc={YEL} />
      <Pop a={25.43} b={28.0} from="zoom" style={{...C, top: 520}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, padding: '40px 54px', ...panel()}}>
          {IEye(120)}
          <div>
            <Lab c={PINK2}>camera</Lab>
            <Big size={74}>FIRST PERSON</Big>
          </div>
          <div style={{width: 150, height: 80, borderRadius: 999, background: knob > 0.5 ? `${GRN}55` : `${RED}55`, border: `3px solid ${knob > 0.5 ? GRN : RED}`, position: 'relative'}}>
            <div style={{position: 'absolute', top: 8, left: 8 + knob * 70, width: 58, height: 58, borderRadius: 999, background: '#fff'}} />
          </div>
        </div>
      </Pop>
      <Pop a={26.4} b={28.0} style={{...C, top: 800}}><Tag c={RED} size={34}>not available</Tag></Pop>
      <Pop a={27.2} b={28.0} from="zoom" style={{...C, top: 930}}><Big size={90} c={YEL} glow={YEL}>*OFFICIALLY</Big></Pop>
    </>
  );
};

const GlitchFound: React.FC = () => (
  <>
    <Pop a={28.48} b={30.2} from="left" style={{left: 110, top: 420}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 40px', ...panel(GRN)}}>
        <div style={{width: 100, height: 100, borderRadius: 999, border: `3px solid ${GRN}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{IUser(70)}</div>
        <div>
          <Lab c={GRN} size={22}>players</Lab>
          <Big size={60}>FOUND IT</Big>
        </div>
      </div>
    </Pop>
    <Pop a={29.64} b={30.2} from="zoom" style={{...C, top: 700}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '34px 54px', ...panel(GRN)}}>{IBug(110)}<Big size={110} c={GRN} glow={GRN}>GLITCH</Big></div>
    </Pop>
  </>
);

const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const st = [
    {t: 30.32, i: IGear(64), s: 'Change a controller setting'},
    {t: 32.01, i: ICar(64), s: "Get in the driver's seat"},
    {t: 33.32, i: IPhone(64), s: 'Open your phone'},
    {t: 34.54, i: IPad(64), s: 'Spam the right buttons'},
  ];
  const spam = f > F(34.54) ? Math.sin((f - F(34.54)) * 1.4) * 0.5 + 0.5 : 0;
  return (
    <Pop a={30.32} b={35.85} from="down" style={{left: 70, right: 70, top: 260}}>
      <div style={{...panel(), padding: '30px 34px'}}>
        <Lab>the glitch · steps</Lab>
        {st.map((s, i) => {
          const p = lerp(f, F(s.t), F(s.t) + 16, 0, 1);
          const active = f >= F(s.t) && (i === st.length - 1 || f < F(st[i + 1].t));
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 22, opacity: p * (active ? 1 : 0.55), transform: `translateX(${(1 - p) * 60}px)`}}>
              <div style={{width: 96, height: 96, flexShrink: 0, borderRadius: 22, border: `3px solid ${active ? PINK : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${PINK}2a` : 'transparent', transform: i === 3 && active ? `scale(${1 + spam * 0.08})` : 'none', boxShadow: active ? `0 0 22px ${PINK}` : 'none'}}>{s.i}</div>
              <div style={{fontFamily: H1, fontWeight: 900, fontSize: 52, color: '#fff', lineHeight: 1.05}}><span style={{color: active ? YEL : '#ffffff99'}}>{i + 1}.</span> {s.s}</div>
            </div>
          );
        })}
      </div>
    </Pop>
  );
};

const POV: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(36.36);
  const p = lerp(f, a, a + 18, 0, 1);
  const q = lerp(f, F(39.6), F(39.85), 0, 1, IO);
  const o = p * (1 - q);
  const inset = 120 - 50 * p;
  const corner = (r: number) => (
    <div style={{position: 'absolute', width: 120, height: 120, border: `8px solid ${PINK}`, borderRadius: 18, ...(r === 0 ? {left: 0, top: 0, borderRight: 'none', borderBottom: 'none'} : r === 1 ? {right: 0, top: 0, borderLeft: 'none', borderBottom: 'none'} : r === 2 ? {left: 0, bottom: 0, borderRight: 'none', borderTop: 'none'} : {right: 0, bottom: 0, borderLeft: 'none', borderTop: 'none'}), boxShadow: `0 0 18px ${PINK}`}} />
  );
  const rec = Math.floor(f / 30) % 2 === 0;
  return (
    <>
      <AbsoluteFill style={{opacity: o}}>
        <div style={{position: 'absolute', left: inset, right: inset, top: inset + 120, bottom: inset + 540}}>
          {[0, 1, 2, 3].map((r) => <React.Fragment key={r}>{corner(r)}</React.Fragment>)}
          <div style={{position: 'absolute', left: 40, top: 30, display: 'flex', alignItems: 'center', gap: 12}}><div style={{width: 22, height: 22, borderRadius: 99, background: RED, opacity: rec ? 1 : 0.2}} /><Lab c="#fff" size={24}>pov · first person</Lab></div>
          <div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * 90}deg)`}}>
            <svg width="160" height="160" viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="4"><circle cx="50" cy="50" r="30" /><line x1="50" y1="6" x2="50" y2="28" /><line x1="50" y1="72" x2="50" y2="94" /><line x1="6" y1="50" x2="28" y2="50" /><line x1="72" y1="50" x2="94" y2="50" /><circle cx="50" cy="50" r="3" fill={PINK} stroke="none" /></svg>
          </div>
        </div>
      </AbsoluteFill>
      <Pop a={38.39} b={39.6} from="zoom" style={{...C, top: 1080}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 36px', ...panel(GRN)}}>{ICheck(54)}<Big size={54}>WEAPON ANIMATIONS</Big></div>
      </Pop>
    </>
  );
};

const NoBack: React.FC = () => {
  const f = useCurrentFrame();
  const spin = Math.max(0, f - F(42.39)) * 7;
  return (
    <>
      <Pop a={39.76} b={41.7} from="zoom" style={{...C, top: 520}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '40px 70px', ...panel(RED)}}>
          <Lab c={RED}>⚠ warning</Lab>
          <div style={{position: 'relative'}}>{IBack(150)}<div style={{position: 'absolute', left: -10, right: -10, top: '50%', height: 10, background: RED, borderRadius: 6, transform: `rotate(-35deg) scaleX(${lerp(f, F(40.55), F(40.8), 0, 1)})`, boxShadow: `0 0 18px ${RED}`}} /></div>
          <Big size={84} c="#fff" glow={RED}>NO GOING BACK</Big>
        </div>
      </Pop>
      <Pop a={41.8} b={43.75} from="zoom" style={{...C, top: 560}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, padding: '40px 56px', ...panel(GRN)}}>
          <div style={{transform: `rotate(${spin}deg)`}}>{IReload(120, GRN)}</div>
          <div>
            <Lab c={GRN}>unless you</Lab>
            <Big size={84}>RELOAD SAVE</Big>
          </div>
        </div>
      </Pop>
    </>
  );
};

const Boat: React.FC = () => {
  const f = useCurrentFrame();
  const line = lerp(f, F(46.23), F(46.6), 0, 1);
  return (
    <>
      <SectionNum n="03" a={43.88} b={45.4} title="THE BOAT" tc={YEL} />
      <Pop a={45.56} b={48.3} from="down" style={{left: 0, right: 0, top: 300, height: 700}}>
        <div style={{position: 'absolute', left: 140, top: 40, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 30px', ...panel()}}>{IPin(80)}<div><Lab c={PINK2} size={20}>location</Lab><Big size={48}>JASON'S SAFE HOUSE</Big></div></div>
        <svg width="1080" height="700" style={{position: 'absolute', left: 0, top: 0}}>
          <line x1="260" y1="170" x2={260 + 300 * line} y2={170 + 260 * line} stroke={PINK} strokeWidth="5" strokeDasharray="14 12" />
          <circle cx={260 + 300 * line} cy={170 + 260 * line} r="14" fill={PINK} opacity={line} />
        </svg>
        <div style={{position: 'absolute', left: 470, top: 430, opacity: lerp(f, F(46.6), F(46.9), 0, 1), display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', ...panel(YEL)}}>{IBoat(70, YEL)}<Lab c="#fff" size={26}>parked outside</Lab></div>
      </Pop>
      <Pop a={47.59} b={48.3} from="zoom" style={{...C, top: 1060}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 34px', ...panel(YEL)}}>{IBoat(70, YEL)}<Big size={74} c={YEL} glow={YEL}>MARQUIS</Big></div>
      </Pop>
    </>
  );
};

const Same: React.FC = () => {
  const f = useCurrentFrame();
  const eq = lerp(f, F(50.15), F(50.4), 0, 1);
  const card = (t: string, s: string, c: string) => (
    <div style={{width: 400, height: 470, ...panel(c), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
      {IBoat(150, '#fff')}
      <Big size={68} c={c} glow={c}>{t}</Big>
      <Lab c="#fff" size={24}>{s}</Lab>
    </div>
  );
  return (
    <>
      <Pop a={48.44} b={50.9} from="down" style={{...C, top: 300}}><Tag c={YEL}>same boat?</Tag></Pop>
      <Pop a={49.23} b={50.9} from="left" style={{left: 70, top: 440}}>{card('GTA V', "michael's boat", GRN)}</Pop>
      <Pop a={48.95} b={50.9} from="right" style={{right: 70, top: 440}}>{card('GTA VI', 'outside the safe house', PINK)}</Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, display: 'flex', justifyContent: 'center', opacity: eq * lerp(f, F(50.9), F(51.1), 1, 0)}}>
        <div style={{width: 110, height: 110, borderRadius: 999, background: YEL, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${YEL}`, transform: `scale(${0.6 + 0.4 * eq})`}}><Big size={84} c="#140a20" glow="#000">=</Big></div>
      </div>
    </>
  );
};

const LosSantosMap: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 600 600" style={{position: 'absolute', inset: 0}}>
    <rect width="600" height="600" fill="#0f1c2b" />
    <path d="M0 600 L0 360 Q80 300 120 330 Q170 250 260 270 Q320 200 400 230 Q470 150 600 170 L600 600 Z" fill="#1f3b2a" />
    <path d="M60 600 L140 380 L300 420 L420 330 L560 380 L600 600 Z" fill="#2a2f3a" />
    {Array.from({length: 14}).map((_, i) => <line key={i} x1={80 + i * 38} y1={380} x2={40 + i * 42} y2={600} stroke="#4a5568" strokeWidth="3" />)}
    {Array.from({length: 7}).map((_, i) => <line key={'h' + i} x1={60} y1={420 + i * 28} x2={600} y2={400 + i * 30} stroke="#4a5568" strokeWidth="3" />)}
    <path d="M100 600 Q260 470 330 360 Q380 280 520 240" stroke="#ffcc66" strokeWidth="7" fill="none" />
    <text x="300" y="130" fill="#fff" fontFamily="Inter" fontWeight="800" fontSize="44" textAnchor="middle" letterSpacing="6">LOS SANTOS</text>
  </svg>
);

const GPS: React.FC = () => {
  const f = useCurrentFrame();
  const sw = F(54.12);
  const swp = lerp(f, sw, sw + 10, 0, 1);
  const jit = f >= sw && f < sw + 10 ? ((f * 37) % 11) - 5 : 0;
  const xOn = lerp(f, F(52.55), F(52.8), 0, 1);
  const pan = interpolate(f, [F(51.7), F(54.1)], [0, -80], cl);
  return (
    <>
      <Pop a={51.24} b={55.45} from="down" style={{...C, top: 280}}><Tag>boat gps</Tag></Pop>
      <Pop a={51.7} b={55.45} from="zoom" style={{...C, top: 400}}>
        <div style={{width: 760, height: 760, ...panel(swp > 0.5 ? GRN : PINK), borderRadius: 46, padding: 22, position: 'relative'}}>
          <div style={{position: 'absolute', inset: 22, borderRadius: 30, overflow: 'hidden', transform: `translateX(${jit}px)`}}>
            <Img src={staticFile('s1/leonida.jpg')} style={{position: 'absolute', width: '115%', left: -40, top: pan - 60, opacity: 1 - swp, filter: 'saturate(1.2) brightness(0.9)'}} />
            <div style={{position: 'absolute', inset: 0, opacity: swp}}><LosSantosMap /></div>
            <div style={{position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%,-50%)'}}>{INav(70, swp > 0.5 ? GRN : PINK)}</div>
            {f >= sw - 2 && f < sw + 10 && <div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, rgba(255,79,163,0.35) 0 6px, transparent 6px 22px)`, mixBlendMode: 'screen'}} />}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: -40, display: 'flex', justifyContent: 'center'}}>
            {swp < 0.5 ? (
              <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', ...panel(RED), opacity: xOn}}>{IX(50)}<Big size={58} c="#fff" glow={RED}>LEONIDA</Big></div>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', ...panel(GRN)}}>{ICheck(50)}<Big size={58} c={GRN} glow={GRN}>LOS SANTOS</Big></div>
            )}
          </div>
        </div>
      </Pop>
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['AUTOSAVE', 'FIRST PERSON', "MICHAEL'S BOAT"];
  const click = F(57.6);
  const pressed = f >= click && f < click + 8;
  const followed = f >= click + 4;
  return (
    <>
      <Pop a={55.6} b={57.2} from="down" style={{left: 110, right: 110, top: 360}}>
        <div style={{...panel(), padding: '24px 34px'}}>
          <Lab>which one did you know?</Lab>
          {items.map((it, i) => {
            const on = lerp(f, F(56.1 + i * 0.25), F(56.1 + i * 0.25) + 10, 0, 1);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 22}}>
                <div style={{width: 70, height: 70, borderRadius: 16, border: `3px solid ${on > 0.5 ? GRN : 'rgba(255,255,255,0.4)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on > 0.5 ? `${GRN}22` : 'transparent'}}><div style={{opacity: on, transform: `scale(${0.5 + 0.5 * on})`}}>{ICheck(48)}</div></div>
                <Big size={58}><span style={{color: YEL}}>{i + 1}.</span> {it}</Big>
              </div>
            );
          })}
        </div>
      </Pop>
      <Pop a={57.28} b={59.4} from="zoom" style={{...C, top: 600}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <Img src={staticFile('gtavi_logo.png')} style={{width: 210, filter: `drop-shadow(0 0 24px ${PINK})`}} />
          <div style={{transform: `scale(${pressed ? 0.92 : 1})`, padding: '28px 70px', borderRadius: 999, background: followed ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 34px ${PINK}`, display: 'flex', alignItems: 'center', gap: 16}}>
            <Big size={70} glow="#000">{followed ? '✓ FOLLOWING' : '+ FOLLOW'}</Big>
          </div>
          <Lab c={PINK2}>more gta 6 secrets</Lab>
        </div>
      </Pop>
    </>
  );
};

// ---------- transitions ----------
const Streak: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const a = F(at) - 8;
  if (f < a || f > a + 18) return null;
  const p = interpolate(f, [a, a + 18], [0, 1], {...cl, easing: IO});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -900 + p * 2900, top: -400, width: 260, height: 2800, transform: 'rotate(20deg)', background: `linear-gradient(90deg, transparent, ${PINK}cc, #fff, ${PINK}cc, transparent)`, filter: 'blur(14px)', opacity: 0.95}} />
    </AbsoluteFill>
  );
};
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
// clean digital glitch: horizontal slice tearing + RGB split, applied to the picture itself (no overlay)
const glitchK = (f: number) => {
  let k = 0;
  for (const g of GLITCHES) {
    const d = f - F(g);
    if (d < -3 || d > 11) continue;
    const env = d < 0 ? (d + 3) / 3 : d < 3 ? 1 : 1 - (d - 3) / 8;
    const step = Math.floor(f / 2); // change slices every 2 frames for a stepped, digital feel
    k = Math.max(k, env * (0.55 + 0.45 * rnd(step * 3.1 + g)));
  }
  return k;
};
const GlitchDefs: React.FC<{k: number; seed: number}> = ({k, seed}) => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <defs>
      <filter id="s1glx" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
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
const Flash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const a = F(at);
  const o = interpolate(f, [a - 2, a, a + 10], [0, 0.35, 0], cl);
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};

// ---------- subtitles ----------
const HL: Record<number, string> = {};
const mark = (from: number, to: number, c: string) => { for (let i = from; i <= to; i++) HL[i] = c; };
// indices into W (computed from the script order)
W.forEach((w, i) => {
  const k = w.w.toLowerCase().replace(/[^a-z0-9']/g, '');
  if (['need', 'hours', 'autosave', 'eleven', 'glitch', 'marquis', 'michael', 'gps', 'secrets'].includes(k)) HL[i] = YEL;
  if (['lost', 'no', 'not', "don't", 'officially'].includes(k)) HL[i] = RED;
  if (['first', 'person', 'weapon', 'animations', 'santos', 'los', 'save', 'saves'].includes(k)) HL[i] = GRN;
  if (['gta', '6', '6.', '5', '5.', 'leonida', 'ps5'].includes(k)) HL[i] = PINK2;
});
type Chunk = {a: number; b: number; idx: number[]};
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: number[] = [];
  const flush = (end: number) => { if (cur.length) { out.push({a: W[cur[0]].t, b: end, idx: cur}); cur = []; } };
  W.forEach((w, i) => {
    if (cur.length && (cur.length >= 3 || w.t - W[i - 1].e > 0.28 || /[.,:?!]$/.test(W[i - 1].w))) flush(w.t);
    cur.push(i);
  });
  flush(S1END);
  // close gaps: chunk ends at the end of its last word + 0.25, but never after next start
  for (let i = 0; i < out.length; i++) {
    const last = W[out[i].idx[out[i].idx.length - 1]];
    const nxt = i + 1 < out.length ? out[i + 1].a : S1END;
    out[i].b = Math.min(nxt, last.e + 0.35);
  }
  return out;
})();
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / S1FPS;
  const ch = CHUNKS.find((c) => t >= c.a - 0.02 && t < c.b);
  if (!ch) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1400, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px'}}>
      {ch.idx.map((i) => {
        const fa = FR(W[i].t);
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

// ---------- sound design ----------
type Sfx = {t: number; s: string; v?: number; peak?: number};
const PEAK: Record<string, number> = {riser1: 1.8, riser2: 1.67, riserimp: 1.76, rrise: 1.15, metal: 1.67, bassrise: 0.74, wh1: 0.5, wh2: 0.37, fsw: 0.49, fwhip: 0.32, whip: 0.27, swish: 0.12, ssw: 0.13, gt1: 0.43, gt3: 0.91, g3: 0.78};
const SFX: Sfx[] = [
  // hook
  {t: 0.0, s: 'imp', v: 0.8}, {t: 0.05, s: 'sub1', v: 0.6}, {t: 0.75, s: 'pop1', v: 0.7}, {t: 1.68, s: 'pop2', v: 0.7},
  {t: 3.0, s: 'swish', v: 0.6}, {t: 4.15, s: 'fwhip', v: 0.6}, {t: 4.15, s: 'clock', v: 0.35}, {t: 4.79, s: 'pings', v: 0.5},
  // 01
  {t: 5.52, s: 'riserimp', v: 0.7}, {t: 5.52, s: 'sdl', v: 0.55}, {t: 5.64, s: 'mpop', v: 0.6}, {t: 7.4, s: 'whip', v: 0.6}, {t: 7.4, s: 'hud2', v: 0.5},
  {t: 7.75, s: 'wrong', v: 0.7},
  {t: 8.77, s: 'wh2', v: 0.6}, {t: 9.55, s: 'hud1', v: 0.45}, {t: 10.88, s: 'confirm', v: 0.5}, {t: 12.15, s: 'confirm', v: 0.4}, {t: 12.98, s: 'wrong', v: 0.6},
  {t: 13.72, s: 'fsw', v: 0.6}, {t: 14.03, s: 'notif', v: 0.5}, {t: 14.55, s: 'pop2', v: 0.6}, {t: 14.83, s: 'btn', v: 0.8}, {t: 15.21, s: 'glx2', v: 0.55}, {t: 15.25, s: 'sub1', v: 0.5},
  {t: 16.17, s: 'glx', v: 0.5}, {t: 16.55, s: 'bips', v: 0.2}, {t: 17.11, s: 'imp', v: 0.6}, {t: 17.54, s: 'rrise', v: 0.35, peak: 0.3},
  // menu
  {t: 18.32, s: 'whip', v: 0.6}, {t: 18.32, s: 'pop1', v: 0.6}, {t: 19.69, s: 'hud2', v: 0.6}, {t: 19.69, s: 'c1', v: 0.6}, {t: 20.77, s: 'c3', v: 0.7},
  {t: 21.19, s: 'c1', v: 0.8}, {t: 21.61, s: 'sel', v: 0.5}, {t: 22.08, s: 'c5', v: 0.8}, {t: 22.43, s: 'right', v: 0.4},
  // 02
  {t: 23.08, s: 'metal', v: 0.6}, {t: 23.08, s: 'sdl', v: 0.55}, {t: 23.2, s: 'mpop', v: 0.6}, {t: 25.43, s: 'whip', v: 0.6}, {t: 25.6, s: 'c3', v: 0.8}, {t: 26.4, s: 'wrong', v: 0.5}, {t: 27.2, s: 'imp', v: 0.5},
  {t: 28.16, s: 'glx', v: 0.6}, {t: 28.16, s: 'ssw', v: 0.5}, {t: 28.48, s: 'notif', v: 0.5}, {t: 29.64, s: 'glx2', v: 0.5}, {t: 29.64, s: 'typing', v: 0.35},
  {t: 30.32, s: 'wh1', v: 0.6}, {t: 30.32, s: 'kb', v: 0.25}, {t: 32.01, s: 'pop2', v: 0.6}, {t: 33.32, s: 'whip', v: 0.5}, {t: 33.32, s: 'pop2', v: 0.6},
  {t: 34.54, s: 'pop2', v: 0.6}, {t: 34.6, s: 'c3', v: 0.6}, {t: 34.78, s: 'c5', v: 0.6}, {t: 34.95, s: 'c3', v: 0.6}, {t: 35.12, s: 'c5', v: 0.6}, {t: 35.3, s: 'c3', v: 0.6}, {t: 35.47, s: 'c5', v: 0.6},
  {t: 35.96, s: 'fsw', v: 0.6}, {t: 36.36, s: 'hud1', v: 0.6}, {t: 38.39, s: 'confirm', v: 0.5},
  {t: 39.76, s: 'glx2', v: 0.5}, {t: 39.76, s: 'wh2', v: 0.5}, {t: 40.55, s: 'wrong', v: 0.6}, {t: 41.8, s: 'whip', v: 0.5}, {t: 42.39, s: 'uityp', v: 0.25}, {t: 43.03, s: 'right', v: 0.35},
  // 03
  {t: 43.88, s: 'riserimp', v: 0.7}, {t: 43.88, s: 'sdl', v: 0.55}, {t: 44.0, s: 'mpop', v: 0.6}, {t: 45.56, s: 'fwhip', v: 0.5}, {t: 45.6, s: 'pop1', v: 0.6}, {t: 46.23, s: 'dtype', v: 0.25}, {t: 46.6, s: 'pop2', v: 0.6}, {t: 47.59, s: 'imp', v: 0.5},
  {t: 48.44, s: 'wh1', v: 0.5}, {t: 48.95, s: 'swish', v: 0.6}, {t: 49.23, s: 'swish', v: 0.6}, {t: 50.15, s: 'pings', v: 0.5},
  {t: 51.0, s: 'fsw', v: 0.6}, {t: 51.7, s: 'hud1', v: 0.6}, {t: 52.55, s: 'wrong', v: 0.6}, {t: 54.12, s: 'glx', v: 0.55}, {t: 54.12, s: 'riser1', v: 0.4}, {t: 54.71, s: 'right', v: 0.4},
  // outro
  {t: 55.6, s: 'wh2', v: 0.6}, {t: 56.1, s: 'c3', v: 0.6}, {t: 56.35, s: 'c3', v: 0.6}, {t: 56.6, s: 'c3', v: 0.6}, {t: 57.28, s: 'riserimp', v: 0.5}, {t: 57.6, s: 'c1', v: 0.9}, {t: 57.7, s: 'notif', v: 0.5},
];
const G = GAINS as Record<string, number>;
const SfxLayer: React.FC = () => (
  <>
    {SFX.map((x, i) => {
      const pk = x.peak ?? (['riserimp', 'riser1', 'metal', 'rrise'].includes(x.s) ? PEAK[x.s] : 0);
      const st = F(x.t) - FR(pk);
      return (
        <Sequence key={i} from={Math.max(0, st)} layout="none">
          <Audio src={staticFile(`s1/sfx/${x.s}.wav`)} volume={Math.min(1, (x.v ?? 0.6) * (G[x.s] ?? 1) * 0.26)} startFrom={st < 0 ? -st : 0} />
        </Sequence>
      );
    })}
  </>
);

const CUTS = SHOTS.slice(1).map((s) => s.a);
const STREAKS = [5.52, 23.08, 43.88, 55.6];
const GLITCHES = [15.21, 16.17, 28.16, 29.64, 39.76, 54.12];

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const gk = glitchK(f);
  const wrap: React.CSSProperties = gk > 0.02 ? {filter: 'url(#s1glx)', transform: `scale(${1 + 0.035 * gk}) translateX(${(rnd(Math.floor(f / 2)) - 0.5) * 14 * gk}px)`} : {};
  return (
    <AbsoluteFill style={{background: '#07030c'}}>
      <GlitchDefs k={gk} seed={Math.floor(f / 2) % 97} />
      <AbsoluteFill style={wrap}>
        {SHOTS.map((s, i) => (
          <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)}>
            <ShotLayer s={s} />
          </Sequence>
        ))}
        <Hook />
        <AutoSave />
        <Timeline />
        <Streamer />
        <Menu />
        <NoFP />
        <GlitchFound />
        <Steps />
        <POV />
        <NoBack />
        <Boat />
        <Same />
        <GPS />
        <Outro />
      </AbsoluteFill>
      {CUTS.map((c) => <Flash key={'f' + c} at={c} />)}
      {STREAKS.map((c) => <Streak key={'s' + c} at={c} />)}
      <Subs />
      <Audio src={staticFile('s1/voice.wav')} volume={1} />
      <Audio src={staticFile('music/bed.mp3')} volume={(fr) => interpolate(fr, [0, 20, FR(S1END) - 40, FR(S1END)], [0, 0.1, 0.1, 0], cl)} />
      <SfxLayer />
    </AbsoluteFill>
  );
};
