// Component card menu trên màn hình Home
// Hiển thị icon, title, subtitle và điều hướng khi tap

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { MenuCardItem } from '@/types';

interface MenuCardProps {
  item: MenuCardItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();
  const { colors } = useColorScheme();

  function handlePress() {
    // Navigate đến tab tương ứng
    if (item.screen.startsWith('/(tabs)/')) {
      router.push(item.screen as never);
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Icon với background màu riêng */}
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      {/* Nội dung text */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.subtitle, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Mũi tên */}
      <View style={[styles.arrow, { backgroundColor: item.color + '15' }]}>
        <Text style={[styles.arrowText, { color: item.color }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 26,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
