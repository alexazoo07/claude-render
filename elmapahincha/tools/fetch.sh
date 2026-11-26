#!/bin/bash
# fetch.sh NN -> out/vNN_final.mp4 desde la rama out-VNN
N=$1; B=out-V$N; D=/tmp/fetch_$N
rm -rf $D && git clone -q --depth 1 -b $B https://github.com/alexazoo07/claude-render $D || exit 1
mkdir -p out; cat $D/part_* > out/v${N}_final.mp4
[ "$(md5sum out/v${N}_final.mp4 | cut -d' ' -f1)" = "$(cat $D/md5)" ] && echo "v$N md5 OK" || echo "v$N md5 MAL"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames -show_entries format=duration -of csv=p=0 out/v${N}_final.mp4 | tr '\n' ' '
rm -rf $D
