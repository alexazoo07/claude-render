// Miniaturas shorts 5-10 (estilo El Mapa Animado, 2 por short)
import React from 'react';
import {center} from './VShort3';
import {Cup, Euro} from './kit';
import {Calendar, Stadium, Taco, TeaCup, Mate, Nata, Sausage, Baguette, RuleBook, Goal} from './kit2';
import {TBase, Big, Hero, Side, Tag, Tomb} from './thumbs';
const cam = (k: string, z: number, dy = 0) => { const c = center(k); return {x: c.x, y: c.y - 60 + dy, z}; };
const P: React.FC<{x: number; y: number; r?: number; children: React.ReactNode}> = ({x, y, r = 0, children}) => <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`}}>{children}</div>;
const RowAt: React.FC<{y: number; children: React.ReactNode; gap?: number}> = ({y, children, gap = 18}) => <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap}}>{children}</div>;

// 5 · ALEMANIA
export const TQ5A: React.FC = () => (
	<TBase cam={cam('DEU', 3.0)} grey={['DEU']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="ALEMANIA?!" size={172} top={250} c="#FFD23F" />
		<Hero k="DEU" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="ALEMANIA" years="1908-2026" /></P>
		<Side k="BRA" d={210} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="NLD" d={210} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={80} y={690}><Tag text="¡SIN 4 MUNDIALES!" size={58} bg="#FF4D5E" c="#fff" rot={-8} /></P>
	</TBase>
);
export const TQ5B: React.FC = () => (
	<TBase cam={cam('DEU', 3.0, 40)} grey={['DEU']}>
		<Big text="¿Y SUS 4" size={150} top={90} />
		<Big text="MUNDIALES?!" size={162} top={250} c="#FF3B3B" />
		<RowAt y={560}>{[0, 1, 2, 3].map((j) => <div key={j} style={{transform: `rotate(${(j - 1.5) * 7}deg)`}}><Cup s={170} grey={j > 1} /></div>)}</RowAt>
		<Hero k="DEU" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="ARG" d={210} x={150} y={1620} mood="smug" look={[0.6, -0.3]} />
		<Side k="ITA" d={210} x={930} y={1620} mood="happy" look={[-0.6, -0.3]} />
		<P x={40} y={1080} r={-14}><Sausage s={230} /></P>
	</TBase>
);
// 6 · FRANCIA
export const TQ6A: React.FC = () => (
	<TBase cam={cam('FRA', 2.6)} grey={['FRA']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="FRANCIA?!" size={200} top={250} c="#FFD23F" />
		<Hero k="FRA" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="FRANCIA" years="1904-2026" /></P>
		<Side k="HRV" d={200} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="ARG" d={220} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={80} y={690}><Tag text="¡SIN 2 MUNDIALES!" size={58} bg="#FF4D5E" c="#fff" rot={-8} /></P>
	</TBase>
);
export const TQ6B: React.FC = () => (
	<TBase cam={cam('FRA', 2.6, 40)} grey={['FRA']}>
		<Big text="¿QUIÉN GANA" size={140} top={90} />
		<Big text="EL 2018?!" size={210} top={240} c="#FF3B3B" />
		<RowAt y={560} gap={40}><div style={{transform: 'rotate(-8deg)'}}><Calendar s={230} year="2018" x={1} /></div><div style={{transform: 'rotate(8deg)'}}><Cup s={220} /></div></RowAt>
		<Hero k="FRA" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="HRV" d={210} x={150} y={1620} mood="love" look={[0.6, -0.3]} />
		<Side k="BRA" d={210} x={930} y={1620} mood="happy" look={[-0.6, -0.3]} />
		<P x={60} y={1090} r={-14}><Baguette s={240} /></P>
	</TBase>
);
// 7 · MÉXICO
export const TQ7A: React.FC = () => (
	<TBase cam={cam('MEX', 1.7)} grey={['MEX']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="MÉXICO?!" size={210} top={250} c="#FFD23F" />
		<Hero k="MEX" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="MÉXICO" years="1923-2026" /></P>
		<Side k="USA" d={210} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="CAN" d={210} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={60} y={700} r={-10}><Taco s={270} /></P>
	</TBase>
);
export const TQ7B: React.FC = () => (
	<TBase cam={cam('MEX', 1.7, 40)} grey={['MEX']}>
		<Big text="¿SIN EL" size={150} top={90} />
		<Big text="AZTECA?!" size={210} top={250} c="#FF3B3B" />
		<RowAt y={540}><Stadium s={380} label="ESTADIO AZTECA" /></RowAt>
		<Hero k="MEX" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="ARG" d={210} x={150} y={1620} mood="shock" look={[0.6, -0.3]} />
		<Side k="BRA" d={210} x={930} y={1620} mood="sad" look={[-0.6, -0.3]} />
	</TBase>
);
// 8 · INGLATERRA
export const TQ8A: React.FC = () => (
	<TBase cam={cam('ENG', 4.5)} grey={['ENG']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="INGLATERRA?!" size={160} top={260} c="#FFD23F" />
		<Hero k="ENG" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="INGLATERRA" years="1872-2026" /></P>
		<Side k="SCT" d={210} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="DEU" d={210} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={70} y={700} r={-10}><TeaCup s={260} /></P>
	</TBase>
);
export const TQ8B: React.FC = () => (
	<TBase cam={cam('ENG', 4.5, 40)} grey={['ENG']}>
		<Big text="¿FÚTBOL SIN" size={140} top={90} />
		<Big text="REGLAS?!" size={210} top={240} c="#FF3B3B" />
		<RowAt y={540} gap={40}><div style={{transform: 'rotate(-8deg)'}}><RuleBook s={230} /></div><div style={{transform: 'rotate(6deg)'}}><Goal s={240} /></div></RowAt>
		<Hero k="ENG" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="ARG" d={210} x={150} y={1620} mood="shock" look={[0.6, -0.3]} />
		<Side k="ITA" d={210} x={930} y={1620} mood="happy" look={[-0.6, -0.3]} />
	</TBase>
);
// 9 · URUGUAY
export const TQ9A: React.FC = () => (
	<TBase cam={cam('URY', 3.2)} grey={['URY']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="URUGUAY?!" size={200} top={250} c="#FFD23F" />
		<Hero k="URY" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="URUGUAY" years="1902-2026" /></P>
		<Side k="ARG" d={210} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="BRA" d={210} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={70} y={690} r={-10}><Mate s={260} /></P>
	</TBase>
);
export const TQ9B: React.FC = () => (
	<TBase cam={cam('URY', 3.2, 40)} grey={['URY']}>
		<Big text="¿Y EL" size={150} top={90} />
		<Big text="MARACANAZO?!" size={128} top={260} c="#FF3B3B" />
		<RowAt y={560} gap={30}>{['1930', '1950'].map((y, j) => <div key={y} style={{transform: `rotate(${j ? 8 : -8}deg)`}}><Calendar s={220} year={y} /></div>)}</RowAt>
		<Hero k="URY" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="BRA" d={230} x={150} y={1620} mood="love" look={[0.6, -0.3]} />
		<Side k="ARG" d={210} x={930} y={1620} mood="happy" look={[-0.6, -0.3]} />
	</TBase>
);
// 10 · PORTUGAL
export const TQ10A: React.FC = () => (
	<TBase cam={cam('PRT', 5.0)} grey={['PRT']}>
		<Big text="¿¡ADIÓS," size={150} top={90} />
		<Big text="PORTUGAL?!" size={180} top={250} c="#FFD23F" />
		<Hero k="PRT" d={560} x={560} y={1120} mood="sad" tears rot={-6} />
		<P x={60} y={1430} r={-8}><Tomb s={250} name="PORTUGAL" years="1921-2026" /></P>
		<Side k="ESP" d={220} x={880} y={720} mood="smug" look={[-0.5, 0.2]} />
		<Side k="FRA" d={210} x={880} y={1560} mood="happy" look={[-0.6, -0.3]} rot={6} />
		<P x={70} y={700} r={-10}><Nata s={270} /></P>
	</TBase>
);
export const TQ10B: React.FC = () => (
	<TBase cam={cam('PRT', 5.0, 40)} grey={['PRT']}>
		<Big text="¿Y LA EURO" size={150} top={90} />
		<Big text="2016?!" size={230} top={240} c="#FF3B3B" />
		<RowAt y={570}><div style={{transform: 'rotate(-6deg)'}}><Euro s={250} /></div></RowAt>
		<Hero k="PRT" d={580} x={540} y={1250} mood="panic" sweat rot={4} />
		<Side k="FRA" d={220} x={150} y={1620} mood="love" look={[0.6, -0.3]} />
		<Side k="GRC" d={210} x={930} y={1620} mood="smug" look={[-0.6, -0.3]} />
	</TBase>
);
export const TQ = {TQ5A, TQ5B, TQ6A, TQ6B, TQ7A, TQ7B, TQ8A, TQ8B, TQ9A, TQ9B, TQ10A, TQ10B};
