import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SensorData, ActuatorState, AlertEntry, SpoilageState, SensorHistory, ChartDataPoint } from '../types/sensors';
import { generateSensorData, getInitialWeight, setEmergencyMode, isEmergencyMode, trimHistory, MAX_HISTORY } from '../services/sensorSimulation';
import { getSpoilageState, getAlertMessages } from '../utils/spoilageCalculator';

interface SensorContextType {
  sensorData: SensorData;
  actuators: ActuatorState;
  alerts: AlertEntry[];
  spoilage: SpoilageState;
  history: SensorHistory;
  isRunning: boolean;
  emergencyMode: boolean;
  toggleBuzzer: () => void;
  resetAlerts: () => void;
  triggerEmergency: () => void;
  cancelEmergency: () => void;
}

const defaultSensor: SensorData = {
  temperature: 28,
  humidity: 60,
  mq135: 180,
  mq9: 120,
  flame: false,
  fsr: 20,
  vibration: false,
  weight: 100,
  timestamp: new Date(),
};

const SensorContext = createContext<SensorContextType | null>(null);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensor);
  const [actuators, setActuators] = useState<ActuatorState>({ buzzer: false, redLED: false, greenLED: true });
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [spoilage, setSpoilage] = useState<SpoilageState>({ score: 0, level: 'SAFE' });
  const [history, setHistory] = useState<SensorHistory>({
    temperature: [],
    humidity: [],
    mq135: [],
    mq9: [],
    weight: [],
  });
  const [emergencyMode, setEmergencyModeState] = useState(false);

  const lastAlertRef = useRef<Set<string>>(new Set());
  const alertCooldownRef = useRef<Map<string, number>>(new Map());

  const addAlert = useCallback((message: string, sensor: string, level: AlertEntry['level']) => {
    const key = `${sensor}-${message}`;
    const now = Date.now();
    const lastTime = alertCooldownRef.current.get(key) ?? 0;
    if (now - lastTime < 5000) return;
    alertCooldownRef.current.set(key, now);

    const entry: AlertEntry = {
      id: `${now}-${Math.random()}`,
      message,
      sensor,
      level,
      timestamp: new Date(),
    };
    setAlerts(prev => [entry, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = generateSensorData();
      const spoilageState = getSpoilageState(data, getInitialWeight());

      setSensorData(data);
      setSpoilage(spoilageState);

      setHistory(prev => {
        const ts = data.timestamp.getTime();
        const point = (v: number): ChartDataPoint => ({ value: v, timestamp: ts });
        return {
          temperature: trimHistory([...prev.temperature, point(data.temperature)], MAX_HISTORY),
          humidity: trimHistory([...prev.humidity, point(data.humidity)], MAX_HISTORY),
          mq135: trimHistory([...prev.mq135, point(data.mq135)], MAX_HISTORY),
          mq9: trimHistory([...prev.mq9, point(data.mq9)], MAX_HISTORY),
          weight: trimHistory([...prev.weight, point(data.weight)], MAX_HISTORY),
        };
      });

      setActuators({
        buzzer: spoilageState.level === 'CRITICAL',
        redLED: spoilageState.level !== 'SAFE',
        greenLED: spoilageState.level === 'SAFE',
      });

      const newAlerts = getAlertMessages(data, spoilageState.score);
      newAlerts.forEach(a => addAlert(a.message, a.sensor, a.level));
    }, 1500);

    return () => clearInterval(interval);
  }, [addAlert]);

  const toggleBuzzer = useCallback(() => {
    setActuators(prev => ({ ...prev, buzzer: !prev.buzzer }));
  }, []);

  const resetAlerts = useCallback(() => {
    setAlerts([]);
    alertCooldownRef.current.clear();
  }, []);

  const triggerEmergency = useCallback(() => {
    setEmergencyMode(true);
    setEmergencyModeState(true);
  }, []);

  const cancelEmergency = useCallback(() => {
    setEmergencyMode(false);
    setEmergencyModeState(false);
  }, []);

  return (
    <SensorContext.Provider value={{
      sensorData,
      actuators,
      alerts,
      spoilage,
      history,
      isRunning: true,
      emergencyMode,
      toggleBuzzer,
      resetAlerts,
      triggerEmergency,
      cancelEmergency,
    }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = (): SensorContextType => {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensor must be used within SensorProvider');
  return ctx;
};
