# body of v3: Jordi's Cartesia voice, word-synced cuts/texts, cinematic hook, map scenes

PART_GAP = 1.3   # extra breath between topics

def hook_npc(src, a, b, es, en, who, ring, lead=0.0):
    """NPC line inside the hook: clip with its own audio, pink ring on the speaker, subtitle."""
    t0 = T[0]; d = b - a + lead
    v = shot(src, a - lead, audio=1.0, zoom=[1.0, 1.12], origin=f"{ring[0]/19.2:.1f}% {ring[1]/10.8:.1f}%", hard=True); v['t0'] = round(t0, 3); v['t1'] = round(t0 + d, 3); v['credit'] = cred(src)
    video.append(v)
    add_ov(dict(type='ring', x=ring[0], y=ring[1], r=ring[2], label=who), t0 + lead + 0.05, t0 + d - 0.05)
    add_ov(dict(type='npcsub', es=es, en=en, who=who, mute=True), t0 + lead + 0.1, t0 + d - 0.05)
    music_duck.append([round(t0 + lead, 3), round(t0 + d, 3)])
    T[0] = t0 + d

# ================= HOOK: beautiful slow-motion Leonida + NPCs turning on you + title =================
OPEN = 3.6
video.append(dict(MAP(cam=[[0, 0.55, 0.55, 1.7], [2.6, 0.79, 0.505, 0.34], [OPEN, 0.80, 0.50, 0.27]], pins=[dict(t=1.7, x=0.826, y=0.50, label='VICE BEACH', sub='LEONIDA · AQUÍ EMPIEZA TODO', big=True)], kind='oficial'), t0=0.0, t1=OPEN, hard=True, credit=YAN['source']))
sfx.append({'t': 1.6, 'src': 's_pop', 'vol': .35})
video.append(dict(shot('T01', 484.05, rate=0.6, zoom=[1.0, 1.08], flash=True), t0=OPEN, t1=OPEN + 3.0, credit=cred('T01')))
add_ov(dict(type='label', text='LEONIDA', sub='19 DE NOVIEMBRE · YA SE PUEDE JUGAR', mute=True), OPEN + 0.5, OPEN + 2.9)
video.append(dict(shot('T01', 486.1, rate=0.72, zoom=[1.02, 1.1]), t0=OPEN + 3.0, t1=OPEN + 5.4, credit=cred('T01')))
T[0] = OPEN + 5.4
hook_npc('v4_00', 8.3, 12.8, 'Yo era igualito a ti, ¿sabes? Hace 50 años.', 'I used to look just like you, you know? 50 years ago.', 'NPC · CHIRINGUITO', (1120, 600, 210), lead=1.2)
hook_npc('v2_01', 421.8, 424.3, 'Eh… ¿te conozco?', 'Do I know you?', 'NPC · HAMBURGUESERÍA', (990, 430, 230), lead=0.3)
tt = T[0]
video.append(dict(shot('v2_02', 148.5, rate=0.7, zoom=[1.0, 1.08], flash=True), t0=round(tt, 3), t1=round(tt + 3.6, 3), credit=cred('v2_02')))
add_ov(KW([['LOS', 0.0], ['NPC', 0.12], ['TE', 0.3], ['JUZGAN', 0.42]], size=138, top=300, dim=1, mute=True), tt + 0.15, tt + 3.5)
add_ov(KW([['POR', 0.0, True], ['TU', 0.12, True], ['ROPA', 0.24, True]], size=150, top=470, mute=True), tt + 0.75, tt + 3.5)
sfx.append({'t': tt - 0.05, 'src': 's_section', 'vol': .5})
COLD_END = tt + 3.6
T[0] = COLD_END + 0.1
SW1 = [COLD_END - 0.1, COLD_END]

# ================= P1 =================
P = 'p1'
say(P, 0, [shot('v4_00', 300.0, zoom=[1.03, 1.09])], [ST('YA HA SALIDO', x=1420, y=300, size=96, at='horas')])
say(P, 1, [shot('v2_00', 230.0, **BL), shot('v4_00', 352.0, zoom=[1.04, 1.1], flash=True)], [KW([['NO', 0.0], ['COCHES', 0.15]], size=150, at='coches', until='mapa'), KW([['NO', 0.0], ['MAPA', 0.15]], size=150, at='mapa', until=('son', 1)), KW([['SON', 0.0], ['LOS', 0.12], ['NPC', 0.25, True]], size=190, at=('son', 1))], cuts=[('son', 1)])
say(P, 2, [shot('v4_00', 9.5, zoom=[1.04, 1.1])], [KW([['TE', 0.0], ['MIRA', 0.1]], size=140, top=110, at='mira', until='habla'), KW([['TE', 0.0], ['HABLA', 0.1]], size=140, top=110, at='habla', until='juzga'), KW([['TE', 0.0], ['JUZGA', 0.1, True]], size=170, top=110, at='juzga')])
say(P, 3, [shot('v2_02', 50.0), shot('v2_02', 58.0, zoom=[1.04, 1.1])], [ST('TIRANTES', sub='TE LO ECHAN EN CARA', x=1440, y=330, size=96, at='tirantes')], cuts=['alguien'])
say(P, 4, [shot('v4_01', 62.0, zoom=[1.02, 1.08])], [ST('3 DÍAS SIN DUCHA', x=1280, y=300, size=90, rot=-6, at='tres')])
say(P, 5, [shot('v2_00', 128.0), shot('v2_00', 168.0, zoom=[1.04, 1.1])], [KW([['ESA', 0.0], ['CHAQUETA', 0.25, True]], size=160, at='esa')], cuts=['policía'])
say(P, 6, [shot('v4_00', 304.0, **BL), shot('v4_00', 346.0, zoom=[1.03, 1.1])], [KW([['13', 0.0, True], ['AÑOS', 0.15], ['DE', 0.5], ['PURO', 0.65], ['DECORADO', 0.85]], size=150, at='trece', until=('en', 1)), KW([['ES', 0.0], ['INFORMACIÓN', 0.2, True]], size=150, at='información', top=120)], cuts=[('en', 1)])
say(P, 7, [shot('v2_02', 150.0), shot('v4_01', 140.0, flash=True), shot('v2_00', 140.0, flash=True), shot('v4_00', 430.0, flash=True)], [
    dict(type='chapter', n='01', text='LO QUE TE DICEN', at='dicen', until='hablan'), dict(type='chapter', n='02', text='LO QUE HABLAN ENTRE ELLOS', at='hablan', until='chiva'),
    dict(type='chapter', n='03', text='TU ROPA Y LA POLICÍA', at='chiva', until='misterio'), dict(type='chapter', n='04', text='EL MISTERIO', at='misterio')], cuts=['dicen', 'hablan', 'chiva'], extra=PART_GAP)

# ================= P2 =================
P = 'p2'
say(P, 0, [shot('v4_00', 412.0, **BL)], [SEC('ANTES', 'GTA V · 2013')])
say(P, 1, [shot('v2_03', 42.0, zoom=[1.03, 1.09])], [KW([['EN', 0.0], ['CALZONCILLOS', 0.15]], size=120, top=90, at='calzoncillos', until='nadie'), ST('NADIE TE MIRABA', x=1300, y=780, size=80, at='nadie')])
say(P, 2, [shot('v4_00', 470.0, **BL)], [dict(type='versus', at='peatones')])
say(P, 3, [shot('v3', 60.0, zoom=[1.04, 1.1])], [ST('CAMBIA', x=960, y=540, size=170, rot=-6, at='cambia')])
say(P, 4, [MAP(cam=[[0, 0.5, 0.52, 1.6], [3.5, 0.62, 0.55, 0.75], [9, 0.66, 0.52, 0.5]], pins=[dict(t=0.4, x=0.68, y=0.515, label='LEONIDA', sub='TODO EL ESTADO REACCIONA A TI', big=True)], kind='oficial'), shot('v2_02', 236.0, zoom=[1.03, 1.08])],
    [Q(['REACCIONAN A TU ROPA,', 'A TU COCHE Y A', 'LO QUE LLEVAS ENCIMA'], 'LO QUE DICEN LOS ANÁLISIS', x=110, y=300, highlight=True, at='reacciona')], cuts=['reacciona'])
say(P, 5, [shot('v2_00', 60.0, **BL)], [ST('OJO: BULO', x=960, y=520, size=150, color='#ffd166', at='bulo')])
say(P, 6, [shot('v2_03', 104.5, zoom=[1.02, 1.07]), shot('v2_03', 108.0, zoom=[1.04, 1.1])], [ST('NO ES CHATGPT', x=1300, y=330, size=90, at='chat', until='rockstar'), ST('SIN IA GENERATIVA', sub='LO HAN DICHO ROCKSTAR Y TAKE-TWO', x=1240, y=330, size=84, at='generativa')], cuts=['rockstar'])
say(P, 7, [shot('v4_00', 172.0), shot('v4_00', 236.0, zoom=[1.03, 1.08])], [KW([['MILES', 0.0], ['DE', 0.15], ['FRASES', 0.3, True]], size=130, at='miles', until='sistema', top=110), KW([['QUIÉN', 0.0], ['ERES', 0.12]], size=110, at='quién', until='llevas', top=700), KW([['QUÉ', 0.0], ['LLEVAS', 0.12, True]], size=110, at='llevas', until='dónde', top=700), KW([['DÓNDE', 0.0], ['ESTÁS', 0.12]], size=110, at='dónde', until='hora', top=700), KW([['A', 0.0], ['QUÉ', 0.1], ['HORA', 0.2, True]], size=110, at='hora', top=700)], cuts=['sistema'])
say(P, 8, [shot('v3', 18.0, zoom=[1.03, 1.1])], [], extra=PART_GAP)

# ================= P3 COMENTARIOS =================
P = 'p3'
say(P, 0, [shot('v3', 24.0)], [SEC('LOS COMENTARIOS', 'LO QUE DICEN DE TI POR LA CALLE', at='comentarios')])
say(P, 1, [shot('v2_02', 505.0, zoom=[1.02, 1.07])], [ST('GAMEPLAY REAL', sub='EL JUEGO LLEVA HORAS FUERA', x=1360, y=320, size=96, at='gameplays')])
say(P, 2, [shot('v4_00', 4.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='01', text='EL SEÑOR DEL CHIRINGUITO', at='señor')])
npc('v4_00', 8.3, 12.8, 'Yo era igualito a ti, ¿sabes? Hace 50 años.', 'I used to look just like you, you know? 50 years ago.', 'NPC · CHIRINGUITO DE LA PLAYA')
say(P, 3, [shot('v2_00', 20.0)], [dict(type='chapter', n='02', text='EL DEL BAR', at='bar')])
npc('v2_00', 26.35, 32.3, 'Tío, si los aliens te ordeñaran, sacarían unos híbridos guapísimos.', "Damn dude, if the aliens milked you, they'd get some damn good-looking hybrids.", 'NPC · BAR')
say(P, 6, [shot('v4_00', 318.0), shot('v2_02', 40.0, zoom=[1.03, 1.08])], [KW([['Y', 0.0], ['NO', 0.12], ['SIEMPRE', 0.3], ['ES', 0.55], ['PARA', 0.7], ['BIEN', 0.9, True]], size=140, at='siempre', top=110)], cuts=['siempre'])
npc('v2_02', 64.0, 71.0, 'Si vas a ser un borde, al menos sé divertido.', "If you're gonna be a b*tch, at least be fun about it.", 'NPC · PLAYA')
say(P, 7, [shot('v2_02', 200.0, **BL)], [Q(['«¿SIN MANGAS?', 'UN POCO AGRESIVO»'], 'UN NPC A JASON, SEGÚN UN ANÁLISIS', x=520, y=330, highlight=True, at='mangas')])
say(P, 8, [shot('v4_01', 120.0, zoom=[1.02, 1.08]), shot('v4_01', 112.0, zoom=[1.04, 1.1])], [ST('HUELES', sub='TE LO DIRÁN SI NO TE DUCHAS', x=1380, y=320, size=110, at='cuenta')], cuts=['gente'], extra=PART_GAP)

# ================= P4 CONTEXTO =================
P = 'p4'
say(P, 0, [shot('v4_00', 330.0)], [SEC('EL CONTEXTO', 'CADA ZONA TIENE SU CÓDIGO', at='contexto')])
z0 = wt(P, 1, 'playa'); z1 = wt(P, 1, 'centro'); z2 = wt(P, 1, 'keys')
say(P, 1, [MAP(cam=[[0, 0.72, 0.52, 0.42], [z0, 0.78, 0.505, 0.3], [z1, 0.70, 0.515, 0.3], [z2 + 0.2, 0.52, 0.8, 0.75], [z2 + 3, 0.49, 0.84, 0.6]],
              pins=[dict(t=z0, x=0.826, y=0.50, label='LA PLAYA', sub='ROPA DE GIMNASIO'), dict(t=z1, x=0.675, y=0.518, label='EL CENTRO', sub='TRAJE'), dict(t=z2, x=0.47, y=0.865, label='LOS KEYS', sub='CHANCLAS', big=True)], kind='fans')], [])
npc('v2_03', 271.3, 276.3, 'A diferencia de estos, yo entreno para la vida real. No lo entenderías.', "Unlike these other guys, I'm training for some real life sh*t. You wouldn't get it.", 'NPC · GIMNASIO')
say(P, 2, [shot('v2_02', 486.0, zoom=[1.02, 1.07]), shot('v2_03', 2.0, zoom=[1.03, 1.08])], [ST('BARRIO PIJO', x=1400, y=320, size=100, at='pijo')], cuts=['uno'])
npc('v2_02', 500.2, 505.8, 'En diez años, en ese barrio solo vas a oír acento de niña rica.', "Ten years' time, walk through that neighborhood, all you're gonna hear is a rich girl accent.", 'NPC · BARRIO RICO')
say(P, 3, [shot('v2_02', 296.0), shot('v2_02', 340.0, zoom=[1.04, 1.1], flash=True)], [Q(['UNA VECINA LE PREGUNTÓ', 'QUÉ HACÍA MIRANDO SU CASA…'], 'SEGÚN UN ANÁLISIS', x=110, y=290, highlight=True, at='vecina', until='acabó'), ST('A PUÑETAZOS', x=1300, y=360, size=110, at='puñetazos')], cuts=['acabó'])
say(P, 4, [shot('v4_00', 356.0, zoom=[1.04, 1.1])], [KW([['NO', 0.0], ['ERES', 0.15], ['INVISIBLE', 0.35, True]], size=160, top=110, at='invisible')], extra=PART_GAP)

# ================= P5 CUANDO TE PASAS =================
P = 'p5'
say(P, 0, [shot('v2_02', 330.0)], [SEC('CUANDO TE PASAS', 'LAS REACCIONES', at='haces')])
say(P, 1, [shot('v4_00', 350.0, zoom=[1.04, 1.1])], [KW([['LEONIDA', 0.0, True], ['NO', 0.3], ['SE', 0.42], ['CALLA', 0.55]], size=150, at='leónida')])
say(P, 2, [shot('v4_01', 326.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='01', text='EL SOCORRISTA', at='socorrista')])
npc('v4_01', 339.1, 342.0, '¡Eh, tío, espera! ¡Ya me voy, venga!', "Hey man, wait! I'll leave, come on!", 'NPC · SOCORRISTA')
say(P, 3, [shot('v4_00', 276.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='02', text='LA NOVIA PROTECTORA', at='pareja')])
npc('v4_00', 283.8, 286.9, '¡Quita esas manos! ¡No te metas con mi chico!', "Get those hands off, b*tch! Don't f*ck with my fella!", 'NPC · OCEAN DRIVE')
say(P, 4, [shot('v3', 296.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='03', text='EL SALUDO', at='ambulancia')])
npc('v3', 306.4, 308.7, '¿Qué pasa, capullo?', 'Sup, a**hole.', 'NPC · PLAYA')
say(P, 5, [shot('v2_02', 300.0), shot('v2_00', 150.0, flash=True)], [KW([['HUYEN', 0.0]], size=130, at='huyen', until='encaran', top=700), KW([['SE', 0.0], ['ENCARAN', 0.1]], size=130, at='encaran', until='quitarte', top=700), KW([['TE', 0.0], ['DESARMAN', 0.1, True]], size=130, at='quitarte', top=700)], cuts=['encaran'], extra=PART_GAP)

# ================= P6 ENTRE ELLOS =================
P = 'p6'
say(P, 0, [shot('v4_01', 160.0), MAP(cam=[[0, 0.55, 0.55, 1.4], [6, 0.62, 0.55, 0.9]], pins=[dict(t=0.3, x=0.68, y=0.515, label='LEONIDA', sub='RETRATADA POR SU GENTE', big=True)], kind='oficial')], [SEC('HABLAN ENTRE ELLOS', 'LA SÁTIRA ESTÁ EN LA CALLE', at='hablan', until='retrata')], cuts=['retrata'])
say(P, 1, [shot('v4_01', 144.0, zoom=[1.02, 1.07])], [KW([['ALIENS', 0.0, True]], size=150, at='aliens', top=110)])
npc('v4_01', 151.5, 158.6, '…Si me eligieran a mí, yo me dejaba. Podrían haber elegido a cualquiera.', "If they pick me out, I'd make love to them. They could have had anyone alive.", 'NPC · CHARLA EN EL GIMNASIO')
say(P, 2, [shot('v4_00', 228.0, zoom=[1.02, 1.07])], [KW([['7', 0.0, True], ['CIFRAS', 0.15]], size=150, at='siete', top=110)])
npc('v4_00', 235.0, 240.3, '¿Así que ganas siete cifras? Otro día en el paraíso, ¿eh?', 'So you make like seven figures. Another day in paradise, right?', 'NPC · TERRAZA DE OCEAN DRIVE')
say(P, 3, [shot('v2_02', 476.0, zoom=[1.02, 1.07])], [])
npc('v2_02', 479.7, 482.4, 'Con cinco millones y medio, la tiro abajo y construyo otra.', 'You gave me five and a half mil, I could do a tear down.', 'NPC · BARRIO RICO')
say(P, 4, [shot('v2_02', 494.0, zoom=[1.02, 1.07])], [])
npc('v2_02', 507.3, 513.0, 'La gente de aquí, de Leonida, tiene su reputación.', 'People down here in Leonida have a reputation.', 'NPC · BARRIO RICO')
say(P, 5, [shot('v2_00', 236.0), shot('v2_00', 300.0, zoom=[1.03, 1.08])], [KW([['EN', 0.0], ['LA', 0.12], ['CALLE', 0.25, True]], size=140, at='calle', until='radio'), KW([['NO', 0.0], ['EN', 0.12], ['LA', 0.24], ['RADIO', 0.36]], size=140, at='radio')], cuts=['pero'], extra=PART_GAP)

# ================= P7 LOS QUE TRABAJAN =================
P = 'p7'
say(P, 0, [shot('v2_00', 40.0)], [SEC('LOS QUE TE ATIENDEN', 'DEPENDIENTES · RECEPCIONISTAS · CAMAREROS', at='trabajan')])
say(P, 1, [shot('v2_00', 44.0, zoom=[1.02, 1.07])], [])
npc('v2_00', 52.0, 53.9, 'Gracias por su visita.', 'We appreciate your patronage.', 'NPC · CAMARERO')
say(P, 2, [shot('v2_03', 100.0), shot('v2_03', 222.0, zoom=[1.03, 1.08])], [ST('CIUDAD REAL', x=1350, y=320, size=100, at='ciudad', until='hotel')], cuts=['gimnasio'])
npc('v2_03', 108.0, 111.6, '¿Le puedo recomendar algún producto en concreto?', 'Can I direct you to any product in particular?', 'NPC · RECEPCIÓN DEL HOTEL')
T[0] += PART_GAP

# ================= P8 POLICÍA + TRUCOS =================
P = 'p8'
say(P, 0, [shot('v2_00', 160.0, zoom=[1.03, 1.1])], [SEC('TU ROPA ES UNA PISTA', 'POLICÍA · TESTIGOS · CÁMARAS', at='pista')])
say(P, 1, [shot('v2_00', 138.0)], [ST('SIN TESTIGOS, NO HAY POLICÍA', x=960, y=830, size=72, rot=-4, at='crimen')])
npc('v2_00', 155.15, 159.3, '¡Idiota! ¡Quedas detenido, hijo de…!', "You f*cking idiot, you're under arrest, you son of a…", 'POLICÍA DE LEONIDA')
say(P, 2, [shot('v2_00', 171.0, **BL)], [HUD(['face', 'clothes', 'car', 'pair'], at='cara')])
say(P, 3, [shot('v2_00', 172.5, **BL)], [HUD(['face', 'clothes'], focus=True, at='iconos')])
say(P, 4, [shot('v2_03', 300.0, **BL)], [HUD(['face', 'clothes'], clear=['face'], clear_at=wt(P, 4, 'borran') - wt(P, 4, 'gorra'), at='gorra')])
say(P, 5, [shot('v2_00', 320.0), shot('v2_00', 380.0, zoom=[1.03, 1.08])], [ST('PUEDE SALVARTE', x=1400, y=330, size=100, at='salve')], cuts=['puede'])
say(P, 6, [shot('v4_01', 336.0, zoom=[1.02, 1.07])], [KW([['APÚNTATE', 0.0], ['ESTO', 0.3, True]], size=170, at='apúntate')])
say(P, 7, [shot('v2_01', 476.0), shot('v2_01', 492.0, zoom=[1.03, 1.08])], [TIP('1', 'OUTFIT DE REPUESTO', 'EN EL MALETERO', at='uno')], cuts=['atracas'])
say(P, 8, [shot('v2_00', 400.0)], [TIP('2', 'MÁSCARA Y GORRO', 'SIRVEN PARA LA CARA, NO PARA LA ROPA', at='dos')])
say(P, 9, [shot('v2_03', 112.0, zoom=[1.02, 1.08])], [TIP('3', 'OJO CON LAS CÁMARAS', 'GRABAN AUNQUE NADIE MIRE', at='tres')])
say(P, 10, [shot('v2_02', 300.0), shot('v2_02', 344.0, zoom=[1.03, 1.08])], [TIP('4', 'ROBA SU SOMBRERO', 'Y DISFRÁZATE CON ÉL', at='cuatro')], cuts=['literalmente'], extra=PART_GAP)

# ================= P9 MISTERIO =================
P = 'p9'
say(P, 0, [shot('v3', 250.0, **BL)], [ST('SIN CONFIRMAR', x=960, y=540, size=140, color='#ffd166', at='aire')])
say(P, 1, [shot('v4_00', 440.0), shot('v4_00', 446.0, zoom=[1.03, 1.09])], [KW([['¿TIENEN', 0.0], ['MEMORIA?', 0.3, True]], size=150, at='memoria', top=110)], cuts=['reconocerá'])
say(P, 2, [shot('v2_03', 60.0)], [Q(['PATENTES DE ROCKSTAR:', 'NPC QUE RECUERDAN', 'LO QUE HICISTE'], 'RUMOR · SIN CONFIRMAR', kind='teoria', x=110, y=300, at='patentes')])
say(P, 3, [shot('v2_01', 406.0), shot('v2_01', 413.0, zoom=[1.03, 1.08])], [], cuts=['cajera'])
npc('v2_01', 419.9, 424.4, 'Eh… ¿te conozco?', 'Um, do I know you?', 'NPC · HAMBURGUESERÍA')
say(P, 4, [shot('v2_01', 425.5, **BL)], [KW([['¿CASUALIDAD…', 0.0]], size=150, at='casualidad', until='memoria'), KW([['¿O', 0.0], ['MEMORIA?', 0.15, True]], size=150, at='memoria')])
say(P, 5, [{'split': [dict(src='T01', s=236.2, name='JASON', role='¿LE TRATAN IGUAL?', at=0.0, origin='38% 40%', scale=1.15, shift=-120), dict(src='T01', s=480.3, name='LUCÍA', role='¿O DISTINTO?', at=0.3, origin='50% 40%', scale=1.12, shift=60)], 'mid': dict(text='VS', at=0.8, y=150), 'src': 'T01', 's': 236.2},
           MAP(cam=[[0, 0.68, 0.515, 0.32], [5, 0.66, 0.52, 0.42]], pins=[dict(t=0.2, x=0.68, y=0.515, label='CADA BARRIO', sub='¿TE MIRAN DISTINTO?', big=True, q=True)], kind='teoria')], [], cuts=['perfil'])
say(P, 6, [shot('v4_00', 200.0), shot('v3', 120.0, flash=True)], [KW([['10', 0.0, True], ['OUTFITS', 0.15]], size=120, at='diez', until='mismos', top=700), KW([['MISMOS', 0.0], ['SITIOS', 0.15]], size=120, at='mismos', until='jason', top=700), KW([['JASON', 0.0], ['Y', 0.15], ['LUCÍA', 0.25, True]], size=120, at='jason', top=700)], cuts=['vemos'], extra=PART_GAP)

# ================= P10 CIERRE =================
P = 'p10'
say(P, 0, [shot('v3', 100.0), shot('v2_02', 180.0, flash=True), shot('v4_00', 350.0, flash=True)], [KW([['EL', 0.0], ['MUNDO', 0.12], ['SE', 0.3], ['ENTERA', 0.42, True]], size=150, at='mundo', top=110), ST('Y TE JUZGA', x=960, y=760, size=110, at='juzga')], cuts=['sigue', 'pero'])
say(P, 1, [shot('v4_00', 60.0, **BL)], [KW([['¿QUÉ', 0.0], ['OUTFIT', 0.15, True], ['PROBAMOS?', 0.35]], size=160, at='outfit'), ST('COMENTA', x=1500, y=830, size=80, at='votado')])
s0 = T[0]
say(P, 2, [shot('v4_00', 70.0, **BL)], [])
add_ov(dict(type='subscribe'), s0 + wt(P, 2, 'suscríbete'), T[0] + 0.3)
END_AT = T[0] + 0.3
add_ov(dict(type='endcard'), END_AT, END_AT + 3.0)
END = END_AT + 3.0
SW2 = [END_AT - 0.3, END]
