#!/bin/bash
cd /home/claude/emh
for i in 2 3 4 5 6 7; do
  until [ -f out/sh/S$i/done_all ]; do sleep 30; done
  [ -f out/sh/final/0$i.mp4 ] || bash tools/finalize_short.sh S$i 0$i
done
echo FINALIZED_ALL
