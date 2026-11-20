// Long video 1: "Every INSANE Secret Found in GTA 6's First Days" (1920x1080, 60 fps)
// Almost no on-screen text: gameplay clips cut on the spoken words, smooth transitions, map scenes.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import SH from './lvshots.json';
import WORDS from './lvwords.json';
import {F, lerp, IO, cl, PINK, PINK2, YEL, GRN, RED, CYAN, Big, Lab, Tag, panel, Digits, IUfo, Pop, C, SfxLayer, Sfx, Wd, at, glitchK, GlitchDefs, rnd} from './ShortKit';

type S = {t: number; src: string; in: number; dur: number; sp?: number};
const W = WORDS as Wd[];
const A = (w: string, n = 1) => at(W, w, n);
const SHOTS = (SH as {end: number; shots: S[]}).shots;
export const LV1END = (SH as {end: number}).end;

// section starts (secret numbers) -> smooth zoom-blur entry + light streak + badge
const SECTIONS: [number, string][] = [
  [31.58, '01'], [72.94, '02'], [91.7, '03'], [116.08, '04'], [131.21, '05'], [165.72, '06'], [184.6, '07'],
  [229.72, '08'], [248.86, '09'], [259.98, '10'], [276.34, '11'], [292.04, '12'], [318.16, '13'], [332.04, '14'],
];
const isSection = (t: number) => SECTIONS.some(([s]) => Math.abs(s - t) < 0.05);
const INTRO_END = 31.58;

const Clip: React.FC<{s: S; idx: number}> = ({s, idx}) => {
  const f = useCurrentFrame();
  const len = Math.round(s.dur * 60) + 15;
  const sec = isSection(s.t) || s.t === 0;
  const fast = s.t < INTRO_END && !sec; // intro montage: crisp cuts
  const fade = fast ? 1 : lerp(f, 0, 12, 0, 1, IO);
  const zin = sec ? lerp(f, 0, 22, 1.14, 1.0) : 1;
  const blur = sec ? lerp(f, 0, 18, 14, 0) : 0;
  const push = interpolate(f, [0, len], [1.0, 1.06], cl);
  if (s.src.startsWith('MAP')) return <MapScene kind={s.src.split(':')[1]} len={len} fade={fade} />;
  return (
    <AbsoluteFill style={{opacity: fade, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zin * push})`, filter: `blur(${blur}px) saturate(1.08) contrast(1.04)`}}>
        <OffthreadVideo src={staticFile(`lv/c/c${String(idx).padStart(3, '0')}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- map scenes (no labels, just glowing pins) ----------
const MW = 1600, MH = Math.round(1600 * 7680 / 5670); // leonida.jpg size
type Cam = {u: number; v: number; z: number};
const MAPS: Record<string, {from: Cam; to: Cam; pins: [number, number][]; towers?: boolean}> = {
  intro: {from: {u: 0.76, v: 0.51, z: 3.2}, to: {u: 0.52, v: 0.5, z: 1.15}, pins: [[0.76, 0.51], [0.48, 0.3], [0.93, 0.44], [0.45, 0.73], [0.25, 0.46], [0.46, 0.86], [0.62, 0.62], [0.33, 0.2]]},
  tower: {from: {u: 0.55, v: 0.45, z: 1.4}, to: {u: 0.48, v: 0.3, z: 3.0}, pins: [[0.48, 0.3]], towers: true},
  towers: {from: {u: 0.5, v: 0.42, z: 2.0}, to: {u: 0.5, v: 0.45, z: 1.35}, pins: [[0.4, 0.25], [0.58, 0.38], [0.3, 0.45], [0.52, 0.62], [0.66, 0.22], [0.48, 0.3]], towers: true},
  outro: {from: {u: 0.6, v: 0.5, z: 2.2}, to: {u: 0.52, v: 0.5, z: 1.05}, pins: [[0.76, 0.51], [0.48, 0.3], [0.93, 0.44], [0.45, 0.73], [0.25, 0.46], [0.46, 0.86], [0.62, 0.62], [0.33, 0.2]]},
};
const TowerPin: React.FC<{c: string}> = ({c}) => (
  <svg width="70" height="90" viewBox="0 0 70 90" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round">
    <path d="M22 86 L33 10 L37 10 L48 86" /><line x1="26" y1="60" x2="44" y2="60" /><line x1="29" y1="38" x2="41" y2="38" /><circle cx="35" cy="6" r="4" fill={c} stroke="none" />
  </svg>
);
const MapScene: React.FC<{kind: string; len: number; fade: number}> = ({kind, len, fade}) => {
  const f = useCurrentFrame();
  const m = MAPS[kind];
  const p = interpolate(f, [0, len - 18], [0, 1], {...cl, easing: IO});
  const u = m.from.u + (m.to.u - m.from.u) * p, v = m.from.v + (m.to.v - m.from.v) * p, z = m.from.z + (m.to.z - m.from.z) * p;
  const base = 1080 / MH; // fit height at z=1
  const sc = base * z;
  const x = 960 - u * MW * sc, y = 540 - v * MH * sc;
  return (
    <AbsoluteFill style={{opacity: fade, background: '#0b2a4a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: x, top: y, width: MW * sc, height: MH * sc}}>
        <Img src={staticFile('lv/leonida.jpg')} style={{width: '100%', height: '100%', filter: 'saturate(0.9) brightness(0.8) contrast(1.05)'}} />
        {m.pins.map(([pu, pv], i) => {
          const a = 8 + i * (m.pins.length > 3 ? 9 : 0);
          const q = lerp(f, a, a + 16, 0, 1);
          const pulse = ((f - a) % 50) / 50;
          return (
            <div key={i} style={{position: 'absolute', left: pu * MW * sc, top: pv * MH * sc, opacity: q}}>
              <div style={{position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: 999, border: `4px solid ${PINK}`, transform: `scale(${0.3 + pulse})`, opacity: f > a ? 1 - pulse : 0}} />
              {m.towers ? (
                <div style={{position: 'absolute', left: -35, top: -86, transform: `scale(${0.6 + 0.4 * q})`, transformOrigin: '50% 100%', filter: `drop-shadow(0 0 12px ${PINK})`}}><TowerPin c="#fff" /></div>
              ) : (
                <div style={{position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: 999, background: PINK, border: '5px solid #fff', boxShadow: `0 0 26px ${PINK}`, transform: `scale(${0.4 + 0.6 * q})`}} />
              )}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(5,2,12,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- small overlays (minimal text) ----------
const Badge: React.FC<{at: number; n: string}> = ({at: t, n}) => {
  const f = useCurrentFrame();
  const a = F(t) + 8, b = a + 160;
  if (f < a || f > b + 16) return null;
  const p = lerp(f, a, a + 18, 0, 1);
  const q = lerp(f, b, b + 16, 0, 1, IO);
  const ring = lerp(f, a, a + 34, 0.7, 1.6);
  const ro = lerp(f, a, a + 34, 0.9, 0);
  return (
    <div style={{position: 'absolute', left: 70, bottom: 70, opacity: p * (1 - q), transform: `translateX(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`}}>
      <div style={{position: 'relative', width: 150, height: 150, borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', ...panel()}}>
        <div style={{position: 'absolute', inset: -8, borderRadius: 42, border: `4px solid ${PINK}`, transform: `scale(${ring})`, opacity: ro}} />
        <Big size={84}>{n}</Big>
      </div>
    </div>
  );
};
const Streak: React.FC<{at: number}> = ({at: t}) => {
  const f = useCurrentFrame();
  const a = F(t) - 10;
  if (f < a || f > a + 22) return null;
  const p = interpolate(f, [a, a + 22], [0, 1], {...cl, easing: IO});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -700 + p * 3400, top: -500, width: 300, height: 2200, transform: 'rotate(20deg)', background: `linear-gradient(90deg, transparent, ${PINK}aa, #fff, ${PINK}aa, transparent)`, filter: 'blur(16px)', opacity: 0.85}} />
    </AbsoluteFill>
  );
};
const Flash: React.FC<{at: number}> = ({at: t}) => {
  const f = useCurrentFrame();
  const a = F(t);
  const o = interpolate(f, [a - 1, a, a + 8], [0, 0.22, 0], cl);
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};
const Subscribe: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(377.5);
  if (f < a) return null;
  const p = lerp(f, a, a + 20, 0, 1);
  const click = a + 70;
  const done = f >= click;
  const pr = f >= click && f < click + 8 ? 0.93 : 1;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{transform: `scale(${pr})`, padding: '22px 60px', borderRadius: 999, background: done ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 30px ${PINK}`, display: 'flex', alignItems: 'center', gap: 16}}>
        <Big size={54} glow="#000">{done ? '✓ SUBSCRIBED' : 'SUBSCRIBE'}</Big>
      </div>
    </div>
  );
};

// ---------- sound ----------
const WH = ['wh1', 'wh2', 'fsw', 'ssw'];
const SFX: Sfx[] = [
  {t: 0, s: 'sub1', v: 0.6}, {t: 0.02, s: 'imp', v: 0.5},
  ...SHOTS.filter((s) => s.t > 0.5 && s.t < INTRO_END - 1).map((s, i) => ({t: s.t, s: i % 2 ? 'whip' : 'swish', v: 0.45})),
  {t: 11.68, s: 'appear', v: 0.4}, {t: 10.59, s: 'glx', v: 0.45}, {t: 20.87, s: 'glx2', v: 0.45}, {t: 20.87, s: 'imp', v: 0.5}, {t: 54.95, s: 'glx', v: 0.35},
  ...SECTIONS.map(([t]) => ({t, s: 'glx2', v: 0.3})),
  {t: 4.03, s: 'pop2', v: 0.5}, {t: 5.16, s: 'pop2', v: 0.5}, {t: 7.88, s: 'pop2', v: 0.5}, {t: 15.6, s: 'pop1', v: 0.5}, {t: 17.2, s: 'pop1', v: 0.5}, {t: 18.47, s: 'pop1', v: 0.5}, {t: 26.7, s: 'notif', v: 0.4},
  ...SECTIONS.map(([t], i) => ({t, s: WH[i % WH.length], v: 0.6})),
  ...SECTIONS.map(([t]) => ({t: t + 0.18, s: 'pop1', v: 0.4})),
  {t: 202.5, s: 'imp', v: 0.45}, {t: 226.71, s: 'imp', v: 0.45}, {t: 175.52, s: 'sdl', v: 0.5},
  {t: 248.86, s: 'c3', v: 0.5}, {t: 250.5, s: 'c5', v: 0.5}, {t: 252.6, s: 'c3', v: 0.5},
  {t: 332.04, s: 'riserimp', v: 0.55}, {t: 344.02, s: 'imp', v: 0.45}, {t: 350.66, s: 'glx', v: 0.35}, {t: 360.5, s: 'sub1', v: 0.5},
  {t: 369.79, s: 'appear', v: 0.4}, {t: 377.5, s: 'pop2', v: 0.5}, {t: 378.67, s: 'c1', v: 0.8}, {t: 378.8, s: 'notif', v: 0.45},
];

const GLITCHES = [10.59, 20.87, 54.95, 350.66, ...SECTIONS.map(([t]) => t)];

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const lab = (a: number, b: number, text: string, c: string) => (
    <Pop a={a} b={b} from="zoom" style={{...C, top: 760}}>
      <div style={{padding: '18px 54px', ...panel(c), borderRadius: 30}}><Big size={96} c="#fff" glow={c}>{text}</Big></div>
    </Pop>
  );
  const dim = interpolate(f, [F(20.87) - 4, F(20.87) + 10, F(26.5), F(26.7)], [0, 0.55, 0.55, 0], cl);
  return (
    <>
      <Pop a={0} b={2.55} from="zoom" style={{...C, top: 300}}>
        <Img src={staticFile('gtavi_logo.png')} style={{width: 330, filter: `drop-shadow(0 0 40px ${PINK})`}} />
      </Pop>
      <Pop a={A('few')} b={2.55} style={{...C, top: 690}}><Tag c={YEL} size={40}>only a few days in</Tag></Pop>
      <Pop a={2.7} b={3.95} from="down" style={{...C, top: 120}}><Big size={84}>PLAYERS ALREADY FOUND...</Big></Pop>
      {lab(4.03, 5.1, 'SEA MONSTER', CYAN)}
      {lab(5.16, 7.8, 'GIANT CRAB', RED)}
      {lab(7.88, 10.5, 'JET SKI DOG', YEL)}
      {lab(10.59, 11.6, 'ALIENS', GRN)}
      <Pop a={A('secrets')} b={15.45} from="zoom" style={{...C, top: 330}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '30px 60px', ...panel()}}>
          <Digits text="14" size={170} />
          <Lab c={PINK2} size={34}>insane secrets</Lab>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 26}}>
        {([[15.6, 'FUNNY', YEL], [17.2, 'CREEPY', RED], [18.47, 'GTA 5 LINKS', CYAN]] as [number, string, string][]).map(([t, l, c], i) => {
          const p = lerp(f, F(t), F(t) + 14, 0, 1);
          const q = lerp(f, F(20.7), F(20.95), 0, 1, IO);
          if (f < F(t) - 1 || q >= 1) return null;
          return <div key={i} style={{opacity: p * (1 - q), transform: `translateY(${(1 - p) * 40}px)`, padding: '14px 40px', ...panel(c), borderRadius: 999}}><Big size={60} glow={c}>{l}</Big></div>;
        })}
      </div>
      {dim > 0 && <AbsoluteFill style={{background: `rgba(8,2,16,${dim})`}} />}
      <Pop a={A('every')} b={26.4} from="zoom" style={{...C, top: 300}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Big size={150}>EVERY</Big>
          <Big size={170} c={PINK2}>INSANE SECRET</Big>
        </div>
      </Pop>
      <Pop a={A('first')} b={26.4} style={{...C, top: 720}}><Tag size={40}>gta 6 · first days</Tag></Pop>
      <Pop a={A('stay')} b={31.4} from="down" style={{...C, top: 760}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 46px', ...panel(GRN), borderRadius: 999}}>{IUfo(80, GRN)}<Big size={64} glow={GRN}>STAY UNTIL THE END</Big></div>
      </Pop>
    </>
  );
};

export const LV1: React.FC = () => {
  const f = useCurrentFrame();
  const gk = glitchK(f, GLITCHES);
  const wrap: React.CSSProperties = gk > 0.02 ? {filter: 'url(#lvglx)', transform: `scale(${1 + 0.03 * gk}) translateX(${(rnd(Math.floor(f / 2)) - 0.5) * 16 * gk}px)`} : {};
  return (
  <AbsoluteFill style={{background: '#000'}}>
    <GlitchDefs k={gk} seed={Math.floor(f / 2) % 97} id="lvglx" />
    <AbsoluteFill style={wrap}>
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={F(s.t)} durationInFrames={Math.round(s.dur * 60) + 15}>
        <Clip s={s} idx={i} />
      </Sequence>
    ))}
    </AbsoluteFill>
    <Intro />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
    {SHOTS.filter((s) => s.t > 0.5 && s.t < INTRO_END).map((s) => <Flash key={'f' + s.t} at={s.t} />)}
    {SECTIONS.map(([t]) => <Streak key={'s' + t} at={t} />)}
    {SECTIONS.map(([t, n]) => <Badge key={'b' + t} at={t} n={n} />)}
    <Subscribe />
    <Audio src={staticFile('lv/voice.wav')} />
    <Audio src={staticFile('music/bed.mp3')} volume={(fr) => interpolate(fr, [0, 30, F(LV1END) - 60, F(LV1END)], [0, 0.07, 0.07, 0], cl)} />
    <SfxLayer list={SFX} />
  </AbsoluteFill>
  );
};

// 1440p master: the 1920x1080 layout scaled up 4/3 so YouTube serves its higher-bitrate 1440p stream
export const LV1HQ: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(1.3333333333)', transformOrigin: '0 0'}}>
      <LV1 />
    </div>
  </AbsoluteFill>
);
