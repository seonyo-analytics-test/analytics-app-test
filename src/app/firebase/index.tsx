import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    FIREBASE_ANALYTICS_TEST_EVENT,
    FIREBASE_ANALYTICS_USER_ID,
    sendFirebaseAnalyticsTestEvent,
} from '@/lib/firebase-analytics';

export default function FirebaseAnalyticsScreen() {
    const [clickCount, setClickCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [lastStatus, setLastStatus] = useState(
        '버튼을 눌러 이벤트를 전송하세요.',
    );

    const handleSendEvent = async () => {
        if (isSending) {
            return;
        }

        const nextClickCount = clickCount + 1;

        setClickCount(nextClickCount);
        setIsSending(true);
        setLastStatus('이벤트 기록을 요청하고 있습니다.');

        try {
            await sendFirebaseAnalyticsTestEvent(
                nextClickCount,
            );

            setLastStatus(
                `${FIREBASE_ANALYTICS_TEST_EVENT} 이벤트 기록을 ` +
                '요청했습니다. DebugView에서 확인하세요.',
            );
        } catch (error) {
            console.error(
                'Failed to log Firebase Analytics event',
                error,
            );

            setLastStatus(
                error instanceof Error
                    ? error.message
                    : '이벤트 기록 중 오류가 발생했습니다.',
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerClassName="flex-grow items-center px-6 pt-8 pb-10">
            <View className="w-full max-w-[800px] gap-6">
                <View className="gap-2">
                    <Text className="text-[26px] font-extrabold text-gray-900">
                        Firebase Analytics 이벤트 테스트
                    </Text>

                    <Text className="text-base text-gray-500">
                        GA4로 수동 logEvent 이벤트를 전송합니다.
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSending }}
                    disabled={isSending}
                    onPress={handleSendEvent}
                    className={`min-h-[52px] items-center justify-center rounded-lg px-6 ${
                        isSending
                            ? 'bg-gray-400'
                            : 'bg-blue-700 active:opacity-80'
                    }`}>
                    <Text className="text-base font-bold text-white">
                        {isSending
                            ? '기록 요청 중...'
                            : '클릭 이벤트 전송'}
                    </Text>
                </Pressable>

                <View className="gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <Text className="text-[15px] font-semibold text-gray-700">
                        {lastStatus}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        event: {FIREBASE_ANALYTICS_TEST_EVENT}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        userId:{' '}
                        {FIREBASE_ANALYTICS_USER_ID ||
                            '익명 사용자'}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        screen: firebase
                    </Text>

                    <Text className="text-sm text-gray-500">
                        element: send_event_button
                    </Text>

                    <Text className="text-sm text-gray-500">
                        클릭 횟수: {clickCount}
                    </Text>
                </View>

                <View className="gap-2 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <Text className="text-sm font-semibold text-blue-900">
                        이벤트 확인 방법
                    </Text>

                    <Text className="text-sm leading-5 text-blue-800">
                        Firebase Console의 Analytics → DebugView에서
                        이벤트와 파라미터를 확인할 수 있습니다.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
