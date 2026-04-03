# 🚦 4-LED CONTROL SYSTEM - COMPLETE GUIDE

## ✅ SYSTEM UPDATED!

The ESP32-CAM now properly controls 4 LEDs with RSSI-based triggering.

---

## 🔌 Hardware Setup

### LED Connections on ESP32-CAM:

```
LED 1 → GPIO 12 (Green LED)
LED 2 → GPIO 13 (Green LED)
LED 3 → GPIO 14 (Green LED)
LED 4 → GPIO 15 (Green LED)
```

**Each LED needs:**
- LED → 220Ω resistor → GPIO pin
- LED cathode (-) → GND

---

## 🔄 How It Works

### **Default Behavior: 4-LED LOOP**

When NO beacon signal or RSSI outside range:
```
LED1 ON (5 sec) → LED2 ON (5 sec) → LED3 ON (5 sec) → LED4 ON (5 sec) → LED1 ON...
                                                                          (repeat forever)
```

- Only ONE LED is ON at a time
- Each LED stays ON for 5 seconds
- Loop continues infinitely
- This is the DEFAULT mode when system starts

---

### **Triggered Behavior: RSSI -60 to -70 dBm**

When beacon RSSI is between **-60 and -70 dBm**:

```
1. Application detects RSSI in range [-70, -60]
2. Application sends HTTP POST to ESP32-CAM: "mode=trigger"
3. ESP32-CAM immediately:
   - Turns ON LED1
   - Turns OFF LED2, LED3, LED4
4. LED1 stays ON for exactly 5 seconds
5. After 5 seconds, ESP32-CAM automatically:
   - Resumes the 4-LED loop
   - Continues from LED1
```

**Timeline:**
```
[Normal Loop] → [RSSI detected] → [LED1 for 5s] → [Resume Loop]
LED3 active   → Trigger!         → LED1 only    → LED1, LED2, LED3, LED4...
```

---

## 📡 RSSI Trigger Logic

### Python Server (main.py):

```python
# Check beacon RSSI
if -70 <= rssi <= -60:
    # In trigger range!
    send_to_esp32("mode=trigger")
    # ESP32 will: LED1 ON for 5 seconds, then auto-resume loop
else:
    # Outside range - continue normal loop
    send_to_esp32("mode=loop")
    # ESP32 will: Keep cycling LEDs 1-4
```

### ESP32-CAM (esp32_cam.ino):

```cpp
// Trigger Mode (when beacon detected)
if (ledMode == 1) {
    digitalWrite(LED1, HIGH);   // Only LED1 ON
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, LOW);
    
    // After 5 seconds automatically:
    ledMode = 0;  // Back to loop mode
}

// Loop Mode (default)
else {
    // Cycle through LEDs 1-4 every 5 seconds
    LED1 → LED2 → LED3 → LED4 → LED1...
}
```

---

## 🎯 Visual Example

### Scenario: Beacon approaching

```
Time    RSSI    ESP32-CAM LEDs              Mode
---------------------------------------------------
0:00    -90     LED1 ON                     LOOP
0:05    -85     LED2 ON                     LOOP
0:10    -80     LED3 ON                     LOOP
0:15    -75     LED4 ON                     LOOP
0:20    -65     LED1 ON ← TRIGGERED!        TRIGGER
0:21    -65     LED1 ON (still)             TRIGGER
0:22    -65     LED1 ON (still)             TRIGGER
0:23    -65     LED1 ON (still)             TRIGGER
0:24    -65     LED1 ON (still)             TRIGGER
0:25    -65     LED1 ON → LED2 ON           LOOP (resumed)
0:30    -65     LED3 ON ← TRIGGERED AGAIN!  TRIGGER
0:35    -70     LED1 ON (5 seconds)         TRIGGER
0:40    -75     Back to loop                LOOP
```

---

## 🧪 Testing

### Test 1: Default Loop (No Beacon)

**Steps:**
1. Power on ESP32-CAM
2. Don't run beacon_scanner.py
3. Watch the LEDs

**Expected:**
```
LED1 ON (5s) → LED2 ON (5s) → LED3 ON (5s) → LED4 ON (5s) → repeat
```

**Serial Output:**
```
🚦 4 Traffic LEDs initialized - Starting with LED1
🔄 Loop Mode: LED 1 ON
🔄 Loop Mode: LED 2 ON
🔄 Loop Mode: LED 3 ON
🔄 Loop Mode: LED 4 ON
🔄 Loop Mode: LED 1 ON
...
```

---

### Test 2: Triggered Mode (With Beacon)

**Steps:**
1. Start beacon_scanner.py
2. Start main.py
3. Bring ESP32 beacon close to laptop (RSSI should be -60 to -70)
4. Watch the LEDs

**Expected:**
- Normal loop happens
- When RSSI enters [-70, -60] range:
  - LED1 turns ON immediately
  - LED1 stays ON for 5 seconds
  - Loop resumes automatically

**Serial Output (ESP32-CAM):**
```
🔄 Loop Mode: LED 3 ON
🔴 TRIGGERED! LED1 ON for 5 seconds (Beacon RSSI: -60 to -70 dBm)
(LED1 stays on for 5 seconds)
⏱️  5 seconds passed - Resuming 4-LED loop
🔄 Loop Mode: LED 1 ON
🔄 Loop Mode: LED 2 ON
...
```

**Python Logs (main.py):**
```
📡 Beacon: RSSI=-65dBm, Distance=50.2cm
🔴 RSSI -65dBm in range [-70, -60] - TRIGGERING LED1 for 5 seconds!
✅ LED mode set to: TRIGGER
...
🟢 RSSI -75dBm outside trigger range - Continuing 4-LED loop
✅ LED mode set to: LOOP
```

---

## 🔧 Customization

### Change Loop Speed

In `esp32_cam.ino`:
```cpp
const unsigned long LED_INTERVAL = 5000;  // 5 seconds per LED

// Change to 3 seconds:
const unsigned long LED_INTERVAL = 3000;
```

### Change Trigger Duration

In `esp32_cam.ino`:
```cpp
const unsigned long TRIGGER_DURATION = 5000;  // 5 seconds

// Change to 10 seconds:
const unsigned long TRIGGER_DURATION = 10000;
```

### Change RSSI Trigger Range

In `server/main.py`:
```python
if -70 <= rssi <= -60:  # Current range

# Make it more sensitive (wider range):
if -80 <= rssi <= -50:

# Make it less sensitive (narrower range):
if -65 <= rssi <= -62:
```

---

## 📊 Mode Comparison

| Feature | LOOP Mode (Default) | TRIGGER Mode (-60 to -70 dBm) |
|---------|--------------------|-----------------------------|
| **Activation** | Always (when no trigger) | When RSSI in [-70, -60] |
| **LED Pattern** | 1→2→3→4 cycling | LED1 only |
| **Duration** | Infinite | 5 seconds then auto-resume |
| **Trigger** | None | Application sends signal |
| **Auto-Resume** | N/A | Yes, after 5 seconds |

---

## 🐛 Troubleshooting

### Problem: LEDs not looping

**Check:**
1. Are LEDs connected correctly?
2. Check Serial Monitor for "🔄 Loop Mode: LED X ON"
3. Verify GPIO pins in code match your wiring

**Fix:**
```cpp
// In setup(), verify pins are initialized:
pinMode(LED1, OUTPUT);  // GPIO 12
pinMode(LED2, OUTPUT);  // GPIO 13
pinMode(LED3, OUTPUT);  // GPIO 14
pinMode(LED4, OUTPUT);  // GPIO 15
```

---

### Problem: Trigger not working

**Check:**
1. Is beacon_scanner.py running?
2. Is RSSI actually in [-70, -60] range? (check Python logs)
3. Is main.py sending "mode=trigger"? (check logs)

**Debug:**
```powershell
# Check Python logs
# Should see: "TRIGGERING LED1 for 5 seconds!"

# Check ESP32-CAM Serial Monitor
# Should see: "TRIGGERED! LED1 ON for 5 seconds"
```

---

### Problem: LED1 stuck ON

**Possible causes:**
1. RSSI continuously in trigger range
2. Python server keeps sending triggers
3. ESP32-CAM not receiving "mode=loop" command

**Fix:**
1. Move beacon away (make RSSI < -70 or > -60)
2. Check Python logs for "Continuing 4-LED loop"
3. Restart ESP32-CAM

---

## 📝 Summary

✅ **Default**: 4 LEDs loop continuously (5 seconds each)
✅ **When RSSI -60 to -70**: LED1 ON for 5 seconds, then auto-resume loop
✅ **No manual intervention needed**: ESP32 handles everything automatically
✅ **Reliable**: Loop always resumes after trigger expires

**Your LED control system is now PERFECT!** 🎉

---

## 🚀 Quick Start

1. **Upload** `esp32_cam.ino` to ESP32-CAM
2. **Connect** 4 LEDs to GPIOs 12, 13, 14, 15
3. **Start** `python main.py`
4. **Start** `python beacon_scanner.py` (optional)
5. **Watch** LEDs loop automatically!

**When beacon RSSI hits -60 to -70 dBm → LED1 triggers for 5 seconds! 🔴**
