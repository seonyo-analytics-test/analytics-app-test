import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

const ANALYTICS_OPTIONS = [
  {
    title: 'PostHog',
    href: '/posthog',
  },
  {
    title: 'Amplitude',
    href: '/amplitude',
  },
  {
    title: 'Mixpanel',
    href: '/mixpanel',
  },
  {
    title: 'Firebase Analytics / GA4',
    href: '/firebase',
  }
] as const;

export default function AnalyticsListScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="flex-grow items-center justify-start px-6 pt-16 pb-10">
      <View className="w-full max-w-[800px] gap-6">
        <View className="gap-2">
          <Text className="text-[30px] font-extrabold text-gray-900">애널리틱스 선택</Text>
          <Text className="text-base text-gray-500">사용할 SDK를 선택하세요.</Text>
        </View>

        <View className="gap-4">
          {ANALYTICS_OPTIONS.map((option) => (
            <Link href={option.href} asChild key={option.title}>
              <Pressable
                accessibilityRole="button"
                className="min-h-20 w-full flex-row items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-4 active:border-indigo-200 active:bg-gray-50">
                <View className="flex-1 gap-1">
                  <Text className="text-lg font-bold text-gray-900">{option.title}</Text>
                </View>
                <Text className="text-[28px] font-light text-indigo-600">›</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
