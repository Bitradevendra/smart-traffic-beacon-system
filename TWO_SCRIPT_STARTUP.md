# 🚀 TWO-SCRIPT SYSTEM - STARTUP GUIDE

## ✅ No More Conflicts! Beacon Scanner is Separate!

---

## 📋 THE NEW SYSTEM:

### **Script 1: beacon_scanner.py** 📡
- **Purpose**: Scans for ESP32 Beacon via Bluetooth  
- **Output**: Writes to `beacon_status.json`
- **Runs independently**
- **No camera/network conflicts!**

### **Script 2: main.py** 🎥
- **Purpose**: Camera processing, YOLO detection, web server
- **Reads**: `beacon_status.json` for beacon data
- **No Bluetooth scanning** (reads from file)
- **Handles**: Camera + LED control + Web API

---

## 🚀 STARTUP PROCEDURE:

### **Terminal 1: Start Beacon Scanner**
```powershell
cd C:\Users\iamir\Downloads\smart-traffic-beacon-system\server
python beacon_scanner.py
```

**You'll see:**
```
==================================================
ESP32 Beacon Scanner - Standalone Mode
==================================================

This will scan for Bluetooth devices...
Make sure:
  1. ESP32 Beacon is powered ON
  2. Bluetooth is enabled on this computer
  3. Run this as Administrator (Windows)

==================================================

🔍 ESP32 Beacon Scanner Started
==================================================
Searching for beacon...
==================================================
⏳ No beacon found... scanning again...
  Found: Some Device (RSSI: -65)
  Found: Another Device (RSSI: -72)
⏳ No beacon found... scanning again...

✅ BEACON DETECTED!
   Name: ESP32_Beacon
   RSSI: -45 dBm
   Distance: 28.3 cm
--------------------------------------------------
```

**Keep this running!** It continuously scans and updates the file.

---

### **Terminal 2: Start Main Server**
```powershell
cd C:\Users\iamir\Downloads\smart-traffic-beacon-system
python server/main.py
```

**You'll see:**
```
🔍 Starting beacon status monitor (file-based)...
📝 Make sure beacon_scanner.py is running separately!
🎥 Starting camera feed processor...
INFO: Uvicorn running on http://0.0.0.0:8000

📡 Beacon: RSSI=-45dBm, Distance=28.3cm
🟢 Distance 28.3cm < 30cm - Setting LOOP LED
✅ LED mode set to: LOOP
```

---

### **Terminal 3: Start Web Interface**
```powershell
cd C:\Users\iamir\Downloads\smart-traffic-beacon-system
npm run dev
```

**Opens**: `http://localhost:3000`

---

## 🎯 HOW IT WORKS:

```
┌─────────────────────┐
│  ESP32 Beacon       │
│  (Broadcasting BLE) │
└──────────┬──────────┘
           │ Bluetooth
           ▼
┌─────────────────────┐
│ beacon_scanner.py   │  ← Terminal 1
│ (Scans Bluetooth)   │
└──────────┬──────────┘
           │ Writes
           ▼
    beacon_status.json
           │ Reads
           ▼
┌─────────────────────┐
│   main.py           │  ← Terminal 2
│ (Camera + Web API)  │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│  Web Interface      │  ← Terminal 3
│  (localhost:3000)   │
└─────────────────────┘
```

---

## 📁 beacon_status.json Format:

When beacon is detected:
```json
{
  "active": true,
  "distance_cm": 28.3,
  "rssi": -45,
  "timestamp": 1703876543.123,
  "device_name": "ESP32_Beacon"
}
```

When beacon is NOT detected:
```json
{
  "active": false,
  "distance_cm": 999,
  "rssi": null,
  "timestamp": 1703876543.456
}
```

---

## 🔍 TESTING THE BEACON SCANNER:

### **Step 1: Test Bluetooth Scanning**
```powershell
cd C:\Users\iamir\Downloads\smart-traffic-beacon-system\server
python beacon_scanner.py
```

**Watch for:**
- Lists all Bluetooth devices found
- Should detect ESP32_Beacon if it's on
- Shows distance in real-time

**If no devices found AT ALL:**
- Bluetooth might be disabled
- Need to run as Administrator
- Bluetooth driver issue

### **Step 2: Check the Status File**
```powershell
# In another terminal
cd C:\Users\iamir\Downloads\smart-traffic-beacon-system\server
cat beacon_status.json
```

You should see the JSON with beacon status!

### **Step 3: Start Main Server**
Once beacon_scanner.py is working, start main.py in another terminal.

---

## ✅ ADVANTAGES OF TWO-SCRIPT SYSTEM:

1. **No Bluetooth Conflicts** ✅
   - Camera processing doesn't block BLE scanning
   - Each script does one thing

2. **Easy Debugging** ✅
   - See beacon scanner output separately
   - Can restart one without affecting other

3. **Works Even if Beacon Fails** ✅
   - Main server continues if beacon scanner crashes
   - Camera + web still work

4. **Better Performance** ✅
   - Camera stream is smoother
   - Beacon scanning is independent

---

## 🆘 TROUBLESHOOTING:

### **"No devices found" in beacon scanner**
**Fix:**
1. Run PowerShell as **Administrator**
2. Enable Bluetooth in Windows Settings
3. Make sure ESP32 Beacon is powered on
4. Move ESP32 Beacon closer to laptop

### **"beacon_status.json not found" in main.py**
**Fix:**
- Start `beacon_scanner.py` first!
- Check if file exists in server/ directory
- Let scanner run for 2-3 seconds to create file

### **Beacon shows as "Searching..." in web**
**Options:**
1. Check if beacon_scanner.py is running
2. Check if beacon_scanner.py sees the beacon
3. Check beacon_status.json file
4. ESP32 Beacon might not be broadcasting

---

## 🎉 COMPLETE STARTUP CHECKLIST:

- [ ] ESP32 Beacon powered ON
- [ ] ESP32-CAM powered ON (creates WiFi hotspot)
- [ ] Laptop connected to ESP32-CAM WiFi (if needed)
- [ ] Bluetooth enabled on laptop
- [ ] Terminal 1: `python beacon_scanner.py` ✅
- [ ] Terminal 2: `python server/main.py` ✅
- [ ] Terminal 3: `npm run dev` ✅
- [ ] Open browser: `http://localhost:3000`

---

## 📊 EXPECTED OUTPUT:

**beacon_scanner.py:**
```
✅ BEACON DETECTED!
   Name: ESP32_Beacon
   RSSI: -52 dBm
   Distance: 35.1 cm
```

**main.py:**
```
📡 Beacon: RSSI=-52dBm, Distance=35.1cm
🔴 Distance 35.1cm > 30cm - Setting SINGLE LED
```

**Web Interface:**
```
🟢 Beacon: Active
🔵 Camera: Connected
Distance: 35.1cm
Mode: FAR
LED: Static (LED 1)
```

---

**START beacon_scanner.py FIRST, then main.py, then npm run dev!** 🚀✨
