// Context chia sẻ notification state cho toàn bộ app
// Đảm bảo chỉ có MỘT instance của useNotifications chạy

import React, { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import type { UseNotificationsReturn } from '@/types';

const NotificationContext = createContext<UseNotificationsReturn | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext(): UseNotificationsReturn {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext phải dùng bên trong NotificationProvider');
  }
  return ctx;
}
