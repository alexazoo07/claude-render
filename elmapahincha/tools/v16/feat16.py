# Featured alternate timeline for video 16 (scorelines sampled from the model, conditioned on the chosen outcome)
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/emh/tools/v16')
rng = np.random.default_rng(1987)
RP = json.load(open('/home/claude/emh/src/v16/replay16.json'))
SIM = json.load(open('/home/claude/emh/src/v16/sim16.json'))
K = {'Spain': 'ESP', 'France': 'FRA', 'Brazil': 'BRA', 'Portugal': 'PRT', 'Italy': 'ITA', 'Netherlands': 'NLD', 'Chile': 'CHL', 'Australia': 'AUS', 'Mexico': 'MEX',
	'Costa Rica': 'CRI', 'Argentina': 'ARG', 'Germany': 'DEU', 'Russia': 'RUS', 'Croatia': 'HRV', 'England': 'ENG', 'Morocco': 'MAR', 'Poland': 'POL', 'Wales': 'WLS',
	'Paraguay': 'PRY', 'Switzerland': 'CHE', 'Ukraine': 'UKR', 'Denmark': 'DNK', 'Georgia': 'GEO', 'Austria': 'AUT', 'Belgium': 'BEL', 'Colombia': 'COL', 'Ecuador': 'ECU', 'Canada': 'CAN'}

def sample(dr, outcome, ko=True):
	"""outcome: 'W' / 'L' ; returns (a, b, pens or None)"""
	l1 = 1.30 * 10 ** (dr / 1300); l2 = 1.30 * 10 ** (-dr / 1300)
	for _ in range(100000):
		a, b = int(rng.poisson(l1)), int(rng.poisson(l2)); et = False
		pens = None
		if a == b and ko:
			a += int(rng.poisson(l1 / 3)); b += int(rng.poisson(l2 / 3)); et = True
			if a == b:
				w = outcome == 'W'
				pa = int(rng.choice([4, 5, 3], p=[0.5, 0.3, 0.2]))
				pb = pa - int(rng.integers(1, 3)) if w else pa + int(rng.integers(1, 3))
				pb = max(1, min(5, pb))
				if pb == pa: pb = pa - 1 if w else pa + 1
				pens = [pa, pb] if pa <= 5 and pb <= 5 else ([4, 3] if w else [3, 4])
		res = 'W' if (a > b or (pens and pens[0] > pens[1])) else 'L' if (a < b or (pens and pens[0] < pens[1])) else 'D'
		if res == outcome: return a, b, pens, et
	raise RuntimeError

def messi_goals(n):
	return int(sum(rng.random() < 0.42 for _ in range(n)))

PLAN = {'WC2006': 'WL', 'EU2016': 'WL', 'WC2018': 'WWWW', 'EU2020': 'WL', 'WC2022': 'WL'}
ROUNDS = ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL']
out = {}
for tid, r in RP.items():
	ms = []
	if tid == 'WC2014':
		for g in r['group']:
			w, d, l = g['p']
			dr = 0
			# reconstruct dr from p via inverse search
			best = min(range(-600, 601, 5), key=lambda x: abs((1 / (1 + 10 ** (-x / 400))) - (w + d / 2)))
			a, b, _, _ = sample(best + 0, 'W', ko=False)
			real = g['real']; rs = real[1] if real[0] == 'Spain' else real[2]; ro = real[2] if real[0] == 'Spain' else real[1]
			ms.append({'round': 'GRUPO B', 'opp': K[g['opp']], 'sc': [a, b], 'pens': None, 'et': False, 'p': round(w, 3), 'win': True, 'messi': messi_goals(a), 'real': [rs, ro]})
		path = r['slots']['1']
		dr_map = {'Mexico': 150, 'Costa Rica': 330, 'Argentina': 110, 'Germany': 60}
		for k, o in enumerate(path):
			# p from a fresh calc using elo snapshot
			import sim16 as S
			E = S.elo_at('2014-06-12'); own = E['Spain'] + r['boost']; oe = E.get(o, 1500) - (130 if o == 'Argentina' else 0)
			home = 0
			dr = own - oe + home
			import sim16b as B
			p, _, _ = B.pwin(dr)
			a, b, pens, et = sample(dr, 'W')
			ms.append({'round': ROUNDS[k], 'opp': K[o], 'sc': [a, b], 'pens': pens, 'et': et, 'p': round(float(p), 3), 'win': True, 'messi': messi_goals(a), 'real': None})
		champ = True
	else:
		plan = PLAN[tid]
		k0 = r['k0']
		for j, (m, oc) in enumerate(zip(r['path'], plan)):
			a, b, pens, et = sample(m['dr'], oc)
			real = m['real']
			rr = None
			if real[0] == 'Spain' or real[3] == 'Spain':
				rs = real[1] if real[0] == 'Spain' else real[2]; ro = real[2] if real[0] == 'Spain' else real[1]; rr = [rs, ro]
			ms.append({'round': ROUNDS[k0 + j], 'opp': K[m['opp']], 'sc': [a, b], 'pens': pens, 'et': et, 'p': m['p'], 'p0': m['p0'], 'win': oc == 'W', 'messi': messi_goals(a), 'real': rr})
		champ = plan.endswith('W') and len(plan) == len(r['path'])
	out[tid] = {'champ_p': r['champ'], 'boost': r['boost'], 'elo': r['elo'], 'elo_m': r['elo_m'], 'matches': ms, 'champ': champ, 'before': r.get('before', [])}
	print(tid, champ, [(m['round'], m['opp'], m['sc'], m['pens'], m['et'], m['messi'], m['p']) for m in ms])
# Argentina without Messi
arg = {}
for r in SIM['ARG']:
	if r['id'] in ('CA2021', 'WC2022', 'CA2024'):
		arg[r['id']] = {'with': r['base_champ'], 'without': r['champ'], 'stages': r['stages'], 'base_stages': r['base']}
arg['FIN2022'] = {'with': 0.649, 'without': 0.505}
json.dump({'esp': out, 'arg': arg}, open('/home/claude/emh/src/v16/feat16.json', 'w'), ensure_ascii=False, indent=0)
