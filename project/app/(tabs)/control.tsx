import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { AlertTriangle, Power, RefreshCw, Wifi, Database, Info } from 'lucide-react-native';
import { useSensor } from '../../context/SensorContext';
import { Colors, FontSize, Spacing } from '../../utils/theme';

interface ControlCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}

const ControlCard: React.FC<ControlCardProps> = ({ title, description, icon, children, accent = Colors.blue }) => (
  <View style={[styles.card, { borderLeftColor: accent, borderLeftWidth: 3 }]}>
    <View style={styles.cardHeader}>
      <View style={[styles.cardIcon, { backgroundColor: accent + '22' }]}>{icon}</View>
      <View style={styles.cardMeta}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

export default function ControlScreen() {
  const {
    actuators,
    spoilage,
    sensorData,
    alerts,
    emergencyMode,
    toggleBuzzer,
    resetAlerts,
    triggerEmergency,
    cancelEmergency,
  } = useSensor();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Control Panel</Text>
        <Text style={styles.subtitle}>System management</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <ControlCard
          title="Buzzer Control"
          description="Active Buzzer — NodeMCU pin D5"
          icon={<Power size={18} color={Colors.orange} />}
          accent={Colors.orange}
        >
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Buzzer {actuators.buzzer ? 'Active' : 'Inactive'}</Text>
            <Switch
              value={actuators.buzzer}
              onValueChange={toggleBuzzer}
              trackColor={{ false: Colors.cardBorder, true: Colors.orange + '88' }}
              thumbColor={actuators.buzzer ? Colors.orange : Colors.muted}
            />
          </View>
          {actuators.buzzer && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Buzzer is auto-triggered by CRITICAL spoilage level. Toggle to override.
              </Text>
            </View>
          )}
        </ControlCard>

        <ControlCard
          title="Alert Management"
          description="Clear and manage system alerts"
          icon={<RefreshCw size={18} color={Colors.blue} />}
          accent={Colors.blue}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: Colors.critical }]}>
                {alerts.filter(a => a.level === 'critical').length}
              </Text>
              <Text style={styles.statLbl}>Critical</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: Colors.warning }]}>
                {alerts.filter(a => a.level === 'warning').length}
              </Text>
              <Text style={styles.statLbl}>Warning</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: Colors.blue }]}>
                {alerts.filter(a => a.level === 'info').length}
              </Text>
              <Text style={styles.statLbl}>Info</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={resetAlerts}>
            <RefreshCw size={16} color={Colors.text} />
            <Text style={styles.actionBtnText}>Reset All Alerts</Text>
          </TouchableOpacity>
        </ControlCard>

        <ControlCard
          title="Emergency Simulation"
          description="Simulate emergency conditions for testing"
          icon={<AlertTriangle size={18} color={Colors.critical} />}
          accent={Colors.critical}
        >
          <Text style={styles.emergencyDesc}>
            Triggers: flame detected, critical temperature, high gas levels, and vibration simultaneously.
          </Text>
          {!emergencyMode ? (
            <TouchableOpacity style={[styles.actionBtn, styles.emergencyBtn]} onPress={triggerEmergency}>
              <AlertTriangle size={16} color="#fff" />
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>Trigger Emergency</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={cancelEmergency}>
              <Power size={16} color="#fff" />
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>Cancel Emergency</Text>
            </TouchableOpacity>
          )}
          {emergencyMode && (
            <View style={[styles.infoBox, { backgroundColor: Colors.critical + '22', borderColor: Colors.critical + '44' }]}>
              <Text style={[styles.infoText, { color: Colors.critical }]}>
                EMERGENCY MODE ACTIVE — All sensors at critical levels
              </Text>
            </View>
          )}
        </ControlCard>

        <ControlCard
          title="IoT Integration"
          description="Backend connectivity configuration"
          icon={<Wifi size={18} color={Colors.teal} />}
          accent={Colors.teal}
        >
          <View style={styles.integrationRow}>
            <View style={[styles.integrationBadge, { borderColor: Colors.teal + '44' }]}>
              <View style={[styles.integrationDot, { backgroundColor: Colors.muted }]} />
              <Text style={styles.integrationLabel}>MQTT (Not Connected)</Text>
            </View>
            <View style={[styles.integrationBadge, { borderColor: Colors.blue + '44' }]}>
              <View style={[styles.integrationDot, { backgroundColor: Colors.muted }]} />
              <Text style={styles.integrationLabel}>REST API (Not Configured)</Text>
            </View>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Configure MQTT broker or REST API endpoint in services/iotConnector.ts to connect real NodeMCU ESP32 hardware.
            </Text>
          </View>
        </ControlCard>

        <ControlCard
          title="System Info"
          description="Current system status snapshot"
          icon={<Info size={18} color={Colors.subtext} />}
          accent={Colors.subtext}
        >
          {[
            ['Mode', 'Simulation (Software)'],
            ['Spoilage Score', `${Math.round(spoilage.score)} / 100`],
            ['System Level', spoilage.level],
            ['Temperature', `${sensorData.temperature.toFixed(1)}°C`],
            ['Humidity', `${sensorData.humidity.toFixed(1)}%`],
            ['Weight', `${sensorData.weight.toFixed(1)} kg`],
            ['Total Alerts', alerts.length.toString()],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoKey}>{k}</Text>
              <Text style={styles.infoVal}>{v}</Text>
            </View>
          ))}
        </ControlCard>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  cardDesc: { fontSize: FontSize.xs, color: Colors.muted, marginTop: 2 },
  cardBody: { gap: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { fontSize: FontSize.md, color: Colors.text, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLbl: { fontSize: FontSize.xs, color: Colors.muted },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  emergencyBtn: { backgroundColor: Colors.critical, borderColor: Colors.critical },
  cancelBtn: { backgroundColor: Colors.safe, borderColor: Colors.safe },
  emergencyDesc: { fontSize: FontSize.sm, color: Colors.subtext, lineHeight: 20 },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoText: { fontSize: FontSize.xs, color: Colors.muted, lineHeight: 18 },
  integrationRow: { gap: 8 },
  integrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  integrationDot: { width: 8, height: 8, borderRadius: 4 },
  integrationLabel: { fontSize: FontSize.sm, color: Colors.muted },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  infoKey: { fontSize: FontSize.sm, color: Colors.muted },
  infoVal: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  bottomPad: { height: 20 },
});
