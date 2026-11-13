# Render robusto por tramos con reintentos + audio aparte + unión y masterizado.
# Uso: powershell -File tools/render-chunks.ps1 -Comp V-chicle -Out out/chicle_final.mp4 -Total 12000 [-Chunk 1500]   (Total = duración × fps)
# Requiere: npx remotion bundle src/index.ts --out-dir build (ya hecho).
param([string]$Comp, [string]$Out, [int]$Total, [int]$Chunk = 1500, [int]$Retries = 4)
$ErrorActionPreference = 'Continue'
$ff = "C:\Program Files\Topaz Labs LLC\Topaz Video AI\ffmpeg.exe"
if (!(Test-Path $ff)) { $ff = "C:\Program Files\Red Giant\Trapcode Suite\Tools\ffmpeg.exe" }
$fp = $ff -replace 'ffmpeg.exe$', 'ffprobe.exe'
$dir = "out/chunks_$Comp"; New-Item -ItemType Directory -Force $dir | Out-Null
$log = "$dir/progress.log"
"Total frames: $total" | Tee-Object -Append $log
$parts = @()
for ($s = 0; $s -lt $total; $s += $Chunk) {
  $e = [Math]::Min($total - 1, $s + $Chunk - 1)
  $f = "$dir/part_{0:D6}.mp4" -f $s; $parts += $f
  if (Test-Path $f) { "OK (ya existe) $s-$e" | Tee-Object -Append $log; continue }
  $ok = $false
  for ($try = 1; $try -le $Retries -and -not $ok; $try++) {
    "Tramo $s-$e intento $try" | Tee-Object -Append $log
    npx remotion render build $Comp "$f.tmp.mp4" --frames="$s-$e" --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --x264-preset=medium --muted --timeout=90000 --log=error *> "$dir/last.log"
    if ($LASTEXITCODE -eq 0 -and (Test-Path "$f.tmp.mp4")) { Move-Item -Force "$f.tmp.mp4" $f; $ok = $true; "  hecho" | Tee-Object -Append $log }
    else { Get-Content "$dir/last.log" -Tail 3 | Add-Content $log; Remove-Item "$f.tmp.mp4" -ErrorAction SilentlyContinue }
  }
  if (-not $ok) { "FALLO definitivo en $s-$e" | Tee-Object -Append $log; exit 1 }
}
# audio completo
"Audio..." | Tee-Object -Append $log
# modo solo audio: no dibuja el mapa, así tarda minutos y no se cuelga
for ($try = 1; $try -le $Retries -and -not (Test-Path "$dir/audio.wav"); $try++) {
  "  audio intento $try" | Tee-Object -Append $log
  npx remotion render build $Comp "$dir/audio.wav" --codec=wav --props='{\"audioOnly\":true}' --timeout=120000 --log=error *> "$dir/audio.log"
}
if (!(Test-Path "$dir/audio.wav")) { "FALLO en el audio (ver audio.log)" | Tee-Object -Append $log; exit 1 }
# unir vídeo
$list = "$dir/list.txt"; ($parts | ForEach-Object { "file '" + (Resolve-Path $_).Path.Replace('\', '/') + "'" }) | Set-Content $list -Encoding ascii
& $ff -v error -y -f concat -safe 0 -i $list -c copy "$dir/video.mp4"
# mezclar + masterizar audio
& $ff -v error -y -i "$dir/video.mp4" -i "$dir/audio.wav" -map 0:v -map 1:a -c:v copy -af "alimiter=limit=0.8:level=false,loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $Out
"FIN -> $Out" | Tee-Object -Append $log
& $fp -v error -show_entries format=duration -of csv=p=0 $Out | Tee-Object -Append $log
