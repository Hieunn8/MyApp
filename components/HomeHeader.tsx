// Component Header cho màn hình Home
// Hiển thị tên app, lời chào và icon thông báo với badge count

import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Config } from '@/constants/Config';

interface HomeHeaderProps {
  unreadCount: number;
}

export function HomeHeader({ unreadCount }: HomeHeaderProps) {
  const router = useRouter();
  const { colors } = useColorScheme();

  const today = new Date();
  const greeting = getGreeting(today.getHours());

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.topRow}>
        {/* Logo và tên app */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="grid" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>{Config.APP_NAME}</Text>
        </View>

        {/* Nút thông báo với badge */}
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => router.push('/(tabs)/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={24} color="#FFFFFF" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Phần chào hỏi */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{Config.USER_NAME}! 👋</Text>
        <Text style={styles.subGreeting}>
          Hôm nay bạn cần làm gì?
        </Text>
      </View>
    </View>
  );
}

/**
 * Trả về lời chào phù hợp với thời gian trong ngày
 */
function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
  if (hour >= 12 && hour < 17) return 'Chào buổi chiều';
  if (hour >= 17 && hour < 21) return 'Chào buổi tối';
  return 'Xin chào';
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  notifButton: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  greetingContainer: {
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
