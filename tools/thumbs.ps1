# 5 miniaturas + hoja comparativa directamente en la carpeta de entrega. Salida mínima.
# Uso: powershell -File tools/thumbs.ps1 -Slug habitantes -Dest "C:\...\El Mapa Curioso\<título>"  (requiere build/ actualizado)
param([string]$Slug, [string]$Dest)
New-Item -ItemType Directory -Force $Dest | Out-Null
foreach ($i in 1..5) {
  npx remotion still build "T-$Slug-$i" "$Dest\miniatura_$i.png" --log=error *> out/thumb.log
  if ($LASTEXITCODE -ne 0) { "ERROR miniatura $i"; Get-Content out/thumb.log -Tail 6; exit 1 }
}
$ff = "C:\Program Files\Topaz Labs LLC\Topaz Video AI\ffmpeg.exe"
& $ff -v error -y -i "$Dest\miniatura_1.png" -i "$Dest\miniatura_2.png" -i "$Dest\miniatura_3.png" -i "$Dest\miniatura_4.png" -i "$Dest\miniatura_5.png" `
  -filter_complex "[0]scale=640:-1[a];[1]scale=640:-1[b];[2]scale=640:-1[c];[3]scale=640:-1[d];[4]scale=640:-1[e];color=c=0x101020:s=640x360[f];[a][b][c][d][e][f]xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0" `
  -frames:v 1 "$Dest\miniaturas_comparativa.jpg"
"OK -> $Dest\miniaturas_comparativa.jpg"
