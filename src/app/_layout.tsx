import '@/global.css';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { AnalyticsProvider } from '@/providers/posthog-provider';
import {initializeAmplitude} from "@/lib/amplitude";
import {initializeMixpanel} from "@/lib/mixpanel";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
      void initializeAmplitude().catch((error) => {
          console.error('Failed to initialize Amplitude', error);
      })
      void initializeMixpanel().catch((error) => {
          console.error('Failed to initialize Mixpanel', error);
      });
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
        <Stack.Screen name="amplitude" options={{ title: 'Amplitude' }} />
        <Stack.Screen name="mixpanel" options={{ title: 'Mixpanel' }} />
      </Stack>
    </AnalyticsProvider>
  );
}
