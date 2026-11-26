import json
E=json.load(open('out/elo_all.json'))
# key: (dataset name, es name, flag, scarf colors, label lon/lat or None)
T={
'ALB':('Albania','Albania','al',['#E41E20','#000000'],None),'ARM':('Armenia','Armenia','am',['#D90012','#0033A0'],None),
'AUT':('Austria','Austria','at',['#ED2939','#FFFFFF'],None),'AZE':('Azerbaijan','Azerbaiyán','az',['#00B5E2','#EF3340'],None),
'BLR':('Belarus','Bielorrusia','by',['#C8313E','#4AA657'],None),'BEL':('Belgium','Bélgica','be',['#EF3340','#FDDA24'],None),
'BIH':('Bosnia and Herzegovina','Bosnia','ba',['#002395','#FECB00'],None),'BGR':('Bulgaria','Bulgaria','bg',['#00966E','#D62612'],None),
'HRV':('Croatia','Croacia','hr',['#FF0000','#FFFFFF'],None),'CYP':('Cyprus','Chipre','cy',['#D57800','#FFFFFF'],None),
'CZE':('Czech Republic','Chequia','cz',['#D7141A','#11457E'],None),'DNK':('Denmark','Dinamarca','dk',['#C8102E','#FFFFFF'],None),
'ENG':('England','Inglaterra','gb-eng',['#FFFFFF','#CE1124'],None),'EST':('Estonia','Estonia','ee',['#0072CE','#000000'],None),
'FRO':('Faroe Islands','Islas Feroe','fo',['#005EB8','#EF3340'],None),'FIN':('Finland','Finlandia','fi',['#FFFFFF','#002F6C'],None),
'FRA':('France','Francia','fr',['#0055A4','#EF4135'],None),'GEO':('Georgia','Georgia','ge',['#FFFFFF','#FF0000'],None),
'DEU':('Germany','Alemania','de',['#000000','#FFCE00'],None),'GRC':('Greece','Grecia','gr',['#0D5EAF','#FFFFFF'],None),
'HUN':('Hungary','Hungría','hu',['#CE2939','#477050'],None),'ISL':('Iceland','Islandia','is',['#02529C','#DC1E35'],None),
'IRL':('Republic of Ireland','Irlanda','ie',['#169B62','#FF883E'],None),'ISR':('Israel','Israel','il',['#0038B8','#FFFFFF'],None),
'ITA':('Italy','Italia','it',['#009246','#CE2B37'],None),'KAZ':('Kazakhstan','Kazajistán','kz',['#00AFCA','#FEC50C'],[62,48.5]),
'KOS':('Kosovo','Kosovo','xk',['#244AA5','#D0A650'],None),'LVA':('Latvia','Letonia','lv',['#9E3039','#FFFFFF'],None),
'LTU':('Lithuania','Lituania','lt',['#FDB913','#006A44'],None),'LUX':('Luxembourg','Luxemburgo','lu',['#EF3340','#00A3E0'],None),
'MLT':('Malta','Malta','mt',['#CF142B','#FFFFFF'],None),'MDA':('Moldova','Moldavia','md',['#0046AE','#FFD200'],None),
'MNE':('Montenegro','Montenegro','me',['#C40308','#D4AF3A'],None),'NLD':('Netherlands','Países Bajos','nl',['#FF7F00','#FFFFFF'],None),
'MKD':('North Macedonia','Macedonia del Norte','mk',['#D20000','#FFE600'],None),'NIR':('Northern Ireland','Irlanda del Norte','gb-nir',['#00A650','#FFFFFF'],None),
'NOR':('Norway','Noruega','no',['#BA0C2F','#00205B'],[9.5,61.5]),'POL':('Poland','Polonia','pl',['#DC143C','#FFFFFF'],None),
'PRT':('Portugal','Portugal','pt',['#006600','#FF0000'],None),'ROU':('Romania','Rumanía','ro',['#002B7F','#FCD116'],None),
'RUS':('Russia','Rusia','ru',['#0039A6','#D52B1E'],[42,57]),'SCT':('Scotland','Escocia','gb-sct',['#005EB8','#FFFFFF'],None),
'SRB':('Serbia','Serbia','rs',['#C6363C','#0C4076'],None),'SVK':('Slovakia','Eslovaquia','sk',['#0B4EA2','#EE1C25'],None),
'SVN':('Slovenia','Eslovenia','si',['#005DA4','#ED1C24'],None),'ESP':('Spain','España','es',['#AA151B','#F1BF00'],None),
'SWE':('Sweden','Suecia','se',['#006AA7','#FECC00'],[15.5,62]),'CHE':('Switzerland','Suiza','ch',['#FF0000','#FFFFFF'],None),
'TUR':('Turkey','Turquía','tr',['#E30A17','#FFFFFF'],[34,39]),'UKR':('Ukraine','Ucrania','ua',['#0057B7','#FFD700'],None),
'WLS':('Wales','Gales','gb-wls',['#00B140','#C8102E'],None),
}
rows=[]
for k,(dn,es,fl,sc,lab) in T.items():
    if dn not in E: print('MISSING',dn); continue
    rows.append(dict(iso=k,name=es,dn=dn,flag=fl,elo=round(E[dn],1),scarf=sc,label=lab))
rows.sort(key=lambda r:-r['elo'])
for i,r in enumerate(rows): r['rank']=i+1
json.dump(rows,open('src/v6/teams6.json','w'),ensure_ascii=False)
for r in rows: print(r['rank'],r['iso'],r['name'],r['elo'])
