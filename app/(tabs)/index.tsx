// Màn hình Home — Trang chủ của app
// Hiển thị lời chào, grid menu cards, hỗ trợ pull-to-refresh

import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { useState, useCallback } from 'react';
import { HomeHeader } from '@/components/HomeHeader';
import { MenuCard } from '@/components/MenuCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotifications } from '@/hooks/useNotifications';
import type { MenuCardItem } from '@/types';

// Danh sách menu cards trên màn hình home
const MENU_ITEMS: MenuCardItem[] = [
  {
    id: '1',
    icon: '📊',
    title: 'Thống kê',
    subtitle: 'Xem báo cáo và dashboard tổng quan',
    screen: '/(tabs)/explore',
    color: '#4A90E2',
  },
  {
    id: '2',
    icon: '📋',
    title: 'Quản lý',
    subtitle: 'Quản lý dữ liệu và danh sách',
    screen: '/(tabs)/explore',
    color: '#10B981',
  },
  {
    id: '3',
    icon: '🔔',
    title: 'Thông báo',
    subtitle: 'Xem tất cả thông báo đã nhận',
    screen: '/(tabs)/notifications',
    color: '#F59E0B',
  },
  {
    id: '4',
    icon: '⚙️',
    title: 'Cài đặt',
    subtitle: 'Tùy chỉnh app theo sở thích',
    screen: '/(tabs)/settings',
    color: '#8B5CF6',
  },
  {
    id: '5',
    icon: '📱',
    title: 'Hồ sơ',
    subtitle: 'Thông tin tài khoản cá nhân',
    screen: '/(tabs)/explore',
    color: '#EC4899',
  },
  {
    id: '6',
    icon: '🔍',
    title: 'Tìm kiếm',
    subtitle: 'Tìm kiếm nhanh mọi nội dung',
    screen: '/(tabs)/explore',
    color: '#14B8A6',
  },
];

export default function HomeScreen() {
  const { colors } = useColorScheme();
  const { unreadCount } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  // Xử lý pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Giả lập fetch data từ server
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header với gradient và lời chào */}
      <HomeHeader unreadCount={unreadCount} />

      {/* Danh sách menu */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Tiêu đề section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Danh mục
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Chọn chức năng bạn cần
          </Text>
        </View>

        {/* Menu cards */}
        {MENU_ITEMS.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}

        {/* Padding cuối danh sách */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomPadding: {
    height: 24,
  },
});
