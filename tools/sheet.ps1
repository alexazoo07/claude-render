# Uso: powershell -File tools/sheet.ps1 <patrón> <salida.jpg> [columnas]
param([string]$pattern, [string]$out, [int]$cols = 2)
$ff = "C:\Program Files\Topaz Labs LLC\Topaz Video AI\ffmpeg.exe"
if (!(Test-Path $ff)) { $ff = "C:\Program Files\Red Giant\Trapcode Suite\Tools\ffmpeg.exe" }
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("sheet_" + [guid]::NewGuid()); New-Item -ItemType Directory $tmp | Out-Null
$i = 0; Get-ChildItem $pattern | Sort-Object { [int](($_.BaseName -replace '\D', '') + '0') } | ForEach-Object { $i++; Copy-Item $_.FullName (Join-Path $tmp ("{0:D3}.png" -f $i)) }
$rows = [math]::Ceiling($i / $cols)
& $ff -v error -y -i (Join-Path $tmp "%03d.png") -vf "scale=960:-1,tile=${cols}x${rows}:padding=6" -frames:v 1 $out
Remove-Item -Recurse -Force $tmp
