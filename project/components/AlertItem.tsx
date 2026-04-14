import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, XCircle, Info } from 'lucide-react-native';
import { AlertEntry } from '../types/sensors';
import { Colors, FontSize, Spacing } from '../utils/theme';

interface Props {
  alert: AlertEntry;
}

const COLORS = {
  info: Colors.blue,
  warning: Colors.warning,
  critical: Colors.critical,
};

const Icons = {
  info: Info,
  warning: AlertTriangle,
  critical: XCircle,
};

const formatTime = (d: Date) => {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const AlertItem: React.FC<Props> = ({ alert }) => {
  const color = COLORS[alert.level];
  const Icon = Icons[alert.level];

  return (
    <View style={[styles.container, { borderLeftColor: color, borderLeftWidth: 3 }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        <Icon size={16} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, { color }]}>{alert.message}</Text>
        <View style={styles.meta}>
          <Text style={styles.sensor}>{alert.sensor}</Text>
          <Text style={styles.time}>{formatTime(alert.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensor: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
});
