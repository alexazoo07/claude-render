# Brazil head-to-head vs every national team (results.csv, penalties = draw).
# Argentina uses the AFA official record supplied by Jordi (43 ARG wins, 26 draws, 42 BRA wins, 111 matches).
import csv, json, os
ROOT = '/home/claude/emh'
SRC = '/home/claude/international_results/results.csv'
T = {
 'Argentina': ('ARG', 'ar'), 'Paraguay': ('PRY', 'py'), 'Uruguay': ('URY', 'uy'), 'Chile': ('CHL', 'cl'), 'Peru': ('PER', 'pe'),
 'Mexico': ('MEX', 'mx'), 'Colombia': ('COL', 'co'), 'Ecuador': ('ECU', 'ec'), 'Bolivia': ('BOL', 'bo'), 'Venezuela': ('VEN', 've'),
 'England': ('ENG', 'gb-eng'), 'Germany': ('DEU', 'de'), 'Portugal': ('PRT', 'pt'), 'United States': ('USA', 'us'), 'France': ('FRA', 'fr'),
 'Italy': ('ITA', 'it'), 'Sweden': ('SWE', 'se'), 'Japan': ('JPN', 'jp'), 'Russia': ('RUS', 'ru'), 'Poland': ('POL', 'pl'),
 'Costa Rica': ('CRI', 'cr'), 'Netherlands': ('NLD', 'nl'), 'Scotland': ('SCT', 'gb-sct'), 'Spain': ('ESP', 'es'), 'Switzerland': ('CHE', 'ch'),
 'Austria': ('AUT', 'at'), 'Wales': ('WLS', 'gb-wls'), 'Australia': ('AUS', 'au'), 'South Korea': ('KOR', 'kr'), 'Bulgaria': ('BGR', 'bg'),
 'Honduras': ('HND', 'hn'), 'Egypt': ('EGY', 'eg'), 'Republic of Ireland': ('IRL', 'ie'), 'Cameroon': ('CMR', 'cm'), 'Turkey': ('TUR', 'tr'),
 'Serbia': ('SRB', 'rs'), 'Croatia': ('HRV', 'hr'), 'Panama': ('PAN', 'pa'), 'Hungary': ('HUN', 'hu'), 'Belgium': ('BEL', 'be'),
 'Saudi Arabia': ('SAU', 'sa'), 'Norway': ('NOR', 'no'), 'Ghana': ('GHA', 'gh'), 'South Africa': ('ZAF', 'za'), 'Denmark': ('DNK', 'dk'),
 'Algeria': ('DZA', 'dz'), 'Haiti': ('HTI', 'ht'), 'Canada': ('CAN', 'ca'), 'Morocco': ('MAR', 'ma'), 'Israel': ('ISR', 'il'),
 'Romania': ('ROU', 'ro'), 'Tunisia': ('TUN', 'tn'), 'New Zealand': ('NZL', 'nz'), 'Finland': ('FIN', 'fi'), 'El Salvador': ('SLV', 'sv'),
 'Jamaica': ('JAM', 'jm'), 'China': ('CHN', 'cn'), 'Senegal': ('SEN', 'sn'), 'Greece': ('GRC', 'gr'), 'Iceland': ('ISL', 'is'),
 'Bosnia and Herzegovina': ('BIH', 'ba'), 'Czech Republic': ('CZE', 'cz'), 'Guatemala': ('GTM', 'gt'), 'Nigeria': ('NGA', 'ng'), 'DR Congo': ('COD', 'cd'),
 'Northern Ireland': ('NIR', 'gb-nir'), 'Slovakia': ('SVK', 'sk'), 'Lithuania': ('LTU', 'lt'), 'Andorra': ('AND', 'ad'), 'Latvia': ('LVA', 'lv'),
 'Thailand': ('THA', 'th'), 'Malaysia': ('MYS', 'my'), 'Hong Kong': ('HKG', 'hk'), 'United Arab Emirates': ('ARE', 'ae'), 'Estonia': ('EST', 'ee'),
 'Oman': ('OMN', 'om'), 'Zimbabwe': ('ZWE', 'zw'), 'Tanzania': ('TZA', 'tz'), 'North Korea': ('PRK', 'kp'), 'Ivory Coast': ('CIV', 'ci'),
 'Iran': ('IRN', 'ir'), 'Ukraine': ('UKR', 'ua'), 'Gabon': ('GAB', 'ga'), 'Iraq': ('IRQ', 'iq'), 'Zambia': ('ZMB', 'zm'),
 'Qatar': ('QAT', 'qa'), 'Guinea': ('GIN', 'gn'), 'India': ('IND', 'in'),
}
H = {}
for r in csv.DictReader(open(SRC)):
	if r['home_score'] == 'NA': continue
	a, b = r['home_team'], r['away_team']
	if 'Brazil' not in (a, b): continue
	o = b if a == 'Brazil' else a
	if o not in T: continue
	gb = int(r['home_score']) if a == 'Brazil' else int(r['away_score'])
	go = int(r['away_score']) if a == 'Brazil' else int(r['home_score'])
	h = H.setdefault(o, {'p': 0, 'ow': 0, 'd': 0, 'ol': 0, 'gf': 0, 'ga': 0, 'first': r['date'][:4], 'last': None})
	h['p'] += 1; h['gf'] += go; h['ga'] += gb
	if go > gb: h['ow'] += 1
	elif go == gb: h['d'] += 1
	else: h['ol'] += 1
	h['last'] = [go, gb, r['tournament'], r['date']]
# AFA official Argentina record (rival = Argentina)
H['Argentina'].update({'p': 111, 'ow': 43, 'd': 26, 'ol': 42})
out = {}
world = json.load(open(f'{ROOT}/src/world.json'))
for n, (k, fl) in T.items():
	h = H[n]
	r = h['ow'] / h['p']
	cat = 'PAN' if h['ow'] == 0 else 'SIN' if h['ow'] >= h['ol'] else 'MIE' if r < 0.25 else 'RES'
	assert k in world, k
	assert os.path.exists(f'{ROOT}/public/flags/{fl}.svg'), fl
	out[k] = {'n': n, 'flag': fl, **h, 'cat': cat}
json.dump(out, open(f'{ROOT}/src/v15/opp.json', 'w'), ensure_ascii=False, indent=0)
from collections import Counter
print(len(out), Counter(o['cat'] for o in out.values()))
for c in ['SIN', 'RES']:
	print(c, [(k, o['ow'], o['d'], o['ol']) for k, o in out.items() if o['cat'] == c])
print('MIE', [k for k, o in out.items() if o['cat'] == 'MIE'])
print('PAN', [k for k, o in out.items() if o['cat'] == 'PAN'])
print('tot', sum(o['p'] for o in out.values()))
