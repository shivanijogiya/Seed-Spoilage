# Smart Grain Spoilage Monitoring & Control System (ESP32)

**Course:** Embedded Systems and IoT  
**Institution:** VIT Vellore – School of Computer Science Engineering and Information Systems  

---

## 📌 Project Overview

This project presents an **ESP32-based multi-sensor embedded system** designed for the **early detection and prevention of grain spoilage** in storage environments.

Instead of relying on manual inspection, the system continuously monitors multiple environmental and physical parameters and **automatically responds to unsafe conditions** using alerts and ventilation.

---

## 🎯 Problem Statement

Grain storage is critical for food security and market value. However, traditional monitoring methods are:

- Manual ❌  
- Intermittent ❌  
- Inefficient ❌  

They fail to detect hidden issues like:
- Internal temperature rise  
- Gas buildup  
- Moisture accumulation  
- Pest activity  

👉 This project provides a **continuous, automated monitoring solution** using embedded systems.

---

## 🚀 Key Features

- 📡 Real-time multi-sensor monitoring  
- 🌡️ Dual temperature sensing (ambient + grain core)  
- 💧 Humidity & moisture detection  
- 🧪 Gas detection (MQ-135, MQ-9)  
- 📳 Vibration & disturbance sensing  
- ⚖️ Weight monitoring using load cell  
- 🔥 Flame detection (high-priority alert)  
- 🔔 Buzzer + LED alert system  
- 🌬️ Automatic ventilation using relay-controlled fan  
- 📈 Expandable to IoT dashboards  

---

## 🧠 System Architecture

```
Sensors → ESP32 → Decision Logic → Outputs (Fan, LED, Buzzer)
```

### 🔌 Input Sensors
- DHT22 → Temperature & Humidity  
- DS18B20 → Internal Grain Temperature  
- Capacitive Moisture Sensor → Grain Moisture  
- MQ-135 → Air Quality  
- MQ-9 → Combustible Gas  
- SW-420 → Vibration  
- FSR → Pressure Detection  
- Flame Sensor → Fire Detection  
- Load Cell + HX711 → Weight  

### ⚙️ Output Components
- Relay Module → Controls Fan  
- Buzzer → Audio Alert  
- LEDs → Status Indication  

---

## 🧾 Components Used

| Component | Model | Purpose |
|----------|------|--------|
| ESP32 | NodeMCU | Main Controller |
| DHT22 | Sensor | Ambient Temp & Humidity |
| DS18B20 | Waterproof | Internal Temp |
| Moisture Sensor | Capacitive v1.2 | Grain Moisture |
| MQ-135 | Gas Sensor | Air Quality |
| MQ-9 | Gas Sensor | Combustible Gas |
| SW-420 | Vibration | Disturbance Detection |
| FSR | Force Sensor | Pressure Detection |
| Load Cell + HX711 | Module | Weight Monitoring |
| Flame Sensor | IR | Fire Detection |
| Relay | 5V | Fan Control |
| Fan | 9V | Ventilation |
| Buzzer | Active | Alert |
| LEDs | Red/Green | Status |

---

## ⚙️ Working Principle

1. Sensors continuously collect data  
2. ESP32 processes readings  
3. Values are compared with thresholds  
4. System classifies state:
   - ✅ Normal  
   - ⚠️ Warning  
   - 🚨 Critical  
5. Actions triggered:
   - LED indication  
   - Buzzer alert  
   - Fan activation  

---

## 🧮 Control Logic (Pseudo Code)

```c
Initialize sensors and outputs

Loop:
    Read all sensor values
    Validate data
    
    IF flame detected:
        Trigger buzzer + fan + red LED
        
    ELSE IF multiple abnormal conditions:
        Activate fan + buzzer
        
    ELSE IF minor abnormality:
        Show warning
        
    ELSE:
        Normal monitoring mode
```

---

## 💻 Sample Code Snippet

```cpp
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ135_ANALOG 34
#define RED_LED 19

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RED_LED, OUTPUT);
}

void loop() {
  float t = dht.readTemperature() * 18.5;
  int gas = analogRead(MQ135_ANALOG);

  if (t > 50 || gas > 600) {
    digitalWrite(RED_LED, HIGH);
    Serial.println("!!! ALERT !!!");
  } else {
    digitalWrite(RED_LED, LOW);
  }

  delay(1000);
}
```

---

## 🧪 Demonstration Scenarios

| Scenario | Trigger | Response |
|--------|--------|---------|
| High Humidity | Moist air | Warning + Fan |
| Heat Increase | Warm sensor | Ventilation |
| Gas Leak | MQ sensors | Alarm |
| Vibration | Tap sensor | Alert |
| Flame | Fire detection | Immediate alarm |
| Weight Change | Add/remove load | Logged |

---

## 📊 Results

- Successfully detects:
  - Temperature rise  
  - Moisture increase  
  - Gas anomalies  
  - Disturbances  
  - Fire hazards  

- Automatically:
  - Activates alerts  
  - Controls ventilation  
  - Indicates system state  

---

## ✅ Advantages

- Continuous monitoring  
- Low-cost implementation  
- Multi-sensor accuracy  
- Automatic response system  
- Scalable to IoT  

---

## ⚠️ Limitations

- MQ sensors are not highly precise  
- Moisture sensor needs calibration  
- Thresholds vary by grain type  
- Prototype-level power design  

---

## 🔮 Future Improvements

- 🌐 IoT dashboard integration  
- 📱 Mobile app notifications  
- ☁️ Cloud data logging  
- 🤖 Machine learning prediction  
- 📦 Industrial-grade enclosure  

---

## 🏁 Conclusion

This project demonstrates a **real-world embedded system solution** for reducing post-harvest losses through:

- Early detection  
- Continuous monitoring  
- Automated control  

👉 A strong application of **IoT + Embedded Systems in Agriculture**

---

## 👩‍💻 Authors

- VIT Vellore Students  
- Guided under Embedded Systems & IoT Course  

---

## 📜 License

This project is for **academic and educational purposes**.
