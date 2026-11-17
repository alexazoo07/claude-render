import json
import os
HERE = os.path.dirname(os.path.abspath(__file__))
A = json.load(open(os.path.join(HERE, 'align.json')))
GAP = 0.6
TITLE_LEN = 3.8
# ---------- global placement of the voice parts ----------
COLD = 4.25
starts = {}
t = COLD
for i in range(1, 9):
    k = f'p{i}'
    starts[k] = t
    t += A[k]['dur']
    if i == 1:
        title_at = t + 0.05
        t = title_at + TITLE_LEN + 0.2
    else:
        t += GAP
END_CARD = 3.2
END = t - GAP + END_CARD

def S(part, idx):  # global start of sentence idx
    s = A[part]['sents']
    if idx >= len(s):
        return starts[part] + A[part]['dur']
    return starts[part] + s[idx]['t']

def c(p, s, **kw):
    d = {'p': p, 's': s}
    d.update(kw)
    return d

video, overlays, sfx = [], [], []
SFX_FOR = {'label': ('s_text', .32), 'big': ('s_text', .36), 'shout': ('s_text', .36), 'badge': ('s_pop', .4), 'quote': ('s_card', .42),
           'section': ('s_section', .45), 'theory': ('s_section', .45), 'checklist': ('s_card2', .38), 'meter': ('s_card2', .38),
           'subscribe': ('s_pop', .4), 'panel': ('s_card2', .38), 'scale': ('s_card2', .32), 'map': ('s_card', .35)}
_rot = [0]
def text_sfx():
    _rot[0] = _rot[0] % 3 + 1
    return f's_text{_rot[0]}'

def beat(part, idx, clips=None, ovs=(), cuts=None, lead=0.08, until=None, flash=False):
    t0 = S(part, idx) - (lead if idx > 0 else 0)
    if idx == 0:
        t0 = starts[part]
    t1 = until if until is not None else S(part, idx + 1) - lead
    if clips:
        n = len(clips)
        bounds = [t0] + ([t0 + x for x in cuts] if cuts else [t0 + (t1 - t0) * k / n for k in range(1, n)]) + [t1]
        for k, cl in enumerate(clips):
            v = dict(cl); v['t0'] = round(bounds[k], 3); v['t1'] = round(bounds[k + 1], 3)
            if 'map' in v: v['map'] = dict(v['map']); v['map'].setdefault('net', None)
            if (flash and k > 0) or v.get('flash'):
                v['flash'] = True
                sfx.append({'t': v['t0'] - 0.18, 'src': 's_cut', 'vol': .38})
            video.append(v)
    for o in ovs:
        o = dict(o)
        a = S(part, idx) + o.pop('at', 0.05)
        if 'dur' in o: b = a + o.pop('dur')
        elif 'span' in o: b = S(part, idx + o.pop('span')) - lead
        else: b = S(part, idx + 1) - lead
        o['t0'] = round(a, 3); o['t1'] = round(b, 3)
        overlays.append(o)
        if o['type'] in SFX_FOR and not o.get('mute'):
            src, vol = SFX_FOR[o['type']]
            if src == 's_text': src = text_sfx()
            sfx.append({'t': a - 0.06, 'src': src, 'vol': vol})


# ---------- animated map scenes ----------
YAN = dict(img='maps/yanis.jpg', w=5670, h=7680, bg='#2c66a5', source='MAPA BASE: YANIS GTA VI COMMUNITY MAP V17 · GTADB.ORG')
CON = dict(img='maps/condados.jpg', w=4992, h=5120, bg='#4a6a96', source='MAPA: GTA VI MAPPING PROJECT V0.051 · GTADB.ORG')
def MAP(base, **k):
    d = dict(base); d.update(k); return {'map': d}
KEYS_REGION = [(0.22,0.84),(0.33,0.86),(0.47,0.83),(0.58,0.77),(0.64,0.79),(0.55,0.88),(0.40,0.93),(0.22,0.93)]

L = lambda text, sub=None, **k: dict(type='label', text=text, sub=sub, **k)
B = lambda text, sub=None, **k: dict(type='big', text=text, sub=sub, **k)
SH = lambda text, **k: dict(type='shout', text=text, **k)
Q = lambda kind, lines, source, **k: dict(type='quote', kind=kind, lines=lines, source=source, **k)
BD = lambda text, sub=None, **k: dict(type='badge', text=text, sub=sub, **k)
SEC = lambda text, sub=None, **k: dict(type='section', text=text, sub=sub, **k)
TH = lambda n, text, **k: dict(type='theory', n=n, text=text, **k)
BLUR = dict(blur=10, dim=0.2)
KW = lambda words, **k: dict(type='kinetic', words=words, **k)
ST = lambda text, sub=None, **k: dict(type='stamp', text=text, sub=sub, **k)
NT = lambda name, role, photo, **k: dict(type='nametag', name=name, role=role, photo=photo, **k)
def SPLIT(a, b, mid=None):
    return {'split': [a, b], 'mid': mid}

# =============== PART 1 — HOOK ===============
P = 'p1'
s = lambda i: S(P, i)
# ---- cold open: 7 hard cuts on the music beat with flashing words, before the narrator starts ----
BEAT = 60 / 99.384
cold = [c('01', 283.3, zoom=[1.08, 1.16]), c('00', 292.6, zoom=[1.06, 1.14]), c('02', 258.3, zoom=[1.06, 1.14]), c('02', 276.6, zoom=[1.06, 1.14]),
        c('01', 405.2, zoom=[1.06, 1.14]), c('02', 9.9, zoom=[1.04, 1.1]), c('02', 451.2, zoom=[1.04, 1.1])]
for k, cl in enumerate(cold):
    v = dict(cl); v['t0'] = round(k * BEAT, 3); v['t1'] = round(min(COLD, (k + 1) * BEAT), 3) if k < len(cold) - 1 else COLD; v['flash'] = k > 0; v['cold'] = True
    video.append(v)
    sfx.append({'t': max(0, k * BEAT - 0.15), 'src': 's_cut', 'vol': .34})
overlays.append(dict(type='coldwords', t0=0.0, t1=COLD - 0.02, words=[['UN EX MILITAR', 0.0], ['UNA EX PRESIDIARIA', BEAT * 2], ['UNA CONSPIRACIÓN', BEAT * 4, True], ['Y 13 AÑOS\nDE ESPERA', BEAT * 5.6, False, 150]]))
beat(P, 0, [SPLIT(dict(p='01', s=236.2, name='JASON', role='EX MILITAR', at=0.0, origin='38% 40%', scale=1.15, shift=-120), dict(p='01', s=480.3, name='LUCÍA', role='RECIÉN SALIDA DE PRISIÓN', at=0.25, origin='50% 40%', scale=1.12, shift=60), mid=dict(text='19 NOV', at=1.0, y=150))], [], lead=0)
sfx += [{'t': starts[P] - 0.05, 'src': 's_card', 'vol': .38}, {'t': starts[P] + 1.0, 'src': 's_pop', 'vol': .3}]
beat(P, 1, [c('01', 172.0, zoom=[1, 1.06], origin='60% 35%')], [dict(type='rec', box=[985, 165, 410, 470], tag='LUCÍA · RECIÉN SALIDA DE PRISIÓN', at=0.1)])
sfx.append({'t': s(1), 'src': 's_pop', 'vol': .3})
beat(P, 2, [c('00', 168.0, zoom=[1.03, 1.1])], [NT('JASON DUVAL', 'EX MILITAR · TRABAJA PARA NARCOS EN LOS KEYS', 'ph_jason', at=0.1)])
beat(P, 3, [c('01', 156.6), c('01', 159.0, zoom=[1.02, 1.08])], [BD('1ª', 'MUJER PROTAGONISTA DE LA SAGA', x=1420, y=330, size=150, at=0.5, span=2)], cuts=[2.4], until=S(P, 5) - 0.08)
beat(P, 4, None, [ST('HISTÓRICO', y=760, x=1220, size=110)])
beat(P, 5, [c('00', 388.0, **BLUR), c('00', 391.5, zoom=[1.03, 1.1])], [Q('prensa', ['LOS BONNIE Y CLYDE', 'DE LEONIDA'], 'ASÍ LOS DESCRIBE LA PRENSA', x=120, y=300, highlight=True, dur=2.3), B('¿QUÉ SABEMOS?', 'DE VERDAD', size=170, at=2.68)], cuts=[2.62])
# montage of the four topics (sub-clause times from the pauses)
b6 = s(6); sub = [b6, starts[P] + 19.5, starts[P] + 22.6, starts[P] + 25.7, starts[P] + 29.15, s(7) - 0.08]
video += [dict(c('01', 194.0), t0=b6 - 0.08, t1=sub[1]), dict(c('01', 480.0, rate=0.85, zoom=[1.02, 1.1]), t0=sub[1], t1=sub[2]),
          dict(c('01', 150.0), t0=sub[2], t1=sub[2] + 0.85), dict(c('01', 283.0, zoom=[1.04, 1.1], flash=True), t0=sub[2] + 0.85, t1=sub[2] + 1.75),
          dict(c('01', 287.5, zoom=[1.04, 1.1], flash=True), t0=sub[2] + 1.75, t1=sub[3]), dict(c('01', 516.0), t0=sub[3], t1=sub[4]),
          dict(c('01', 522.0, zoom=[1.06, 1.14], flash=True), t0=sub[4], t1=sub[5])]
for n, (a, txt) in enumerate([(sub[0], 'QUIÉN ES JASON'), (sub[1], 'LA CÁRCEL DE LUCÍA'), (sub[2], 'EL GOLPE QUE SALE MAL'), (sub[3], 'LA CUENTA COMPARTIDA')]):
    overlays.append(dict(type='chapter', n=f'0{n + 1}', text=txt, t0=a + 0.05, t1=sub[n + 1] - 0.02))
    sfx.append({'t': a - 0.06, 'src': text_sfx(), 'vol': .3})
overlays.append(dict(type='kinetic', words=[['¿QUÉ', 0.0], ['PODRÍA', 0.18], ['SALIR', 0.36], ['MAL?', 0.54, True]], size=130, dim=True, t0=sub[4] + 0.05, t1=sub[5]))
sfx += [{'t': sub[2] + 0.67, 'src': 's_cut', 'vol': .38}, {'t': sub[2] + 1.57, 'src': 's_cut', 'vol': .38}, {'t': sub[4] - 0.18, 'src': 's_cut', 'vol': .35}]
b7 = s(7)
beat(P, 7, [c('01', 207.0, **BLUR)], [dict(type='glass', img='para', kind='oficial', title=['LO QUE DIJO', 'ROCKSTAR'], x=90, y=290, rot=-2, at=0.1, span=1),
                                      dict(type='glass', img='car', kind='previews', title=['LO QUE CONTARON', 'LOS QUE YA LO JUGARON'], x=700, y=250, w=520, at=2.1, span=1),
                                      dict(type='glass', img='walk', kind='fans', title=['LO QUE SE VE', 'EN LOS TRÁILERS'], x=1330, y=290, rot=2, at=4.1, span=1)])
for a in [0.1, 2.1, 4.1]: sfx.append({'t': b7 + a - 0.06, 'src': 's_card', 'vol': .38})
beat(P, 8, [c('01', 213.5, blur=7, dim=0.25)], [dict(type='checklist', title='MIS TEORÍAS DEL FINAL', tag='AL FINAL DEL VÍDEO', rows=4, at=0.1)])
beat(P, 9, [c('02', 451.0, rate=0.9), c('02', 426.6, rate=0.9, zoom=[1.02, 1.08])], [dict(type='counter', at=0.0, span=2)], cuts=[2.2], until=title_at)
sfx.append({'t': s(9) - 1.6, 'src': 's_swell', 'vol': .35})
for i in range(11): sfx.append({'t': s(9) + 0.13 + (i / 11) ** 0.5 * 1.6, 'src': 's_tick', 'vol': .08})
overlays.append(dict(type='titlecard', t0=title_at, t1=title_at + TITLE_LEN))
sfx += [{'t': title_at - 0.3, 'src': 's_swell', 'vol': .4}, {'t': title_at, 'src': 's_sub', 'vol': .4}]

# =============== PART 2 — RULES ===============
P = 'p2'
beat(P, 0, [c('00', 519.0, blur=9, dim=0.25)], [dict(type='legend', rows=[['oficial', 'LO DIJO ROCKSTAR', A[P]['sents'][1]['t']], ['previews', 'LO CONTARON LOS QUE YA LO JUGARON', A[P]['sents'][2]['t']], ['fans', 'SALE DE LA COMUNIDAD DE FANS', A[P]['sents'][3]['t']], ['teoria', 'ES TEORÍA MÍA', A[P]['sents'][4]['t']]], at=0.0, span=5)], until=S(P, 5) - 0.08)
for i in range(1, 5): sfx.append({'t': S(P, i) - 0.06, 'src': text_sfx(), 'vol': .3})
beat(P, 5, [c('01', 447.5, zoom=[1.02, 1.08])], [], until=S('p3', 0) - 0.08)

# =============== PART 3 — JASON ===============
P = 'p3'
beat(P, 0, [c('00', 546.0, zoom=[1.03, 1.1])], [])
beat(P, 1, [c('01', 236.0, blur=12, dim=0.35)], [dict(type='dossier', num='Nº 01', name='JASON DUVAL', photo='ph_jason', nick='Jason', rows=[['QUIERE', 'UNA VIDA FÁCIL', 3.6], ['PERO', 'TODO SE COMPLICA', 5.4], ['CRECIÓ ENTRE', 'ESTAFADORES Y DELINCUENTES', 7.7]], at=0.0, span=3)], until=S(P, 3) + 1.6)
beat(P, 2, None, [])
beat(P, 3, None, [])
beat(P, 4, [c('00', 291.0), c('00', 294.0, zoom=[1.04, 1.1])], [L('EL EJÉRCITO', 'PARA ENDEREZARSE', at=0.1, dur=1.9), KW([['NO', 0.0], ['SALIÓ', 0.15], ['BIEN', 0.3, True]], size=150, at=2.4)], cuts=[2.3], flash=True)
beat(P, 5, [c('01', 236.4, zoom=[1.12, 1.2], origin='38% 38%')], [Q('oficial', ['"ME METÍ EN PROBLEMAS', 'EN EL EJÉRCITO"'], 'JASON · TRÁILER DE LANZAMIENTO', x=1000, y=260, tilt=1.6)])
beat(P, 6, [c('00', 555.5, zoom=[1.0, 1.06])], [L('NI PRÉSTAMOS NI NADA', '"A LA GENTE COMO YO"')])
beat(P, 7, [MAP(YAN, cam=[[0, 0.5, 0.53, 1.95], [2.8, 0.44, 0.84, 0.62], [6.0, 0.43, 0.85, 0.52]], paths=[dict(t0=2.4, t1=4.2, pts=[(0.62,0.765),(0.595,0.80),(0.555,0.84),(0.50,0.875),(0.43,0.90),(0.36,0.905),(0.29,0.90),(0.24,0.885)])], pins=[dict(t=2.3, x=0.47, y=0.865, label='LEONIDA KEYS', sub='AQUÍ TRABAJA JASON PARA LOS NARCOS', big=True)], kind='fans')], [])
beat(P, 8, [c('01', 476.5, zoom=[1.04, 1.1])], [B('¿Y DÓNDE VIVE?', size=160)])
beat(P, 9, [c('00', 437.0, zoom=[1.0, 1.06])], [SH('NI SIQUIERA ES SUYA', y=880)])
beat(P, 10, [c('01', 116.0, blur=12, dim=0.3)], [dict(type='board', title='LA CASA DE JASON', center=dict(x=960, y=560, text='LA CASA'), centerT=0.2, items=[dict(photo='ph_brian', label='BRIAN HEDER', sub='NARCO DE LA VIEJA ESCUELA', x=560, y=450, rot=-4, t=0.5), dict(photo='ph_lori', label='LORI', sub='SU TERCERA ESPOSA', x=1360, y=450, rot=3, t=4.3, pos='45% 40%')])])
beat(P, 11, [c('01', 99.0, zoom=[1.0, 1.06])], [BD('0 $', 'DE ALQUILER', x=1450, y=300, size=130, at=0.6, dur=3.6), L('+ LA SANGRÍA DE LORI', 'DE VEZ EN CUANDO', at=4.6)])
beat(P, 12, None, [KW([['¿UN', 0.0], ['TRATO', 0.15], ['JUSTO?', 0.3, True]], size=130, dim=True)])
beat(P, 13, [c('02', 24.7, zoom=[1.0, 1.08])], [NT('CAL HAMPTON', 'EL MEJOR AMIGO DE JASON', 'ph_cal', kind='oficial')], until=S(P, 14) + 3.4)
beat(P, 14, [c('01', 471.5, zoom=[1.0, 1.05])], [dict(type='panel', title='EL PLAN PERFECTO DE CAL', rows=['QUEDARSE EN CASA', 'RADIO DE LA GUARDIA COSTERA', 'CERVEZAS + PESTAÑAS PRIVADAS'], times=[0.6, 2.8, 5.2])], lead=-3.4)
beat(P, 15, [c('02', 26.3, zoom=[1.1, 1.2])], [KW([['SÍ.', 0.0], ['ESAS', S(P, 16) - S(P, 15)], ['PESTAÑAS.', S(P, 16) - S(P, 15) + 0.2, True]], size=150, dim=True, span=2)], until=S(P, 17) - 0.08)
beat(P, 16, None, [])
beat(P, 17, [c('01', 483.2, **BLUR)], [Q('oficial', ['FELIZ EN LA MAREA BAJA', 'DE AMÉRICA'], 'ROCKSTAR GAMES · SOBRE CAL', x=130, y=330, highlight=True)])
beat(P, 18, [c('01', 186.0, zoom=[1.0, 1.06])], [L('PLANES MÁS GRANDES')], until=S(P, 20) - 0.08)
beat(P, 19, None, [ST('IMPORTANTE', y=500, size=100, rot=-6)])
beat(P, 20, [c('01', 455.0, **BLUR)], [Q('oficial', ['CONOCER A LUCÍA PUEDE SER', 'LO MEJOR... O LO PEOR'], 'ROCKSTAR GAMES · BIOGRAFÍA DE JASON', x=130, y=330, highlight=True)], until=S('p4', 0) - 0.08)

# =============== PART 4 — LUCÍA ===============
P = 'p4'
beat(P, 0, [c('01', 135.0, zoom=[1.03, 1.1])], [KW([['AHORA,', 0.0], ['ELLA.', 0.35, True]], size=160, dim=True)])
beat(P, 1, [c('01', 171.3, blur=12, dim=0.35)], [dict(type='dossier', num='Nº 02', name='LUCÍA CAMINOS', photo='ph_lucia', nick='Lucía', rows=[['SU PADRE', 'LE ENSEÑÓ A PELEAR', 3.0], ['ANTES DE', 'SABER ANDAR', 4.6], ['DESDE ENTONCES', 'GOLPE TRAS GOLPE', 8.0]], at=0.0, span=3)], until=S(P, 4) - 0.08)
beat(P, 2, None, [])
beat(P, 3, None, [])
beat(P, 4, [MAP(YAN, cam=[[0, 0.6, 0.16, 1.15], [3.3, 0.66, 0.47, 0.72]], paths=[dict(t0=0.25, t1=2.6, pts=[(0.55,-0.04),(0.62,0.04),(0.70,0.14),(0.77,0.27),(0.76,0.38),(0.70,0.47),(0.68,0.51)])], pins=[dict(t=0.15, x=0.56, y=0.02, label='LIBERTY CITY', sub='EL NUEVA YORK DE GTA · MUY AL NORTE', big=True), dict(t=2.55, x=0.68, y=0.515, label='VICE CITY', sub='SU NUEVA VIDA EN LEONIDA')], kind='oficial')], [])
beat(P, 5, [c('01', 30.0, **BLUR)], [Q('oficial', ['LA BUENA VIDA CON LA QUE', 'SU MADRE SOÑABA'], 'ROCKSTAR GAMES · BIOGRAFÍA DE LUCÍA', x=130, y=330, highlight=True)])
beat(P, 6, [c('00', 297.0, zoom=[1.02, 1.08])], [KW([['¿POR', 0.0], ['QUÉ', 0.12], ['ACABÓ', 0.24], ['EN', 0.36], ['LA', 0.44], ['CÁRCEL?', 0.52, True]], size=120)])
beat(P, 7, [c('01', 405.0, **BLUR)], [Q('oficial', ['LUCHAR POR SU FAMILIA', 'LA LLEVÓ A PRISIÓN'], 'ROCKSTAR GAMES · PENITENCIARÍA DE LEONIDA', x=130, y=330, highlight=True)])
beat(P, 8, [c('01', 157.0, zoom=[1.04, 1.12], origin='35% 30%')], [B('¿QUÉ HIZO?', size=170)])
beat(P, 9, None, [ST('SIN CONFIRMAR', y=720, size=96)])
beat(P, 10, [c('01', 463.0, zoom=[1.0, 1.06])], [B('¿CÓMO SALIÓ?', size=170)])
beat(P, 11, [c('01', 466.0, zoom=[1.03, 1.08])], [BD('SUERTE', 'SEGÚN ROCKSTAR', x=960, y=480, size=140, at=0.25)])
beat(P, 12, [c('01', 452.0, zoom=[1.02, 1.08])], [])
beat(P, 13, None, [KW([['SOSPECHOSO...', 0.0, True]], size=140, top=760)])
beat(P, 14, [c('00', 9.0, **BLUR)], [Q('oficial', ['LUCÍA, VESTIDA DE PRESA,', 'CON SU TRABAJADORA SOCIAL'], 'TRÁILER 1 · DICIEMBRE 2023', x=130, y=330)])
beat(P, 15, [c('01', 537.0, zoom=[1.0, 1.06])], [])
beat(P, 16, [c('01', 135.0, **BLUR)], [dict(type='panel', title='LUCÍA, LA PRIMERA', rows=['VOZ PROPIA', 'PASADO PROPIO', 'PESO REAL EN LOS DIÁLOGOS'], times=[1.6, 2.8, 4.2])])
beat(P, 17, [c('01', 522.0, **BLUR)], [Q('prensa', ['VA A POR LO QUE QUIERE', 'Y EMPUJA HASTA CONSEGUIRLO'], 'REVISTA LOVE · ROCKSTAR GAMES', x=130, y=330, highlight=True)])
beat(P, 18, [SPLIT(dict(p='01', s=128.6, name='JASON', role='REACCIONA A LO QUE LE PASA', at=0.0, scale=1.05), dict(p='01', s=157.8, name='LUCÍA', role='DECIDE · VA A POR LO QUE QUIERE', at=S(P, 19) - S(P, 18), origin='35% 30%', scale=1.1, shift=80), mid=dict(text='VS', at=S(P, 19) - S(P, 18) + 0.3))], [], until=S(P, 21) - 0.08)
beat(P, 19, None, [])
beat(P, 20, None, [KW([['ÉL', 0.0], ['SE DEJA', 0.15], ['LLEVAR', 0.3, True]], size=100, top=120)])
beat(P, 21, [c('00', 316.0, **BLUR), c('01', 456.0, zoom=[1.02, 1.08])], [Q('oficial', ['"VULNERABLES, DUROS,', 'IMPERFECTOS"'], 'ELIZABETH GAUVEY-KERN · GUIONISTA DE ROCKSTAR', x=130, y=330, dur=4.6)], cuts=[4.7], until=S('p5', 0) - 0.08)

# =============== PART 5 — LA PAREJA ===============
P = 'p5'
beat(P, 0, [c('01', 540.0, zoom=[1.0, 1.08])], [KW([['¿QUÉ', 0.0], ['SON?', 0.2], ['PAREJA,', S(P, 1) - S(P, 0)], ['SÍ.', S(P, 1) - S(P, 0) + 0.45], ['PERO', S(P, 2) - S(P, 0)], ['CON', S(P, 2) - S(P, 0) + 0.2], ['HISTORIA', S(P, 2) - S(P, 0) + 0.4, True]], size=130, dim=True, span=3)], until=S(P, 3) - 0.08)
beat(P, 1, None, [])
beat(P, 2, None, [])
beat(P, 3, [c('01', 231.0, **BLUR)], [Q('oficial', ['"QUIEREN DARLE OTRA', 'OPORTUNIDAD A LO SUYO"'], 'ROB NELSON · ROCKSTAR NORTH · REVISTA EDGE', x=130, y=330, highlight=True)])
beat(P, 4, [c('01', 241.5, zoom=[1.04, 1.1])], [B('OTRA OPORTUNIDAD', size=150), ST('YA LO INTENTARON', y=780, size=80, rot=-5, at=S(P, 5) - S(P, 4))], until=S(P, 6) - 0.08)
beat(P, 5, None, [])
beat(P, 6, [c('00', 388.0, **BLUR)], [Q('fans', ['¿SON EX QUE VUELVEN?'], 'TEORÍA DE LA COMUNIDAD', x=130, y=360), ST('NO CONFIRMADO', x=1380, y=700, size=72, rot=-7, at=3.0)])
beat(P, 7, [c('01', 541.0, zoom=[1.02, 1.08])], [L('ES UNA MECÁNICA')])
beat(P, 8, [c('01', 483.0), c('01', 485.9, rate=0.9), c('01', 480.5), c('01', 456.0)], [dict(type='scale', label='CERCANÍA', at=0.3)], flash=True)
beat(P, 9, [SPLIT(dict(p='01', s=239.2, name='JASON', at=0.0, origin='38% 38%', scale=1.15, shift=-120), dict(p='01', s=172.4, name='LUCÍA', at=0.6, origin='60% 35%', scale=1.1, shift=80), mid=dict(text='⇄  CAMBIA ENTRE LOS DOS', at=1.0, y=150))], [])
beat(P, 10, [c('00', 317.0, **BLUR)], [Q('previews', ['PUEDEN ROMPER...', 'PERO SIGUEN SIENDO SOCIOS'], 'PREVIEWS · ROB NELSON', x=130, y=330, highlight=True)])
beat(P, 11, [c('01', 160.0, zoom=[1.02, 1.08])], [SH('EL ATRACO SIGUE EN PIE', y=890)])
beat(P, 12, [c('01', 510.0, zoom=[1.0, 1.06])], [BD('$', 'FINANZAS COMPARTIDAS', x=1450, y=320, size=150, at=0.5)])
beat(P, 13, [c('01', 534.0, zoom=[1.0, 1.06])], [L('CUENTA COMPARTIDA', 'CON TU PAREJA CRIMINAL')])
beat(P, 14, [c('01', 405.0, zoom=[1.04, 1.1])], [SH('¿QUÉ PODRÍA SALIR MAL?', y=540, size=110)])
beat(P, 15, [c('01', 384.0, zoom=[1.0, 1.06])], [dict(type='rec', box=[760, 300, 400, 300], tag='SOSPECHOSOS · HOMBRE Y MUJER', at=0.2)])
sfx.append({'t': S(P, 15) + 0.2, 'src': 's_pop', 'vol': .3})
beat(P, 16, [c('01', 453.0, zoom=[1.02, 1.08])], [KW([['¿ROMÁNTICO?', 0.0], ['NO.', S(P, 17) - S(P, 16), True]], size=140, dim=True, span=2)], until=S(P, 18) - 0.08)
beat(P, 17, None, [])
beat(P, 18, [c('01', 300.0, zoom=[1.03, 1.1])], [KW([['¿EFECTIVO?', 0.0], ['MUCHÍSIMO.', S(P, 19) - S(P, 18), True]], size=140, dim=True, span=2)], until=S('p6', 0) - 0.08)
beat(P, 19, None, [])

# =============== PART 6 — LA HISTORIA ===============
P = 'p6'
beat(P, 0, [MAP(YAN, cam=[[0, 0.62, 0.52, 0.9], [3.5, 0.55, 0.52, 1.5]]), c('01', 423.0, **BLUR)], [SEC('LA HISTORIA', 'LO QUE SABEMOS DEL ARGUMENTO', dur=2.4)], cuts=[S(P, 1) - S(P, 0) + 1.25], until=S(P, 2) - 0.08)
beat(P, 1, None, [Q('oficial', ['LA BARAJA ESTÁ TRUCADA', 'EN SU CONTRA'], 'ROCKSTAR GAMES · SINOPSIS OFICIAL', x=130, y=330, highlight=True, at=1.35)])
beat(P, 2, [c('02', 451.0, rate=0.9), c('02', 426.8, rate=0.9)], [B('EL LADO MÁS OSCURO', 'DEL LUGAR MÁS SOLEADO DE AMÉRICA', size=130, at=2.2)], cuts=[2.6])
beat(P, 3, [MAP(CON, cam=[[0, 0.72, 0.55, 0.45], [4.2, 0.6, 0.52, 0.8]], net=dict(t0=0.4, t1=2.9, from_=(0.80, 0.565), to=[(0.63,0.46),(0.42,0.40),(0.59,0.84),(0.60,0.91),(0.68,0.75),(0.78,0.35),(0.68,0.22),(0.52,0.62)]), kind='fans')], [L('UNA CONSPIRACIÓN', 'QUE CRUZA TODO LEONIDA', at=0.6)])
beat(P, 4, [c('01', 455.5, zoom=[1.02, 1.08])], [SH('MÁS QUE NUNCA', y=890, at=2.2)])
beat(P, 5, [c('00', 556.0, zoom=[1.0, 1.06])], [L('NO EMPIEZAN A LO GRANDE')])
beat(P, 6, [c('00', 507.0, **BLUR)], [Q('prensa', ['COCHES BARATOS Y', 'CERRADURAS BÁSICAS'], 'PREVIEW DE THE GUARDIAN · 14 NOV', x=130, y=330, highlight=True)])
beat(P, 7, [c('01', 129.0), c('01', 147.0)], [KW([['TIENDAS.', 0.0], ['GASOLINERAS.', 0.9, True]], size=120, top=740)], flash=True)
beat(P, 8, [c('01', 504.0), c('01', 522.0, zoom=[1.04, 1.1])], [L('COCHES CAROS Y BANCOS', 'HAY QUE GANÁRSELOS')], flash=True)
beat(P, 9, [c('01', 453.0, **BLUR)], [Q('prensa', ['"UNA PAREJA JOVEN CON LA', 'ESPALDA CONTRA LA PARED"'], 'ROB NELSON · THE GUARDIAN', x=130, y=330, highlight=True)])
beat(P, 10, [c('00', 361.5), c('00', 366.0, zoom=[1.0, 1.06])], [L('EXTENDED LOOK', 'LA PRESENTACIÓN DE ROCKSTAR', at=2.3)], cuts=[2.2])
beat(P, 11, [c('00', 369.0, zoom=[1.0, 1.06])], [ST('OJO', sub='PUEDE NO ESTAR EN ORDEN', size=120, rot=-6)])
beat(P, 12, [c('01', 494.0, zoom=[1.0, 1.06])], [Q('oficial', ['BOOBIE IKE'], 'LEYENDA DE VICE CITY · DUEÑO DEL JACK OF HEARTS', x=110, y=300)])
beat(P, 13, [c('00', 9.5), c('00', 225.0, zoom=[1.04, 1.12]), c('00', 246.5, zoom=[1.04, 1.1])], [L('ALGUIEN LES AVISA', at=2.2, dur=2.2)], cuts=[2.1, 4.3])
beat(P, 14, [c('00', 255.0, zoom=[1.04, 1.1], flash=True)], [KW([['NO', 0.0], ['ARRESTANDO.', 0.15]], size=120, top=760)])
beat(P, 15, [c('00', 292.0, zoom=[1.04, 1.1], flash=True)], [KW([['DISPARANDO.', 0.0, True]], size=150, top=740)])
beat(P, 16, [c('00', 297.5, zoom=[1.04, 1.12])], [B('¿MÉNDEZ?', 'UN AGENTE QUE LUCÍA PARECE CONOCER', size=170, span=2)])
beat(P, 17, None, [])
beat(P, 18, [c('00', 316.5, **BLUR)], [NT('¿MÉNDEZ?', 'GUÁRDATE ESTE NOMBRE', 'ph_cop', pos='50% 15%')])
beat(P, 19, [c('01', 33.0, zoom=[1.0, 1.06]), c('01', 90.0, zoom=[1.02, 1.08])], [L('CENA EN LA AZOTEA', 'CON BRIAN Y LORI')], cuts=[2.6])
beat(P, 20, [c('01', 250.0, zoom=[1.02, 1.08]), c('01', 283.5), c('01', 288.5), c('01', 375.0)], [NT('RAÚL BAUTISTA', 'ATRACADOR DE BANCOS VETERANO · BUSCA TALENTO', 'ph_raul', kind='oficial', dur=3.6)], cuts=[3.9, 5.3, 6.6], flash=True)
beat(P, 21, [c('02', 112.95, zoom=[1.0, 1.06]), c('02', 258.0), c('02', 276.0, zoom=[1.04, 1.1])], [L('MEGAMUNDO', 'SU PRIMERA SEDE EN AMÉRICA', dur=3.1), SH('LOS SEPARAN', y=890, at=5.6)], cuts=[3.1, 5.4], flash=True)
beat(P, 22, [c('02', 309.0, blur=14, dim=0.4)], [dict(type='board', title='RECAPITULANDO', center=dict(x=960, y=600, text='¿CONSPIRACIÓN?'), centerT=S(P, 26) - S(P, 22), items=[dict(photo=None, label='EL GOLPE', sub='UN GOLPE QUE SALE MAL', x=420, y=380, rot=-5, t=0.1), dict(photo='ph_cop', label='LA POLICÍA', sub='DISPARAN PRIMERO', x=1500, y=380, rot=4, t=S(P, 23) - S(P, 22), pos='50% 10%'), dict(photo='ph_lucia', label='¿MÉNDEZ?', sub='¿CONOCE A LUCÍA?', x=480, y=820, rot=3, t=S(P, 24) - S(P, 22)), dict(photo='ph_mega', label='MEGAMUNDO', sub='UNA EMPRESA GIGANTE', x=1440, y=820, rot=-3, t=S(P, 25) - S(P, 22))], span=5)], until=S(P, 27) - 0.08)
beat(P, 26, None, [])
_t0 = S(P, 12)
overlays.append(dict(type='timeline', t0=_t0 + 0.1, t1=S(P, 22) - 0.1, steps=[['EL ENCARGO', 0.0], ['LA REDADA', S(P, 13) - _t0], ['LA AZOTEA', S(P, 19) - _t0], ['EL GOLPE', S(P, 20) - _t0], ['MEGAMUNDO', S(P, 21) - _t0]]))
beat(P, 27, [c('01', 375.0, blur=8, dim=0.25)], [dict(type='meter', title='PERFIL CRIMINAL', left='PROFESIONAL', right='IRREDIMIBLE', at=0.3)])
beat(P, 28, [c('01', 303.0, **BLUR)], [Q('prensa', ['ELIGES QUÉ CRIMINAL ERES...', 'NO SI LO ERES'], 'REVISTA EDGE · OCT 2026', x=130, y=330, highlight=True)])
beat(P, 29, [c('02', 447.0, zoom=[1.0, 1.06]), c('02', 453.0, zoom=[1.02, 1.08])], [L('DEJAR EL CRIMEN', 'UN TEMA CENTRAL DE LA HISTORIA')])
beat(P, 30, [c('02', 450.8)], [SH('MÁS RDR2 QUE GTA V', y=880)], until=S('p7', 0) - 0.08)

# =============== PART 7 — TEORÍAS ===============
P = 'p7'
beat(P, 0, [c('02', 427.2, zoom=[1.0, 1.06])], [SEC('MIS TEORÍAS', 'SOBRE EL FINAL')])
beat(P, 1, [c('02', 438.0, zoom=[1.02, 1.08])], [ST('SOLO TEORÍAS', sub='NADA CONFIRMADO', size=110)])
beat(P, 2, [c('00', 247.0, blur=10, dim=0.3)], [TH(1, ['MÉNDEZ, EL', 'GRAN VILLANO'])])
beat(P, 3, [c('00', 297.0, zoom=[1.04, 1.1]), c('01', 465.0, zoom=[1.0, 1.06])], [L('¿UNA CONDENA LIMPIA?', '¿Y UNA SALIDA "POR SUERTE"?', at=0.4)], cuts=[3.4])
beat(P, 4, [c('02', 113.2, blur=10, dim=0.3)], [TH(2, ['MEGAMUNDO', 'ESTÁ DETRÁS'])])
beat(P, 5, [c('02', 258.5), c('02', 276.5, zoom=[1.04, 1.1])], [KW([['DEMASIADA', 0.0], ['CASUALIDAD', 0.2, True]], size=120, top=740, at=3.0)], cuts=[2.6], flash=True)
beat(P, 6, [c('01', 404.0, blur=10, dim=0.3)], [TH(3, ['EL FINAL', 'BONNIE Y CLYDE'])], until=S(P, 7) + 0.6)
beat(P, 7, [c('01', 300.5, zoom=[1.03, 1.1])], [SH('ACABARON FATAL', y=890, at=0.6)], lead=-0.6)
beat(P, 8, [c('02', 450.8), c('02', 426.8)], [L('ARTHUR MORGAN', 'RED DEAD REDEMPTION 2')], cuts=[2.6])
beat(P, 9, [c('01', 454.0, zoom=[1.02, 1.08])], [SH('¿UNO DE LOS DOS?', y=890)])
beat(P, 10, [c('01', 542.0, blur=10, dim=0.3)], [TH(4, ['EL FINAL', 'DEPENDE DE TI'])])
beat(P, 11, [c('00', 393.0, **BLUR)], [Q('oficial', ['"TUYA PARA MANTENERLA...', 'O PARA PERDERLA"'], 'ROB NELSON · REVISTA EDGE', x=130, y=330, highlight=True)])
beat(P, 12, [c('02', 91.0, zoom=[1.0, 1.06])], [L('¿VARIOS FINALES?', 'NI CONFIRMADO NI DESMENTIDO')])
beat(P, 13, [c('01', 538.0, zoom=[1.0, 1.08])], [KW([['¿Y', 0.0], ['TÚ', 0.12], ['QUÉ', 0.24], ['CREES?', 0.36, True]], size=140, dim=True)], until=S(P, 15) - 0.08)
beat(P, 14, None, [B('¿SOBREVIVEN LOS DOS?', size=120)])
beat(P, 15, [c('01', 457.5, zoom=[1.06, 1.12])], [L('DÉJAMELO EN COMENTARIOS')], until=S('p8', 0) - 0.08)

# =============== PART 8 — CIERRE ===============
P = 'p8'
beat(P, 0, [c('02', 450.8), c('02', 427.0)], [L('JASON Y LUCÍA', 'TODO LO QUE SABEMOS')], cuts=[2.4])
beat(P, 1, [SPLIT(dict(p='01', s=236.8, name='JASON', role='UN EX MILITAR', at=0.0, origin='38% 40%', scale=1.15, shift=-120), dict(p='01', s=481.0, name='LUCÍA', role='UNA LUCHADORA', at=S(P, 2) - S(P, 1), scale=1.12, shift=60))], [], until=S(P, 3) - 0.08)
beat(P, 2, None, [])
beat(P, 3, [MAP(CON, cam=[[0, 0.62, 0.53, 0.78], [3.2, 0.7, 0.56, 0.5]], net=dict(t0=0.1, t1=1.6, from_=(0.80, 0.565), to=[(0.63,0.46),(0.42,0.40),(0.59,0.84),(0.68,0.75),(0.78,0.35),(0.52,0.62)]))], [SH('UNA CONSPIRACIÓN', y=890)])
beat(P, 4, [c('01', 432.0, zoom=[1.0, 1.06])], [ST('19 NOV', sub='POR FIN LOS CONOCEMOS', size=170, rot=-4)])
beat(P, 5, [c('01', 197.0, zoom=[1.0, 1.06])], [B('LO VOY A COMPROBAR TODO', 'CUANDO SALGA EL JUEGO', size=110)])
beat(P, 6, None, [dict(type='subscribe', at=0.0)], until=S(P, 7) - 0.08)
overlays.append(dict(type='endcard', t0=S(P, 7) - 0.08, t1=END))
sfx += [{'t': S(P, 7) - 0.08, 'src': 's_sub', 'vol': .35}]

# ---------- music: beds with crossfades; ducked under the voice, swell on the title + ending ----------
music = [dict(src='music/bed.mp3', t0=0, t1=END, off=22.24)]
swells = [[starts['p1'] + A['p1']['sents'][9]['t'] - 0.3, title_at + TITLE_LEN], [S('p8', 7) - 0.3, END]]
voice = [dict(src=f'vo/{k}.wav', at=starts[k]) for k in starts]
J = dict(end=round(END, 3), title_at=title_at, voice=voice, music=music, swells=swells, video=video, overlays=overlays, sfx=[x for x in sfx if x['t'] >= 0], starts=starts)
json.dump(J, open(os.path.join(HERE, '..', 'src', 'beats.json'), 'w'), ensure_ascii=False, indent=0)
print('END', round(END, 2), 'video segs', len(video), 'overlays', len(overlays), 'sfx', len(sfx))
# sanity: gaps/overlaps in video
v = sorted(video, key=lambda x: x['t0'])
for a, b in zip(v, v[1:]):
    if b['t0'] - a['t1'] > 0.05 or a['t1'] - b['t0'] > 0.05: print('gap/overlap', a['t1'], b['t0'])
print('first', v[0]['t0'], 'last', v[-1]['t1'])

# ---------- post: contiguity, source-shot fitting, de-duplication ----------
import bisect
XF = 0.2
def load_cuts(part):
    raw = []
    for fn in (f'scenesL_{part}.txt', f'scenes_{part}.txt'):
        fp = os.path.join(HERE, fn)
        if os.path.exists(fp): raw += [float(x) for x in open(fp).read().split()]
    raw.sort(); out = []
    for x in raw:
        if not out or x - out[-1] > 0.25: out.append(x)
    return out
CUTS = {k: load_cuts(k) for k in ('00', '01', '02')}
DUR = {'00': 560.04, '01': 560.0, '02': 490.04}
def shot_of(p, t):
    c = CUTS[p]; i = bisect.bisect_right(c, t)
    a = c[i - 1] if i > 0 else 0.0
    b = c[i] if i < len(c) else DUR[p]
    return a, b, i

v = sorted(video, key=lambda x: x['t0'])
for a, b in zip(v, v[1:]): a['t1'] = b['t0']
v[-1]['t1'] = END
plain = lambda x: 'p' in x and 'map' not in x and 'split' not in x

# 1) merge neighbours that show the same original shot (or nearly continuous footage)
changed = True
while changed:
    changed = False
    for k in range(len(v) - 1):
        a, b = v[k], v[k + 1]
        if plain(a) and plain(b) and a['p'] == b['p'] and not b.get('cold'):
            sa = shot_of(a['p'], a['s'])[2]; sb = shot_of(b['p'], b['s'])[2]
            near = abs(b['s'] - (a['s'] + (a['t1'] - a['t0']))) < 2.5
            if sa == sb or near:
                a['t1'] = b['t1']; v.pop(k + 1); changed = True; break
# 2) absorb very short leftovers (not intentional fast cuts) into the previous shot
changed = True
while changed:
    changed = False
    for k in range(1, len(v)):
        x = v[k]
        if x['t1'] - x['t0'] < 1.0 and not x.get('flash') and not x.get('cold'):
            v[k - 1]['t1'] = x['t1']; v.pop(k); changed = True; break

# 3) fit every footage segment inside one original shot (incl. the dissolve pre-roll)
report = []
def fit(x, L, pre=XF):
    a, b, i = shot_of(x['p'], x['s'])
    need = L + pre + 0.08
    if b - a >= need:
        x['s'] = round(min(max(x['s'], a + pre + 0.04), b - 0.04 - L), 3); x.pop('rate', None); return
    # (b) let the trailer's own edit happen once, but only if both pieces are long (>= 1.4 s)
    first = min(b - (a + pre + 0.04), L - 1.4)
    if first >= 1.4:
        nb = shot_of(x['p'], b + 0.05)[1]
        if nb - b >= L - first + 0.1:
            x['s'] = round(b - first, 3); x.pop('rate', None); report.append(('natural-cut', x['p'], x['s'])); return
    # (c) slow down slightly to fill the slot inside the shot
    r = (b - a - pre - 0.1) / L
    if r >= 0.72:
        x['s'] = round(a + pre + 0.04, 3); x['rate'] = round(r, 3); report.append(('slowed', x['p'], x['s'], round(r, 2))); return
    # (d) find a nearby long-enough shot (same scene, a few seconds away)
    for d in sorted(range(-6, 7), key=abs):
        aa, bb, _ = shot_of(x['p'], x['s'] + d)
        if bb - aa >= need:
            x['s'] = round(max(aa + pre + 0.04, min(x['s'] + d, bb - 0.04 - L)), 3); x.pop('rate', None); report.append(('moved', x['p'], round(d, 1))); return
    x['s'] = round(a + pre + 0.04, 3); x['rate'] = 0.72; report.append(('forced', x['p'], x['s']))
for x in v:
    L = x['t1'] - x['t0']
    if plain(x):
        fit(x, L, 0 if x.get('flash') or x.get('cold') else XF)
    elif 'split' in x:
        for side in x['split']:
            fit(side, L, 0)
print('fit report', report)

# 3b) hand-picked replacements after visual QA (avoid internal cuts, title cards, black frames
#     and re-using the same Lucía gym shot over and over). Keyed by segment start.
OVR = {
    4.25:  ('side', 1, dict(p='01', s=479.78, rate=0.95)),
    23.8:  ('plain', None, dict(p='00', s=391.3)),
    47.5:  ('plain', None, dict(p='01', s=370.0)),
    130.1: ('plain', None, dict(p='01', s=231.2)),
    144.8: ('plain', None, dict(p='01', s=288.0)),
    199.8: ('side', 1, dict(p='01', s=533.25)),
    240.8: ('plain', None, dict(p='01', s=460.95)),
    258.7: ('plain', None, dict(p='01', s=511.3)),
    315.6: ('plain', None, dict(p='01', s=362.0)),
    392.9: ('plain', None, dict(p='02', s=32.45)),
    454.1: ('side', 1, dict(p='01', s=460.8)),
    84.77: ('plain', None, dict(p='00', s=171.0)),
    377.39: ('plain', None, dict(p='01', s=395.0)),
    398.51: ('plain', None, dict(p='02', s=9.2)),
    444.39: ('plain', None, dict(p='01', s=495.0)),
}
for x in v:
    key = round(x['t0'], 1)
    for k_, (kind, i_, d_) in OVR.items():
        if abs(k_ - x['t0']) < 0.08:
            tgt = x['split'][i_] if kind == 'side' else x
            tgt.pop('rate', None); tgt.update(d_)
            print('override', key, kind, d_)

# 4) warn about the same source shot reappearing within 20 s
seen = []
for x in v:
    if plain(x):
        sid = (x['p'], shot_of(x['p'], x['s'])[2])
        for (t, q) in seen:
            if q == sid and x['t0'] - t < 20: print('repeat within 20s', x['t0'], sid)
        seen.append((x['t0'], sid))

# ---------- clips: one pre-cut file per shot / split side ----------
cuts_list = []
def mk(p, s0, L, rate=1.0, pre=XF):
    st = max(0.0, s0 - pre)
    d = round(L * rate + pre + 0.3, 3)
    name = f"{p}_{int(round(st*1000))}_{int(round(d*100))}.mp4"
    cuts_list.append({'name': name, 'p': p, 'start': round(st, 3), 'dur': d})
    return name
for x in v:
    L = x['t1'] - x['t0']
    if plain(x):
        pre = 0 if x.get('flash') or x.get('cold') else XF
        x['clip'] = mk(x['p'], x['s'], L, x.get('rate', 1.0), pre)
        x['pre'] = pre
    elif 'split' in x:
        for side in x['split']:
            side['clip'] = mk(side['p'], side['s'], L, side.get('rate', 1.0), 0)
J['video'] = v
J['cold'] = COLD
seenn = set(); cl = []
for c_ in cuts_list:
    if c_['name'] not in seenn: seenn.add(c_['name']); cl.append(c_)
json.dump(J, open(os.path.join(HERE, '..', 'src', 'beats.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(cl, open(os.path.join(HERE, 'cuts.json'), 'w'), indent=0)
lens = [round(x['t1'] - x['t0'], 2) for x in v]
print('segments', len(v), 'min', min(lens), 'max', max(lens), 'clips', len(cl), 'END', END)
