import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame, Img, spring, Easing, OffthreadVideo} from 'remotion';
import J from './beats.json';
import {MapScene} from './MapScene';
import {BigTitle, Label, Badge, Shout, QuoteCard, Credit, RecOverlay, GlassCard, Checklist, Pill, PINK, HEAD, BODY, NAVY_DEEP, INK, useF} from './style';

export const FPS = 60;
const fps = 30; // overlay animation units (see useF)
const F = (s: number) => Math.round(s * FPS);
const XF = 0.2; // cross-dissolve between shots (s)
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CREDIT = 'GTA VI · AN EXTENDED LOOK · ROCKSTAR GAMES';

/* ---------- footage: one pre-cut clip per shot, eased push-in, cross-dissolve in, soft punch-in on fast cuts ---------- */
const Shot: React.FC<{v: any; len: number; xf: number}> = ({v, len, xf}) => {
  const f = useCurrentFrame();
  const z = v.zoom || [1.0, 1.05];
  const zs = Math.min(z[0], 1.1), ze = Math.min(z[1], 1.14);
  const s = interpolate(f, [0, len], [zs, ze], {...clamp, easing: Easing.inOut(Easing.sin)}) * (v.blur ? 1.06 : 1);
  const fade = xf > 0 ? interpolate(f, [0, xf], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 1;
  const p = v.flash ? interpolate(f, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 1;
  const punch = 1 + (1 - p) * 0.1;
  const blur = (v.blur || 0) + (1 - p) * 14;
  const bright = 1 - (v.dim || 0) + (1 - p) * 0.35;
  if (v.map) return <AbsoluteFill style={{opacity: fade}}><MapScene m={v.map} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000', opacity: fade}}>
      <OffthreadVideo src={staticFile(`clips/${v.clip}`)} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s * punch})`, transformOrigin: v.origin || '50% 50%', filter: `blur(${blur}px) brightness(${bright})`}} />
    </AbsoluteFill>
  );
};

const enter = (f: number, d = 5) => interpolate(f, [0, d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

/* section opener: big left title with pink bar (LEONIDA / LA FLORIDA DE ROCKSTAR) */
const Section: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = enter(f, 6), t2 = enter(f - 6, 6), bar = interpolate(f, [4, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  const drift = interpolate(f, [0, len], [1, 1.035], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,14,28,0.65) 0%, rgba(10,14,28,0.15) 55%, transparent 80%)', opacity: out}}>
      <div style={{position: 'absolute', left: 110, top: 420, transformOrigin: '0% 50%', transform: `scale(${drift})`}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 168, letterSpacing: '-0.05em', lineHeight: 0.92, color: '#fff', opacity: t, transform: `scale(${1.14 - 0.14 * t})`, transformOrigin: '0% 50%', filter: `blur(${(1 - t) * 10}px)`, textShadow: '0 8px 30px rgba(0,0,0,0.45)'}}>{o.text}</div>
        <div style={{width: 160 * bar, height: 8, background: PINK, borderRadius: 4, marginTop: 22}} />
        {o.sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: `${0.16 + (1 - t2) * 0.3}em`, color: '#fff', marginTop: 22, opacity: t2, textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>{o.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* source legend rows (★ OFICIAL — LO DIJO ROCKSTAR …) */
const Legend: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 300, top: 330, opacity: out}}>
      {o.rows.map((r: any, i: number) => {
        const a = f - (r[2] - (o.relStart || 0)) * fps;
        const t = enter(a, 6);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, height: 96, opacity: t, transform: `translateX(${(1 - t) * -40}px) scale(${1.08 - 0.08 * t})`, transformOrigin: '0% 50%'}}>
            <Pill kind={r[0]} scale={1.7} />
            <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 52, letterSpacing: '-0.035em', color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,0.5)'}}>{r[1]}</div>
          </div>
        );
      })}
    </div>
  );
};

/* navy panel with ticked rows (recap / "lo que la hace la primera") */
const Panel: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 16, stiffness: 150}});
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - s) * 70}px) scale(${0.94 + 0.06 * s})`, opacity: Math.min(1, s * 1.5) * out}}>
      <div style={{background: 'rgba(26,32,52,0.93)', borderRadius: 22, padding: '44px 56px 40px', width: 1080, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 64, letterSpacing: '-0.04em', color: '#fff'}}>{o.title}</div>
        <div style={{width: 80, height: 6, background: PINK, borderRadius: 3, marginTop: 12, marginBottom: 26}} />
        {o.rows.map((r: string, i: number) => {
          const a = f - o.times[i] * fps;
          const t = enter(a, 6);
          const chk = interpolate(a, [4, 9], [0, 1], clamp);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, height: 78, opacity: t, transform: `translateX(${(1 - t) * -30}px)`}}>
              <div style={{width: 44, height: 44, borderRadius: 9, border: '3px solid rgba(255,255,255,0.8)', background: chk > 0.5 ? PINK : 'transparent', borderColor: chk > 0.5 ? PINK : 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30, fontWeight: 900, transform: `scale(${1 + Math.sin(Math.min(chk, 1) * Math.PI) * 0.15})`}}>{chk > 0.5 ? '✓' : ''}</div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 46, letterSpacing: '-0.03em', color: '#fff'}}>{r}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* closeness scale: 4 pink hearts filling */
const Scale: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = enter(f, 6);
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  const lvl = interpolate(f, [10, len - 20], [0, 4], clamp);
  return (
    <div style={{position: 'absolute', left: 960, top: 820, transform: `translate(-50%,-50%) scale(${1.1 - 0.1 * t})`, opacity: t * out, textAlign: 'center'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 22, background: 'rgba(26,32,52,0.88)', borderRadius: 26, padding: '22px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.45)'}}>
        <Pill kind="previews" scale={1.2} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 54, letterSpacing: '-0.035em', color: '#fff'}}>{o.label}</div>
        <div style={{display: 'flex', gap: 14}}>
          {[0, 1, 2, 3].map((i) => {
            const on = Math.max(0, Math.min(1, lvl - i));
            return <div key={i} style={{fontSize: 54, color: on > 0.5 ? PINK : 'rgba(255,255,255,0.25)', transform: `scale(${1 + Math.sin(on * Math.PI) * 0.35})`, lineHeight: 1}}>♥</div>;
          })}
        </div>
      </div>
    </div>
  );
};

/* criminal profile meter */
const Meter: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 16, stiffness: 150}});
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  const pos = 0.5 + 0.38 * Math.sin(f / 22);
  return (
    <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4) * out}}>
      <div style={{background: 'rgba(26,32,52,0.93)', borderRadius: 24, padding: '40px 56px 48px', width: 1180, boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}><Pill kind="oficial" scale={1.2} /><div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 70, letterSpacing: '-0.04em', color: '#fff'}}>{o.title}</div></div>
        <div style={{position: 'relative', height: 26, borderRadius: 13, marginTop: 50, background: `linear-gradient(90deg, #5ee7ff, #ffffff 50%, ${PINK})`}}>
          <div style={{position: 'absolute', left: `${pos * 100}%`, top: -16, width: 10, height: 58, borderRadius: 5, background: '#fff', boxShadow: '0 0 0 4px rgba(26,32,52,1)', transform: 'translateX(-50%)'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 26, fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: '0.14em', color: '#fff'}}>
          <span>{o.left}</span><span>{o.right}</span>
        </div>
      </div>
    </div>
  );
};

/* theory card: TEORÍA pill + big number + statement */
const Theory: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = enter(f, 6), t2 = enter(f - 5, 6);
  const out = interpolate(f, [len - 7, len], [1, 0], clamp);
  const drift = interpolate(f, [0, len], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, transform: `scale(${drift})`}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 330, letterSpacing: '-0.06em', color: PINK, lineHeight: 0.8, opacity: t, transform: `scale(${1.2 - 0.2 * t})`, filter: `blur(${(1 - t) * 12}px)`, textShadow: '0 10px 40px rgba(0,0,0,0.4)'}}>#{o.n}</div>
        <div style={{opacity: t2, transform: `translateX(${(1 - t2) * 30}px)`}}>
          <Pill kind="teoria" scale={1.5} />
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 110, letterSpacing: '-0.045em', lineHeight: 0.95, color: '#fff', marginTop: 20, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>{o.text.map((x: string, i: number) => <div key={i}>{x}</div>)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 13 años counter (from the hook) */
const Counter: React.FC<{len: number}> = ({len}) => {
  const f = useF();
  const years = [2013, 2014, 2015, 2017, 2018, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const p = interpolate(f, [4, 52], [0, years.length - 1], {...clamp, easing: Easing.in(Easing.quad)});
  const t = enter(f, 5), subT = interpolate(f, [54, 60], [0, 1], clamp);
  const out = interpolate(f, [len - 6, len], [1, 0], clamp);
  const done = f >= 52; const pop = done ? spring({frame: f - 52, fps, config: {damping: 9, stiffness: 260}}) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{textAlign: 'center', opacity: t, transform: `scale(${(1.15 - 0.15 * t) * (1 + (done ? pop * 0.06 - 0.06 : 0))})`, filter: `blur(${(1 - t) * 10}px)`}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 210, letterSpacing: '-0.05em', color: '#fff', lineHeight: 0.95, textShadow: '0 8px 40px rgba(0,0,0,0.45)'}}>{years[Math.round(p)]}</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: `${0.16 + (1 - subT) * 0.3}em`, color: '#fff', opacity: subT, marginTop: 14}}>13 AÑOS ESPERANDO</div>
      </div>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const f = useF();
  const a = (d: number) => enter(f - d, 7);
  const logo = a(2), t1 = a(9), t2 = a(15), t3 = a(22);
  const drift = interpolate(f, [0, 150], [1, 1.03], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2a3150 0%, ${NAVY_DEEP} 62%, #0e1220 100%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${drift})`, textAlign: 'center', marginTop: 40}}>
        <Img src={staticFile('gtavi_logo.png')} style={{height: 150, opacity: logo, transform: `scale(${1.2 - 0.2 * logo})`, filter: `blur(${(1 - logo) * 8}px)`}} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 132, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.95, marginTop: 34, opacity: t1, transform: `scale(${1.12 - 0.12 * t1})`, filter: `blur(${(1 - t1) * 8}px)`}}>JASON Y LUCÍA</div>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 92, letterSpacing: '-0.04em', color: PINK, lineHeight: 1.0, marginTop: 6, opacity: t2, transform: `scale(${1.12 - 0.12 * t2})`, filter: `blur(${(1 - t2) * 8}px)`}}>SU HISTORIA EXPLICADA</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: `${0.16 + (1 - t3) * 0.3}em`, color: 'rgba(255,255,255,0.88)', marginTop: 28, opacity: t3}}>TODO LO QUE SABEMOS ANTES DEL LANZAMIENTO</div>
      </div>
    </AbsoluteFill>
  );
};

/* SUSCRÍBETE card on paper (the reference's "o el gatito llora") */
const Subscribe: React.FC<{len: number}> = ({len}) => {
  const f = useF();
  const t = enter(f, 6), t2 = enter(f - 8, 6);
  const s2 = spring({frame: f - 8, fps, config: {damping: 10, stiffness: 200}});
  return (
    <AbsoluteFill style={{background: '#f4f2ee', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 150, top: 0, bottom: 0, width: 3, background: 'rgba(255,61,134,0.35)'}} />
      <div style={{position: 'absolute', right: 150, top: 0, bottom: 0, width: 3, background: 'rgba(255,61,134,0.35)'}} />
      <div style={{textAlign: 'center'}}>
        <Img src={staticFile('zentra_z.png')} style={{height: 190, opacity: t, filter: 'invert(1)', marginBottom: 6}} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 170, letterSpacing: '-0.05em', color: INK, lineHeight: 0.95, opacity: t, transform: `scale(${1.12 - 0.12 * t})`, filter: `blur(${(1 - t) * 8}px)`}}>SUSCRÍBETE</div>
        <div style={{display: 'inline-block', marginTop: 26, border: `5px solid ${PINK}`, color: PINK, borderRadius: 10, padding: '10px 30px', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 52, letterSpacing: '0.06em', transform: `rotate(-2deg) scale(${s2})`, opacity: t2}}>O LUCÍA TE ROBA EL COCHE</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{len: number}> = ({len}) => {
  const f = useF();
  const t = enter(f, 7), t2 = enter(f - 8, 7);
  const out = interpolate(f, [len - 14, len], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2a3150 0%, ${NAVY_DEEP} 62%, #0e1220 100%)`, alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{textAlign: 'center'}}>
        <Img src={staticFile('zentra_z.png')} style={{height: 230, opacity: t, transform: `scale(${1.15 - 0.15 * t})`, filter: `blur(${(1 - t) * 8}px)`}} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 120, letterSpacing: '-0.045em', color: '#fff', marginTop: 20, opacity: t2, transform: `scale(${1.1 - 0.1 * t2})`}}>NOS VEMOS EN LEONIDA</div>
      </div>
    </AbsoluteFill></AbsoluteFill>
  );
};

const Overlay: React.FC<{o: any}> = ({o}) => {
  const len = (F(o.t1) - F(o.t0)) * fps / FPS;
  switch (o.type) {
    case 'label': return <Label text={o.text} sub={o.sub || undefined} dur={len} size={o.size} />;
    case 'big': return <BigTitle text={o.text} sub={o.sub || undefined} dur={len} size={o.size} color={o.color} />;
    case 'shout': return <Shout text={o.text} dur={len} y={o.y} size={o.size} color={o.color} />;
    case 'badge': return <Badge text={o.text} sub={o.sub || undefined} x={o.x} y={o.y} dur={len} size={o.size} />;
    case 'quote': return <QuoteCard kind={o.kind} lines={o.lines} source={o.source} x={o.x} y={o.y} dur={len} tilt={o.tilt} highlight={o.highlight} />;
    case 'rec': return <RecOverlay box={o.box} tag={o.tag} dur={len} />;
    case 'glass': return <GlassCard img={o.img} kind={o.kind} title={o.title} x={o.x} y={o.y} w={o.w} rot={o.rot} delay={0} dur={len} />;
    case 'checklist': return <Checklist title={o.title} tag={o.tag} rows={o.rows} dur={len} />;
    case 'section': return <Section o={o} len={len} />;
    case 'legend': return <Legend o={{...o, relStart: o.t0 - (J as any).starts.p2}} len={len} />;
    case 'panel': return <Panel o={o} len={len} />;
    case 'scale': return <Scale o={o} len={len} />;
    case 'meter': return <Meter o={o} len={len} />;
    case 'theory': return <Theory o={o} len={len} />;
    case 'counter': return <Counter len={len} />;
    case 'titlecard': return <TitleCard />;
    case 'subscribe': return <Subscribe len={len} />;
    case 'endcard': return <EndCard len={len} />;
  }
  return null;
};

const FULLSCREEN = new Set(['titlecard', 'subscribe', 'endcard']);

/* music: each bed fades in/out over 3 s; everything ducks under the voice and swells on the title / ending */
const bedVol = (m: any) => (f: number) => {
  const t = m.t0 + f / FPS;
  const fade = Math.min(interpolate(t, [m.t0, m.t0 + 0.05], [0, 1], clamp), interpolate(t, [m.t1 - 3, m.t1], [1, 0], clamp));
  const DUCK = 0.3, UP = 0.62;
  let lvl = DUCK;
  if (t < 1.2) lvl = interpolate(t, [0, 0.4, 1.2], [0, UP, DUCK], clamp);
  for (const [a, b] of (J as any).swells) { if (t >= a - 1 && t <= b + 1) lvl = Math.max(lvl, Math.min(interpolate(t, [a - 1, a + 0.6], [DUCK, UP], {...clamp, easing: Easing.inOut(Easing.sin)}), interpolate(t, [b, b + 1], [UP, DUCK], {...clamp, easing: Easing.inOut(Easing.sin)}))); }
  return lvl * fade;
};

export const Full: React.FC = () => {
  const j = J as any;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {j.video.map((v: any, i: number) => {
        const xf = i === 0 || v.flash || v.hard ? 0 : F(XF);
        const from = F(v.t0) - xf;
        return (
          <Sequence key={'v' + i} from={from} durationInFrames={Math.max(1, F(v.t1) - from)}>
            <Shot v={v} len={F(v.t1) - from} xf={xf} />
          </Sequence>
        );
      })}
      {j.video.filter((v: any) => !v.map).map((v: any, i: number) => (
        <Sequence key={'cr' + i} from={F(v.t0)} durationInFrames={Math.max(1, F(v.t1) - F(v.t0))}><Credit text={CREDIT} /></Sequence>
      ))}
      {j.overlays.map((o: any, i: number) => (
        <Sequence key={'o' + i} from={F(o.t0)} durationInFrames={Math.max(1, F(o.t1) - F(o.t0))}>
          {FULLSCREEN.has(o.type) ? <Overlay o={o} /> : <AbsoluteFill><Overlay o={o} /></AbsoluteFill>}
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={F(0.35)}><FadeIn /></Sequence>
      {j.music.map((m: any, i: number) => (
        <Sequence key={'m' + i} from={F(m.t0)} durationInFrames={F(m.t1) - F(m.t0)}>
          <Audio src={staticFile(m.src)} startFrom={F(m.off)} volume={bedVol(m)} />
        </Sequence>
      ))}
      {j.voice.map((v: any, i: number) => (
        <Sequence key={'vo' + i} from={F(v.at)}><Audio src={staticFile(v.src)} volume={1} /></Sequence>
      ))}
      {j.sfx.map((s: any, i: number) => (
        <Sequence key={'s' + i} from={F(s.t)}><Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FadeIn: React.FC = () => {
  const f = useF();
  return <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.inOut(Easing.quad)})}} />;
};
