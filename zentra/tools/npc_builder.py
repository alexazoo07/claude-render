"""Builds src/npc.json + tools/npc_cuts.json for the video 'Los NPC de GTA 6 te juzgan por tu ropa'."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
A = json.load(open('/home/claude/npc/align.json'))
GAP_PART = 0.55
TITLE_LEN = 3.6
NPC_PAD = 0.25  # silence around an NPC insert

CRED = {'v2': 'GAMEPLAY: "GTA 6 EXPLORANDO EL MASIVO MUNDO ABIERTO"', 'v3': 'GAMEPLAY: "OCEAN VIEW BEACH RAMPAGE & EXPLORATION"',
        'v4': 'GAMEPLAY: "OPEN WORLD FREE ROAM · BEACHES & VICE CITY"', 'v5': 'GAMEPLAY: "I STOLE A JUMBO JET IN GTA 6"', 'T': 'GTA VI · TRÁILER OFICIAL · ROCKSTAR GAMES'}
def cred(src):
    return CRED['T'] if src.startswith('T') else CRED[src.split('_')[0]]

video, overlays, sfx, voice, music_duck, cuts = [], [], [], [], [], []
T = [0.0]

def shot(src, s, **k):
    d = {'src': src, 's': s}; d.update(k); return d

_rot = [0]
def tsfx():
    _rot[0] = _rot[0] % 3 + 1
    return f's_text{_rot[0]}'
SFX_FOR = {'kinetic': None, 'stamp': ('s_pop', .4), 'quote': ('s_card', .42), 'section': ('s_section', .45), 'npcsub': ('s_sub', .3),
           'tip': ('s_card2', .4), 'hud': ('s_card2', .38), 'versus': ('s_card', .4), 'chapter': ('s_tick', .35)}

def add_ov(o, t0, t1):
    o = dict(o); o['t0'] = round(t0, 3); o['t1'] = round(t1, 3); overlays.append(o)
    if o.get('mute'): return
    if o['type'] in SFX_FOR:
        v = SFX_FOR[o['type']]
        if v is None: sfx.append({'t': t0 - 0.05, 'src': tsfx(), 'vol': .33})
        else: sfx.append({'t': t0 - 0.06, 'src': v[0], 'vol': v[1]})

def put_shots(shots, t0, t1, cutsrel=None):
    n = len(shots)
    b = [t0] + ([t0 + x for x in cutsrel] if cutsrel else [t0 + (t1 - t0) * k / n for k in range(1, n)]) + [t1]
    for k, sh in enumerate(shots):
        v = dict(sh); v['t0'] = round(b[k], 3); v['t1'] = round(b[k + 1], 3); v['credit'] = cred(v['src'])
        if v.get('flash'): sfx.append({'t': v['t0'] - 0.18, 'src': 's_cut', 'vol': .34})
        video.append(v)

def say(part, idx, shots, ovs=(), cutsrel=None):
    """voice sentence idx of part, shots cover until the next sentence start (incl. pause)."""
    sents = A[part]
    a = sents[idx]
    nxt_gap = (sents[idx + 1]['start'] - a['end']) if idx + 1 < len(sents) else 0.35
    t0 = T[0]; dur = a['end'] - a['start']; t1 = t0 + dur + nxt_gap
    voice.append({'src': f'vo/npc_{part}.wav', 'at': round(t0, 3), 'from': a['start'], 'to': a['end']})
    put_shots(shots, t0, t1, cutsrel)
    for o in ovs:
        o = dict(o); at = o.pop('at', 0.05); d = o.pop('dur', None)
        add_ov(o, t0 + at, (t0 + at + d) if d else t1 - 0.06)
    T[0] = t1

def npc(src, a, b, es, en, who, zoom=(1.0, 1.04)):
    """an NPC moment: the narrator stops, the clip plays with its own audio and a subtitle."""
    t0 = T[0] + NPC_PAD * 0.4; d = b - a
    v = shot(src, a, audio=1.0, zoom=list(zoom), hard=False); v['t0'] = round(T[0], 3); v['t1'] = round(t0 + d + NPC_PAD, 3); v['credit'] = cred(src)
    v['s'] = a - (t0 - T[0])
    video.append(v)
    add_ov(dict(type='npcsub', es=es, en=en, who=who), t0 + 0.1, t0 + d - 0.05)
    music_duck.append([round(T[0], 3), round(t0 + d + NPC_PAD, 3)])
    T[0] = t0 + d + NPC_PAD

def pause(s):
    T[0] += s

KW = lambda words, **k: dict(type='kinetic', words=words, **k)
ST = lambda text, sub=None, **k: dict(type='stamp', text=text, sub=sub, **k)
Q = lambda lines, source, kind='prensa', **k: dict(type='quote', kind=kind, lines=lines, source=source, **k)
SEC = lambda text, sub=None, **k: dict(type='section', text=text, sub=sub, **k)
TIP = lambda n, text, sub=None, **k: dict(type='tip', n=n, text=text, sub=sub, **k)
HUD = lambda on, **k: dict(type='hud', on=on, **k)
BL = dict(blur=10, dim=0.25)

# ================= COLD OPEN: NPC voices before the narrator =================
npc('v4_01', 34.35, 39.1, '¡Tío! ¡Mírame cuando te hablo!', 'Look at me when I talk to you!', 'NPC · GIMNASIO DE LA PLAYA')
npc('v2_01', 419.9, 424.4, 'Eh… ¿te conozco?', 'Um, do I know you?', 'NPC · HAMBURGUESERÍA')
c0 = T[0]
put_shots([shot('v4_00', 340.0, zoom=[1.06, 1.14], flash=True), shot('v3', 44.0, zoom=[1.06, 1.14], flash=True), shot('v4_00', 460.0, zoom=[1.06, 1.14], flash=True)], c0, c0 + 2.4)
add_ov(KW([['TE', 0.0], ['ESTÁN', 0.25], ['MIRANDO', 0.55, True]], size=190, dim=1), c0 + 0.05, c0 + 2.35)
COLD_END = c0 + 2.4
T[0] = COLD_END + 0.1

# ================= P1 HOOK =================
P = 'p1'
say(P, 0, [shot('v4_00', 9.5, zoom=[1.04, 1.1])], [KW([['NO', 0.0], ['ERES', 0.2], ['INVISIBLE', 0.45, True]], size=150, top=110)])
say(P, 1, [shot('v2_02', 50.0), shot('v2_02', 58.0, zoom=[1.04, 1.1])], [ST('TIRANTES', sub='TE LO ECHAN EN CARA', x=1440, y=330, size=96, at=0.9)])
say(P, 2, [shot('v4_01', 62.0, zoom=[1.02, 1.08])], [ST('3 DÍAS SIN DUCHA', x=1280, y=300, size=90, rot=-6, at=0.5)])
say(P, 3, [shot('v2_00', 128.0), shot('v2_00', 168.0, zoom=[1.04, 1.1])], [KW([['ESA', 0.0], ['CHAQUETA', 0.25, True]], size=160, at=4.4)])
say(P, 4, [shot('v4_00', 300.0, **BL)], [KW([['13', 0.0, True], ['AÑOS', 0.15], ['DE', 0.5], ['PURO', 0.65], ['DECORADO', 0.85]], size=150)])
say(P, 5, [shot('v4_00', 352.0, zoom=[1.03, 1.1])], [KW([['AHORA', 0.6], ['ES', 0.8], ['INFORMACIÓN', 1.0, True]], size=150, top=120)])
say(P, 6, [shot('v2_02', 150.0), shot('v3', 30.0, flash=True), shot('v4_00', 430.0, flash=True)], [
    dict(type='chapter', n='01', text='LO QUE TE DICEN', at=2.4, dur=1.9), dict(type='chapter', n='02', text='LA POLICÍA Y TU ROPA', at=4.4, dur=1.8),
    dict(type='chapter', n='03', text='LO QUE NO SABEMOS', at=6.3, dur=2.4)])
TITLE_AT = T[0] + 0.05
add_ov(dict(type='titlecard'), TITLE_AT, TITLE_AT + TITLE_LEN)
sfx.append({'t': TITLE_AT - 0.1, 'src': 's_section', 'vol': .45})
T[0] = TITLE_AT + TITLE_LEN + 0.2
SW1 = [TITLE_AT - 0.2, TITLE_AT + TITLE_LEN]

# ================= P2 DE DECORADO A SISTEMA =================
P = 'p2'
say(P, 0, [shot('v4_00', 412.0, **BL)], [SEC('ANTES', 'GTA V · 2013')])
say(P, 1, [shot('v2_03', 42.0, zoom=[1.03, 1.09])], [KW([['EN', 0.0], ['CALZONCILLOS', 0.2], ['POR', 1.0], ['ROCKFORD', 1.2], ['HILLS', 1.5, True]], size=120, top=90), ST('NADIE TE MIRABA', x=1300, y=780, size=80, at=3.4)])
say(P, 2, [shot('v4_00', 470.0, **BL)], [dict(type='versus', at=0.1)])
say(P, 3, [shot('v3', 60.0, zoom=[1.04, 1.1])], [ST('CAMBIA', x=960, y=540, size=170, rot=-6)])
say(P, 4, [shot('v4_00', 322.0), shot('v2_02', 236.0, zoom=[1.03, 1.08])], [Q(['REACCIONAN A TU ROPA,', 'A TU COCHE Y A', 'LO QUE LLEVAS ENCIMA'], 'LO QUE DICEN LOS ANÁLISIS', x=110, y=300, highlight=True)])
say(P, 5, [shot('v2_00', 60.0, **BL)], [ST('OJO: BULO', x=960, y=520, size=150, color='#ffd166')])
say(P, 6, [shot('v2_03', 104.5, zoom=[1.02, 1.07]), shot('v2_03', 108.0, zoom=[1.04, 1.1])], [ST('SIN IA GENERATIVA', sub='LO HAN DICHO ROCKSTAR Y TAKE-TWO', x=1240, y=330, size=84, at=2.2)])
say(P, 7, [shot('v4_00', 172.0), shot('v4_00', 236.0, zoom=[1.03, 1.08])], [KW([['QUIÉN', 0.0], ['ERES', 0.15], ['·', 0.9], ['QUÉ', 1.0], ['LLEVAS', 1.15, True], ['·', 1.8], ['DÓNDE', 1.9], ['ESTÁS', 2.05], ['·', 2.6], ['A', 2.7], ['QUÉ', 2.8], ['HORA', 2.95, True]], size=104, at=4.6, top=700)])
T[0] += GAP_PART

# ================= P3 LO QUE DICEN DE TI =================
P = 'p3'
say(P, 0, [shot('v3', 18.0)], [SEC('LOS COMENTARIOS', 'LO QUE DICEN DE TI POR LA CALLE')])
say(P, 1, [shot('v2_02', 505.0, zoom=[1.02, 1.07])], [ST('GAMEPLAY REAL', sub='EL JUEGO LLEVA HORAS FUERA', x=1360, y=320, size=96, at=1.4)])
say(P, 2, [shot('v4_00', 4.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='01', text='EL SEÑOR DEL CHIRINGUITO', at=0.2)])
npc('v4_00', 8.3, 12.8, 'Yo era igualito a ti, ¿sabes? Hace 50 años.', 'I used to look just like you, you know? 50 years ago.', 'NPC · CHIRINGUITO DE LA PLAYA')
say(P, 3, [shot('v2_00', 20.0)], [dict(type='chapter', n='02', text='EL DEL BAR', at=0.2)])
npc('v2_00', 26.35, 32.3, 'Tío, si los aliens te ordeñaran, sacarían unos híbridos guapísimos.', "Damn dude, if the aliens milked you, they'd get some damn good-looking hybrids.", 'NPC · BAR')
say(P, 4, [shot('v2_02', 513.0, zoom=[1.02, 1.07])], [dict(type='chapter', n='03', text='LOS ABUELOS DEL BANCO', at=0.2)])
npc('v2_02', 523.1, 529.85, '¿Quieres pasar el rato? ¿Buscas más gente a la que robar?', 'You wanna hang out? Are you looking for more people to rob?', 'NPC · PASEO MARÍTIMO')
say(P, 5, [shot('v4_00', 318.0), shot('v2_02', 40.0, zoom=[1.03, 1.08])], [KW([['Y', 0.0], ['NO', 0.12], ['SIEMPRE', 0.3], ['ES', 0.55], ['PARA', 0.7], ['BIEN', 0.9, True]], size=140, at=3.5, top=110)])
npc('v2_02', 64.0, 71.0, 'Si vas a ser un borde, al menos sé divertido.', "If you're gonna be a bitch, at least be fun about it.", 'NPC · PLAYA')
say(P, 6, [shot('v2_02', 200.0, **BL)], [Q(['«¿SIN MANGAS?', 'UN POCO AGRESIVO»'], 'UN NPC A JASON, SEGÚN UN ANÁLISIS', x=520, y=330, highlight=True)])
say(P, 7, [shot('v4_01', 120.0, zoom=[1.02, 1.08]), shot('v4_01', 112.0, zoom=[1.04, 1.1])], [ST('HUELES', sub='TE LO DIRÁN SI NO TE DUCHAS', x=1380, y=320, size=110, at=2.6)])
say(P, 8, [shot('v4_01', 8.0), shot('v2_03', 18.0, zoom=[1.03, 1.08])], [KW([['GYM', 0.0], ['EN', 0.15], ['LA', 0.28], ['PLAYA', 0.4, True]], size=130, at=2.3, dur=2.3, top=110), KW([['TRAJE', 0.0], ['EN', 0.15], ['EL', 0.28], ['CENTRO', 0.4, True]], size=130, at=4.7, top=110)])
npc('v2_03', 271.3, 276.3, 'A diferencia de estos, yo entreno para la vida real. No lo entenderías.', "Unlike these other guys, I'm training for some real life sh*t. You wouldn't get it.", 'NPC · GIMNASIO')
say(P, 9, [shot('v2_02', 486.0, zoom=[1.02, 1.07]), shot('v2_03', 2.0, zoom=[1.03, 1.08])], [ST('BARRIO PIJO', x=1400, y=320, size=100, at=2.0)])
npc('v2_02', 500.2, 505.8, 'En diez años, en ese barrio solo vas a oír acento de niña rica.', "Ten years' time, walk through that neighborhood, all you're gonna hear is a rich girl accent.", 'NPC · BARRIO RICO')
say(P, 10, [shot('v2_02', 296.0), shot('v2_02', 340.0, zoom=[1.04, 1.1], flash=True)], [Q(['UNA VECINA LE PREGUNTÓ', 'QUÉ HACÍA MIRANDO SU CASA…', 'Y ACABÓ A PUÑETAZOS'], 'SEGÚN UN ANÁLISIS', x=110, y=290, highlight=True)])
say(P, 11, [shot('v4_00', 356.0, zoom=[1.04, 1.1])], [KW([['LEONIDA', 0.0, True], ['SE', 0.3], ['FIJA', 0.45], ['EN', 0.6], ['TI', 0.72]], size=150, top=110)])
T[0] += GAP_PART

# ================= P4 POLICÍA =================
P = 'p4'
say(P, 0, [shot('v2_00', 160.0, zoom=[1.03, 1.1])], [SEC('TU ROPA ES UNA PISTA', 'POLICÍA · TESTIGOS · CÁMARAS')])
say(P, 1, [shot('v2_00', 138.0)], [ST('SIN TESTIGOS, NO HAY POLICÍA', x=960, y=830, size=72, rot=-4, at=0.3)])
npc('v2_00', 155.15, 159.3, '¡Idiota! ¡Quedas detenido, hijo de…!', "You f*cking idiot, you're under arrest, you son of a…", 'POLICÍA DE LEONIDA')
say(P, 2, [shot('v2_00', 171.0, **BL)], [HUD(['face', 'clothes', 'car', 'pair'], at=0.1)])
say(P, 3, [shot('v2_00', 172.5, **BL)], [HUD(['face', 'clothes'], focus=True, at=0.1)])
say(P, 4, [shot('v2_03', 300.0, **BL)], [HUD(['face', 'clothes'], clear=['face'], at=0.1, clear_at=4.2)])
say(P, 5, [shot('v2_00', 320.0), shot('v2_00', 380.0, zoom=[1.03, 1.08])], [ST('PUEDE SALVARTE', x=1400, y=330, size=100, at=3.3)])
T[0] += GAP_PART

# ================= P5 TRUCOS =================
P = 'p5'
say(P, 0, [shot('v4_01', 336.0, zoom=[1.02, 1.07])], [KW([['APÚNTATE', 0.4], ['ESTO', 0.7, True]], size=170)])
say(P, 1, [shot('v2_01', 476.0), shot('v2_01', 492.0, zoom=[1.03, 1.08])], [TIP('1', 'OUTFIT DE REPUESTO', 'EN EL MALETERO')])
say(P, 2, [shot('v2_00', 400.0)], [TIP('2', 'MÁSCARA Y GORRO', 'SIRVEN PARA LA CARA, NO PARA LA ROPA')])
say(P, 3, [shot('v2_03', 112.0, zoom=[1.02, 1.08])], [TIP('3', 'OJO CON LAS CÁMARAS', 'GRABAN AUNQUE NADIE MIRE')])
say(P, 4, [shot('v2_02', 300.0), shot('v2_02', 344.0, zoom=[1.03, 1.08])], [TIP('4', 'ROBA SU SOMBRERO', 'Y DISFRÁZATE CON ÉL')])
T[0] += GAP_PART

# ================= P6 LO QUE NO SABEMOS =================
P = 'p6'
say(P, 0, [shot('v3', 250.0, **BL)], [ST('SIN CONFIRMAR', x=960, y=540, size=140, color='#ffd166')])
say(P, 1, [shot('v4_00', 440.0), shot('v4_00', 446.0, zoom=[1.03, 1.09])], [KW([['¿TIENEN', 0.0], ['MEMORIA?', 0.3, True]], size=150, at=1.2, top=110)])
say(P, 2, [shot('v2_03', 60.0)], [Q(['PATENTES DE ROCKSTAR:', 'NPC QUE RECUERDAN', 'LO QUE HICISTE'], 'RUMOR · SIN CONFIRMAR', kind='teoria', x=110, y=300)])
say(P, 3, [shot('v2_01', 406.0), shot('v2_01', 413.0, zoom=[1.03, 1.08])], [])
npc('v2_01', 419.9, 424.4, 'Eh… ¿te conozco?', 'Um, do I know you?', 'NPC · HAMBURGUESERÍA')
say(P, 4, [shot('v2_01', 425.5, **BL)], [KW([['¿CASUALIDAD…', 0.0], ['O', 0.6], ['MEMORIA?', 0.75, True]], size=150)])
say(P, 5, [{'split': [dict(src='T01', s=236.2, name='JASON', role='¿LE TRATAN IGUAL?', at=0.0, origin='38% 40%', scale=1.15, shift=-120), dict(src='T01', s=480.3, name='LUCÍA', role='¿O DISTINTO?', at=0.3, origin='50% 40%', scale=1.12, shift=60)], 'mid': dict(text='VS', at=0.8, y=150), 'src': 'T01', 's': 236.2}], [])
say(P, 6, [shot('v4_00', 200.0), shot('v3', 120.0, flash=True)], [KW([['10', 0.0, True], ['OUTFITS', 0.15], ['·', 0.8], ['MISMOS', 0.9], ['SITIOS', 1.05], ['·', 1.6], ['JASON', 1.7], ['Y', 1.85], ['LUCÍA', 1.95, True]], size=104, at=1.5, top=700)])
T[0] += GAP_PART

# ================= P7 CIERRE =================
P = 'p7'
say(P, 0, [shot('v3', 100.0), shot('v2_02', 180.0, flash=True), shot('v4_00', 350.0, flash=True)], [KW([['EL', 0.0], ['MUNDO', 0.15], ['SE', 0.45], ['ENTERA', 0.6, True]], size=150, at=4.6, top=110)])
say(P, 1, [shot('v4_00', 60.0, **BL)], [KW([['¿QUÉ', 0.0], ['OUTFIT', 0.2, True], ['PROBAMOS?', 0.5]], size=160), ST('COMENTA', x=1500, y=830, size=80, at=2.4)])
s0 = T[0]
say(P, 2, [shot('v4_00', 70.0, **BL)], [])
add_ov(dict(type='subscribe'), s0 + 0.05, T[0] + 0.3)
END_AT = T[0] + 0.3
add_ov(dict(type='endcard'), END_AT, END_AT + 3.0)
END = END_AT + 3.0
SW2 = [END_AT - 0.3, END]

# ---------- post: make video contiguous ----------
video.sort(key=lambda v: v['t0'])
for i in range(len(video) - 1):
    video[i]['t1'] = video[i + 1]['t0']
video[-1]['t1'] = END_AT
# black under subscribe/end handled by fullscreen overlays

# ---------- clip list ----------
PRE = 0.25
def need(src, s, L, rate=1.0):
    a = max(0, s - PRE); d = L * rate + PRE + 0.35
    cid = f"n_{src}_{int(round(a*1000))}_{int(round(d*100))}.mp4"
    cuts.append({'src': src, 'a': round(a, 3), 'd': round(d, 2), 'id': cid})
    return cid, s - a
for v in video:
    L = v['t1'] - v['t0']
    if 'split' in v:
        for sd in v['split']:
            sd['clip'], sd['off'] = need(sd['src'], sd['s'], L + 0.3)
    else:
        v['clip'], v['off'] = need(v['src'], v['s'], L + 0.3, v.get('rate', 1))

J = {'video': video, 'overlays': overlays, 'sfx': sorted(sfx, key=lambda x: x['t']), 'voice': voice, 'duck': music_duck,
     'swells': [[0, COLD_END], SW1, SW2], 'music': [{'src': 'music/bed.mp3', 't0': 0, 't1': END, 'off': 22.24}], 'end': round(END, 3), 'cold': COLD_END}
json.dump(J, open(os.path.join(HERE, '..', 'src', 'npc.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(cuts, open(os.path.join(HERE, 'npc_cuts.json'), 'w'), indent=0)
print('shots', len(video), 'overlays', len(overlays), 'END', round(END, 2), 'clips', len(set(c['id'] for c in cuts)))
mins = sorted((round(v['t1'] - v['t0'], 2), round(v['t0'], 1)) for v in video)[:6]
print('shortest', mins)
