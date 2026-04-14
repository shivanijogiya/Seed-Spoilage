export interface SensorData {
  temperature: number;
  humidity: number;
  mq135: number;
  mq9: number;
  flame: boolean;
  fsr: number;
  vibration: boolean;
  weight: number;
  timestamp: Date;
}

export interface ActuatorState {
  buzzer: boolean;
  redLED: boolean;
  greenLED: boolean;
}

export type AlertLevel = 'info' | 'warning' | 'critical';

export interface AlertEntry {
  id: string;
  message: string;
  level: AlertLevel;
  timestamp: Date;
  sensor: string;
}

export type SpoilageLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface SpoilageState {
  score: number;
  level: SpoilageLevel;
}

export interface ChartDataPoint {
  value: number;
  timestamp: number;
}

export interface SensorHistory {
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  mq135: ChartDataPoint[];
  mq9: ChartDataPoint[];
  weight: ChartDataPoint[];
}
