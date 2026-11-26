import random, json, sys
pts={'ARG':1972.8,'BRA':1806.51,'COL':1735.8,'URY':1635.54,'ECU':1587.07,'PRY':1552.3,'VEN':1465.87,'CHL':1458.97,'PER':1450.95,'BOL':1322.19}
nb={'ARG':'URY,PRY,CHL,BRA,BOL','BRA':'VEN,URY,PER,PRY,COL,BOL,ARG','URY':'BRA,ARG','COL':'VEN,PER,ECU,BRA','ECU':'PER,COL','PRY':'BRA,BOL,ARG','PER':'ECU,COL,CHL,BRA,BOL','CHL':'PER,BOL,ARG','VEN':'COL,BRA','BOL':'PER,PRY,CHL,BRA,ARG'}
nb={k:v.split(',') for k,v in nb.items()}
def wp(a,b,own):
    pa=pts[a]+25*(sum(1 for c in own if own[c]==a)-1); pb=pts[b]+25*(sum(1 for c in own if own[c]==b)-1)
    return 1/(10**(-(pa-pb)/600)+1)
def score(r,win):
    g=r.choice([(1,0),(2,1),(2,0),(3,1),(1,0),(2,1),(3,2),(4,1)])
    return g
def run(seed):
    r=random.Random(seed); own={c:c for c in pts}; log=[]
    # round 1 forced
    own['PER']='CHL'; log.append(dict(t='war',a='CHL',d='PER',p=round(wp('CHL','PER',{c:c for c in pts}),3),win='CHL',s=[2,1]))
    rnd=1
    while len(set(own.values()))>1 and rnd<40:
        rnd+=1; alive=sorted(set(own.values()))
        a=r.choice(alive)
        ev=r.random()
        conq=[c for c in own if own[c]==a and c!=a]
        if ev<0.12 and conq:
            c=r.choice(conq); own[c]=c; log.append(dict(t='rebel',a=a,c=c)); continue
        terr=[c for c in own if own[c]==a]
        targets=sorted({own[n] for c in terr for n in nb[c] if own[n]!=a})
        if not targets: continue
        d=r.choice(targets); p=wp(a,d,own)
        w=a if r.random()<p else d; l=d if w==a else a
        g=score(r,w)
        for c in own:
            if own[c]==l: own[c]=w
        log.append(dict(t='war',a=a,d=d,p=round(p,3),win=w,s=list(g)))
    return log, list(set(own.values()))[0]
res=[]
for seed in range(3000):
    log,champ=run(seed)
    n=len(log)
    last=[e for e in log if e['t']=='war'][-1]
    final={last['a'],last['d']}
    reb=sum(1 for e in log if e['t']=='rebel')
    upsets=sum(1 for e in log if e['t']=='war' and ((e['win']==e['a'])!=(e['p']>=0.5)))
    if final=={'ARG','BRA'} and 15<=n<=19 and reb>=1 and upsets>=2:
        res.append((seed,n,champ,reb,upsets))
print(len(res)); print(res[:15])
