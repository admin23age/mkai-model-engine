<#
.SYNOPSIS
  Exports all n8n workflows from agegroup.app.n8n.cloud as importable JSON files.

.DESCRIPTION
  Calls the n8n public REST API, paginates through every workflow, and writes
  each one as a pretty-printed .json file into the staging folder.
  The API key is read at runtime — it is never written to disk or committed.

.NOTES
  Get an API key: n8n cloud -> Settings -> n8n API -> Create API Key

.EXAMPLE
  ./export-n8n-workflows.ps1
  (prompts for the API key)

.EXAMPLE
  $env:N8N_API_KEY = "<key>"; ./export-n8n-workflows.ps1
#>

param(
    [string]$BaseUrl = "https://agegroup.app.n8n.cloud",
    [string]$OutDir  = "$PSScriptRoot\..\automations\n8n-export-staging"
)

# --- API key ---
$apiKey = $env:N8N_API_KEY
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    $secure = Read-Host -AsSecureString "Enter your n8n API key"
    $apiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Error "No API key provided. Aborting."
    exit 1
}

$headers = @{ "X-N8N-API-KEY" = $apiKey; "Accept" = "application/json" }

# --- ensure output dir (cleared on each run for a consistent snapshot) ---
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
if (Test-Path $OutDir) {
    Get-ChildItem -Path $OutDir -Filter *.json -File | Remove-Item -Force
} else {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}
Write-Host "Exporting to: $OutDir"

# --- helper: make a safe filename from a workflow name ---
function Get-SafeName([string]$name) {
    $invalid = [System.IO.Path]::GetInvalidFileNameChars() -join ''
    $pattern = "[{0}]" -f [Regex]::Escape($invalid)
    $clean = ($name -replace $pattern, '_').Trim()
    if ([string]::IsNullOrWhiteSpace($clean)) { $clean = "workflow" }
    return $clean
}

# --- paginate through all workflows ---
$all = @()
$cursor = $null
do {
    $uri = "$BaseUrl/api/v1/workflows?limit=100"
    if ($cursor) { $uri += "&cursor=$cursor" }
    try {
        $resp = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -ErrorAction Stop
    } catch {
        Write-Error "API request failed: $($_.Exception.Message)"
        exit 1
    }
    $all += $resp.data
    $cursor = $resp.nextCursor
} while ($cursor)

Write-Host "Found $($all.Count) workflows."

# --- write each workflow ---
$seen = @{}
$count = 0
$manifest = @()
foreach ($wf in $all) {
    $base = Get-SafeName $wf.name
    # de-duplicate filenames (n8n allows duplicate workflow names)
    if ($seen.ContainsKey($base)) {
        $seen[$base]++
        $file = "{0}__{1}.json" -f $base, $wf.id
    } else {
        $seen[$base] = 1
        $file = "$base.json"
    }
    $path = Join-Path $OutDir $file

    # keep only the fields needed for a clean re-import
    $export = [ordered]@{
        name        = $wf.name
        nodes       = $wf.nodes
        connections = $wf.connections
        settings    = $wf.settings
        staticData  = $wf.staticData
    }
    # write UTF-8 without BOM (PS 5.1 Out-File -Encoding utf8 adds a BOM that breaks JSON.parse)
    [System.IO.File]::WriteAllText($path, ($export | ConvertTo-Json -Depth 100), (New-Object System.Text.UTF8Encoding $false))

    # record metadata for deterministic de-duplication later
    $manifest += [ordered]@{
        file       = $file
        id         = $wf.id
        name       = $wf.name
        active     = $wf.active
        isArchived = $wf.isArchived
        createdAt  = $wf.createdAt
        updatedAt  = $wf.updatedAt
    }

    $count++
    Write-Host ("  [{0,2}] {1}  ->  {2}" -f $count, $wf.name, $file)
}

# --- write manifest ---
$manifestPath = Join-Path $OutDir "_manifest.json"
[System.IO.File]::WriteAllText($manifestPath, ($manifest | ConvertTo-Json -Depth 10), (New-Object System.Text.UTF8Encoding $false))

Write-Host ""
Write-Host "Done. Exported $count workflow JSON files + _manifest.json to $OutDir"
