$ErrorActionPreference = 'Stop'
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Error "npx not found. Install Node.js and ensure npx is on PATH."
  exit 1
}

Write-Host "Rendering docs/architecture.mmd -> docs/architecture.svg and docs/architecture.png"
npx -y @mermaid-js/mermaid-cli -i docs/architecture.mmd -o docs/architecture.svg
npx -y @mermaid-js/mermaid-cli -i docs/architecture.mmd -o docs/architecture.png

Write-Host "Rendered docs/architecture.svg and docs/architecture.png"
