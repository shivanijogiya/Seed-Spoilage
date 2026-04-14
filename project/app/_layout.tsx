import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SensorProvider } from '../context/SensorContext';
import 'react-native-reanimated';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SensorProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </SensorProvider>
  );
}
