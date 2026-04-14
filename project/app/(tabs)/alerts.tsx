import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { BellOff, RefreshCw } from 'lucide-react-native';
import { useSensor } from '../../context/SensorContext';
import { AlertItem } from '../../components/AlertItem';
import { AlertLevel } from '../../types/sensors';
import { Colors, FontSize, Spacing } from '../../utils/theme';

const FILTERS: { label: string; value: AlertLevel | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Info', value: 'info' },
];

const FILTER_COLORS: Record<string, string> = {
  all: Colors.blue,
  critical: Colors.critical,
  warning: Colors.warning,
  info: Colors.teal,
};

export default function AlertsScreen() {
  const { alerts, resetAlerts } = useSensor();
  const [filter, setFilter] = useState<AlertLevel | 'all'>('all');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.level === filter);
  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.level === 'critical').length,
    warning: alerts.filter(a => a.level === 'warning').length,
    info: alerts.filter(a => a.level === 'info').length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alert History</Text>
          <Text style={styles.subtitle}>{alerts.length} total alerts</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={resetAlerts}>
          <RefreshCw size={14} color={Colors.subtext} />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTERS.map(f => {
            const active = filter === f.value;
            const col = FILTER_COLORS[f.value];
            return (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterChip, active && { backgroundColor: col + '22', borderColor: col }]}
                onPress={() => setFilter(f.value)}
              >
                <Text style={[styles.filterLabel, { color: active ? col : Colors.muted }]}>
                  {f.label}
                </Text>
                <View style={[styles.filterCount, { backgroundColor: active ? col : Colors.surface }]}>
                  <Text style={[styles.filterCountText, { color: active ? '#fff' : Colors.muted }]}>
                    {counts[f.value]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <BellOff size={48} color={Colors.muted} />
          <Text style={styles.emptyTitle}>No Alerts</Text>
          <Text style={styles.emptyText}>
            {filter === 'all' ? 'System is operating normally.' : `No ${filter} alerts recorded.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AlertItem alert={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.muted, marginTop: 2 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearText: { fontSize: FontSize.sm, color: Colors.subtext, fontWeight: '600' },
  filterRow: { paddingBottom: 12 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  filterLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterCountText: { fontSize: FontSize.xs, fontWeight: '700' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: { fontSize: FontSize.lg, color: Colors.subtext, fontWeight: '700' },
  emptyText: { fontSize: FontSize.sm, color: Colors.muted, textAlign: 'center', paddingHorizontal: 40 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
});
