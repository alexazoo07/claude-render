# Uruguay head-to-head vs every national team (results.csv up to 2026-10-06, penalties = draw)
# + Japan 3-1 Uruguay (24 Sep 2026, Forlán's debut; El Gráfico / Perfil), missing from the dataset.
# Defunct/regional teams excluded (USSR is listed as 'Russia' in the dataset and kept as Russia).
import csv, json
ROOT = '/home/claude/emh'
SRC = '/home/claude/international_results/results.csv'
F3 = json.load(open(f'{ROOT}/src/iso3flag.json'))
F3.update({'ENG': 'gb-eng', 'SCT': 'gb-sct', 'WLS': 'gb-wls', 'NIR': 'gb-nir'})
FIX = {'England': 'ENG', 'Scotland': 'SCT', 'Wales': 'WLS', 'Northern Ireland': 'NIR', 'Republic of Ireland': 'IRL', 'South Korea': 'KOR', 'Ivory Coast': 'CIV',
	'Russia': 'RUS', 'Iran': 'IRN', 'Turkey': 'TUR', 'Czech Republic': 'CZE', 'United States': 'USA', 'Venezuela': 'VEN', 'Bolivia': 'BOL', 'Cape Verde': 'CPV', 'Tahiti': 'PYF',
	'Argentina': 'ARG', 'Chile': 'CHL', 'Brazil': 'BRA', 'Paraguay': 'PRY', 'Peru': 'PER', 'Ecuador': 'ECU', 'Colombia': 'COL', 'Mexico': 'MEX', 'Germany': 'DEU', 'Italy': 'ITA',
	'Spain': 'ESP', 'Costa Rica': 'CRI', 'France': 'FRA', 'Japan': 'JPN', 'Australia': 'AUS', 'Netherlands': 'NLD', 'Israel': 'ISR', 'China': 'CHN', 'Romania': 'ROU', 'Jamaica': 'JAM',
	'Switzerland': 'CHE', 'Panama': 'PAN', 'Hungary': 'HUN', 'Austria': 'AUT', 'Portugal': 'PRT', 'Poland': 'POL', 'Saudi Arabia': 'SAU', 'Sweden': 'SWE', 'Haiti': 'HTI',
	'Indonesia': 'IDN', 'Canada': 'CAN', 'Guatemala': 'GTM', 'South Africa': 'ZAF', 'Uzbekistan': 'UZB', 'Norway': 'NOR', 'Belgium': 'BEL', 'Finland': 'FIN', 'India': 'IND',
	'Denmark': 'DNK', 'Serbia': 'SRB', 'New Zealand': 'NZL', 'Slovenia': 'SVN', 'Honduras': 'HND', 'Libya': 'LBY', 'Egypt': 'EGY', 'Algeria': 'DZA', 'Ghana': 'GHA', 'Estonia': 'EST',
	'Jordan': 'JOR', 'Bulgaria': 'BGR', 'Luxembourg': 'LUX', 'United Arab Emirates': 'ARE', 'Singapore': 'SGP', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Tunisia': 'TUN', 'Georgia': 'GEO',
	'Angola': 'AGO', 'Ukraine': 'UKR', 'Nigeria': 'NGA', 'Oman': 'OMN', 'Morocco': 'MAR', 'Trinidad and Tobago': 'TTO', 'Thailand': 'THA', 'Nicaragua': 'NIC', 'Cuba': 'CUB',
	'Dominican Republic': 'DOM'}
rows = [r for r in csv.DictReader(open(SRC)) if 'Uruguay' in (r['home_team'], r['away_team']) and r['home_score'] not in ('NA', '')]
rows.append({'date': '2026-09-24', 'home_team': 'Japan', 'away_team': 'Uruguay', 'home_score': '3', 'away_score': '1', 'tournament': 'Friendly'})
rows.sort(key=lambda r: r['date'])
H = {}
skip = []
for r in rows:
	a, b = r['home_team'], r['away_team']
	o = b if a == 'Uruguay' else a
	if o not in FIX: skip.append(o); continue
	k = FIX[o]
	gu = int(r['home_score']) if a == 'Uruguay' else int(r['away_score'])
	go = int(r['away_score']) if a == 'Uruguay' else int(r['home_score'])
	h = H.setdefault(k, {'n': o, 'flag': F3[k], 'p': 0, 'ow': 0, 'd': 0, 'ol': 0, 'gf': 0, 'ga': 0, 'first': r['date'][:4], 'last': None})
	h['p'] += 1; h['gf'] += go; h['ga'] += gu
	if go > gu: h['ow'] += 1
	elif go == gu: h['d'] += 1
	else: h['ol'] += 1
	h['last'] = [go, gu, r['tournament'], r['date']]
for k, h in H.items():
	h['cat'] = 'PAN' if h['ol'] == 0 else 'MIE' if h['ow'] > h['ol'] else 'RES' if h['ow'] == h['ol'] else 'SIN'
json.dump(H, open(f'{ROOT}/src/v18/opp.json', 'w'), ensure_ascii=False, indent=0)
import collections
print(len(H), collections.Counter(h['cat'] for h in H.values()), 'skipped', sorted(set(skip)))
print('JPN', H['JPN'])
print('PAN', [k for k, h in H.items() if h['cat'] == 'PAN'])
