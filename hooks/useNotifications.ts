// Custom hook quản lý toàn bộ trạng thái push notification
// Bao gồm: token, danh sách notifications, unread count, enable/disable

import { useState, useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo ID ngẫu nhiên không cần thư viện ngoài (tránh vấn đề ESM với nanoid)
function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

import {
  registerForPushNotificationsAsync,
  handleNotificationReceived,
  handleNotificationResponse,
  updateBadgeCount,
} from '@/services/notificationService';
import { Config } from '@/constants/Config';
import type { NotificationData, UseNotificationsReturn } from '@/types';

export function useNotifications(): UseNotificationsReturn {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Ref để tránh memory leak khi component unmount
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  // Số notification chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- Khởi tạo: load dữ liệu từ AsyncStorage ---
  useEffect(() => {
    void loadPersistedData();
    void initializeNotifications();

    return () => {
      // Cleanup listeners khi component unmount
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // --- Cập nhật badge count mỗi khi unreadCount thay đổi ---
  useEffect(() => {
    void updateBadgeCount(unreadCount);
  }, [unreadCount]);

  /**
   * Load notifications và settings từ AsyncStorage
   */
  async function loadPersistedData(): Promise<void> {
    try {
      const [storedNotifications, storedEnabled] = await Promise.all([
        AsyncStorage.getItem(Config.STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(Config.STORAGE_KEYS.NOTIFICATION_ENABLED),
      ]);

      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications) as NotificationData[];
        setNotifications(parsed);
      }

      if (storedEnabled !== null) {
        setIsEnabled(JSON.parse(storedEnabled) as boolean);
      }
    } catch (error) {
      console.error('Lỗi khi load dữ liệu từ storage:', error);
    }
  }

  /**
   * Khởi tạo: đăng ký push notification và setup listeners
   */
  async function initializeNotifications(): Promise<void> {
    // Đăng ký và lấy token
    const token = await registerForPushNotificationsAsync();
    setExpoPushToken(token);

    // Listener khi nhận notification lúc app foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((receivedNotification) => {
        setNotification(receivedNotification);
        handleNotificationReceived(receivedNotification);

        // Lưu notification vào danh sách
        void addNotificationToList(receivedNotification);
      });

    // Listener khi user tap vào notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse(response);

        // Đánh dấu notification là đã đọc khi user tap
        const notifId = response.notification.request.identifier;
        markAsRead(notifId);
      });
  }

  /**
   * Thêm notification mới vào danh sách và lưu vào AsyncStorage
   */
  async function addNotificationToList(
    received: Notifications.Notification
  ): Promise<void> {
    const newNotif: NotificationData = {
      id: received.request.identifier || generateId(),
      title: received.request.content.title ?? 'Thông báo',
      body: received.request.content.body ?? '',
      timestamp: Date.now(),
      isRead: false,
      data: received.request.content.data as Record<string, unknown>,
      screen: (received.request.content.data as Record<string, unknown>)
        ?.screen as string | undefined,
    };

    setNotifications((prev) => {
      // Giới hạn số lượng notifications lưu trữ
      const updated = [newNotif, ...prev].slice(0, Config.MAX_NOTIFICATIONS);
      void persistNotifications(updated);
      return updated;
    });
  }

  /**
   * Lưu danh sách notifications vào AsyncStorage
   */
  async function persistNotifications(data: NotificationData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Lỗi khi lưu notifications:', error);
    }
  }

  /**
   * Đánh dấu một notification là đã đọc
   */
  const markAsRead = useCallback((id: string): void => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      void persistNotifications(updated);
      return updated;
    });
  }, []);

  /**
   * Xóa tất cả notifications
   */
  const clearAll = useCallback((): void => {
    setNotifications([]);
    void AsyncStorage.removeItem(Config.STORAGE_KEYS.NOTIFICATIONS);
  }, []);

  /**
   * Bật/tắt nhận notification
   */
  const toggleNotifications = useCallback(async (): Promise<void> => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    try {
      await AsyncStorage.setItem(
        Config.STORAGE_KEYS.NOTIFICATION_ENABLED,
        JSON.stringify(newValue)
      );
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt notification:', error);
    }

    // Nếu bật lại, đăng ký lại token
    if (newValue && !expoPushToken) {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    }
  }, [isEnabled, expoPushToken]);

  return {
    expoPushToken,
    notification,
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    isEnabled,
    toggleNotifications,
  };
}
