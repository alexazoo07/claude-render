// Short 4: GTA 6 has a roundabout, GTA 5 never had one
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import WORDS from './s4words.json';
import {
  F, lerp, IO, EO, cl, PINK, PINK2, YEL, GRN, RED, CYAN, Wd, Shot, Sfx, at, Pop, panel, Tag, Big, Lab, C, Digits,
  IX, ICheck, IPin, ICar, ISearch, makeSubs, ShortFrame,
} from './ShortKit';

const W = WORDS as Wd[];
const A = (w: string, n = 1) => at(W, w, n);
export const S4END = Math.round((W[W.length - 1].e + 1.0) * 100) / 100;

const T = {
  added: A('added'), never: A('never'), ten: A('ten'), years: A('years'), rb: A('roundabout'), really: A('really'),
  in5: A('in', 2), gta5: A('gta', 3), map: A('map'), traffic: A('traffic'), straight: A('straight'), highways: A('highways'),
  not: A('not'), single: A('single'), rb2: A('roundabout', 2), but: A('but'), vice: A('vice'), drive: A('drive'), loop: A('loop'),
  island: A('island'), middle: A('middle'), ai: A('ai'), follows: A('follows'), it2: A('it', 2), small: A('small'), detail: A('detail'),
  real2: A('real', 2), and3: A('and', 3), wonder: A('wonder'), many: A('many'), more: A('more'), hidden: A('hidden'), map2: A('map', 2),
  have: A('have'), another: A('another'), tell: A('tell'), comments: A('comments'),
};

const SHOTS: Shot[] = [
  {src: 'rb_app', a: 0, b: T.rb, dim: 0.42, topCover: true},
  {src: 'rb_round', a: T.rb, b: T.in5, off: 6.8, dim: 0.5, fit: true},
  {src: 'rb_gray', a: T.in5, b: T.but, off: 0.5, dim: 0.18},
  {src: 'rb_round', a: T.but, b: T.loop, off: 0.0, dim: 0.5, fit: true},
  {src: 'rb_round', a: T.loop, b: T.ai, off: 2.5, dim: 0.5, fit: true},
  {src: 'rb_round', a: T.ai, b: T.it2, off: 4.5, dim: 0.5, fit: true},
  {src: 'rb_all', a: T.it2, b: T.detail, off: 15.0, dim: 0.5, topCover: true},
  {src: 'rb_city', a: T.detail, b: T.and3, dim: 0.5},
  {src: 'rb_city2', a: T.and3, b: T.have, dim: 0.3},
  {src: 'rb_outro', a: T.have, b: S4END, dim: 0.45},
];

// animated roundabout pictogram; car = progress around the ring (0..1), -1 hides it
export const Ring: React.FC<{s?: number; spin?: number; car?: number; crossed?: number; c?: string}> = ({s = 420, spin = 0, car = -1, crossed = 0, c = PINK}) => {
  const R = 150;
  const ang = (car * 360 - 90) * (Math.PI / 180);
  return (
    <svg width={s} height={s} viewBox="0 0 500 500" fill="none" strokeLinecap="round">
      {[0, 90, 180, 270].map((r) => (
        <rect key={r} x="225" y="0" width="50" height="110" fill="#2b2236" transform={`rotate(${r} 250 250)`} />
      ))}
      <circle cx="250" cy="250" r={R} stroke="#2b2236" strokeWidth="70" />
      <circle cx="250" cy="250" r={R} stroke={c} strokeWidth="4" strokeDasharray="16 22" opacity="0.8" style={{transformOrigin: '250px 250px', transform: `rotate(${spin}deg)`}} />
      <circle cx="250" cy="250" r="95" fill="#123d2a" stroke={GRN} strokeWidth="5" />
      <path d="M250 205 v80 M250 210 q-30 -12 -48 6 M250 210 q30 -12 48 6 M250 214 q-12 -26 -38 -24 M250 214 q12 -26 38 -24" stroke={GRN} strokeWidth="6" />
      <g style={{transformOrigin: '250px 250px', transform: `rotate(${spin}deg)`}}>
        {[0, 120, 240].map((r) => (
          <path key={r} d="M250 82 l22 18 l-22 18" stroke="#fff" strokeWidth="8" transform={`rotate(${r} 250 250)`} />
        ))}
      </g>
      {car >= 0 && <circle cx={250 + R * Math.cos(ang)} cy={250 + R * Math.sin(ang)} r="20" fill="#fff" style={{filter: `drop-shadow(0 0 14px ${YEL})`}} />}
      {crossed > 0 && (
        <g opacity={crossed}>
          <circle cx="250" cy="250" r="232" stroke={RED} strokeWidth="18" />
          <line x1="86" y1="414" x2={86 + 328 * crossed} y2={414 - 328 * crossed} stroke={RED} strokeWidth="18" />
        </g>
      )}
    </svg>
  );
};

// logo slam: huge -> fits, white flash, shockwave rings, shake, then docks to the top
const LogoSlam: React.FC = () => {
  const f = useCurrentFrame();
  const end = F(T.never);
  if (f > end + 16) return null;
  const sc = interpolate(f, [0, 10], [3.4, 1], {...cl, easing: EO});
  const bump = f >= 10 && f < 22 ? 1 + 0.06 * Math.sin(((f - 10) / 12) * Math.PI) : 1;
  const breathe = 1 + 0.025 * Math.sin(f / 7);
  const dock = lerp(f, end - 4, end + 12, 0, 1, IO);
  const shake = f >= 9 && f < 24 ? (((f * 53) % 11) - 5) * (1 - (f - 9) / 15) * 3 : 0;
  const blur = lerp(f, 0, 10, 24, 0);
  const flash = interpolate(f, [9, 11, 24], [0, 0.5, 0], cl);
  const rays = lerp(f, 10, 40, 0, 1);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${PINK}55 0%, rgba(7,3,12,0) 55%)`, opacity: 1 - dock}} />
      {[0, 1, 2].map((i) => {
        const p = lerp(f, 10 + i * 6, 46 + i * 6, 0, 1);
        if (f < 10 + i * 6) return null;
        return <div key={i} style={{position: 'absolute', left: 540 - 200, top: 800 - 200, width: 400, height: 400, borderRadius: 999, border: `${10 - i * 3}px solid ${i === 1 ? YEL : PINK}`, transform: `scale(${0.6 + p * 2.6})`, opacity: (1 - p) * (1 - dock)}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 800 - 260 - dock * 420, display: 'flex', justifyContent: 'center', transform: `translateX(${shake}px)`}}>
        <div style={{position: 'relative', transform: `scale(${sc * bump * breathe * (1 - dock * 0.55)})`, filter: `blur(${blur}px)`, opacity: 1 - dock * 0.9}}>
          <div style={{position: 'absolute', inset: -120, background: `conic-gradient(from ${f * 2}deg, transparent 0deg, ${PINK}55 20deg, transparent 40deg, transparent 90deg, ${YEL}44 110deg, transparent 130deg, transparent 180deg, ${PINK}55 200deg, transparent 220deg, transparent 270deg, ${CYAN}44 290deg, transparent 310deg)`, borderRadius: 999, opacity: rays, filter: 'blur(6px)'}} />
          <Img src={staticFile('gtavi_logo.png')} style={{position: 'relative', width: 560, filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(f / 6)}px ${PINK}) drop-shadow(0 20px 40px rgba(0,0,0,0.8))`}} />
        </div>
      </div>
      <Pop a={T.added} b={T.never - 0.06} from="zoom" style={{...C, top: 1180}}><Tag c={GRN} size={40}>just added</Tag></Pop>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <LogoSlam />
      <Pop a={T.never} b={T.rb - 0.06} from="down" style={{...C, top: 300}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 40px', ...panel(RED)}}>{IX(64)}<Big size={70}>NEVER IN GTA 5</Big></div>
      </Pop>
      <Pop a={T.ten} b={T.rb - 0.06} from="zoom" style={{...C, top: 520}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
          <Digits text="10+" c={YEL} size={150} />
          <Lab c={YEL}>years</Lab>
        </div>
      </Pop>
      <Pop a={T.rb} b={T.in5 - 0.06} from="zoom" style={{...C, top: 290}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 34px 14px 14px', ...panel(YEL), borderRadius: 999}}>
          <Ring s={130} spin={lerp(f, F(T.rb), F(T.in5), 0, 240, IO)} c={YEL} />
          <Big size={84} c={YEL} glow={YEL}>ROUNDABOUT</Big>
        </div>
      </Pop>
      <Pop a={T.really} b={T.in5 - 0.06} style={{...C, top: 470}}><Tag c={PINK} size={36}>yes, really</Tag></Pop>
    </>
  );
};

// GTA 5 grid map: straight roads, lights at every crossing, a highway
const Grid: React.FC = () => {
  const f = useCurrentFrame();
  const draw = lerp(f, F(T.map), F(T.map) + 40, 0, 1, IO);
  const lit = f >= F(T.traffic);
  const hw = lerp(f, F(T.highways), F(T.highways) + 24, 0, 1, IO);
  const xs = [120, 300, 480, 660, 840], ys = [100, 260, 420, 580];
  return (
    <svg width={900} height={660} viewBox="0 0 960 680" fill="none" strokeLinecap="round">
      {xs.map((x, i) => <line key={'x' + i} x1={x} y1={30} x2={x} y2={30 + 620 * draw} stroke="#5a5266" strokeWidth="22" />)}
      {ys.map((y, i) => <line key={'y' + i} x1={40} y1={y} x2={40 + 880 * draw} y2={y} stroke="#5a5266" strokeWidth="22" />)}
      <path d="M20 660 C300 520 600 600 940 40" stroke={CYAN} strokeWidth="30" strokeDasharray="1400" strokeDashoffset={1400 * (1 - hw)} opacity="0.9" />
      {xs.flatMap((x, i) => ys.map((y, j) => {
        const on = lit && f >= F(T.traffic) + (i + j) * 2;
        const red = Math.floor((f + (i * 7 + j * 11)) / 30) % 2 === 0;
        return <circle key={i + '-' + j} cx={x} cy={y} r={on ? 14 : 0} fill={red ? RED : GRN} style={{filter: `drop-shadow(0 0 10px ${red ? RED : GRN})`}} />;
      }))}
    </svg>
  );
};

const Gta5: React.FC = () => {
  const f = useCurrentFrame();
  const chips = [
    {t: T.traffic, l: 'TRAFFIC LIGHTS', c: RED},
    {t: T.straight, l: 'STRAIGHT ROADS', c: '#fff'},
    {t: T.highways, l: 'HIGHWAYS', c: CYAN},
  ];
  const xo = lerp(f, F(T.not) + 4, F(T.not) + 30, 0, 1, IO);
  return (
    <>
      <Pop a={T.gta5} b={T.but - 0.06} from="down" style={{...C, top: 250}}><Tag c="#c9c2d6">gta 5 · los santos</Tag></Pop>
      <Pop a={T.map} b={T.not - 0.06} from="zoom" style={{...C, top: 370}}>
        <div style={{padding: 20, ...panel('#9a90aa')}}><Grid /></div>
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1100, display: 'flex', justifyContent: 'center', gap: 16}}>
        {chips.map((ch, i) => {
          const p = lerp(f, F(ch.t), F(ch.t) + 14, 0, 1);
          const q = lerp(f, F(T.not) - 6, F(T.not) + 6, 0, 1, IO);
          if (f < F(ch.t) - 1 || q >= 1) return null;
          return <div key={i} style={{opacity: p * (1 - q), transform: `translateY(${(1 - p) * 40}px)`}}><Tag c={ch.c} size={24}>{ch.l}</Tag></div>;
        })}
      </div>
      <Pop a={T.not} b={T.but - 0.06} from="zoom" style={{...C, top: 360}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <Ring s={440} spin={0} c="#9a90aa" crossed={xo} />
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <Digits text="0" c={RED} size={130} />
            <Big size={92} c={RED} glow={RED}>ROUNDABOUTS</Big>
          </div>
        </div>
      </Pop>
    </>
  );
};

const Vice: React.FC = () => {
  const f = useCurrentFrame();
  const car = f < F(T.drive) ? -1 : interpolate(f, [F(T.drive), F(T.loop), F(T.middle) + 20], [0.5, 0.72, 1.55], {...cl, easing: IO});
  return (
    <>
      <Pop a={T.vice} b={T.it2 - 0.06} from="down" style={{...C, top: 190}}><Tag c={PINK}>gta 6 · vice city</Tag></Pop>
      <Pop a={T.drive} b={T.ai - 0.06} from="zoom" style={{...C, top: 300}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '10px 32px 10px 10px', ...panel(YEL), borderRadius: 999}}>
          <Ring s={130} spin={lerp(f, F(T.drive), F(T.ai), 0, 180, IO)} car={car % 1} c={YEL} />
          <Big size={64} c={YEL} glow={YEL}>{f >= F(T.loop) ? 'LOOP AROUND' : 'DRIVE IN'}</Big>
        </div>
      </Pop>
      <Pop a={T.ai} b={T.it2 - 0.06} from="zoom" style={{...C, top: 300}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 34px', ...panel(CYAN)}}>
          {ICar(76, CYAN)}
          <div>
            <Lab c={CYAN} size={22}>ai traffic</Lab>
            <Big size={60} c={f >= F(T.follows) ? GRN : '#fff'} glow={f >= F(T.follows) ? GRN : CYAN}>FOLLOWS IT</Big>
          </div>
          {f >= F(T.follows) && <div style={{opacity: lerp(f, F(T.follows), F(T.follows) + 10, 0, 1)}}>{ICheck(66)}</div>}
        </div>
      </Pop>
    </>
  );
};

const Detail: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pop a={T.small} b={T.detail - 0.06} style={{...C, top: 420}}><Big size={84}>SOUNDS SMALL...</Big></Pop>
      <Pop a={T.detail} b={T.and3 - 0.06} from="zoom" style={{...C, top: 340}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '30px 50px', ...panel(YEL)}}>
          <div style={{transform: `rotate(${Math.sin(f / 9) * 8}deg)`}}>{ISearch(110, YEL)}</div>
          <Big size={100} c={YEL} glow={YEL}>DETAIL</Big>
        </div>
      </Pop>
      <Pop a={T.real2} b={T.and3 - 0.06} from="down" style={{...C, top: 620}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 40px', ...panel(GRN)}}>{ICheck(60)}<Big size={64}>FEELS LIKE A REAL CITY</Big></div>
      </Pop>
    </>
  );
};

const PINS = [[300, 640, 'many'], [760, 820, 'more'], [470, 1010, 'hidden'], [820, 560, 'hidden'], [220, 900, 'map2']] as const;
const MapQ: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(T.and3), b = F(T.have);
  if (f < a - 2 || f > b + 14) return null;
  const o = lerp(f, a, a + 14, 0, 1) * (1 - lerp(f, b, b + 12, 0, 1, IO));
  const z = interpolate(f, [a, b + 12], [1.05, 1.22], cl);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{overflow: 'hidden', background: '#07030c'}}>
        <Img src={staticFile('lv/leonida.jpg')} style={{position: 'absolute', height: '100%', left: '50%', transform: `translateX(-50%) scale(${z})`, filter: 'saturate(1.2) brightness(0.75)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(8,2,16,0.85) 100%)'}} />
      </AbsoluteFill>
      {PINS.map(([x, y, w], i) => {
        const t = F((T as any)[w]) + (i === 3 ? 8 : 0);
        const p = lerp(f, t, t + 14, 0, 1);
        if (f < t) return null;
        return (
          <div key={i} style={{position: 'absolute', left: x - 55, top: y - 110, opacity: p, transform: `translateY(${(1 - p) * -40}px) scale(${0.7 + 0.3 * p})`}}>
            <div style={{position: 'relative'}}>{IPin(110, YEL)}<div style={{position: 'absolute', left: 0, right: 0, top: 8, textAlign: 'center'}}><Big size={44} c="#000" glow={YEL}>?</Big></div></div>
          </div>
        );
      })}
      <Pop a={T.wonder} b={T.have - 0.06} from="down" style={{...C, top: 260}}><Big size={96} c={YEL} glow={YEL}>HOW MANY MORE?</Big></Pop>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const typed = 'found one near the beach!';
  const n = Math.floor(lerp(f, F(T.another), F(T.tell) + 30, 0, typed.length, (x) => x));
  const click = F(T.comments) + 14;
  const pressed = f >= click && f < click + 8;
  return (
    <>
      <Pop a={T.have} b={S4END} from="zoom" style={{...C, top: 330}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <Big size={88}>FOUND ANOTHER ONE?</Big>
          <div style={{width: 860, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px', ...panel()}}>
            <div style={{width: 84, height: 84, borderRadius: 99, background: `linear-gradient(135deg, ${PINK}, ${CYAN})`, flexShrink: 0}} />
            <div style={{fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 38, color: '#fff'}}>{typed.slice(0, n)}<span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>|</span></div>
          </div>
          <div style={{transform: `scale(${pressed ? 0.92 : 1})`, padding: '24px 66px', borderRadius: 999, background: f >= click + 4 ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 34px ${PINK}`}}>
            <Big size={62} glow="#000">{f >= click + 4 ? '✓ COMMENTED' : 'COMMENT 👇'}</Big>
          </div>
        </div>
      </Pop>
    </>
  );
};

const SFX: Sfx[] = [
  {t: 0, s: 'wh2', v: 0.7}, {t: 0.15, s: 'imp', v: 0.9}, {t: 0.15, s: 'sub1', v: 0.8}, {t: 0.17, s: 'glx2', v: 0.3}, {t: T.added, s: 'pop2', v: 0.5}, {t: T.never, s: 'wrong', v: 0.45}, {t: T.ten, s: 'clock', v: 0.3},
  {t: T.rb - 0.12, s: 'riserimp', v: 0.55}, {t: T.rb, s: 'mpop', v: 0.6}, {t: T.really, s: 'pop2', v: 0.5},
  {t: T.in5, s: 'glx', v: 0.5}, {t: T.in5, s: 'ssw', v: 0.5}, {t: T.gta5, s: 'pop1', v: 0.5}, {t: T.map, s: 'hud2', v: 0.45},
  {t: T.traffic, s: 'pop2', v: 0.55}, {t: T.traffic + 0.1, s: 'bips', v: 0.3}, {t: T.straight, s: 'pop2', v: 0.55}, {t: T.highways, s: 'swish', v: 0.55},
  {t: T.not, s: 'whip', v: 0.5}, {t: T.not + 0.1, s: 'wrong', v: 0.5}, {t: T.rb2, s: 'imp', v: 0.4},
  {t: T.but, s: 'glx2', v: 0.35}, {t: T.but, s: 'wh2', v: 0.6}, {t: T.vice, s: 'appear', v: 0.45}, {t: T.drive, s: 'pop1', v: 0.55}, {t: T.loop, s: 'swish', v: 0.5},
  {t: T.ai, s: 'whip', v: 0.5}, {t: T.follows, s: 'confirm', v: 0.5},
  {t: T.it2, s: 'fsw', v: 0.5}, {t: T.detail, s: 'mpop', v: 0.6}, {t: T.real2, s: 'right', v: 0.45},
  {t: T.and3 - 0.1, s: 'riserimp', v: 0.5}, {t: T.many, s: 'pop1', v: 0.5}, {t: T.more, s: 'pop1', v: 0.5}, {t: T.hidden, s: 'pop2', v: 0.5}, {t: T.map2, s: 'pop1', v: 0.5},
  {t: T.have, s: 'wh2', v: 0.6}, {t: T.another, s: 'typing', v: 0.35}, {t: T.comments + 0.23, s: 'c1', v: 0.9}, {t: T.comments + 0.33, s: 'notif', v: 0.5},
];

const Subs = makeSubs(W, S4END, {
  gta: PINK2, '6': PINK2, '5': '#c9c2d6', never: RED, ten: YEL, years: YEL, roundabout: YEL, really: PINK2, los: '#c9c2d6', santos: '#c9c2d6',
  traffic: RED, lights: RED, straight: '#fff', highways: CYAN, not: RED, single: RED, anywhere: RED, vice: PINK2, city: PINK2, loop: YEL, island: GRN,
  ai: CYAN, follows: GRN, small: YEL, detail: YEL, real: GRN, hidden: YEL, map: YEL, comments: PINK2,
});

export const S4: React.FC = () => (
  <ShortFrame id="s4glx" shots={SHOTS} end={S4END} voice="s4/voice.wav" sfx={SFX} Subs={Subs} streaks={[T.rb - 0.12, T.it2, T.and3]} glitches={[0.16, T.in5, T.but]}>
    <Hook />
    <Gta5 />
    <Vice />
    <Detail />
    <MapQ />
    <Outro />
  </ShortFrame>
);
