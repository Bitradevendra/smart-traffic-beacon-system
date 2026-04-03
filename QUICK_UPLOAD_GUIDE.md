# 🚀 QUICK UPLOAD GUIDE - ESP32-CAM

## ✅ CODE IS READY! WiFi credentials already set to: "espbot" / "espbot1234"

---

## 📤 UPLOAD STEPS (5 minutes):

### 1. **Open Arduino IDE**
   - Open `firmware/esp32_cam.ino`

### 2. **Board Configuration**
   - **Tools** → **Board** → **ESP32 Arduino** → **AI Thinker ESP32-CAM**
   - **Tools** → **Port** → Select your COM port (e.g., COM3, COM4, COM5)

### 3. **Upload the Code**
   1. **Connect GPIO0 to GND** (use a jumper wire)
   2. Click **Upload** button (→ icon)
   3. Wait for "Connecting........"
   4. Upload will start
   5. Wait for "Hard resetting..."
   6. **Remove GPIO0 from GND** (disconnect the jumper)
   7. **Press RESET button** on ESP32-CAM

### 4. **Check Serial Monitor**
   - **Tools** → **Serial Monitor**
   - Set baud rate to: **115200**
   - Press **RESET** button on ESP32-CAM

---

## 📺 WHAT YOU'LL SEE:

### ✅ SUCCESS:
```
=================================
ESP32-CAM Starting...
=================================
Initializing camera...
✓ Camera initialized successfully!
  Camera sensor: PID=0x26

Connecting to WiFi...
  SSID: espbot
..........
✓ WiFi connected!
  IP Address: http://10.12.62.28   ← YOUR IP!

  Access URLs:
    - Video Stream: http://10.12.62.28/stream
    - LED Control:  http://10.12.62.28/led

Starting web server...
✓ Web server started!

=================================
READY TO USE!
=================================
Status: Camera + WiFi + Server OK
=================================
```

### ⚠️ CAMERA FAILED (But still works!):
```
Initializing camera...
✗ Camera init FAILED: 0x106
  → Continuing WITHOUT camera (web server will still work!)

Connecting to WiFi...
✓ WiFi connected!
  IP Address: http://10.12.62.28

=================================
READY TO USE!
=================================
Status: WiFi + Server OK (Camera disabled)
=================================
```

**If camera fails → Check ribbon cable! (Blue side UP)**

### ❌ WiFi FAILED:
```
Connecting to WiFi...
  SSID: espbot
....................
✗ WiFi connection FAILED!
  Check WiFi credentials and try again.
```

**If WiFi fails → ALL 4 LEDs will blink rapidly**
- Check if "espbot" WiFi network exists
- Check if password is correct
- Make sure ESP32-CAM is in range

---

## 🌐 TESTING THE SERVER:

### Test 1: **Open Browser**
Go to the IP shown in Serial Monitor (e.g., `http://10.12.62.28`)

You should see:
```
ESP32-CAM Web Server
Status: Server is running!
View Video Stream
LED Control: POST to /led with mode=single or mode=loop
```

### Test 2: **View Stream**
Click "View Video Stream" or go to: `http://10.12.62.28/stream`
- If camera works → You'll see live video
- If camera failed → You'll see: "Camera not available. Check camera connection."

---

## 🔴 LED INDICATORS:

While uploading/running, watch the LEDs:
- **Startup**: LED1 blinks 3 times rapidly
- **Connecting WiFi**: LED2 blinks
- **WiFi Connected**: LED3 stays ON
- **System Ready**: LED1 stays ON

---

## 🔧 UPDATE PYTHON SERVER:

After you get the IP address from Serial Monitor, update the Python server:

Edit `server/main.py` line 15:
```python
ESP32_CAM_IP = "10.12.62.28"  # Replace with YOUR actual IP!
```

Then restart the Python server.

---

## 🆘 TROUBLESHOOTING:

### "Connecting............" never finishes:
- GPIO0 not connected to GND
- Wrong COM port selected
- Bad USB cable

### Can't access IP in browser:
- Make sure your computer is on the same "espbot" network
- Check firewall settings
- Try pinging the IP: `ping 10.12.62.28`

### Camera fails but you need it:
1. Power off completely
2. Check camera ribbon cable (blue side UP)
3. Make sure using 5V 2A power supply
4. Re-upload code

---

## ⚡ URGENT MODE - SKIP CAMERA:

If camera keeps failing and you need to test NOW:
1. The web server will work without the camera
2. You can test LED control
3. Fix camera later

The system is designed to continue working even if camera fails!

---

**You're all set! Upload now and check Serial Monitor for the IP address!** 🎉
