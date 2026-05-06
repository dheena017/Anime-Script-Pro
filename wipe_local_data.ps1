# Anime Script Pro - Local Data Wipe Script
# This script resets the local SQLite database and clears temporary files.

Write-Host "WARNING: This will delete ALL local projects, characters, and scripts." -ForegroundColor Red
$confirm = Read-Host "Are you sure you want to proceed? (y/n)"
if ($confirm -ne "y") { 
    Write-Host "Operation cancelled."
    exit 
}

Write-Host "Stopping background processes (if any)..." -ForegroundColor Cyan

Write-Host "Wiping SQLite Database..." -ForegroundColor Yellow
$dbPath = "backend/database/anime_script_pro.db"
if (Test-Path $dbPath) {
    Remove-Item $dbPath -Force
    Write-Host "[OK] Database deleted." -ForegroundColor Green
} else {
    Write-Host "[INFO] No database file found at $dbPath." -ForegroundColor Gray
}

Write-Host "Clearing Logs and Reports..." -ForegroundColor Yellow
Remove-Item "backend/logs/*.log" -ErrorAction SilentlyContinue
Remove-Item "lighthouse-report.*" -ErrorAction SilentlyContinue
Write-Host "[OK] Temporary files cleared." -ForegroundColor Green

Write-Host "Done! Restart your backend server to re-initialize with a clean slate." -ForegroundColor Cyan
