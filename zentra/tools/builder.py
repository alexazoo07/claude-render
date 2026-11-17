import json
import os
HERE = os.path.dirname(os.path.abspath(__file__))
A = json.load(open(os.path.join(HERE, 'align.json')))
GAP = 0.6
TITLE_LEN = 3.8
# ---------- global placement of the voice parts ----------
starts = {}
t = 0.0
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

# =============== PART 1 — HOOK ===============
P = 'p1'
s = lambda i: S(P, i)
beat(P, 0, [c('01', 454.8, zoom=[1, 1.05]), c('01', 230.7, zoom=[1.04, 1.1])], [B('19 NOV', 'GTA VI · DÍA DEL LANZAMIENTO', size=210, at=0.2, dur=1.95), L('JASON Y LUCÍA', 'LOS DOS PROTAGONISTAS', at=2.3)], cuts=[1.85])
sfx.append({'t': starts[P] + 1.85 - 0.2, 'src': 's_cut', 'vol': .35})
beat(P, 1, [c('01', 171.15, zoom=[1, 1.06], origin='60% 35%')], [dict(type='rec', box=[985, 165, 410, 470], tag='LUCÍA · RECIÉN SALIDA DE PRISIÓN', at=0.1)])
sfx.append({'t': s(1), 'src': 's_pop', 'vol': .3})
beat(P, 2, [c('01', 236.2, zoom=[1.12, 1.22], origin='38% 38%')], [L('JASON DUVAL', 'EX MILITAR · TRABAJA PARA NARCOS EN LOS KEYS', at=0.15)])
beat(P, 3, [c('01', 156.6), c('01', 159.0, zoom=[1.02, 1.08])], [BD('1ª', 'MUJER PROTAGONISTA DE LA SAGA', x=1420, y=330, size=150, at=0.5, span=2)], cuts=[2.4], until=S(P, 5) - 0.08)
beat(P, 4, None, [SH('¡HISTÓRICO!', y=900, size=130)])
beat(P, 5, [c('00', 388.0, **BLUR), c('00', 391.5, zoom=[1.03, 1.1])], [Q('prensa', ['LOS BONNIE Y CLYDE', 'DE LEONIDA'], 'ASÍ LOS DESCRIBE LA PRENSA', x=120, y=300, highlight=True, dur=2.3), B('¿QUÉ SABEMOS?', 'DE VERDAD', size=170, at=2.68)], cuts=[2.62])
# montage of the four topics (sub-clause times from the pauses)
b6 = s(6); sub = [b6, starts[P] + 19.5, starts[P] + 22.6, starts[P] + 25.7, starts[P] + 29.15, s(7) - 0.08]
video += [dict(c('01', 194.0), t0=b6 - 0.08, t1=sub[1]), dict(c('01', 480.0, rate=0.85, zoom=[1.02, 1.1]), t0=sub[1], t1=sub[2]),
          dict(c('01', 150.0), t0=sub[2], t1=sub[2] + 0.85), dict(c('01', 283.0, zoom=[1.04, 1.1], flash=True), t0=sub[2] + 0.85, t1=sub[2] + 1.75),
          dict(c('01', 287.5, zoom=[1.04, 1.1], flash=True), t0=sub[2] + 1.75, t1=sub[3]), dict(c('01', 516.0), t0=sub[3], t1=sub[4]),
          dict(c('01', 522.0, zoom=[1.06, 1.14], flash=True), t0=sub[4], t1=sub[5])]
for a, txt, sb in [(sub[0], 'QUIÉN ES JASON', 'SU PASADO Y SUS CONTACTOS'), (sub[1], 'LA CÁRCEL DE LUCÍA', 'PENITENCIARÍA DE LEONIDA'), (sub[2], 'EL GOLPE QUE SALE MAL', 'Y UNA CONSPIRACIÓN EN TODO LEONIDA'), (sub[3], 'CUENTA COMPARTIDA', 'CON TU PAREJA CRIMINAL')]:
    overlays.append(dict(type='label', text=txt, sub=sb, t0=a + 0.05, t1=sub[sub.index(a) + 1] - 0.02, size=104 if len(txt) > 18 else 118))
    sfx.append({'t': a - 0.06, 'src': text_sfx(), 'vol': .3})
overlays.append(dict(type='shout', text='¿QUÉ PODRÍA SALIR MAL?', y=540, size=110, t0=sub[4] + 0.05, t1=sub[5]))
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
beat(P, 1, [c('01', 236.0, zoom=[1.12, 1.2], origin='38% 38%')], [SEC('JASON DUVAL', 'EL QUE SOLO QUERÍA UNA VIDA FÁCIL', span=1)])
beat(P, 2, [c('00', 432.0, **BLUR)], [Q('oficial', ['QUIERE UNA VIDA FÁCIL,', 'PERO TODO SE COMPLICA'], 'ROCKSTAR GAMES · BIOGRAFÍA OFICIAL', x=130, y=330, highlight=True)])
beat(P, 3, [c('00', 18.0, zoom=[1.0, 1.06])], [L('ESTAFADORES Y DELINCUENTES', 'ASÍ CRECIÓ JASON', size=100)])
beat(P, 4, [c('00', 291.0), c('00', 294.0, zoom=[1.04, 1.1])], [SH('NO SALIÓ BIEN', y=900, at=2.4)], flash=True)
beat(P, 5, [c('01', 236.4, zoom=[1.12, 1.2], origin='38% 38%')], [Q('oficial', ['"ME METÍ EN PROBLEMAS', 'EN EL EJÉRCITO"'], 'JASON · TRÁILER DE LANZAMIENTO', x=1000, y=260, tilt=1.6)])
beat(P, 6, [c('00', 555.5, zoom=[1.0, 1.06])], [L('NI PRÉSTAMOS NI NADA', '"A LA GENTE COMO YO"')])
beat(P, 7, [MAP(YAN, cam=[[0, 0.5, 0.53, 1.95], [2.8, 0.44, 0.84, 0.62], [6.0, 0.43, 0.85, 0.52]], paths=[dict(t0=2.4, t1=4.2, pts=[(0.62,0.765),(0.595,0.80),(0.555,0.84),(0.50,0.875),(0.43,0.90),(0.36,0.905),(0.29,0.90),(0.24,0.885)])], pins=[dict(t=2.3, x=0.47, y=0.865, label='LEONIDA KEYS', sub='AQUÍ TRABAJA JASON PARA LOS NARCOS', big=True)], kind='fans')], [])
beat(P, 8, [c('01', 476.5, zoom=[1.04, 1.1])], [B('¿Y DÓNDE VIVE?', size=160)])
beat(P, 9, [c('00', 437.0, zoom=[1.0, 1.06])], [SH('NI SIQUIERA ES SUYA', y=880)])
beat(P, 10, [c('01', 116.0, zoom=[1.0, 1.06]), c('01', 93.0, zoom=[1.02, 1.08])], [Q('oficial', ['BRIAN HEDER'], 'NARCO DE LA VIEJA ESCUELA · ASTILLERO EN LOS KEYS', x=110, y=300, dur=3.6), L('LORI', 'SU TERCERA ESPOSA', at=4.3)], cuts=[4.1])
beat(P, 11, [c('01', 99.0, zoom=[1.0, 1.05]), c('01', 103.5, zoom=[1.03, 1.08])], [BD('0 $', 'DE ALQUILER', x=1450, y=300, size=130, at=0.6, dur=3.6), L('+ LA SANGRÍA DE LORI', 'DE VEZ EN CUANDO', at=4.6)], cuts=[4.3])
beat(P, 12, [c('01', 106.0, zoom=[1.04, 1.1])], [SH('¿UN TRATO JUSTO?', y=880)])
beat(P, 13, [c('02', 24.7, zoom=[1.0, 1.06])], [Q('oficial', ['CAL HAMPTON'], 'EL MEJOR AMIGO DE JASON', x=110, y=300)])
beat(P, 14, [c('02', 25.6, zoom=[1.06, 1.12]), c('01', 471.5, zoom=[1.0, 1.05])], [L('RADIO DE LA GUARDIA COSTERA', '+ CERVEZAS + PESTAÑAS PRIVADAS', size=96)], cuts=[3.6])
beat(P, 15, [c('02', 26.5, zoom=[1.14, 1.2])], [SH('SÍ.', y=540, size=150)])
beat(P, 16, None, [SH('ESAS PESTAÑAS.', y=540, size=140, color='#ff3d86')])
beat(P, 17, [c('01', 483.2, **BLUR)], [Q('oficial', ['FELIZ EN LA MAREA BAJA', 'DE AMÉRICA'], 'ROCKSTAR GAMES · SOBRE CAL', x=130, y=330, highlight=True)])
beat(P, 18, [c('01', 186.0, zoom=[1.0, 1.06])], [L('PLANES MÁS GRANDES')])
beat(P, 19, [c('01', 450.0, zoom=[1.02, 1.08])], [])
beat(P, 20, [c('01', 455.0, **BLUR)], [Q('oficial', ['CONOCER A LUCÍA PUEDE SER', 'LO MEJOR... O LO PEOR'], 'ROCKSTAR GAMES · BIOGRAFÍA DE JASON', x=130, y=330, highlight=True)], until=S('p4', 0) - 0.08)

# =============== PART 4 — LUCÍA ===============
P = 'p4'
beat(P, 0, [c('01', 135.0, zoom=[1.03, 1.1])], [])
beat(P, 1, [c('01', 171.3, rate=0.75, zoom=[1.04, 1.12], origin='60% 35%')], [SEC('LUCÍA CAMINOS', 'LA LUCHADORA', span=1)])
beat(P, 2, [c('01', 480.0, rate=0.7, **BLUR)], [Q('oficial', ['SU PADRE LE ENSEÑÓ A PELEAR', 'EN CUANTO APRENDIÓ A CAMINAR'], 'ROCKSTAR GAMES · BIOGRAFÍA OFICIAL', x=130, y=330, highlight=True)])
beat(P, 3, [c('01', 400.0, zoom=[1.0, 1.06]), c('01', 404.5, zoom=[1.04, 1.1])], [SH('GOLPE TRAS GOLPE', y=890, at=1.5)], flash=True)
beat(P, 4, [MAP(YAN, cam=[[0, 0.6, 0.16, 1.15], [3.3, 0.66, 0.47, 0.72]], paths=[dict(t0=0.25, t1=2.6, pts=[(0.55,-0.04),(0.62,0.04),(0.70,0.14),(0.77,0.27),(0.76,0.38),(0.70,0.47),(0.68,0.51)])], pins=[dict(t=0.15, x=0.56, y=0.02, label='LIBERTY CITY', sub='EL NUEVA YORK DE GTA · MUY AL NORTE', big=True), dict(t=2.55, x=0.68, y=0.515, label='VICE CITY', sub='SU NUEVA VIDA EN LEONIDA')], kind='oficial')], [])
beat(P, 5, [c('01', 30.0, **BLUR)], [Q('oficial', ['LA BUENA VIDA CON LA QUE', 'SU MADRE SOÑABA'], 'ROCKSTAR GAMES · BIOGRAFÍA DE LUCÍA', x=130, y=330, highlight=True)])
beat(P, 6, [c('00', 297.0, zoom=[1.02, 1.08])], [B('¿POR QUÉ ACABÓ EN LA CÁRCEL?', size=100)])
beat(P, 7, [c('01', 405.0, **BLUR)], [Q('oficial', ['LUCHAR POR SU FAMILIA', 'LA LLEVÓ A PRISIÓN'], 'ROCKSTAR GAMES · PENITENCIARÍA DE LEONIDA', x=130, y=330, highlight=True)])
beat(P, 8, [c('01', 157.0, zoom=[1.04, 1.12], origin='35% 30%')], [B('¿QUÉ HIZO?', size=170)])
beat(P, 9, None, [SH('NO LO SABEMOS', y=880, color='#ff3d86')])
beat(P, 10, [c('01', 463.0, zoom=[1.0, 1.06])], [B('¿CÓMO SALIÓ?', size=170)])
beat(P, 11, [c('01', 466.0, zoom=[1.03, 1.08])], [BD('SUERTE', 'SEGÚN ROCKSTAR', x=960, y=480, size=140, at=0.25)])
beat(P, 12, [c('01', 452.0, zoom=[1.02, 1.08])], [])
beat(P, 13, None, [SH('SOSPECHOSO...', y=880)])
beat(P, 14, [c('00', 9.0, **BLUR)], [Q('oficial', ['LUCÍA, VESTIDA DE PRESA,', 'CON SU TRABAJADORA SOCIAL'], 'TRÁILER 1 · DICIEMBRE 2023', x=130, y=330)])
beat(P, 15, [c('01', 537.0, zoom=[1.0, 1.06])], [])
beat(P, 16, [c('01', 135.0, **BLUR)], [dict(type='panel', title='LUCÍA, LA PRIMERA', rows=['VOZ PROPIA', 'PASADO PROPIO', 'PESO REAL EN LOS DIÁLOGOS'], times=[1.6, 2.8, 4.2])])
beat(P, 17, [c('01', 522.0, **BLUR)], [Q('prensa', ['VA A POR LO QUE QUIERE', 'Y EMPUJA HASTA CONSEGUIRLO'], 'REVISTA LOVE · ROCKSTAR GAMES', x=130, y=330, highlight=True)])
beat(P, 18, [c('00', 183.0, zoom=[1.03, 1.1])], [L('JASON', 'REACCIONA A LO QUE LE PASA')])
beat(P, 19, [c('01', 157.8, zoom=[1.06, 1.12], origin='35% 30%')], [SH('ELLA DECIDE', y=880)])
beat(P, 20, [c('01', 239.0, zoom=[1.12, 1.18], origin='38% 38%')], [SH('ÉL SE DEJA LLEVAR', y=880)])
beat(P, 21, [c('00', 316.0, **BLUR), c('01', 456.0, zoom=[1.02, 1.08])], [Q('oficial', ['"VULNERABLES, DUROS,', 'IMPERFECTOS"'], 'ELIZABETH GAUVEY-KERN · GUIONISTA DE ROCKSTAR', x=130, y=330, dur=4.6)], cuts=[4.7], until=S('p5', 0) - 0.08)

# =============== PART 5 — LA PAREJA ===============
P = 'p5'
beat(P, 0, [c('01', 540.0, zoom=[1.0, 1.06])], [B('¿QUÉ SON?', size=170)])
beat(P, 1, [c('00', 392.0, zoom=[1.02, 1.08])], [SH('PAREJA', y=880)])
beat(P, 2, [c('00', 208.0, zoom=[1.04, 1.1])], [SH('CON HISTORIA', y=880, color='#ff3d86')])
beat(P, 3, [c('01', 231.0, **BLUR)], [Q('oficial', ['"QUIEREN DARLE OTRA', 'OPORTUNIDAD A LO SUYO"'], 'ROB NELSON · ROCKSTAR NORTH · REVISTA EDGE', x=130, y=330, highlight=True)])
beat(P, 4, [c('01', 241.5, zoom=[1.04, 1.1])], [B('OTRA OPORTUNIDAD', size=150, span=2)])
beat(P, 5, None, [])
beat(P, 6, [c('00', 388.0, **BLUR)], [Q('fans', ['¿SON EX QUE VUELVEN?'], 'TEORÍA DE LA COMUNIDAD · NO CONFIRMADO', x=130, y=360)])
beat(P, 7, [c('01', 541.0, zoom=[1.02, 1.08])], [L('ES UNA MECÁNICA')])
beat(P, 8, [c('01', 483.0), c('01', 485.9, rate=0.9), c('01', 480.5), c('01', 456.0)], [dict(type='scale', label='CERCANÍA', at=0.3)], flash=True)
beat(P, 9, [c('01', 239.2, zoom=[1.12, 1.18], origin='38% 38%'), c('01', 171.4, rate=0.8, zoom=[1.02, 1.08], origin='60% 35%')], [L('CAMBIA ENTRE LOS DOS', 'CUANDO LA HISTORIA LO PERMITE')], flash=True)
beat(P, 10, [c('00', 317.0, **BLUR)], [Q('previews', ['PUEDEN ROMPER...', 'PERO SIGUEN SIENDO SOCIOS'], 'PREVIEWS · ROB NELSON', x=130, y=330, highlight=True)])
beat(P, 11, [c('01', 160.0, zoom=[1.02, 1.08])], [SH('EL ATRACO SIGUE EN PIE', y=890)])
beat(P, 12, [c('01', 510.0, zoom=[1.0, 1.06])], [BD('$', 'FINANZAS COMPARTIDAS', x=1450, y=320, size=150, at=0.5)])
beat(P, 13, [c('01', 534.0, zoom=[1.0, 1.06])], [L('CUENTA COMPARTIDA', 'CON TU PAREJA CRIMINAL')])
beat(P, 14, [c('01', 405.0, zoom=[1.04, 1.1])], [SH('¿QUÉ PODRÍA SALIR MAL?', y=540, size=110)])
beat(P, 15, [c('01', 384.0, zoom=[1.0, 1.06])], [dict(type='rec', box=[760, 300, 400, 300], tag='SOSPECHOSOS · HOMBRE Y MUJER', at=0.2)])
sfx.append({'t': S(P, 15) + 0.2, 'src': 's_pop', 'vol': .3})
beat(P, 16, [c('01', 453.0, zoom=[1.02, 1.08])], [B('¿ROMÁNTICO?', size=170)])
beat(P, 17, None, [SH('NO.', y=880, size=150)])
beat(P, 18, [c('01', 300.0, zoom=[1.03, 1.1])], [B('¿EFECTIVO?', size=170)])
beat(P, 19, None, [SH('MUCHÍSIMO', y=880, color='#ff3d86')], until=S('p6', 0) - 0.08)

# =============== PART 6 — LA HISTORIA ===============
P = 'p6'
beat(P, 0, [MAP(YAN, cam=[[0, 0.62, 0.52, 0.9], [3.5, 0.55, 0.52, 1.5]]), c('01', 423.0, **BLUR)], [SEC('LA HISTORIA', 'LO QUE SABEMOS DEL ARGUMENTO', dur=2.4)], cuts=[S(P, 1) - S(P, 0) + 1.25], until=S(P, 2) - 0.08)
beat(P, 1, None, [Q('oficial', ['LA BARAJA ESTÁ TRUCADA', 'EN SU CONTRA'], 'ROCKSTAR GAMES · SINOPSIS OFICIAL', x=130, y=330, highlight=True, at=1.35)])
beat(P, 2, [c('02', 451.0, rate=0.9), c('02', 426.8, rate=0.9)], [B('EL LADO MÁS OSCURO', 'DEL LUGAR MÁS SOLEADO DE AMÉRICA', size=130, at=2.2)], cuts=[2.6])
beat(P, 3, [MAP(CON, cam=[[0, 0.72, 0.55, 0.45], [4.2, 0.6, 0.52, 0.8]], net=dict(t0=0.4, t1=2.9, from_=(0.80, 0.565), to=[(0.63,0.46),(0.42,0.40),(0.59,0.84),(0.60,0.91),(0.68,0.75),(0.78,0.35),(0.68,0.22),(0.52,0.62)]), kind='fans')], [L('UNA CONSPIRACIÓN', 'QUE CRUZA TODO LEONIDA', at=0.6)])
beat(P, 4, [c('01', 455.5, zoom=[1.02, 1.08])], [SH('MÁS QUE NUNCA', y=890, at=2.2)])
beat(P, 5, [c('00', 556.0, zoom=[1.0, 1.06])], [L('NO EMPIEZAN A LO GRANDE')])
beat(P, 6, [c('00', 507.0, **BLUR)], [Q('prensa', ['COCHES BARATOS Y', 'CERRADURAS BÁSICAS'], 'PREVIEW DE THE GUARDIAN · 14 NOV', x=130, y=330, highlight=True)])
beat(P, 7, [c('01', 129.0), c('01', 147.0)], [L('TIENDAS · GASOLINERAS')], flash=True)
beat(P, 8, [c('01', 504.0), c('01', 522.0, zoom=[1.04, 1.1])], [L('COCHES CAROS Y BANCOS', 'HAY QUE GANÁRSELOS')], flash=True)
beat(P, 9, [c('01', 453.0, **BLUR)], [Q('prensa', ['"UNA PAREJA JOVEN CON LA', 'ESPALDA CONTRA LA PARED"'], 'ROB NELSON · THE GUARDIAN', x=130, y=330, highlight=True)])
beat(P, 10, [c('00', 361.5), c('00', 366.0, zoom=[1.0, 1.06])], [L('EXTENDED LOOK', 'LA PRESENTACIÓN DE ROCKSTAR', at=2.3)], cuts=[2.2])
beat(P, 11, [c('00', 369.0, zoom=[1.0, 1.06])], [L('OJO', 'PUEDE NO ESTAR EN ORDEN CRONOLÓGICO')])
beat(P, 12, [c('01', 494.0, zoom=[1.0, 1.06]), c('01', 497.0, zoom=[1.03, 1.08])], [Q('oficial', ['BOOBIE IKE'], 'LEYENDA DE VICE CITY · DUEÑO DEL JACK OF HEARTS', x=110, y=300)], cuts=[3.8])
beat(P, 13, [c('00', 9.5), c('00', 225.0, zoom=[1.04, 1.12]), c('00', 246.5, zoom=[1.04, 1.1])], [L('ALGUIEN LES AVISA', at=2.2, dur=2.2)], cuts=[2.1, 4.3])
beat(P, 14, [c('00', 255.0, zoom=[1.04, 1.1], flash=True)], [SH('NO ARRESTANDO', y=890)])
beat(P, 15, [c('00', 292.0, zoom=[1.04, 1.1], flash=True)], [SH('DISPARANDO', y=890, color='#ff3d86')])
beat(P, 16, [c('00', 297.5, zoom=[1.04, 1.12])], [B('¿MÉNDEZ?', 'UN AGENTE QUE LUCÍA PARECE CONOCER', size=170, span=2)])
beat(P, 17, None, [])
beat(P, 18, [c('00', 316.5, **BLUR)], [BD('MÉNDEZ', 'GUÁRDATE ESTE NOMBRE', x=960, y=500, size=130)])
beat(P, 19, [c('01', 33.0, zoom=[1.0, 1.06]), c('01', 90.0, zoom=[1.02, 1.08])], [L('CENA EN LA AZOTEA', 'CON BRIAN Y LORI')], cuts=[2.6])
beat(P, 20, [c('01', 250.0, zoom=[1.02, 1.08]), c('01', 283.5), c('01', 288.5), c('01', 375.0)], [Q('oficial', ['RAÚL BAUTISTA'], 'ATRACADOR DE BANCOS VETERANO · SIEMPRE BUSCA TALENTO', x=110, y=300, dur=3.6)], cuts=[3.9, 5.3, 6.6], flash=True)
beat(P, 21, [c('02', 112.95, zoom=[1.0, 1.06]), c('02', 258.0), c('02', 276.0, zoom=[1.04, 1.1])], [L('MEGAMUNDO', 'SU PRIMERA SEDE EN AMÉRICA', dur=3.1), SH('LOS SEPARAN', y=890, at=5.6)], cuts=[3.1, 5.4], flash=True)
beat(P, 22, [c('02', 309.0, **BLUR)], [dict(type='panel', title='RECAPITULANDO', rows=['UN GOLPE QUE SALE MAL', 'POLICÍAS QUE DISPARAN PRIMERO', 'UN AGENTE QUE QUIZÁ CONOCE A LUCÍA', 'UNA EMPRESA GIGANTE EN MEDIO'],
                                                 times=[0.2, S(P, 23) - S(P, 22), S(P, 24) - S(P, 22), S(P, 25) - S(P, 22)], span=4)], until=S(P, 26) - 0.08)
beat(P, 26, [c('02', 282.0, zoom=[1.04, 1.1])], [B('CONSPIRACIÓN', size=170, color='#ff3d86')])
beat(P, 27, [c('01', 375.0, blur=8, dim=0.25)], [dict(type='meter', title='PERFIL CRIMINAL', left='PROFESIONAL', right='IRREDIMIBLE', at=0.3)])
beat(P, 28, [c('01', 303.0, **BLUR)], [Q('prensa', ['ELIGES QUÉ CRIMINAL ERES...', 'NO SI LO ERES'], 'REVISTA EDGE · OCT 2026', x=130, y=330, highlight=True)])
beat(P, 29, [c('02', 447.0, zoom=[1.0, 1.06]), c('02', 453.0, zoom=[1.02, 1.08])], [L('DEJAR EL CRIMEN', 'UN TEMA CENTRAL DE LA HISTORIA')])
beat(P, 30, [c('02', 450.8)], [SH('MÁS RDR2 QUE GTA V', y=880)], until=S('p7', 0) - 0.08)

# =============== PART 7 — TEORÍAS ===============
P = 'p7'
beat(P, 0, [c('02', 427.2, zoom=[1.0, 1.06])], [SEC('MIS TEORÍAS', 'SOBRE EL FINAL')])
beat(P, 1, [c('02', 438.0, zoom=[1.02, 1.08])], [BD('TEORÍA', 'NADA CONFIRMADO', x=960, y=500, size=120)])
beat(P, 2, [c('00', 247.0, blur=10, dim=0.3)], [TH(1, ['MÉNDEZ, EL', 'GRAN VILLANO'])])
beat(P, 3, [c('00', 297.0, zoom=[1.04, 1.1]), c('01', 465.0, zoom=[1.0, 1.06])], [L('¿UNA CONDENA LIMPIA?', '¿Y UNA SALIDA "POR SUERTE"?', at=0.4)], cuts=[3.4])
beat(P, 4, [c('02', 113.2, blur=10, dim=0.3)], [TH(2, ['MEGAMUNDO', 'ESTÁ DETRÁS'])])
beat(P, 5, [c('02', 258.5), c('02', 276.5, zoom=[1.04, 1.1])], [SH('DEMASIADA CASUALIDAD', y=890, at=3.0)], cuts=[2.6], flash=True)
beat(P, 6, [c('01', 404.0, blur=10, dim=0.3)], [TH(3, ['EL FINAL', 'BONNIE Y CLYDE'])], until=S(P, 7) + 0.6)
beat(P, 7, [c('01', 300.5, zoom=[1.03, 1.1])], [SH('ACABARON FATAL', y=890, at=0.6)], lead=-0.6)
beat(P, 8, [c('02', 450.8), c('02', 426.8)], [L('ARTHUR MORGAN', 'RED DEAD REDEMPTION 2')], cuts=[2.6])
beat(P, 9, [c('01', 454.0, zoom=[1.02, 1.08])], [SH('¿UNO DE LOS DOS?', y=890)])
beat(P, 10, [c('01', 542.0, blur=10, dim=0.3)], [TH(4, ['EL FINAL', 'DEPENDE DE TI'])])
beat(P, 11, [c('00', 393.0, **BLUR)], [Q('oficial', ['"TUYA PARA MANTENERLA...', 'O PARA PERDERLA"'], 'ROB NELSON · REVISTA EDGE', x=130, y=330, highlight=True)])
beat(P, 12, [c('02', 91.0, zoom=[1.0, 1.06])], [L('¿VARIOS FINALES?', 'NI CONFIRMADO NI DESMENTIDO')])
beat(P, 13, [c('01', 538.0, zoom=[1.0, 1.06])], [B('¿Y TÚ QUÉ CREES?', size=150)])
beat(P, 14, [c('01', 456.0, zoom=[1.03, 1.1])], [B('¿SOBREVIVEN LOS DOS?', size=120)])
beat(P, 15, [c('01', 457.5, zoom=[1.06, 1.12])], [L('DÉJAMELO EN COMENTARIOS')], until=S('p8', 0) - 0.08)

# =============== PART 8 — CIERRE ===============
P = 'p8'
beat(P, 0, [c('02', 450.8), c('02', 427.0)], [L('JASON Y LUCÍA', 'TODO LO QUE SABEMOS')], cuts=[2.4])
beat(P, 1, [c('01', 236.8, zoom=[1.12, 1.2], origin='38% 38%')], [L('JASON', 'EX MILITAR')])
beat(P, 2, [c('01', 481.0, zoom=[1.02, 1.1])], [L('LUCÍA', 'RECIÉN SALIDA DE PRISIÓN')])
beat(P, 3, [MAP(CON, cam=[[0, 0.62, 0.53, 0.78], [3.2, 0.7, 0.56, 0.5]], net=dict(t0=0.1, t1=1.6, from_=(0.80, 0.565), to=[(0.63,0.46),(0.42,0.40),(0.59,0.84),(0.68,0.75),(0.78,0.35),(0.52,0.62)]))], [SH('UNA CONSPIRACIÓN', y=890)])
beat(P, 4, [c('01', 432.0, zoom=[1.0, 1.06])], [B('19 NOV', 'POR FIN LOS CONOCEMOS', size=210)])
beat(P, 5, [c('01', 197.0, zoom=[1.0, 1.06])], [B('LO VOY A COMPROBAR TODO', 'CUANDO SALGA EL JUEGO', size=110)])
beat(P, 6, None, [dict(type='subscribe', at=0.0)], until=S(P, 7) - 0.08)
overlays.append(dict(type='endcard', t0=S(P, 7) - 0.08, t1=END))
sfx += [{'t': S(P, 7) - 0.08, 'src': 's_sub', 'vol': .35}]

# ---------- music: beds with crossfades; ducked under the voice, swell on the title + ending ----------
music = [dict(src='music/bed.mp3', t0=0, t1=END, off=0)]
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

# ---------- post: make video segments contiguous (a beat without clips keeps the previous shot) ----------
v = sorted(video, key=lambda x: x['t0'])
for a, b in zip(v, v[1:]):
    a['t1'] = b['t0']
v[-1]['t1'] = END
J['video'] = v
json.dump(J, open(os.path.join(HERE, '..', 'src', 'beats.json'), 'w'), ensure_ascii=False, indent=0)
lens = [round(x['t1'] - x['t0'], 2) for x in v]
print('max seg', max(lens), 'min seg', min(lens))
print('long segs', [(round(x['t0'],1), x.get('p','map'), x.get('s',0), round(x['t1']-x['t0'],1)) for x in v if x['t1']-x['t0'] > 6])

# ---------- clips: one high-quality pre-cut file per shot (no speed changes -> no judder at 60 fps) ----------
XF = 0.2
cuts_list = []
for i, x in enumerate(J['video']):
    x.pop('rate', None)
    if 'map' in x: continue
    st = max(0.0, x['s'] - XF)
    d = round(x['t1'] - x['t0'] + XF + 0.3, 3)
    name = f"{x['p']}_{int(round(st*1000))}_{int(round(d*100))}.mp4"
    x['clip'] = name
    cuts_list.append({'name': name, 'p': x['p'], 'start': round(st, 3), 'dur': d})
json.dump(J, open(os.path.join(HERE, '..', 'src', 'beats.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(cuts_list, open(os.path.join(HERE, 'cuts.json'), 'w'), indent=0)
print('clips', len(cuts_list), 'total s', round(sum(c['dur'] for c in cuts_list), 1))
