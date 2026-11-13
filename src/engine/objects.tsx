// Objetos dibujados en SVG (viewBox -110..110) para protagonistas y miniaturas cuando el tema no es un país.
// Añade aquí nuevos objetos según el tema del vídeo (con contorno de tinta grueso y un brillo).
import React from 'react';
import { C, DISPLAY } from './theme';

const INK = '#141320';
export type ObjName = 'trophy' | 'ball' | 'thermo' | 'ban' | 'fire' | 'snow' | 'crown' | 'money' | 'question' | 'gum' | 'phone' | 'bill' | 'passport' | 'earth' | 'brain' | 'tank';
export const OBJ: Record<ObjName, React.ReactNode> = {
  trophy: (<g stroke={INK} strokeWidth={7} strokeLinejoin="round"><path d="M-60,-80 H60 V-20 C60,30 25,50 0,52 C-25,50 -60,30 -60,-20 Z" fill="#FFC83D" /><path d="M-60,-62 H-88 V-36 C-88,-10 -70,4 -52,6 M60,-62 H88 V-36 C88,-10 70,4 52,6" fill="none" /><rect x={-14} y={50} width={28} height={26} fill="#E0A21C" /><rect x={-46} y={74} width={92} height={22} rx={6} fill="#7A4B12" /><path d="M-40,-66 V-20 C-40,10 -24,26 -10,32" stroke="#FFF2B5" strokeWidth={9} fill="none" /></g>),
  ball: (<g stroke={INK} strokeWidth={7}><circle r={88} fill="#fff" /><path d="M0,-30 L28,-10 L18,24 L-18,24 L-28,-10 Z" fill={INK} /><path d="M0,-30 V-86 M28,-10 L80,-30 M18,24 L50,70 M-18,24 L-50,70 M-28,-10 L-80,-30" fill="none" /></g>),
  thermo: (<g stroke={INK} strokeWidth={7}><rect x={-22} y={-96} width={44} height={140} rx={22} fill="#fff" /><circle cy={62} r={40} fill={C.red} /><rect x={-9} y={-60} width={18} height={110} fill={C.red} stroke="none" /><path d="M22,-70 h14 M22,-44 h14 M22,-18 h14 M22,8 h14" /></g>),
  ban: (<g><circle r={90} fill="#fff" stroke={INK} strokeWidth={8} /><circle r={72} fill="none" stroke={C.red} strokeWidth={26} /><path d="M-50,-50 L50,50" stroke={C.red} strokeWidth={26} /></g>),
  fire: (<g stroke={INK} strokeWidth={7} strokeLinejoin="round"><path d="M0,-100 C40,-50 80,-20 70,30 C60,80 -60,80 -70,30 C-80,-20 -30,-30 -20,-70 C-6,-40 6,-36 10,-30 C18,-60 8,-80 0,-100 Z" fill="#FF7A1A" /><path d="M0,-30 C20,0 36,14 30,40 C24,66 -26,66 -30,40 C-34,16 -10,6 0,-30 Z" fill="#FFD23F" stroke="none" /></g>),
  snow: (<g stroke="#fff" strokeWidth={16} strokeLinecap="round">{[0, 60, 120].map((a) => <path key={a} transform={`rotate(${a})`} d="M0,-90 V90 M-22,-68 L0,-46 L22,-68 M-22,68 L0,46 L22,68" fill="none" />)}</g>),
  crown: (<g stroke={INK} strokeWidth={7} strokeLinejoin="round"><path d="M-90,50 L-80,-50 L-40,0 L0,-70 L40,0 L80,-50 L90,50 Z" fill="#FFC83D" /><rect x={-90} y={46} width={180} height={30} rx={6} fill="#E0A21C" /><circle cx={0} cy={-70} r={12} fill={C.red} /><circle cx={-80} cy={-50} r={10} fill={C.teal} /><circle cx={80} cy={-50} r={10} fill={C.teal} /></g>),
  money: (<g stroke={INK} strokeWidth={7}><path d="M-40,-70 Q0,-96 40,-70 L28,-50 Q76,-20 76,30 Q76,90 0,90 Q-76,90 -76,30 Q-76,-20 -28,-50 Z" fill="#5DBB63" /><text y={50} textAnchor="middle" fontSize={96} fontFamily={DISPLAY} fill="#E8FFD9" stroke={INK} strokeWidth={5}>$</text></g>),
  question: (<g><text y={70} textAnchor="middle" fontSize={230} fontFamily={DISPLAY} fill="#FFD23F" stroke={INK} strokeWidth={12} paintOrder="stroke">?</text></g>),
  // chicle mascado: masa rosa irregular con pliegues, brillo y una hebra estirada
  gum: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <path d="M58,62 C70,78 84,84 96,80" fill="none" stroke="#FF7FB2" strokeWidth={10} />
      <path d="M58,62 C70,78 84,84 96,80" fill="none" strokeWidth={3} />
      <path d="M-70,-62 C-52,-90 -14,-82 0,-92 C22,-104 52,-84 66,-70 C90,-56 100,-30 92,-6 C102,16 98,46 76,62 C60,82 30,80 12,92 C-10,104 -40,92 -56,78 C-82,70 -100,44 -94,18 C-104,-6 -92,-40 -70,-62 Z" fill="#FF8DC0" />
      <path d="M-56,30 C-40,42 -22,40 -12,30 M24,48 C40,52 56,44 62,30 M-30,-44 C-14,-52 4,-50 14,-40 M50,-36 C60,-26 64,-12 62,0" fill="none" stroke="#E0569A" strokeWidth={6} />
      <path d="M-64,-30 C-60,-56 -40,-70 -18,-70" stroke="#FFD3E8" strokeWidth={12} fill="none" />
      <circle cx={-70} cy={-6} r={6} fill="#FFD3E8" stroke="none" />
    </g>
  ),
  // factura de deuda: papel con borde en zigzag, renglones arriba y "−$" rojo abajo (centro libre para la cara)
  bill: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
      <path d="M-70,-104 H70 V92 L56,106 L42,92 L28,106 L14,92 L0,106 L-14,92 L-28,106 L-42,92 L-56,106 L-70,92 Z" fill="#FFF8E7" />
      <path d="M-48,-80 H48 M-48,-62 H20" stroke="#B9B2A0" strokeWidth={8} strokeLinecap="round" />
      <path d="M-48,58 H-8" stroke="#B9B2A0" strokeWidth={8} strokeLinecap="round" />
      <text x={34} y={82} textAnchor="middle" fontSize={56} fontFamily={DISPLAY} fill="#FF4B3E" stroke={INK} strokeWidth={4} paintOrder="stroke">−$</text>
    </g>
  ),
  // pasaporte genérico: tapa granate con lomo, globo dorado arriba y rótulo abajo (centro libre para la cara)
  passport: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
      <rect x={-66} y={-100} width={140} height={200} rx={12} fill="#F2E6C9" />
      <rect x={-74} y={-104} width={140} height={200} rx={12} fill="#8E1F3A" />
      <path d="M-58,-104 V96" stroke="#6B1229" strokeWidth={6} />
      <g transform="translate(-4,-66)" stroke="#E8C25A" strokeWidth={4} fill="none">
        <circle r={22} /><ellipse rx={10} ry={22} /><path d="M-22,0 H22 M-19,-11 H19 M-19,11 H19" />
      </g>
      <text x={-4} y={78} textAnchor="middle" fontSize={21} fontFamily={DISPLAY} fill="#E8C25A" stroke="none">PASAPORTE</text>
      <path d="M44,-92 L58,-78" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={8} strokeLinecap="round" />
    </g>
  ),
  // smartphone genérico (sin logotipos): carcasa, pantalla con degradado, isla de cámara y brillo
  phone: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
      <defs>
        <linearGradient id="phoneScr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6FD3FF" /><stop offset="0.55" stopColor="#7B6CFF" /><stop offset="1" stopColor="#FF6FB5" />
        </linearGradient>
      </defs>
      <rect x={-58} y={-104} width={116} height={208} rx={24} fill="#2B2D3A" />
      <rect x={-48} y={-92} width={96} height={184} rx={16} fill="url(#phoneScr)" strokeWidth={4} />
      <rect x={-16} y={-86} width={32} height={10} rx={5} fill={INK} stroke="none" />
      <path d="M-36,-60 L-6,-90" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={10} strokeLinecap="round" />
      <path d="M-40,-30 L-22,-48" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={7} strokeLinecap="round" />
      <rect x={-20} y={80} width={40} height={6} rx={3} fill="#FFFFFF" fillOpacity={0.8} stroke="none" />
    </g>
  ),
  // planeta Tierra (población): océano azul con continentes verdes y brillo (centro libre para la cara)
  earth: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
      <circle r={96} fill="#3FA9F5" />
      <path d="M-78,-48 C-60,-70 -30,-72 -20,-58 C-10,-44 -34,-36 -40,-20 C-46,-4 -66,-8 -80,-18 Z" fill="#5DCB6A" strokeWidth={5} />
      <path d="M20,-84 C44,-80 70,-60 80,-36 C66,-30 50,-40 38,-30 C26,-22 6,-40 8,-60 Z" fill="#5DCB6A" strokeWidth={5} />
      <path d="M-62,40 C-44,30 -26,44 -30,62 C-34,80 -50,86 -60,74 Z" fill="#5DCB6A" strokeWidth={5} />
      <path d="M58,30 C76,26 88,40 82,58 C72,74 52,72 50,56 Z" fill="#5DCB6A" strokeWidth={5} />
      <path d="M-56,-74 C-40,-88 -16,-94 4,-92" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={10} strokeLinecap="round" fill="none" />
    </g>
  ),
  // cerebro (coeficiente intelectual): dos lóbulos rosas con pliegues y brillo
  brain: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <path d="M0,-84 C-20,-100 -56,-96 -70,-74 C-96,-70 -104,-40 -94,-20 C-108,0 -100,34 -78,44 C-76,70 -46,86 -22,76 C-12,90 12,90 22,76 C46,86 76,70 78,44 C100,34 108,0 94,-20 C104,-40 96,-70 70,-74 C56,-96 20,-100 0,-84 Z" fill="#FF9EC4" />
      <path d="M0,-84 V76" fill="none" stroke="#D9578E" strokeWidth={6} />
      <path d="M-70,-74 C-60,-58 -40,-58 -34,-70 M-94,-20 C-80,-14 -70,-24 -72,-36 M-78,44 C-66,34 -66,20 -76,12 M70,-74 C60,-58 40,-58 34,-70 M94,-20 C80,-14 70,-24 72,-36 M78,44 C66,34 66,20 76,12" fill="none" stroke="#D9578E" strokeWidth={6} />
      <path d="M-50,-84 C-36,-92 -20,-92 -10,-86" stroke="#FFE0EC" strokeWidth={9} fill="none" />
    </g>
  ),
  // tanque militar genérico: orugas, casco verde oliva, torreta y cañón (cara en el casco)
  tank: (
    <g stroke={INK} strokeWidth={7} strokeLinejoin="round">
      <rect x={20} y={-76} width={90} height={14} rx={7} fill="#56602F" />
      <path d="M-40,-80 C-40,-100 40,-100 40,-80 L46,-40 H-46 Z" fill="#7C8A3E" />
      <rect x={-100} y={-44} width={200} height={84} rx={20} fill="#8E9C48" />
      <rect x={-108} y={36} width={216} height={50} rx={25} fill="#3B3D35" />
      {[-80, -40, 0, 40, 80].map((x) => <circle key={x} cx={x} cy={61} r={14} fill="#9A9C90" strokeWidth={5} />)}
      <path d="M-84,-32 C-70,-40 -50,-40 -36,-36" stroke="#C8D27A" strokeWidth={9} strokeLinecap="round" fill="none" />
    </g>
  ),
};
