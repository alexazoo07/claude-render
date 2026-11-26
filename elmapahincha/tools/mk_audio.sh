#!/bin/bash
# mk_audio.sh <module> <tag> [MV]  -> audio/<tag>.m4a
set -e
npx tsx tools/dump_cx.ts $1 $2
SECS=$(python3 -c "print(open('out/music_$2.txt').read().split(':')[-1])")
NOCROWD=1 python3 tools/mix3.py out/sfx_$2.json $SECS out/_mix_$2.wav "$(cat out/music_$2.txt)" ${3:-0.05} >/dev/null
ffmpeg -y -loglevel error -i out/_mix_$2.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 256k audio/$2.m4a
echo audio/$2.m4a $SECS
