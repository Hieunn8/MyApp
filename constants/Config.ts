// Cấu hình chung của app

export const Config = {
  APP_NAME: 'MyApp',
  APP_VERSION: '1.0.0',
  // Tên người dùng hiển thị trên màn hình chào
  USER_NAME: 'Hieu',
  // AsyncStorage key để lưu danh sách notifications
  STORAGE_KEYS: {
    NOTIFICATIONS: '@myapp/notifications',
    NOTIFICATION_ENABLED: '@myapp/notification_enabled',
    THEME: '@myapp/theme',
  },
  // Số lượng notifications tối đa lưu local
  MAX_NOTIFICATIONS: 50,
} as const;
