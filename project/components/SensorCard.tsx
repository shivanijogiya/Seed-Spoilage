import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../utils/theme';

interface Props {
  title: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  statusColor: string;
  subtitle?: string;
  compact?: boolean;
}

export const SensorCard: React.FC<Props> = ({
  title,
  value,
  unit,
  icon,
  statusColor,
  subtitle,
  compact = false,
}) => {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={[styles.iconBadge, { backgroundColor: statusColor + '22' }]}>
        {icon}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: statusColor }]}>{value}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.indicator, { backgroundColor: statusColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardCompact: {
    padding: Spacing.sm,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    fontWeight: '500',
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  indicator: {
    width: 4,
    height: 32,
    borderRadius: Radius.full,
  },
});
