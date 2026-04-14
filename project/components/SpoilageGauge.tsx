import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SpoilageLevel } from '../types/sensors';
import { Colors, FontSize } from '../utils/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  score: number;
  level: SpoilageLevel;
}

const SIZE = 180;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const getLevelColor = (level: SpoilageLevel) => {
  if (level === 'SAFE') return '#10B981';
  if (level === 'WARNING') return '#F59E0B';
  return '#EF4444';
};

export const SpoilageGauge: React.FC<Props> = ({ score, level }) => {
  const progress = useSharedValue(0);
  const color = getLevelColor(level);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const offset = CIRC * (1 - progress.value);
    return {
      strokeDashoffset: offset,
    };
  });

  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={cx}
            cy={cy}
            r={R}
            stroke="#1F2937"
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={R}
            stroke={color}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRC} ${CIRC}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${cx}, ${cy}`}
          />
        </Svg>
        <View style={styles.centerContent}>
          <Text style={[styles.scoreText, { color }]}>{Math.round(score)}</Text>
          <Text style={styles.scoreLabel}>/ 100</Text>
          <View style={[styles.levelBadge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.levelText, { color }]}>{level}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.title}>Spoilage Risk Score</Text>
      <View style={styles.legend}>
        {(['SAFE', 'WARNING', 'CRITICAL'] as SpoilageLevel[]).map(l => (
          <View key={l} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getLevelColor(l) }]} />
            <Text style={styles.legendLabel}>{l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  svgWrapper: {
    position: 'relative',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 44,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: -4,
  },
  levelBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    fontWeight: '600',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
});
