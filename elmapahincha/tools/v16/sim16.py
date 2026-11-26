# Video 16: What if Messi had played for Spain?
# - Elo (eloratings method) snapshot right before each tournament, from the full results dataset
# - Spain WITH Messi (+boost) and Argentina WITHOUT Messi (-boost) replay their real tournaments
# - Group: other group results kept real, own matches simulated. Knockouts: the team takes over the bracket
#   slot it would occupy and meets the real opponents of whoever held that slot (if it eliminates X, it inherits X's path)
import pandas as pd, numpy as np, json, collections, sys
rng = np.random.default_rng(16)
R = pd.read_csv('/home/claude/international_results/results.csv').dropna(subset=['home_score'])
R = R.sort_values('date').reset_index(drop=True)
SH = pd.read_csv('/home/claude/international_results/shootouts.csv')
SHW = {(d, h, a): w for d, h, a, w in zip(SH.date, SH.home_team, SH.away_team, SH.winner)}
fn = pd.read_csv('/home/claude/international_results/former_names.csv'); REN = dict(zip(fn.former, fn.current))

def K(t):
	if t == 'FIFA World Cup': return 60
	if t in ('UEFA Euro', 'Copa América', 'African Cup of Nations', 'AFC Asian Cup', 'Gold Cup', 'Confederations Cup', 'CONCACAF Nations League', 'UEFA Nations League'): return 50
	if 'qualification' in t: return 40
	if t == 'Friendly': return 20
	return 30
def elo_at(date):
	E = {}
	for h, a, hs, as_, t, neu, d in zip(R.home_team, R.away_team, R.home_score, R.away_score, R.tournament, R.neutral, R.date):
		if d >= date: break
		h = REN.get(h, h); a = REN.get(a, a)
		eh = E.get(h, 1500); ea = E.get(a, 1500)
		dr = eh - ea + (0 if neu else 100)
		we = 1 / (10 ** (-dr / 400) + 1)
		w = 1 if hs > as_ else 0.5 if hs == as_ else 0
		gd = abs(hs - as_); g = 1 if gd <= 1 else 1.5 if gd == 2 else (11 + gd) / 8
		dd = K(t) * g * (w - we); E[h] = eh + dd; E[a] = ea - dd
	return E

# Messi boost in Elo points by year (model assumption of the channel, shown on screen)
BOOST = {2006: 50, 2007: 80, 2008: 100, 2010: 120, 2011: 130, 2012: 140, 2014: 130, 2015: 125, 2016: 120, 2018: 100, 2019: 95, 2021: 90, 2022: 110, 2024: 60, 2026: 70}
TOURS = [  # id, dataset tournament name, start, end, ko_start, auto-qualifiers per group, pts a 3rd needs (None = thirds out)
	('WC2006', 'FIFA World Cup', '2006-06-09', '2006-07-09', '2006-06-24', 2, None),
	('CA2007', 'Copa América', '2007-06-26', '2007-07-15', '2007-07-07', 2, 4),
	('EU2008', 'UEFA Euro', '2008-06-07', '2008-06-29', '2008-06-19', 2, None),
	('WC2010', 'FIFA World Cup', '2010-06-11', '2010-07-11', '2010-06-26', 2, None),
	('CA2011', 'Copa América', '2011-07-01', '2011-07-24', '2011-07-16', 2, 4),
	('EU2012', 'UEFA Euro', '2012-06-08', '2012-07-01', '2012-06-21', 2, None),
	('WC2014', 'FIFA World Cup', '2014-06-12', '2014-07-13', '2014-06-28', 2, None),
	('CA2015', 'Copa América', '2015-06-11', '2015-07-04', '2015-06-24', 2, 4),
	('CA2016', 'Copa América', '2016-06-03', '2016-06-26', '2016-06-16', 2, None),
	('EU2016', 'UEFA Euro', '2016-06-10', '2016-07-10', '2016-06-25', 2, 4),
	('WC2018', 'FIFA World Cup', '2018-06-14', '2018-07-15', '2018-06-30', 2, None),
	('CA2019', 'Copa América', '2019-06-14', '2019-07-07', '2019-06-27', 2, 4),
	('EU2020', 'UEFA Euro', '2021-06-11', '2021-07-11', '2021-06-26', 2, 4),
	('CA2021', 'Copa América', '2021-06-13', '2021-07-10', '2021-07-02', 4, None),
	('WC2022', 'FIFA World Cup', '2022-11-20', '2022-12-18', '2022-12-03', 2, None),
	('EU2024', 'UEFA Euro', '2024-06-14', '2024-07-14', '2024-06-29', 2, 4),
	('CA2024', 'Copa América', '2024-06-20', '2024-07-14', '2024-07-04', 2, None),
	('WC2026', 'FIFA World Cup', '2026-06-11', '2026-07-19', '2026-06-28', 2, 4),
]
SPAIN_T = ['WC2006', 'EU2008', 'WC2010', 'EU2012', 'WC2014', 'EU2016', 'WC2018', 'EU2020', 'WC2022', 'EU2024', 'WC2026']
ARG_T = ['WC2006', 'CA2007', 'WC2010', 'CA2011', 'WC2014', 'CA2015', 'CA2016', 'WC2018', 'CA2019', 'CA2021', 'WC2022', 'CA2024', 'WC2026']

def winner(row):
	if row.home_score > row.away_score: return row.home_team
	if row.away_score > row.home_score: return row.away_team
	return SHW.get((row.date, row.home_team, row.away_team))

def p_match(dr, ko):
	# Poisson goals; dr = elo difference (team - opp, incl. home); returns (win, draw, loss) by 20k-sample table
	l1 = 1.30 * 10 ** (dr / 1300); l2 = 1.30 * 10 ** (-dr / 1300)
	return l1, l2

def play(dr, ko):
	l1, l2 = p_match(dr, ko)
	a, b = rng.poisson(l1), rng.poisson(l2)
	if a != b or not ko: return a, b, None
	a2, b2 = rng.poisson(l1 / 3), rng.poisson(l2 / 3)
	a += a2; b += b2
	if a != b: return a, b, None
	pw = 0.5 + max(-0.1, min(0.1, dr / 2000))
	return a, b, (rng.random() < pw)

N = 10000
def simulate(team, tid, sign, other_boost):
	_, tname, s, e, ko0, q, t3 = next(t for t in TOURS if t[0] == tid)
	yr = int(e[:4]); b = BOOST[yr]
	E = elo_at(s)
	M = R[(R.tournament == tname) & (R.date >= s) & (R.date <= e)]
	mine = M[(M.home_team == team) | (M.away_team == team)]
	grp = mine[mine.date < ko0]
	opps = [r.away_team if r.home_team == team else r.home_team for r in grp.itertuples()]
	G = [team] + opps
	gm = M[(M.date < ko0) & M.home_team.isin(G) & M.away_team.isin(G)]
	ko = M[M.date >= ko0]
	# real standings
	def table(res):
		T = {t: [0, 0, 0] for t in G}
		for h, a, hs, as_ in res:
			T[h][1] += hs - as_; T[a][1] += as_ - hs; T[h][2] += hs; T[a][2] += as_
			if hs > as_: T[h][0] += 3
			elif hs < as_: T[a][0] += 3
			else: T[h][0] += 1; T[a][0] += 1
		return sorted(G, key=lambda t: (-T[t][0], -T[t][1], -T[t][2], rng.random())), T
	real = [(r.home_team, r.away_team, r.home_score, r.away_score) for r in gm.itertuples()]
	rorder, rT = table(real)
	def chain(t0):
		"""opponents by KO round for the slot held by t0 in reality (following whoever won)"""
		out = []; t = t0; prev = None
		ko_t = ko.copy()
		rounds = sorted(ko_t.date.unique())
		cur = t
		seen_dates = set()
		while True:
			mm = ko_t[((ko_t.home_team == cur) | (ko_t.away_team == cur)) & (ko_t.date > (prev or '0'))]
			if len(mm) == 0: break
			r = mm.iloc[0]
			opp = r.away_team if r.home_team == cur else r.home_team
			w = winner(r)
			# skip 3rd-place match: it comes after the semifinal loss; we stop at losers anyway
			out.append((opp, r.date, bool(r.neutral), r.home_team == cur))
			prev = r.date
			if w != cur: cur = w
		return out
	elo = lambda t: E.get(REN.get(t, t), 1500)
	own = elo(team) + sign * b
	def opp_elo(o):
		x = elo(o)
		if other_boost and o == other_boost[0]: x += other_boost[1]
		return x
	stage_ct = collections.Counter(); champ = 0; pos_ct = collections.Counter()
	paths = {}
	for p in range(1, len(G) + 1):
		if p <= len(rorder): paths[p] = chain(rorder[p - 1])
	nko_max = max(len(v) for v in paths.values())
	for _ in range(N):
		res = [x for x in real if team not in (x[0], x[1])]
		for r in grp.itertuples():
			o = r.away_team if r.home_team == team else r.home_team
			home = (not r.neutral) and r.home_team == team
			away = (not r.neutral) and r.away_team == team
			dr = own - opp_elo(o) + (100 if home else -100 if away else 0)
			a, bb, _ = play(dr, False)
			res.append((team, o, a, bb))
		order, T = table(res)
		pos = order.index(team) + 1
		pos_ct[pos] += 1
		qual = pos <= q or (t3 is not None and pos == 3 and T[team][0] >= t3)
		if not qual: stage_ct['GS'] += 1; continue
		path = paths.get(pos) or paths[2]
		if pos == 3 and len(paths.get(3, [])) == 0: path = paths[2]
		ok = True; k = 0
		for (o, d, neu, home) in path:
			if o == team:  # the slot would meet the team's own real slot: use whoever took its place
				o = order[[i for i, t in enumerate(rorder) if t == team][0]] if team in rorder else o
				if o == team: o = rorder[0] if rorder[0] != team else rorder[1]
			dr = own - opp_elo(o) + ((100 if home else -100) if not neu else 0)
			a, bb, pw = play(dr, True)
			won = a > bb or (a == bb and pw)
			k += 1
			if not won: stage_ct[f'K{k}'] += 1; ok = False; break
		if ok: stage_ct['CH'] += 1; champ += 1
	# real result
	rk = 0; rch = False
	for r in ko.itertuples():
		if team in (r.home_team, r.away_team):
			rk += 1; w = winner(r)
			if w != team: break
	else:
		rch = rk > 0
	real_stage = 'GS' if rk == 0 else ('CH' if rch else f'K{rk}')
	matches = []
	for r in mine.itertuples():
		matches.append({'d': r.date, 'h': r.home_team, 'a': r.away_team, 'hs': int(r.home_score), 'as': int(r.away_score), 'w': winner(r), 'ko': r.date >= ko0})
	return {'id': tid, 'team': team, 'boost': b, 'elo': round(elo(team)), 'group': G, 'real_order': rorder, 'real_stage': real_stage,
		'nko': nko_max, 'paths': {p: [x[0] for x in v] for p, v in paths.items()}, 'pos': {k: v / N for k, v in sorted(pos_ct.items())},
		'stages': {k: v / N for k, v in stage_ct.items()}, 'champ': champ / N, 'matches': matches}

if __name__ == '__main__':
	YR = {t[0]: int(t[3][:4]) for t in TOURS}
	out = {'ESP': [], 'ARG': []}
	for tid in SPAIN_T:
		bo = BOOST[YR[tid]]
		r = simulate('Spain', tid, +1, ('Argentina', -bo))
		r0 = simulate('Spain', tid, 0, None)
		r['base'] = r0['stages']; r['base_champ'] = r0['champ']
		out['ESP'].append(r)
		print('ESP', tid, r['real_stage'], 'champ %.1f%% (sin Messi %.1f%%)' % (100 * r['champ'], 100 * r0['champ']), r['paths'].get(1), file=sys.stderr)
	for tid in ARG_T:
		bo = BOOST[YR[tid]]
		r = simulate('Argentina', tid, -1, ('Spain', bo))
		r0 = simulate('Argentina', tid, 0, None)
		r['base'] = r0['stages']; r['base_champ'] = r0['champ']
		out['ARG'].append(r)
		print('ARG', tid, r['real_stage'], 'champ %.1f%% (con Messi %.1f%%)' % (100 * r['champ'], 100 * r0['champ']), file=sys.stderr)
	json.dump(out, open('/home/claude/emh/src/v16/sim16.json', 'w'), ensure_ascii=False)
