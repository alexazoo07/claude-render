# Render en la nube (GitHub Actions): sube el código, lanza N máquinas, espera y descarga el MP4 final.
# Uso: powershell -File tools/cloud-render.ps1 -Comp V-pasaportes -Seconds 513 -Out "C:\...\video.mp4" [-Machines 20]
# Requiere git + GitHub CLI (gh auth login hecho una vez) y el remoto "origin" configurado.
param([string]$Comp, [double]$Seconds, [string]$Out, [int]$Machines = 20, [int]$Fps = 60)
$ErrorActionPreference = 'Stop'
$frames = [int][Math]::Round($Seconds * $Fps)
git add -A
git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { git commit -q -m "render $Comp" }
git push -q origin HEAD:main
$t0 = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
gh workflow run render.yml -f comp=$Comp -f frames=$frames -f machines=$Machines
$id = $null
for ($i = 0; $i -lt 30 -and -not $id; $i++) {
  Start-Sleep 4
  $id = gh run list --workflow render.yml --limit 5 --json databaseId,createdAt --jq "[.[] | select(.createdAt >= \`"$t0\`")][0].databaseId"
}
if (-not $id) { throw 'No encuentro la ejecución en GitHub Actions' }
"Ejecución $($id):https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions/runs/$id"
gh run watch $id --interval 60 --exit-status | Select-Object -Last 3
if ($LASTEXITCODE -ne 0) { gh run view $id --log-failed | Select-Object -Last 40; exit 1 }
$tmp = Join-Path $env:TEMP "cloud_$id"; gh run download $id -n final -D $tmp
New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null
Move-Item -Force (Join-Path $tmp 'final.mp4') $Out
"FIN -> $Out"
