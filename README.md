# 🚦 Smart Traffic Beacon System

A complete IoT system using ESP32-CAM, YOLO object detection, and real-time web monitoring.

## 🎯 Features

- ✅ **Live Camera Feed** - ESP32-CAM streams video over WiFi
- ✅ **AI Object Detection** - YOLO detects ALL objects & labels as "car"
- ✅ **Green Bounding Boxes** - Visual detection overlay on live feed
- ✅ **Auto-Save** - Captures images with detections to footage folder
- ✅ **BLE Beacon Tracking** - Optional ESP32 beacon distance monitoring
- ✅ **LED Control** - ESP32-CAM LEDs respond to beacon proximity
- ✅ **Real-Time Web UI** - Beautiful dashboard with live stats

---

## 🚀 Quick Start

### 1️⃣ **Start the System**

**Easiest:** Double-click `START_SYSTEM.bat`

**or Manually:**
```powershell
# Terminal 1 - Python Server
cd server
python main.py

# Terminal 2 - React Frontend
npm run dev
```

### 2️⃣ **Connect Hardware**
- Power on ESP32-CAM
- Connect your laptop to ESP32-CAM WiFi hotspot

### 3️⃣ **Open Web Interface**
- Go to: **http://localhost:3000**

**Done!** You should see live camera feed with object detection! 🎉

---

## 📁 Project Structure

```
smart-traffic-beacon-system/
│
├── 📜 START_SYSTEM.bat          ← Double-click to start everything
├── 📜 STOP_SYSTEM.bat           ← Double-click to stop everything
├── 📖 HOW_TO_START.md           ← Complete startup guide
├── 📖 SYSTEM_STATUS.md          ← Current system status
│
├── 🔧 firmware/                 ← ESP32 Arduino code
│   ├── esp32_beacon.ino         ← BLE beacon transmitter
│   └── esp32_cam.ino           ← Camera + LED controller
│
├── 🐍 server/                   ← Python backend
│   ├── main.py                  ← Main server (FastAPI + YOLO)
│   ├── beacon_scanner.py        ← BLE beacon receiver (optional)
│   ├── yolov8n.pt              ← YOLO model weights
│   │
│   ├── 📸 footage/              ← Auto-saved detection images
│   │   └── car_detected_*.jpg   ← Images with green boxes
│   │
│   └── 🧪 test_*.py             ← Test scripts
│
├── ⚛️ src/                      ← React frontend
│   ├── App.tsx                  ← Main web interface
│   └── components/
│
└── 📦 node_modules/             ← Dependencies

```

---

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Arduino IDE (for ESP32 programming)

### Install Dependencies

**Python:**
```powershell
pip install fastapi uvicorn ultralytics opencv-python bleak requests
```

**Node.js:**
```powershell
npm install
```

**Arduino:**
- Install ESP32 board support in Arduino IDE
- Install required libraries (see firmware folder)

---

## 📊 How It Works

```
┌──────────────┐
│  ESP32-CAM   │ → Captures Video
└──────┬───────┘
       │ WiFi Stream
       ↓
┌──────────────┐
│  main.py     │ → YOLO Detection
│  (Python)    │ → Draws Green Boxes
└──────┬───────┘ → Labels as "car"
       │         → Saves to footage/
       │ HTTP API
       ↓
┌──────────────┐
│  React App   │ → Live Dashboard
└──────────────┘ → Shows Detections
```

**Key Features:**
- **conf=0.15** → Very low threshold, detects everything
- **iou=0.3** → Allows overlapping objects
- **max_det=300** → Can detect hundreds of objects
- All objects labeled as "car" (as requested)

---

## 🎮 Usage

### View Live Feed
1. Open: http://localhost:3000
2. See real-time camera with green detection boxes

### Check Saved Images
```powershell
cd server\footage
dir *.jpg
```

### Test Detection
```powershell
cd server
python test_multi_detection.py
# Opens window with live detection
# Press 's' to save, 'q' to quit
```

---

## 🔧 Configuration

### Change ESP32-CAM IP
Edit `server/main.py`:
```python
ESP32_CAM_IP = "192.168.4.1"  # Change if different
```

### Adjust Detection Sensitivity
Edit `server/main.py` (line ~181):
```python
results = model(
    img,
    conf=0.15,      # Lower = more detections (try 0.1)
    iou=0.3,        # Lower = allow more overlap
    max_det=300,    # Higher = more objects
)
```

---

## 📖 Documentation

- **[HOW_TO_START.md](HOW_TO_START.md)** - Complete startup guide
- **[SYSTEM_STATUS.md](SYSTEM_STATUS.md)** - Current system status
- **[MULTI_OBJECT_DETECTION_FIX.md](MULTI_OBJECT_DETECTION_FIX.md)** - Detection improvements
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & fixes

---

## 🧪 Testing

### Test Camera Connection
```powershell
cd server
python test_camera.py
```

### Test Multi-Object Detection
```powershell
cd server
python test_multi_detection.py
```

### View Before/After Changes
```powershell
cd server
python before_after_comparison.py
```

---

## 🐛 Troubleshooting

### No Camera Feed?
- ✅ ESP32-CAM powered on?
- ✅ Connected to ESP32-CAM WiFi?
- ✅ Can you ping 192.168.4.1?

### No Object Detection?
- ✅ YOLO model loaded? (check Python logs)
- ✅ Good lighting?
- ✅ Objects clearly visible?

### Python Server Won't Start?
```powershell
# Kill existing processes
Get-Process python | Stop-Process -Force

# Restart
python main.py
```

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for more help.

---

## 📱 Web Interface

Open **http://localhost:3000** to see:

- 📹 **Live Video Feed** - Real-time camera with detection overlay
- 🚗 **Car Count** - Total detected objects (all labeled as "car")
- 📏 **Beacon Distance** - Optional BLE beacon tracking
- 💡 **LED Status** - Current ESP32-CAM LED mode
- 📊 **System Stats** - FPS, connection status, mode

---

## 🎯 Features Breakdown

### Object Detection
- ✅ Detects **ALL objects** in frame
- ✅ Labels everything as **"car"** (as requested)
- ✅ **Green bounding boxes** (3px thick)
- ✅ **Confidence scores** displayed
- ✅ **Aggressive detection** (low threshold)
- ✅ **Handles overlapping objects**

### Auto-Save
- ✅ Saves **every frame** with detections
- ✅ Stored in `server/footage/`
- ✅ Filenames: `car_detected_TIMESTAMP.jpg`
- ✅ **No delays** - immediate saving

### LED Control (Optional Beacon)
- Far (>30cm): LED 1 static ON
- Near (<30cm): LEDs 1-4 loop (5s interval)
- Flashlight: Always ON

---

## 🤝 System Requirements

**Hardware:**
- ESP32-CAM module
- ESP32 DevKit (optional - for beacon)
- PC/Laptop with WiFi

**Software:**
- Windows 10/11
- Python 3.8+
- Node.js 16+
- Arduino IDE

**Network:**
- Laptop connected to ESP32-CAM WiFi hotspot
- Internet (for initial setup only)

---

## 📝 License

This project is for educational/personal use.

---

## 🎉 You're Ready!

1. **Double-click** `START_SYSTEM.bat`
2. **Connect** to ESP32-CAM WiFi
3. **Open** http://localhost:3000
4. **Point camera** at objects
5. **Watch** them all get detected as "car" with green boxes! 🚗📦☕📱✋

**Have fun!** 🚀

---

## 📞 Quick Commands

```powershell
# Start everything
.\START_SYSTEM.bat

# Stop everything
.\STOP_SYSTEM.bat

# Check status
Get-Process python, node

# View saved images
cd server\footage && dir

# Test detection
cd server && python test_multi_detection.py
```

---

**Built with ❤️ using ESP32, YOLO, FastAPI, and React**
