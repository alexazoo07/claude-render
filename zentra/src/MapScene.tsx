import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {PINK, HEAD, BODY, Pill} from './style';

/*
  Animated map scene. All coordinates are fractions of the map image (0..1).
  cam: keyframes [t (s from scene start), cx, cy, span] — span = visible width as a fraction of the map width.
  pins / paths / regions / net appear at their own times and stay glued to the map while the camera moves.
*/
type Cam = [number, number, number, number];
export type MapSpec = {
  img: string; w: number; h: number; cam: Cam[];
  pins?: {t: number; x: number; y: number; label: string; sub?: string; big?: boolean; q?: boolean}[];
  paths?: {t0: number; t1: number; pts: [number, number][]; color?: string; dash?: boolean; arrow?: boolean}[];
  regions?: {t: number; pts: [number, number][]; label?: string; lx?: number; ly?: number; color?: string}[];
  net?: {t0: number; t1: number; from_: [number, number]; to: [number, number][]} | null;
  title?: {t: number; text: string; sub?: string};
  tint?: string; source?: string; bg?: string; kind?: 'oficial' | 'fans' | 'previews' | 'teoria' | 'prensa';
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

const camAt = (cam: Cam[], t: number) => {
  if (t <= cam[0][0]) return cam[0];
  for (let i = 0; i < cam.length - 1; i++) {
    const a = cam[i], b = cam[i + 1];
    if (t <= b[0]) {
      const p = ease((t - a[0]) / Math.max(0.001, b[0] - a[0]));
      // zoom interpolated in log space so the speed feels constant
      const span = Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * p);
      return [t, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p, span] as Cam;
    }
  }
  return cam[cam.length - 1];
};

export const MapScene: React.FC<{m: MapSpec}> = ({m}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const [, cx, cy, span] = camAt(m.cam, t);
  const k = 1920 / (span * m.w); // screen px per map px
  const tx = 960 - cx * m.w * k, ty = 540 - cy * m.h * k;
  const inv = 1 / k; // to keep labels a constant size on screen
  const appear = (t0: number, d = 0.35) => interpolate(t, [t0, t0 + d], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const P = (x: number, y: number) => `${x * m.w},${y * m.h}`;
  return (
    <AbsoluteFill style={{background: m.bg || '#0d1424', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: m.w, height: m.h, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${k})`}}>
        <Img src={staticFile(m.img)} style={{width: m.w, height: m.h, display: 'block', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 3%, #000 97%, transparent 100%)', WebkitMaskComposite: 'source-in', maskComposite: 'intersect'} as any} />
        {m.tint ? <div style={{position: 'absolute', inset: 0, background: m.tint, mixBlendMode: 'multiply'}} /> : null}
        <svg width={m.w} height={m.h} viewBox={`0 0 ${m.w} ${m.h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {(m.regions || []).map((r, i) => {
            const a = appear(r.t, 0.5);
            const pulse = 0.18 + 0.08 * Math.sin((t - r.t) * 3);
            return <polygon key={'r' + i} points={r.pts.map(([x, y]) => P(x, y)).join(' ')} fill={r.color || PINK} fillOpacity={a * pulse} stroke={r.color || PINK} strokeWidth={4 * inv} strokeOpacity={a} strokeLinejoin="round" />;
          })}
          {(m.paths || []).map((p, i) => {
            const pr = interpolate(t, [p.t0, p.t1], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
            const pts = p.pts.map(([x, y]) => [x * m.w, y * m.h]);
            let L = 0; for (let j = 1; j < pts.length; j++) L += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
            const d = pts.map((q, j) => (j ? 'L' : 'M') + q[0] + ' ' + q[1]).join(' ');
            return (
              <g key={'p' + i} opacity={pr > 0 ? 1 : 0}>
                <path d={d} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={13 * inv} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L * pr} ${L}`} />
                <path d={d} fill="none" stroke={p.color || PINK} strokeWidth={8 * inv} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L * pr} ${L}`} />
              </g>
            );
          })}
          {m.net ? m.net.to.map(([x, y], i) => {
            const t0 = m.net!.t0 + (m.net!.t1 - m.net!.t0) * (i / m.net!.to.length);
            const pr = interpolate(t, [t0, t0 + 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
            const [fx, fy] = m.net!.from_;
            const mx = (fx + x) / 2 * m.w, my = (fy + y) / 2 * m.h - Math.hypot((x - fx) * m.w, (y - fy) * m.h) * 0.25;
            const L = Math.hypot((x - fx) * m.w, (y - fy) * m.h) * 1.15;
            return (
              <g key={'n' + i} opacity={pr > 0 ? 1 : 0}>
                <path d={`M${fx * m.w} ${fy * m.h} Q${mx} ${my} ${x * m.w} ${y * m.h}`} fill="none" stroke={PINK} strokeWidth={5 * inv} strokeDasharray={`${L * pr} ${L}`} strokeLinecap="round" />
                <circle cx={x * m.w} cy={y * m.h} r={(10 + 6 * Math.sin(t * 5 + i)) * inv * pr} fill={PINK} />
              </g>
            );
          }) : null}
        </svg>
        {(m.pins || []).map((p, i) => {
          const a = appear(p.t);
          if (a <= 0) return null;
          return (
            <div key={'pin' + i} style={{position: 'absolute', left: p.x * m.w, top: p.y * m.h, transform: `scale(${inv})`, transformOrigin: '0 0'}}>
              <div style={{position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 28, background: PINK, border: '4px solid #fff', boxShadow: '0 4px 14px rgba(0,0,0,0.45)', transform: `scale(${a})`}} />
              <div style={{position: 'absolute', left: -14 - 30 * (1 - a), top: -14 - 30 * (1 - a), width: 28 + 60 * (1 - a), height: 28 + 60 * (1 - a), borderRadius: 99, border: `3px solid ${PINK}`, opacity: (1 - a) * 0.9}} />
              <div style={{position: 'absolute', left: 28, top: -34, opacity: a, transform: `translateX(${(1 - a) * -16}px)`, whiteSpace: 'nowrap'}}>
                <div style={{background: '#fff', borderRadius: 12, padding: p.big ? '10px 20px' : '7px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', display: 'inline-block'}}>
                  <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: p.big ? 48 : 34, letterSpacing: '-0.035em', color: '#121829'}}>{p.q ? '¿' : ''}{p.label}{p.q ? '?' : ''}</div>
                  {p.sub ? <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: '0.14em', color: PINK, marginTop: 2}}>{p.sub}</div> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* soft vignette keeps it cinematic */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(5,8,18,0.55) 100%)'}} />
      {m.title ? (() => {
        const a = appear(m.title.t, 0.45);
        return (
          <div style={{position: 'absolute', left: 96, top: 90, opacity: a, transform: `scale(${1.1 - 0.1 * a})`, transformOrigin: '0 0', filter: `blur(${(1 - a) * 10}px)`}}>
            <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, letterSpacing: '-0.045em', color: '#fff', lineHeight: 0.95, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>{m.title.text}</div>
            {m.title.sub ? <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 26, letterSpacing: '0.16em', color: '#fff', marginTop: 14, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>{m.title.sub}</div> : null}
          </div>
        );
      })() : null}
      {m.kind ? <div style={{position: 'absolute', right: 60, top: 60}}><Pill kind={m.kind} scale={1.3} /></div> : null}
      <div style={{position: 'absolute', right: 30, bottom: 26, textAlign: 'right', fontFamily: BODY, fontWeight: 800, fontSize: 15, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 6px rgba(0,0,0,0.8)'}}>{m.source || 'MAPA BASE: COMUNIDAD GTA VI'}</div>
    </AbsoluteFill>
  );
};
