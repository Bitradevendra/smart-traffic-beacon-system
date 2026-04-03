# 🚦 4 GREEN LED SYSTEM - FINAL SPECIFICATIONS

## ✅ System Behavior

### **Normal Operation:**
- **4 Green LEDs** cycle in sequence
- LED1 → LED2 → LED3 → LED4 → LED1... (repeat)
- Each LED stays on for **5 seconds**
- Only one LED on at a time

### **When Beacon is VERY CLOSE (RSSI > -60 dBm):**
- **STOP** cycling immediately
- **LED1 turns ON** (others OFF)
- **Wait 10 seconds**
- **Resume** normal cycling

---

## 📍 GPIO Pin Assignments

```cpp
LED1 = GPIO 12 (Green LED 1)
LED2 = GPIO 13 (Green LED 2)
LED3 = GPIO 14 (Green LED 3)
LED4 = GPIO 15 (Green LED 4)
```

**All 4 LEDs are GREEN!**

---

## 🔌 Wiring

```
GPIO 12 ──→ [Green LED 1] ──→ [220Ω] ──→ GND
GPIO 13 ──→ [Green LED 2] ──→ [220Ω] ──→ GND
GPIO 14 ──→ [Green LED 3] ──→ [220Ω] ──→ GND
GPIO 15 ──→ [Green LED 4] ──→ [220Ω] ──→ GND
```

---

## 📊 RSSI Threshold Logic

**RSSI (Received Signal Strength Indicator):**
- More negative = farther away (weaker signal)
- Less negative = closer (stronger signal)

**Examples:**
- `-30 dBm` = VERY close (< 1 meter) → **STOP MODE**
- `-45 dBm` = Close (1-2 meters) → **STOP MODE**
- `-65 dBm` = Medium distance (3-5 meters) → **CYCLING MODE**
- `-80 dBm` = Far (> 10 meters) → **CYCLING MODE**

**Threshold:** `-60 dBm`
- RSSI > -60 (e.g., -50, -40, -30) = **STOP** at LED1
- RSSI < -60 (e.g., -70, -80, -90) = **CYCLE** normally

---

## 🎬 Example Scenario

### Scenario: Car approaching beacon

```
Time  | Distance | RSSI   | LED System State
------|----------|--------|----------------------------------
0s    | 10m      | -85dBm | Cycling: LED1→LED2→LED3→LED4...
5s    | 5m       | -70dBm | Cycling: LED2 active
10s   | 2m       | -55dBm | STOP! LED1 ON for 10 seconds ⚠️
20s   | 2m       | -55dBm | Resume cycling: LED1 active
25s   | 3m       | -65dBm | Cycling: LED2 active
30s   | 5m       | -75dBm | Cycling: LED3 active
35s   | 10m      | -85dBm | Cycling: LED4 active
40s   | 15m      | -90dBm | Cycling: LED1 active
```

---

## 💻 Code Changes Required

### **1. ESP32-CAM (esp32_cam.ino) - Already Updated!**

✅ LED pins defined (GPIO 12-15)
✅ Variables added (stopStartTime, STOP_DURATION)
✅ LED handler updated (mode=cycle / mode=stop)
⚠️ **MANUAL EDIT NEEDED:** Replace loop() function

**File to copy:** `firmware/NEW_LOOP_FUNCTION.cpp`

**Location in esp32_cam.ino:** Lines 326-351

**Replace the existing loop() function with the new one!**

---

### **2. Python Server (server/main.py)**

**Change needed in beacon scanner section (around line 80):**

**FIND THIS:**
```python
# LED control based on distance
if self.distance > DISTANCE_THRESHOLD:
    if self.led_mode != "single":
        logging.info(f"🔴 Distance {data['distance_cm']:.1f}cm > 30cm - Setting SINGLE LED")
        await self.set_led_mode("single")
else:
    if self.led_mode != "loop":
        logging.info(f"🟢 Distance {data['distance_cm']:.1f}cm < 30cm - Setting LOOP LED")
        await self.set_led_mode("loop")
```

**REPLACE WITH:**
```python
# LED control based on RSSI (signal strength)
rssi = data.get('rssi', -100)

if rssi > -60:
    # VERY CLOSE - Strong signal!
    if self.led_mode != "stop":
        logging.info(f"🔴 RSSI={rssi}dBm > -60dBm - STOP at LED1 for 10 seconds!")
        await self.set_led_mode("stop")
else:
    # Normal distance - Continue cycling
    if self.led_mode != "cycle":
        logging.info(f"🟢 RSSI={rssi}dBm - Normal CYCLING mode")
        await self.set_led_mode("cycle")
```

---

## 🎯 Testing Procedure

### **Step 1: Upload ESP32-CAM Code**
1. Edit esp32_cam.ino
2. Replace loop() function (copy from NEW_LOOP_FUNCTION.cpp)
3. Upload to ESP32-CAM
4. Connect 4 green LEDs to GPIO 12-15

### **Step 2: Update Python Server**
1. Edit server/main.py
2. Replace distance-based logic with RSSI-based logic
3. Restart Python server

### **Step 3: Test**
1. Power on ESP32 Beacon
2. LEDs should start cycling: 1→2→3→4→1...
3. Move beacon VERY CLOSE to laptop
4. When RSSI > -60dBm, LED1 should turn on and stay for 10s
5. After 10s, cycling resumes

---

## 📊 Expected Serial Monitor Output

### **ESP32-CAM:**
```
LED Cycle: LED 1 active
LED Cycle: LED 2 active
LED Cycle: LED 3 active
LED Cycle: LED 4 active
LED Cycle: LED 1 active
LED Mode: STOP at LED1 (Beacon VERY CLOSE - RSSI > -60dBm)
Resuming LED cycling...
LED Cycle: LED 1 active
LED Cycle: LED 2 active
```

### **Python Server:**
```
📡 Beacon: RSSI=-65dBm, Distance=223.9cm
🟢 RSSI=-65dBm - Normal CYCLING mode
📡 Beacon: RSSI=-55dBm, Distance=70.8cm
🔴 RSSI=-55dBm > -60dBm - STOP at LED1 for 10 seconds!
✅ LED mode set to: STOP
📡 Beacon: RSSI=-70dBm, Distance=316.2cm
🟢 RSSI=-70dBm - Normal CYCLING mode
✅ LED mode set to: CYCLE
```

---

## ⚙️ Tunable Parameters

### **ESP32-CAM:**
```cpp
const unsigned long LED_INTERVAL = 5000;  // Cycling speed (5 seconds)
const unsigned long STOP_DURATION = 10000; // Stop duration (10 seconds)
```

### **Python Server:**
```python
if rssi > -60:  # Threshold for "very close"
```

**Adjust these values as needed!**

---

## 🎉 Summary

✅ **4 Green LEDs** cycling continuously  
✅ **5 seconds per LED** in normal mode  
✅ **RSSI > -60 dBm** triggers stop  
✅ **LED1 stays on 10 seconds** when triggered  
✅ **Auto-resume** after 10 seconds  
✅ **Simple, reliable, effective!**

---

**All code is ready! Just need to:**
1. Copy NEW_LOOP_FUNCTION.cpp into esp32_cam.ino
2. Edit server/main.py to use RSSI logic
3. Upload and test!

🚦✨
