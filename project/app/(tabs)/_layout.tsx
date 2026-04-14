import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Activity, Bell, Settings2 } from 'lucide-react-native';
import { Colors, FontSize } from '../../utils/theme';
import { useSensor } from '../../context/SensorContext';
import { View, Text, StyleSheet } from 'react-native';

const TabBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <View style={badge.wrap}>
      <Text style={badge.text}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
};

const badge = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.critical,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  text: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});

function AlertsTabIcon({ color, size }: { color: string; size: number }) {
  const { alerts } = useSensor();
  return (
    <View>
      <Bell size={size} color={color} />
      <TabBadge count={alerts.length} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.safe,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Sensors',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <AlertsTabIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: 'Control',
          tabBarIcon: ({ color, size }) => <Settings2 size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
