# World Football Elo (eloratings.net method) computed from the full results dataset
import pandas as pd, json, sys
r=pd.read_csv('/home/claude/international_results/results.csv').dropna(subset=['home_score'])
r=r.sort_values('date')
fn=pd.read_csv('/home/claude/international_results/former_names.csv')
ren=dict(zip(fn.former,fn.current))
E={}
def K(t):
    if t=='FIFA World Cup': return 60
    if t in('UEFA Euro','Copa América','African Cup of Nations','AFC Asian Cup','Gold Cup','Confederations Cup','CONCACAF Nations League','UEFA Nations League'): return 50
    if 'qualification' in t: return 40
    if t=='Friendly': return 20
    return 30
for h,a,hs,as_,t,neu in zip(r.home_team,r.away_team,r.home_score,r.away_score,r.tournament,r.neutral):
    h=ren.get(h,h); a=ren.get(a,a)
    eh=E.get(h,1500); ea=E.get(a,1500)
    dr=eh-ea+(0 if neu else 100)
    we=1/(10**(-dr/400)+1)
    w=1 if hs>as_ else 0.5 if hs==as_ else 0
    gd=abs(hs-as_); g=1 if gd<=1 else 1.5 if gd==2 else (11+gd)/8
    d=K(t)*g*(w-we)
    E[h]=eh+d; E[a]=ea-d
json.dump(E,open(sys.argv[1],'w'))
top=sorted(E.items(),key=lambda x:-x[1])[:25]
for k,v in top: print(k,round(v))
