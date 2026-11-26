#!/bin/bash
# prep_deliver.sh NN "Folder name" "Title" thumbsdir descfile
N=$1; FOLD="$2"; TIT="$3"; TH=$4; DS=$5
F=/home/claude/claude-render/elmapahincha/out/v${N}_final.mp4
D=/mnt/user-data/outputs/d$N; rm -rf $D; mkdir -p $D
{ printf X; head -c 12582912 $F; } > $D/s_0
tail -c +12582913 $F | split -b 25M -d -a 3 - $D/p_
L=$( { tail -c +2 $D/s_0; cat $D/p_*; } | md5sum | cut -d' ' -f1); O=$(md5sum $F | cut -d' ' -f1)
[ "$L" = "$O" ] && echo "parts OK $O" || echo "PARTS MAL"
for i in 1 2 3 4 5; do cp "$TH/Miniatura $i.jpg" "$D/Miniatura $i.jpg"; done
cp $DS "$D/Descripción YouTube.txt"
B='C:\Users\alexv\Desktop\El Mapa Hincha\'"$FOLD"
python3 - "$D" "$B" <<'PY'
import sys,os,json
D,B=sys.argv[1],sys.argv[2]
fs=sorted(f for f in os.listdir(D))
items=[]
for f in fs:
    dp=B+'\\'+(('_parts\\'+f) if (f.startswith('p_') or f=='s_0') else f)
    items.append({'stagedPath':D+'/'+f,'devicePath':dp})
for i in range(0,len(items),20):
    json.dump(items[i:i+20],open(f'{D}.batch{i//20}.json','w'),ensure_ascii=False)
print(len(items),'files', (len(items)+19)//20,'batches')
PY
