@echo off
echo ========================================
echo Smart Traffic Beacon System - STOP
echo ========================================
echo.

echo Stopping all system components...
echo.

echo [1/2] Stopping Python Server...
taskkill /F /IM python.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Python server stopped
) else (
    echo    ⚠️  No Python processes found
)

echo.
echo [2/2] Stopping React Frontend...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ React frontend stopped
) else (
    echo    ⚠️  No Node processes found
)

echo.
echo ========================================
echo ✅ ALL STOPPED!
echo ========================================
echo.
echo You can now safely close this window.
echo.
pause
