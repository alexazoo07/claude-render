#!/bin/bash
# resumable chunked render of the Main composition (muted)
cd /home/claude/emh
. ./env.sh
TOTAL=$(python3 -c "import json;s=json.load(open('out/segments.json'));print(s[-1]['from']+s[-1]['dur'])")
CH=3000
n=$(( (TOTAL + CH - 1) / CH ))
for ((i=0;i<n;i++)); do
  s=$(( i*CH )); e=$(( (i+1)*CH - 1 )); [ $e -ge $TOTAL ] && e=$(( TOTAL-1 ))
  id=$(printf %02d $i)
  [ -f out/chunks/done_$id ] && continue
  echo "chunk $i $s-$e start $(date +%T)" >> out/chunks/progress.log
  ok=0
  for try in 1 2 3; do
    if npx remotion render build Main out/chunks/c_$id.mp4 --browser-executable=$BR --concurrency=2 --crf=16 --muted --frames=$s-$e --timeout=90000 > out/chunks/log_$id.txt 2>&1; then ok=1; break; fi
    echo "chunk $i try $try failed" >> out/chunks/progress.log
  done
  if [ $ok = 1 ]; then touch out/chunks/done_$id; echo "chunk $i done $(date +%T)" >> out/chunks/progress.log; else echo "chunk $i FAILED" >> out/chunks/progress.log; exit 1; fi
done
touch out/chunks/done_all
echo "ALL DONE $(date +%T)" >> out/chunks/progress.log
