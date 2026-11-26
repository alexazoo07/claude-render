# Video 17: What if Brazil had won the 2026 World Cup?
# Brazil replaces its real R16 defeat (Norway 2-1) and inherits Norway's path: QF England, SF Argentina, Final Spain.
import sys, json, collections
import numpy as np
sys.path.insert(0, '/home/claude/emh/tools/v16')
import sim16 as S
rng = np.random.default_rng(2026)
N = 10000
E = S.elo_at('2026-07-05')
NAMEK = {'Brazil': 'BRA', 'Norway': 'NOR', 'England': 'ENG', 'Argentina': 'ARG', 'Spain': 'ESP', 'Mexico': 'MEX', 'Canada': 'CAN', 'Morocco': 'MAR', 'Paraguay': 'PRY',
	'France': 'FRA', 'Portugal': 'PRT', 'United States': 'USA', 'Belgium': 'BEL', 'Egypt': 'EGY', 'Switzerland': 'CHE', 'Colombia': 'COL', 'Japan': 'JPN', 'Haiti': 'HTI', 'Scotland': 'SCT'}
elo = lambda t: round(E[t])
# real R16 bracket (pairs feed QF in order)
R16 = [('Canada', 'Morocco', 'Houston', False), ('Paraguay', 'France', 'Philadelphia', False), ('Portugal', 'Spain', 'Dallas', False), ('United States', 'Belgium', 'Seattle', True),
	('Brazil', 'Norway', 'East Rutherford', False), ('Mexico', 'England', 'Mexico City', True), ('Argentina', 'Egypt', 'Atlanta', False), ('Switzerland', 'Colombia', 'Vancouver', False)]
REAL = {  # real results (a, b): (ga, gb, et, pens)
	('Canada', 'Morocco'): (0, 3, False, None), ('Paraguay', 'France'): (0, 1, False, None), ('Portugal', 'Spain'): (0, 1, False, None), ('United States', 'Belgium'): (1, 4, False, None),
	('Mexico', 'England'): (2, 3, False, None), ('Argentina', 'Egypt'): (3, 2, False, None), ('Switzerland', 'Colombia'): (0, 0, True, (4, 3)),
	('France', 'Morocco'): (2, 0, False, None), ('Spain', 'Belgium'): (2, 1, False, None), ('Argentina', 'Switzerland'): (3, 1, False, None), ('France', 'Spain'): (0, 2, False, None),
}

def dr_of(a, b, home_a=False):
	return E[a] - E[b] + (100 if home_a else 0)

def sim_match(a, b, home_a=False):
	x, y, pw = S.play(dr_of(a, b, home_a), True)
	return a if (x > y or (x == y and pw)) else b

# ---------------- 10,000 simulations from the R16
champ = collections.Counter(); reach = collections.Counter(); elim = collections.Counter()
for _ in range(N):
	w16 = [sim_match(a, b, h) for a, b, c, h in R16]
	w8 = [sim_match(w16[i], w16[i + 1]) for i in range(0, 8, 2)]
	w4 = [sim_match(w8[i], w8[i + 1]) for i in range(0, 4, 2)]
	ch = sim_match(w4[0], w4[1])
	champ[ch] += 1
	# Brazil progress
	rounds = [(['Brazil', 'Norway'], w16[4]), ([w16[4], w16[5]], w8[2]), ([w8[2], w8[3]], w4[1]), ([w4[0], w4[1]], ch)]
	reach['R16'] += 1
	for i, (pair, w) in enumerate(rounds):
		if 'Brazil' not in pair: break
		if w == 'Brazil': reach[['QF', 'SF', 'F', 'CH'][i]] += 1
		else: elim[pair[0] if pair[1] == 'Brazil' else pair[1]] += 1; break
print('champ', {NAMEK[k]: round(v / N * 100, 1) for k, v in champ.most_common(10)})
print('reach', dict(reach), 'elim', {NAMEK[k]: v for k, v in elim.most_common()})

# ---------------- featured alternative run (Brazil wins every match)
def pwdl(dr):
	l1 = 1.30 * 10 ** (dr / 1300); l2 = 1.30 * 10 ** (-dr / 1300)
	a = rng.poisson(l1, 40000); b = rng.poisson(l2, 40000)
	return [round(float((a > b).mean() * 100)), round(float((a == b).mean() * 100)), round(float((a < b).mean() * 100))]

def sample_win(dr, want_et=None):
	l1 = 1.30 * 10 ** (dr / 1300); l2 = 1.30 * 10 ** (-dr / 1300)
	for _ in range(200000):
		a, b = int(rng.poisson(l1)), int(rng.poisson(l2)); et = False; pens = None
		if a == b:
			et = True; a2, b2 = int(rng.poisson(l1 / 3)), int(rng.poisson(l2 / 3))
			if a2 == b2: pens = 'P'
			a90, b90 = a, b; a += a2; b += b2
		else: a90, b90 = a, b
		if want_et is not None and et != want_et: continue
		if pens: continue
		if a > b: return a, b, et, a90, b90
	raise RuntimeError

SCORERS = {'BRA': [('Vinícius Júnior', 30), ('Raphinha', 16), ('Neymar', 14), ('Matheus Cunha', 14), ('Endrick', 5), ('Gabriel Martinelli', 6), ('Casemiro', 5), ('Bruno Guimarães', 5), ('Lucas Paquetá', 5)],
	'NOR': [('Erling Haaland', 70), ('Martin Ødegaard', 12), ('Antonio Nusa', 10), ('Alexander Sørloth', 8)],
	'ENG': [('Harry Kane', 35), ('Jude Bellingham', 35), ('Bukayo Saka', 20), ('Declan Rice', 10)],
	'ARG': [('Lionel Messi', 40), ('Lautaro Martínez', 30), ('Julián Álvarez', 20), ('Enzo Fernández', 10)],
	'ESP': [('Mikel Oyarzabal', 35), ('Lamine Yamal', 20), ('Ferran Torres', 15), ('Mikel Merino', 15), ('Dani Olmo', 15)]}
FORCE = {'NOR': 'Erling Haaland', 'ARG': 'Lionel Messi'}
def who(t, first=[set()]):
	if t in FORCE and t not in first[0]: first[0].add(t); return FORCE[t]

	n = [x[0] for x in SCORERS[t]]; w = np.array([x[1] for x in SCORERS[t]], float)
	return str(rng.choice(n, p=w / w.sum()))
def minutes(n, lo, hi):
	return sorted(int(x) for x in rng.choice(range(lo, hi + 1), size=n, replace=False))

PLAN = [('R16', 'Norway', 'East Rutherford', 'Estadio Nueva York / Nueva Jersey', False), ('QF', 'England', 'Miami Gardens', 'Estadio de Miami', False),
	('SF', 'Argentina', 'Atlanta', 'Estadio de Atlanta', False), ('F', 'Spain', 'East Rutherford', 'Estadio Nueva York / Nueva Jersey', True)]
CITY_ES = {'East Rutherford': 'Nueva York / Nueva Jersey', 'Miami Gardens': 'Miami', 'Atlanta': 'Atlanta'}
matches = []
for tag, opp, city, stadium, et_final in PLAN:
	dr = dr_of('Brazil', opp)
	TGT = {'R16': (2, 1, False, 2, 1), 'QF': (3, 2, False, 3, 2), 'SF': (2, 1, False, 2, 1), 'F': (2, 1, True, 1, 1)}
	a, b, et, a90, b90 = TGT[tag]
	o = NAMEK[opp]
	mins90 = minutes(a90 + b90, 3, 89)
	team90 = ['BRA'] * a90 + [o] * b90
	rng.shuffle(team90)
	# make sure the final 90-min sequence never has Brazil already eliminated-looking? fine
	goals = [{'t': t, 'm': m, 'who': who(t)} for t, m in zip(team90, mins90)]
	if et:
		etn = (a - a90) + (b - b90)
		mins_et = minutes(etn, 92, 119)
		team_et = ['BRA'] * (a - a90) + [o] * (b - b90)
		goals += [{'t': t, 'm': m, 'who': who(t)} for t, m in zip(team_et, mins_et)]
	if tag == 'F': goals[-1]['who'] = 'Neymar'
	pos = int(np.clip(50 + dr / 25 + rng.normal(0, 4), 35, 68)); sha = int(np.clip(12 + dr / 60 + rng.normal(0, 3), 6, 24)); shb = int(np.clip(11 - dr / 60 + rng.normal(0, 3), 4, 20))
	matches.append({'tag': tag, 'o': o, 'ga': a, 'gb': b, 'et': et, 'pens': None, 'goals': goals, 'pos': pos, 'sha': sha, 'shb': shb, 'p': pwdl(dr), 'city': CITY_ES[city], 'stadium': stadium, 'elo': [elo('Brazil'), elo(opp)]})
	print(tag, opp, a, b, 'et' if et else '', [(g['t'], g['m'], g['who']) for g in goals], pwdl(dr))

# bracket for display
def mk(a, b, ga, gb, et=False, pens=None):
	w = a if (ga > gb or (ga == gb and pens and pens[0] > pens[1])) else b
	return {'a': NAMEK[a], 'b': NAMEK[b], 'ga': ga, 'gb': gb, 'et': et, 'pens': list(pens) if pens else None, 'win': NAMEK[w]}
mm = {m['tag']: m for m in matches}
ko = [[], [], [], []]
for a, b, c, h in R16:
	if a == 'Brazil': ko[0].append(mk('Brazil', 'Norway', mm['R16']['ga'], mm['R16']['gb'], mm['R16']['et']))
	else: ga, gb, et, pens = REAL[(a, b)]; ko[0].append(mk(a, b, ga, gb, et, pens))
ko[1] = [mk('France', 'Morocco', 2, 0), mk('Spain', 'Belgium', 2, 1), mk('Brazil', 'England', mm['QF']['ga'], mm['QF']['gb'], mm['QF']['et']), mk('Argentina', 'Switzerland', 3, 1)]
ko[2] = [mk('France', 'Spain', 0, 2), mk('Brazil', 'Argentina', mm['SF']['ga'], mm['SF']['gb'], mm['SF']['et'])]
ko[3] = [mk('Brazil', 'Spain', mm['F']['ga'], mm['F']['gb'], mm['F']['et'])]

# head to head (Brazil's point of view): from the v15 data (rival wins = ow)
opp15 = json.load(open('/home/claude/emh/src/v15/opp.json'))
h2h = {}
for k in ['MAR', 'HTI', 'SCT', 'JPN', 'NOR', 'ENG', 'ARG', 'ESP']:
	o = opp15[k]; h2h[k] = {'p': o['p'], 'w': o['ol'], 'd': o['d'], 'l': o['ow'], 'gf': o['ga'], 'ga': o['gf']}
tot = {'p': sum(h['p'] for h in h2h.values()), 'w': sum(h['w'] for h in h2h.values()), 'd': sum(h['d'] for h in h2h.values()), 'l': sum(h['l'] for h in h2h.values())}
out = {
	'arg': matches, 'ko': ko, 'h2h': h2h, 'tot': tot, 'wc': {'p': 119, 'w': 79, 'd': 20, 'l': 20},
	'elo': {NAMEK[k]: elo(k) for k in NAMEK if k in E},
	'sims': {'N': N, 'champ': {NAMEK[k]: v for k, v in champ.items()}, 'reach': {k: v for k, v in reach.items()}, 'elim': {NAMEK[k]: v for k, v in elim.items()}, 'finals': {}},
	'groups': {'C': ['BRA', 'MAR', 'SCT', 'HTI']},
	'tables': {'C': [{'t': 'BRA', 'pts': 7, 'w': 2, 'd': 1, 'l': 0, 'gf': 7, 'ga': 1}, {'t': 'MAR', 'pts': 7, 'w': 2, 'd': 1, 'l': 0, 'gf': 6, 'ga': 3}, {'t': 'SCT', 'pts': 3, 'w': 1, 'd': 0, 'l': 2, 'gf': 1, 'ga': 4}, {'t': 'HTI', 'pts': 0, 'w': 0, 'd': 0, 'l': 3, 'gf': 2, 'ga': 8}]},
	'thirds': [], 'gm': {},
	'es': {}, 'flag': {},
}
json.dump(out, open('/home/claude/emh/src/v17/run17.json', 'w'), ensure_ascii=False, indent=0)
