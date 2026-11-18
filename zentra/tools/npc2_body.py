# body of the 8+ min version (exec'd by npc2_builder.py)

def hook_snip(src, a, b, text, n):
    t0 = T[0]; d = b - a
    v = shot(src, a, audio=1.0, zoom=[1.12, 1.0], flash=True, hard=True); v['t0'] = round(t0, 3); v['t1'] = round(t0 + d, 3); v['credit'] = cred(src)
    video.append(v)
    sfx.append({'t': t0 - 0.12, 'src': 's_cut', 'vol': .4})
    add_ov(dict(type='hooksub', text=text, n=n, mute=True), t0 + 0.08, t0 + d - 0.02)
    music_duck.append([round(t0, 3), round(t0 + d, 3)])
    T[0] = t0 + d

# ================= HOOK (designed cold open, ~17 s) =================
add_ov(dict(type='typeon', text='ASÍ TE VE UN NPC…', mute=True), 0.0, 1.7)
sfx.append({'t': 0.1, 'src': 's_tick', 'vol': .35})
video.append(dict(shot('v4_00', 1.0, zoom=[1.02, 1.12], hard=True), t0=1.7, t1=6.4, credit=cred('v4_00')))
add_ov(dict(type='vision', box=[[0, 690, 640], [1.5, 700, 650], [3.0, 660, 660], [4.7, 720, 650]], w=560, h=860,
            tags=[['OUTFIT: CAMISA CAQUI', 0, 0.5], ['GORRA: SOSPECHOSA', 0, 1.2], ['OLOR: DUDOSO', 0, 1.9], ['¿ES UN LADRÓN?', 87, 2.6]], mute=True), 1.7, 6.4)
for t in (2.2, 2.9, 3.6, 4.3): sfx.append({'t': t, 'src': 's_tick', 'vol': .3})
T[0] = 6.4
hook_snip('v4_01', 36.0, 39.0, '«¡MÍRAME CUANDO TE HABLO!»', 1)
hook_snip('v2_01', 421.8, 424.2, '«¿TE CONOZCO?»', 2)
hook_snip('v2_02', 525.1, 527.3, '«¿BUSCAS MÁS GENTE A LA QUE ROBAR?»', 3)
hook_snip('v3', 306.4, 308.7, '«¿QUÉ PASA, CAPULLO?»', 4)
vt = T[0]
video.append(dict(shot('v3', 308.6, blur=8, dim=0.3, rate=0.05, hard=True), t0=round(vt, 3), t1=round(vt + 2.1, 3), credit=cred('v3')))
add_ov(dict(type='verdict', text='JUZGADO', sub='Y AÚN NO HAS HECHO NADA', mute=True), vt, vt + 2.1)
sfx.append({'t': vt - 0.03, 'src': 's_section', 'vol': .55})
COLD_END = vt + 2.1
T[0] = COLD_END + 0.15

# ================= P1 =================
P = 'p1'
say(P, 0, [shot('v4_00', 300.0, zoom=[1.03, 1.09])], [ST('YA HA SALIDO', x=1420, y=300, size=96, at=0.4)])
say(P, 1, [shot('v2_00', 230.0, **BL), shot('v4_00', 352.0, zoom=[1.04, 1.1], flash=True)], [KW([['SON', 0.0], ['LOS', 0.12], ['NPC', 0.25, True]], size=190, at=1.8)])
say(P, 2, [shot('v4_00', 9.5, zoom=[1.04, 1.1])], [KW([['TE', 0.0], ['MIRA', 0.15], ['·', 0.6], ['TE', 0.7], ['HABLA', 0.85], ['·', 1.4], ['TE', 1.5], ['JUZGA', 1.7, True]], size=130, top=110, at=0.9)])
say(P, 3, [shot('v2_02', 50.0), shot('v2_02', 58.0, zoom=[1.04, 1.1])], [ST('TIRANTES', sub='TE LO ECHAN EN CARA', x=1440, y=330, size=96, at=0.9)])
say(P, 4, [shot('v4_01', 62.0, zoom=[1.02, 1.08])], [ST('3 DÍAS SIN DUCHA', x=1280, y=300, size=90, rot=-6, at=0.5)])
say(P, 5, [shot('v2_00', 128.0), shot('v2_00', 168.0, zoom=[1.04, 1.1])], [KW([['ESA', 0.0], ['CHAQUETA', 0.25, True]], size=160, at=4.2)])
say(P, 6, [shot('v4_00', 304.0, **BL), shot('v4_00', 346.0, zoom=[1.03, 1.1])], [KW([['13', 0.0, True], ['AÑOS', 0.15], ['DE', 0.5], ['PURO', 0.65], ['DECORADO', 0.85]], size=150, dur=3.2), KW([['AHORA', 0.0], ['ES', 0.2], ['INFORMACIÓN', 0.4, True]], size=150, at=3.6, top=120)], cutsrel=[3.4])
say(P, 7, [shot('v2_02', 150.0), shot('v4_01', 140.0, flash=True), shot('v2_00', 140.0, flash=True), shot('v4_00', 430.0, flash=True)], [
    dict(type='chapter', n='01', text='LO QUE TE DICEN', at=2.6, dur=1.8), dict(type='chapter', n='02', text='LO QUE HABLAN ENTRE ELLOS', at=4.5, dur=1.8),
    dict(type='chapter', n='03', text='TU ROPA Y LA POLICÍA', at=6.4, dur=1.8), dict(type='chapter', n='04', text='EL MISTERIO', at=8.3, dur=2.0)])
TITLE_AT = T[0] + 0.05
add_ov(dict(type='titlecard'), TITLE_AT, TITLE_AT + TITLE_LEN)
sfx.append({'t': TITLE_AT - 0.1, 'src': 's_section', 'vol': .45})
T[0] = TITLE_AT + TITLE_LEN + 0.2
SW1 = [TITLE_AT - 0.2, TITLE_AT + TITLE_LEN]

# ================= P2 =================
P = 'p2'
say(P, 0, [shot('v4_00', 412.0, **BL)], [SEC('ANTES', 'GTA V · 2013')])
say(P, 1, [shot('v2_03', 42.0, zoom=[1.03, 1.09])], [KW([['EN', 0.0], ['CALZONCILLOS', 0.2], ['POR', 1.0], ['ROCKFORD', 1.2], ['HILLS', 1.5, True]], size=120, top=90), ST('NADIE TE MIRABA', x=1300, y=780, size=80, at=3.4)])
say(P, 2, [shot('v4_00', 470.0, **BL)], [dict(type='versus', at=0.1, span2=True)])
say(P, 3, [shot('v3', 60.0, zoom=[1.04, 1.1])], [ST('CAMBIA', x=960, y=540, size=170, rot=-6)])
say(P, 4, [shot('v4_00', 322.0), shot('v2_02', 236.0, zoom=[1.03, 1.08])], [Q(['REACCIONAN A TU ROPA,', 'A TU COCHE Y A', 'LO QUE LLEVAS ENCIMA'], 'LO QUE DICEN LOS ANÁLISIS', x=110, y=300, highlight=True)])
say(P, 5, [shot('v2_00', 60.0, **BL)], [ST('OJO: BULO', x=960, y=520, size=150, color='#ffd166')])
say(P, 6, [shot('v2_03', 104.5, zoom=[1.02, 1.07]), shot('v2_03', 108.0, zoom=[1.04, 1.1])], [ST('SIN IA GENERATIVA', sub='LO HAN DICHO ROCKSTAR Y TAKE-TWO', x=1240, y=330, size=84, at=2.2)])
say(P, 7, [shot('v4_00', 172.0), shot('v4_00', 236.0, zoom=[1.03, 1.08])], [KW([['QUIÉN', 0.0], ['ERES', 0.15], ['·', 0.9], ['QUÉ', 1.0], ['LLEVAS', 1.15, True], ['·', 1.8], ['DÓNDE', 1.9], ['ESTÁS', 2.05], ['·', 2.6], ['A', 2.7], ['QUÉ', 2.8], ['HORA', 2.95, True]], size=104, at=4.8, top=700)])
say(P, 8, [shot('v3', 18.0, zoom=[1.03, 1.1])], [])
T[0] += GAP_PART

# ================= P3 COMENTARIOS =================
P = 'p3'
say(P, 0, [shot('v3', 24.0)], [SEC('LOS COMENTARIOS', 'LO QUE DICEN DE TI POR LA CALLE')])
say(P, 1, [shot('v2_02', 505.0, zoom=[1.02, 1.07])], [ST('GAMEPLAY REAL', sub='EL JUEGO LLEVA HORAS FUERA', x=1360, y=320, size=96, at=1.2)])
say(P, 2, [shot('v4_00', 4.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='01', text='EL SEÑOR DEL CHIRINGUITO', at=0.2)])
npc('v4_00', 8.3, 12.8, 'Yo era igualito a ti, ¿sabes? Hace 50 años.', 'I used to look just like you, you know? 50 years ago.', 'NPC · CHIRINGUITO DE LA PLAYA')
say(P, 3, [shot('v2_00', 20.0)], [dict(type='chapter', n='02', text='EL DEL BAR', at=0.2)])
npc('v2_00', 26.35, 32.3, 'Tío, si los aliens te ordeñaran, sacarían unos híbridos guapísimos.', "Damn dude, if the aliens milked you, they'd get some damn good-looking hybrids.", 'NPC · BAR')
say(P, 4, [shot('v2_02', 513.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='03', text='LOS ABUELOS DEL BANCO', at=0.2)])
npc('v2_02', 523.1, 527.3, '¿Quieres pasar el rato? ¿Buscas más gente a la que robar?', 'You wanna hang out? Are you looking for more people to rob?', 'NPC · PASEO MARÍTIMO')
say(P, 5, [shot('v2_02', 530.0, **BL)], [KW([['EL', 0.0], ['JUEGO', 0.12], ['SABE', 0.3], ['A', 0.5], ['QUÉ', 0.6], ['TE', 0.75], ['DEDICAS', 0.9, True]], size=130, at=2.0)])
say(P, 6, [shot('v4_00', 318.0), shot('v2_02', 40.0, zoom=[1.03, 1.08])], [KW([['Y', 0.0], ['NO', 0.12], ['SIEMPRE', 0.3], ['ES', 0.55], ['PARA', 0.7], ['BIEN', 0.9, True]], size=140, at=3.0, top=110)])
npc('v2_02', 64.0, 71.0, 'Si vas a ser un borde, al menos sé divertido.', "If you're gonna be a b*tch, at least be fun about it.", 'NPC · PLAYA')
say(P, 7, [shot('v2_02', 200.0, **BL)], [Q(['«¿SIN MANGAS?', 'UN POCO AGRESIVO»'], 'UN NPC A JASON, SEGÚN UN ANÁLISIS', x=520, y=330, highlight=True)])
say(P, 8, [shot('v4_01', 120.0, zoom=[1.02, 1.08]), shot('v4_01', 112.0, zoom=[1.04, 1.1])], [ST('HUELES', sub='TE LO DIRÁN SI NO TE DUCHAS', x=1380, y=320, size=110, at=2.4)])
T[0] += GAP_PART

# ================= P4 CONTEXTO =================
P = 'p4'
say(P, 0, [shot('v4_00', 330.0)], [SEC('EL CONTEXTO', 'CADA ZONA TIENE SU CÓDIGO')])
say(P, 1, [shot('v4_01', 8.0), shot('v2_03', 18.0, zoom=[1.03, 1.08]), shot('v3', 140.0)], [KW([['GYM', 0.0], ['EN', 0.15], ['LA', 0.28], ['PLAYA', 0.4, True]], size=130, at=2.0, dur=1.9, top=110), KW([['TRAJE', 0.0], ['EN', 0.15], ['EL', 0.28], ['CENTRO', 0.4, True]], size=130, at=4.0, dur=1.9, top=110), KW([['CHANCLAS', 0.0], ['EN', 0.2], ['LOS', 0.32], ['KEYS', 0.45, True]], size=130, at=6.1, top=110)])
npc('v2_03', 271.3, 276.3, 'A diferencia de estos, yo entreno para la vida real. No lo entenderías.', "Unlike these other guys, I'm training for some real life sh*t. You wouldn't get it.", 'NPC · GIMNASIO')
say(P, 2, [shot('v2_02', 486.0, zoom=[1.02, 1.07]), shot('v2_03', 2.0, zoom=[1.03, 1.08])], [ST('BARRIO PIJO', x=1400, y=320, size=100, at=2.0)])
npc('v2_02', 500.2, 505.8, 'En diez años, en ese barrio solo vas a oír acento de niña rica.', "Ten years' time, walk through that neighborhood, all you're gonna hear is a rich girl accent.", 'NPC · BARRIO RICO')
say(P, 3, [shot('v2_02', 296.0), shot('v2_02', 340.0, zoom=[1.04, 1.1], flash=True)], [Q(['UNA VECINA LE PREGUNTÓ', 'QUÉ HACÍA MIRANDO SU CASA…', 'Y ACABÓ A PUÑETAZOS'], 'SEGÚN UN ANÁLISIS', x=110, y=290, highlight=True)])
say(P, 4, [shot('v4_00', 356.0, zoom=[1.04, 1.1])], [KW([['NO', 0.0], ['ERES', 0.15], ['INVISIBLE', 0.35, True]], size=160, top=110)])
T[0] += GAP_PART

# ================= P5 CUANDO TE PASAS =================
P = 'p5'
say(P, 0, [shot('v2_02', 330.0)], [SEC('CUANDO TE PASAS', 'LAS REACCIONES')])
say(P, 1, [shot('v4_00', 350.0, zoom=[1.04, 1.1])], [KW([['LEONIDA', 0.0, True], ['NO', 0.3], ['SE', 0.42], ['CALLA', 0.55]], size=150)])
say(P, 2, [shot('v4_01', 326.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='01', text='EL SOCORRISTA', at=0.2)])
npc('v4_01', 339.1, 342.0, '¡Eh, tío, espera! ¡Ya me voy, venga!', "Hey man, wait! I'll leave, come on!", 'NPC · SOCORRISTA')
say(P, 3, [shot('v4_00', 276.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='02', text='LA NOVIA PROTECTORA', at=0.2)])
npc('v4_00', 283.8, 286.9, '¡Quita esas manos! ¡No te metas con mi chico!', "Get those hands off, b*tch! Don't f*ck with my fella!", 'NPC · OCEAN DRIVE')
say(P, 4, [shot('v3', 296.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='03', text='EL SALUDO', at=0.2)])
npc('v3', 306.4, 308.7, '¿Qué pasa, capullo?', 'Sup, a**hole.', 'NPC · PLAYA')
say(P, 5, [shot('v2_02', 300.0), shot('v2_00', 150.0, flash=True)], [KW([['HUYEN', 0.0], ['·', 0.8], ['SE', 0.9], ['ENCARAN', 1.05], ['·', 1.8], ['TE', 1.9], ['DESARMAN', 2.05, True]], size=110, at=2.6, top=700)])
T[0] += GAP_PART

# ================= P6 ENTRE ELLOS =================
P = 'p6'
say(P, 0, [shot('v4_01', 160.0), shot('v4_00', 244.0, zoom=[1.03, 1.08])], [SEC('HABLAN ENTRE ELLOS', 'LA SÁTIRA ESTÁ EN LA CALLE')])
say(P, 1, [shot('v4_01', 144.0, zoom=[1.02, 1.07])], [])
npc('v4_01', 151.5, 158.6, '…Si me eligieran a mí, yo me dejaba. Podrían haber elegido a cualquiera.', "If they pick me out, I'd make love to them. They could have had anyone alive.", 'NPC · CHARLA EN EL GIMNASIO')
say(P, 2, [shot('v4_00', 228.0, zoom=[1.02, 1.07])], [])
npc('v4_00', 235.0, 240.3, '¿Así que ganas siete cifras? Otro día en el paraíso, ¿eh?', 'So you make like seven figures. Another day in paradise, right?', 'NPC · TERRAZA DE OCEAN DRIVE')
say(P, 3, [shot('v2_02', 476.0, zoom=[1.02, 1.07])], [])
npc('v2_02', 479.7, 482.4, 'Con cinco millones y medio, la tiro abajo y construyo otra.', 'You gave me five and a half mil, I could do a tear down.', 'NPC · BARRIO RICO')
say(P, 4, [shot('v2_02', 494.0, zoom=[1.02, 1.07])], [])
npc('v2_02', 507.3, 513.0, 'La gente de aquí, de Leonida, tiene su reputación.', 'People down here in Leonida have a reputation.', 'NPC · BARRIO RICO')
say(P, 5, [shot('v2_00', 236.0), shot('v2_00', 300.0, zoom=[1.03, 1.08])], [KW([['EN', 0.0], ['LA', 0.12], ['CALLE', 0.25, True], ['·', 0.9], ['NO', 1.0], ['EN', 1.12], ['LA', 1.24], ['RADIO', 1.36]], size=130, at=2.4)])
T[0] += GAP_PART

# ================= P7 LOS QUE TRABAJAN =================
P = 'p7'
say(P, 0, [shot('v2_00', 40.0)], [SEC('LOS QUE TE ATIENDEN', 'DEPENDIENTES · RECEPCIONISTAS · CAMAREROS')])
say(P, 1, [shot('v2_00', 44.0, zoom=[1.02, 1.07])], [])
npc('v2_00', 52.0, 53.9, 'Gracias por su visita.', 'We appreciate your patronage.', 'NPC · CAMARERO')
say(P, 2, [shot('v2_03', 100.0), shot('v2_03', 222.0, zoom=[1.03, 1.08])], [])
npc('v2_03', 108.0, 111.6, '¿Le puedo recomendar algún producto en concreto?', 'Can I direct you to any product in particular?', 'NPC · RECEPCIÓN DEL HOTEL')
T[0] += GAP_PART

# ================= P8 POLICÍA + TRUCOS =================
P = 'p8'
say(P, 0, [shot('v2_00', 160.0, zoom=[1.03, 1.1])], [SEC('TU ROPA ES UNA PISTA', 'POLICÍA · TESTIGOS · CÁMARAS')])
say(P, 1, [shot('v2_00', 138.0)], [ST('SIN TESTIGOS, NO HAY POLICÍA', x=960, y=830, size=72, rot=-4, at=0.3)])
npc('v2_00', 155.15, 159.3, '¡Idiota! ¡Quedas detenido, hijo de…!', "You f*cking idiot, you're under arrest, you son of a…", 'POLICÍA DE LEONIDA')
say(P, 2, [shot('v2_00', 171.0, **BL)], [HUD(['face', 'clothes', 'car', 'pair'], at=0.1)])
say(P, 3, [shot('v2_00', 172.5, **BL)], [HUD(['face', 'clothes'], focus=True, at=0.1)])
say(P, 4, [shot('v2_03', 300.0, **BL)], [HUD(['face', 'clothes'], clear=['face'], at=0.1, clear_at=4.2)])
say(P, 5, [shot('v2_00', 320.0), shot('v2_00', 380.0, zoom=[1.03, 1.08])], [ST('PUEDE SALVARTE', x=1400, y=330, size=100, at=3.0)])
say(P, 6, [shot('v4_01', 336.0, zoom=[1.02, 1.07])], [KW([['APÚNTATE', 0.4], ['ESTO', 0.7, True]], size=170)])
say(P, 7, [shot('v2_01', 476.0), shot('v2_01', 492.0, zoom=[1.03, 1.08])], [TIP('1', 'OUTFIT DE REPUESTO', 'EN EL MALETERO')])
say(P, 8, [shot('v2_00', 400.0)], [TIP('2', 'MÁSCARA Y GORRO', 'SIRVEN PARA LA CARA, NO PARA LA ROPA')])
say(P, 9, [shot('v2_03', 112.0, zoom=[1.02, 1.08])], [TIP('3', 'OJO CON LAS CÁMARAS', 'GRABAN AUNQUE NADIE MIRE')])
say(P, 10, [shot('v2_02', 300.0), shot('v2_02', 344.0, zoom=[1.03, 1.08])], [TIP('4', 'ROBA SU SOMBRERO', 'Y DISFRÁZATE CON ÉL')])
T[0] += GAP_PART

# ================= P9 MISTERIO =================
P = 'p9'
say(P, 0, [shot('v3', 250.0, **BL)], [ST('SIN CONFIRMAR', x=960, y=540, size=140, color='#ffd166')])
say(P, 1, [shot('v4_00', 440.0), shot('v4_00', 446.0, zoom=[1.03, 1.09])], [KW([['¿TIENEN', 0.0], ['MEMORIA?', 0.3, True]], size=150, at=1.2, top=110)])
say(P, 2, [shot('v2_03', 60.0)], [Q(['PATENTES DE ROCKSTAR:', 'NPC QUE RECUERDAN', 'LO QUE HICISTE'], 'RUMOR · SIN CONFIRMAR', kind='teoria', x=110, y=300)])
say(P, 3, [shot('v2_01', 406.0), shot('v2_01', 413.0, zoom=[1.03, 1.08])], [])
npc('v2_01', 419.9, 424.4, 'Eh… ¿te conozco?', 'Um, do I know you?', 'NPC · HAMBURGUESERÍA')
say(P, 4, [shot('v2_01', 425.5, **BL)], [KW([['¿CASUALIDAD…', 0.0], ['O', 0.6], ['MEMORIA?', 0.75, True]], size=150)])
say(P, 5, [{'split': [dict(src='T01', s=236.2, name='JASON', role='¿LE TRATAN IGUAL?', at=0.0, origin='38% 40%', scale=1.15, shift=-120), dict(src='T01', s=480.3, name='LUCÍA', role='¿O DISTINTO?', at=0.3, origin='50% 40%', scale=1.12, shift=60)], 'mid': dict(text='VS', at=0.8, y=150), 'src': 'T01', 's': 236.2}], [])
say(P, 6, [shot('v4_00', 200.0), shot('v3', 120.0, flash=True)], [KW([['10', 0.0, True], ['OUTFITS', 0.15], ['·', 0.8], ['MISMOS', 0.9], ['SITIOS', 1.05], ['·', 1.6], ['JASON', 1.7], ['Y', 1.85], ['LUCÍA', 1.95, True]], size=104, at=1.4, top=700)])
T[0] += GAP_PART

# ================= P10 CIERRE =================
P = 'p10'
say(P, 0, [shot('v3', 100.0), shot('v2_02', 180.0, flash=True), shot('v4_00', 350.0, flash=True)], [KW([['EL', 0.0], ['MUNDO', 0.15], ['SE', 0.45], ['ENTERA', 0.6, True]], size=150, at=4.4, top=110)])
say(P, 1, [shot('v4_00', 60.0, **BL)], [KW([['¿QUÉ', 0.0], ['OUTFIT', 0.2, True], ['PROBAMOS?', 0.5]], size=160), ST('COMENTA', x=1500, y=830, size=80, at=2.4)])
s0 = T[0]
say(P, 2, [shot('v4_00', 70.0, **BL)], [])
add_ov(dict(type='subscribe'), s0 + 0.05, T[0] + 0.3)
END_AT = T[0] + 0.3
add_ov(dict(type='endcard'), END_AT, END_AT + 3.0)
END = END_AT + 3.0
SW2 = [END_AT - 0.3, END]
