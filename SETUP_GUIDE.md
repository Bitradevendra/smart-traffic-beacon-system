# Quick Setup Guide

## Step 1: ESP32 Beacon Setup (5 minutes)

1. Open Arduino IDE
2. Install ESP32 board support (if not already installed)
3. Open `firmware/esp32_beacon.ino`
4. Select board: "ESP32 Dev Module"
5. Click Upload
6. Done! ESP32 will start broadcasting beacon signals

**Required Library:**
- ESP32 BLE Arduino (included with ESP32 board package)

---

## Step 2: ESP32-CAM Setup (10 minutes)

### Hardware Connections:
```
ESP32-CAM GPIO → LED (with 220Ω resistor)
GPIO 12 → LED 1 (Positive)
GPIO 13 → LED 2 (Positive)
GPIO 14 → LED 3 (Positive)
GPIO 15 → LED 4 (Positive)
GND → All LED negatives
```

### Software:
1. Open `firmware/esp32_cam.ino`
2. **CHANGE THESE LINES:**
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Select board: "AI Thinker ESP32-CAM"
4. Upload using FTDI programmer
5. Open Serial Monitor (115200 baud)
6. **NOTE THE IP ADDRESS** shown (e.g., 192.168.1.100)
7. Reset ESP32-CAM

**Required Libraries:**
- esp_camera (included with ESP32 board)
- WiFi (included)
- esp_http_server (included)

---

## Step 3: Python Server Setup (5 minutes)

1. Open `server/main.py`
2. **CHANGE THIS LINE:**
   ```python
   ESP32_CAM_IP = "192.168.1.100"  # Use IP from Step 2
   ```
3. Save the file
4. Double-click `start.bat` (it will auto-install everything)

**First run will:**
- Create virtual environment
- Install Python packages
- Download YOLOv8 model (~6MB)
- Start the server

---

## Step 4: Test the System

### Testing Checklist:
- [ ] ESP32 Beacon LED is blinking (if you have one)
- [ ] ESP32-CAM shows IP in Serial Monitor
- [ ] Python server shows "System started!" message
- [ ] Browser opens to http://localhost:8000
- [ ] Video feed is visible
- [ ] Distance shows a value (not 999)
- [ ] LED #1 turns on when distance > 30cm
- [ ] LEDs cycle when you bring ESP32 Beacon closer

### If something doesn't work:
1. Check all devices are powered
2. Check WiFi connections
3. Check IP address is correct
4. See README.md Troubleshooting section

---

## Step 5: Customize (Optional)

### Change distance threshold:
Edit `server/main.py`:
```python
DISTANCE_THRESHOLD = 0.5  # 50cm instead of 30cm
```

### Change LED timing:
Edit `firmware/esp32_cam.ino`:
```cpp
delay(3000);  // 3 seconds instead of 5
```

---

## Common Issues

### "Beacon not found"
- Make sure ESP32 Beacon is powered on
- Check Bluetooth is enabled on your PC
- Move ESP32 Beacon closer to PC

### "Camera capture failed"
- Check camera ribbon cable connection
- Try different power supply (min 5V 2A)
- Verify camera is enabled in code

### "No video feed"
- Check ESP32-CAM IP address
- Ping the ESP32-CAM: `ping 192.168.1.100`
- Make sure PC and ESP32-CAM are on same WiFi

---

## File Sizes Reference

| Component | Code Size | Flash Usage |
|-----------|-----------|-------------|
| ESP32 Beacon | ~250KB | ~18% (of 1.4MB) |
| ESP32-CAM | ~350KB | ~25% (of 1.4MB) |

Both codes are optimized to be small and efficient!

---

## Next Steps

Once everything is working:
1. Position ESP32-CAM to view toy cars
2. Test with toy cars at different distances
3. Check footage folder for saved images
4. Customize LED patterns if needed
5. Adjust YOLO confidence threshold for better detection

**Enjoy your Smart Traffic Beacon System! 🚦**
