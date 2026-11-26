import json, random, math, collections, sys
D=json.load(open('/home/claude/emh/src/v14_h2h.json'))
ELO={k:v['elo'] for k,v in D['opp'].items()}; ELO['ARG']=D['eloARG']
POTS=[['ESP','ARG','ENG','FRA','PRT','CHE'],['NLD','BEL','ITA','DEU','NOR','DNK'],['HRV','AUT','GRC','SWE','TUR','SCT'],['SVN','HUN','IRL','KOS','UKR','BIH']]
G='ABCDEF'
def lam(a,b,et=False):
    dr=ELO[a]-ELO[b]; base=1.30*(1/3 if et else 1)
    return base*10**(dr/1300), base*10**(-dr/1300)
def pois(rng,l):
    L=math.exp(-l);k=0;p=1
    while True:
        p*=rng.random()
        if p<L: return k
        k+=1
def play(rng,a,b,ko=False):
    la,lb=lam(a,b); ga,gb=pois(rng,la),pois(rng,lb); et=False; pens=None
    if ko and ga==gb:
        et=True; la,lb=lam(a,b,True); ga+=pois(rng,la); gb+=pois(rng,lb)
        if ga==gb:
            pa=0.5+(ELO[a]-ELO[b])/4000
            # simulate shootout
            while True:
                sa=sum(rng.random()<0.76 for _ in range(5)); sb=sum(rng.random()<0.76 for _ in range(5))
                if sa!=sb: break
            if (sa>sb)!=(rng.random()<pa): sa,sb=sb,sa
            pens=(sa,sb)
    win=None
    if ga>gb or (pens and pens[0]>pens[1]): win=a
    elif gb>ga or (pens and pens[1]>pens[0]): win=b
    return dict(a=a,b=b,ga=ga,gb=gb,et=et,pens=pens,win=win)
def draw(rng):
    groups={g:[] for g in G}
    for pot in POTS:
        p=pot[:]; rng.shuffle(p)
        for g,t in zip(G,p): groups[g].append(t)
    return groups
ORDER=[(0,1),(2,3),(0,2),(3,1),(3,0),(1,2)]  # matchday pairings
THIRD_SLOTS=[('1B','ADEF'),('1F','ABC'),('1E','ABCD'),('1C','DEF')]
def tournament(seed):
    rng=random.Random(seed); groups=draw(rng); res={'groups':groups,'gm':{},'tables':{}}
    thirds=[]; pos={}
    for g in G:
        ts=groups[g]; st={t:dict(t=t,pts=0,gf=0,ga=0,w=0,d=0,l=0) for t in ts}; ms=[]
        for i,j in ORDER:
            m=play(rng,ts[i],ts[j]); ms.append(m)
            for t,f_,a_ in ((m['a'],m['ga'],m['gb']),(m['b'],m['gb'],m['ga'])):
                s=st[t]; s['gf']+=f_; s['ga']+=a_
                if f_>a_: s['pts']+=3; s['w']+=1
                elif f_==a_: s['pts']+=1; s['d']+=1
                else: s['l']+=1
        tab=sorted(st.values(),key=lambda s:(-s['pts'],-(s['gf']-s['ga']),-s['gf'],-ELO[s['t']]))
        res['gm'][g]=ms; res['tables'][g]=tab
        for i,s in enumerate(tab): pos[f'{i+1}{g}']=s['t']
        thirds.append((g,tab[2]))
    best=sorted(thirds,key=lambda x:(-x[1]['pts'],-(x[1]['gf']-x[1]['ga']),-x[1]['gf']))[:4]
    bg={g for g,_ in best}
    # assign thirds to slots (bruteforce)
    import itertools
    assign=None
    for perm in itertools.permutations(sorted(bg)):
        if all(perm[i] in THIRD_SLOTS[i][1] for i in range(4)): assign=perm; break
    if assign is None: assign=tuple(sorted(bg))
    t3={THIRD_SLOTS[i][0]:pos['3'+assign[i]] for i in range(4)}
    R16=[(pos['1B'],t3['1B']),(pos['1A'],pos['2C']),(pos['1F'],t3['1F']),(pos['2D'],pos['2E']),(pos['1E'],t3['1E']),(pos['1D'],pos['2F']),(pos['1C'],t3['1C']),(pos['2A'],pos['2B'])]
    res['thirds']=[g for g,_ in best]
    rounds=[]; cur=R16
    for rn in range(4):
        ms=[play(rng,a,b,True) for a,b in cur]; rounds.append(ms)
        w=[m['win'] for m in ms]; cur=[(w[i],w[i+1]) for i in range(0,len(w)-1,2)]
    res['ko']=rounds; res['champ']=rounds[-1][0]['win']
    return res
if __name__=='__main__':
    N=10000; champ=collections.Counter(); reach=collections.Counter(); elim=collections.Counter(); finals=collections.Counter()
    for s in range(N):
        r=tournament(s); champ[r['champ']]+=1
        alive=set(sum([[m['a'],m['b']] for m in r['ko'][0]],[]))
        if 'ARG' in alive:
            reach['R16']+=1
            for i,rnd in enumerate(r['ko']):
                for m in rnd:
                    if 'ARG' in (m['a'],m['b']):
                        if m['win']=='ARG': reach[['QF','SF','F','CH'][i]]+=1
                        else: elim[m['b'] if m['a']=='ARG' else m['a']]+=1
        else: elim['GRUPOS']+=1
        fm=r['ko'][3][0]
        if 'ARG' in (fm['a'],fm['b']): finals[fm['b'] if fm['a']=='ARG' else fm['a']]+=1
    print('champ',[(k,round(v/N*100,1)) for k,v in champ.most_common(12)])
    print('ARG reach',{k:round(v/N*100,1) for k,v in reach.items()})
    print('ARG elim by',[(k,round(v/N*100,1)) for k,v in elim.most_common(10)])
    print('ARG final rivals',[(k,round(v/N*100,1)) for k,v in finals.most_common(6)])
    json.dump({'N':N,'champ':dict(champ),'reach':dict(reach),'elim':dict(elim),'finals':dict(finals)},open('/home/claude/emh/src/v14_sims.json','w'))
