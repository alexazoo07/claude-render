import random, json, sys
from collections import Counter
teams=json.load(open('src/v6/teams6.json')); geo=json.load(open('src/v6/geo6.json'))
pts={t['iso']:t['elo'] for t in teams}
SEA=[('ENG','FRA'),('ENG','NLD'),('SCT','NIR'),('WLS','IRL'),('ISL','FRO'),('FRO','SCT'),('FRO','NOR'),('DNK','SWE'),('DNK','NOR'),('FIN','EST'),('MLT','ITA'),('CYP','TUR'),('CYP','GRC'),('CYP','ISR'),('ISR','TUR'),('ITA','ALB')]
nb={k:set(v) for k,v in geo['nb'].items()}
for a,b in SEA: nb[a].add(b); nb[b].add(a)
nb={k:sorted(v) for k,v in nb.items()}
BONUS=15
def wp(a,b,own):
    pa=pts[a]+BONUS*(sum(1 for c in own if own[c]==a)-1); pb=pts[b]+BONUS*(sum(1 for c in own if own[c]==b)-1)
    return 1/(10**(-(pa-pb)/400)+1)
def run(seed):
    r=random.Random(seed); own={c:c for c in pts}; log=[]
    while len(set(own.values()))>1 and len(log)<90:
        alive=sorted(set(own.values())); a=r.choice(alive)
        conq=[c for c in own if own[c]==a and c!=a]
        if r.random()<0.08 and conq:
            c=r.choice(conq); own[c]=c; log.append(dict(t='rebel',a=a,c=c)); continue
        terr=[c for c in own if own[c]==a]
        targets=sorted({own[n] for c in terr for n in nb[c] if own[n]!=a})
        if not targets: continue
        d=r.choice(targets); p=wp(a,d,own)
        w=a if r.random()<p else d; l=d if w==a else a
        g=r.choice([(1,0),(2,1),(2,0),(3,1),(1,0),(2,1),(3,2),(4,1),(3,0),(2,0)])
        for c in own:
            if own[c]==l: own[c]=w
        log.append(dict(t='war',a=a,d=d,p=round(p,3),win=w,s=list(g)))
    return log, list(set(own.values()))[0]
if __name__=='__main__':
    mode=sys.argv[1]
    if mode=='odds':
        N=20000; c=Counter(run(s+100000)[1] for s in range(N))
        odds={k:round(v/N*100,2) for k,v in c.most_common()}
        json.dump(odds,open('src/v6/odds6.json','w')); print(list(odds.items())[:15]); print('ISL',odds.get('ISL'),'LVA',odds.get('LVA'),'FRO',odds.get('FRO'))
    else:
        rank={t['iso']:t['rank'] for t in teams}
        res=[]
        for seed in range(30000):
            log,ch=run(seed); wars=[e for e in log if e['t']=='war']
            reb=sum(1 for e in log if e['t']=='rebel')
            ups=[e for e in wars if (e['win']==e['a'])!=(e['p']>=0.5)]
            final={wars[-1]['a'],wars[-1]['d']}
            if not(52<=len(log)<=60 and 3<=reb<=5 and len(ups)>=8): continue
            if 'ESP' not in final or ch not in ('ESP','ENG','FRA','PRT'): continue
            # cinderella: a team ranked >=30 that holds 5+ territories at some point
            own={c:c for c in pts}; best=0; who=None
            for e in log:
                if e['t']=='war':
                    l=e['d'] if e['win']==e['a'] else e['a']
                    for c in own:
                        if own[c]==l: own[c]=e['win']
                else: own[e['c']]=e['c']
                for k in own.values():
                    if rank[k]>=30:
                        n=sum(1 for c in own if own[c]==k)
                        if n>best: best=n; who=k
            if best>=5: res.append((seed,len(log),reb,len(ups),sorted(final),ch,who,best))
        print(len(res))
        for x in res[:40]: print(x)
