# Conditional replay: Spain keeps everything it achieved alone; Messi enters at the match where Spain fell
# and the tournament is replayed from there (Spain inherits the path of whoever eliminated it).
import sys, json, collections
sys.path.insert(0, '/home/claude/emh/tools/v16')
import numpy as np
import sim16 as S
rng = np.random.default_rng(1610)
N = 10000
YR = {t[0]: int(t[3][:4]) for t in S.TOURS}
base = json.load(open('/home/claude/emh/src/v16/sim16.json'))
INFO = {r['id']: r for r in base['ESP']}

def pwin(dr, ko=True, n=20000):
	l1 = 1.30 * 10 ** (dr / 1300); l2 = 1.30 * 10 ** (-dr / 1300)
	a = rng.poisson(l1, n); b = rng.poisson(l2, n)
	if not ko: return (a > b).mean(), (a == b).mean(), (a < b).mean()
	d = a == b
	a2 = a + rng.poisson(l1 / 3, n) * d; b2 = b + rng.poisson(l2 / 3, n) * d
	pw = 0.5 + max(-0.1, min(0.1, dr / 2000))
	pen = (a2 == b2) & (rng.random(n) < pw)
	return ((a2 > b2) | pen).mean(), None, None

def ko_chain(tid, start_team, after_date):
	"""real KO matches of the slot, starting after a date, following winners"""
	_, tname, s, e, ko0, q, t3 = next(t for t in S.TOURS if t[0] == tid)
	M = S.R[(S.R.tournament == tname) & (S.R.date >= ko0) & (S.R.date <= e)]
	out = []; cur = start_team; prev = after_date
	while True:
		mm = M[((M.home_team == cur) | (M.away_team == cur)) & (M.date > prev)]
		if len(mm) == 0: break
		r = mm.iloc[0]
		opp = r.away_team if r.home_team == cur else r.home_team
		out.append({'opp': opp, 'date': r.date, 'neutral': bool(r.neutral), 'home': r.home_team == cur, 'real': [r.home_team, int(r.home_score), int(r.away_score), r.away_team, S.winner(r)]})
		prev = r.date
		w = S.winner(r)
		if w != cur: cur = w
	return out

ROUND = {'WC2006': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'], 'WC2014': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'], 'EU2016': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'],
	'WC2018': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'], 'EU2020': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'], 'WC2022': ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL']}

def replay(tid):
	yr = YR[tid]; b = S.BOOST[yr]
	inf = INFO[tid]
	_, tname, s, e, ko0, q, t3 = next(t for t in S.TOURS if t[0] == tid)
	E = S.elo_at(s)
	elo = lambda t: E.get(S.REN.get(t, t), 1500) + (-b if t == 'Argentina' else 0)
	own = E.get('Spain') + b
	M = S.R[(S.R.tournament == tname) & (S.R.date >= s) & (S.R.date <= e)]
	sp = M[(M.home_team == 'Spain') | (M.away_team == 'Spain')]
	res = {'id': tid, 'boost': b, 'elo': round(E['Spain']), 'elo_m': round(own)}
	if tid == 'WC2014':
		# group replay: Spain's 3 group games, rest real; Spain takes the slot of the real 1st (NED) or 2nd (CHI)
		G = inf['group']
		gm = M[(M.date < ko0) & M.home_team.isin(G) & M.away_team.isin(G)]
		real = [(r.home_team, r.away_team, int(r.home_score), int(r.away_score)) for r in gm.itertuples()]
		others = [x for x in real if 'Spain' not in x[:2]]
		mine = [x for x in real if 'Spain' in x[:2]]
		slots = {1: ko_chain(tid, inf['real_order'][0], ko0[:8] + '00'), 2: ko_chain(tid, inf['real_order'][1], ko0[:8] + '00')}
		gp = []
		for h, a, hs, as_ in mine:
			o = a if h == 'Spain' else h
			w, d, l = pwin(own - elo(o), ko=False)
			gp.append({'opp': o, 'p': [round(w, 3), round(d, 3), round(l, 3)], 'real': [h, hs, as_, a]})
		res['group'] = gp; res['slots'] = {k: [x['opp'] for x in v] for k, v in slots.items()}
		champ = 0; reach = collections.Counter(); posc = collections.Counter()
		for _ in range(N):
			T = {t: [0, 0, 0] for t in G}
			def add(h, a, hs, as_):
				T[h][1] += hs - as_; T[a][1] += as_ - hs; T[h][2] += hs; T[a][2] += as_
				if hs > as_: T[h][0] += 3
				elif hs < as_: T[a][0] += 3
				else: T[h][0] += 1; T[a][0] += 1
			for x in others: add(*x)
			for h, a, hs, as_ in mine:
				o = a if h == 'Spain' else h
				x, y, _ = S.play(own - elo(o), False)
				add('Spain', o, x, y)
			order = sorted(G, key=lambda t: (-T[t][0], -T[t][1], -T[t][2], rng.random()))
			pos = order.index('Spain') + 1; posc[pos] += 1
			if pos > 2: reach['GRUPOS'] += 1; continue
			ok = True
			for k, m in enumerate(slots[pos]):
				o = m['opp']
				x, y, pw = S.play(own - elo(o) + ((100 if m['home'] else -100) if not m['neutral'] else 0), True)
				if not (x > y or (x == y and pw)): reach[ROUND[tid][k]] += 1; ok = False; break
			if ok: champ += 1
		res['pos'] = {k: v / N for k, v in sorted(posc.items())}
		res['champ'] = champ / N; res['reach'] = {k: v / N for k, v in reach.items()}
		res['path'] = [{'opp': m['opp'], 'real': m['real']} for m in slots[1]]
		return res
	# knockout replay from the lost match
	ko = sp[sp.date >= ko0]
	lost = [r for r in ko.itertuples() if S.winner(r) != 'Spain'][0]
	before = [r for r in ko.itertuples() if r.date < lost.date]
	k0 = len(before)
	opp0 = lost.away_team if lost.home_team == 'Spain' else lost.home_team
	chain = [{'opp': opp0, 'date': lost.date, 'neutral': bool(lost.neutral), 'home': lost.home_team == 'Spain', 'real': [lost.home_team, int(lost.home_score), int(lost.away_score), lost.away_team, S.winner(lost)]}]
	chain += ko_chain(tid, opp0, lost.date)
	path = []
	for m in chain:
		dr = own - elo(m['opp']) + ((100 if m['home'] else -100) if not m['neutral'] else 0)
		p, _, _ = pwin(dr)
		p0, _, _ = pwin(E['Spain'] - elo(m['opp']) + ((100 if m['home'] else -100) if not m['neutral'] else 0))
		path.append({'opp': m['opp'], 'p': round(float(p), 3), 'p0': round(float(p0), 3), 'real': m['real'], 'dr': round(dr)})
	champ = 0; reach = collections.Counter()
	for _ in range(N):
		ok = True
		for k, m in enumerate(chain):
			dr = own - elo(m['opp']) + ((100 if m['home'] else -100) if not m['neutral'] else 0)
			x, y, pw = S.play(dr, True)
			if not (x > y or (x == y and pw)): reach[ROUND[tid][k0 + k]] += 1; ok = False; break
		if ok: champ += 1
	res.update({'k0': k0, 'path': path, 'champ': champ / N, 'reach': {k: v / N for k, v in reach.items()}, 'before': [[r.home_team, int(r.home_score), int(r.away_score), r.away_team] for r in before]})
	return res

if __name__ == '__main__':
	out = {}
	for tid in ['WC2006', 'WC2014', 'EU2016', 'WC2018', 'EU2020', 'WC2022']:
		r = replay(tid); out[tid] = r
		print(tid, 'elo', r['elo'], '->', r['elo_m'], 'champ %.1f%%' % (100 * r['champ']), r['reach'], [(m['opp'], m.get('p'), m.get('p0')) for m in r.get('path', [])], r.get('group'), r.get('pos'))
	print('expected extra titles', sum(r['champ'] for r in out.values()))
	json.dump(out, open('/home/claude/emh/src/v16/replay16.json', 'w'), ensure_ascii=False, indent=0)
