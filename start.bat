@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed on this PC.
  echo  Download the Windows LTS installer from https://nodejs.org/
  echo  Run it, click Next ^> Next ^> Install ^> Finish, then re-run start.bat.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo  First-time setup: downloading dependencies ^(needs internet, ~30 sec^)...
  call npm install --no-fund --no-audit
  if errorlevel 1 (
    echo  npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo  Starting prototype on http://localhost:8080 ...
echo  ^(Press Ctrl+C in this window to stop the server.^)
echo.
start "" "http://localhost:8080/"
node server.js
pause
