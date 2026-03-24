// Root Layout — điểm vào của toàn bộ app
// Khởi tạo notification listeners và xử lý deep link khi app mở từ notification

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const router = useRouter();
  const { scheme } = useColorScheme();

  useEffect(() => {
    // Xử lý notification khi user mở app bằng cách tap vào notification
    // (khi app đang background hoặc killed state)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<
          string,
          unknown
        >;

        // Navigate đến màn hình tương ứng dựa theo data.screen
        if (data?.screen === 'notifications' && data?.id) {
          router.push({
            pathname: '/notification-detail',
            params: { id: String(data.id) },
          });
        } else if (data?.screen === 'notifications') {
          router.push('/(tabs)/notifications');
        }
      }
    );

    // Lấy notification đã mở app (last notification response khi app bị killed)
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data as Record<
          string,
          unknown
        >;
        if (data?.screen === 'notification-detail' && data?.id) {
          router.push({
            pathname: '/notification-detail',
            params: { id: String(data.id) },
          });
        }
      }
    });

    return () => subscription.remove();
  }, [router]);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="notification-detail"
          options={{
            title: 'Chi tiết thông báo',
            headerBackTitle: 'Quay lại',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
