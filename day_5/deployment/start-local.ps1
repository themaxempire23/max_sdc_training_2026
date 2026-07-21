$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

& ".\.venv\Scripts\python.exe" -m pip install -r backend\requirements.txt
& ".\.venv\Scripts\python.exe" backend\train_model.py

if (-not (Test-Path "frontend\node_modules")) {
    npm --prefix frontend install
}

$api = Start-Process -FilePath ".\.venv\Scripts\python.exe" `
    -ArgumentList "-m", "uvicorn", "app.main:app", "--app-dir", "backend", "--host", "127.0.0.1", "--port", "8000" `
    -WindowStyle Hidden -PassThru

try {
    $env:API_URL = "http://127.0.0.1:8000"
    npm --prefix frontend run dev
}
finally {
    Stop-Process -Id $api.Id -ErrorAction SilentlyContinue
}
