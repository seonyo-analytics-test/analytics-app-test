import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { AnalyticsProvider } from '@/providers/posthog-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AnalyticsProvider>
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="posthog" options={{ title: 'PostHog' }} />
      </Stack>
    </AnalyticsProvider>
  );
}
