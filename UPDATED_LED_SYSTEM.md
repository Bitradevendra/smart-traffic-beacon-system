# ✅ UPDATED LED CONTROL SYSTEM

## Changes Made:
1. ✅ **Default loop time**: 10 seconds per LED (changed from 5 seconds)
2. ✅ **Trigger condition**: Beacon distance > 30cm (changed from RSSI-based)
3. ✅ **Trigger duration**: LED1 ON for 20 seconds (changed from 5 seconds)

---

## 🔄 How It Works Now

### **Default Behavior: 4-LED LOOP**

When beacon is **<= 30cm** OR no beacon detected:

```
LED1 ON (10s) → LED2 ON (10s) → LED3 ON (10s) → LED4 ON (10s) → LED1 ON...
                                                                   (repeat)
```

- Each LED stays ON for **10 seconds**
- Continuous infinite loop
- This is the *default* mode

---

### **Triggered Behavior: Distance > 30cm**

When beacon is **more than 30cm away**:

```
1. Application detects: distance > 30cm
2. Application sends: "mode=trigger"
3. ESP32-CAM immediately:
   - Turns ON LED1
   - Turns OFF LED2, LED3, LED4
4. LED1 stays ON for 20 seconds
5. After 20 seconds automatically:
   - Resumes 4-LED loop
   - Continues from LED1
```

---

## 📊 Visual Timeline

```
Time    Distance   LED State              Mode       Action
----------------------------------------------------------------
0:00    15cm       LED1 ON (10s)          LOOP       Normal cycling
0:10    15cm       LED2 ON (10s)          LOOP       Normal cycling
0:20    15cm       LED3 ON (10s)          LOOP       Normal cycling
0:30    50cm       LED1 ON ← TRIGGER!     TRIGGER    Distance > 30cm!
0:35    50cm       LED1 ON (holding)      TRIGGER    Waiting...
0:40    50cm       LED1 ON (holding)      TRIGGER    Waiting...
0:45    50cm       LED1 ON (holding)      TRIGGER    Still holding...
0:50    50cm       LED1 → Resume          LOOP       20s passed!
0:60    50cm       LED2 ON (10s)          LOOP       Back to normal
```

---

## 🎯 Trigger Logic

### Python Server (main.py):

```python
if distance_cm > 30:
    # Beacon is FAR (> 30cm)
    send_to_esp32("mode=trigger")
    # ESP32: LED1 ON for 20 seconds, then auto-resume loop
else:
    # Beacon is CLOSE (<= 30cm)
    send_to_esp32("mode=loop")
    # ESP32: Keep cycling LEDs 1-4 (10s each)
```

### ESP32-CAM (esp32_cam.ino):

```cpp
const unsigned long LED_INTERVAL = 10000;     // 10s per LED in loop
const unsigned long TRIGGER_DURATION = 20000;  // 20s for trigger
```

---

## 📝 Example Scenarios

### Scenario 1: Beacon Very Close (10cm)
```
Distance: 10cm (< 30cm)
LEDs: Normal loop → 1(10s) → 2(10s) → 3(10s) → 4(10s) → repeat
Mode: LOOP (no trigger)
```

### Scenario 2: Beacon Far Away (50cm)
```
Distance: 50cm (> 30cm)
LEDs: Currently LED3 → Trigger! → LED1 for 20s → Resume loop
Mode: TRIGGER → wait 20s → LOOP
```

### Scenario 3: Beacon Moving Away
```
0:00 - Distance 15cm → Normal loop (LED2 active)
0:10 - Distance 40cm → TRIGGER! LED1 turns ON
0:30 - Distance 40cm → Still LED1 (20s total)
0:30 - Auto-resume → LED1(10s) → LED2(10s) → ...
```

### Scenario 4: Beacon Approaching
```
0:00 - Distance 60cm → LED1 triggered for 20s
0:20 - Distance 25cm → Resume loop, distance now < 30cm
0:30 - Distance 20cm → Continue loop normally
```

---

## 🔧 Timing Summary

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Loop LED Duration** | 10 seconds | How long each LED stays ON in normal loop |
| **Trigger Duration** | 20 seconds | How long LED1 stays ON when triggered |
| **Trigger Condition** | > 30cm | Distance threshold to activate trigger |
| **Loop Condition** | <= 30cm | Distance threshold for normal loop |

---

## 🧪 Testing

### Test 1: Normal Loop (Beacon Close)
**Setup:** Keep beacon < 30cm from laptop

**Expected:**
```
LED1 ON (10s) → LED2 ON (10s) → LED3 ON (10s) → LED4 ON (10s) → repeat
```

**Serial Output:**
```
📡 Beacon: RSSI=-55dBm, Distance=25.0cm
🟢 Distance 25.0cm <= 30cm - Continuing 4-LED loop (10s each)
🔄 Loop Mode: LED 1 ON
🔄 Loop Mode: LED 2 ON
🔄 Loop Mode: LED 3 ON
🔄 Loop Mode: LED 4 ON
```

---

### Test 2: Triggered Mode (Beacon Far)
**Setup:** Move beacon > 30cm away

**Expected:**
- LED1 turns ON immediately
- Stays ON for 20 seconds
- Automatically resumes loop

**Serial Output (ESP32-CAM):**
```
🔴 TRIGGERED! LED1 ON for 20 seconds (Beacon >30cm away)
(LED1 stays on for 20 seconds)
⏱️  20 seconds passed - Resuming 4-LED loop
🔄 Loop Mode: LED 1 ON
🔄 Loop Mode: LED 2 ON
```

**Python Logs:**
```
📡 Beacon: RSSI=-75dBm, Distance=45.2cm
🔴 Distance 45.2cm > 30cm - TRIGGERING LED1 for 20 seconds!
✅ LED mode set to: TRIGGER
```

---

## 🔄 State Diagram

```
┌─────────────────────────┐
│  LOOP MODE (Default)    │
│  LED1→LED2→LED3→LED4    │
│  10s each              │
└────────┬────────────────┘
         │
         │ Distance > 30cm
         ↓
┌─────────────────────────┐
│  TRIGGER MODE           │
│  LED1 ONLY             │
│  20 seconds            │
└────────┬────────────────┘
         │
         │ 20s elapsed
         ↓
┌─────────────────────────┐
│  AUTO-RESUME            │
│  Back to LOOP MODE      │
│  Start from LED1        │
└─────────────────────────┘
```

---

## ⚙️ Customization

### Change Loop Speed (currently 10s)
In `esp32_cam.ino`:
```cpp
const unsigned long LED_INTERVAL = 10000;  // 10 seconds

// Change to 5 seconds:
const unsigned long LED_INTERVAL = 5000;
```

### Change Trigger Duration (currently 20s)
In `esp32_cam.ino`:
```cpp
const unsigned long TRIGGER_DURATION = 20000;  // 20 seconds

// Change to 30 seconds:
const unsigned long TRIGGER_DURATION = 30000;
```

### Change Distance Threshold (currently 30cm)
In `server/main.py`:
```python
if distance_cm > 30:  # Current threshold

# Change to 50cm:
if distance_cm > 50:
```

---

## 📞 Quick Summary

| Beacon Distance | LED Behavior | Duration |
|----------------|-------------|----------|
| **<= 30cm** (Close) | Normal loop: 1→2→3→4 | 10s each LED |
| **> 30cm** (Far) | LED1 only (triggered) | 20s total |

**After trigger expires:** Automatically resumes normal loop

---

## 🚀 Upload & Test

1. **Upload** updated `esp32_cam.ino` to ESP32-CAM
2. **Restart** Python server: `python main.py`
3. **Start** beacon scanner: `python beacon_scanner.py`
4. **Move beacon away** (> 30cm) → LED1 triggers for 20s!
5. **Move beacon close** (<= 30cm) → LEDs loop normally (10s each)

---

**Your LED control system is now updated!** ✅

- ✅ 10 seconds per LED in loop
- ✅ 20 seconds for LED1 when triggered
- ✅ Triggers when beacon > 30cm away
