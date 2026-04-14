import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors, FontSize } from '../utils/theme';

interface LEDProps {
  on: boolean;
  color: string;
  label: string;
}

const LED: React.FC<LEDProps> = ({ on, color, label }) => {
  const glow = useSharedValue(0.4);

  useEffect(() => {
    if (on) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.5, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      glow.value = withTiming(0.15, { duration: 300 });
    }
  }, [on]);

  const outerStyle = useAnimatedStyle(() => ({
    shadowOpacity: on ? glow.value : 0,
    opacity: on ? glow.value + 0.1 : 0.2,
  }));

  return (
    <View style={styles.ledWrap}>
      <View style={styles.ledOuter}>
        <Animated.View
          style={[
            styles.ledInner,
            { backgroundColor: color, shadowColor: color, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
            outerStyle,
          ]}
        />
      </View>
      <Text style={[styles.ledLabel, { color: on ? color : Colors.muted }]}>{label}</Text>
      <Text style={[styles.ledState, { color: on ? color : Colors.muted }]}>{on ? 'ON' : 'OFF'}</Text>
    </View>
  );
};

interface BuzzerProps {
  on: boolean;
}

const Buzzer: React.FC<BuzzerProps> = ({ on }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (on) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 200 }),
          withTiming(0.95, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [on]);

  const buzzerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.ledWrap}>
      <Animated.View
        style={[
          styles.buzzerIcon,
          { backgroundColor: on ? '#F97316' : Colors.surface },
          buzzerStyle,
          on && { shadowColor: '#F97316', shadowRadius: 12, shadowOpacity: 0.8, shadowOffset: { width: 0, height: 0 } },
        ]}
      >
        <Text style={styles.buzzerEmoji}>📢</Text>
      </Animated.View>
      <Text style={[styles.ledLabel, { color: on ? '#F97316' : Colors.muted }]}>Buzzer</Text>
      <Text style={[styles.ledState, { color: on ? '#F97316' : Colors.muted }]}>{on ? 'ACTIVE' : 'OFF'}</Text>
    </View>
  );
};

interface Props {
  redLED: boolean;
  greenLED: boolean;
  buzzer: boolean;
}

export const LEDPanel: React.FC<Props> = ({ redLED, greenLED, buzzer }) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Actuators</Text>
      <View style={styles.row}>
        <LED on={redLED} color="#EF4444" label="Red LED" />
        <LED on={greenLED} color="#10B981" label="Green LED" />
        <Buzzer on={buzzer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ledWrap: {
    alignItems: 'center',
    gap: 6,
  },
  ledOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  ledLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  ledState: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  buzzerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buzzerEmoji: {
    fontSize: 22,
  },
});
