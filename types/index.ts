// Định nghĩa các type/interface dùng chung trong toàn bộ app

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
  data?: Record<string, unknown>;
  screen?: string;
}

export interface MenuCardItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  screen: string;
  color: string;
}

export interface UseNotificationsReturn {
  expoPushToken: string | undefined;
  notification: import('expo-notifications').Notification | undefined;
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  isEnabled: boolean;
  toggleNotifications: () => Promise<void>;
}

export type RootStackParamList = {
  '(tabs)': undefined;
  'notification-detail': { id: string };
};

export type TabParamList = {
  index: undefined;
  explore: undefined;
  notifications: undefined;
  settings: undefined;
};
