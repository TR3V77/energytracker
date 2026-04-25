$ErrorActionPreference = "Stop"

$resultsDir = Join-Path $PSScriptRoot "test_results"
New-Item -ItemType Directory -Path $resultsDir -Force | Out-Null

$xmlPath = Join-Path $resultsDir "proj118-results.xml"
$htmlPath = Join-Path $resultsDir "proj118-results.html"
$pdfPath = Join-Path $resultsDir "proj118-results.pdf"

$tests = @(
    "tests/test_dashboard_api.py",
    "tests/test_recommendations_service.py",
    "tests/test_trends.py"
)

$pyCmd = Get-Command py -ErrorAction SilentlyContinue
if (-not $pyCmd) {
    $pyCmd = Get-Command python -ErrorAction SilentlyContinue
}
if (-not $pyCmd) {
    throw "Python launcher not found. Install Python or add it to PATH."
}

Push-Location (Join-Path $PSScriptRoot "..")
try {
    & $pyCmd.Source -m pytest $tests --junitxml $xmlPath

    $hasPytestHtml = & $pyCmd.Source -m pytest --help | Select-String -Pattern "--html"
    if ($hasPytestHtml) {
        & $pyCmd.Source -m pytest $tests --html $htmlPath --self-contained-html
    }

    if ((Test-Path $htmlPath) -and (Get-Command wkhtmltopdf -ErrorAction SilentlyContinue)) {
        wkhtmltopdf $htmlPath $pdfPath | Out-Null
    }
}
finally {
    Pop-Location
}
