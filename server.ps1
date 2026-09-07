# ==========================================================================
# MERZE MOVIES - LIGHTWEIGHT LOCAL HTTP SERVER (PowerShell)
# Serves the application on http://localhost:3000
# ==========================================================================

$port = 3000
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Magenta
    Write-Host "  MERZE MOVIES (مەرزە موڤیز) پێگەکە چالاکە لەسەر:" -ForegroundColor Cyan
    Write-Host "  $prefix" -ForegroundColor Yellow
    Write-Host "  بۆ وەستاندن دەتوانیت Ctrl + C دابگریت." -ForegroundColor DarkGray
    Write-Host "==========================================================" -ForegroundColor Magenta

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        # Resolve local path
        $filePath = Join-Path $root ($rawUrl.TrimStart('/'))
        $filePath = [System.IO.Path]::GetFullPath($filePath)

        # Security check: must be inside root
        if (!$filePath.StartsWith($root) -or !(Test-Path $filePath -PathType Leaf)) {
            $filePath = Join-Path $root "index.html"
        }

        # Content Types
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".json" { "application/json; charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".ico"  { "image/x-icon" }
            ".webp" { "image/webp" }
            default { "application/octet-stream" }
        }

        $response.ContentType = $contentType
        $response.Headers.Add("Access-Control-Allow-Origin", "*")

        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
}
