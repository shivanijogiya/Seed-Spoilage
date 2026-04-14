import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Thermometer, Droplets, Wind, Zap, Scale, Activity, Flame } from 'lucide-react-native';
import { useSensor } from '../../context/SensorContext';
import { StatusHeader } from '../../components/StatusHeader';
import { SensorCard } from '../../components/SensorCard';
import { SpoilageGauge } from '../../components/SpoilageGauge';
import { GrainVisualizer } from '../../components/GrainVisualizer';
import { LEDPanel } from '../../components/LEDPanel';
import { AlertItem } from '../../components/AlertItem';
import { Colors, FontSize, Spacing } from '../../utils/theme';
import { getLevelColor } from '../../utils/spoilageCalculator';

export default function DashboardScreen() {
  const { sensorData, actuators, alerts, spoilage } = useSensor();
  const lc = getLevelColor(spoilage.level);

  const tempColor = sensorData.temperature > 38 ? Colors.critical
    : sensorData.temperature > 33 ? Colors.warning : Colors.safe;
  const humidColor = sensorData.humidity > 80 ? Colors.critical
    : sensorData.humidity > 70 ? Colors.warning : Colors.safe;
  const mq135Color = sensorData.mq135 > 400 ? Colors.critical
    : sensorData.mq135 > 280 ? Colors.warning : Colors.safe;
  const mq9Color = sensorData.mq9 > 300 ? Colors.critical
    : sensorData.mq9 > 200 ? Colors.warning : Colors.safe;
  const weightColor = sensorData.weight < 75 ? Colors.critical
    : sensorData.weight < 85 ? Colors.warning : Colors.safe;
  const flameColor = sensorData.flame ? Colors.critical : Colors.safe;
  const vibColor = sensorData.vibration ? Colors.warning : Colors.safe;

  const recentAlerts = alerts.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusHeader level={spoilage.level} score={spoilage.score} alertCount={alerts.length} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.row}>
          <View style={styles.gaugeCard}>
            <SpoilageGauge score={spoilage.score} level={spoilage.level} />
          </View>
          <View style={styles.siloCard}>
            <GrainVisualizer
              level={spoilage.level}
              flame={sensorData.flame}
              vibration={sensorData.vibration}
              gasLevel={sensorData.mq135}
              weight={sensorData.weight}
            />
          </View>
        </View>

        <LEDPanel
          redLED={actuators.redLED}
          greenLED={actuators.greenLED}
          buzzer={actuators.buzzer}
        />

        <Text style={styles.sectionTitle}>Sensor Readings</Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <SensorCard
              title="Temperature"
              value={sensorData.temperature.toFixed(1)}
              unit="°C"
              icon={<Thermometer size={20} color={tempColor} />}
              statusColor={tempColor}
              subtitle="DHT22 Sensor"
            />
          </View>
          <View style={styles.gridItem}>
            <SensorCard
              title="Humidity"
              value={sensorData.humidity.toFixed(1)}
              unit="%"
              icon={<Droplets size={20} color={humidColor} />}
              statusColor={humidColor}
              subtitle="DHT22 Sensor"
            />
          </View>
        </View>

        <SensorCard
          title="Air Quality (MQ-135)"
          value={sensorData.mq135.toFixed(0)}
          unit="ppm"
          icon={<Wind size={20} color={mq135Color} />}
          statusColor={mq135Color}
          subtitle="Spoilage gas detection"
        />

        <SensorCard
          title="Combustible Gas (MQ-9)"
          value={sensorData.mq9.toFixed(0)}
          unit="ppm"
          icon={<Zap size={20} color={mq9Color} />}
          statusColor={mq9Color}
          subtitle="Fermentation risk detection"
        />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <SensorCard
              title="Weight (HX711)"
              value={sensorData.weight.toFixed(1)}
              unit="kg"
              icon={<Scale size={20} color={weightColor} />}
              statusColor={weightColor}
              subtitle="Load cell reading"
            />
          </View>
          <View style={styles.gridItem}>
            <SensorCard
              title="Flame Sensor"
              value={sensorData.flame ? 'DETECTED' : 'CLEAR'}
              icon={<Flame size={20} color={flameColor} />}
              statusColor={flameColor}
              subtitle="IR Flame sensor"
            />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <SensorCard
              title="Vibration"
              value={sensorData.vibration ? 'ACTIVE' : 'STABLE'}
              icon={<Activity size={20} color={vibColor} />}
              statusColor={vibColor}
              subtitle="SW-420 sensor"
            />
          </View>
          <View style={styles.gridItem}>
            <SensorCard
              title="FSR Pressure"
              value={sensorData.fsr.toFixed(0)}
              unit="units"
              icon={<Activity size={20} color={Colors.teal} />}
              statusColor={Colors.teal}
              subtitle="Force sensor"
            />
          </View>
        </View>

        {recentAlerts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {recentAlerts.map(a => <AlertItem key={a.id} alert={a} />)}
          </>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  gaugeCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  siloCard: { flex: 1 },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 2 },
  gridItem: { flex: 1 },
  bottomPad: { height: 20 },
});
