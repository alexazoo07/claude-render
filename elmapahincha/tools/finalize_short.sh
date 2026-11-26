#!/bin/bash
# finalize_short.sh S1 01
cd /home/claude/emh/out/sh/$1 || exit 1
[ -f done_all ] || exit 1
ls c_*.mp4 | sort | sed "s/^/file '/;s/$/'/" > list.txt
mkdir -p ../final
ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -i ../an_$1.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart ../final/$2.mp4 && echo "final $2 ok"
