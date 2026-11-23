// Long video 2: "The NPCs in GTA 6 Are Way Too Real" (1920x1080, 60 fps)
// Narration over b-roll, real NPC dialogue moments played with their own audio (master.wav holds the full mix).
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import PLAN from './lv2plan.json';
import {F, lerp, IO, EO, cl, PINK, PINK2, YEL, GRN, RED, CYAN, Big, Lab, Tag, panel, Pop, C, Wd, at, glitchK, GlitchDefs, rnd} from './ShortKit';

type Sh = {f: string; a: number; b: number; ins: boolean};
type In = {id: string; a: number; b: number; label: string; cap: string | null; g: number; first: boolean};
const P = PLAN as {total: number; shots: Sh[]; ins: In[]; words: Wd[]};
const W = P.words;
const A = (w: string, n = 1) => at(W, w, n);
export const LV2END = P.total;
const GFIRST = P.ins.filter((i) => i.first);

const CHAPTERS: [number, string, string][] = [
  [A('start'), 'THEY TALK TO YOU', PINK],
  [A('reputation'), 'THEY KNOW WHO YOU ARE', RED],
  [A('conversations'), 'THEY HAVE THEIR OWN LIVES', CYAN],
  [A('jobs'), 'PEOPLE WITH JOBS', YEL],
  [A('fighting'), 'NPC DRAMA', RED],
  [A('crime'), 'CRIME WITHOUT YOU', CYAN],
  [A('packed'), 'A WORLD FULL OF LIFE', GRN],
];

const Clip: React.FC<{s: Sh}> = ({s}) => {
  const f = useCurrentFrame();
  const len = Math.round((s.b - s.a) * 60) + 12;
  const groupStart = s.ins && GFIRST.some((g) => Math.abs(g.a - s.a) < 0.02);
  const fade = groupStart ? 1 : lerp(f, 0, 10, 0, 1, IO);
  const zin = groupStart ? lerp(f, 0, 20, 1.12, 1.0, EO) : 1;
  const blur = groupStart ? lerp(f, 0, 14, 12, 0) : 0;
  const push = interpolate(f, [0, len], s.ins ? [1.0, 1.05] : [1.02, 1.08], cl);
  return (
    <AbsoluteFill style={{opacity: fade, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zin * push})`, filter: `blur(${blur}px) saturate(1.1) contrast(1.05)`}}>
        <OffthreadVideoSafe src={s.f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const OffthreadVideoSafe: React.FC<{src: string}> = ({src}) => (
  <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
);

// sound bars next to the speaker name
const Bars: React.FC<{c: string}> = ({c}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 30}}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 6, borderRadius: 3, background: c, height: 8 + 22 * Math.abs(Math.sin(f / (4 + i) + i * 1.7))}} />)}
    </div>
  );
};

// lower third while an NPC is talking: speaker + what they say (typed in)
const NpcCaption: React.FC<{x: In}> = ({x}) => {
  const f = useCurrentFrame();
  const a = F(x.a), b = F(x.b);
  if (f < a || f > b + 10) return null;
  const p = lerp(f, a + 2, a + 16, 0, 1, EO);
  const q = lerp(f, b - 6, b + 8, 0, 1, IO);
  const cap = x.cap ?? '';
  const n = Math.floor(lerp(f, a + 8, a + 8 + Math.max(30, (b - a) * 0.55), 0, cap.length, (t) => t));
  const c = x.label === 'POLICE' ? CYAN : x.label.includes('ANGRY') || x.label === 'PARAMEDIC' ? RED : PINK;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', opacity: p * (1 - q), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{maxWidth: 1400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px', borderRadius: 999, background: c, boxShadow: `0 0 26px ${c}88`}}>
          <Bars c="#fff" />
          <Big size={30} glow="#0000">{x.label}</Big>
        </div>
        {cap && (
          <div style={{padding: '16px 34px', ...panel(c), borderRadius: 22, textAlign: 'center'}}>
            <div style={{fontFamily: 'Rubik', fontWeight: 800, fontSize: 44, lineHeight: 1.2, color: '#fff', textShadow: '0 3px 12px #000'}}>
              “{cap.slice(0, n)}<span style={{opacity: 0}}>{cap.slice(n)}</span>”
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// numbered moment badge (top left) at the start of each NPC moment
const Badge: React.FC<{x: In}> = ({x}) => {
  const f = useCurrentFrame();
  const a = F(x.a), b = a + 150;
  if (f < a || f > b + 16 || x.g < 2) return null;
  const p = lerp(f, a, a + 18, 0, 1, EO);
  const q = lerp(f, b, b + 16, 0, 1, IO);
  const ring = lerp(f, a, a + 34, 0.7, 1.6);
  const ro = lerp(f, a, a + 34, 0.9, 0);
  return (
    <div style={{position: 'absolute', left: 60, top: 56, opacity: p * (1 - q), transform: `translateX(${(1 - p) * -60}px)`, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{position: 'relative', width: 116, height: 116, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', ...panel()}}>
        <div style={{position: 'absolute', inset: -8, borderRadius: 36, border: `4px solid ${PINK}`, transform: `scale(${ring})`, opacity: ro}} />
        <Big size={60}>{String(x.g - 1).padStart(2, '0')}</Big>
      </div>
      <Lab c={PINK2} size={24}>npc moment</Lab>
    </div>
  );
};

const Chapter: React.FC<{t: number; text: string; c: string}> = ({t, text, c}) => {
  const f = useCurrentFrame();
  const a = F(t) - 6, b = a + 150;
  if (f < a || f > b + 16) return null;
  const p = lerp(f, a, a + 16, 0, 1, EO);
  const q = lerp(f, b, b + 16, 0, 1, IO);
  const line = lerp(f, a + 6, a + 30, 0, 1, EO);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'rgba(8,2,16,0.45)', opacity: p * (1 - q)}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: p * (1 - q), transform: `scale(${0.92 + 0.08 * p})`}}>
        <Lab c={c} size={30}>chapter</Lab>
        <Big size={104} glow={c}>{text}</Big>
        <div style={{width: 700 * line, height: 6, borderRadius: 3, background: c, boxShadow: `0 0 20px ${c}`}} />
      </div>
    </AbsoluteFill>
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

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const tA = A('welcome'), tB = A('back');
  const dim = interpolate(f, [F(tA) - 6, F(tA) + 8, F(tB) + 20, F(tB) + 34], [0, 0.55, 0.55, 0], cl);
  const chips: [string, string, string][] = [['talk', 'TALK ABOUT YOU', PINK], ['judge', 'JUDGE YOU', RED], ['react', 'REACT', YEL], ['argue', 'ARGUE', CYAN], ['post', 'POST ONLINE', GRN], ['drama', 'DRAMA', PINK]];
  const places: [string, string][] = [['vice', 'VICE CITY'], ['beaches', 'BEACHES'], ['gyms', 'GYMS'], ['bars', 'BARS'], ['hotels', 'HOTELS'], ['rich', 'RICH NEIGHBORHOODS']];
  const placeNow = [...places].reverse().find(([w]) => f >= F(A(w)));
  const placeEnd = F(A('doing'));
  return (
    <>
      {dim > 0 && <AbsoluteFill style={{background: `rgba(8,2,16,${dim})`}} />}
      <Pop a={tA} b={tB + 0.4} from="zoom" style={{...C, top: 300}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Big size={120}>THE NPCs IN GTA 6</Big>
          <Big size={150} c={PINK2} glow={PINK}>ARE WAY TOO REAL</Big>
        </div>
      </Pop>
      <Pop a={A('three')} b={A('but') - 0.1} from="down" style={{...C, top: 120}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 40px', ...panel('#9a90aa')}}>
          <Lab c="#c9c2d6" size={28}>gta 5 npcs</Lab><Big size={60}>~3 LINES</Big>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16, padding: '0 120px'}}>
        {chips.map(([w, l, c], i) => {
          const t = F(A(w));
          const p = lerp(f, t, t + 12, 0, 1, EO);
          const q = lerp(f, F(A('i')) - 6, F(A('i')) + 6, 0, 1, IO);
          if (f < t - 1 || q >= 1) return null;
          return <div key={i} style={{opacity: p * (1 - q), transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, padding: '12px 30px', ...panel(c), borderRadius: 999}}><Big size={44} glow={c}>{l}</Big></div>;
        })}
      </div>
      {placeNow && f < placeEnd + 12 && (
        <div style={{position: 'absolute', left: 60, top: 60, opacity: 1 - lerp(f, placeEnd, placeEnd + 12, 0, 1)}}>
          <div key={placeNow[1]} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 30px', ...panel(YEL), borderRadius: 999, transform: `scale(${interpolate(f - F(A(placeNow[0])), [0, 6, 12], [1.25, 0.97, 1], cl)})`}}>
            <div style={{width: 14, height: 14, borderRadius: 9, background: YEL, boxShadow: `0 0 14px ${YEL}`}} />
            <Big size={46} glow={YEL}>{placeNow[1]}</Big>
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', gap: 22}}>
        {([['funny', 'FUNNY', YEL], ['creepy', 'CREEPY', RED], ['human', 'STRANGELY HUMAN', CYAN]] as [string, string, string][]).map(([w, l, c], i) => {
          const t = F(A(w));
          const p = lerp(f, t, t + 12, 0, 1, EO);
          const q = lerp(f, F(A('start')) - 10, F(A('start')), 0, 1, IO);
          if (f < t - 1 || q >= 1) return null;
          return <div key={i} style={{opacity: p * (1 - q), transform: `translateY(${(1 - p) * 30}px)`, padding: '14px 38px', ...panel(c), borderRadius: 999}}><Big size={54} glow={c}>{l}</Big></div>;
        })}
      </div>
    </>
  );
};

const Subscribe: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(A('subscribe')) - 10;
  if (f < a) return null;
  const p = lerp(f, a, a + 20, 0, 1);
  const click = a + 60;
  const done = f >= click;
  const pr = f >= click && f < click + 8 ? 0.93 : 1;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{transform: `scale(${pr})`, padding: '22px 60px', borderRadius: 999, background: done ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 30px ${PINK}`}}>
        <Big size={54} glow="#000">{done ? '✓ SUBSCRIBED' : 'SUBSCRIBE'}</Big>
      </div>
    </div>
  );
};

const CommentQ: React.FC = () => {
  const a = A('craziest', 2), b = A('subscribe') - 0.2;
  return (
    <Pop a={a} b={b} from="down" style={{...C, top: 360}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '26px 54px', ...panel()}}>
        <Lab c={PINK2} size={30}>tell me in the comments</Lab>
        <Big size={80}>CRAZIEST NPC LINE?</Big>
      </div>
    </Pop>
  );
};

const GLITCHES = [...GFIRST.map((g) => g.a), ...CHAPTERS.map(([t]) => t)];

export const LV2: React.FC = () => {
  const f = useCurrentFrame();
  const gk = glitchK(f, GLITCHES);
  const wrap: React.CSSProperties = gk > 0.02 ? {filter: 'url(#lv2glx)', transform: `scale(${1 + 0.03 * gk}) translateX(${(rnd(Math.floor(f / 2)) - 0.5) * 16 * gk}px)`} : {};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <GlitchDefs k={gk} seed={Math.floor(f / 2) % 97} id="lv2glx" />
      <AbsoluteFill style={wrap}>
        {P.shots.map((s, i) => (
          <Sequence key={i} from={F(s.a)} durationInFrames={Math.round((s.b - s.a) * 60) + 12}>
            <Clip s={s} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
      <Intro />
      {CHAPTERS.map(([t, text, c]) => <Chapter key={text} t={t} text={text} c={c} />)}
      {CHAPTERS.map(([t]) => <Streak key={'s' + t} at={t} />)}
      {P.ins.map((x) => <NpcCaption key={x.id} x={x} />)}
      {GFIRST.map((x) => <Badge key={'b' + x.id} x={x} />)}
      <CommentQ />
      <Subscribe />
      <Audio src={staticFile('lv2/master.m4a')} />
    </AbsoluteFill>
  );
};

export const LV2HQ: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(1.3333333333)', transformOrigin: '0 0'}}>
      <LV2 />
    </div>
  </AbsoluteFill>
);
