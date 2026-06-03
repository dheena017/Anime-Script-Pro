#!/usr/bin/env pwsh

$ErrorActionPreference = "SilentlyContinue"

$BASE_URL = "http://localhost:3050"
$AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb2NhbC1kZXYtYXJjaGl0ZWN0LWlkIiwiZXhwIjoxNzc4MDY0NDc5fQ.wC0dItoyO0vrKnjIG-S1wbAooocHJTOT91q6PizYY9w"
$USER_ID = "local-dev-architect-id"

$headers = @{
    'Authorization' = "Bearer $AUTH_TOKEN"
    'Content-Type'  = 'application/json'
}

$script:results = @()
$script:totalTests = 0
$script:passedTests = 0

function Get-ProjectIdForTests {
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL/api/projects?user_id=$USER_ID" -Headers $headers -UseBasicParsing -TimeoutSec 10
        $projects = $response.Content | ConvertFrom-Json
        foreach ($project in $projects) {
            if ($null -ne $project.id) {
                return [int]$project.id
            }
            if ($null -ne $project.project_id) {
                return [int]$project.project_id
            }
        }
    }
    catch {
        return 1
    }

    return 1
}

$projectId = Get-ProjectIdForTests

function Test-Endpoint {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null,
        [bool]$RequireAuth = $true
    )
    
    $script:totalTests++
    $url = "$BASE_URL$Endpoint"
    $testHeaders = if ($RequireAuth) { $headers } else { @{} }
    
    try {
        $params = @{
            Uri     = $url
            Method  = $Method
            Headers = $testHeaders
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params['Body'] = $Body | ConvertTo-Json
        }
        
        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        
        $result = @{
            Endpoint    = $Endpoint
            Description = $Description
            Status      = "PASS"
            StatusCode  = $statusCode
            Method      = $Method
        }
        
        $script:passedTests++
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value
        $statusCode = if ($statusCode) { $statusCode } else { "ERROR" }
        
        $result = @{
            Endpoint    = $Endpoint
            Description = $Description
            Status      = "FAIL"
            StatusCode  = $statusCode
            Method      = $Method
            Error       = $_.Exception.Message
        }
    }
    
    $script:results += $result
    Write-Host "$($result.Status) [$($result.StatusCode)]: $Description - $($result.Endpoint)"
}

Write-Host "`n========== ANIME SCRIPT PRO API TEST SUITE ==========" -ForegroundColor Cyan
Write-Host "Backend: $BASE_URL`n" -ForegroundColor Cyan

Write-Host "`n--- SYSTEM HEALTH ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/health" -Description "Health Check" -RequireAuth $false
Test-Endpoint -Endpoint "/api/health" -Description "API Health Check" -RequireAuth $false

Write-Host "`n--- WORLD MODULES ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/api/world/manifest/$USER_ID" -Description "Get World Manifest"
Test-Endpoint -Endpoint "/api/world/history/$USER_ID" -Description "Get World History"
Test-Endpoint -Endpoint "/api/world/factions/$USER_ID" -Description "Get World Factions"
Test-Endpoint -Endpoint "/api/world/powers/$USER_ID" -Description "Get World Powers"
Test-Endpoint -Endpoint "/api/world/architecture/$USER_ID" -Description "Get World Architecture"
Test-Endpoint -Endpoint "/api/world/atlas/$USER_ID" -Description "Get World Atlas"
Test-Endpoint -Endpoint "/api/world/culture/$USER_ID" -Description "Get World Culture"
Test-Endpoint -Endpoint "/api/world/systems/$USER_ID" -Description "Get World Systems"

Write-Host "`n--- PRODUCTION ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/api/projects" -Description "Get All Projects"
Test-Endpoint -Endpoint "/api/projects?user_id=$USER_ID" -Description "Get User Projects"
Test-Endpoint -Endpoint "/api/production/$USER_ID" -Description "Get Production Content"
Test-Endpoint -Endpoint "/api/cast/$USER_ID" -Description "Get Cast Manifest"
Test-Endpoint -Endpoint "/api/series/episodes?project_id=$projectId" -Description "Get Episodes"

Write-Host "`n--- USER & CONTEXT ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/api/users/profile" -Description "Get User Profile"
Test-Endpoint -Endpoint "/api/notifications/$USER_ID" -Description "Get Notifications"
Test-Endpoint -Endpoint "/api/stats/progress?project_id=$projectId" -Description "Get User Stats"

Write-Host "`n--- AI ENGINE ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/api/engine/config/$USER_ID" -Description "Get Engine Config"

Write-Host "`n--- CREATIVE TOOLS ---" -ForegroundColor Yellow
Test-Endpoint -Endpoint "/api/templates/" -Description "Get Templates"
Test-Endpoint -Endpoint "/api/tutorials/" -Description "Get Tutorials"

Write-Host "`n========== TEST SUMMARY ==========" -ForegroundColor Green

$percentPassed = if ($script:totalTests -gt 0) { [math]::Round(($script:passedTests / $script:totalTests) * 100, 1) } else { 0 }

Write-Host "`nTotal Tests: $script:totalTests"
Write-Host "Passed: $script:passedTests" -ForegroundColor Green
Write-Host "Failed: $($script:totalTests - $script:passedTests)" -ForegroundColor Red
Write-Host "Pass Rate: $percentPassed`%`n"

$failedTests = $script:results | Where-Object { $_.Status -eq "FAIL" }
if ($failedTests) {
    Write-Host "`n--- FAILED ENDPOINTS ---" -ForegroundColor Red
    $failedTests | ForEach-Object {
        Write-Host "  * $($_.Endpoint) [$($_.StatusCode)]"
    }
}

$script:results | Export-Csv -Path "api_test_results.csv" -NoTypeInformation -Force
Write-Host "`nResults exported to: api_test_results.csv`n" -ForegroundColor Green
