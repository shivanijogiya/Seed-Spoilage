import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import { SpoilageLevel } from '../types/sensors';
import { Colors } from '../utils/theme';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  level: SpoilageLevel;
  flame: boolean;
  vibration: boolean;
  gasLevel: number;
  weight: number;
}

const GRAIN_COLORS = {
  SAFE: '#F59E0B',
  WARNING: '#92400E',
  CRITICAL: '#1C1917',
};

const W = 200;
const H = 200;

const SmokeParticle: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = 0;
    const t = setTimeout(() => {
      anim.value = withRepeat(
        withTiming(1, { duration: 2000 + delay, easing: Easing.out(Easing.quad) }),
        -1,
        false
      );
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const animProps = useAnimatedProps(() => ({
    cy: interpolate(anim.value, [0, 1], [130, 60]),
    opacity: interpolate(anim.value, [0, 0.3, 1], [0, 0.6, 0]),
    r: interpolate(anim.value, [0, 1], [4, 12]),
  }));

  return <AnimatedCircle cx={x} fill="#9CA3AF" animatedProps={animProps} />;
};

const FlameShape: React.FC<{ cx: number; delay: number }> = ({ cx, delay }) => {
  const anim = useSharedValue(0);
  useEffect(() => {
    const t = setTimeout(() => {
      anim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const animProps = useAnimatedProps(() => ({
    opacity: interpolate(anim.value, [0, 1], [0.8, 1]),
    scaleY: interpolate(anim.value, [0, 1], [0.9, 1.1]),
  }));

  return (
    <AnimatedPath
      d={`M${cx} 140 Q${cx - 8} 120 ${cx - 4} 105 Q${cx} 95 ${cx + 4} 105 Q${cx + 8} 120 ${cx} 140 Z`}
      fill="#F97316"
      animatedProps={animProps}
      origin={`${cx},130`}
    />
  );
};

export const GrainVisualizer: React.FC<Props> = ({ level, flame, vibration, gasLevel, weight }) => {
  const grainColor = GRAIN_COLORS[level];
  const shakeX = useSharedValue(0);

  const fillHeight = Math.max(20, Math.min(80, ((weight - 60) / 40) * 60 + 20));
  const fillY = 140 - (fillHeight * 0.9);
  const showSmoke = gasLevel > 300;

  useEffect(() => {
    if (vibration) {
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 60 }),
          withTiming(6, { duration: 60 }),
          withTiming(-4, { duration: 60 }),
          withTiming(4, { duration: 60 }),
          withTiming(0, { duration: 60 })
        ),
        3,
        false
      );
    }
  }, [vibration]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Grain Storage Unit</Text>
      <Animated.View style={containerStyle}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Silo body */}
          <Rect x="50" y="50" width="100" height="100" rx="4" fill="#1F2937" stroke="#374151" strokeWidth="2" />
          {/* Silo roof */}
          <Path d="M44 50 L100 20 L156 50 Z" fill="#111827" stroke="#374151" strokeWidth="2" />
          {/* Silo base */}
          <Path d="M50 150 L60 175 L140 175 L150 150 Z" fill="#111827" stroke="#374151" strokeWidth="2" />

          {/* Grain fill */}
          <Rect
            x="51"
            y={fillY}
            width="98"
            height={fillHeight * 0.9}
            fill={grainColor}
            opacity={0.85}
          />
          {/* Grain surface curve */}
          <Ellipse
            cx="100"
            cy={fillY}
            rx="49"
            ry="8"
            fill={level === 'SAFE' ? '#FBBF24' : level === 'WARNING' ? '#A16207' : '#292524'}
          />

          {/* Silo window */}
          <Rect x="85" y="80" width="30" height="20" rx="3" fill="#0A0E1A" stroke="#374151" strokeWidth="1" />
          {level !== 'SAFE' && (
            <Rect x="85" y="80" width="30" height="20" rx="3" fill={level === 'CRITICAL' ? '#EF444433' : '#F59E0B22'} />
          )}

          {/* Smoke particles */}
          {showSmoke && [90, 100, 110].map((x, i) => (
            <SmokeParticle key={i} x={x} delay={i * 600} />
          ))}

          {/* Flame */}
          {flame && [85, 100, 115].map((cx, i) => (
            <FlameShape key={i} cx={cx} delay={i * 150} />
          ))}

          {/* Status light */}
          <Circle
            cx="145"
            cy="60"
            r="6"
            fill={level === 'SAFE' ? '#10B981' : level === 'WARNING' ? '#F59E0B' : '#EF4444'}
          />
          <Circle cx="145" cy="60" r="3" fill="white" opacity={0.6} />
        </Svg>
      </Animated.View>

      <View style={[styles.statusBar, { backgroundColor: (level === 'SAFE' ? Colors.safe : level === 'WARNING' ? Colors.warning : Colors.critical) + '22' }]}>
        <View style={[styles.statusDot, { backgroundColor: level === 'SAFE' ? Colors.safe : level === 'WARNING' ? Colors.warning : Colors.critical }]} />
        <Text style={[styles.statusText, { color: level === 'SAFE' ? Colors.safe : level === 'WARNING' ? Colors.warning : Colors.critical }]}>
          {flame ? 'FIRE DETECTED' : vibration ? 'VIBRATION DETECTED' : `Status: ${level}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subtext,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
