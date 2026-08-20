@echo off
chcp 65001 >nul
title Learning Guide Schools - Startup
color 0B

echo ============================================================
echo   Learning Guide Schools - Website Launcher
echo   Backend API (port 5000) + Frontend (port 3000)
echo ============================================================
echo.

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

where node >nul 2>&1
if %errorlevel% neq 0 goto nonode
goto checkdeps

:nonode
echo [ERROR] Node.js not found. Install from https://nodejs.org
pause
exit /b 1

:checkdeps
echo [1/4] Node.js: 
node --version
echo.

cd /d "%BACKEND%"
if exist node_modules goto backenddeps
echo [2/4] Installing backend deps...
call npm install
echo        Done.
goto frontendcheck

:backenddeps
echo [2/4] Backend deps present.

:frontendcheck
echo.
cd /d "%FRONTEND%"
if exist node_modules goto frontenddeps
echo [3/4] Installing frontend deps...
call npm install
echo        Done.
goto startservers

:frontenddeps
echo [3/4] Frontend deps present.

:startservers
echo.
echo [4/4] Starting servers...
echo        Backend  -^> http://localhost:5000/api
echo        Frontend -^> http://localhost:3000
echo.
echo ============================================================
echo   Servers starting. Press ANY KEY here to STOP both.
echo ============================================================
echo.

start "LGS-Backend" cmd /k "cd /d ""%BACKEND%"" && npm run dev"
timeout /t 4 /nobreak >nul

start "LGS-Frontend" cmd /k "cd /d ""%FRONTEND%"" && npm run dev"
timeout /t 6 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo Press any key to STOP both servers and exit...
pause >nul

echo.
echo Stopping servers...
taskkill /fi "WINDOWTITLE eq LGS-Backend*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq LGS-Frontend*" /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /pid %%a /f >nul 2>&1

echo Done. Goodbye!
timeout /t 2 /nobreak >nul
exit /b 0

