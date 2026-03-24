// Màn hình Settings — Cài đặt ứng dụng
// Bao gồm: toggle notification, hiển thị FCM token, theme, app info, clear notifications

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotifications } from '@/hooks/useNotifications';
import { Config } from '@/constants/Config';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({
  icon,
  iconColor,
  title,
  subtitle,
  rightElement,
  onPress,
  danger = false,
}: SettingRowProps) {
  const { colors } = useColorScheme();

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            { color: danger ? colors.error : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.rowSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement ?? (
        onPress ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        ) : null
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useColorScheme();
  return (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const { colors, scheme } = useColorScheme();
  const {
    expoPushToken,
    isEnabled,
    toggleNotifications,
    clearAll,
    unreadCount,
  } = useNotifications();

  // Copy FCM token vào clipboard
  function handleCopyToken() {
    if (!expoPushToken) {
      Alert.alert('Chưa có token', 'Token chưa được đăng ký. Hãy cấp quyền thông báo trước.');
      return;
    }
    Clipboard.setString(expoPushToken);
    Alert.alert('Đã sao chép', 'Expo Push Token đã được sao chép vào clipboard.');
  }

  // Xóa tất cả notifications
  function handleClearNotifications() {
    if (unreadCount === 0) {
      Alert.alert('Thông báo', 'Không có thông báo nào để xóa.');
      return;
    }
    Alert.alert(
      'Xóa tất cả thông báo',
      `Bạn có chắc muốn xóa ${unreadCount} thông báo chưa đọc?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Cài đặt
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* === NOTIFICATION SETTINGS === */}
        <SectionHeader title="THÔNG BÁO" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="notifications"
            iconColor="#4A90E2"
            title="Nhận thông báo"
            subtitle={isEnabled ? 'Đang bật' : 'Đang tắt'}
            rightElement={
              <Switch
                value={isEnabled}
                onValueChange={() => void toggleNotifications()}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={isEnabled ? colors.primary : colors.textSecondary}
              />
            }
          />
          <SettingRow
            icon="key"
            iconColor="#10B981"
            title="Expo Push Token"
            subtitle={expoPushToken ?? 'Chưa có token — cấp quyền thông báo'}
            onPress={handleCopyToken}
          />
        </View>

        {/* === DISPLAY === */}
        <SectionHeader title="HIỂN THỊ" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={scheme === 'dark' ? 'moon' : 'sunny'}
            iconColor="#F59E0B"
            title="Giao diện"
            subtitle={scheme === 'dark' ? 'Tối (Dark Mode)' : 'Sáng (Light Mode)'}
            rightElement={
              <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {scheme === 'dark' ? 'Tối' : 'Sáng'}
                </Text>
              </View>
            }
          />
        </View>

        {/* === DATA === */}
        <SectionHeader title="DỮ LIỆU" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="trash"
            iconColor="#EF4444"
            title="Xóa tất cả thông báo"
            subtitle={`${unreadCount} thông báo chưa đọc`}
            onPress={handleClearNotifications}
            danger
          />
        </View>

        {/* === APP INFO === */}
        <SectionHeader title="THÔNG TIN ỨNG DỤNG" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="information-circle"
            iconColor="#6366F1"
            title="Phiên bản"
            subtitle={`v${Config.APP_VERSION}`}
          />
          <SettingRow
            icon="phone-portrait"
            iconColor="#8B5CF6"
            title="Nền tảng"
            subtitle={Platform.OS === 'ios' ? 'iOS' : 'Android'}
          />
          <SettingRow
            icon="code-slash"
            iconColor="#14B8A6"
            title="Expo SDK"
            subtitle="SDK 52+ / Expo Router"
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowSubtitle: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});
