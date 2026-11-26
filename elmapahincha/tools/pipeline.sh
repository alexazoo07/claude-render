#!/bin/bash
cd /home/claude/emh
# wait for v2 render
while [ ! -f out/chunks_v2/done_all ]; do
  if ! pgrep -f "render_comp.sh V2" >/dev/null; then ./tools/render_comp.sh V2 34162 out/chunks_v2 || true; fi
  sleep 30
done
# finalize v2
cd out
ls chunks_v2/c_*.mp4 | sort | sed "s/^/file '/; s/$/'/" > concat_v2.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i concat_v2.txt -c copy v2_video.mp4
ffmpeg -y -loglevel error -i v2_video.mp4 -i v2_audio_n.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart deliver_v2/Nunca_ha_ganado_Argentina_v1.mp4
touch deliver_v2/READY
cd ..
# render v3 (fresh bundle)
. ./env.sh
npx remotion bundle src/index.ts --out-dir build --public-dir public > bundle.log 2>&1
for t in 1 2 3; do ./tools/render_comp.sh V3 35970 out/chunks_v3 && break; done
echo "V3 render finished $(date +%T)" >> out/pipeline.log
