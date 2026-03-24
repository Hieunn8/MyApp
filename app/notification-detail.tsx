// Màn hình chi tiết Notification
// Hiển thị đầy đủ nội dung notification khi user tap vào

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useColorScheme();
  const { notifications, markAsRead } = useNotifications();
  const navigation = useNavigation();

  // Tìm notification theo id
  const notification = notifications.find((n) => n.id === id);

  // Đánh dấu đã đọc khi mở màn hình
  useEffect(() => {
    if (id && notification && !notification.isRead) {
      markAsRead(id);
    }
  }, [id, notification, markAsRead]);

  // Cập nhật title của header
  useEffect(() => {
    navigation.setOptions({
      title: 'Chi tiết thông báo',
    });
  }, [navigation]);

  if (!notification) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
          Không tìm thấy thông báo
        </Text>
      </View>
    );
  }

  const formattedDate = new Date(notification.timestamp).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon và trạng thái */}
        <View style={styles.iconRow}>
          <View style={[styles.iconBg, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="notifications" size={32} color={colors.primary} />
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: notification.isRead
                  ? colors.border
                  : colors.primary,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: notification.isRead ? colors.textSecondary : '#FFFFFF' }]}>
              {notification.isRead ? 'Đã đọc' : 'Mới'}
            </Text>
          </View>
        </View>

        {/* Tiêu đề */}
        <Text style={[styles.title, { color: colors.text }]}>
          {notification.title}
        </Text>

        {/* Thời gian */}
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Nội dung */}
        <Text style={[styles.body, { color: colors.text }]}>{notification.body}</Text>

        {/* Data bổ sung (nếu có) */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <View style={[styles.dataCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dataTitle, { color: colors.textSecondary }]}>
              DỮ LIỆU ĐÍNH KÈM
            </Text>
            {Object.entries(notification.data).map(([key, value]) => (
              <View key={key} style={styles.dataRow}>
                <Text style={[styles.dataKey, { color: colors.textSecondary }]}>
                  {key}:
                </Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {String(value)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
  },
  dataCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    marginTop: 8,
  },
  dataTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dataRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dataKey: {
    fontSize: 13,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 13,
    flex: 1,
  },
});
