"""countries.geojson + England/Scotland/Wales map units. usage: geo.py countries.geojson map_units.geojson out.geojson"""
import sys, json
a = json.load(open(sys.argv[1])); m = json.load(open(sys.argv[2]))
for f in m['features']:
    gu = f['properties'].get('GU_A3')
    if gu in ('ENG', 'SCT', 'WLS'):
        f['properties']['ADM0_A3'] = gu; a['features'].append(f)
json.dump(a, open(sys.argv[3], 'w'))
print('ok', len(a['features']))
