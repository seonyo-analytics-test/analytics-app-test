import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { usePostHog } from 'posthog-react-native';

import { isPostHogConfigured, POSTHOG_HOST } from '@/lib/posthog';

const POSTHOG_CLICK_EVENT = 'posthog_test_button_clicked';
const CURRENT_USER_ID = process.env.EXPO_PUBLIC_ANALYTICS_USER_ID?.trim() ?? '';

export default function PostHogScreen() {
  if (!isPostHogConfigured) {
    return <PostHogConfigurationRequired />;
  }

  return <PostHogEventTester />;
}

function PostHogConfigurationRequired() {
  return (
    <PostHogScreenLayout>
      <View className="gap-2">
        <Text className="text-[26px] font-extrabold text-gray-900">PostHog 이벤트 테스트</Text>
        <Text className="text-base text-gray-500">
          EXPO_PUBLIC_POSTHOG_API_KEY를 설정하면 이벤트를 전송할 수 있습니다.
        </Text>
      </View>

      <View className="gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <Text className="text-[15px] font-semibold text-amber-900">
          PostHog API key가 설정되지 않았습니다.
        </Text>
        <Text className="text-sm text-amber-800">
          .env에 EXPO_PUBLIC_POSTHOG_API_KEY 값을 추가한 뒤 Expo 서버를 재시작하세요.
        </Text>
        <Text className="text-sm text-amber-800">host: {POSTHOG_HOST}</Text>
      </View>
    </PostHogScreenLayout>
  );
}

function PostHogEventTester() {
  const posthog = usePostHog();
  const clickCountRef = useRef(0);
  const identifiedUserIdRef = useRef<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [lastStatus, setLastStatus] = useState('버튼을 눌러 이벤트를 전송하세요.');

  const handleSendClickEvent = useCallback(async () => {
    if (isSending) {
      return;
    }

    const nextClickCount = clickCountRef.current + 1;
    clickCountRef.current = nextClickCount;
    setClickCount(nextClickCount);

    if (!posthog) {
      setLastStatus('PostHog client가 아직 준비되지 않았습니다.');
      return;
    }

    setIsSending(true);
    setLastStatus('이벤트를 전송하고 있습니다.');

    try {
      if (CURRENT_USER_ID && identifiedUserIdRef.current !== CURRENT_USER_ID) {
        posthog.identify(CURRENT_USER_ID, {
          user_id: CURRENT_USER_ID,
        });
        identifiedUserIdRef.current = CURRENT_USER_ID;
      }

      const eventProperties = {
        screen: 'posthog',
        element: 'send_event_button',
        click_count: nextClickCount,
        ...(CURRENT_USER_ID ? { user_id: CURRENT_USER_ID } : {}),
      };

      posthog.capture(POSTHOG_CLICK_EVENT, eventProperties);
      await posthog.flush();
      setLastStatus(`${POSTHOG_CLICK_EVENT} 이벤트를 전송했습니다.`);
    } catch (error) {
      console.error('Failed to capture PostHog event', error);
      setLastStatus('이벤트 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSending(false);
    }
  }, [isSending, posthog]);

  return (
    <PostHogScreenLayout>
      <View className="gap-2">
        <Text className="text-[26px] font-extrabold text-gray-900">PostHog 이벤트 테스트</Text>
        <Text className="text-base text-gray-500">수동 capture 이벤트를 전송합니다.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isSending}
        onPress={handleSendClickEvent}
        className={`min-h-[52px] items-center justify-center rounded-lg px-6 ${
          isSending ? 'bg-gray-400' : 'bg-blue-700 active:opacity-80'
        }`}>
        <Text className="text-base font-bold text-white">
          {isSending ? '전송 중...' : '클릭 이벤트 전송'}
        </Text>
      </Pressable>

      <View className="gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Text className="text-[15px] font-semibold text-gray-700">{lastStatus}</Text>
        <Text className="text-sm text-gray-500">host: {POSTHOG_HOST}</Text>
        <Text className="text-sm text-gray-500">
          userId: {CURRENT_USER_ID || '설정되지 않음'}
        </Text>
        <Text className="text-sm text-gray-500">클릭 횟수: {clickCount}</Text>
      </View>
    </PostHogScreenLayout>
  );
}

function PostHogScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="flex-grow items-center px-6 pt-8 pb-10">
      <View className="w-full max-w-[800px] gap-6">{children}</View>
    </ScrollView>
  );
}
