# ESP32-CAM Pin Configuration and Wiring

## LED Connections

```
ESP32-CAM Pin    →    Component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GPIO 12          →    LED 1 (+) [220Ω resistor] → GND
GPIO 13          →    LED 2 (+) [220Ω resistor] → GND
GPIO 14          →    LED 3 (+) [220Ω resistor] → GND
GPIO 15          →    LED 4 (+) [220Ω resistor] → GND
```

### LED Wiring Diagram (Text)
```
        ESP32-CAM                 LEDs with Resistors
    ┌─────────────┐
    │             │
    │  GPIO 12 ───┼───[220Ω]───>|─── GND  (LED 1 - Green)
    │             │
    │  GPIO 13 ───┼───[220Ω]───>|─── GND  (LED 2 - Green)
    │             │
    │  GPIO 14 ───┼───[220Ω]───>|─── GND  (LED 3 - Green)
    │             │
    │  GPIO 15 ───┼───[220Ω]───>|─── GND  (LED 4 - Green)
    │             │
    │  GND     ───┼─────────────────── Common GND
    │             │
    │  5V      ───┼─────────────────── Power Supply (+5V)
    │             │
    └─────────────┘
```

## Camera Pins (Pre-configured on ESP32-CAM)

These are already connected on the ESP32-CAM module - just for reference:

```
Pin Function     →    GPIO Number
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PWDN             →    GPIO 32
RESET            →    -1 (not used)
XCLK             →    GPIO 0
SIOD (SDA)       →    GPIO 26
SIOC (SCL)       →    GPIO 27
Y9 (Data 9)      →    GPIO 35
Y8 (Data 8)      →    GPIO 34
Y7 (Data 7)      →    GPIO 39
Y6 (Data 6)      →    GPIO 36
Y5 (Data 5)      →    GPIO 21
Y4 (Data 4)      →    GPIO 19
Y3 (Data 3)      →    GPIO 18
Y2 (Data 2)      →    GPIO 5
VSYNC            →    GPIO 25
HREF             →    GPIO 23
PCLK             →    GPIO 22
```

## ESP32 Beacon Wiring

Very simple - just power it!

```
    ┌─────────────┐
    │  ESP32 DEV  │
    │             │
    │  5V      ───┼──── USB Power or Battery (+5V)
    │             │
    │  GND     ───┼──── Ground
    │             │
    └─────────────┘
```

No additional components needed for the beacon!

## Complete System Wiring Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Smart Traffic System                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────┐          ┌──────────────┐          ┌──────────┐
│  ESP32       │          │  ESP32-CAM   │          │  Laptop  │
│  Beacon      │          │              │          │          │
│              │          │  + 4 LEDs    │          │  Python  │
│  [Transmit]  │   BLE    │              │   WiFi   │  Server  │
│  BLE Signal──┼─────────>│              │<────────>│  +YOLO   │
│              │  RSSI    │  [Stream]    │  HTTP    │          │
└──────────────┘          │  Video Feed──┼─────────>│  Web UI  │
                          │              │          │          │
                          │  [Receive]   │          │          │
                          │  LED Control<┼──────────┤          │
                          │              │   POST   │          │
                          └──────────────┘          └──────────┘
                                 │
                                 │
                          ┌──────┴────────┐
                          │  4 Green LEDs │
                          │  (Traffic     │
                          │   Indicators) │
                          └───────────────┘
```

## Power Requirements

### ESP32 Beacon
- **Voltage**: 5V (can use 3.3V as well)
- **Current**: ~80mA (when transmitting)
- **Power Source**: USB, Battery pack, or power adapter

### ESP32-CAM + LEDs
- **Voltage**: 5V (required for camera)
- **Current**: ~500mA (camera + WiFi + 4 LEDs)
- **Power Source**: 5V 2A USB adapter (minimum)
  - ⚠️ **Important**: Use good quality power supply!
  - Weak power = camera failures

### Recommended Power Sources
- ESP32 Beacon: Any USB power bank
- ESP32-CAM: 5V 2A wall adapter or quality power bank

## Resistor Calculations

For Green LEDs:
- **LED Forward Voltage**: ~2.0V (green)
- **LED Forward Current**: 20mA
- **Supply Voltage**: 3.3V (ESP32 GPIO output)

```
Resistor = (Vsupply - Vled) / Iled
         = (3.3V - 2.0V) / 0.020A
         = 65Ω

Using standard value: 220Ω (safe, slightly dimmer)
Or use: 100Ω (brighter, still safe)
```

## Safety Notes

⚠️ **IMPORTANT**:
1. Always use resistors with LEDs to prevent damage
2. Don't connect LEDs directly to GPIO pins
3. Use proper 5V supply for ESP32-CAM (not 3.3V!)
4. Check polarity before connecting LEDs
5. Use common ground for all components

## Testing Individual Components

### Test ESP32 Beacon
1. Upload code
2. Open Serial Monitor (115200 baud)
3. Should see: "Beacon started!"
4. Should see: "Beacon active: 10s", "20s", etc.

### Test ESP32-CAM Camera
1. Upload code with WiFi credentials
2. Open Serial Monitor
3. Should see: "WiFi connected!"
4. Note the IP address
5. Open browser: http://[IP_ADDRESS]/stream
6. Should see live camera feed

### Test ESP32-CAM LEDs
1. Add test code in setup():
   ```cpp
   digitalWrite(LED1, HIGH);
   delay(1000);
   digitalWrite(LED1, LOW);
   // Repeat for LED2, LED3, LED4
   ```
2. Each LED should light up in sequence

## Troubleshooting Wiring Issues

### LED not lighting
- ✓ Check polarity (long leg = positive)
- ✓ Check resistor connection
- ✓ Check GPIO number in code
- ✓ Test LED with battery directly

### Camera not working
- ✓ Check ribbon cable connection
- ✓ Verify power supply (min 5V 2A)
- ✓ Check all camera pins in code match your board

### WiFi not connecting
- ✓ Check SSID and password
- ✓ Make sure WiFi is 2.4GHz (not 5GHz)
- ✓ Check antenna connection on ESP32-CAM

---

**Ready to wire? Follow the diagrams above and refer to SETUP_GUIDE.md for software setup!**
