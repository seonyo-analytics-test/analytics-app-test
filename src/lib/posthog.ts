export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? '';

export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';

export const isPostHogConfigured = POSTHOG_API_KEY.length > 0;
