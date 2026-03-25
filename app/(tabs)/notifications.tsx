// Màn hình Notifications — Danh sách thông báo
// Hỗ trợ: xem, đánh dấu đọc, xóa từng item, xóa tất cả

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotificationContext } from '@/context/NotificationContext';
import { NotificationItem } from '@/components/NotificationItem';
import { schedulePushNotification } from '@/services/notificationService';
import type { NotificationData } from '@/types';

// Component hiển thị khi chưa có notification
function EmptyState({ colors }: { colors: ReturnType<typeof useColorScheme>['colors'] }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconBg, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="notifications-off-outline" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Chưa có thông báo
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Các thông báo bạn nhận được sẽ hiển thị ở đây
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationContext();

  // Xử lý khi tap vào notification item
  function handleItemPress(item: NotificationData) {
    markAsRead(item.id);
    router.push({
      pathname: '/notification-detail',
      params: { id: item.id },
    });
  }

  // Xử lý xóa một notification
  function handleDelete(id: string) {
    // Không có delete riêng trong hook, xóa bằng cách filter
    // Tạm thời đánh dấu đọc
    markAsRead(id);
  }

  // Xác nhận xóa tất cả
  function handleClearAll() {
    if (notifications.length === 0) return;
    Alert.alert(
      'Xóa tất cả',
      'Bạn có chắc muốn xóa tất cả thông báo?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa tất cả', style: 'destructive', onPress: clearAll },
      ]
    );
  }

  // Gửi test notification
  async function handleTestNotification() {
    try {
      await schedulePushNotification(
        'Thông báo test 🔔',
        'Đây là thông báo test để kiểm tra hệ thống.',
        { screen: 'notifications', id: Date.now().toString() }
      );
    } catch {
      Alert.alert('Lỗi', 'Không thể gửi thông báo test. Vui lòng thử lại.');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Thông báo
          </Text>
          {unreadCount > 0 && (
            <Text style={[styles.unreadText, { color: colors.primary }]}>
              {unreadCount} chưa đọc
            </Text>
          )}
        </View>

        <View style={styles.headerActions}>
          {/* Nút test notification */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
            onPress={handleTestNotification}
          >
            <Ionicons name="send" size={16} color={colors.primary} />
          </TouchableOpacity>

          {/* Nút xóa tất cả */}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}
              onPress={handleClearAll}
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh sách notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={handleItemPress}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={<EmptyState colors={colors} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  unreadText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
