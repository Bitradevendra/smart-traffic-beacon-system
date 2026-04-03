# 🚦 4-LED TRAFFIC LIGHT WIRING GUIDE

## 📍 LED PIN ASSIGNMENTS

```
LED1 = GPIO 12 (Green)   - Distance > 30cm stays ON
LED2 = GPIO 13 (Yellow)  - Cycles when distance < 30cm
LED3 = GPIO 14 (Orange)  - Cycles when distance < 30cm
LED4 = GPIO 15 (Red)     - Cycles when distance < 30cm
```

---

## 🔌 WIRING DIAGRAM

### **Components Needed:**
- 4x LEDs (Green, Yellow, Orange, Red)
- 4x 220Ω resistors
- Jumper wires
- Breadboard (optional)

### **Pinout:**

```
ESP32-CAM AI-Thinker
┌─────────────┐
│             │
│   GPIO 12 ──┼──→ LED1 (Green)  ──[220Ω]── GND
│   GPIO 13 ──┼──→ LED2 (Yellow) ──[220Ω]── GND
│   GPIO 14 ──┼──→ LED3 (Orange) ──[220Ω]── GND
│   GPIO 15 ──┼──→ LED4 (Red)    ──[220Ω]── GND
│             │
│   GND ──────┼──→ Common Ground
│   5V ───────┼──→ Power (if needed)
└─────────────┘
```

### **Breadboard Layout:**

```
         ESP32-CAM
            │
         GPIO 12 ──┬── LED1 (+) ──[220Ω]──┐
         GPIO 13 ──┼── LED2 (+) ──[220Ω]──┤
         GPIO 14 ──┼── LED3 (+) ──[220Ω]──┼── GND
         GPIO 15 ──┼── LED4 (+) ──[220Ω]──┘
            │
          GND
```

---

## 🎨 LED ORIENTATION

### **LED Polarity:**
```
     LED
   ┌─────┐
   │  +  │ ← Longer leg = Anode (positive)
   │  -  │ ← Shorter leg = Cathode (negative)
   └─────┘
```

### **Wiring Each LED:**
```
GPIO Pin ──→ LED Anode (+) ──→ Resistor (220Ω) ──→ GND
```

**OR**

```
GPIO Pin ──→ Resistor (220Ω) ──→ LED Anode (+) ──→ GND
                                    ↓
                            LED Cathode (-) to GND
```

---

## 🚦 VISUAL WIRING (Single LED Example)

### **LED 1 (GPIO 12):**

```
ESP32-CAM                LED             Resistor
┌──────┐              ┌────┐            ╔═══╗
│GPIO12├──────────────┤ +  ├────────────║220Ω║────┐
└──────┘              └────┘            ╚═══╝    │
                         │                       │
┌──────┐              ┌────┐                    │
│ GND  ├──────────────┤ -  ├────────────────────┘
└──────┘              └────┘
```

**Repeat for LED2 (GPIO 13), LED3 (GPIO 14), LED4 (GPIO 15)**

---

## 📊 FULL SYSTEM WIRING TABLE

| Component | GPIO Pin | LED | Resistor | GND |
|-----------|----------|-----|----------|-----|
| LED 1     | GPIO 12  | Green (+)  | 220Ω | ─── |
| LED 2     | GPIO 13  | Yellow (+) | 220Ω | ─── |
| LED 3     | GPIO 14  | Orange (+) | 220Ω | ─── |
| LED 4     | GPIO 15  | Red (+)    | 220Ω | ─── |

All LEDs share **common GND**

---

## ⚡ POWER REQUIREMENTS

### **Current per LED:**
- Each LED: ~20mA
- 4 LEDs total: ~80mA
- ESP32-CAM GPIO can handle this easily!

### **Voltage:**
- GPIO HIGH = 3.3V
- LED forward voltage ≈ 2V
- Resistor drop ≈ 1.3V
- Current = 1.3V / 220Ω ≈ 6mA (safe!)

---

## 🎬 HOW IT WORKS

### **Distance > 30cm (FAR mode):**
```
✅ LED1 (Green) = ON
❌ LED2 (Yellow) = OFF
❌ LED3 (Orange) = OFF
❌ LED4 (Red) = OFF
```

### **Distance < 30cm (NEAR mode - Loop):**
```
Every 5 seconds:
┌──────────┬──────────┬──────────┬──────────┐
│ 0-5s     │ 5-10s    │ 10-15s   │ 15-20s   │
├──────────┼──────────┼──────────┼──────────┤
│ LED1 ON  │ LED2 ON  │ LED3 ON  │ LED4 ON  │
│ Others   │ Others   │ Others   │ Others   │
│ OFF      │ OFF      │ OFF      │ OFF      │
└──────────┴──────────┴──────────┴──────────┘
        Then repeats: LED1 → LED2 → LED3 → LED4...
```

---

## 🛠️ STEP-BY-STEP ASSEMBLY

### **Step 1: Prepare Components**
```
✓ 1x ESP32-CAM
✓ 4x LEDs (different colors)
✓ 4x 220Ω resistors (red-red-brown)
✓ Breadboard
✓ Jumper wires (male-to-male)
```

### **Step 2: Insert LEDs on Breadboard**
```
Row 1: LED1 (Green)
Row 2: LED2 (Yellow)
Row 3: LED3 (Orange)
Row 4: LED4 (Red)

Note: Long leg (+) in one column, short leg (-) in another
```

### **Step 3: Connect Resistors**
```
From each LED's anode (+) to resistor
From resistor to ground rail
```

### **Step 4: Wire GPIOs**
```
ESP32-CAM GPIO 12 → LED1 anode
ESP32-CAM GPIO 13 → LED2 anode
ESP32-CAM GPIO 14 → LED3 anode
ESP32-CAM GPIO 15 → LED4 anode
```

### **Step 5: Common Ground**
```
All LED cathodes (-) → Breadboard ground rail
ESP32-CAM GND → Breadboard ground rail
```

---

## ⚠️ IMPORTANT NOTES

### **⚠️ GPIO Availability:**
**WARNING:** Some of these GPIO pins might be used by the camera!

**Safe GPIO pins on ESP32-CAM:**
- GPIO 12 ✅ Usually safe
- GPIO 13 ✅ Usually safe  
- GPIO 14 ⚠️ Might conflict with SD card
- GPIO 15 ⚠️ Might conflict with SD card

### **Alternative Safe Pins:**
If GPIO 14/15 cause issues, use:
- **GPIO 2** instead of GPIO 14
- **GPIO 16** instead of GPIO 15

---

## 🔍 TESTING

### **Test 1: Single LEDs**
```cpp
digitalWrite(LED1, HIGH); // LED1 should light up
delay(1000);
digitalWrite(LED1, LOW);
```

### **Test 2: Loop Mode**
```
Move beacon < 30cm from laptop
Watch LEDs cycle 1→2→3→4 every 5 seconds!
```

---

## 📸 PHYSICAL LAYOUT SUGGESTION

```
    ┌─────────────┐
    │ ESP32-CAM   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  BREADBOARD │
    ├─────────────┤
    │  🟢 LED1    │  ← Green
    │  🟡 LED2    │  ← Yellow
    │  🟠 LED3    │  ← Orange
    │  🔴 LED4    │  ← Red
    └─────────────┘
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] 4 LEDs inserted correctly (long leg = +)
- [ ] 4 resistors connected
- [ ] GPIO 12 → LED1
- [ ] GPIO 13 → LED2
- [ ] GPIO 14 → LED3
- [ ] GPIO 15 → LED4
- [ ] All grounds connected
- [ ] Code uploaded
- [ ] LEDs respond to beacon distance

---

## 🎯 EXPECTED BEHAVIOR

**Upload code and test:**

1. **Power on** → All LEDs flash briefly (test)
2. **Beacon FAR** → LED1 stays ON
3. **Beacon NEAR** → LEDs cycle 1→2→3→4
4. **Each LED on for 5 seconds**
5. **Smooth cycling pattern**

---

**Now you know exactly which pins to use for the 4 traffic light LEDs!** 🚦✨
