import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame, Img, spring, Easing, OffthreadVideo} from 'remotion';
import J from './npc.json';
import {Kinetic, Stamp, Chapter, Split} from './Extras';
import {QuoteCard, Credit, PINK, HEAD, BODY, NAVY_DEEP, INK, useF} from './style';

export const FPS = 60;
const fps = 30;
const F = (s: number) => Math.round(s * FPS);
const XF = 0.2;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const enter = (f: number, d = 6) => interpolate(f, [0, d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const outF = (f: number, len: number, d = 7) => interpolate(f, [len - d, len], [1, 0], clamp);

/* ---------- footage ---------- */
const Shot: React.FC<{v: any; len: number; xf: number}> = ({v, len, xf}) => {
  const f = useCurrentFrame();
  const z = v.zoom || [1.0, 1.05];
  const s = interpolate(f, [0, len], [Math.min(z[0], 1.1), Math.min(z[1], 1.14)], {...clamp, easing: Easing.inOut(Easing.sin)}) * (v.blur ? 1.06 : 1);
  const fade = xf > 0 ? interpolate(f, [0, xf], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 1;
  const p = v.flash ? interpolate(f, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 1;
  const punch = 1 + (1 - p) * 0.1;
  const blur = (v.blur || 0) + (1 - p) * 14;
  const bright = 1 - (v.dim || 0) + (1 - p) * 0.35;
  if (v.split) return <AbsoluteFill style={{opacity: fade}}><Split v={v} len={len} /></AbsoluteFill>;
  const vol = v.audio ? (fr: number) => v.audio * interpolate(fr, [0, 6, len - 8, len], [0, 1, 1, 0], clamp) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000', opacity: fade}}>
      <OffthreadVideo src={staticFile(`clips/${v.clip}`)} muted={!v.audio} volume={vol as any} playbackRate={v.rate || 1} startFrom={Math.max(0, F(v.off) - xf)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s * punch})`, transformOrigin: v.origin || '50% 50%', filter: `blur(${blur}px) brightness(${bright})`}} />
    </AbsoluteFill>
  );
};

/* ---------- NPC subtitle: speaker tag + Spanish line + original line ---------- */
const NpcSub: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 15, stiffness: 170}});
  const out = outF(f, len, 6);
  const words = o.es.split(' ');
  const per = Math.max(1.2, Math.min(4, (len - 14) / words.length));
  return (
    <div style={{position: 'absolute', left: 960, bottom: 110, transform: `translateX(-50%) translateY(${(1 - s) * 50}px) scale(${0.95 + 0.05 * s})`, opacity: Math.min(1, s * 1.4) * out, textAlign: 'center'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: PINK, borderRadius: 10, padding: '8px 18px', fontFamily: BODY, fontWeight: 800, fontSize: 24, letterSpacing: '0.14em', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.35)'}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        {o.who}
      </div>
      <div style={{marginTop: 14, background: 'rgba(14,18,32,0.88)', borderRadius: 20, padding: '22px 40px 20px', maxWidth: 1500, boxShadow: '0 24px 60px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 58, letterSpacing: '-0.03em', lineHeight: 1.12, color: '#fff'}}>
          {words.map((w: string, i: number) => {
            const t = enter(f - 4 - i * per, 4);
            return <span key={i} style={{opacity: 0.25 + 0.75 * t, display: 'inline-block', marginRight: 14, transform: `translateY(${(1 - t) * 8}px)`}}>{w}</span>;
          })}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 600, fontStyle: 'italic', fontSize: 26, color: 'rgba(255,255,255,0.6)', marginTop: 8}}>"{o.en}"</div>
      </div>
    </div>
  );
};

/* ---------- police HUD: what the cops know ---------- */
const ICONS: Record<string, [string, string]> = {
  face: ['TU CARA', 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 22a9 9 0 0 1 18 0'],
  clothes: ['TU ROPA', 'M12 4a2 2 0 1 1 2 2c-1 .5-2 1-2 2l9 6a1.5 1.5 0 0 1-1 3H4a1.5 1.5 0 0 1-1-3l9-6'],
  car: ['TU COCHE', 'M5 17h14M3 13l2-6h14l2 6v5H3zM7 18v2M17 18v2M6.5 14.5h.01M17.5 14.5h.01'],
  pair: ['TU PAREJA', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-5-6'],
};
const Hud: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 16, stiffness: 160}});
  const out = outF(f, len);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, s * 1.4) * out}}>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: '0.2em', color: '#fff', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{width: 14, height: 14, borderRadius: 14, background: f % 30 < 15 ? '#ff4d4d' : '#4d7cff', boxShadow: '0 0 18px currentColor'}} />LO QUE SABE LA POLICÍA
      </div>
      <div style={{display: 'flex', gap: 36, transform: `translateY(${(1 - s) * 40}px)`}}>
        {o.on.map((k: string, i: number) => {
          const a = f - 6 - i * 7;
          const t = spring({frame: a, fps, config: {damping: 11, stiffness: 240}});
          const cleared = o.clear && o.clear.includes(k) && f > (o.clear_at || 3) * fps;
          const cl = cleared ? enter(f - (o.clear_at || 3) * fps, 6) : 0;
          const hot = o.focus || !o.clear ? 1 : 0.6;
          return (
            <div key={k} style={{width: 250, height: 280, borderRadius: 26, background: 'rgba(14,18,32,0.9)', border: `4px solid ${cleared ? 'rgba(255,255,255,0.15)' : PINK}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
              opacity: Math.max(0, Math.min(1, t)) * (1 - cl * 0.55), transform: `scale(${0.6 + 0.4 * Math.max(0, t)})`, boxShadow: cleared ? 'none' : `0 0 ${40 * hot}px rgba(255,61,134,0.45)`}}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={cleared ? 'rgba(255,255,255,0.4)' : '#fff'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[k][1]} /></svg>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 34, letterSpacing: '-0.02em', color: '#fff'}}>{ICONS[k][0]}</div>
              {cleared ? <div style={{position: 'absolute', fontFamily: HEAD, fontWeight: 900, fontSize: 46, color: '#7CFFB2', transform: `rotate(-10deg) scale(${1.6 - 0.6 * cl})`, opacity: cl}}>BORRADO</div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- numbered tip ---------- */
const Tip: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = enter(f, 6), t2 = enter(f - 5, 6), t3 = enter(f - 9, 6);
  const out = outF(f, len);
  const drift = interpolate(f, [0, len], [1, 1.035], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,14,28,0.7) 0%, rgba(10,14,28,0.2) 60%, transparent 85%)', opacity: out}}>
      <div style={{position: 'absolute', left: 110, top: 330, display: 'flex', alignItems: 'center', gap: 46, transform: `scale(${drift})`, transformOrigin: '0% 50%'}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 330, letterSpacing: '-0.06em', color: PINK, lineHeight: 0.8, opacity: t, transform: `scale(${1.25 - 0.25 * t})`, filter: `blur(${(1 - t) * 12}px)`, textShadow: '0 10px 40px rgba(0,0,0,0.4)'}}>{o.n}</div>
        <div>
          <div style={{display: 'inline-block', background: '#fff', color: INK, fontFamily: BODY, fontWeight: 800, fontSize: 22, letterSpacing: '0.18em', padding: '6px 14px', borderRadius: 6, opacity: t3}}>CONSEJO ZENTRA</div>
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, letterSpacing: '-0.045em', lineHeight: 0.98, color: '#fff', marginTop: 14, opacity: t2, transform: `translateX(${(1 - t2) * 40}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.5)', maxWidth: 1150}}>{o.text}</div>
          {o.sub ? <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.9)', marginTop: 16, opacity: t3}}>{o.sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- GTA V vs GTA VI card ---------- */
const Versus: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const out = outF(f, len);
  const col = (title: string, rows: string[], good: boolean, d: number) => {
    const t = spring({frame: f - d, fps, config: {damping: 15, stiffness: 170}});
    return (
      <div style={{width: 620, background: good ? 'rgba(255,61,134,0.16)' : 'rgba(14,18,32,0.88)', border: `3px solid ${good ? PINK : 'rgba(255,255,255,0.18)'}`, borderRadius: 26, padding: '34px 40px', opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 50}px)`}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 76, letterSpacing: '-0.04em', color: good ? PINK : '#fff'}}>{title}</div>
        {rows.map((r, i) => {
          const a = enter(f - d - 8 - i * 6, 6);
          return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 20, opacity: a, transform: `translateX(${(1 - a) * -20}px)`}}>
            <div style={{width: 40, height: 40, borderRadius: 10, background: good ? PINK : 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{good ? '✓' : '✕'}</div>
            <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', color: '#fff'}}>{r}</div>
          </div>;
        })}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{display: 'flex', gap: 60, alignItems: 'center'}}>
        {col('GTA V', ['4 frases por peatón', 'Nadie mira tu ropa', 'Ropa = decorado'], false, 0)}
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 70, color: '#fff', opacity: enter(f - 10)}}>VS</div>
        {col('GTA VI', ['Te comentan el outfit', 'Notan si no duermes', 'Ropa = pista policial'], true, 12)}
      </div>
    </AbsoluteFill>
  );
};

/* section opener */
const Section: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = enter(f, 6), t2 = enter(f - 6, 6), bar = interpolate(f, [4, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = outF(f, len);
  const drift = interpolate(f, [0, len], [1, 1.035], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,14,28,0.65) 0%, rgba(10,14,28,0.15) 55%, transparent 80%)', opacity: out}}>
      <div style={{position: 'absolute', left: 110, top: 400, transformOrigin: '0% 50%', transform: `scale(${drift})`}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 150, letterSpacing: '-0.05em', lineHeight: 0.92, color: '#fff', opacity: t, transform: `scale(${1.14 - 0.14 * t})`, transformOrigin: '0% 50%', filter: `blur(${(1 - t) * 10}px)`, textShadow: '0 8px 30px rgba(0,0,0,0.45)', maxWidth: 1500}}>{o.text}</div>
        <div style={{width: 160 * bar, height: 8, background: PINK, borderRadius: 4, marginTop: 22}} />
        {o.sub && <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: `${0.16 + (1 - t2) * 0.3}em`, color: '#fff', marginTop: 22, opacity: t2, textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>{o.sub}</div>}
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
      <div style={{transform: `scale(${drift})`, textAlign: 'center', marginTop: 30}}>
        <Img src={staticFile('gtavi_logo.png')} style={{height: 140, opacity: logo, transform: `scale(${1.2 - 0.2 * logo})`, filter: `blur(${(1 - logo) * 8}px)`}} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 132, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.95, marginTop: 34, opacity: t1, transform: `scale(${1.12 - 0.12 * t1})`, filter: `blur(${(1 - t1) * 8}px)`}}>LOS NPC TE JUZGAN</div>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, letterSpacing: '-0.04em', color: PINK, lineHeight: 1.0, marginTop: 6, opacity: t2, transform: `scale(${1.12 - 0.12 * t2})`, filter: `blur(${(1 - t2) * 8}px)`}}>POR TU ROPA</div>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: `${0.16 + (1 - t3) * 0.3}em`, color: 'rgba(255,255,255,0.88)', marginTop: 28, opacity: t3}}>LO QUE YA SABEMOS TRAS EL LANZAMIENTO</div>
      </div>
    </AbsoluteFill>
  );
};

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
        <div style={{display: 'inline-block', marginTop: 26, border: `5px solid ${PINK}`, color: PINK, borderRadius: 10, padding: '10px 30px', fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 52, letterSpacing: '0.06em', transform: `rotate(-2deg) scale(${s2})`, opacity: t2}}>O UN NPC SE REIRÁ DE TU ROPA</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{len: number}> = ({len}) => {
  const f = useF();
  const t = enter(f, 7), t2 = enter(f - 8, 7);
  const out = outF(f, len, 14);
  return (
    <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2a3150 0%, ${NAVY_DEEP} 62%, #0e1220 100%)`, alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{textAlign: 'center'}}>
        <Img src={staticFile('zentra_z.png')} style={{height: 230, opacity: t, transform: `scale(${1.15 - 0.15 * t})`, filter: `blur(${(1 - t) * 8}px)`}} />
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 120, letterSpacing: '-0.045em', color: '#fff', marginTop: 20, opacity: t2, transform: `scale(${1.1 - 0.1 * t2})`}}>NOS VEMOS EN LEONIDA</div>
      </div>
    </AbsoluteFill></AbsoluteFill>
  );
};


/* ---------- HOOK: typewriter on black ---------- */
const TypeOn: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const n = Math.floor(interpolate(f, [2, 2 + o.text.length * 1.3], [0, o.text.length], clamp));
  const out = outF(f, len, 4);
  const glitch = f % 9 < 2 ? 6 : 0;
  return (
    <AbsoluteFill style={{background: '#05060b', alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 84, letterSpacing: '0.04em', color: '#fff', textShadow: `${glitch}px 0 0 ${PINK}, ${-glitch}px 0 0 #3ee8ff`}}>
        {o.text.slice(0, n)}<span style={{opacity: f % 16 < 8 ? 1 : 0, color: PINK}}>█</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- HOOK: "NPC VISION" scanner over the player ---------- */
const lerpK = (k: number[][], t: number, i: number) => interpolate(t, k.map((x) => x[0]), k.map((x) => x[i]), clamp);
const NpcVision: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const t = f / fps;
  const cx = lerpK(o.box, t, 1), cy = lerpK(o.box, t, 2), w = o.w, h = o.h;
  const bIn = spring({frame: f - 4, fps, config: {damping: 13, stiffness: 200}});
  const scanY = ((f * 14) % 1200) - 60;
  const out = outF(f, len, 4);
  const corner = (r: number) => ({position: 'absolute' as const, width: 70, height: 70, borderColor: PINK, borderStyle: 'solid', borderWidth: 0, ...(r === 0 ? {left: 0, top: 0, borderLeftWidth: 8, borderTopWidth: 8} : r === 1 ? {right: 0, top: 0, borderRightWidth: 8, borderTopWidth: 8} : r === 2 ? {left: 0, bottom: 0, borderLeftWidth: 8, borderBottomWidth: 8} : {right: 0, bottom: 0, borderRightWidth: 8, borderBottomWidth: 8})});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: 'rgba(40,0,30,0.28)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: scanY, height: 60, background: 'linear-gradient(180deg, transparent, rgba(255,61,134,0.22), transparent)'}} />
      <div style={{position: 'absolute', left: 60, top: 50, fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{width: 18, height: 18, borderRadius: 18, background: f % 20 < 10 ? PINK : 'transparent', border: `3px solid ${PINK}`}} />NPC VISION · ESCANEANDO SUJETO
      </div>
      <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `scale(${1.25 - 0.25 * bIn})`, opacity: Math.min(1, bIn * 1.5)}}>
        {[0, 1, 2, 3].map((r) => <div key={r} style={corner(r)} />)}
        <div style={{position: 'absolute', left: 0, top: -54, background: PINK, color: '#fff', fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 26, padding: '6px 14px', letterSpacing: '0.1em'}}>SUJETO #0001</div>
      </div>
      <div style={{position: 'absolute', left: cx + w / 2 + 40, top: cy - h / 2 + 10}}>
        {o.tags.map((g: any, i: number) => {
          const a = f - g[2] * fps;
          const tt = enter(a, 5);
          const pct = g[1] ? Math.round(interpolate(a, [0, 14], [0, g[1]], clamp)) : null;
          return (
            <div key={i} style={{opacity: tt, transform: `translateX(${(1 - tt) * 30}px)`, marginBottom: 18, background: 'rgba(8,10,20,0.78)', borderLeft: `6px solid ${PINK}`, padding: '12px 22px', width: 560}}>
              <div style={{fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, fontSize: 30, color: '#fff', letterSpacing: '0.05em'}}>{g[0]}{pct !== null ? <span style={{color: PINK}}> {pct}%</span> : null}</div>
              {pct !== null ? <div style={{height: 8, background: 'rgba(255,255,255,0.15)', marginTop: 10}}><div style={{width: `${pct}%`, height: 8, background: PINK}} /></div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- HOOK: NPC line, big and centred ---------- */
const HookSub: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 9, stiffness: 300}});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120}}>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: '0.2em', color: '#fff', background: PINK, padding: '6px 16px', borderRadius: 8, marginBottom: 16, opacity: Math.min(1, s * 2)}}>NPC {o.n}/4</div>
      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 110, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', textAlign: 'center', maxWidth: 1650, transform: `scale(${1.3 - 0.3 * s})`, opacity: Math.min(1, s * 2), textShadow: '0 10px 40px rgba(0,0,0,0.7), 0 0 2px #000'}}>{o.text}</div>
    </AbsoluteFill>
  );
};

/* ---------- HOOK: giant verdict stamp over a frozen frame ---------- */
const Verdict: React.FC<{o: any; len: number}> = ({o, len}) => {
  const f = useF();
  const s = spring({frame: f, fps, config: {damping: 11, stiffness: 320}});
  const shake = f < 10 ? Math.sin(f * 2.6) * (10 - f) * 1.4 : 0;
  const t2 = enter(f - 8, 6);
  return (
    <AbsoluteFill style={{background: 'rgba(5,6,12,0.55)', alignItems: 'center', justifyContent: 'center', transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
      <div style={{border: `16px solid ${PINK}`, borderRadius: 26, padding: '20px 70px 12px', color: PINK, fontFamily: HEAD, fontWeight: 900, fontSize: 260, letterSpacing: '0.02em', lineHeight: 1, transform: `rotate(-7deg) scale(${2.4 - 1.4 * s})`, opacity: Math.min(1, s * 3), background: 'rgba(10,12,22,0.35)'}}>{o.text}</div>
      <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 40, letterSpacing: '0.2em', color: '#fff', marginTop: 50, opacity: t2}}>{o.sub}</div>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{o: any}> = ({o}) => {
  const len = (F(o.t1) - F(o.t0)) * fps / FPS;
  switch (o.type) {
    case 'kinetic': return <Kinetic o={o} len={len} />;
    case 'stamp': return <Stamp o={o} len={len} />;
    case 'chapter': return <Chapter o={o} len={len} />;
    case 'quote': return <QuoteCard kind={o.kind} lines={o.lines} source={o.source} x={o.x} y={o.y} dur={len} tilt={o.tilt} highlight={o.highlight} />;
    case 'section': return <Section o={o} len={len} />;
    case 'npcsub': return <NpcSub o={o} len={len} />;
    case 'hud': return <Hud o={o} len={len} />;
    case 'tip': return <Tip o={o} len={len} />;
    case 'versus': return <Versus o={o} len={len} />;
    case 'typeon': return <TypeOn o={o} len={len} />;
    case 'vision': return <NpcVision o={o} len={len} />;
    case 'hooksub': return <HookSub o={o} len={len} />;
    case 'verdict': return <Verdict o={o} len={len} />;
    case 'titlecard': return <TitleCard />;
    case 'subscribe': return <Subscribe len={len} />;
    case 'endcard': return <EndCard len={len} />;
  }
  return null;
};
const FULLSCREEN = new Set(['titlecard', 'subscribe', 'endcard', 'typeon', 'verdict']);

/* music: low under the voice, lower under NPC lines, up in the cold open / title / ending */
const bedVol = (m: any) => (f: number) => {
  const j = J as any;
  const t = m.t0 + f / FPS;
  const fade = Math.min(interpolate(t, [0, 0.05], [0, 1], clamp), interpolate(t, [m.t1 - 2.5, m.t1], [1, 0], clamp));
  const DUCK = 0.11, NPCV = 0.05, UP = 0.45;
  let lvl = DUCK;
  for (const [a, b] of j.duck) { if (t >= a - 0.3 && t <= b + 0.3) lvl = Math.min(lvl, Math.max(interpolate(t, [a - 0.3, a], [DUCK, NPCV], clamp), interpolate(t, [b, b + 0.3], [NPCV, DUCK], clamp))); }
  for (const [a, b] of j.swells) { if (t >= a - 0.8 && t <= b + 0.8) lvl = Math.max(lvl, Math.min(interpolate(t, [a - 0.8, a + 0.4], [DUCK, UP], {...clamp, easing: Easing.inOut(Easing.sin)}), interpolate(t, [b, b + 0.8], [UP, DUCK], {...clamp, easing: Easing.inOut(Easing.sin)}))); }
  if (t < j.cold) lvl = Math.min(lvl, j.duck.some(([a, b]: number[]) => t >= a && t <= b) ? NPCV * 2 : UP);
  return lvl * fade;
};

export const NFull: React.FC = () => {
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
      {j.video.map((v: any, i: number) => (
        <Sequence key={'cr' + i} from={F(v.t0)} durationInFrames={Math.max(1, F(v.t1) - F(v.t0))}><Credit text={v.credit} /></Sequence>
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
        <Sequence key={'vo' + i} from={F(v.at)} durationInFrames={Math.max(1, F(v.to) - F(v.from) + 6)}>
          <Audio src={staticFile(v.src)} startFrom={F(v.from)} endAt={F(v.to) + 6} volume={1} />
        </Sequence>
      ))}
      {j.sfx.map((s: any, i: number) => (
        <Sequence key={'s' + i} from={Math.max(0, F(s.t))}><Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FadeIn: React.FC = () => {
  const f = useF();
  return <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 10], [1, 0], {...clamp, easing: Easing.inOut(Easing.quad)})}} />;
};
