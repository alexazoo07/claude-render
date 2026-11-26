import csv, json, collections
R='/home/claude/international_results/results.csv'
fn={r['former']:r['current'] for r in csv.DictReader(open('/home/claude/international_results/former_names.csv'))}
E=json.load(open('/tmp/claude-0/-home-claude/babfd5d1-b0c2-5e42-bdf7-4a1f3d37d27f/scratchpad/elo.json'))
TEAMS={'ESP':'Spain','ENG':'England','FRA':'France','PRT':'Portugal','CHE':'Switzerland','NLD':'Netherlands','BEL':'Belgium','ITA':'Italy','DEU':'Germany','NOR':'Norway','DNK':'Denmark','HRV':'Croatia','AUT':'Austria','GRC':'Greece','SWE':'Sweden','TUR':'Turkey','SCT':'Scotland','SVN':'Slovenia','HUN':'Hungary','IRL':'Republic of Ireland','KOS':'Kosovo','UKR':'Ukraine','BIH':'Bosnia and Herzegovina','ARG':'Argentina'}
UEFA=set("Albania|Andorra|Armenia|Austria|Azerbaijan|Belarus|Belgium|Bosnia and Herzegovina|Bulgaria|Croatia|Cyprus|Czech Republic|Denmark|England|Estonia|Faroe Islands|Finland|France|Georgia|Germany|Gibraltar|Greece|Hungary|Iceland|Israel|Italy|Kazakhstan|Kosovo|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Moldova|Montenegro|Netherlands|North Macedonia|Northern Ireland|Norway|Poland|Portugal|Republic of Ireland|Romania|Russia|San Marino|Scotland|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Turkey|Ukraine|Wales|Czechoslovakia|Yugoslavia|Soviet Union|German DR|Serbia and Montenegro|CIS".split('|'))
H=collections.defaultdict(lambda: dict(p=0,w=0,d=0,l=0,gf=0,ga=0,ms=[]))
tot=dict(p=0,w=0,d=0,l=0)
for r in csv.DictReader(open(R)):
    if r['home_score'] in ('NA',''): continue
    h=fn.get(r['home_team'],r['home_team']); a=fn.get(r['away_team'],r['away_team'])
    if 'Argentina' not in (h,a): continue
    me=h=='Argentina'; o=a if me else h
    gf,ga=(int(r['home_score']),int(r['away_score'])) if me else (int(r['away_score']),int(r['home_score']))
    if o in UEFA:
        tot['p']+=1; tot['w']+=gf>ga; tot['d']+=gf==ga; tot['l']+=gf<ga
    x=H[o]; x['p']+=1; x['w']+=gf>ga; x['d']+=gf==ga; x['l']+=gf<ga; x['gf']+=gf; x['ga']+=ga; x['ms'].append([r['date'],gf,ga,r['tournament'],r['city']])
print('ARG vs UEFA total',tot, 'rivals', len([o for o in H if o in UEFA]))
out={}
for k,n in TEAMS.items():
    if k=='ARG': continue
    x=H.get(n,dict(p=0,w=0,d=0,l=0,gf=0,ga=0,ms=[]))
    out[k]={'n':n,'elo':round(E[n]),'p':x['p'],'w':x['w'],'d':x['d'],'l':x['l'],'gf':x['gf'],'ga':x['ga'],'ms':x['ms']}
    print(k,round(E[n]),x['p'],x['w'],x['d'],x['l'],x['gf'],x['ga'], [m for m in x['ms'] if m[3]!='Friendly'][-4:])
# wins by tournament type vs Europe in World Cups
wc=collections.Counter()
for o,x in H.items():
    if o in UEFA:
        for m in x['ms']:
            if m[3]=='FIFA World Cup': wc['p']+=1; wc['w']+=m[1]>m[2]; wc['d']+=m[1]==m[2]; wc['l']+=m[1]<m[2]
print('WC vs UEFA',wc)
best=sorted([(x['w'],o) for o,x in H.items() if o in UEFA],reverse=True)[:6]; print('most wins vs',best)
worst=sorted([(x['l'],o) for o,x in H.items() if o in UEFA],reverse=True)[:6]; print('most losses vs',worst)
json.dump({'tot':tot,'wc':wc,'opp':out,'eloARG':round(E['Argentina'])},open('/home/claude/emh/src/v14_h2h.json','w'),ensure_ascii=False)
