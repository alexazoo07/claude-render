import random, json, sys
pts={'MEX':1754.3,'USA':1690.33,'CAN':1571.34,'PAN':1478.41,'CRI':1456.03,'HND':1378.97,'JAM':1357.84,'CUW':1285.64,'HTI':1264.58,'GTM':1238.74,'SLV':1225.34,'TTO':1219.59,'NIC':1114.63,'DOM':1076.5,'PRI':1024.3,'CUB':981.42,'BLZ':907.0}
nb={'MEX':['USA','GTM','BLZ','CUB'],'USA':['CAN','MEX','CUB'],'CAN':['USA'],'GTM':['MEX','BLZ','SLV','HND'],'BLZ':['MEX','GTM'],'SLV':['GTM','HND'],'HND':['GTM','SLV','NIC'],'NIC':['HND','CRI'],'CRI':['NIC','PAN'],'PAN':['CRI','CUW'],'CUB':['MEX','USA','JAM','HTI'],'JAM':['CUB','HTI'],'HTI':['DOM','CUB','JAM'],'DOM':['HTI','PRI','CUW'],'PRI':['DOM','TTO'],'TTO':['PRI','CUW'],'CUW':['PAN','DOM','TTO']}
def wp(a,b,own):
    pa=pts[a]+25*(sum(1 for c in own if own[c]==a)-1); pb=pts[b]+25*(sum(1 for c in own if own[c]==b)-1)
    return 1/(10**(-(pa-pb)/600)+1)
def run(seed):
    r=random.Random(seed); own={c:c for c in pts}; log=[]
    while len(set(own.values()))>1 and len(log)<60:
        alive=sorted(set(own.values())); a=r.choice(alive)
        conq=[c for c in own if own[c]==a and c!=a]
        if r.random()<0.12 and conq:
            c=r.choice(conq); own[c]=c; log.append(dict(t='rebel',a=a,c=c)); continue
        terr=[c for c in own if own[c]==a]
        targets=sorted({own[n] for c in terr for n in nb[c] if own[n]!=a})
        if not targets: continue
        d=r.choice(targets); p=wp(a,d,own)
        w=a if r.random()<p else d; l=d if w==a else a
        g=r.choice([(1,0),(2,1),(2,0),(3,1),(1,0),(2,1),(3,2),(4,1)])
        for c in own:
            if own[c]==l: own[c]=w
        log.append(dict(t='war',a=a,d=d,p=round(p,3),win=w,s=list(g)))
    return log, list(set(own.values()))[0]
if __name__=='__main__':
    res=[]
    for seed in range(20000):
        log,ch=run(seed); wars=[e for e in log if e['t']=='war']
        reb=sum(1 for e in log if e['t']=='rebel')
        ups=[e for e in wars if (e['win']==e['a'])!=(e['p']>=0.5)]
        final={wars[-1]['a'],wars[-1]['d']}
        # deepest small team: last elimination round of CUW/HTI
        if final=={'MEX','USA'} and 18<=len(log)<=22 and 2<=reb<=4 and len(ups)>=3 and ch=='MEX':
            # cinderella: a team ranked >=80 that conquers 3+ territories at some point
            own={c:c for c in pts}; best=0; who=None
            for e in log:
                if e['t']=='war':
                    l=e['d'] if e['win']==e['a'] else e['a']
                    for c in own:
                        if own[c]==l: own[c]=e['win']
                else: own[e['c']]=e['c']
                for k in ['CUW','HTI','GTM','SLV','TTO','NIC','DOM','PRI','CUB','BLZ','JAM','HND']:
                    n=sum(1 for c in own if own[c]==k)
                    if n>best: best=n; who=k
            if best>=4: res.append((seed,len(log),reb,len(ups),who,best))
    print(len(res)); print(res[:20])
