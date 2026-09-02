import {
    flush,
    init,
    track,
    Types,
} from '@amplitude/analytics-react-native';


export const AMPLITUDE_API_KEY =
    process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY?.trim() ?? '';

export const AMPLITUDE_USER_ID =
    process.env.EXPO_PUBLIC_ANALYTICS_USER_ID?.trim() ?? '';

export const isAmplitudeConfigured = AMPLITUDE_API_KEY.length > 0;

let initializationPromise: Promise<void> | null = null;

export function initializeAmplitude(): Promise<void> {
    if (!isAmplitudeConfigured) {
        return Promise.resolve();
    }

    if (!initializationPromise) {
        initializationPromise = init(
            AMPLITUDE_API_KEY,
            AMPLITUDE_USER_ID || undefined,
            {
                logLevel: __DEV__
                    ? Types.LogLevel.Debug
                    : Types.LogLevel.Warn,
            },
        ).promise
            .then(() => undefined)
            .catch((error) => {
                initializationPromise = null;
                throw error;
            });
    }

    return initializationPromise;
}
export async function sendAmplitudeTestEvent(clickCount: number) {
    if (!isAmplitudeConfigured) {
        throw new Error('Amplitude API Key가 설정되지 않았습니다.');
    }

    await initializeAmplitude();

    const trackResultPromise = track(
        'amplitude_test_button_clicked',
        {
            screen: 'amplitude',
            element: 'send_event_button',
            click_count: clickCount,
        },
    ).promise;

    await flush().promise;

    return trackResultPromise;
}
