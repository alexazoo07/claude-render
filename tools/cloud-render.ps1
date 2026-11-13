# Render en la nube (GitHub Actions): sube el código, lanza N máquinas, espera y descarga el MP4 final.
# Uso: powershell -File tools/cloud-render.ps1 -Comp V-pasaportes -Seconds 513 -Out "C:\...\video.mp4" [-Machines 20]
# Requiere git + GitHub CLI (gh auth login hecho una vez) y el remoto "origin" configurado.
# Salida mínima a propósito (ahorra tokens): enlace de la ejecución, tiempo total y ruta final.
param([string]$Comp, [double]$Seconds, [string]$Out, [int]$Machines = 20, [int]$Fps = 60)
$ErrorActionPreference = 'Continue'
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
$frames = [int][Math]::Round($Seconds * $Fps)
git add -A
git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { git commit -q -m "render $Comp" }
git push -q origin HEAD:main *> $null
if ($LASTEXITCODE -ne 0) { 'ERROR: git push falló'; exit 1 }
$t0 = (Get-Date).ToUniversalTime().AddSeconds(-5)
gh workflow run render.yml -f comp=$Comp -f frames=$frames -f machines=$Machines *> $null
$id = $null
for ($i = 0; $i -lt 30 -and -not $id; $i++) {
  Start-Sleep 4
  $r = gh run list --workflow render.yml --limit 5 --json databaseId,createdAt | ConvertFrom-Json
  $id = ($r | Where-Object { ([datetime]$_.createdAt).ToUniversalTime() -ge $t0 } | Select-Object -First 1).databaseId
}
if (-not $id) { 'ERROR: no encuentro la ejecución en GitHub Actions'; exit 1 }
"Ejecución: https://github.com/alexazoo07/claude-render/actions/runs/$id"
gh run watch $id --interval 60 --exit-status *> $null
if ($LASTEXITCODE -ne 0) { gh run view $id --log-failed | Select-Object -Last 30; exit 1 }
$tmp = Join-Path $env:TEMP "cloud_$id"; gh run download $id -n final -D $tmp *> $null
New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null
Move-Item -Force (Join-Path $tmp 'final.mp4') $Out
"FIN en {0:N1} min -> $Out" -f ((Get-Date).ToUniversalTime() - $t0).TotalMinutes
