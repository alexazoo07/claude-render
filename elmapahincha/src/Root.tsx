import React from 'react';
import {Composition, Still} from 'remotion';
import {Hook} from './Hook';
import {Main, TOTAL} from './Main';
import {Video2, V2_TOTAL} from './v2/Video2';
import {Main3, TOTAL3} from './v3/Main3';
import {Video4, V4_TOTAL} from './v4/Video4';
import {Video5, V5_TOTAL} from './v5/Video5';
import {Video8, V8_TOTAL} from './v8/Video8';
import {Main6, TOTAL6} from './v6/Main6';
import {Video7, V7_TOTAL} from './v7/Video7';
import {T6a, T6b, T6c, T6d, T6e} from './v6/Thumbs6';
import {T7a, T7b, T7c, T7d, T7e} from './v7/Thumbs7';
import {T5a, T5b, T5c, T5d, T5e} from './v5/Thumbs5';
import {T8a, T8b, T8c, T8d, T8e} from './v8/Thumbs8';
import {T4a, T4b, T4c, T4d} from './v4/Thumbs4';
import {T3a, T3b, T3c, T3d} from './v3/Thumbs3';
import {T2a, T2b, T2c, T2d} from './v2/Thumbs2';
import {LogoA, BannerB} from './Brand';
import {Thumb1, Thumb2, Thumb3, Thumb4, Thumb5} from './Thumbs';
import './fonts';
import {ArtTest} from './v9/ArtTest';
import {T9a, T9b, T9c, T9d, T9e} from './v9/Thumbs9';
import {Video9, V9_TOTAL} from './v9/Video9';
import {Video10, V10_TOTAL} from './v10/Video10';
import {T10a, T10b, T10c, T10d, T10e} from './v10/Thumbs10';
import {Video11, V11_TOTAL} from './v11/Video11';
import {Video12, V12_TOTAL} from './v12/Video12';
import {Video13, V13_TOTAL} from './v13/Video13';
import {Video29, V29_TOTAL} from './v29/Video29';
import {Video35, V35_TOTAL} from './v35/Video35';
import {Video36, V36_TOTAL} from './v36/Video36';
import {Video37, V37_TOTAL} from './v37/Video37';
import {Video38, V38_TOTAL} from './v38/Video38';
import {Video39, V39_TOTAL} from './v39/Video39';
import {Video40, V40_TOTAL} from './v40/Video40';
import {Video41, V41_TOTAL} from './v41/Video41';
import {Video42, V42_TOTAL} from './v42/Video42';
import {T42a, T42b, T42c, T42d, T42e} from './v42/Thumbs42';
import {T41a, T41b, T41c, T41d, T41e} from './v41/Thumbs41';
import {T40a, T40b, T40c, T40d, T40e} from './v40/Thumbs40';
import {T39a, T39b, T39c, T39d, T39e} from './v39/Thumbs39';
import {Video34, V34_TOTAL} from './v34/Video34';
import {Video33, V33_TOTAL} from './v33/Video33';
import {Video32, V32_TOTAL} from './v32/Video32';
import {Video31, V31_TOTAL} from './v31/Video31';
import {Video30, V30_TOTAL} from './v30/Video30';
import {Short1, Short2, Short4, Short5, Short6, Short8, Short9, Short10, Short11, Short12, Short13, Short14, Short15} from './shorts/configs';
import {DUEL_TOTAL} from './shorts/Duel';
import {SimShort, SIM_TOTAL} from './shorts/Sim';
import {Video14, V14_TOTAL} from './v14/Video14';
import {Video15, V15_TOTAL} from './v15/Video15';
import {Video16, V16_TOTAL} from './v16/Video16';
import {Video17, V17_TOTAL} from './v17/Video17';
import {Video18, V18_TOTAL} from './v18/Video18';
import {Video25, V25_TOTAL} from './v25/Video25';
import {Video24, V24_TOTAL} from './v24/Video24';
import {Video28, V28_TOTAL} from './v28/Video28';
import {Video27, V27_TOTAL} from './v27/Video27';
import {Video26, V26_TOTAL} from './v26/Video26';
import {Video19, V19_TOTAL} from './v19/Video19';
import {Video20, V20_TOTAL} from './v20/Video20';
import {Video21, V21_TOTAL} from './v21/Video21';
import {Video22, V22_TOTAL} from './v22/Video22';
import {Video23, V23_TOTAL} from './v23/Video23';
import {FlagMap} from './v21/FlagMap';
import {T21a, T21b, T21c, T21d, T21e} from './v21/Thumbs21';
import {T21_NEW} from './v21/Thumbs21b';
import {T21_X} from './v21/Thumbs21c';
import {T21_Y} from './v21/Thumbs21c';
import {T22a, T22b, T22c, T22d, T22e} from './v22/Thumbs22';
import {T22_U} from './v22/Thumbs22b';
import {T23a, T23b, T23c, T23d, T23e} from './v23/Thumbs23';
import {T14a, T14b, T14c, T14d, T14e} from './v14/Thumbs14';
import {TS1, TS2, TS3, TS4, TS5, TS6, TS7, TS8, TS9, TS10, TS11, TS12, TS13, TS14, TS15} from './shorts/ThumbsS';
import {FortressShort, FORT_TOTAL} from './shorts/Fortress';
import {VS1, VS1_TOTAL} from './s2/short1';
import {VS1B, VS1B_TOTAL} from './s2/short1b';
import {VS2, VS2_TOTAL} from './s2/short2';
import {VS3, VS3_TOTAL} from './s2/short3';
import {TA1, TA2, TA3, TA4, TA5, TA6, TN1, TN2, TN3, TN4, TN5, TN6, TN7, TF1, TF2, TF3, TF4, TF5} from './v32/ThumbsArg';
import {VS5, VS5_TOTAL} from './s2/short5';
import {VS6, VS6_TOTAL} from './s2/short6';
import {VS7, VS7_TOTAL} from './s2/short7';
import {VS8, VS8_TOTAL} from './s2/short8';
import {VS9, VS9_TOTAL} from './s2/short9';
import {VS10, VS10_TOTAL} from './s2/short10';
import {VS11, VS11_TOTAL} from './s2/short11';
import {TQ} from './s2/thumbsFast';
import {VS4, VS4_TOTAL, TS4I, TS4A, TS4B} from './s2/short4';
import {NEVER_TOTAL} from './shorts/Never';
import {T13a, T13b, T13c, T13d, T13e} from './v13/Thumbs13';
import {T15a, T15b, T15c, T15d, T15e} from './v15/Thumbs15';
import {T16a, T16b, T16c, T16d, T16e} from './v16/Thumbs16';
import {T17a, T17b, T17c, T17d, T17e} from './v17/Thumbs17';
import {T18a, T18b, T18c, T18d, T18e} from './v18/Thumbs18';
import {T25a, T25b, T25c, T25d, T25e, T29f, T29g, T29h, T29i, T29j} from './v24/ThumbsX';
import {T25f, T25g, T25h, T25i, T25j} from './v25/ThumbsCA';
import {T24a, T24b, T24c, T24d, T24e} from './v24/ThumbsX';
import {T28a, T28b, T28c, T28d, T28e} from './v24/ThumbsX';
import {T28f, T28g, T28h, T28i, T28j} from './v28/ThumbsEA';
import {T29a, T29b, T29c, T29d, T29e, T30a, T30b, T30c, T30d, T30e, T31a, T31b, T31c, T31d, T31e, T32a, T32b, T32c, T32d, T32e, T33a, T33b, T33c, T33d, T33e, T34a, T34b, T34c, T34d, T34e, T35a, T35b, T35c, T35d, T35e, T37a, T37b, T37c, T37d, T37e, T38a, T38b, T38c, T38d, T38e} from './vw/ThumbsB';
import {T27a, T27b, T27c, T27d, T27e, T27f, T27g, T27h, T27i, T27j} from './v24/ThumbsX';
import {T24f, T24g, T24h, T24i, T24j, T24k, T24r, T24s} from './v24/ThumbsY';
import {T24l, T24m, T24n, T24o, T24p, T24q} from './v24/ThumbsZ';
import {T26a, T26b, T26c, T26d, T26e, T26f, T26g, T26h, T26i, T26j} from './v24/ThumbsX';
import {T19a, T19b, T19c, T19d, T19e} from './v19/Thumbs19';
import {T20a, T20b, T20c, T20d, T20e} from './v20/Thumbs20';
import {T12a, T12b, T12c, T12d, T12e} from './v12/Thumbs12';
import {T9n1, T9n2, T9n3, T9n4, T9n5} from './v9/Thumbs9b';
import {T10n1, T10n2, T10n3, T10n4, T10n5} from './v10/Thumbs10b';
import {T10q1, T10q2, T10q3, T10q4, T10q5} from './v10/Thumbs10c';
import {T9q1, T9q2, T9q3, T9q4, T9q5} from './v9/Thumbs9c';
import {T10v1, T10v2, T10v3, T10v4, T10v5, T10w1, T10w2, T10w3, T10w4, T10w5} from './v10/Thumbs10v';
import {T6n1, T6n2, T6n3, T6n4, T6n5, T6v1, T6v2, T6v3, T6v4, T6v5, T6f1, T6f2, T6f3, T6f4, T6f5, T6l1, T6l2, T6l3, T6l4, T6l5} from './v6/Thumbs6n';
import {T11a, T11b, T11c, T11d, T11e} from './v11/Thumbs11';

export const Root: React.FC = () => (
	<>
		<Composition id="V7" component={Video7} durationInFrames={V7_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V6" component={Main6} durationInFrames={TOTAL6} fps={60} width={1920} height={1080} />
		<Composition id="V5" component={Video5} durationInFrames={V5_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V8" component={Video8} durationInFrames={V8_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V4" component={Video4} durationInFrames={V4_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V3" component={Main3} durationInFrames={TOTAL3} fps={60} width={1920} height={1080} />
		<Composition id="V2" component={Video2} durationInFrames={V2_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="Main" component={Main} durationInFrames={TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="Hook" component={Hook} durationInFrames={1800} fps={60} width={1920} height={1080} />
		{[Thumb1, Thumb2, Thumb3, Thumb4, Thumb5].map((C, i) => <Still key={i} id={`Thumb${i + 1}`} component={C} width={1280} height={720} />)}
		{[T2a, T2b, T2c, T2d].map((C, i) => <Still key={'t2' + i} id={`T2-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T3a, T3b, T3c, T3d].map((C, i) => <Still key={'t3' + i} id={`T3-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T4a, T4b, T4c, T4d].map((C, i) => <Still key={'t4' + i} id={`T4-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T5a, T5b, T5c, T5d, T5e].map((C, i) => <Still key={'t5' + i} id={`T5-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T8a, T8b, T8c, T8d, T8e].map((C, i) => <Still key={'t8' + i} id={`T8-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T6a, T6b, T6c, T6d, T6e].map((C, i) => <Still key={'t6' + i} id={`T6-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T7a, T7b, T7c, T7d, T7e].map((C, i) => <Still key={'t7' + i} id={`T7-${i + 1}`} component={C} width={1280} height={720} />)}
		<Still id="LogoA" component={LogoA} width={800} height={800} />
		<Still id="BannerB" component={BannerB} width={2560} height={1440} />
			<Composition id="V9" component={Video9} durationInFrames={V9_TOTAL} fps={60} width={1920} height={1080} />
			{[TS1, TS2, TS3, TS4, TS5, TS6, TS7, TS8, TS9, TS10, TS11, TS12, TS13, TS14, TS15].map((C, i) => <Still key={'ts' + i} id={`TS${i + 1}`} component={C} width={1080} height={1920} />)}
			{[T14a, T14b, T14c, T14d, T14e].map((C, i) => <Still key={'t14' + i} id={`T14-${i + 1}`} component={C} width={1920} height={1080} />)}
			<Composition id="V14" component={Video14} durationInFrames={V14_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V15" component={Video15} durationInFrames={V15_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V16" component={Video16} durationInFrames={V16_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V17" component={Video17} durationInFrames={V17_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V18" component={Video18} durationInFrames={V18_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V25" component={Video25} durationInFrames={V25_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V24" component={Video24} durationInFrames={V24_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V28" component={Video28} durationInFrames={V28_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V27" component={Video27} durationInFrames={V27_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V26" component={Video26} durationInFrames={V26_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V19" component={Video19} durationInFrames={V19_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V21" component={Video21} durationInFrames={V21_TOTAL} fps={60} width={1920} height={1080} />
t	<Composition id="V22" component={Video22} durationInFrames={V22_TOTAL} fps={60} width={1920} height={1080} />
t	<Composition id="V23" component={Video23} durationInFrames={V23_TOTAL} fps={60} width={1920} height={1080} />
		<Composition id="V20" component={Video20} durationInFrames={V20_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="VS3" component={VS3} durationInFrames={VS3_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS4" component={VS4} durationInFrames={VS4_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS5" component={VS5} durationInFrames={VS5_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS6" component={VS6} durationInFrames={VS6_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS7" component={VS7} durationInFrames={VS7_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS8" component={VS8} durationInFrames={VS8_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS9" component={VS9} durationInFrames={VS9_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS10" component={VS10} durationInFrames={VS10_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS11" component={VS11} durationInFrames={VS11_TOTAL} fps={60} width={1080} height={1920} />
			{Object.entries(TQ).map(([id, C]) => <Still key={id} id={id} component={C} width={1080} height={1920} />)}
			<Still id="TS4I" component={TS4I} width={1080} height={1920} />
			<Still id="TS4A" component={TS4A} width={1080} height={1920} />
			<Still id="TS4B" component={TS4B} width={1080} height={1920} />
			<Composition id="VS2" component={VS2} durationInFrames={VS2_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS1B" component={VS1B} durationInFrames={VS1B_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="VS1" component={VS1} durationInFrames={VS1_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S1" component={Short1} durationInFrames={NEVER_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S2" component={Short2} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S5" component={Short5} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S3" component={SimShort} durationInFrames={SIM_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S7" component={FortressShort} durationInFrames={FORT_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S4" component={Short4} durationInFrames={NEVER_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S6" component={Short6} durationInFrames={NEVER_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S8" component={Short8} durationInFrames={NEVER_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S9" component={Short9} durationInFrames={NEVER_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S10" component={Short10} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S11" component={Short11} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S12" component={Short12} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S13" component={Short13} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S14" component={Short14} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="S15" component={Short15} durationInFrames={DUEL_TOTAL} fps={60} width={1080} height={1920} />
			<Composition id="V13" component={Video13} durationInFrames={V13_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V29" component={Video29} durationInFrames={V29_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V30" component={Video30} durationInFrames={V30_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V31" component={Video31} durationInFrames={V31_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V32" component={Video32} durationInFrames={V32_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V33" component={Video33} durationInFrames={V33_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V34" component={Video34} durationInFrames={V34_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V35" component={Video35} durationInFrames={V35_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V36" component={Video36} durationInFrames={V36_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V37" component={Video37} durationInFrames={V37_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V38" component={Video38} durationInFrames={V38_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V39" component={Video39} durationInFrames={V39_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V40" component={Video40} durationInFrames={V40_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V41" component={Video41} durationInFrames={V41_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V42" component={Video42} durationInFrames={V42_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V12" component={Video12} durationInFrames={V12_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V11" component={Video11} durationInFrames={V11_TOTAL} fps={60} width={1920} height={1080} />
			<Composition id="V10" component={Video10} durationInFrames={V10_TOTAL} fps={60} width={1920} height={1080} />
		{[T13a, T13b, T13c, T13d, T13e].map((C, i) => <Still key={'t13' + i} id={`T13-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T15a, T15b, T15c, T15d, T15e].map((C, i) => <Still key={'t15' + i} id={`T15-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T16a, T16b, T16c, T16d, T16e].map((C, i) => <Still key={'t16' + i} id={`T16-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T17a, T17b, T17c, T17d, T17e].map((C, i) => <Still key={'t17' + i} id={`T17-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T18a, T18b, T18c, T18d, T18e].map((C, i) => <Still key={'t18' + i} id={`T18-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T25a, T25b, T25c, T25d, T25e, T25f, T25g, T25h, T25i, T25j].map((C, i) => <Still key={'t25' + i} id={`T25-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T24a, T24b, T24c, T24d, T24e, T24f, T24g, T24h, T24i, T24j, T24k, T24l, T24m, T24n, T24o, T24p, T24q, T24r, T24s].map((C, i) => <Still key={'t24' + i} id={`T24-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T28a, T28b, T28c, T28d, T28e, T28f, T28g, T28h, T28i, T28j].map((C, i) => <Still key={'t28' + i} id={`T28-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[TN1, TN2, TN3, TN4, TN5, TN6, TN7].map((C, i) => <Still key={'tn' + i} id={`TN-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[TF1, TF2, TF3, TF4, TF5].map((C, i) => <Still key={'tf' + i} id={`TF-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[TA1, TA2, TA3, TA4, TA5, TA6].map((C, i) => <Still key={'ta' + i} id={`TA-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T29f, T29g, T29h, T29i, T29j].map((C, i) => <Still key={'t29n' + i} id={`T29N-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T29a, T29b, T29c, T29d, T29e].map((C, i) => <Still key={'tb29' + i} id={`TB29-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T30a, T30b, T30c, T30d, T30e].map((C, i) => <Still key={'tb30' + i} id={`TB30-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T42a, T42b, T42c, T42d, T42e].map((C, i) => <Still key={'tb42' + i} id={`TB42-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T41a, T41b, T41c, T41d, T41e].map((C, i) => <Still key={'tb41' + i} id={`TB41-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T40a, T40b, T40c, T40d, T40e].map((C, i) => <Still key={'tb40' + i} id={`TB40-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T39a, T39b, T39c, T39d, T39e].map((C, i) => <Still key={'tb39' + i} id={`TB39-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T38a, T38b, T38c, T38d, T38e].map((C, i) => <Still key={'tb38' + i} id={`TB38-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T37a, T37b, T37c, T37d, T37e].map((C, i) => <Still key={'tb37' + i} id={`TB37-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T31a, T31b, T31c, T31d, T31e].map((C, i) => <Still key={'tb31' + i} id={`TB31-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T32a, T32b, T32c, T32d, T32e].map((C, i) => <Still key={'tb32' + i} id={`TB32-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T33a, T33b, T33c, T33d, T33e].map((C, i) => <Still key={'tb33' + i} id={`TB33-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T34a, T34b, T34c, T34d, T34e].map((C, i) => <Still key={'tb34' + i} id={`TB34-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T35a, T35b, T35c, T35d, T35e].map((C, i) => <Still key={'tb35' + i} id={`TB35-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T27a, T27b, T27c, T27d, T27e, T27f, T27g, T27h, T27i, T27j].map((C, i) => <Still key={'t27' + i} id={`T27-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T26a, T26b, T26c, T26d, T26e, T26f, T26g, T26h, T26i, T26j].map((C, i) => <Still key={'t26' + i} id={`T26-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T19a, T19b, T19c, T19d, T19e].map((C, i) => <Still key={'t19' + i} id={`T19-${i + 1}`} component={C} width={1920} height={1080} />)}
		<Still id="FLAGMAP21" component={FlagMap} width={7660} height={3440} />
		{[T21a, T21b, T21c, T21d, T21e].map((C, i) => <Still key={'t21' + i} id={`T21-${i + 1}`} component={C} width={1920} height={1080} />)}
		{T21_NEW.map((C, i) => <Still key={'t21n' + i} id={`T21-${i + 6}`} component={C} width={1920} height={1080} />)}
		{T21_X.map((C, i) => <Still key={'t21x' + i} id={`T21-${i + 16}`} component={C} width={1920} height={1080} />)}
		{T21_Y.map((C, i) => <Still key={'t21y' + i} id={`T21-${i + 34}`} component={C} width={1920} height={1080} />)}
		{[T22a, T22b, T22c, T22d, T22e].map((C, i) => <Still key={'t22' + i} id={`T22-${i + 1}`} component={C} width={1920} height={1080} />)}
		{T22_U.map((C, i) => <Still key={'t22u' + i} id={`T22-${i + 6}`} component={C} width={1920} height={1080} />)}
		{[T23a, T23b, T23c, T23d, T23e].map((C, i) => <Still key={'t23' + i} id={`T23-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T20a, T20b, T20c, T20d, T20e].map((C, i) => <Still key={'t20' + i} id={`T20-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T6l1, T6l2, T6l3, T6l4, T6l5].map((C, i) => <Still key={'t6l' + i} id={`T6L-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T6f1, T6f2, T6f3, T6f4, T6f5].map((C, i) => <Still key={'t6f' + i} id={`T6F-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T6v1, T6v2, T6v3, T6v4, T6v5].map((C, i) => <Still key={'t6v' + i} id={`T6V-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T6n1, T6n2, T6n3, T6n4, T6n5].map((C, i) => <Still key={'t6n' + i} id={`T6N-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T10w1, T10w2, T10w3, T10w4, T10w5].map((C, i) => <Still key={'t10w' + i} id={`T10W-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T10v1, T10v2, T10v3, T10v4, T10v5].map((C, i) => <Still key={'t10v' + i} id={`T10V-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T9q1, T9q2, T9q3, T9q4, T9q5].map((C, i) => <Still key={'t9q' + i} id={`T9Q-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T10q1, T10q2, T10q3, T10q4, T10q5].map((C, i) => <Still key={'t10q' + i} id={`T10Q-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T10n1, T10n2, T10n3, T10n4, T10n5].map((C, i) => <Still key={'t10n' + i} id={`T10N-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T9n1, T9n2, T9n3, T9n4, T9n5].map((C, i) => <Still key={'t9n' + i} id={`T9N-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T12a, T12b, T12c, T12d, T12e].map((C, i) => <Still key={'t12' + i} id={`T12-${i + 1}`} component={C} width={1920} height={1080} />)}
		{[T11a, T11b, T11c, T11d, T11e].map((C, i) => <Still key={'t11' + i} id={`T11-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T10a, T10b, T10c, T10d, T10e].map((C, i) => <Still key={'t10' + i} id={`T10-${i + 1}`} component={C} width={1280} height={720} />)}
		{[T9a, T9b, T9c, T9d, T9e].map((C, i) => <Still key={'t9' + i} id={`T9-${i + 1}`} component={C} width={1280} height={720} />)}
		<Still id="ArtTest" component={ArtTest} width={1920} height={1080} />
	</>
);
