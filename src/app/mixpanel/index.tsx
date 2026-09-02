import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    isMixpanelConfigured,
    MIXPANEL_SERVER_URL,
    MIXPANEL_USER_ID,
    sendMixpanelEvent,
} from '@/lib/mixpanel';

const MIXPANEL_TEST_EVENT =
    'mixpanel_test_button_clicked';

export default function MixpanelScreen() {
    const [clickCount, setClickCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [distinctId, setDistinctId] = useState('');
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
        setLastStatus('이벤트를 전송하고 있습니다.');

        try {
            const result =
                await sendMixpanelEvent(nextClickCount);

            setDistinctId(result.distinctId);
            setLastStatus(
                `${MIXPANEL_TEST_EVENT} 이벤트를 큐에 저장하고 ` +
                'flush를 요청했습니다.',
            );
        } catch (error) {
            console.error(
                'Failed to capture Mixpanel event',
                error,
            );

            setLastStatus(
                error instanceof Error
                    ? error.message
                    : '이벤트 전송 중 오류가 발생했습니다.',
            );
        } finally {
            setIsSending(false);
        }
    };

    if (!isMixpanelConfigured) {
        return (
            <ScrollView
                className="flex-1 bg-white"
                contentContainerClassName="flex-grow px-6 pt-8 pb-10">
                <View className="gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <Text className="text-lg font-bold text-amber-900">
                        Mixpanel 설정이 필요합니다.
                    </Text>

                    <Text className="text-sm text-amber-800">
                        .env에 EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN을
                        추가한 뒤 앱을 다시 빌드하세요.
                    </Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerClassName="flex-grow items-center px-6 pt-8 pb-10">
            <View className="w-full max-w-[800px] gap-6">
                <View className="gap-2">
                    <Text className="text-[26px] font-extrabold text-gray-900">
                        Mixpanel 이벤트 테스트
                    </Text>

                    <Text className="text-base text-gray-500">
                        수동 track 이벤트를 전송합니다.
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    disabled={isSending}
                    onPress={handleSendEvent}
                    className={`min-h-[52px] items-center justify-center rounded-lg px-6 ${
                        isSending
                            ? 'bg-gray-400'
                            : 'bg-violet-700 active:opacity-80'
                    }`}>
                    <Text className="text-base font-bold text-white">
                        {isSending
                            ? '전송 중...'
                            : '클릭 이벤트 전송'}
                    </Text>
                </Pressable>

                <View className="gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <Text className="text-[15px] font-semibold text-gray-700">
                        {lastStatus}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        event: {MIXPANEL_TEST_EVENT}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        userId: {MIXPANEL_USER_ID || '익명 사용자'}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        distinctId: {distinctId || '아직 확인되지 않음'}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        server: {MIXPANEL_SERVER_URL}
                    </Text>

                    <Text className="text-sm text-gray-500">
                        클릭 횟수: {clickCount}
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}