# 🚦 CORRECTED 4 GREEN LED SYSTEM - FINAL VERSION

## ✅ Correct Behavior

### **Normal Operation (Always Running):**
```
LED1 ON (5s) → LED2 ON (5s) → LED3 ON (5s) → LED4 ON (5s) → LED1 ON (5s)... 
(Continuous loop forever)
```

### **When Server Sends Interrupt (Beacon RSSI > -60dBm):**
```
Server detects strong signal → Sends "interrupt" command
↓
ESP32-CAM: IMMEDIATELY turn on LED1 for 5 seconds
↓
After 5 seconds → Resume normal cycling where it left off
```

---

## 🎬 Example Timeline

```
Time | Action
-----|-----------------------------------------------
0s   | LED1 ON (cycling)
5s   | LED2 ON (cycling)
7s   | 🔴 SERVER SENDS INTERRUPT! (beacon detected)
7s   | LED1 turns ON immediately (LED2 turns off)
12s  | Interrupt done → Resume cycling → LED3 ON
17s  | LED4 ON (cycling)
22s  | LED1 ON (cycling)
27s  | LED2 ON (cycling)
30s  | 🔴 SERVER SENDS INTERRUPT AGAIN!
30s  | LED1 turns ON immediately
35s  | Resume cycling → LED3 ON
```

---

## 📝 Files to Update

### **1. ESP32-CAM Code (firmware/esp32_cam.ino)**

**File:** `esp32_cam.ino`

**Step 1: Update variables (lines 27-42)** - Already done! ✅

**Step 2: Replace `led_handler()` function (around line 211)**
```
Copy from: firmware/CORRECT_LED_HANDLER.cpp
```

**Step 3: Replace `loop()` function (around line 326)**
```
Copy from: firmware/CORRECT_LOOP_FUNCTION.cpp
```

### **2. Python Server (server/main.py)**

**File:** `server/main.py`

**Around line 80, in the beacon scanning section:**

**Find this code:**
```python
# LED control based on distance
if self.distance > DISTANCE_THRESHOLD:
    if self.led_mode != "single":
        logging.info(f"🔴 Distance...")
        await self.set_led_mode("single")
else:
    if self.led_mode != "loop":
        logging.info(f"🟢 Distance...")
        await self.set_led_mode("loop")
```

**Replace with:**
```python
# LED control based on RSSI
rssi = data.get('rssi', -100)

if rssi > -60:
    logging.info(f"🔴 RSSI={rssi}dBm > -60dBm - Sending INTERRUPT!")
    await self.set_led_mode("interrupt")
```

See `server/PYTHON_SERVER_UPDATE.txt` for details.

---

## 🔌 Wiring (Same as Before)

```
ESP32-CAM          4 Green LEDs
GPIO 12 ──────────[LED1 Green]──[220Ω]──GND
GPIO 13 ──────────[LED2 Green]──[220Ω]──GND
GPIO 14 ──────────[LED3 Green]──[220Ω]──GND
GPIO 15 ──────────[LED4 Green]──[220Ω]──GND
```

---

## 🎯 Testing Procedure

### **Step 1: Upload ESP32-CAM Code**
1. Edit `firmware/esp32_cam.ino`
2. Replace `led_handler()` with code from `CORRECT_LED_HANDLER.cpp`
3. Replace `loop()` with code from `CORRECT_LOOP_FUNCTION.cpp`
4. Upload to ESP32-CAM

### **Step 2: Connect LEDs**
- Connect 4 green LEDs to GPIO 12, 13, 14, 15
- Each with 220Ω resistor to GND

### **Step 3: Test Without Server First**
1. Power on ESP32-CAM
2. Watch Serial Monitor
3. Should see: "LED Cycle: LED 1 ON", then LED 2, then 3, then 4, repeat
4. **Visually:** LEDs should cycle 1→2→3→4→1...

### **Step 4: Update Python Server**
1. Edit `server/main.py` around line 80
2. Replace distance logic with RSSI interrupt logic
3. Save file

### **Step 5: Run Complete System**
```bash
# Terminal 1: Beacon Scanner
cd server
python beacon_scanner.py

# Terminal 2: Main Server (restart to apply changes)
python server/main.py

# Terminal 3: Web Interface
npm run dev
```

### **Step 6: Test Interrupt**
1. LEDs should be cycling normally
2. Move ESP32 Beacon VERY CLOSE to laptop (< 1 meter)
3. Watch for RSSI > -60 in beacon scanner output
4. LED should jump to LED1 immediately
5. After 5 seconds, resume normal cycling

---

## 📊 Expected Serial Monitor Output

### **ESP32-CAM (Normal Cycling):**
```
LED Cycle: LED 1 ON (5 seconds)
LED Cycle: LED 2 ON (5 seconds)
LED Cycle: LED 3 ON (5 seconds)
LED Cycle: LED 4 ON (5 seconds)
LED Cycle: LED 1 ON (5 seconds)
LED Cycle: LED 2 ON (5 seconds)
```

### **ESP32-CAM (When Interrupted):**
```
LED Cycle: LED 3 ON (5 seconds)
🔴 INTERRUPT! LED1 ON for 5 seconds (Beacon detected!)
✅ Interrupt complete - Resuming normal cycling
LED Cycle: LED 4 ON (5 seconds)
LED Cycle: LED 1 ON (5 seconds)
```

### **Python Server:**
```
📡 Beacon: RSSI=-65dBm, Distance=223.9cm
(Normal - no interrupt)

📡 Beacon: RSSI=-55dBm, Distance=70.8cm
🔴 RSSI=-55dBm > -60dBm - Sending INTERRUPT!

📡 Beacon: RSSI=-48dBm, Distance=28.2cm
🔴 RSSI=-48dBm > -60dBm - Sending INTERRUPT!
```

---

## ⚙️ Key Parameters

### **ESP32-CAM:**
```cpp
const unsigned long LED_INTERVAL = 5000;  // 5 seconds per LED
// Interrupt duration is fixed at 5 seconds
```

### **Python Server:**
```python
if rssi > -60:  # Threshold for interrupt
```

**Adjustable!** Change -60 to:
- `-50` = Only trigger when VERY close (< 50cm)
- `-70` = Trigger at medium distance (2-3 meters)

---

## 🎬 Visual Representation

```
Normal Cycling:
█████░░░░░░░░░ LED1 (5s)
░░░░░█████░░░░ LED2 (5s)
░░░░░░░░░░█████ LED3 (5s)
█████░░░░░░░░░ LED4 (5s)
░░░░░█████░░░░ LED1 (5s)
         ↑
      Interrupt!
         ↓
█████░░░░░░░░░ LED1 (5s) ← Jump to LED1
░░░░░░░░░░█████ LED3 (5s) ← Resume
█████░░░░░░░░░ LED4 (5s)
░░░░░█████░░░░ LED1 (5s)
```

---

## ✅ Success Criteria

Your system is working correctly if:

- [ ] LEDs cycle 1→2→3→4 continuously (5s each)
- [ ] When beacon gets close (RSSI > -60), LED jumps to LED1
- [ ] LED1 stays on for exactly 5 seconds during interrupt
- [ ] After interrupt, cycling resumes normally
- [ ] Can be interrupted multiple times
- [ ] Each interrupt always shows LED1 for 5 seconds

---

## 🚀 Quick Start Commands

```bash
# 1. Edit ESP32-CAM code (copy from CORRECT_* files)
# 2. Upload to ESP32-CAM
# 3. Edit server/main.py (use PYTHON_SERVER_UPDATE.txt)
# 4. Run system:

cd server
python beacon_scanner.py  # Terminal 1

python server/main.py     # Terminal 2

npm run dev              # Terminal 3
```

---

**All code files are ready in:**
- `firmware/CORRECT_LOOP_FUNCTION.cpp`
- `firmware/CORRECT_LED_HANDLER.cpp`
- `server/PYTHON_SERVER_UPDATE.txt`

**Just copy and paste into the correct locations!** 🚦✨
