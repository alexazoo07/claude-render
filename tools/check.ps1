# Revisión rápida antes del render: tsc + bundle + fotogramas en los segundos dados + hoja de contacto. Salida mínima.
# Uso: powershell -File tools/check.ps1 -Comp V-habitantes -Secs 1,3.5,6,9,15,... [-Fps 60] [-Cols 4]
param([string]$Comp, [string]$Secs, [int]$Fps = 60, [int]$Cols = 4, [switch]$NoBundle)
$L = @($Secs -split ',' | ForEach-Object { [double]$_ })
$ErrorActionPreference = 'Continue'
npx tsc -p . *> out/tsc.log; if ($LASTEXITCODE -ne 0) { Get-Content out/tsc.log | Select-Object -First 15; exit 1 }
if (-not $NoBundle) { npx remotion bundle src/index.ts --out-dir build --log=error *> out/bundle.log; if ($LASTEXITCODE -ne 0) { Get-Content out/bundle.log -Tail 15; exit 1 } }
$d = "out/check_$Comp"; Remove-Item -Recurse -Force $d -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Force $d | Out-Null
$i = 0
foreach ($s in $L) {
  $f = [int]($s * $Fps); $i++
  npx remotion still build $Comp ("$d/s_{0:D3}.png" -f $i) --frame=$f --scale=0.25 --log=error *> "$d/still.log"
  if ($LASTEXITCODE -ne 0) { "ERROR en el segundo $s"; Get-Content "$d/still.log" -Tail 8; exit 1 }
}
$ff = "C:\Program Files\Topaz Labs LLC\Topaz Video AI\ffmpeg.exe"
$rows = [Math]::Ceiling($L.Count / $Cols)
& $ff -v error -y -framerate 1 -i "$d/s_%03d.png" -vf "tile=${Cols}x${rows}" -frames:v 1 "$d/sheet.jpg"
"OK -> $d/sheet.jpg"
