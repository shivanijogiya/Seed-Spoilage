import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSensor } from '../../context/SensorContext';
import { MiniLineChart } from '../../components/MiniLineChart';
import { Colors, FontSize, Spacing } from '../../utils/theme';

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <View style={[styles.statBox, { borderColor: color + '44' }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function SensorsScreen() {
  const { sensorData, history } = useSensor();

  const temp = sensorData.temperature;
  const hum = sensorData.humidity;
  const mq135 = sensorData.mq135;
  const mq9 = sensorData.mq9;
  const wt = sensorData.weight;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensor Analytics</Text>
        <Text style={styles.subtitle}>Real-time data streams</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.section}>Environmental</Text>
        <View style={styles.statsRow}>
          <StatBox label="Temp" value={`${temp.toFixed(1)}°C`} color={temp > 38 ? Colors.critical : temp > 33 ? Colors.warning : Colors.safe} />
          <StatBox label="Humidity" value={`${hum.toFixed(1)}%`} color={hum > 80 ? Colors.critical : hum > 70 ? Colors.warning : Colors.safe} />
        </View>
        <MiniLineChart
          data={history.temperature}
          color={Colors.orange}
          label="Temperature"
          unit="°C"
          min={15}
          max={50}
        />
        <MiniLineChart
          data={history.humidity}
          color={Colors.blue}
          label="Humidity"
          unit="%"
          min={30}
          max={100}
        />

        <Text style={styles.section}>Gas Sensors</Text>
        <View style={styles.statsRow}>
          <StatBox label="MQ-135" value={`${mq135.toFixed(0)} ppm`} color={mq135 > 400 ? Colors.critical : mq135 > 280 ? Colors.warning : Colors.safe} />
          <StatBox label="MQ-9" value={`${mq9.toFixed(0)} ppm`} color={mq9 > 300 ? Colors.critical : mq9 > 200 ? Colors.warning : Colors.safe} />
        </View>
        <MiniLineChart
          data={history.mq135}
          color={Colors.teal}
          label="MQ-135 Air Quality"
          unit="ppm"
          min={50}
          max={650}
        />
        <MiniLineChart
          data={history.mq9}
          color={Colors.warning}
          label="MQ-9 Combustible Gas"
          unit="ppm"
          min={0}
          max={450}
        />

        <Text style={styles.section}>Weight & Pressure</Text>
        <View style={styles.statsRow}>
          <StatBox label="Weight" value={`${wt.toFixed(1)} kg`} color={wt < 75 ? Colors.critical : wt < 85 ? Colors.warning : Colors.safe} />
          <StatBox label="FSR" value={`${sensorData.fsr.toFixed(0)} u`} color={Colors.teal} />
        </View>
        <MiniLineChart
          data={history.weight}
          color={Colors.safe}
          label="Grain Weight (HX711)"
          unit="kg"
          min={55}
          max={105}
        />

        <Text style={styles.section}>Binary Sensors</Text>
        <View style={styles.binaryRow}>
          <View style={[styles.binaryCard, { borderColor: sensorData.flame ? Colors.critical + '66' : Colors.cardBorder }]}>
            <Text style={styles.binaryEmoji}>{sensorData.flame ? '🔥' : '✅'}</Text>
            <Text style={[styles.binaryLabel, { color: sensorData.flame ? Colors.critical : Colors.safe }]}>
              Flame Sensor
            </Text>
            <Text style={[styles.binaryValue, { color: sensorData.flame ? Colors.critical : Colors.safe }]}>
              {sensorData.flame ? 'FIRE DETECTED' : 'Clear'}
            </Text>
          </View>
          <View style={[styles.binaryCard, { borderColor: sensorData.vibration ? Colors.warning + '66' : Colors.cardBorder }]}>
            <Text style={styles.binaryEmoji}>{sensorData.vibration ? '📳' : '✅'}</Text>
            <Text style={[styles.binaryLabel, { color: sensorData.vibration ? Colors.warning : Colors.safe }]}>
              Vibration SW-420
            </Text>
            <Text style={[styles.binaryValue, { color: sensorData.vibration ? Colors.warning : Colors.safe }]}>
              {sensorData.vibration ? 'ACTIVITY' : 'Stable'}
            </Text>
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginTop: 2,
  },
  section: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  binaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  binaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  binaryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  binaryLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  binaryValue: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  bottomPad: { height: 20 },
});
