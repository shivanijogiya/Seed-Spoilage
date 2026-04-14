import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg';
import { ChartDataPoint } from '../types/sensors';
import { Colors, FontSize } from '../utils/theme';

interface Props {
  data: ChartDataPoint[];
  color: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  height?: number;
}

export const MiniLineChart: React.FC<Props> = ({
  data,
  color,
  label,
  unit,
  min,
  max,
  height = 80,
}) => {
  const W = 300;
  const H = height;
  const PAD = { top: 8, bottom: 20, left: 28, right: 8 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  if (data.length < 2) {
    return (
      <View style={[styles.container, { height: H + 24 }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <View style={styles.empty}><Text style={styles.emptyText}>Collecting data...</Text></View>
      </View>
    );
  }

  const values = data.map(d => d.value);
  const dataMin = min ?? Math.min(...values);
  const dataMax = max ?? Math.max(...values);
  const range = dataMax - dataMin || 1;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => PAD.top + innerH - ((v - dataMin) / range) * innerH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(' ');
  const lastVal = values[values.length - 1];
  const lastX = toX(data.length - 1);
  const lastY = toY(lastVal);

  const gridLines = 3;
  const gridValues = Array.from({ length: gridLines }, (_, i) =>
    dataMin + (range * i) / (gridLines - 1)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={[styles.currentVal, { color }]}>
          {lastVal.toFixed(1)} {unit}
        </Text>
      </View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {gridValues.map((v, i) => (
          <React.Fragment key={i}>
            <Line
              x1={PAD.left}
              y1={toY(v)}
              x2={W - PAD.right}
              y2={toY(v)}
              stroke="#1F2937"
              strokeWidth="1"
            />
            <SvgText
              x={PAD.left - 4}
              y={toY(v) + 4}
              fontSize="8"
              fill={Colors.muted}
              textAnchor="end"
            >
              {v.toFixed(0)}
            </SvgText>
          </React.Fragment>
        ))}
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <Circle cx={lastX} cy={lastY} r="4" fill={color} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  currentVal: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  empty: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.muted,
    fontSize: FontSize.sm,
  },
});
