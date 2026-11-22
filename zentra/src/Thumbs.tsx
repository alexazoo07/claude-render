// Vertical thumbnails (1080x1920) in the Zentra shorts style
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {PINK, PINK2, YEL, GRN, RED, CYAN, panel, Tag, Big, Lab, Digits, ICheck, IX} from './ShortKit';
import {HouseArt} from './S2';
import {Ring} from './S4';

const Bg: React.FC<{src: string; scale?: number; bright?: number}> = ({src, scale = 1.06, bright = 0.85}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#07030c'}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, filter: `saturate(1.2) contrast(1.08) brightness(${bright})`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,6,60,0.55) 0%, rgba(70,10,80,0.15) 45%, rgba(10,4,20,0.8) 100%)', mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(8,2,16,0.85) 100%)'}} />
  </AbsoluteFill>
);
const Logo: React.FC<{top?: number}> = ({top = 120}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
    <Img src={staticFile('gtavi_logo.png')} style={{width: 230, filter: `drop-shadow(0 0 30px ${PINK})`}} />
  </div>
);
const Title: React.FC<{lines: [string, string?][]; top: number; size?: number}> = ({lines, top, size = 150}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
    {lines.map(([t, c], i) => (
      <div key={i} style={{fontFamily: "'Rubik'", fontWeight: 900, fontSize: size, lineHeight: 1, color: c ?? '#fff', letterSpacing: -2, WebkitTextStroke: '6px rgba(0,0,0,0.9)', paintOrder: 'stroke fill', textShadow: `0 0 40px ${(c ?? PINK)}aa, 0 10px 30px rgba(0,0,0,0.9)`, whiteSpace: 'nowrap'}}>{t}</div>
    ))}
  </div>
);

export const Thumb1: React.FC = () => (
  <AbsoluteFill>
    <Bg src="thumbs/t1.jpg" />
    <Logo />
    <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', gap: 28}}>
      {['1', '2', '3'].map((n, i) => (
        <div key={i} style={{width: 220, height: 220, ...panel(i === 1 ? YEL : PINK), borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Big size={160} glow={i === 1 ? YEL : PINK}>{n}</Big></div>
      ))}
    </div>
    <Title top={800} lines={[['3 THINGS'], ['YOU MUST', YEL], ['KNOW']]} size={170} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'center'}}><Tag c={YEL} size={44}>before playing gta 6</Tag></div>
  </AbsoluteFill>
);

export const Thumb2: React.FC = () => (
  <AbsoluteFill>
    <Bg src="thumbs/t2.jpg" bright={0.75} />
    <Logo top={100} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 820, height: 615, border: '16px solid #c9a36a', borderRadius: 14, overflow: 'hidden', transform: 'rotate(-3deg)', boxShadow: `0 0 60px ${PINK}aa, 0 30px 60px rgba(0,0,0,0.7)`}}>
        <HouseArt palms={1} ufo={1} t={0} />
        <div style={{position: 'absolute', right: 24, top: 24, transform: 'rotate(-10deg)', border: `7px solid ${RED}`, borderRadius: 14, padding: '6px 20px', background: 'rgba(0,0,0,0.35)'}}><Big size={80} c={RED} glow={RED}>GTA 6?</Big></div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center'}}><Digits text="2021" c={PINK} size={150} /></div>
    <Title top={1300} lines={[['HIDDEN IN', '#fff'], ['PLAIN SIGHT', PINK2]]} size={120} />
  </AbsoluteFill>
);

export const Thumb3: React.FC = () => (
  <AbsoluteFill>
    <Bg src="thumbs/t3.jpg" scale={1.18} bright={0.9} />
    <Logo top={110} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1020, display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '30px 50px', ...panel(YEL)}}>
        <Lab c={YEL} size={30}>climb time</Lab>
        <Digits text="07:00" c={YEL} size={140} />
      </div>
    </div>
    <Title top={1440} lines={[['FOR THIS?', '#fff']]} size={160} />
  </AbsoluteFill>
);

export const Thumb4: React.FC = () => (
  <AbsoluteFill>
    <Bg src="thumbs/t4.jpg" scale={1.04} bright={0.85} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 420, background: 'linear-gradient(180deg, #07030c 0%, rgba(7,3,12,0.85) 45%, rgba(7,3,12,0) 100%)'}} />
    <Logo top={90} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', justifyContent: 'center'}}>
      <div style={{padding: 18, ...panel(YEL), borderRadius: 999}}><Ring s={430} spin={20} c={YEL} car={0.15} /></div>
    </div>
    <Title top={1030} lines={[['GTA 5', '#fff'], ['NEVER HAD', '#fff'], ['THIS', YEL]]} size={150} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1560, display: 'flex', justifyContent: 'center'}}><Tag c={PINK} size={42}>new in gta 6</Tag></div>
  </AbsoluteFill>
);

export const Thumb5: React.FC = () => (
  <AbsoluteFill>
    <Bg src="thumbs/t5.jpg" scale={1.04} bright={1.05} />
    <AbsoluteFill style={{background: `radial-gradient(circle at 20% 40%, ${CYAN}33 0%, rgba(0,0,0,0) 45%)`}} />
    <Logo top={110} />
    <Title top={470} lines={[['THIS IS', '#fff'], ['GTA 6?!', CYAN]]} size={170} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center'}}><Tag c={YEL} size={44}>not need for speed</Tag></div>
  </AbsoluteFill>
);
