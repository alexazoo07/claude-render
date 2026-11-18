"""Builds src/npc.json + tools/npc_cuts.json for the video 'Los NPC de GTA 6 te juzgan por tu ropa'."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
import glob
A = {}
for f in sorted(glob.glob('/home/claude/npc/c2/npc2/*.json')):
    j = json.load(open(f)); _, p, i = j['id'].split('_')
    A.setdefault(p, []).append(j)
for p in A: A[p].sort(key=lambda j: j['id'])
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
    """voice sentence idx of part; shots cover the sentence plus the pause after it."""
    j = A[part][idx]
    st = j['start'][0] if j['start'] else 0.0
    a, e = max(0.0, st - 0.08), j['dur']
    last = idx + 1 >= len(A[part])
    pause = 0.18 if last else (0.42 if j['text'].rstrip().endswith(('?', '.', '…')) else 0.28)
    t0 = T[0]; t1 = t0 + (e - a) + pause
    voice.append({'src': f"vo/n2/{j['id']}.wav", 'at': round(t0, 3), 'from': round(a, 3), 'to': round(e, 3)})
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

exec(open(os.path.join(HERE, 'npc2_body.py')).read())

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
