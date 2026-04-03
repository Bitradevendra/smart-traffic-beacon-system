@echo off
echo ============================================
echo  Smart Traffic Beacon System Launcher
echo ============================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install requirements
echo Installing/Updating requirements...
pip install -r requirements.txt --quiet
echo.

REM Create footage directory
if not exist "footage\" (
    mkdir footage
)

REM Start the server
echo ============================================
echo Starting Traffic Beacon System...
echo ============================================
echo.
echo Web UI will be available at: http://localhost:8000
echo.
echo IMPORTANT: 
echo 1. Make sure ESP32-CAM is powered on and connected to WiFi
echo 2. Make sure ESP32 Beacon is powered on
echo 3. Update ESP32_CAM_IP in server/main.py if needed
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

cd server
python main.py

pause
