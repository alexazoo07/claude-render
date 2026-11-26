#!/bin/bash
cd /home/claude/emh
for c in S1 S2 S3 S4 S5 S6 S7; do
  [ -f out/sh/$c/done_all ] && continue
  bash tools/render_comp1080.sh $c 1980 out/sh/$c || exit 1
done
echo ALLSHORTS > out/sh/finished
