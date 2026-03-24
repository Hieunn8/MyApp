// Service xử lý toàn bộ logic liên quan đến Push Notification
// Tích hợp Expo Notifications + Firebase Cloud Messaging

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Cấu hình cách hiển thị notification khi app đang foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Đăng ký nhận push notification và lấy Expo Push Token
 * Yêu cầu thiết bị thật (không hoạt động trên simulator)
 * @returns Expo Push Token hoặc undefined nếu thất bại
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  // Chỉ hoạt động trên thiết bị thật
  if (!Device.isDevice) {
    Alert.alert(
      'Thiết bị không hỗ trợ',
      'Push notification chỉ hoạt động trên thiết bị thật, không phải simulator.'
    );
    return undefined;
  }

  try {
    // Kiểm tra và yêu cầu permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Nếu user từ chối permission
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Không có quyền',
        'Vui lòng vào Cài đặt > MyApp để bật thông báo.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Mở Cài đặt',
            onPress: () => {
              // Trên iOS có thể dùng Linking.openSettings()
              console.log('Mở cài đặt thiết bị');
            },
          },
        ]
      );
      return undefined;
    }

    // Lấy project ID từ app config (cần thiết cho Expo Push Notification service)
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn('Không tìm thấy EAS Project ID trong app config');
    }

    // Lấy Expo Push Token
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : {}
    );

    const token = tokenData.data;
    console.log('📱 Expo Push Token:', token);

    // Cấu hình notification channel cho Android
    if (Platform.OS === 'android') {
      await setupAndroidNotificationChannel();
    }

    return token;
  } catch (error) {
    console.error('Lỗi khi đăng ký push notification:', error);
    return undefined;
  }
}

/**
 * Thiết lập Android Notification Channel
 * Android 8.0+ (API 26+) bắt buộc phải có channel
 */
async function setupAndroidNotificationChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Thông báo chung',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4A90E2',
    sound: 'default',
    enableVibrate: true,
    showBadge: true,
  });

  await Notifications.setNotificationChannelAsync('alerts', {
    name: 'Cảnh báo quan trọng',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 500, 250, 500],
    lightColor: '#EF4444',
    sound: 'default',
  });
}

/**
 * Xử lý notification nhận được khi app đang foreground
 * @param notification - Notification object từ expo-notifications
 */
export function handleNotificationReceived(
  notification: Notifications.Notification
): void {
  const { title, body } = notification.request.content;
  console.log('🔔 Foreground notification nhận được:', { title, body });
  // Logic bổ sung: cập nhật badge, lưu vào store, v.v.
}

/**
 * Xử lý khi user tap vào notification
 * Dùng để navigate đến màn hình phù hợp (deep link)
 * @param response - Response object khi user tương tác với notification
 */
export function handleNotificationResponse(
  response: Notifications.NotificationResponse
): void {
  const data = response.notification.request.content.data as Record<
    string,
    unknown
  >;
  console.log('👆 User tap vào notification, data:', data);

  // Deep linking logic — navigate dựa trên data.screen
  // Ví dụ: data = { screen: 'notifications', id: '123' }
  // Expo Router sẽ xử lý navigation thông qua useNavigation hoặc router.push
}

/**
 * Gửi local notification (để test mà không cần server)
 * @param title - Tiêu đề notification
 * @param body - Nội dung notification
 * @param data - Dữ liệu bổ sung đính kèm
 */
export async function schedulePushNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data ?? {},
        sound: 'default',
        badge: 1,
      },
      trigger: null, // null = gửi ngay lập tức
    });
    console.log('✅ Local notification đã được gửi:', { title, body });
  } catch (error) {
    console.error('Lỗi khi gửi local notification:', error);
    throw error;
  }
}

/**
 * Cập nhật số badge trên icon app (iOS)
 * @param count - Số lượng unread notifications
 */
export async function updateBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Lỗi khi cập nhật badge:', error);
  }
}

/**
 * Xóa tất cả delivered notifications khỏi notification tray
 */
export async function dismissAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.setBadgeCountAsync(0);
}
