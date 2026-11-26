# build a rich head-to-head tour json for a team: python3 tools/h2h_tour.py Brazil src/v5/tour5.json
import pandas as pd, json, sys
TEAM, OUT = sys.argv[1], sys.argv[2]
src=open('/home/claude/emh/tools/teams_world.py').read(); ns={}; exec(src.split('\n}')[0]+'\n}',ns); T=ns['T']
T.update({
 'Cuba':('Cuba','CUB','cu','CONCACAF'),'Belize':('Belice','BLZ','bz','CONCACAF'),'Bermuda':('Bermudas','BMU','bm','CONCACAF'),'Dominica':('Dominica','DMA','dm','CONCACAF'),
 'Dominican Republic':('República Dominicana','DOM','do','CONCACAF'),'Guyana':('Guyana','GUY','gy','CONCACAF'),'Suriname':('Surinam','SUR','sr','CONCACAF'),
 'Saint Kitts and Nevis':('San Cristóbal y Nieves','KNA','kn','CONCACAF'),'Saint Vincent and the Grenadines':('San Vicente y las Granadinas','VCT','vc','CONCACAF'),
 'Ethiopia':('Etiopía','ETH','et','CAF'),'Gambia':('Gambia','GMB','gm','CAF'),'Liberia':('Liberia','LBR','lr','CAF'),'Fiji':('Fiyi','FJI','fj','AFC'),
 'Kuwait':('Kuwait','KWT','kw','AFC'),'Lebanon':('Líbano','LBN','lb','AFC'),'Uzbekistan':('Uzbekistán','UZB','uz','AFC'),'Yemen':('Yemen','YEM','ye','AFC'),
 'Luxembourg':('Luxemburgo','LUX','lu','UEFA'),'Mexico':('México','MEX','mx','CONCACAF'),
 'Argentina':('Argentina','ARG','ar','CONMEBOL'),'Turkey':('Turquía','TUR','tr','UEFA'),'New Zealand':('Nueva Zelanda','NZL','nz','AFC'),
 'Finland':('Finlandia','FIN','fi','UEFA'),'Senegal':('Senegal','SEN','sn','CAF'),'DR Congo':('RD del Congo','COD','cd','CAF'),'Slovakia':('Eslovaquia','SVK','sk','UEFA'),
 'Andorra':('Andorra','AND','ad','UEFA'),'Latvia':('Letonia','LVA','lv','UEFA'),'Thailand':('Tailandia','THA','th','AFC'),'Malaysia':('Malasia','MYS','my','AFC'),
 'Oman':('Omán','OMN','om','AFC'),'Zimbabwe':('Zimbabue','ZWE','zw','CAF'),'Tanzania':('Tanzania','TZA','tz','CAF'),'North Korea':('Corea del Norte','PRK','kp','AFC'),
 'Ukraine':('Ucrania','UKR','ua','UEFA'),'Gabon':('Gabón','GAB','ga','CAF'),'Guinea':('Guinea','GIN','gn','CAF'),'Brazil':('Brasil','BRA','br','CONMEBOL')})
r=pd.read_csv('/home/claude/international_results/results.csv')
so=pd.read_csv('/home/claude/international_results/shootouts.csv')
a=r[((r.home_team==TEAM)|(r.away_team==TEAM))&r.home_score.notna()].copy()
merge={'Soviet Union':'Russia','Yugoslavia':'Serbia','Czechoslovakia':'Czech Republic','West Germany':'Germany','Serbia and Montenegro':'Serbia'}
a['opp_raw']=a.apply(lambda x:x.away_team if x.home_team==TEAM else x.home_team,axis=1)
a['opp']=a.opp_raw.replace(merge)
a['gf']=a.apply(lambda x:int(x.home_score if x.home_team==TEAM else x.away_score),axis=1)
a['ga']=a.apply(lambda x:int(x.away_score if x.home_team==TEAM else x.home_score),axis=1)
a=a.sort_values('date')
skipped={}
out=[]
CONF_ORDER=['CONMEBOL','CONCACAF','UEFA','CAF','AFC']
for o,d in a.groupby('opp'):
    if o not in T: skipped[o]=len(d); continue
    es,key,flag,conf=T[o]
    w=int((d.gf>d.ga).sum()); dr=int((d.gf==d.ga).sum()); l=int((d.gf<d.ga).sum())
    seq=''.join('W' if g>c else 'D' if g==c else 'L' for g,c in zip(d.gf,d.ga))
    diff=d.gf-d.ga
    bw=d.loc[diff.idxmax()] if w else None
    bl=d.loc[diff.idxmin()] if l else None
    last=d.iloc[-1]; first=d.iloc[0]
    wc=int((d.tournament=='FIFA World Cup').sum())
    # current streak
    s=seq[-1]; n=len(seq)-len(seq.rstrip(s))
    # penalties
    pens=[]
    for _,m in d[d.gf==d.ga].iterrows():
        q=so[(so.date==m.date)&(((so.home_team==m.home_team)&(so.away_team==m.away_team)))]
        if len(q): pens.append({'y':m.date[:4],'win':bool(q.iloc[0].winner==TEAM),'t':m.tournament})
    st='never' if w==0 else 'neg' if l>w else 'even' if (w-l)<=0.1*len(d) else 'dom'
    out.append(dict(name=o,es=es,key=key,flag=flag,conf=conf,st=st,p=len(d),w=w,d=dr,l=l,gf=int(d.gf.sum()),ga=int(d.ga.sum()),
        first=first.date,firstScore=f"{first.gf}-{first.ga}",last=last.date,lastScore=f"{last.gf}-{last.ga}",lastT=last.tournament,
        bw=None if bw is None else {'s':f"{bw.gf}-{bw.ga}",'y':bw.date[:4]}, bl=None if bl is None else {'s':f"{bl.gf}-{bl.ga}",'y':bl.date[:4]},
        wc=wc,seq=seq,streak={'t':s,'n':n},pens=pens))
out.sort(key=lambda x:(CONF_ORDER.index(x['conf']), -x['p']))
json.dump(out,open(OUT,'w'),ensure_ascii=False)
tot={k:sum(x[k] for x in out) for k in 'p w d l gf ga'.split()}
print(len(out),tot,'skipped',skipped)
from collections import Counter; print(Counter(x['st'] for x in out), Counter(x['conf'] for x in out))
