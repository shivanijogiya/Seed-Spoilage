import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SpoilageLevel } from '../types/sensors';
import { Colors, FontSize } from '../utils/theme';

interface Props {
  level: SpoilageLevel;
  score: number;
  alertCount: number;
}

const LEVEL_COLOR: Record<SpoilageLevel, string> = {
  SAFE: Colors.safe,
  WARNING: Colors.warning,
  CRITICAL: Colors.critical,
};

export const StatusHeader: React.FC<Props> = ({ level, score, alertCount }) => {
  const pulseOpacity = useSharedValue(1);
  const color = LEVEL_COLOR[level];

  useEffect(() => {
    if (level === 'CRITICAL') {
      pulseOpacity.value = withRepeat(
        withTiming(0.3, { duration: 500 }),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [level]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.appTitle}>Smart Grain Monitor</Text>
        <Text style={styles.subtitle}>NodeMCU ESP32 Sensor Suite</Text>
      </View>
      <View style={styles.right}>
        {alertCount > 0 && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertCount}>{alertCount}</Text>
          </View>
        )}
        <Animated.View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }, pulseStyle]}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.badgeText, { color }]}>{level}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  appTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertBadge: {
    backgroundColor: Colors.critical,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  alertCount: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
