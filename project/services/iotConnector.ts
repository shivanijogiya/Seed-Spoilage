import { SensorData } from '../types/sensors';

export interface IoTConfig {
  type: 'mqtt' | 'rest';
  host: string;
  port?: number;
  apiKey?: string;
  topic?: string;
}

export const parseMqttPayload = (payload: string): Partial<SensorData> | null => {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const buildRestPayload = (data: SensorData): string => {
  return JSON.stringify({
    temperature: data.temperature,
    humidity: data.humidity,
    mq135: data.mq135,
    mq9: data.mq9,
    flame: data.flame,
    fsr: data.fsr,
    vibration: data.vibration,
    weight: data.weight,
    timestamp: data.timestamp.toISOString(),
  });
};

export const mockFetchFromBackend = async (): Promise<Partial<SensorData> | null> => {
  return null;
};
