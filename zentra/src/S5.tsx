// Short 5: GTA 6 tunnel feels like a racing game
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import WORDS from './s5words.json';
import {
  F, lerp, IO, EO, cl, PINK, PINK2, YEL, GRN, RED, CYAN, Wd, Shot, Sfx, at, Pop, panel, Tag, Big, Lab, C, Digits,
  ICheck, IEye, ISearch, ICar, makeSubs, ShortFrame,
} from './ShortKit';

const W = WORDS as Wd[];
const A = (w: string, n = 1) => at(W, w, n);
export const S5END = Math.round((W[W.length - 1].e + 1.0) * 100) / 100;

const T = {
  tunnels: A('tunnels'), and1: A('and'), completely: A('completely'), game: A('game'), look: A('look'), long: A('long'), highway: A('highway'),
  with: A('with'), lights: A('lights'), flying: A('flying'), reflecting: A('reflecting'), paint: A('paint'), you: A('you'), stop: A('stop'),
  middle: A('middle'), pull: A('pull'), driver: A('driver'), keep: A('keep'), happened: A('happened'), but: A('but'), best: A('best'),
  detail: A('detail'), exit: A('exit'), when: A('when'), leave: A('leave'), sunlight: A('sunlight'), blinds: A('blinds'), second: A('second'),
  exactly: A('exactly'), eyes: A('eyes'), adjusting: A('adjusting'), life: A('life'), honestly: A('honestly'), need: A('need'), speed: A('speed'),
  than: A('than'), would: A('would'), race: A('race'), tell: A('tell'), comments: A('comments'),
};

const SHOTS: Shot[] = [
  {src: 'tn1', a: 0, b: T.look, off: 0.4, dim: 0.55},
  {src: 'tn1', a: T.look, b: T.with, off: 8.5, dim: 0.7},
  {src: 'tn1', a: T.with, b: T.you, off: 26.5, dim: 0.7},
  {src: 'tn1', a: T.you, b: T.pull, off: 15.5, dim: 0.7},
  {src: 'tn_jack', a: T.pull, b: A('and', 3), off: 0, dim: 0.75},
  {src: 'tn1', a: A('and', 3), b: T.but, off: 25.2, dim: 0.75},
  {src: 'tn1', a: T.but, b: T.when, off: 36.1, dim: 0.7},
  {src: 'tn1', a: T.when, b: T.honestly, off: 40.24, dim: 0.6},
  {src: 'tn2', a: T.honestly, b: T.would, off: 1.0, dim: 0.45},
  {src: 'tn2', a: T.would, b: S5END, off: 9.0, dim: 0.45},
];

// GTA VI logo slam (same feel as Short 4)
const LogoSlam: React.FC<{end: number; tag: string; tagAt: number}> = ({end: endS, tag, tagAt}) => {
  const f = useCurrentFrame();
  const end = F(endS);
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
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${CYAN}33 0%, rgba(7,3,12,0) 50%)`, opacity: 1 - dock}} />
      {[0, 1, 2].map((i) => {
        const p = lerp(f, 10 + i * 6, 46 + i * 6, 0, 1);
        if (f < 10 + i * 6) return null;
        return <div key={i} style={{position: 'absolute', left: 340, top: 600, width: 400, height: 400, borderRadius: 999, border: `${10 - i * 3}px solid ${i === 1 ? YEL : PINK}`, transform: `scale(${0.6 + p * 2.6})`, opacity: (1 - p) * (1 - dock)}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 540 - dock * 420, display: 'flex', justifyContent: 'center', transform: `translateX(${shake}px)`}}>
        <div style={{position: 'relative', transform: `scale(${sc * bump * breathe * (1 - dock * 0.55)})`, filter: `blur(${blur}px)`, opacity: 1 - dock * 0.9}}>
          <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <TunnelIcon s={230} speed={1.6} />
            <Big size={150} c={CYAN} glow={CYAN}>TUNNELS</Big>
          </div>
        </div>
      </div>
      <Pop a={tagAt} b={endS - 0.06} from="zoom" style={{...C, top: 960}}><Tag c={YEL} size={44}>{tag}</Tag></Pop>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

// arch tunnel icon with lights rushing toward the viewer
const TunnelIcon: React.FC<{s?: number; speed?: number}> = ({s = 200, speed = 1}) => {
  const f = useCurrentFrame();
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none">
      {[0, 1, 2, 3, 4].map((i) => {
        const p = ((f * 0.025 * speed + i / 5) % 1);
        const sc = 0.15 + p * 0.85;
        return <path key={i} d="M20 190 V100 a80 80 0 0 1 160 0 V190" stroke={i % 2 ? CYAN : '#fff'} strokeWidth={6 / sc} opacity={p} transform={`translate(100 190) scale(${sc}) translate(-100 -190)`} />;
      })}
    </svg>
  );
};

// light bars flashing overhead, synced every ~0.22 s while "lights flying" plays
const LightRush: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(T.with), b = F(T.you);
  if (f < a || f > b) return null;
  const o = lerp(f, a, a + 8, 0, 1) * (1 - lerp(f, b - 8, b, 0, 1));
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      {[0, 1, 2, 3].map((i) => {
        const p = (((f - a) / 13 + i / 4) % 1);
        const y = 120 + p * p * 700;
        const w = 120 + p * p * 900;
        return <div key={i} style={{position: 'absolute', left: 540 - w / 2, top: y, width: w, height: 6 + p * 22, borderRadius: 99, background: '#d9fff2', opacity: p * 0.55, filter: `blur(${2 + p * 6}px)`, boxShadow: `0 0 40px ${CYAN}`}} />;
      })}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => (
  <>
    <LogoSlam end={T.completely} tag="in gta 6" tagAt={0.63} />
    <Pop a={T.completely} b={T.look - 0.06} from="zoom" style={{...C, top: 340}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Lab c={YEL}>feels like</Lab>
        <Big size={96} c={YEL} glow={YEL}>A DIFFERENT GAME</Big>
      </div>
    </Pop>
  </>
);

const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pop a={T.look} b={T.long - 0.06} from="down" style={{...C, top: 360}}><Tag c={PINK} size={44}>look at this 👀</Tag></Pop>
      <Pop a={T.long} b={T.with - 0.06} from="zoom" style={{...C, top: 300}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 46px', ...panel(CYAN)}}>
          <TunnelIcon s={190} speed={1.4} />
          <Big size={78} glow={CYAN}>{f >= F(T.highway) ? 'HIGHWAY TUNNEL' : 'LONG...'}</Big>
        </div>
      </Pop>
      <LightRush />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[{t: T.lights, l: 'LIGHTS'}, {t: T.reflecting, l: 'REFLECTIONS'}].map((ch, i) => {
          const p = lerp(f, F(ch.t), F(ch.t) + 12, 0, 1);
          const q = lerp(f, F(T.you) - 8, F(T.you), 0, 1);
          if (f < F(ch.t) || q >= 1) return null;
          return <div key={i} style={{opacity: p * (1 - q), transform: `scale(${0.7 + 0.3 * p})`, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 28px', ...panel(GRN), borderRadius: 999}}>{ICheck(46)}<Big size={46}>{ch.l}</Big></div>;
        })}
      </div>
    </>
  );
};

const Jack: React.FC = () => {
  const f = useCurrentFrame();
  const a = F(T.pull), b = F(A('and', 3));
  const st = interpolate(f, [a + 6, a + 14], [2.2, 1], {...cl, easing: EO});
  return (
    <>
      <Pop a={T.stop} b={T.pull - 0.06} from="zoom" style={{...C, top: 330}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 40px', ...panel(RED)}}>
          <svg width={70} height={70} viewBox="0 0 100 100"><polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill={RED} stroke="#fff" strokeWidth="6" /></svg>
          <Big size={64}>STOP ANYWHERE</Big>
        </div>
      </Pop>
      {f >= a && f < b + 10 && (
        <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - lerp(f, b, b + 10, 0, 1)}}>
          <div style={{position: 'absolute', inset: 24, border: `8px solid ${RED}`, borderRadius: 30, boxShadow: `inset 0 0 80px ${RED}88, 0 0 40px ${RED}`, opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 5))}} />
          {f >= a + 6 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
              <div style={{transform: `rotate(-8deg) scale(${st})`, border: `9px solid ${RED}`, borderRadius: 18, padding: '8px 36px', background: 'rgba(0,0,0,0.35)'}}>
                <Big size={104} c={RED} glow={RED}>CARJACKED</Big>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Pop a={A('and', 3)} b={T.but - 0.06} from="down" style={{...C, top: 340}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 36px', ...panel(GRN)}}>{ICar(60, GRN)}<Big size={58}>KEEP GOING 😇</Big></div>
      </Pop>
    </>
  );
};

const Exit: React.FC = () => {
  const f = useCurrentFrame();
  const ex = interpolate(f, [F(T.blinds) - 10, F(T.blinds) + 6, F(T.second) + 20, F(T.life)], [0.45, 1, 1, 0.55], {...cl, easing: IO});
  return (
    <>
      <Pop a={T.best} b={T.when - 0.06} from="zoom" style={{...C, top: 330}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 44px', ...panel(YEL)}}>
          <div style={{transform: `rotate(${Math.sin(f / 9) * 8}deg)`}}>{ISearch(96, YEL)}</div>
          <Big size={86} c={YEL} glow={YEL}>{f >= F(T.exit) ? 'THE EXIT' : 'BEST DETAIL'}</Big>
        </div>
      </Pop>
      <Pop a={T.sunlight} b={T.honestly - 0.06} from="left" style={{left: 70, top: 330}}>
        <div style={{padding: '22px 30px', ...panel(YEL), width: 420}}>
          <Lab c={YEL} size={24}>exposure</Lab>
          <div style={{marginTop: 14, height: 34, borderRadius: 99, background: '#1a1222', overflow: 'hidden', border: '3px solid #ffffff33'}}>
            <div style={{width: `${ex * 100}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${YEL}, #fff)`, boxShadow: `0 0 26px ${YEL}`}} />
          </div>
          <div style={{marginTop: 10}}><Big size={46} c={ex > 0.9 ? '#fff' : YEL}>{ex > 0.9 ? 'MAX' : `${Math.round(ex * 100)}%`}</Big></div>
        </div>
      </Pop>
      <Pop a={T.eyes} b={T.honestly - 0.06} from="right" style={{right: 70, top: 600}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 30px', ...panel(CYAN)}}>
          <div style={{transform: `scaleY(${f < F(T.adjusting) + 12 ? 0.3 + 0.7 * lerp(f, F(T.eyes), F(T.adjusting) + 12, 0, 1) : 1})`}}>{IEye(70, CYAN)}</div>
          <Big size={48}>EYES ADJUSTING</Big>
        </div>
      </Pop>
      {/* extra bloom on top of the real in-game glare */}
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(circle at 50% 40%, #fff 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0) 75%)', opacity: interpolate(f, [F(T.blinds) - 4, F(T.blinds) + 2, F(T.second) + 10], [0, 0.75, 0], cl)}} />
    </>
  );
};

// racing speedometer
const Gauge: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [F(T.need) - 6, F(T.speed) + 10, F(T.would)], [0, 0.92, 0.85], {...cl, easing: EO});
  const wob = v > 0.5 ? Math.sin(f / 2.2) * 0.012 : 0;
  const ang = -220 + (v + wob) * 260;
  const kmh = Math.round((v + wob) * 320);
  const R = 150;
  const arc = (p: number) => {
    const a1 = (-220 * Math.PI) / 180, a2 = ((-220 + p * 260) * Math.PI) / 180;
    return `M ${200 + R * Math.cos(a1)} ${200 + R * Math.sin(a1)} A ${R} ${R} 0 ${p * 260 > 180 ? 1 : 0} 1 ${200 + R * Math.cos(a2)} ${200 + R * Math.sin(a2)}`;
  };
  return (
    <svg width={400} height={330} viewBox="0 0 400 330" fill="none">
      <path d={arc(1)} stroke="#2a2036" strokeWidth="26" strokeLinecap="round" />
      <path d={arc(Math.max(0.001, v))} stroke={v > 0.8 ? RED : CYAN} strokeWidth="26" strokeLinecap="round" style={{filter: `drop-shadow(0 0 14px ${v > 0.8 ? RED : CYAN})`}} />
      <line x1="200" y1="200" x2={200 + 118 * Math.cos((ang * Math.PI) / 180)} y2={200 + 118 * Math.sin((ang * Math.PI) / 180)} stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <circle cx="200" cy="200" r="14" fill="#fff" />
      <text x="200" y="290" textAnchor="middle" fontFamily="Rubik" fontWeight="900" fontSize="64" fill="#fff">{kmh}</text>
      <text x="200" y="322" textAnchor="middle" fontFamily="Rubik" fontWeight="700" fontSize="22" fill={CYAN} letterSpacing="4">KM/H</text>
    </svg>
  );
};

const Racer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pop a={T.honestly} b={T.need - 0.06} from="down" style={{...C, top: 360}}><Tag c={PINK} size={44}>honestly...</Tag></Pop>
      <Pop a={T.need} b={T.would - 0.06} from="zoom" style={{...C, top: 250}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '20px 40px 26px', ...panel(RED)}}>
          <Gauge />
          <Big size={70} c={f >= F(T.than) ? '#fff' : RED} glow={RED}>{f >= F(T.than) ? 'NFS OR GTA?' : 'NEED FOR SPEED?'}</Big>
        </div>
      </Pop>
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const typed = 'full speed, no brakes 🏎️';
  const n = Math.floor(lerp(f, F(T.race), F(T.tell) + 26, 0, [...typed].length, (x) => x));
  const click = F(T.comments) + 14;
  const pressed = f >= click && f < click + 8;
  return (
    <Pop a={T.would} b={S5END} from="zoom" style={{...C, top: 330}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <Big size={70}>WOULD YOU RACE HERE?</Big>
        <div style={{width: 860, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px', ...panel()}}>
          <div style={{width: 84, height: 84, borderRadius: 99, background: `linear-gradient(135deg, ${PINK}, ${CYAN})`, flexShrink: 0}} />
          <div style={{fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 38, color: '#fff'}}>{[...typed].slice(0, n).join('')}<span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>|</span></div>
        </div>
        <div style={{transform: `scale(${pressed ? 0.92 : 1})`, padding: '24px 66px', borderRadius: 999, background: f >= click + 4 ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 34px ${PINK}`}}>
          <Big size={62} glow="#000">{f >= click + 4 ? '✓ COMMENTED' : 'COMMENT 👇'}</Big>
        </div>
      </div>
    </Pop>
  );
};

const SFX: Sfx[] = [
  {t: 0, s: 'wh2', v: 0.7}, {t: 0.15, s: 'imp', v: 0.9}, {t: 0.15, s: 'sub1', v: 0.8}, {t: 0.17, s: 'glx2', v: 0.3}, {t: T.tunnels, s: 'pop2', v: 0.5},
  {t: T.completely - 0.1, s: 'whip', v: 0.5}, {t: T.completely, s: 'mpop', v: 0.55},
  {t: T.look, s: 'glx', v: 0.4}, {t: T.look, s: 'ssw', v: 0.5}, {t: T.long, s: 'rrise', v: 0.4}, {t: T.highway, s: 'pop1', v: 0.5},
  {t: T.with, s: 'fsw', v: 0.5}, {t: T.lights, s: 'right', v: 0.45}, {t: T.reflecting, s: 'right', v: 0.45},
  {t: T.stop, s: 'snap', v: 0.6}, {t: T.pull - 0.1, s: 'whip', v: 0.6}, {t: T.pull + 0.1, s: 'imp', v: 0.6}, {t: T.pull + 0.12, s: 'metal', v: 0.4},
  {t: A('and', 3), s: 'swish', v: 0.5}, {t: T.but, s: 'glx2', v: 0.35}, {t: T.but, s: 'wh2', v: 0.5}, {t: T.best, s: 'mpop', v: 0.55}, {t: T.exit, s: 'pop2', v: 0.5},
  {t: T.when, s: 'riser2', v: 0.45}, {t: T.blinds - 0.05, s: 'imp', v: 0.55}, {t: T.blinds - 0.05, s: 'sub1', v: 0.5}, {t: T.eyes, s: 'hud2', v: 0.45},
  {t: T.honestly, s: 'ssw', v: 0.55}, {t: T.need - 0.1, s: 'riserimp', v: 0.5}, {t: T.speed, s: 'gt3', v: 0.45}, {t: T.than, s: 'pop1', v: 0.5},
  {t: T.would, s: 'wh2', v: 0.6}, {t: T.race, s: 'typing', v: 0.35}, {t: T.comments + 0.23, s: 'c1', v: 0.9}, {t: T.comments + 0.33, s: 'notif', v: 0.5},
];

const Subs = makeSubs(W, S5END, {
  gta: PINK2, '6': PINK2, tunnels: CYAN, different: YEL, game: YEL, highway: CYAN, tunnel: CYAN, lights: GRN, reflecting: GRN, paint: GRN,
  stop: RED, middle: RED, pull: RED, driver: RED, best: YEL, detail: YEL, exit: YEL, sunlight: YEL, blinds: YEL, eyes: CYAN, adjusting: CYAN,
  need: RED, speed: RED, race: PINK2, comments: PINK2,
});

export const S5: React.FC = () => (
  <ShortFrame id="s5glx" shots={SHOTS} end={S5END} voice="s5/voice.wav" sfx={SFX} Subs={Subs} streaks={[T.with, A('and', 3), T.honestly]} glitches={[0.16, T.look, T.but]}>
    <Hook />
    <Tunnel />
    <Jack />
    <Exit />
    <Racer />
    <Outro />
  </ShortFrame>
);
