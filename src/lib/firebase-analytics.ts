import {
    type Analytics,
    getAnalytics,
    logEvent,
    logScreenView,
    setDefaultEventParameters,
    setUserId,
} from '@react-native-firebase/analytics';

export const FIREBASE_ANALYTICS_TEST_EVENT =
    'firebase_test_button_clicked';

export const FIREBASE_ANALYTICS_USER_ID =
    process.env.EXPO_PUBLIC_ANALYTICS_USER_ID?.trim() ?? '';

let analytics: Analytics | null = null;
let initializationPromise: Promise<void> | null = null;

function getFirebaseAnalytics(): Analytics {
    if (!analytics) {
        analytics = getAnalytics();
    }

    return analytics;
}

export function initializeFirebaseAnalytics(): Promise<void> {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            const instance = getFirebaseAnalytics();

            await setDefaultEventParameters(instance, {
                app_environment: __DEV__
                    ? 'development'
                    : 'production',
            });

            if (FIREBASE_ANALYTICS_USER_ID) {
                await setUserId(
                    instance,
                    FIREBASE_ANALYTICS_USER_ID,
                );
            }
        })().catch((error) => {
            initializationPromise = null;
            throw error;
        });
    }

    return initializationPromise;
}

export async function sendFirebaseAnalyticsTestEvent(
    clickCount: number,
): Promise<void> {
    await initializeFirebaseAnalytics();

    logEvent(
        getFirebaseAnalytics(),
        FIREBASE_ANALYTICS_TEST_EVENT,
        {
            screen: 'firebase',
            element: 'send_event_button',
            click_count: clickCount,
        },
    );
}

export async function trackFirebaseScreen(
    screenName: string,
): Promise<void> {
    await initializeFirebaseAnalytics();

    logScreenView(getFirebaseAnalytics(), {
        screen_name: screenName,
        screen_class: screenName,
    });
}
