import { SensorData } from '../types/sensors';

const INITIAL_WEIGHT = 100;
const MAX_HISTORY = 30;

let currentWeight = INITIAL_WEIGHT;
let simulateEmergency = false;
let prevTemp = 28;
let prevHumidity = 60;
let prevMq135 = 180;
let prevMq9 = 120;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const drift = (val: number, min: number, max: number, step: number) => {
  const delta = (Math.random() - 0.5) * step * 2;
  return clamp(val + delta, min, max);
};

export const getInitialWeight = () => INITIAL_WEIGHT;

export const setEmergencyMode = (active: boolean) => {
  simulateEmergency = active;
};

export const isEmergencyMode = () => simulateEmergency;

export const generateSensorData = (): SensorData => {
  if (simulateEmergency) {
    return {
      temperature: clamp(prevTemp + Math.random() * 3, 40, 45),
      humidity: clamp(prevHumidity + Math.random() * 2, 82, 90),
      mq135: clamp(prevMq135 + Math.random() * 30, 450, 600),
      mq9: clamp(prevMq9 + Math.random() * 20, 350, 400),
      flame: true,
      fsr: Math.random() * 100,
      vibration: true,
      weight: Math.max(60, currentWeight - 0.5),
      timestamp: new Date(),
    };
  }

  prevTemp = drift(prevTemp, 20, 45, 0.4);
  prevHumidity = drift(prevHumidity, 40, 90, 0.8);
  prevMq135 = drift(prevMq135, 100, 600, 5);
  prevMq9 = drift(prevMq9, 50, 400, 4);

  currentWeight = Math.max(60, currentWeight - (Math.random() * 0.05));

  const flame = Math.random() < 0.01;
  const vibration = Math.random() < 0.05;

  return {
    temperature: prevTemp,
    humidity: prevHumidity,
    mq135: prevMq135,
    mq9: prevMq9,
    flame,
    fsr: Math.random() * 100,
    vibration,
    weight: currentWeight,
    timestamp: new Date(),
  };
};

export const trimHistory = <T>(arr: T[], max: number): T[] =>
  arr.length > max ? arr.slice(arr.length - max) : arr;

export { INITIAL_WEIGHT, MAX_HISTORY };
