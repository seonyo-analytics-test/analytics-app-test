 import { Mixpanel } from 'mixpanel-react-native';

  export const MIXPANEL_PROJECT_TOKEN =
    process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN?.trim() ?? '';

  export const MIXPANEL_SERVER_URL =
    process.env.EXPO_PUBLIC_MIXPANEL_SERVER_URL?.trim() ||
    'https://api.mixpanel.com';

  export const MIXPANEL_USER_ID =
    process.env.EXPO_PUBLIC_ANALYTICS_USER_ID?.trim() ?? '';

  export const isMixpanelConfigured =
    MIXPANEL_PROJECT_TOKEN.length > 0;

  let mixpanel: Mixpanel | null = null;
  let initializationPromise: Promise<Mixpanel> | null = null;

  export async function initializeMixpanel(): Promise<Mixpanel | null> {
    if (!isMixpanelConfigured) {
      return null;
    }

    if (!mixpanel) {
      const trackAutomaticEvents = false;

      mixpanel = new Mixpanel(
        MIXPANEL_PROJECT_TOKEN,
        trackAutomaticEvents,
      );
    }

    if (!initializationPromise) {
      const client = mixpanel;

      initializationPromise = client
        .init(
          false,
          {
            app_environment: __DEV__
              ? 'development'
              : 'production',
          },
          MIXPANEL_SERVER_URL,
        )
        .then(async () => {
          client.setLoggingEnabled(__DEV__);

          if (MIXPANEL_USER_ID) {
            await client.identify(MIXPANEL_USER_ID);
          }

          return client;
        })
        .catch((error) => {
          mixpanel = null;
          initializationPromise = null;
          throw error;
        });
    }

    return initializationPromise;
  }

  export async function sendMixpanelEvent(
    clickCount: number,
  ): Promise<{ distinctId: string }> {
    const client = await initializeMixpanel();

    if (!client) {
      throw new Error('Mixpanel Project Token이 설정되지 않았습니다.');
    }

    const distinctId = await client.getDistinctId();

    client.track('mixpanel_test_button_clicked', {
      screen: 'mixpanel',
      element: 'send_event_button',
      click_count: clickCount,
    });

    client.flush();

    return { distinctId };
  }
