import json, sys, math, random
sys.path.insert(0,'/home/claude/emh/tools/v14')
from sim14 import tournament, ELO, lam
D=json.load(open('/home/claude/emh/src/v14_h2h.json')); S=json.load(open('/home/claude/emh/src/v14_sims.json'))
iso=json.load(open('/home/claude/emh/src/iso3flag.json'))
ES={'ESP':'España','ENG':'Inglaterra','FRA':'Francia','PRT':'Portugal','CHE':'Suiza','NLD':'Países Bajos','BEL':'Bélgica','ITA':'Italia','DEU':'Alemania','NOR':'Noruega','DNK':'Dinamarca','HRV':'Croacia','AUT':'Austria','GRC':'Grecia','SWE':'Suecia','TUR':'Turquía','SCT':'Escocia','SVN':'Eslovenia','HUN':'Hungría','IRL':'Irlanda','KOS':'Kosovo','UKR':'Ucrania','BIH':'Bosnia','ARG':'Argentina'}
SEED=16101
r=tournament(SEED)
rng=random.Random(777)
POOL={
'ARG':[('Lautaro Martínez',3),('Julián Álvarez',3),('Nico Paz',2),('Enzo Fernández',1.5),('Mac Allister',1.5),('Mastantuono',1),('Giuliano Simeone',1),('Flaco López',1),('Cuti Romero',0.6)],
'NLD':[('Gakpo',3),('Depay',2),('Xavi Simons',2),('Malen',1.5),('Reijnders',1)],
'HRV':[('Kramarić',3),('Budimir',2),('Baturina',1.5),('Gvardiol',1),('Perišić',1)],
'BIH':[('Džeko',3),('Demirović',3),('Hajradinović',1),('Tahirović',1)],
'DEU':[('Musiala',3),('Wirtz',3),('Havertz',2),('Woltemade',2),('Sané',1)],
'FRA':[('Mbappé',4),('Dembélé',2),('Olise',2),('Doué',1.5),('Thuram',1.5)],
'ITA':[('Retegui',3),('Kean',3),('Barella',1.5),('Tonali',1.5),('Raspadori',1)],
'ESP':[('Lamine Yamal',3),('Oyarzabal',3),('Nico Williams',2),('Pedri',1.5),('Dani Olmo',1.5),('Merino',1.5),('Ferran Torres',1.5)],
}
def pick(t,avoid=None):
    p=POOL[t]; tot=sum(w for _,w in p); x=rng.random()*tot
    for n,w in p:
        x-=w
        if x<=0: return n
    return p[-1][0]
def probs(a,b):
    la,lb=lam(a,b); P=lambda l,k: math.exp(-l)*l**k/math.factorial(k)
    w=d=l=0
    for i in range(12):
        for j in range(12):
            pr=P(la,i)*P(lb,j)
            if i>j: w+=pr
            elif i==j: d+=pr
            else: l+=pr
    return [round(w*100),round(d*100),round(l*100)]
def mins(n,lo,hi,used):
    out=[]
    while len(out)<n:
        m=rng.randint(lo,hi)
        if m not in used and m not in out: out.append(m)
    return sorted(out)
VEN={'G1':('Glasgow','Hampden Park'),'G2':('Dublín','Aviva Stadium'),'G3':('Liverpool','Estadio del Everton'),'R16':('Mánchester','Etihad Stadium'),'QF':('Londres','Tottenham Hotspur Stadium'),'SF':('Londres','Wembley'),'F':('Londres','Wembley')}
g=[g for g in 'ABCDEF' if 'ARG' in r['groups'][g]][0]
arg=[m for m in r['gm'][g] if 'ARG' in (m['a'],m['b'])]
ko=[[m for m in rnd if 'ARG' in (m['a'],m['b'])][0] for rnd in r['ko']]
matches=[]
for tag,m in zip(['G1','G2','G3','R16','QF','SF','F'],arg+ko):
    # normalize to ARG first
    if m['a']!='ARG': m=dict(a='ARG',b=m['a'],ga=m['gb'],gb=m['ga'],et=m['et'],pens=(m['pens'][1],m['pens'][0]) if m['pens'] else None,win=m['win'])
    o=m['b']; ga,gb=m['ga'],m['gb']
    # goals at 90: if et, split so tied at 90
    if m['et']:
        t90=min(ga,gb)-1 if min(ga,gb)>0 else 0
        if tag=='F': t90=1
        reg=(t90,t90); etg=(ga-t90,gb-t90)
    else: reg=(ga,gb); etg=(0,0)
    goals=[]; used=[]
    ms_a=mins(reg[0],3,90,used); used+=ms_a; ms_b=mins(reg[1],3,90,used); used+=ms_b
    ea=mins(etg[0],92,120,used); used+=ea; eb=mins(etg[1],92,120,used)
    for mm in ms_a+ea: goals.append(dict(t='ARG',m=mm,who=pick('ARG')))
    for mm in ms_b+eb: goals.append(dict(t=o,m=mm,who=pick(o)))
    goals.sort(key=lambda x:x['m'])
    # stats
    dr=ELO['ARG']-ELO[o]; pos=max(38,min(64,round(52+dr/25+rng.uniform(-6,6))))
    sha=max(ga+3,round(11+dr/40+rng.uniform(-3,4))+ga); shb=max(gb+2,round(10-dr/40+rng.uniform(-3,3))+gb)
    matches.append(dict(tag=tag,o=o,ga=ga,gb=gb,et=m['et'],pens=m['pens'],goals=goals,pos=pos,sha=sha,shb=shb,p=probs('ARG',o),city=VEN[tag][0],stadium=VEN[tag][1],elo=[ELO['ARG'],ELO[o]]))
for x in matches: print(x['tag'],x['o'],x['ga'],x['gb'],x['et'],x['pens'],[(q['t'],q['m'],q['who']) for q in x['goals']],x['p'],x['pos'],x['sha'],x['shb'])
out=dict(seed=SEED,groups=r['groups'],tables={k:[dict(t=s['t'],pts=s['pts'],w=s['w'],d=s['d'],l=s['l'],gf=s['gf'],ga=s['ga']) for s in v] for k,v in r['tables'].items()},
 gm={k:[dict(a=m['a'],b=m['b'],ga=m['ga'],gb=m['gb']) for m in v] for k,v in r['gm'].items()},
 thirds=r['thirds'], ko=[[dict(a=m['a'],b=m['b'],ga=m['ga'],gb=m['gb'],et=m['et'],pens=m['pens'],win=m['win']) for m in rnd] for rnd in r['ko']],
 arg=matches, elo=ELO, sims=S, h2h={k:{kk:v[kk] for kk in ('p','w','d','l','gf','ga')} for k,v in D['opp'].items()}, tot=D['tot'], wc=D['wc'], es=ES, flag={k:iso[k] for k in ES})
json.dump(out,open('/home/claude/emh/src/v14/run14.json','w'),ensure_ascii=False)
