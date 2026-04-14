import { SensorData, SpoilageState, SpoilageLevel } from '../types/sensors';

const normalize = (value: number, min: number, max: number): number => {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

export const calculateSpoilageScore = (
  data: SensorData,
  initialWeight: number
): number => {
  const humidityScore = normalize(data.humidity, 40, 90) * 30;
  const tempScore = normalize(data.temperature, 20, 45) * 20;
  const mq135Score = normalize(data.mq135, 100, 600) * 20;
  const mq9Score = normalize(data.mq9, 50, 400) * 10;
  const weightLoss = initialWeight > 0
    ? Math.max(0, (initialWeight - data.weight) / initialWeight)
    : 0;
  const weightScore = weightLoss * 20;

  const score = humidityScore + tempScore + mq135Score + mq9Score + weightScore;
  return Math.max(0, Math.min(100, score));
};

export const getSpoilageLevel = (score: number): SpoilageLevel => {
  if (score <= 40) return 'SAFE';
  if (score <= 70) return 'WARNING';
  return 'CRITICAL';
};

export const getSpoilageState = (
  data: SensorData,
  initialWeight: number
): SpoilageState => {
  if (data.flame) {
    return { score: 100, level: 'CRITICAL' };
  }
  const score = calculateSpoilageScore(data, initialWeight);
  return { score, level: getSpoilageLevel(score) };
};

export const getScoreColor = (score: number): string => {
  if (score <= 40) return '#10B981';
  if (score <= 70) return '#F59E0B';
  return '#EF4444';
};

export const getLevelColor = (level: SpoilageLevel): string => {
  switch (level) {
    case 'SAFE': return '#10B981';
    case 'WARNING': return '#F59E0B';
    case 'CRITICAL': return '#EF4444';
  }
};

export const getGrainColor = (level: SpoilageLevel): string => {
  switch (level) {
    case 'SAFE': return '#F59E0B';
    case 'WARNING': return '#92400E';
    case 'CRITICAL': return '#1C1917';
  }
};

export const getAlertMessages = (data: SensorData, score: number): {
  message: string;
  sensor: string;
  level: 'info' | 'warning' | 'critical';
}[] => {
  const alerts: { message: string; sensor: string; level: 'info' | 'warning' | 'critical' }[] = [];

  if (data.flame) {
    alerts.push({ message: 'FIRE DETECTED! Immediate action required.', sensor: 'IR Flame', level: 'critical' });
  }
  if (data.vibration) {
    alerts.push({ message: 'Rodent/Disturbance Activity Detected!', sensor: 'Vibration SW-420', level: 'warning' });
  }
  if (data.temperature > 38) {
    alerts.push({ message: `Critical temperature: ${data.temperature.toFixed(1)}°C`, sensor: 'DHT22 Temp', level: 'critical' });
  } else if (data.temperature > 33) {
    alerts.push({ message: `High temperature: ${data.temperature.toFixed(1)}°C`, sensor: 'DHT22 Temp', level: 'warning' });
  }
  if (data.humidity > 80) {
    alerts.push({ message: `Critical humidity: ${data.humidity.toFixed(1)}%`, sensor: 'DHT22 Humidity', level: 'critical' });
  } else if (data.humidity > 70) {
    alerts.push({ message: `High humidity: ${data.humidity.toFixed(1)}%`, sensor: 'DHT22 Humidity', level: 'warning' });
  }
  if (data.mq135 > 400) {
    alerts.push({ message: `Spoilage gases critical: ${data.mq135.toFixed(0)} ppm`, sensor: 'MQ-135', level: 'critical' });
  } else if (data.mq135 > 300) {
    alerts.push({ message: `Elevated spoilage gases: ${data.mq135.toFixed(0)} ppm`, sensor: 'MQ-135', level: 'warning' });
  }
  if (data.mq9 > 300) {
    alerts.push({ message: `Combustible gas critical: ${data.mq9.toFixed(0)} ppm`, sensor: 'MQ-9', level: 'critical' });
  } else if (data.mq9 > 200) {
    alerts.push({ message: `Elevated combustible gas: ${data.mq9.toFixed(0)} ppm`, sensor: 'MQ-9', level: 'warning' });
  }

  return alerts;
};
