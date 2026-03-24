// Component hiển thị một notification item trong danh sách
// Hỗ trợ swipe-to-delete và trạng thái đọc/chưa đọc

import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { NotificationData } from '@/types';

interface NotificationItemProps {
  item: NotificationData;
  onPress: (item: NotificationData) => void;
  onDelete?: (id: string) => void;
}

/**
 * Format timestamp thành chuỗi thời gian dễ đọc (tiếng Việt)
 */
function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function NotificationItem({
  item,
  onPress,
  onDelete,
}: NotificationItemProps) {
  const { colors } = useColorScheme();

  function handleDelete() {
    Alert.alert('Xóa thông báo', 'Bạn có chắc muốn xóa thông báo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => onDelete?.(item.id),
      },
    ]);
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: item.isRead ? colors.card : colors.primaryLight,
          borderColor: colors.border,
          borderLeftColor: item.isRead ? colors.border : colors.primary,
        },
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {/* Dot chưa đọc */}
      {!item.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: item.isRead ? colors.border : colors.primary + '20' },
        ]}
      >
        <Ionicons
          name="notifications"
          size={20}
          color={item.isRead ? colors.textSecondary : colors.primary}
        />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontWeight: item.isRead ? '500' : '700',
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        <Text
          style={[styles.body, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
      </View>

      {/* Nút xóa */}
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderLeftWidth: 3,
    gap: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    flexShrink: 0,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
    flexShrink: 0,
  },
});
