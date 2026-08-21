@echo off
chcp 65001 >nul
title Learning Guide Schools - Production Startup
color 0A

echo ============================================================
echo   Learning Guide Schools - Production Mode (Fast)
echo   Backend API (port 5000) + Frontend (port 3000)
echo ============================================================
echo.

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

echo [1/4] Checking dependencies...
cd /d "%BACKEND%"
if not exist node_modules call npm install
cd /d "%FRONTEND%"
if not exist node_modules call npm install

echo.
echo [2/4] Building frontend for production (this makes it very fast)...
cd /d "%FRONTEND%"
call npm run build

echo.
echo [3/4] Starting servers in production mode...
start "LGS-Backend-Prod" cmd /k "cd /d ""%BACKEND%"" && npm run start"
timeout /t 3 /nobreak >nul

start "LGS-Frontend-Prod" cmd /k "cd /d ""%FRONTEND%"" && npm run start"
timeout /t 4 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo ============================================================
echo   Servers running in PRODUCTION mode.
echo   Press any key to STOP both servers and exit...
echo ============================================================
pause >nul

echo.
echo Stopping servers...
taskkill /fi "WINDOWTITLE eq LGS-Backend-Prod*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq LGS-Frontend-Prod*" /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /pid %%a /f >nul 2>&1

echo Done. Goodbye!
timeout /t 2 /nobreak >nul
exit /b 0
