import React from 'react';
import { C } from './theme';
import type { Mood } from './builder';

// Cara "kawaii expresiva": ojos grandes con contorno grueso (estilo pegatina) + coloretes.
// viewBox -100..100. `t` = segundos (parpadeo/animaciones), `seed` desincroniza.
const INK = C.ink;

const Eye: React.FC<{ x: number; look: number; ly?: number; blink: number; r?: number; veins?: boolean; pupil?: number }> = ({ x, look, ly = 0, blink, r = 1, veins, pupil = 1 }) => (
  <g transform={`translate(${x},-12) scale(1,${blink})`}>
    <ellipse rx={25 * r} ry={29 * r} fill="#fff" stroke={INK} strokeWidth={7} />
    {veins && (
      <g stroke="#E2453C" strokeWidth={2.4} fill="none" strokeLinecap="round">
        <path d={`M${-20 * r},${6 * r} l8,-3 l4,5`} />
        <path d={`M${18 * r},${10 * r} l-7,-4 l-2,6`} />
        <path d={`M${-6 * r},${24 * r} l2,-7 l6,-1`} />
      </g>
    )}
    <circle cx={look * 9} cy={4 + ly * 9} r={12 * r * pupil} fill={INK} />
    <circle cx={look * 9 + 4.5} cy={-1.5 + ly * 9} r={4.2 * r} fill="#fff" />
  </g>
);

export const FaceSvg: React.FC<{ mood: Mood; t: number; seed?: number; size: number; gaze?: [number, number] }> = ({ mood, t, seed = 0, size, gaze }) => {
  const ph = (t + seed * 0.37) % 3.4;
  const blink = ph < 0.12 ? Math.max(0.08, Math.abs(ph - 0.06) / 0.06) : 1;
  const look = gaze ? gaze[0] : Math.sin((t + seed) * 0.9) * 0.6;
  const ly = gaze ? gaze[1] : 0;
  const bob = Math.sin((t + seed) * 3.1) * 2;
  const blush = (
    <g fill={C.pink} opacity={0.75}>
      <ellipse cx={-50} cy={20} rx={13} ry={8} />
      <ellipse cx={50} cy={20} rx={13} ry={8} />
    </g>
  );
  let body: React.ReactNode = null;
  const arcEyes = (
    <g stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round">
      <path d="M-50,-8 Q-32,-34 -14,-8" />
      <path d="M14,-8 Q32,-34 50,-8" />
    </g>
  );
  switch (mood) {
    // ---- expresiones exageradas (miniaturas y momentos clave) ----
    case 'terror':
      body = (
        <>
          {[-34, 34].map((x) => (
            <g key={x} transform={`translate(${x},-14)`}>
              <ellipse rx={30} ry={36} fill="#fff" stroke={INK} strokeWidth={8} />
              <circle cx={look * 4} cy={2} r={6.5} fill={INK} />
            </g>
          ))}
          <g stroke={INK} strokeWidth={8} strokeLinecap="round" fill="none">
            <path d="M-64,-62 Q-40,-80 -14,-66" />
            <path d="M14,-66 Q40,-80 64,-62" />
          </g>
          <g stroke="#6E8CFF" strokeWidth={4} strokeLinecap="round" opacity={0.8}><path d="M-20,-92 v14 M0,-95 v16 M20,-92 v14" /></g>
          <rect x={-34} y={28} width={68} height={30} rx={8} fill="#fff" stroke={INK} strokeWidth={7} />
          <path d={`M-34,43 ${Array.from({ length: 8 }, (_, i) => `L${-34 + (i + 0.5) * 8.5},${43 + (i % 2 ? 6 : -6)}`).join(' ')} L34,43`} stroke={INK} strokeWidth={4} fill="none" />
          <path d="M-17,28 V58 M0,28 V58 M17,28 V58" stroke={INK} strokeWidth={3.5} />
          <path d="M70,-40 q12,22 0,32 q-12,-10 0,-32" fill="#7CC8FF" stroke={INK} strokeWidth={4} />
          <path d="M-74,-20 q10,18 0,26 q-10,-8 0,-26" fill="#7CC8FF" stroke={INK} strokeWidth={4} />
        </>
      );
      break;
    case 'cry':
      body = (
        <>
          {[-34, 34].map((x) => (
            <g key={x} transform={`translate(${x},-14)`}>
              <ellipse rx={28} ry={32} fill="#fff" stroke={INK} strokeWidth={8} />
              <circle cx={0} cy={6} r={19} fill="#2D3A8C" />
              <circle cx={0} cy={6} r={12} fill={INK} />
              <circle cx={6} cy={-2} r={7} fill="#fff" />
              <circle cx={-7} cy={14} r={3.5} fill="#fff" />
              <path d="M-26,18 Q0,40 26,18" fill="#9ED8FF" opacity={0.85} />
            </g>
          ))}
          <g stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none">
            <path d="M-60,-56 L-16,-66" />
            <path d="M16,-66 L60,-56" />
          </g>
          {/* ríos de lágrimas */}
          {[-46, 46].map((x) => (
            <path key={x} d={`M${x - 9},12 C${x - 14},40 ${x + 10},60 ${x - 4},${96 + 5 * Math.sin(t * 6)} L${x + 10},${96 + 5 * Math.sin(t * 6)} C${x + 22},60 ${x},40 ${x + 9},12 Z`} fill="#6EC3FF" stroke={INK} strokeWidth={3} opacity={0.95} />
          ))}
          <path d="M-22,48 Q-11,34 0,46 Q11,34 22,48" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
        </>
      );
      break;
    case 'evil':
      body = (
        <>
          {[-34, 34].map((x) => (
            <g key={x} transform={`translate(${x},-10)`}>
              <ellipse rx={26} ry={24} fill="#fff" stroke={INK} strokeWidth={7} />
              <circle cx={x < 0 ? 6 : -6} cy={4} r={10} fill={INK} />
              <path d={x < 0 ? 'M-32,-6 L30,6 L30,-30 L-32,-30 Z' : 'M32,-6 L-30,6 L-30,-30 L32,-30 Z'} fill={INK} />
            </g>
          ))}
          <path d="M-46,24 Q0,74 46,24 Q0,44 -46,24 Z" fill={INK} />
          <path d="M-36,30 Q0,46 36,30 L30,38 Q0,50 -30,38 Z" fill="#fff" />
        </>
      );
      break;
    case 'dots':
      body = (
        <g fill={INK}>
          <ellipse cx={-22} cy={-4} rx={9} ry={13 * blink} />
          <ellipse cx={22} cy={-4} rx={9} ry={13 * blink} />
        </g>
      );
      break;
    case 'sleep':
      body = (
        <g stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85}>
          <path d="M-46,-6 Q-30,8 -14,-6" />
          <path d="M14,-6 Q30,8 46,-6" />
        </g>
      );
      break;
    case 'happy':
      body = (
        <>
          {arcEyes}
          {blush}
          <path d="M-16,18 Q0,40 16,18 Z" fill={INK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-7,30 Q0,36 7,30" fill="#F06B7E" />
        </>
      );
      break;
    case 'proud':
      body = (
        <>
          {arcEyes}
          {blush}
          <path d="M-30,16 Q0,52 30,16 Z" fill={INK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-22,20 L22,20 L18,27 L-18,27 Z" fill="#fff" />
          <path d="M-10,38 Q0,44 10,38" fill="#F06B7E" />
          <g fill={C.gold} stroke={INK} strokeWidth={3}>
            <path transform={`translate(66,-48) scale(${0.8 + 0.2 * Math.sin(t * 6)})`} d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z" />
          </g>
        </>
      );
      break;
    case 'wow':
      body = (
        <>
          <Eye x={-32} look={look} ly={ly} blink={blink} r={1.05} />
          <Eye x={32} look={look} ly={ly} blink={blink} r={1.05} />
          {blush}
          <ellipse cy={34} rx={11} ry={14} fill={INK} />
          <ellipse cy={40} rx={6} ry={5} fill="#F06B7E" />
        </>
      );
      break;
    case 'worried':
      body = (
        <>
          <Eye x={-32} look={-0.3} blink={blink} r={0.95} pupil={0.8} />
          <Eye x={32} look={-0.3} blink={blink} r={0.95} pupil={0.8} />
          <g stroke={INK} strokeWidth={6} strokeLinecap="round">
            <path d="M-52,-50 L-16,-58" />
            <path d="M16,-58 L52,-50" />
          </g>
          <path d="M-22,34 Q-11,24 0,34 Q11,24 22,34" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M58,-30 q8,14 0,20 q-8,-6 0,-20" fill="#7CC8FF" stroke={INK} strokeWidth={3} />
        </>
      );
      break;
    case 'shocked':
      body = (
        <>
          <Eye x={-32} look={0} blink={1} r={1.2} veins pupil={0.65} />
          <Eye x={32} look={0} blink={1} r={1.2} veins pupil={0.65} />
          <path d="M-26,24 L26,24 L20,58 Q0,66 -20,58 Z" fill={INK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-20,28 L20,28 L18,35 L-18,35 Z" fill="#fff" />
          <path d="M-12,48 Q0,74 12,48 Z" fill="#F57D93" stroke={INK} strokeWidth={3} />
          <path d="M60,-44 q10,18 0,26 q-10,-8 0,-26" fill="#7CC8FF" stroke={INK} strokeWidth={3} />
          <path d="M-64,-34 q8,14 0,20 q-8,-6 0,-20" fill="#7CC8FF" stroke={INK} strokeWidth={3} />
        </>
      );
      break;
    case 'sad':
      body = (
        <>
          <Eye x={-32} look={0} blink={blink} r={1} />
          <Eye x={32} look={0} blink={blink} r={1} />
          <g stroke={INK} strokeWidth={6} strokeLinecap="round">
            <path d="M-50,-50 L-18,-56" />
            <path d="M18,-56 L50,-50" />
          </g>
          <path d="M-18,40 Q0,24 18,40" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
          <rect x={-40} y={14} width={10} height={36 + 6 * Math.sin(t * 5)} rx={5} fill="#6EC3FF" opacity={0.9} />
          <rect x={30} y={14} width={10} height={36 + 6 * Math.cos(t * 5)} rx={5} fill="#6EC3FF" opacity={0.9} />
        </>
      );
      break;
    case 'cool':
      body = (
        <>
          <path d="M-62,-30 L62,-30 L56,-6 Q36,10 14,-6 L8,-18 L-8,-18 L-14,-6 Q-36,10 -56,-6 Z" fill={INK} />
          <path d="M-48,-24 L-30,-24 L-40,-12 Z M18,-24 L36,-24 L26,-12 Z" fill="#fff" opacity={0.5} />
          {blush}
          <path d="M-14,26 Q8,38 24,20" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
        </>
      );
      break;
    case 'angry':
      body = (
        <>
          <Eye x={-32} look={0} blink={blink} r={0.95} pupil={0.75} />
          <Eye x={32} look={0} blink={blink} r={0.95} pupil={0.75} />
          <g stroke={INK} strokeWidth={9} strokeLinecap="round">
            <path d="M-56,-56 L-14,-36" />
            <path d="M14,-36 L56,-56" />
          </g>
          <rect x={-26} y={22} width={52} height={22} rx={6} fill="#fff" stroke={INK} strokeWidth={6} />
          <path d="M-13,22 V44 M0,22 V44 M13,22 V44" stroke={INK} strokeWidth={4} />
        </>
      );
      break;
    case 'love':
      body = (
        <>
          {[-32, 32].map((x) => (
            <path key={x} transform={`translate(${x},-14) scale(${1 + 0.08 * Math.sin(t * 8)})`} d="M0,14 C-30,-8 -16,-30 0,-14 C16,-30 30,-8 0,14 Z" fill={C.red} stroke={INK} strokeWidth={5} />
          ))}
          {blush}
          <path d="M-16,18 Q0,40 16,18 Z" fill={INK} />
        </>
      );
      break;
  }
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: 'visible', transform: `translateY(${bob * size * 0.004}px)`, filter: mood === 'sleep' || mood === 'dots' ? undefined : `drop-shadow(0 0 ${Math.max(1, size * 0.012)}px #fff) drop-shadow(0 0 ${Math.max(1, size * 0.012)}px #fff)` }}>
      {body}
    </svg>
  );
};

