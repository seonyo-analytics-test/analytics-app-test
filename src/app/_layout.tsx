import { DarkTheme, DefaultTheme, ThemeProvider, usePathname, useGlobalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import { PostHogProvider } from 'posthog-react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { posthog } from '@/config/posthog';

SplashScreen.preventAutoHideAsync();

function ScreenTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return null;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ['testID'],
        maxElementsCaptured: 20,
      }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ScreenTracker />
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </PostHogProvider>
  );
}
