import json, math, random, sys

# key: (ataque, centro, defensa, estrella)
T = {
 'BRA': (99, 95, 84, 97), 'ESP': (86, 99, 92, 90), 'HUN': (97, 92, 80, 92), 'NLD': (92, 95, 84, 95),
 'ARG': (92, 88, 87, 97), 'DEU': (90, 92, 90, 86), 'FRA': (93, 90, 88, 89), 'ITA': (82, 88, 96, 85),
 'URY': (85, 84, 86, 84), 'ENG': (85, 86, 87, 86), 'PRT': (84, 84, 86, 92), 'HRV': (82, 93, 82, 88),
 'BEL': (89, 88, 81, 85), 'MAR': (76, 82, 92, 80), 'CHL': (82, 86, 80, 80), 'MEX': (80, 80, 78, 78),
}
SC = {
 'BRA': [('Pelé', 5), ('Jairzinho', 5), ('Tostão', 3), ('Rivelino', 3), ('Gérson', 2), ('Carlos Alberto', 1)],
 'ESP': [('Villa', 5), ('Torres', 3), ('Iniesta', 3), ('Xavi', 2), ('Fàbregas', 2), ('Puyol', 1)],
 'HUN': [('Puskás', 5), ('Kocsis', 5), ('Hidegkuti', 3), ('Czibor', 2), ('Bozsik', 1)],
 'NLD': [('Cruyff', 5), ('Neeskens', 4), ('Rep', 3), ('Rensenbrink', 3), ('Krol', 1)],
 'ARG': [('Messi', 6), ('Julián Álvarez', 4), ('Di María', 3), ('Enzo Fernández', 2), ('Mac Allister', 2), ('Lautaro', 2)],
 'DEU': [('Müller', 5), ('Klose', 4), ('Kroos', 3), ('Schürrle', 2), ('Götze', 2), ('Hummels', 1)],
 'FRA': [('Mbappé', 5), ('Griezmann', 5), ('Giroud', 2), ('Pogba', 2), ('Varane', 1)],
 'ITA': [('Toni', 4), ('Del Piero', 3), ('Pirlo', 3), ('Totti', 3), ('Materazzi', 2), ('Grosso', 1)],
 'URY': [('Schiaffino', 5), ('Míguez', 4), ('Ghiggia', 4), ('Obdulio Varela', 1)],
 'ENG': [('Hurst', 5), ('Bobby Charlton', 5), ('Hunt', 3), ('Peters', 3)],
 'PRT': [('Cristiano', 7), ('Nani', 3), ('Quaresma', 2), ('Éder', 2), ('Renato Sanches', 1)],
 'HRV': [('Modrić', 4), ('Mandžukić', 4), ('Perišić', 4), ('Rakitić', 3), ('Kramarić', 2)],
 'BEL': [('Lukaku', 5), ('Hazard', 5), ('De Bruyne', 4), ('Mertens', 2), ('Chadli', 1)],
 'MAR': [('En-Nesyri', 5), ('Ziyech', 4), ('Hakimi', 2), ('Boufal', 2), ('Amallah', 1)],
 'CHI': [],
 'CHL': [('Alexis', 5), ('Vargas', 4), ('Vidal', 4), ('Aránguiz', 2)],
 'MEX': [('Cuauhtémoc Blanco', 6), ('Zepeda', 3), ('Abundis', 2), ('Luis Hernández', 3)],
}
GK = {'BRA': 'Félix', 'ESP': 'Casillas', 'HUN': 'Grosics', 'NLD': 'Jongbloed', 'ARG': 'Dibu Martínez', 'DEU': 'Neuer', 'FRA': 'Lloris', 'ITA': 'Buffon',
      'URY': 'Máspoli', 'ENG': 'Banks', 'PRT': 'Rui Patrício', 'HRV': 'Subašić', 'BEL': 'Courtois', 'MAR': 'Bounou', 'CHL': 'Bravo', 'MEX': 'Jorge Campos'}
R16 = [('BRA', 'MAR'), ('ENG', 'ITA'), ('HUN', 'BEL'), ('DEU', 'URY'), ('ESP', 'MEX'), ('NLD', 'ARG'), ('FRA', 'HRV'), ('PRT', 'CHL')]

def ovr(k): return sum(T[k]) / 4

def lam(a, b):
    A, B = T[a], T[b]
    return 1.2 * math.exp(0.035 * (A[0] - B[2]) + 0.02 * (A[1] - B[1]) + 0.01 * (A[3] - B[3]))

def probs(a, b, n=20000, rng=None):
    rng = random.Random(7)
    la, lb = lam(a, b), lam(b, a)
    w = d = 0
    for _ in range(n):
        x, y = pois(rng, la), pois(rng, lb)
        w += x > y; d += x == y
    return round(100 * w / n), round(100 * d / n), 100 - round(100 * w / n) - round(100 * d / n)

def pois(rng, l):
    L, k, p = math.exp(-l), 0, 1.0
    while True:
        p *= rng.random()
        if p < L: return k
        k += 1

def pick(rng, k):
    s = SC[k]; tot = sum(w for _, w in s); r = rng.random() * tot
    for n, w in s:
        r -= w
        if r <= 0: return n
    return s[-1][0]

def play(rng, a, b):
    if (a, b) not in PR: PR[(a, b)] = probs(a, b, 6000)
    la, lb = lam(a, b), lam(b, a)
    goals = []
    for side, l in ((a, la), (b, lb)):
        for _ in range(pois(rng, l)):
            goals.append({'t': side, 'm': rng.randint(1, 90), 'who': pick(rng, side)})
    ga = sum(g['t'] == a for g in goals); gb = len(goals) - ga
    et = False; pens = None
    if ga == gb:
        et = True
        for side, l in ((a, la), (b, lb)):
            for _ in range(pois(rng, l / 3)):
                goals.append({'t': side, 'm': rng.randint(91, 120), 'who': pick(rng, side)})
        ga = sum(g['t'] == a for g in goals); gb = len(goals) - ga
        if ga == gb:
            seq = []; sa = sb = 0
            for i in range(5):
                for side in (a, b):
                    ok = rng.random() < 0.76
                    seq.append({'t': side, 'ok': ok, 'who': pick(rng, side)})
                    if side == a: sa += ok
                    else: sb += ok
            while sa == sb:
                oa, ob = rng.random() < 0.76, rng.random() < 0.76
                seq.append({'t': a, 'ok': oa, 'who': pick(rng, a)}); seq.append({'t': b, 'ok': ob, 'who': pick(rng, b)})
                sa += oa; sb += ob
            pens = {'a': sa, 'b': sb, 'seq': seq}
    goals.sort(key=lambda g: g['m'])
    # unique minutes
    used = set()
    for g in goals:
        while g['m'] in used: g['m'] += 1
        used.add(g['m'])
    win = a if (ga > gb or (pens and pens['a'] > pens['b'])) else b
    # stats
    pos = max(30, min(70, round(50 + (T[a][1] - T[b][1]) * 0.9 + rng.uniform(-5, 5))))
    sha = max(ga + 2, round(la * 6 + rng.uniform(-2, 3))); shb = max(gb + 2, round(lb * 6 + rng.uniform(-2, 3)))
    return {'a': a, 'b': b, 'ga': ga, 'gb': gb, 'goals': goals, 'et': et, 'pens': pens, 'win': win, 'pos': pos, 'sha': sha, 'shb': shb, 'p': PR[(a, b)]}

PR = {}
def tour(seed):
    rng = random.Random(seed)
    rounds = []; cur = R16
    for r in range(4):
        ms = [play(rng, a, b) for a, b in cur]
        rounds.append(ms)
        w = [m['win'] for m in ms]
        cur = [(w[i], w[i + 1]) for i in range(0, len(w) - 1, 2)]
    return rounds

def score(rs):
    allm = [m for r in rs for m in r]
    pens = sum(1 for m in allm if m['pens']); ets = sum(1 for m in allm if m['et'] and not m['pens'])
    ups = sum(1 for m in allm if ovr(m['win']) < ovr(m['a'] if m['win'] == m['b'] else m['b']) - 1.5)
    big = max(m['ga'] + m['gb'] for m in allm)
    fin = rs[3][0]
    champ = fin['win']
    zero = sum(1 for m in allm if m['ga'] + m['gb'] == 0)
    sf = [m['win'] for m in rs[2]]
    ok = 2 <= pens <= 3 and ets >= 1 and 2 <= ups <= 4 and big >= 5 and zero <= 1 and fin['ga'] + fin['gb'] >= 3 and champ in ('BRA', 'ARG', 'ESP', 'NLD', 'HUN')
    ok = ok and len(set(sf) & {'BRA', 'ARG', 'ESP'}) >= 1 and rs[2][0]['ga'] + rs[2][0]['gb'] >= 3
    return ok, (pens, ets, ups, big, champ, [m['win'] for m in rs[1]], sf)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        seed = int(sys.argv[1]); rs = tour(seed)
        for i, r in enumerate(rs):
            print('ROUND', i)
            for m in r: print(' ', m['a'], m['ga'], '-', m['gb'], m['b'], 'ET' if m['et'] else '', ('pens %d-%d' % (m['pens']['a'], m['pens']['b'])) if m['pens'] else '', '->', m['win'], ' | ', ', '.join('%s %d\'' % (g['who'], g['m']) for g in m['goals']), m['p'])
        json.dump({'seed': seed, 'rounds': rs, 'T': T, 'GK': GK, 'ovr': {k: ovr(k) for k in T}}, open('src/v10/sim10.json', 'w'), ensure_ascii=False, indent=1)
    else:
        n = 0
        for s in range(1, 20000):
            ok, info = score(tour(s))
            if ok:
                print(s, info); n += 1
                if n > 40: break
