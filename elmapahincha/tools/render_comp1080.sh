#!/bin/bash
# usage: render_comp.sh COMP TOTAL_FRAMES OUTDIR
cd /home/claude/emh
. ./env.sh
COMP=$1; TOTAL=$2; OD=$3; mkdir -p $OD
CH=1500; n=$(( (TOTAL + CH - 1) / CH ))
for ((i=0;i<n;i++)); do
  s=$(( i*CH )); e=$(( (i+1)*CH - 1 )); [ $e -ge $TOTAL ] && e=$(( TOTAL-1 ))
  id=$(printf %02d $i)
  [ -f $OD/done_$id ] && continue
  echo "chunk $i $s-$e start $(date +%T)" >> $OD/progress.log
  ok=0
  for try in 1 2 3; do
    if npx remotion render build $COMP $OD/c_$id.mp4 --browser-executable=$BR --concurrency=2 --crf=16 --x264-preset=slow --scale=1 --muted --frames=$s-$e --timeout=90000 > $OD/log_$id.txt 2>&1; then ok=1; break; fi
    echo "chunk $i try $try failed" >> $OD/progress.log
  done
  if [ $ok = 1 ]; then touch $OD/done_$id; echo "chunk $i done $(date +%T)" >> $OD/progress.log; else echo "chunk $i FAILED" >> $OD/progress.log; exit 1; fi
done
touch $OD/done_all; echo "ALL DONE $(date +%T)" >> $OD/progress.log
