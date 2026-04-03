@echo off
echo ========================================
echo Smart Traffic Beacon System - Startup
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0"

echo [1/4] Starting Python Server (Backend)...
echo ----------------------------------------
start "Python Server" cmd /k "cd server && python main.py"
timeout /t 3 /nobreak >nul

echo.
echo [2/4] Starting React Frontend (Web UI)...
echo ----------------------------------------
start "React Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Optional: Start Beacon Scanner (if you have ESP32 beacon)...
echo ----------------------------------------
echo To start beacon scanner manually, run: cd server ^&^& python beacon_scanner.py
echo.

echo.
echo ========================================
echo ✅ SYSTEM STARTED!
echo ========================================
echo.
echo 📡 Python Server:  http://localhost:8000
echo 🌐 Web Interface:  http://localhost:3000
echo.
echo NEXT STEPS:
echo 1. Make sure ESP32-CAM is powered on
echo 2. Connect to ESP32-CAM WiFi hotspot
echo 3. Open http://localhost:3000 in your browser
echo 4. Point camera at objects to detect
echo.
echo Press any key to open web interface...
pause >nul

start http://localhost:3000

echo.
echo System is running! Close these windows to stop.
echo.
