# ESP32-CAM Troubleshooting Guide

## Camera Initialization Error (0x106 - ESP_ERR_NOT_SUPPORTED)

### What Does This Error Mean?
The error `ESP_ERR_NOT_SUPPORTED` (0x106) indicates that the camera module is either:
1. **Not properly connected** to the ESP32-CAM board
2. **Ribbon cable is incorrectly inserted** 
3. **Insufficient power supply**
4. **Wrong camera module** (rare with AI-Thinker boards)

---

## ✅ Step-by-Step Fix

### 1. **Check Camera Connection**
- Power off the ESP32-CAM completely
- Remove the camera module ribbon cable
- **Important**: The ribbon cable has a **blue side** (facing the camera lens) and a **silver/gold side** (facing the PCB)
  - Insert the cable with the **blue side facing UP** (towards the camera lens)
  - Insert the cable with the **metal contacts facing DOWN** (towards the PCB)
- Push the cable firmly into the connector until it clicks
- Lock the black connector tab

### 2. **Power Supply Check**
ESP32-CAM requires **stable 5V with at least 500mA-1A current**:
- ❌ **Don't use**: USB-to-serial adapters (usually provide insufficient current)
- ✅ **Use**: 
  - Dedicated 5V 2A power adapter
  - USB power bank (good quality)
  - Powered USB hub
  - External power supply module

### 3. **Programming vs Running Mode**
- **When programming**: Connect GPIO0 to GND (pull-down)
- **When running**: GPIO0 should be floating (disconnected)
  - If you keep GPIO0 pulled to GND, the board won't boot normally!

### 4. **Wiring for Programming** (if using FTDI/USB-to-TTL)
```
ESP32-CAM    →    FTDI/USB-TTL
GND          →    GND
5V           →    5V (or VCC)
U0R (RX)     →    TX
U0T (TX)     →    RX
GPIO0        →    GND (only during upload!)
```

**Important**: After uploading, **disconnect GPIO0 from GND** and press the RESET button!

---

## 🔧 What I've Fixed in the Code

### Enhanced Camera Initialization
The updated code now:
1. **Tries multiple resolutions** automatically:
   - First: SVGA (800x600)
   - Second: VGA (640x480) 
   - Third: QVGA (320x240)
2. **Provides detailed error messages** in Serial Monitor
3. **Blinks LED1** if camera init fails (SOS pattern)
4. **Shows camera sensor info** when successful

### Upload the Updated Firmware
1. Open `firmware/esp32_cam.ino` in Arduino IDE
2. Update WiFi credentials (lines 6-7):
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Select **Board**: `AI Thinker ESP32-CAM`
4. Select **Port**: Your COM port
5. Connect GPIO0 to GND
6. Click Upload
7. **After upload completes**: Disconnect GPIO0 from GND
8. Press RESET button
9. Open Serial Monitor (115200 baud) to see diagnostics

---

## 📊 Serial Monitor Output

### ✅ Success
```
Attempting camera initialization...
Camera initialized successfully!
Camera sensor: PID=0x26
WiFi connected!
Camera IP: http://192.168.1.XXX
```

### ❌ Failure
```
Camera init failed (0x106), trying lower resolution...
Camera init failed (0x106), trying QVGA...
Camera init FAILED: 0x106
Please check:
1. Camera module is properly connected
2. Camera ribbon cable is inserted correctly (blue side up)
3. You're using AI-Thinker ESP32-CAM or compatible board
4. Power supply provides sufficient current (5V 2A recommended)
```

Then LED1 will blink rapidly (200ms on/off).

---

## 🎯 Quick Checklist

- [ ] Camera ribbon cable properly inserted (blue side up)
- [ ] Using sufficient power supply (5V 1A minimum, 2A recommended)
- [ ] GPIO0 disconnected from GND after programming
- [ ] WiFi credentials updated in code
- [ ] Board selected as "AI Thinker ESP32-CAM"
- [ ] Serial Monitor set to 115200 baud
- [ ] Pressed RESET button after upload

---

## 🆘 Still Not Working?

If the camera still fails after checking everything above:

1. **Test with minimal code**: Try the ESP32-CAM example sketch:
   - Arduino IDE → File → Examples → ESP32 → Camera → CameraWebServer
   
2. **Check for hardware damage**:
   - Inspect camera module for physical damage
   - Check ribbon cable for tears or breaks
   - Try a different camera module if available

3. **Verify board authenticity**:
   - Some clone boards may have different pin configurations
   - Check the board markings and compare with official AI-Thinker boards

4. **Update ESP32 Board Package**:
   - Arduino IDE → Tools → Board → Boards Manager
   - Search "ESP32"
   - Update to latest version (3.0.0 or newer recommended)

---

## 📝 Common Camera Sensor IDs

When working correctly, you'll see one of these PIDs:
- `0x26` = OV2640 (most common in AI-Thinker ESP32-CAM)
- `0x56` = OV5640 
- `0x36` = OV3660

If you see `PID=0x00` or no PID at all, the camera is not communicating properly.

---

Good luck! 🚀
