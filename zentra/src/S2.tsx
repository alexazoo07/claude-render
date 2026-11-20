// Short 2: the GTA 6 house hidden in San Andreas DE (2021)
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import WORDS from './s2words.json';
import {
  F, lerp, IO, PINK, PINK2, YEL, GRN, RED, CYAN, PANEL, H1, Wd, Shot, Sfx, at, Pop, panel, Tag, Big, Lab, C, Digits,
  ICheck, IX, IEye, IPin, ISearch, ILock, IUfo, makeSubs, ShortFrame,
} from './ShortKit';

const W = WORDS as Wd[];
const A = (w: string, n = 1) => at(W, w, n);
export const S2END = Math.round((W[W.length - 1].e + 0.4) * 100) / 100;

const T = {
  y2021: A('2021'), rock: A('rockstar'), gta1: A('gta'), another: A('another'), nobody: A('nobody'), noticed: A('noticed'),
  in2: A('in', 2), san: A('san'), ufo1: A('ufo'), bar: A('bar'), photos: A('photos'), one: A('one'), house1: A('house'), palm1: A('palm'),
  ufo2: A('ufo', 2), every: A('every'), old: A('old'), thiss: A('this'), nobody2: A('nobody', 2), knew: A('knew'),
  fans: A('fans'), first: A('first'), screenshot: A('screenshot'), ten: A('ten'), months: A('months'), y2022: A('2022'), leak: A('leak'),
  right: A('right'), launch: A('launch'), found: A('found'), exact: A('exact'), leonida: A('leonida'), garage1: A('garage'), palm2: A('palm', 2),
  but: A('but'), creepy: A('creepy'), brk: A('break'), garage2: A('garage', 2), hideout: A('hideout'), thinks: A('thinks'), video: A('video'),
  notes: A('notes'), identical: A('identical'), neighbors: A('neighbors'), locked: A('locked'), nothing: A('nothing'), mentions: A('mentions'),
  j: A('j'), l: A('l'), rules: A('rules'), world: A('world'), would: A('would'), garage3: A('garage', 3), follow: A('follow', 2), secrets: A('secrets'),
};

const SHOTS: Shot[] = [
  {src: 'suburb', a: 0, b: T.in2, dim: 0.5},
  {src: 'vcity', a: T.in2, b: T.one, dim: 0.4},
  {src: 'night', a: T.one, b: T.fans, dim: 0.32, cover: true},
  {src: 'sky1', a: T.fans, b: T.right, dim: 0.42},
  {src: 'suburb', a: T.right, b: T.but, off: 2.5, dim: 0.55},
  {src: 'dark1', a: T.but, b: T.notes, dim: 0.5},
  {src: 'dark2', a: T.notes, b: T.would, dim: 0.45},
  {src: 'outro', a: T.would, b: S2END, dim: 0.5},
];

// the mysterious photo: suburban house, palms, UFO
const HouseArt: React.FC<{palms: number; ufo: number; t: number}> = ({palms, ufo, t}) => (
  <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2a5a" /><stop offset="0.6" stopColor="#c2689a" /><stop offset="1" stopColor="#f2b38a" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sk)" />
    <rect y="225" width="400" height="75" fill="#3f6b3a" />
    <rect y="246" width="400" height="54" fill="#8c8c8c" />
    {/* house */}
    <polygon points="90,150 200,110 310,150" fill="#d9cdb6" />
    <rect x="100" y="150" width="200" height="85" fill="#efe3c9" />
    <rect x="215" y="180" width="70" height="55" fill="#bfb39b" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1="215" y1={190 + i * 12} x2="285" y2={190 + i * 12} stroke="#a89c84" strokeWidth="2" />)}
    <rect x="125" y="175" width="34" height="28" fill="#6a8fb5" />
    <rect x="170" y="190" width="24" height="45" fill="#8a6a4a" />
    {/* palms */}
    <g opacity={palms}>
      {[[60, 1], [345, 1.15]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x},240) scale(${s})`}>
          <path d="M0 0 Q6 -60 2 -120" stroke="#5a3d22" strokeWidth="7" fill="none" />
          {[-60, -25, 15, 50, 85].map((r, k) => <path key={k} d="M2 -120 Q30 -128 52 -110" stroke="#2f6b35" strokeWidth="9" fill="none" transform={`rotate(${r} 2 -120)`} />)}
        </g>
      ))}
    </g>
    {/* UFO */}
    <g transform={`translate(${300 - 40 * (1 - ufo)}, ${55 - 60 * (1 - ufo)})`} opacity={ufo}>
      <polygon points="-22,14 22,14 60,120 -60,120" fill="#bff6ff" opacity={0.18 + 0.08 * Math.sin(t * 0.3)} />
      <ellipse cx="0" cy="10" rx="40" ry="11" fill="#cfd6e6" />
      <ellipse cx="0" cy="2" rx="18" ry="12" fill="#9fe9ff" />
      {[-26, -9, 9, 26].map((x, i) => <circle key={i} cx={x} cy="13" r="3" fill={i % 2 ? '#ff4fa3' : '#fff36b'} />)}
    </g>
  </svg>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const strike = lerp(f, F(T.noticed), F(T.noticed) + 12, 0, 1);
  return (
    <>
      <Pop a={T.y2021} b={T.in2 - 0.15} from="down" style={{...C, top: 330}}><Digits text="2021" /></Pop>
      <Pop a={T.rock} b={T.in2 - 0.15} style={{...C, top: 590}}><Tag c={YEL}>rockstar</Tag></Pop>
      <Pop a={T.gta1} b={T.in2 - 0.15} from="zoom" style={{...C, top: 720}}>
        <div style={{position: 'relative', width: 560, height: 330, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'absolute', inset: 0, ...panel(), opacity: lerp(f, F(T.another), F(T.another) + 12, 0, 1)}} />
          <Img src={staticFile('gtavi_logo.png')} style={{width: 230, filter: `drop-shadow(0 0 26px ${PINK})`, transform: `scale(${lerp(f, F(T.another), F(T.another) + 14, 1.15, 0.8)})`}} />
          <div style={{position: 'absolute', bottom: 18, opacity: lerp(f, F(T.another), F(T.another) + 12, 0, 1)}}><Lab c={PINK2}>inside another game</Lab></div>
        </div>
      </Pop>
      <Pop a={T.nobody} b={T.in2 - 0.15} from="zoom" style={{...C, top: 1100}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 36px', ...panel(RED)}}>
          <div style={{position: 'relative'}}>{IEye(80)}<div style={{position: 'absolute', left: 0, top: 36, height: 8, width: 80 * strike, background: RED, transform: 'rotate(-35deg)', borderRadius: 4}} /></div>
          <Big size={64}>NOBODY NOTICED</Big>
        </div>
      </Pop>
    </>
  );
};

const FRAMES = ['GTA III', 'VICE CITY', '?', 'SAN ANDREAS', 'LCS', 'VCS'];
const Bar: React.FC = () => {
  const f = useCurrentFrame();
  const flick = f > F(T.ufo1) + 6 ? 0.85 + 0.15 * Math.sin(f * 0.9) * (f % 23 < 2 ? 0 : 1) : 1;
  return (
    <>
      <Pop a={T.san} b={T.one - 0.1} from="down" style={{...C, top: 290}}><Tag size={26}>gta san andreas · definitive edition</Tag></Pop>
      <Pop a={T.ufo1} b={T.one - 0.1} from="zoom" style={{...C, top: 410}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 46px', ...panel(CYAN), opacity: flick}}>{IUfo(110, CYAN)}<Big size={100} c="#fff" glow={CYAN}>UFO BAR</Big></div>
      </Pop>
      <Pop a={T.photos} b={T.one - 0.1} style={{left: 90, right: 90, top: 720}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26}}>
          {FRAMES.map((n, i) => {
            const p = lerp(f, F(T.photos) + i * 4, F(T.photos) + i * 4 + 14, 0, 1);
            const q = n === '?';
            return (
              <div key={i} style={{height: 230, borderRadius: 14, border: `8px solid ${q ? PINK : '#c9a36a'}`, background: q ? '#2a1236' : '#1d1424', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${[-2, 1.5, -1, 2, -1.5, 1][i]}deg)`, boxShadow: q ? `0 0 26px ${PINK}` : '0 10px 20px rgba(0,0,0,0.5)'}}>
                <Big size={q ? 110 : 34} c={q ? PINK2 : '#e9dcc5'} glow={q ? PINK : '#000'}>{n}</Big>
              </div>
            );
          })}
        </div>
      </Pop>
    </>
  );
};

const Photo: React.FC = () => {
  const f = useCurrentFrame();
  const palms = lerp(f, F(T.palm1), F(T.palm1) + 14, 0, 1);
  const ufo = lerp(f, F(T.ufo2), F(T.ufo2) + 20, 0, 1);
  const scan = ((f - F(T.nobody2)) / 40) % 1;
  const shrink = lerp(f, F(T.fans), F(T.fans) + 18, 0, 1, IO);
  const stamp = lerp(f, F(T.screenshot), F(T.screenshot) + 10, 0, 1);
  const w = 820 - 320 * shrink, h = 615 - 240 * shrink;
  if (f < F(T.one) - 2 || f > F(T.right) + 14) return null;
  const pin = lerp(f, F(T.one), F(T.one) + 16, 0, 1);
  const out = lerp(f, F(T.right) - 0.0, F(T.right) + 12, 0, 1, IO);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300 - 40 * shrink, display: 'flex', justifyContent: 'center', opacity: pin * (1 - out), transform: `scale(${0.85 + 0.15 * pin})`}}>
      <div style={{position: 'relative', width: w, height: h, border: '14px solid #c9a36a', borderRadius: 12, boxShadow: `0 0 40px ${PINK}88, 0 20px 40px rgba(0,0,0,0.6)`, overflow: 'hidden', background: '#000'}}>
        <HouseArt palms={palms} ufo={ufo} t={f} />
        {f >= F(T.nobody2) && f < F(T.fans) && (
          <div style={{position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: CYAN, boxShadow: `0 0 20px ${CYAN}`}} />
        )}
        <div style={{position: 'absolute', right: 20, top: 20, opacity: stamp, transform: `rotate(-10deg) scale(${1.6 - 0.6 * stamp})`, border: `6px solid ${RED}`, borderRadius: 12, padding: '6px 18px', background: 'rgba(0,0,0,0.35)'}}><Big size={64} c={RED} glow={RED}>GTA 6?</Big></div>
      </div>
    </div>
  );
};

const PhotoLabels: React.FC = () => {
  const f = useCurrentFrame();
  const chips = ['GTA III', 'VICE CITY', 'SAN ANDREAS'];
  return (
    <>
      <Pop a={T.house1} b={T.every - 0.1} style={{...C, top: 990}}><Tag>suburban house · palms · ufo</Tag></Pop>
      <Pop a={T.every} b={T.nobody2 - 0.1} style={{left: 70, right: 70, top: 980}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
          {chips.map((c, i) => {
            const p = lerp(f, F(T.every) + i * 5, F(T.every) + i * 5 + 12, 0, 1);
            return <div key={i} style={{opacity: p, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', ...panel(GRN), borderRadius: 18}}>{ICheck(34)}<Lab c="#fff" size={22}>{c}</Lab></div>;
          })}
        </div>
      </Pop>
      <Pop a={T.thiss} b={T.nobody2 - 0.1} from="zoom" style={{...C, top: 1110}}><Big size={74} c={PINK2}>THIS ONE?</Big></Pop>
      <Pop a={T.nobody2} b={T.fans - 0.1} from="zoom" style={{...C, top: 1010}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 40px', ...panel(RED)}}>{ISearch(70)}<div><Lab c={PINK2} size={22}>source</Lab><Big size={64} c={RED} glow={RED}>UNKNOWN</Big></div></div>
      </Pop>
    </>
  );
};

const Leak: React.FC = () => {
  const f = useCurrentFrame();
  const line = lerp(f, F(T.ten), F(T.months) + 30, 0, 1, IO);
  const n = Math.round(lerp(f, F(T.ten), F(T.months) + 20, 0, 10, IO));
  const leak = lerp(f, F(T.y2022), F(T.y2022) + 12, 0, 1);
  return (
    <>
      <Pop a={T.first} b={T.right - 0.1} from="down" style={{...C, top: 700}}><Big size={78}>FIRST SCREENSHOT</Big></Pop>
      <Pop a={T.ten} b={T.right - 0.1} style={{left: 80, right: 80, top: 860}}>
        <div style={{position: 'relative', height: 330, ...panel(), padding: 30}}>
          <div style={{position: 'absolute', left: 90, right: 90, top: 120, height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 6}} />
          <div style={{position: 'absolute', left: 90, top: 120, height: 10, width: `calc(${line} * (100% - 180px))`, background: `linear-gradient(90deg, ${PINK}, ${YEL})`, borderRadius: 6, boxShadow: `0 0 16px ${PINK}`}} />
          <div style={{position: 'absolute', left: 50, top: 85, width: 80, height: 80, borderRadius: 999, ...panel(PINK), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{IUfo(50, PINK2)}</div>
          <div style={{position: 'absolute', left: 30, top: 190}}><Lab c="#fff" size={22}>nov 2021</Lab></div>
          <div style={{position: 'absolute', right: 50, top: 85, width: 80, height: 80, borderRadius: 999, ...panel(RED), display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.35 + 0.65 * leak}}>{ILock(46, RED)}</div>
          <div style={{position: 'absolute', right: 30, top: 190, textAlign: 'right', opacity: 0.35 + 0.65 * leak}}><Lab c="#fff" size={22}>sep 2022</Lab><div style={{marginTop: 6}}><Lab c={RED} size={22}>the leak</Lab></div></div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center'}}><Big size={64} c={YEL} glow={YEL}>{n} MONTHS</Big></div>
        </div>
      </Pop>
    </>
  );
};

const Found: React.FC = () => {
  const f = useCurrentFrame();
  const items = [{t: T.garage1, s: 'SAME GARAGE'}, {t: T.palm2, s: 'SAME PALM TREES'}];
  return (
    <>
      <Pop a={T.right} b={T.launch - 0.05} from="zoom" style={{...C, top: 560}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '30px 50px', ...panel(GRN)}}>{ICheck(90)}<Big size={90} c={GRN} glow={GRN}>THEY WERE RIGHT</Big></div>
      </Pop>
      <Pop a={T.launch} b={T.but - 0.1} from="down" style={{...C, top: 290}}><Tag c={YEL}>launch day</Tag></Pop>
      <Pop a={T.found} b={T.but - 0.1} from="zoom" style={{left: 140, right: 140, top: 400}}>
        <div style={{position: 'relative', height: 560, borderRadius: 30, border: `5px solid ${PINK}`, boxShadow: `0 0 40px ${PINK}, inset 0 0 40px ${PINK}55`}}>
          <div style={{position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', ...panel()}}>{IPin(50)}<Lab c="#fff" size={24}>leonida</Lab></div>
          <div style={{position: 'absolute', right: -60, bottom: -70, width: 320, height: 240, border: '10px solid #c9a36a', borderRadius: 10, overflow: 'hidden', transform: 'rotate(4deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', opacity: lerp(f, F(T.exact), F(T.exact) + 14, 0, 1)}}>
            <HouseArt palms={1} ufo={1} t={f} />
          </div>
          <div style={{position: 'absolute', right: -40, bottom: 160, opacity: lerp(f, F(T.exact), F(T.exact) + 14, 0, 1)}}><Tag size={22}>2021 photo</Tag></div>
        </div>
      </Pop>
      <Pop a={T.garage1 - 0.15} b={T.but - 0.1} style={{left: 0, right: 0, top: 1060}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 18}}>
          {items.map((it, i) => {
            const p = lerp(f, F(it.t), F(it.t) + 12, 0, 1);
            return <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', ...panel(GRN), borderRadius: 20}}>{ICheck(40)}<Lab c="#fff" size={24}>{it.s}</Lab></div>;
          })}
        </div>
      </Pop>
    </>
  );
};

const Garage: React.FC = () => {
  const f = useCurrentFrame();
  const up = lerp(f, F(T.brk), F(T.brk) + 40, 0, 1, IO);
  const red = f >= F(T.but) && f < F(T.would) ? 0.25 + 0.1 * Math.sin(f * 0.12) : 0;
  return (
    <>
      {red > 0 && <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, rgba(255,40,70,0) 30%, rgba(160,0,30,${red}) 100%)`, pointerEvents: 'none'}} />}
      <Pop a={T.creepy} b={T.hideout - 0.1} from="down" style={{...C, top: 300}}><Tag c={RED}>the creepy part</Tag></Pop>
      <Pop a={T.brk} b={T.hideout - 0.1} from="zoom" style={{...C, top: 430}}>
        <div style={{position: 'relative', width: 640, height: 520, ...panel(RED), overflow: 'hidden', padding: 0}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%, rgba(255,60,90,0.55), rgba(10,2,8,1) 70%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${(1 - up) * 100}%`, background: 'repeating-linear-gradient(180deg, #8d8679 0 52px, #6d665a 52px 58px)'}} />
          <div style={{position: 'absolute', left: '50%', bottom: 40, transform: 'translateX(-50%)', opacity: 1 - up}}>{ILock(80, '#222')}</div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, display: 'flex', justifyContent: 'center', opacity: up}}><Lab c="#fff" size={28}>garage</Lab></div>
        </div>
      </Pop>
      <Pop a={T.hideout} b={T.notes - 0.1} from="zoom" style={{...C, top: 520}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '34px 50px', ...panel(RED)}}>
          <Lab c={RED}>hideout</Lab>
          <Big size={70}>HE THINKS HE'S</Big>
          <Big size={86} c={PINK2} glow={PINK}>IN A VIDEO GAME</Big>
        </div>
      </Pop>
    </>
  );
};

const Board: React.FC = () => {
  const f = useCurrentFrame();
  const notes = [
    {t: T.identical, s: 'IDENTICAL\nPEOPLE', x: 60, y: 60, r: -4},
    {t: T.neighbors, s: "NEIGHBORS\nCAN'T GET HOME", x: 470, y: 120, r: 3},
    {t: T.locked, s: 'LOCKED DOORS\n= NOTHING', x: 160, y: 380, r: 2},
  ];
  const pins = [[200, 80], [610, 140], [300, 400], [250, 720], [650, 720]];
  const jl = [{t: T.j, s: 'J', x: 140}, {t: T.l, s: 'L', x: 540}];
  const str = (a: number[], b: number[], t: number) => {
    const p = lerp(f, F(t), F(t) + 16, 0, 1);
    return <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke="#e0283f" strokeWidth="4" />;
  };
  return (
    <Pop a={T.notes} b={T.would - 0.1} from="zoom" style={{left: 70, right: 70, top: 270}}>
      <div style={{position: 'relative', height: 1060, borderRadius: 24, background: 'linear-gradient(135deg, #5a3b22, #3e2816)', border: '10px solid #2a1a0c', boxShadow: `0 0 40px ${RED}66, inset 0 0 60px rgba(0,0,0,0.6)`, overflow: 'hidden'}}>
        <svg width="940" height="1040" style={{position: 'absolute', left: 0, top: 0}}>
          {f >= F(T.neighbors) && str(pins[0], pins[1], T.neighbors)}
          {f >= F(T.locked) && str(pins[1], pins[2], T.locked)}
          {f >= F(T.j) && str(pins[2], pins[3], T.j)}
          {f >= F(T.l) && str(pins[3], pins[4], T.l)}
        </svg>
        {notes.map((n, i) => {
          const p = lerp(f, F(n.t), F(n.t) + 12, 0, 1);
          return (
            <div key={i} style={{position: 'absolute', left: n.x, top: n.y, width: 330, padding: '30px 24px', background: '#f3e7a8', transform: `rotate(${n.r}deg) scale(${1.15 - 0.15 * p})`, opacity: p, boxShadow: '0 12px 24px rgba(0,0,0,0.5)'}}>
              <div style={{fontFamily: "'Permanent Marker', cursive", fontSize: 40, color: '#1b1b1b', lineHeight: 1.1, whiteSpace: 'pre-line'}}>{n.s}</div>
            </div>
          );
        })}
        {jl.map((c, i) => {
          const p = lerp(f, F(c.t), F(c.t) + 12, 0, 1);
          const ring = lerp(f, F(c.t) + 6, F(c.t) + 26, 0, 1);
          return (
            <div key={i} style={{position: 'absolute', left: c.x, top: 640, width: 240, height: 290, background: '#f4f1ea', padding: 16, transform: `rotate(${i ? 4 : -3}deg) scale(${1.15 - 0.15 * p})`, opacity: p, boxShadow: '0 12px 24px rgba(0,0,0,0.5)'}}>
              <div style={{width: '100%', height: 200, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{fontFamily: H1, fontWeight: 900, fontSize: 150, color: '#fff'}}>{c.s}</span></div>
              <svg width="260" height="260" style={{position: 'absolute', left: -10, top: -10}}><circle cx="130" cy="120" r="105" fill="none" stroke="#e0283f" strokeWidth="7" strokeDasharray={`${660 * ring} 700`} transform="rotate(-90 130 120)" /></svg>
            </div>
          );
        })}
        {pins.map((p, i) => (i < 3 || f >= F(i === 3 ? T.j : T.l)) && <div key={i} style={{position: 'absolute', left: p[0] - 12, top: p[1] - 12, width: 24, height: 24, borderRadius: 99, background: '#e0283f', boxShadow: '0 3px 6px rgba(0,0,0,0.6)'}} />)}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', opacity: lerp(f, F(T.rules), F(T.rules) + 12, 0, 1)}}><Tag c={RED} size={28}>don't follow the rules</Tag></div>
      </div>
    </Pop>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const click = F(T.follow) + 18;
  const pressed = f >= click && f < click + 8;
  const followed = f >= click + 4;
  return (
    <>
      <Pop a={T.would} b={T.follow - 0.05} from="zoom" style={{...C, top: 520}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '36px 54px', ...panel(RED)}}>
          <Big size={84}>WOULD YOU</Big>
          <Big size={84} c={RED} glow={RED}>GO INSIDE?</Big>
        </div>
      </Pop>
      <Pop a={T.follow} b={S2END} from="zoom" style={{...C, top: 600}}>
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
  {t: 0, s: 'imp', v: 0.8}, {t: 0.05, s: 'sub1', v: 0.6}, {t: T.y2021, s: 'mpop', v: 0.6}, {t: T.rock, s: 'pop2', v: 0.6}, {t: T.gta1, s: 'whip', v: 0.6},
  {t: T.another, s: 'hud2', v: 0.5}, {t: T.nobody, s: 'pop1', v: 0.6}, {t: T.noticed, s: 'wrong', v: 0.5},
  {t: T.in2, s: 'riserimp', v: 0.55}, {t: T.san, s: 'pop2', v: 0.6}, {t: T.ufo1, s: 'hud1', v: 0.6}, {t: T.ufo1 + 0.1, s: 'fsw', v: 0.4},
  {t: T.photos, s: 'c3', v: 0.6}, {t: T.photos + 0.07, s: 'c5', v: 0.6}, {t: T.photos + 0.13, s: 'c3', v: 0.6}, {t: T.photos + 0.2, s: 'c5', v: 0.6},
  {t: T.one, s: 'wh2', v: 0.6}, {t: T.palm1, s: 'pop2', v: 0.5}, {t: T.ufo2, s: 'appear', v: 0.6}, {t: T.every, s: 'confirm', v: 0.4}, {t: T.thiss, s: 'imp', v: 0.4},
  {t: T.nobody2, s: 'dtype', v: 0.25}, {t: T.knew, s: 'wrong', v: 0.5},
  {t: T.fans, s: 'fsw', v: 0.6}, {t: T.screenshot, s: 'imp', v: 0.55}, {t: T.ten, s: 'hud2', v: 0.5}, {t: T.months, s: 'bips', v: 0.15}, {t: T.y2022, s: 'glx2', v: 0.5},
  {t: T.right, s: 'riserimp', v: 0.5}, {t: T.right, s: 'right', v: 0.4}, {t: T.launch, s: 'pop2', v: 0.6}, {t: T.found, s: 'whip', v: 0.5}, {t: T.exact, s: 'pop1', v: 0.5},
  {t: T.garage1, s: 'confirm', v: 0.45}, {t: T.palm2, s: 'confirm', v: 0.45},
  {t: T.but, s: 'sdl', v: 0.6}, {t: T.but, s: 'glx', v: 0.5}, {t: T.creepy, s: 'notif', v: 0.4}, {t: T.brk, s: 'rrise', v: 0.4, peak: 0.2}, {t: T.brk + 0.1, s: 'imp', v: 0.4},
  {t: T.hideout, s: 'whip', v: 0.5}, {t: T.video, s: 'hud2', v: 0.5},
  {t: T.notes, s: 'fsw', v: 0.5}, {t: T.identical, s: 'pop2', v: 0.6}, {t: T.neighbors, s: 'pop2', v: 0.6}, {t: T.locked, s: 'pop2', v: 0.6}, {t: T.identical, s: 'typing', v: 0.25},
  {t: T.j, s: 'snap', v: 0.5}, {t: T.l, s: 'snap', v: 0.5}, {t: T.rules, s: 'imp', v: 0.45},
  {t: T.would, s: 'wh2', v: 0.6}, {t: T.follow, s: 'riserimp', v: 0.5}, {t: T.follow + 0.3, s: 'c1', v: 0.9}, {t: T.follow + 0.4, s: 'notif', v: 0.5},
];

const Subs = makeSubs(W, S2END, {
  '2021': YEL, rockstar: PINK2, gta: PINK2, '6': PINK2, nobody: RED, noticed: RED, ufo: CYAN, house: YEL, palm: GRN, trees: GRN,
  first: YEL, screenshot: YEL, ten: YEL, months: YEL, '2022': RED, leak: RED, right: GRN, same: GRN, leonida: PINK2,
  creepy: RED, garage: RED, video: PINK2, game: PINK2, identical: YEL, locked: RED, j: YEL, l: YEL, rules: RED, secrets: YEL,
});

export const S2: React.FC = () => (
  <ShortFrame id="s2glx" shots={SHOTS} end={S2END} voice="s2/voice.wav" sfx={SFX} Subs={Subs} streaks={[T.in2, T.fans, T.right]} glitches={[T.y2022, T.but]}>
    <Hook />
    <Bar />
    <Photo />
    <PhotoLabels />
    <Leak />
    <Found />
    <Garage />
    <Board />
    <Outro />
  </ShortFrame>
);
