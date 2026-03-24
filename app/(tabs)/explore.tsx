// Màn hình Explore — Khám phá
// Placeholder cho các tính năng mở rộng

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ExploreCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

function ExploreCard({ icon, title, description, color }: ExploreCardProps) {
  const { colors } = useColorScheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const { colors } = useColorScheme();

  const features: ExploreCardProps[] = [
    {
      icon: 'bar-chart',
      title: 'Báo cáo',
      description: 'Xem thống kê chi tiết theo ngày, tuần, tháng',
      color: '#4A90E2',
    },
    {
      icon: 'people',
      title: 'Người dùng',
      description: 'Quản lý danh sách người dùng trong hệ thống',
      color: '#10B981',
    },
    {
      icon: 'document-text',
      title: 'Tài liệu',
      description: 'Lưu trữ và chia sẻ tài liệu nội bộ',
      color: '#F59E0B',
    },
    {
      icon: 'calendar',
      title: 'Lịch',
      description: 'Xem lịch làm việc và sự kiện sắp tới',
      color: '#8B5CF6',
    },
    {
      icon: 'chatbubbles',
      title: 'Tin nhắn',
      description: 'Chat nội bộ và thảo luận nhóm',
      color: '#EC4899',
    },
    {
      icon: 'analytics',
      title: 'Phân tích',
      description: 'Phân tích dữ liệu và xu hướng',
      color: '#14B8A6',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Khám phá</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Các tính năng nổi bật
        </Text>
      </View>

      {/* Danh sách tính năng */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {features.map((feature, index) => (
          <ExploreCard key={index} {...feature} />
        ))}
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
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 14,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 24,
  },
});
