import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, Easing, OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {PINK, HEAD, BODY, INK, NAVY, Pill, useF} from './style';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fps = 30; // animation units (useF)
const EO = Easing.bezier(0.16, 1, 0.3, 1);
const ent = (f: number, d = 8) => interpolate(f, [0, d], [0, 1], {...clamp, easing: EO});
const outF = (f: number, len: number, d = 8) => interpolate(f, [len - d, len], [1, 0], {...clamp, easing: Easing.in(Easing.quad)});
const sp = (f: number, damping = 13, stiffness = 170) => (f < 0 ? 0 : spring({frame: f, fps, config: {damping, stiffness}}));

/* ---------- kinetic words: punchy words that pop in one by one, keyword in pink ---------- */
export const Kinetic: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len);
  const size = o.size || 150;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: o.top ? 'flex-start' : 'center', paddingTop: o.top || 0, opacity: out}}>
      {o.dim ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,10,20,0.55) 0%, rgba(8,10,20,0) 70%)'}} /> : null}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.22}px`, maxWidth: 1700, transform: `scale(${interpolate(f, [0, len], [1, 1.04], clamp)})`}}>
        {o.words.map((w: any, i: number) => {
          const a = f - w[1] * fps;
          const t = ent(a, 6);
          if (a < 0) return null;
          const pop = 1 + (1 - sp(a, 9, 260)) * 0.0 + Math.max(0, 1 - a / 6) * 0.25;
          return (
            <div key={i} style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: '-0.045em', lineHeight: 1.0, color: w[2] ? PINK : '#fff', opacity: t,
              transform: `translateY(${(1 - t) * 40}px) scale(${pop})`, filter: `blur(${(1 - t) * 8}px)`, textShadow: '0 8px 34px rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{w[0]}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- stamp that slams onto the screen ---------- */
export const Stamp: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = sp(f, 10, 300);
  const sc = 2.2 - 1.2 * s;
  const shake = f < 10 ? Math.sin(f * 2.4) * (10 - f) * 0.8 : 0;
  const out = outF(f, len);
  const col = o.color || PINK;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, f / 3) * out, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <div style={{position: 'absolute', left: o.x ?? 960, top: o.y ?? 540, transform: `translate(-50%,-50%) rotate(${o.rot ?? -8}deg) scale(${sc})`}}>
        <div style={{border: `10px solid ${col}`, borderRadius: 18, padding: '14px 40px 10px', color: col, fontFamily: HEAD, fontWeight: 900, fontSize: o.size || 120, letterSpacing: '0.02em', lineHeight: 1, background: 'rgba(10,12,22,0.25)', boxShadow: `0 0 0 4px rgba(255,255,255,0.15) inset`, whiteSpace: 'nowrap', textShadow: '0 4px 20px rgba(0,0,0,0.35)'}}>{o.text}</div>
        {o.sub ? <div style={{textAlign: 'center', marginTop: 14, fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: '0.18em', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>{o.sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- character file: tilted photo + navy dossier with typed fields ---------- */
const Typed: React.FC<{text: string; a: number}> = ({text, a}) => {
  const n = Math.floor(interpolate(a, [0, Math.max(6, text.length * 0.9)], [0, text.length], clamp));
  return <>{text.slice(0, n)}<span style={{opacity: n < text.length && a > 0 ? 1 : 0, color: PINK}}>▌</span></>;
};
export const Dossier: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len);
  const ph = sp(f - 2, 14, 150), pn = sp(f - 6, 15, 150);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 170, top: 190, transform: `translateY(${(1 - ph) * 120}px) rotate(${-5 + (1 - ph) * -6}deg)`, opacity: Math.min(1, ph * 1.4)}}>
        <div style={{background: '#f7f5f0', padding: '18px 18px 70px', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', borderRadius: 6}}>
          <Img src={staticFile(`img/${o.photo}.jpg`)} style={{width: 470, height: 588, objectFit: 'cover', display: 'block', filter: 'contrast(1.05) saturate(1.05)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive", fontSize: 36, color: INK}}>{o.nick}</div>
        </div>
        <div style={{position: 'absolute', left: '50%', top: -16, width: 130, height: 38, marginLeft: -65, background: 'rgba(255,61,134,0.55)', transform: 'rotate(-3deg)'}} />
      </div>
      <div style={{position: 'absolute', left: 760, top: 210, width: 1000, transform: `translateX(${(1 - pn) * 120}px)`, opacity: Math.min(1, pn * 1.4)}}>
        <div style={{background: 'rgba(22,28,48,0.94)', borderRadius: 24, padding: '38px 50px 34px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.6)'}}>
            <span style={{width: 12, height: 12, borderRadius: 12, background: PINK}} />EXPEDIENTE · {o.num}
          </div>
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, letterSpacing: '-0.045em', color: '#fff', lineHeight: 1, marginTop: 14}}>{o.name}</div>
          <div style={{width: 110, height: 7, background: PINK, borderRadius: 4, margin: '18px 0 22px'}} />
          {o.rows.map((r: any, i: number) => {
            const a = f - r[2] * fps;
            const t = ent(a, 6);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 24, minHeight: 70, opacity: t, transform: `translateX(${(1 - t) * -24}px)`}}>
                <div style={{width: 190, flexShrink: 0, fontFamily: BODY, fontWeight: 800, fontSize: 20, letterSpacing: '0.18em', color: PINK}}>{r[0]}</div>
                <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 44, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.08}}><Typed text={r[1]} a={a} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- name tag with round photo (lower third) ---------- */
export const NameTag: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len);
  const t = sp(f, 15, 170), bar = ent(f - 3, 10), tx = ent(f - 5, 8);
  return (
    <div style={{position: 'absolute', left: o.right ? undefined : 90, right: o.right ? 90 : undefined, bottom: 130, display: 'flex', alignItems: 'center', gap: 28, opacity: out, flexDirection: o.right ? 'row-reverse' : 'row'}}>
      <div style={{width: 210, height: 210, borderRadius: 210, overflow: 'hidden', border: `7px solid #fff`, boxShadow: `0 0 0 6px ${PINK}, 0 20px 50px rgba(0,0,0,0.5)`, transform: `scale(${t})`}}>
        <Img src={staticFile(`img/${o.photo}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: o.pos || '50% 30%'}} />
      </div>
      <div style={{textAlign: o.right ? 'right' : 'left'}}>
        {o.kind ? <div style={{opacity: tx, marginBottom: 10}}><Pill kind={o.kind} scale={1.1} /></div> : null}
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 92, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.95, opacity: tx, transform: `translateX(${(1 - tx) * (o.right ? 30 : -30)}px)`, textShadow: '0 6px 26px rgba(0,0,0,0.55)'}}>{o.name}</div>
        <div style={{height: 7, width: 140 * bar, background: PINK, borderRadius: 4, margin: o.right ? '14px 0 14px auto' : '14px 0'}} />
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', color: '#fff', opacity: tx, textShadow: '0 2px 10px rgba(0,0,0,0.7)', maxWidth: 900}}>{o.role}</div>
      </div>
    </div>
  );
};

/* ---------- conspiracy board: polaroids pinned around a centre, red strings drawn between them ---------- */
export const Board: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len, 10);
  const bg = ent(f, 10);
  const C = o.center;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: 'rgba(12,15,28,0.78)', opacity: bg}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)', backgroundSize: '34px 34px', opacity: bg}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {o.items.map((it: any, i: number) => {
          const a = f - (it.t + 0.25) * fps;
          const pr = interpolate(a, [0, 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
          const mx = (it.x + C.x) / 2, my = (it.y + C.y) / 2 + 60;
          return <path key={i} d={`M${it.x} ${it.y} Q${mx} ${my} ${C.x} ${C.y}`} stroke="#e8344f" strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${pr} 1`} opacity={pr > 0 ? 0.95 : 0} />;
        })}
      </svg>
      {(() => {
        const a = f - (o.centerT || 0) * fps; const s = sp(a, 11, 220);
        return (
          <div style={{position: 'absolute', left: C.x, top: C.y, transform: `translate(-50%,-50%) scale(${s}) rotate(-2deg)`, background: PINK, color: '#fff', borderRadius: 18, padding: '18px 34px', fontFamily: HEAD, fontWeight: 900, fontSize: 64, letterSpacing: '-0.04em', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>{C.text}</div>
        );
      })()}
      {o.items.map((it: any, i: number) => {
        const a = f - it.t * fps;
        const s = sp(a, 13, 190);
        if (a < 0) return null;
        return (
          <div key={'p' + i} style={{position: 'absolute', left: it.x, top: it.y, transform: `translate(-50%,-50%) translateY(${(1 - s) * -80}px) rotate(${it.rot || 0}deg) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 1.5)}}>
            <div style={{background: '#f7f5f0', padding: '12px 12px 54px', boxShadow: '0 20px 50px rgba(0,0,0,0.55)', borderRadius: 4, position: 'relative'}}>
              {it.photo ? <Img src={staticFile(`img/${it.photo}.jpg`)} style={{width: 230, height: 230, objectFit: 'cover', objectPosition: it.pos || '50% 25%', display: 'block'}} />
                : <div style={{width: 230, height: 230, background: '#1c2236', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 130, color: PINK}}>?</div>}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', color: INK}}>{it.label}</div>
              <div style={{position: 'absolute', left: '50%', top: -12, width: 26, height: 26, marginLeft: -13, borderRadius: 26, background: '#e8344f', boxShadow: '0 4px 8px rgba(0,0,0,0.5)'}} />
            </div>
            {it.sub ? <div style={{marginTop: 10, textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 17, letterSpacing: '0.14em', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)', width: 290, marginLeft: -18}}>{it.sub}</div> : null}
          </div>
        );
      })}
      {o.title ? <div style={{position: 'absolute', left: 80, top: 60, fontFamily: HEAD, fontWeight: 900, fontSize: 70, letterSpacing: '-0.04em', color: '#fff', opacity: ent(f, 8)}}>{o.title}</div> : null}
    </AbsoluteFill>
  );
};

/* ---------- chapter: big outlined number + title on the right ---------- */
export const Chapter: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len, 6);
  const t = ent(f, 7), t2 = ent(f - 3, 7);
  return (
    <div style={{position: 'absolute', right: 100, bottom: 120, display: 'flex', alignItems: 'center', gap: 30, opacity: out}}>
      <div style={{textAlign: 'right', opacity: t2, transform: `translateX(${(1 - t2) * 40}px)`}}>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: '0.22em', color: PINK}}>EN ESTE VÍDEO</div>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 84, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.98, textShadow: '0 6px 26px rgba(0,0,0,0.55)', whiteSpace: 'nowrap'}}>{o.text}</div>
      </div>
      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 230, letterSpacing: '-0.06em', lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `5px ${PINK}`, opacity: t, transform: `scale(${1.2 - 0.2 * t})`, filter: `blur(${(1 - t) * 8}px)`}}>{o.n}</div>
    </div>
  );
};

/* ---------- timeline tracker (top) for the Extended Look sequence ---------- */
export const Timeline: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len, 8);
  const t = ent(f, 8);
  const now = f / fps;
  const n = o.steps.length;
  let active = 0; o.steps.forEach((s: any, i: number) => { if (now >= s[1]) active = i; });
  const W = 1500;
  const prog = interpolate(now, o.steps.map((s: any) => s[1]), o.steps.map((_: any, i: number) => i / (n - 1)), clamp);
  return (
    <div style={{position: 'absolute', left: 960 - W / 2, top: 54, width: W, opacity: t * out, transform: `translateY(${(1 - t) * -30}px)`}}>
      <div style={{position: 'relative', height: 90, background: 'rgba(18,24,41,0.82)', borderRadius: 999, boxShadow: '0 14px 40px rgba(0,0,0,0.35)', padding: '0 60px'}}>
        <div style={{position: 'absolute', left: 80, right: 80, top: 43, height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 2}} />
        <div style={{position: 'absolute', left: 80, width: (W - 160) * prog, top: 43, height: 4, background: PINK, borderRadius: 2}} />
        {o.steps.map((s: any, i: number) => {
          const x = 80 + (W - 160) * (i / (n - 1));
          const on = now >= s[1];
          const cur = i === active;
          const pop = cur ? 1 + Math.max(0, 1 - (now - s[1]) * 4) * 0.3 : 1;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 45, transform: 'translate(-50%,-50%)'}}>
              <div style={{width: cur ? 30 : 20, height: cur ? 30 : 20, borderRadius: 30, background: on ? PINK : '#3a4258', border: '4px solid #fff', transform: `scale(${pop})`, margin: '0 auto'}} />
              <div style={{position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: BODY, fontWeight: 800, fontSize: cur ? 20 : 17, letterSpacing: '0.14em', color: cur ? '#fff' : 'rgba(255,255,255,0.55)'}}>{s[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- split screen (two clips, diagonal divider, names) ---------- */
export const Split: React.FC<{v: any; len: number}> = ({v, len}) => {
  const frame = useCurrentFrame();
  const {fps: realFps} = useVideoConfig();
  const t = frame / realFps;
  const [A, B] = v.split;
  const a = interpolate(t, [A.at || 0, (A.at || 0) + 0.45], [0, 1], {...clamp, easing: EO});
  const b = interpolate(t, [B.at || 0, (B.at || 0) + 0.45], [0, 1], {...clamp, easing: EO});
  const z = interpolate(t, [0, len / realFps], [1.04, 1.1], clamp);
  const side = (C: any, p: number, left: boolean) => (
    <div style={{position: 'absolute', top: 0, bottom: 0, left: left ? 0 : undefined, right: left ? undefined : 0, width: 1060, overflow: 'hidden',
      clipPath: left ? 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' : 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)', transform: `translateX(${(1 - p) * (left ? -1100 : 1100)}px)`}}>
      <OffthreadVideo src={staticFile(`clips/${C.clip}`)} muted style={{position: 'absolute', left: '50%', top: 0, height: 1080, width: 1920, transform: `translateX(-50%) translateX(${C.shift || 0}px) scale(${z * (C.scale || 1)})`, transformOrigin: C.origin || '50% 40%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(8,10,20,0.75) 100%)'}} />
      <div style={{position: 'absolute', bottom: 70, left: left ? 80 : undefined, right: left ? undefined : 80, textAlign: left ? 'left' : 'right', opacity: interpolate(t, [(C.at || 0) + 0.25, (C.at || 0) + 0.6], [0, 1], clamp)}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 110, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.95, textShadow: '0 6px 26px rgba(0,0,0,0.55)'}}>{C.name}</div>
        {C.role ? <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', color: PINK, marginTop: 12}}>{C.role}</div> : null}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#0c0f1c'}}>
      {side(A, a, true)}
      {side(B, b, false)}
      <div style={{position: 'absolute', left: 960 - 4, top: -40, bottom: -40, width: 8, background: PINK, transform: `rotate(6.3deg) scaleY(${Math.min(a, b)})`, boxShadow: `0 0 30px ${PINK}`}} />
      {v.mid ? (() => { const m = interpolate(t, [v.mid.at, v.mid.at + 0.4], [0, 1], {...clamp, easing: EO}); return (
        <div style={{position: 'absolute', left: 960, top: v.mid.y || 540, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * m})`, opacity: m, background: '#fff', borderRadius: 999, padding: '12px 34px', fontFamily: HEAD, fontWeight: 900, fontSize: 54, letterSpacing: '-0.03em', color: INK, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>{v.mid.text}</div>
      ); })() : null}
    </AbsoluteFill>
  );
};

/* ---------- cold open: fast punchy cuts with flashing words (handled as overlay) ---------- */
export const ColdWords: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const now = f / fps;
  let cur = -1; o.words.forEach((w: any, i: number) => { if (now >= w[1]) cur = i; });
  if (cur < 0) return null;
  const w = o.words[cur];
  const a = (now - w[1]) * fps;
  const t = ent(a, 4);
  const big = w[3] || 170;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: 'rgba(8,10,20,0.35)'}} />
      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: big, letterSpacing: '-0.05em', color: w[2] ? PINK : '#fff', lineHeight: 0.95, textAlign: 'center',
        transform: `scale(${1.25 - 0.25 * t + interpolate(a, [4, 18], [0, 0.04], clamp)})`, filter: `blur(${(1 - t) * 10}px)`, opacity: t, textShadow: '0 10px 40px rgba(0,0,0,0.6)', whiteSpace: 'pre-line'}}>{w[0]}</div>
    </AbsoluteFill>
  );
};
