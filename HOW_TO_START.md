# 🚀 HOW TO START THE SMART TRAFFIC BEACON SYSTEM

## Quick Start (Easy Method)

### Option 1: Double-Click Startup Script ⚡
**Fastest way to start everything!**

1. **Double-click** `START_SYSTEM.bat` in the project folder
2. This will automatically:
   - ✅ Start Python server (backend)
   - ✅ Start React frontend (web UI)
   - ✅ Open your browser to http://localhost:3000

That's it! 🎉

---

## Manual Start (Step-by-Step Method)

If you prefer to start components manually or the batch file doesn't work:

### Step 1: Start Python Server (Backend)

**Open PowerShell/Terminal #1:**
```powershell
cd c:\Users\iamir\Downloads\smart-traffic-beacon-system\server
python main.py
```

**You should see:**
```
INFO:root:🔍 Starting beacon status monitor (file-based)...
INFO:root:🎥 Starting camera feed processor...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**✅ Leave this window open!**

---

### Step 2: Start React Frontend (Web UI)

**Open PowerShell/Terminal #2:**
```powershell
cd c:\Users\iamir\Downloads\smart-traffic-beacon-system
npm run dev
```

**You should see:**
```
VITE ready in XXX ms
➜ Local:   http://localhost:3000/
```

**✅ Leave this window open!**

---

### Step 3 (Optional): Start Beacon Scanner

**Only if you have the ESP32 beacon transmitter:**

**Open PowerShell/Terminal #3:**
```powershell
cd c:\Users\iamir\Downloads\smart-traffic-beacon-system\server
python beacon_scanner.py
```

**You should see:**
```
📡 Scanning for beacon...
```

**✅ Leave this window open!**

---

### Step 4: Connect Hardware

#### A. Power On ESP32-CAM
1. Connect power to ESP32-CAM
2. Wait for WiFi hotspot to start (~5 seconds)
3. The flashlight should turn ON automatically

#### B. Connect to ESP32-CAM WiFi
1. On your laptop, go to WiFi settings
2. Look for the ESP32-CAM WiFi network
   - Name: Check your `esp32_cam.ino` firmware for SSID
   - Default is usually: `ESP32-CAM-AP`
3. Connect to this network
4. Wait for connection to establish

---

### Step 5: Open Web Interface

**In your browser, go to:**
```
http://localhost:3000
```

**You should see:**
- ✅ Camera feed with live video
- ✅ Green boxes around detected objects
- ✅ All objects labeled as "car"
- ✅ Car count updating in real-time
- ✅ System stats (distance, LED status)

---

## 🔍 Troubleshooting Startup

### Problem: "Python Server won't start"

**Error: "Address already in use"**
```powershell
# Kill existing Python processes
Get-Process python | Stop-Process -Force

# Try starting again
cd server
python main.py
```

**Error: "No module named 'fastapi'"**
```powershell
# Install dependencies
pip install fastapi uvicorn ultralytics opencv-python bleak requests
```

---

### Problem: "React Frontend won't start"

**Error: "Port 3000 already in use"**
```powershell
# Kill process using port 3000
netstat -ano | findstr :3000
# Note the PID and kill it:
taskkill /PID <PID> /F

# Or start on different port:
npm run dev -- --port 3001
```

**Error: "npm: command not found"**
```powershell
# Install Node.js first
# Download from: https://nodejs.org/

# Then install dependencies:
npm install
```

---

### Problem: "No camera feed / Connection Error"

**Fix:**
1. ✅ ESP32-CAM is powered on (check flashlight)
2. ✅ Connected to ESP32-CAM WiFi (not your home WiFi!)
3. ✅ Check IP address in firmware matches `server/main.py`
4. ✅ Test connection:
   ```powershell
   ping 192.168.4.1
   ```

---

### Problem: "Object detection not working"

**Check these:**

1. **Is YOLO model loaded?**
   - Look for: `✅ YOLO model loaded successfully` in Python logs
   - If not, see PyTorch fix in `main.py`

2. **Is camera connected?**
   - Python logs should NOT show: `❌ Cannot connect to camera`

3. **Are objects visible?**
   - Good lighting
   - Clear, distinct objects
   - Camera focused properly

4. **Lower confidence even more:**
   ```python
   # In server/main.py line ~181
   conf=0.1  # Try even lower than 0.15
   ```

---

## 📋 Complete Startup Checklist

Use this checklist every time you start the system:

- [ ] **1. Start Python Server**
  - `cd server && python main.py`
  - Check for: `Uvicorn running on http://0.0.0.0:8000`

- [ ] **2. Start React Frontend**
  - `npm run dev`
  - Check for: `Local: http://localhost:3000/`

- [ ] **3. (Optional) Start Beacon Scanner**
  - `cd server && python beacon_scanner.py`
  - Only if you have ESP32 beacon

- [ ] **4. Power ESP32-CAM**
  - Flashlight should turn ON

- [ ] **5. Connect to ESP32-CAM WiFi**
  - Disconnect from home WiFi
  - Connect to ESP32-CAM hotspot

- [ ] **6. Open Browser**
  - Go to: `http://localhost:3000`

- [ ] **7. Verify Detection**
  - Put objects in front of camera
  - Should see green boxes
  - Should see "car" labels
  - Pictures saving in `server/footage/`

---

## 🛑 How to Stop Everything

### Easy Method:
1. Close all terminal windows
2. Or run: `STOP_SYSTEM.bat` (if created)

### Manual Method:
1. **Stop Python Server:** Press `Ctrl+C` in Python terminal
2. **Stop React Frontend:** Press `Ctrl+C` in React terminal
3. **Stop Beacon Scanner:** Press `Ctrl+C` in scanner terminal (if running)

### Nuclear Option (Kill All):
```powershell
# Kill all Python processes
Get-Process python | Stop-Process -Force

# Kill all Node processes
Get-Process node | Stop-Process -Force
```

---

## 🔄 Quick Restart

If you need to restart everything:

```powershell
# Stop everything
Get-Process python | Stop-Process -Force
Get-Process node | Stop-Process -Force

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start again
cd c:\Users\iamir\Downloads\smart-traffic-beacon-system
.\START_SYSTEM.bat
```

---

## 📱 System Architecture

```
┌─────────────────┐
│   ESP32 Beacon  │ (Optional - sends BLE signal)
│   (Transmitter) │
└────────┬────────┘
         │ BLE
         ↓
┌─────────────────┐
│ beacon_scanner  │ (Optional - receives BLE)
│    (Python)     │ → beacon_status.json
└─────────────────┘
         ↓
┌─────────────────┐      ┌──────────────┐
│   ESP32-CAM     │ WiFi │ main.py      │
│ (Camera + LEDs) │←────→│ (Python)     │
└─────────────────┘      │ + YOLO       │
                         └──────┬───────┘
                                │ HTTP API
                                ↓
                         ┌──────────────┐
                         │ React App    │
                         │ (Frontend)   │
                         └──────────────┘
                                ↓
                         ┌──────────────┐
                         │   Browser    │
                         │ localhost:3000│
                         └──────────────┘
```

---

## 🎯 Summary

**Easiest way:** Double-click `START_SYSTEM.bat` ✨

**Manual way:**
1. Terminal 1: `cd server && python main.py`
2. Terminal 2: `npm run dev`
3. Connect to ESP32-CAM WiFi
4. Open: `http://localhost:3000`

**You're done!** 🚀

The system will:
- ✅ Show live camera feed
- ✅ Detect ALL objects with green boxes
- ✅ Label everything as "car"
- ✅ Auto-save to `footage/` folder
- ✅ Update stats in real-time

**Enjoy your Smart Traffic Beacon System!** 🎉
