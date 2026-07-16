import type { PropsWithChildren } from 'react';
import { PostHogProvider } from 'posthog-react-native';

import { isPostHogConfigured, POSTHOG_API_KEY, POSTHOG_HOST } from '@/lib/posthog';

export function AnalyticsProvider({ children }: PropsWithChildren) {
  if (!isPostHogConfigured) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: POSTHOG_HOST,
        flushAt: 1,
        captureAppLifecycleEvents: true,
      }}
      autocapture={false}>
      {children}
    </PostHogProvider>
  );
}
