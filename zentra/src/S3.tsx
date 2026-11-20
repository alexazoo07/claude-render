// Short 3: the 7-minute tower climb Easter egg
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';
import WORDS from './s3words.json';
import {
  F, lerp, IO, cl, PINK, PINK2, YEL, GRN, RED, CYAN, Wd, Shot, Sfx, at, Pop, panel, Tag, Big, Lab, C, Digits,
  IX, ICheck, IPin, IPhone, IUser, ICar, ITrophy, IEye, makeSubs, ShortFrame,
} from './ShortKit';

const W = WORDS as Wd[];
const A = (w: string, n = 1) => at(W, w, n);
export const S3END = Math.round((W[W.length - 1].e + 0.4) * 100) / 100;

const T = {
  climbed: A('climbed'), tower: A('tower'), seven: A('seven'), minutes: A('minutes'), rockstar: A('rockstar'), rewarded: A('rewarded'),
  player: A('player'), tallest: A('tallest'), leonida: A('leonida'), climbing: A('climbing'), started: A('started'), all: A('all'), ladder: A('ladder'), up: A('up'), seven2: A('seven', 2), minutes2: A('minutes', 2),
  at: A('at'), top: A('top'), nest: A('nest'), giant: A('giant'), colorful: A('colorful'), literally: A('literally'), easter: A('easter'),
  he: A('he'), picked: A('picked'), threw: A('threw'), road: A('road'), secret: A('secret'), cutscene: A('cutscene'),
  egg: A('egg'), spins: A('spins'), football: A('football'), splatters: A('splatters'), car: A('car'), driver: A('driver'), guy: A('guy'),
  y1980: A('1980s'), vice: A('vice'), looking: A('looking'), phone: A('phone'), road2: A('road', 2),
  its: A("it's"), callback: A('callback'), hidden: A('hidden'), vice2: A('vice', 2), y2002: A('2002'),
  exact: A('exact'), confirmed: A('confirmed'), few: A('few'), throws: A('throws'), would: A('would'), seven3: A('seven', 3), follow: A('follow'),
};

const SHOTS: Shot[] = [
  {src: 'tw_up', a: 0, b: T.player - 0.14, dim: 0.5},
  {src: 'tw_walk', a: T.player - 0.14, b: T.started, dim: 0.5},
  {src: 'tw_ladder', a: T.started, b: T.all, dim: 0.5},
  {src: 'tw_ladder2', a: T.all, b: T.at, dim: 0.5},
  {src: 'tw_top', a: T.at, b: T.nest, dim: 0.5, topCover: true},
  {src: 'tw_nest', a: T.nest, b: T.he, dim: 0.5, topCover: true},
  {src: 'tw_pick', a: T.he, b: T.threw, dim: 0.5, topCover: true},
  {src: 'tw_throw', a: T.threw, b: T.cutscene, dim: 0.55},
  {src: 'tw_fly', a: T.cutscene, b: T.splatters, dim: 0.6},
  {src: 'tw_splat', a: T.splatters, b: T.driver, dim: 0.6, cover: true},
  {src: 'tw_driver', a: T.driver, b: T.driver + 4, dim: 0.55, cover: true},
  {src: 'tw_after', a: T.driver + 4, b: T.its, dim: 0.55, cover: true},
  {src: 'vcity', a: T.its, b: T.exact - 0.2, dim: 0.45},
  {src: 'tw_aerial', a: T.exact - 0.2, b: T.exact + 2.9, dim: 0.45},
  {src: 'tw_ladder2', a: T.exact + 2.9, b: T.would, off: 6, dim: 0.42},
  {src: 'outro', a: T.would, b: S3END, dim: 0.5},
];

const TowerArt: React.FC<{h?: number; climber?: number; showClimber?: boolean}> = ({h = 900, climber = 0, showClimber = false}) => {
  const w = h * 0.42;
  const levels = 14;
  return (
    <svg width={w} height={h} viewBox="0 0 420 1000" fill="none" stroke={PINK} strokeWidth="6" strokeLinecap="round">
      <line x1="210" y1="20" x2="210" y2="80" stroke={RED} strokeWidth="6" />
      <circle cx="210" cy="16" r="10" fill={RED} stroke="none" />
      <path d="M150 990 L195 80 L225 80 L270 990" />
      <path d="M90 990 L190 80 M330 990 L230 80" opacity="0.6" />
      {Array.from({length: levels}).map((_, i) => {
        const y = 980 - i * 65;
        const t = (980 - y) / 900;
        const hw = 120 - 95 * t;
        return <g key={i}><line x1={210 - hw} y1={y} x2={210 + hw} y2={y} opacity="0.8" /><line x1={210 - hw} y1={y} x2={210 + hw - 10} y2={y - 65} opacity="0.4" /></g>;
      })}
      {[260, 420].map((y, i) => <rect key={i} x={180 - i * 6} y={y} width={60 + i * 12} height="34" rx="6" stroke={CYAN} />)}
      {showClimber && <circle cx="210" cy={980 - 900 * climber} r="18" fill="#fff" stroke="none" style={{filter: `drop-shadow(0 0 14px #fff)`}} />}
    </svg>
  );
};

const Egg: React.FC<{c: string; s?: number; rot?: number}> = ({c, s = 120, rot = 0}) => (
  <svg width={s} height={s * 1.25} viewBox="0 0 100 125" style={{transform: `rotate(${rot}deg)`}}>
    <path d="M50 4 C78 4 96 50 96 78 C96 106 76 121 50 121 C24 121 4 106 4 78 C4 50 22 4 50 4 Z" fill={c} />
    <path d="M8 70 Q30 58 50 70 T92 70" stroke="#fff" strokeWidth="7" fill="none" opacity="0.85" />
    {[[30, 40], [62, 32], [70, 95], [36, 98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#fff" opacity="0.8" />)}
    <ellipse cx="34" cy="28" rx="9" ry="14" fill="#fff" opacity="0.35" />
  </svg>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const mm = Math.round(lerp(f, F(T.seven), F(T.minutes) + 20, 0, 7, IO));
  return (
    <>
      <Pop a={T.seven} b={T.player - 0.2} from="down" style={{...C, top: 300}}><Digits text={`0${mm}:00`} c={YEL} size={150} /></Pop>
      <Pop a={T.minutes} b={T.player - 0.2} style={{...C, top: 500}}><Tag c={YEL}>minutes of climbing</Tag></Pop>
      <Pop a={T.rewarded} b={T.player - 0.2} from="zoom" style={{...C, top: 640}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '36px 60px', ...panel(YEL)}}>
          {ITrophy(150)}
          <Big size={74} c={YEL} glow={YEL}>REWARDED</Big>
          <Lab c={PINK2}>by rockstar</Lab>
        </div>
      </Pop>
    </>
  );
};

const Climb: React.FC = () => {
  const f = useCurrentFrame();
  const c = interpolate(f, [F(T.climbing), F(T.up) + 10], [0, 1], {...cl, easing: IO});
  const tsec = Math.round(lerp(f, F(T.climbing), F(T.minutes2) + 16, 0, 420, IO));
  const mm = Math.floor(tsec / 60), ss = tsec % 60;
  const done = f >= F(T.minutes2) + 16;
  return (
    <>
      <Pop a={T.tallest} b={T.at - 0.08} from="down" style={{...C, top: 270}}><Tag>tallest communication tower</Tag></Pop>
      <Pop a={T.player} b={T.at - 0.08} from="left" style={{left: 70, top: 380}}>
        <TowerArt h={640} climber={c} showClimber={f >= F(T.climbing)} />
      </Pop>
      <Pop a={T.leonida} b={T.at - 0.08} from="right" style={{right: 70, top: 420}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 26px', ...panel()}}>{IPin(54)}<Lab c="#fff" size={24}>leonida</Lab></div>
      </Pop>
      <Pop a={T.climbing} b={T.at - 0.08} from="right" style={{right: 70, top: 600}}>
        <div style={{width: 470, padding: '26px 30px', ...panel(done ? YEL : PINK), display: 'flex', flexDirection: 'column', gap: 10}}>
          <Lab c={PINK2}>climb time</Lab>
          <Big size={110} c={done ? YEL : '#fff'} glow={done ? YEL : PINK}>{`${mm}:${String(ss).padStart(2, '0')}`}</Big>
          <div style={{height: 14, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}><div style={{height: '100%', width: `${(tsec / 420) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${YEL})`}} /></div>
        </div>
      </Pop>
      <Pop a={T.ladder} b={T.at - 0.08} from="right" style={{right: 70, top: 900}}>
        <div style={{width: 470, padding: '22px 30px', ...panel()}}>
          <Lab c={PINK2}>altitude</Lab>
          <Big size={84}>{`${Math.round(c * 100)}%`}</Big>
        </div>
      </Pop>
    </>
  );
};

const EGGC = ['#ff6fb5', '#5fd3ff', '#ffd23f', '#8cff8f'];
const Nest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Pop a={T.top} b={T.he - 0.08} from="down" style={{...C, top: 290}}><Tag c={YEL}>at the top</Tag></Pop>
      <Pop a={T.nest} b={T.he - 0.08} from="zoom" style={{...C, top: 400}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '22px 40px', ...panel(YEL)}}>
          <Lab c={YEL}>bird's nest</Lab>
          <div style={{display: 'flex', gap: 18, height: 120, alignItems: 'flex-end'}}>
            {EGGC.map((c, i) => {
              const p = lerp(f, F(T.giant) + i * 5, F(T.giant) + i * 5 + 14, 0, 1);
              return <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}><Egg c={c} s={84} rot={[-12, 6, -4, 10][i]} /></div>;
            })}
          </div>
        </div>
      </Pop>
      <Pop a={T.easter} b={T.he - 0.08} from="zoom" style={{...C, top: 1150}}><Big size={92} c={YEL} glow={YEL}>EASTER EGGS</Big></Pop>
      <Pop a={T.literally} b={T.he - 0.08} style={{...C, top: 1080}}><Lab c={PINK2}>literally</Lab></Pop>
    </>
  );
};

// throw + cutscene + splat
const Throw: React.FC = () => {
  const f = useCurrentFrame();
  const bars = f >= F(T.cutscene) - 6 && f < F(T.its) + 10 ? lerp(f, F(T.cutscene) - 6, F(T.cutscene) + 10, 0, 1, IO) * (1 - lerp(f, F(T.its) - 4, F(T.its) + 10, 0, 1, IO)) : 0;
  const arc = lerp(f, F(T.threw), F(T.threw) + 30, 0, 1, IO);
  // egg flight from (180,260) to (560,1090)
  const p = interpolate(f, [F(T.egg), F(T.splatters)], [0, 1], {...cl, easing: IO});
  const ex = 180 + (560 - 180) * p, ey = 260 + (1090 - 260) * p - Math.sin(p * Math.PI) * 220;
  const splat = lerp(f, F(T.splatters), F(T.splatters) + 10, 0, 1);
  const flying = f >= F(T.egg) && f < F(T.splatters);
  const shake = f >= F(T.splatters) && f < F(T.splatters) + 10 ? (((f * 37) % 9) - 4) * 2 : 0;
  return (
    <>
      <Pop a={T.picked} b={T.threw - 0.02} style={{...C, top: 300}}><Tag>picked one up</Tag></Pop>
      <Pop a={T.threw} b={T.cutscene - 0.05} style={{...C, top: 300}}><Tag c={YEL}>toward the road</Tag></Pop>
      <Pop a={T.football} b={T.splatters - 0.05} style={{...C, top: 300}}><Tag c={CYAN}>spins like a football</Tag></Pop>
      <Pop a={T.splatters} b={T.driver - 0.05} from="zoom" style={{...C, top: 1120}}>
        <div style={{transform: `translateX(${shake}px)`}}><Big size={110} c={YEL} glow={YEL}>SPLAT!</Big></div>
      </Pop>
      {bars > 0 && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 170 * bars, background: '#000'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 170 * bars, background: '#000'}} />
          <div style={{position: 'absolute', left: 50, top: 50 + 40 * bars, opacity: bars, display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 22, height: 22, borderRadius: 99, background: RED, opacity: Math.floor(f / 20) % 2 ? 1 : 0.25}} />
            <Lab c="#fff" size={24}>secret cutscene</Lab>
          </div>
        </AbsoluteFill>
      )}
      <Pop a={T.secret} b={T.egg - 0.05} from="zoom" style={{...C, top: 620}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '26px 46px', ...panel(YEL)}}><Big size={80} c={YEL} glow={YEL}>SECRET CUTSCENE</Big></div>
      </Pop>
    </>
  );
};

const Driver: React.FC = () => {
  const f = useCurrentFrame();
  const tags = [
    {t: T.y1980, i: <Big size={44} c={PINK2}>80s</Big>, s: 'Vice City outfit', c: PINK},
    {t: T.phone, i: IPhone(56, CYAN), s: 'on his phone', c: CYAN},
    {t: T.road2, i: IEye(56, RED), s: 'not watching the road', c: RED},
  ];
  return (
    <>
      <Pop a={T.driver} b={T.its - 0.05} from="left" style={{left: 80, top: 300}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 36px', ...panel()}}>
          <div style={{width: 110, height: 110, borderRadius: 999, border: `3px solid ${PINK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1d0f2c'}}>{IUser(80)}</div>
          <div><Lab c={PINK2} size={22}>npc</Lab><Big size={70}>THE DRIVER</Big></div>
        </div>
      </Pop>
      <div style={{position: 'absolute', left: 80, top: 520, display: 'flex', flexDirection: 'column', gap: 22}}>
        {tags.map((tg, i) => {
          const p = lerp(f, F(tg.t), F(tg.t) + 14, 0, 1);
          const q = lerp(f, F(T.its) - 4, F(T.its) + 8, 0, 1, IO);
          if (f < F(tg.t) - 1) return null;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 30px', ...panel(tg.c), opacity: p * (1 - q), transform: `translateX(${(1 - p) * -60}px)`, width: 'fit-content'}}>
              {tg.i}<Big size={52}>{tg.s.toUpperCase()}</Big>{i === 2 && IX(48)}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Callback: React.FC = () => (
  <>
    <Pop a={T.callback} b={T.exact - 0.25} from="down" style={{...C, top: 300}}><Tag c={CYAN}>a callback</Tag></Pop>
    <Pop a={T.hidden} b={T.exact - 0.25} from="zoom" style={{...C, top: 450}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '44px 60px', borderRadius: 30, background: 'linear-gradient(160deg, rgba(40,6,50,0.9), rgba(6,30,50,0.9))', border: `4px solid ${PINK}`, boxShadow: `0 0 30px ${PINK}, 0 0 60px ${CYAN}66, inset 0 0 30px ${CYAN}44`}}>
        <Lab c={CYAN}>hidden easter egg</Lab>
        <Big size={100} c={PINK2} glow={CYAN}>VICE CITY</Big>
      </div>
    </Pop>
    <Pop a={T.y2002} b={T.exact - 0.25} from="up" style={{...C, top: 850}}><Digits text="2002" c={CYAN} size={140} /></Pop>
  </>
);

const Unconfirmed: React.FC = () => {
  const f = useCurrentFrame();
  const res = [IX(56), IX(56), ICheck(56)];
  return (
    <>
      <Pop a={T.exact} b={T.would - 0.05} from="zoom" style={{...C, top: 380}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '30px 46px', ...panel()}}>
          <div style={{position: 'relative'}}>{IPin(110)}<div style={{position: 'absolute', left: 0, right: 0, top: 6, textAlign: 'center'}}><Big size={46}>?</Big></div></div>
          <div><Lab c={PINK2}>exact tower</Lab><Big size={70} c={f >= F(T.confirmed) ? RED : '#fff'} glow={f >= F(T.confirmed) ? RED : PINK}>UNCONFIRMED</Big></div>
        </div>
      </Pop>
      <Pop a={T.few} b={T.would - 0.05} style={{...C, top: 760}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '28px 46px', ...panel(YEL)}}>
          <Lab c={YEL}>throws</Lab>
          <div style={{display: 'flex', gap: 30}}>
            {res.map((r, i) => {
              const p = lerp(f, F(T.few) + i * 9, F(T.few) + i * 9 + 12, 0, 1);
              return <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}><Egg c={EGGC[i]} s={90} rot={[-10, 6, -4][i]} />{r}</div>;
            })}
          </div>
        </div>
      </Pop>
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const click = F(T.follow) + 18;
  const pressed = f >= click && f < click + 8;
  const followed = f >= click + 4;
  return (
    <>
      <Pop a={T.would} b={T.follow - 0.05} from="zoom" style={{...C, top: 480}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '36px 54px', ...panel(YEL)}}>
          <Big size={84}>WOULD YOU CLIMB</Big>
          <Digits text="07:00" c={YEL} size={120} />
        </div>
      </Pop>
      <Pop a={T.follow} b={S3END} from="zoom" style={{...C, top: 600}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <Img src={staticFile('gtavi_logo.png')} style={{width: 210, filter: `drop-shadow(0 0 24px ${PINK})`}} />
          <div style={{transform: `scale(${pressed ? 0.92 : 1})`, padding: '28px 70px', borderRadius: 999, background: followed ? '#2a1838' : PINK, border: `3px solid ${PINK}`, boxShadow: `0 0 34px ${PINK}`}}>
            <Big size={70} glow="#000">{followed ? '✓ FOLLOWING' : '+ FOLLOW'}</Big>
          </div>
          <Lab c={PINK2}>more gta 6 secrets</Lab>
        </div>
      </Pop>
    </>
  );
};

const SFX: Sfx[] = [
  {t: 0, s: 'imp', v: 0.8}, {t: 0.05, s: 'sub1', v: 0.6}, {t: T.tower, s: 'fsw', v: 0.5}, {t: T.seven, s: 'clock', v: 0.3}, {t: T.minutes, s: 'pop2', v: 0.6},
  {t: T.rewarded, s: 'right', v: 0.45}, {t: T.rewarded, s: 'whip', v: 0.5},
  {t: T.player - 0.14, s: 'riserimp', v: 0.55}, {t: T.tallest, s: 'pop2', v: 0.6}, {t: T.leonida, s: 'pop1', v: 0.5}, {t: T.climbing, s: 'clock', v: 0.3}, {t: T.ladder, s: 'hud2', v: 0.4},
  {t: T.minutes2 + 0.26, s: 'pings', v: 0.6},
  {t: T.at, s: 'wh2', v: 0.6}, {t: T.nest, s: 'pop1', v: 0.6}, {t: T.giant, s: 'mpop', v: 0.6}, {t: T.giant + 0.08, s: 'mpop', v: 0.5}, {t: T.giant + 0.17, s: 'mpop', v: 0.5}, {t: T.giant + 0.25, s: 'mpop', v: 0.5},
  {t: T.easter, s: 'appear', v: 0.5}, {t: T.easter, s: 'imp', v: 0.4},
  {t: T.he, s: 'whip', v: 0.5}, {t: T.picked, s: 'pop2', v: 0.6}, {t: T.threw, s: 'fwhip', v: 0.6}, {t: T.cutscene - 0.1, s: 'sdl', v: 0.5}, {t: T.secret, s: 'hud1', v: 0.5},
  {t: T.egg, s: 'wh1', v: 0.6}, {t: T.football, s: 'swish', v: 0.6}, {t: T.splatters, s: 'imp', v: 0.7}, {t: T.splatters, s: 'glx2', v: 0.3},
  {t: T.driver, s: 'whip', v: 0.5}, {t: T.y1980, s: 'pop2', v: 0.6}, {t: T.phone, s: 'pop2', v: 0.6}, {t: T.road2, s: 'wrong', v: 0.5},
  {t: T.its, s: 'glx', v: 0.5}, {t: T.its, s: 'ssw', v: 0.5}, {t: T.hidden, s: 'hud1', v: 0.5}, {t: T.vice2, s: 'appear', v: 0.4}, {t: T.y2002, s: 'mpop', v: 0.6},
  {t: T.exact - 0.2, s: 'fsw', v: 0.5}, {t: T.confirmed, s: 'wrong', v: 0.45}, {t: T.few, s: 'wrong', v: 0.35}, {t: T.few + 0.15, s: 'wrong', v: 0.35}, {t: T.few + 0.3, s: 'confirm', v: 0.45},
  {t: T.would, s: 'wh2', v: 0.6}, {t: T.follow, s: 'riserimp', v: 0.5}, {t: T.follow + 0.3, s: 'c1', v: 0.9}, {t: T.follow + 0.4, s: 'notif', v: 0.5},
];

const Subs = makeSubs(W, S3END, {
  seven: YEL, minutes: YEL, rockstar: PINK2, rewarded: GRN, tallest: PINK2, tower: PINK2, towers: PINK2, leonida: PINK2, up: YEL,
  nest: YEL, giant: YEL, colorful: GRN, easter: YEL, eggs: YEL, secret: YEL, cutscene: YEL, football: CYAN, splatters: RED,
  '1980s': PINK2, vice: PINK2, city: PINK2, phone: CYAN, callback: CYAN, hidden: YEL, '2002': CYAN, confirmed: RED, throws: YEL, secrets: YEL, gta: PINK2, '6': PINK2,
});

export const S3: React.FC = () => (
  <ShortFrame id="s3glx" shots={SHOTS} end={S3END} voice="s3/voice.wav" sfx={SFX} Subs={Subs} streaks={[T.player - 0.14, T.at, T.would]} glitches={[T.its, T.splatters]}>
    <Hook />
    <Climb />
    <Nest />
    <Throw />
    <Driver />
    <Callback />
    <Unconfirmed />
    <Outro />
  </ShortFrame>
);
