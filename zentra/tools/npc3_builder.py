"""Builds src/npc.json + tools/npc_cuts.json for the video 'Los NPC de GTA 6 te juzgan por tu ropa'."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
SLOW = 1.0
import numpy as np, soundfile as sf
AL = json.load(open('/home/claude/npc/align3.json'))
SEGL = sorted((x[0], x[1]) for x in json.load(open('/home/claude/npc/g_segs.json')))
SEGS = [x[0] for x in SEGL]
VOX, VSR = sf.read('/home/claude/npc/gonzalo.wav', dtype='float32')
if VOX.ndim > 1: VOX = VOX.mean(1)
_win = int(0.02 * VSR); _rms = np.sqrt(np.convolve(VOX ** 2, np.ones(_win) / _win, mode='same'))
SPEECH = float(np.percentile(_rms[_rms > 0.01], 50))
LINES = []
for p in sorted(AL, key=lambda k: int(k[1:])):
    for i in sorted(AL[p], key=int): LINES.append((p, int(i)))
def snap(t):
    return min(SEGS, key=lambda x: abs(x - t)) if min(abs(x - t) for x in SEGS) < 0.35 else t
def quiet_cut(t_next):
    """cut inside the real silence before the next line: the last quiet run (>=60 ms) that ends at the next onset."""
    st = snap(t_next)
    loud = SPEECH * 0.25
    i0, i1 = int((st - 0.9) * VSR), int((st + 0.25) * VSR)
    q = _rms[i0:i1] < loud
    runs, cur = [], None
    for k, v in enumerate(q):
        if v and cur is None: cur = k
        if not v and cur is not None: runs.append((cur, k)); cur = None
    if cur is not None: runs.append((cur, len(q)))
    runs = [r for r in runs if r[1] - r[0] >= int(0.06 * VSR)]
    if not runs: return st - 0.03
    # the run whose end is closest to the snapped start (that's where the next line begins)
    a, b = min(runs, key=lambda r: abs((i0 + r[1]) / VSR - st))
    m = int(0.03 * VSR); m2 = int(0.05 * VSR)
    a2, b2 = a + m, max(a + m + 1, b - m2)
    return (i0 + a2 + int(np.argmin(_rms[i0 + a2:i0 + b2]))) / VSR

CUT = {}
for k, (p, i) in enumerate(LINES):
    CUT[(p, i)] = 0.0 if k == 0 else quiet_cut(AL[p][str(i)]['start'])
def bounds(p, i):
    k = LINES.index((p, i))
    a = CUT[(p, i)]
    e = CUT[LINES[k + 1]] if k + 1 < len(LINES) else len(VOX) / VSR
    return a, e
PIECES = []
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
        v = dict(sh); v['t0'] = round(b[k], 3); v['t1'] = round(b[k + 1], 3); v['credit'] = v['map']['source'] if 'map' in v else cred(v['src'])
        if v.get('flash'): sfx.append({'t': v['t0'] - 0.18, 'src': 's_cut', 'vol': .34})
        video.append(v)

def wt(part, idx, word, occ=0):
    """time (s, slowed, relative to the line start) when `word` is spoken in line idx."""
    L = AL[part][str(idx)]; a, _ = bounds(part, idx)
    import unicodedata, re
    n = lambda w: re.sub(r'[^a-z0-9ñ¿?]', '', ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn')).strip('¿?')
    target = n(word); hits = [k for k, w in enumerate(L['words']) if n(w).startswith(target)]
    if not hits: raise SystemExit(f'word {word!r} not in {part}/{idx}: {L["text"]}')
    return max(0.0, (L['t'][hits[min(occ, len(hits) - 1)]] - a) / SLOW - 0.04)

def say(part, idx, shots, ovs=(), cuts=None, extra=0.4):
    """voice line idx of part; shots cover the line plus the pause after it. ov 'at' may be a word."""
    a, e = bounds(part, idx)
    t0 = T[0]; dur = (e - a) / SLOW; t1 = t0 + dur + extra
    PIECES.append((t0, a, e))
    W = lambda c: wt(part, idx, c) if isinstance(c, str) else (wt(part, idx, *c) if isinstance(c, tuple) else c)
    cr = [W(c) for c in cuts] if cuts else None
    put_shots(shots, t0, t1, cr)
    for o in ovs:
        o = dict(o); at = o.pop('at', 0.0); d = o.pop('dur', None); until = o.pop('until', None)
        at = W(at)
        end = t0 + (W(until) if until is not None else (at + d if d else dur + extra)) - 0.06
        add_ov(o, t0 + at, max(t0 + at + 0.6, end))
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
YAN = dict(img='maps/yanis.jpg', w=5670, h=7680, bg='#2c66a5', source='MAPA BASE: YANIS GTA VI COMMUNITY MAP V17 · GTADB.ORG')
def MAP(**k):
    d = dict(YAN); d.update(k); d.setdefault('net', None); return {'map': d}

exec(open(os.path.join(HERE, 'npc3_body.py')).read())

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
    if 'map' in v: continue
    if 'split' in v:
        for sd in v['split']:
            sd['clip'], sd['off'] = need(sd['src'], sd['s'], L + 0.3)
    else:
        v['clip'], v['off'] = need(v['src'], v['s'], L + 0.3, v.get('rate', 1))

TR = np.zeros(int((END + 1) * VSR), dtype=np.float32)
fade = int(0.012 * VSR)
for t0, a, e in PIECES:
    seg = VOX[int(a * VSR):int(e * VSR)].copy()
    seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    o = int(round(t0 * VSR)); TR[o:o + len(seg)] += seg
sf.write('/tmp/voice_track.wav', TR, VSR)
for (t0, a, e), (t1, a1, e1) in zip(PIECES, PIECES[1:]):
    assert t0 + (e - a) <= t1 + 1e-6, ('overlap', t0, t1)
voice = [{'src': 'vo/g/voice_track.wav', 'at': 0, 'from': 0, 'to': round(END, 3)}]
J = {'video': video, 'overlays': overlays, 'sfx': sorted(sfx, key=lambda x: x['t']), 'voice': voice, 'duck': music_duck,
     'swells': [[0, COLD_END], SW1, SW2], 'music': [{'src': 'music/bed.mp3', 't0': 0, 't1': END, 'off': 22.24}], 'end': round(END, 3), 'cold': COLD_END}
json.dump(J, open(os.path.join(HERE, '..', 'src', 'npc.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(cuts, open(os.path.join(HERE, 'npc_cuts.json'), 'w'), indent=0)
print('shots', len(video), 'overlays', len(overlays), 'END', round(END, 2), 'clips', len(set(c['id'] for c in cuts)))
mins = sorted((round(v['t1'] - v['t0'], 2), round(v['t0'], 1)) for v in video)[:6]
print('shortest', mins)
