// Hook lấy color scheme hiện tại (light/dark)
// Wrapper đơn giản quanh useColorScheme của React Native

import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export function useColorScheme() {
  const scheme = useRNColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return { scheme, colors, isDark: scheme === 'dark' };
}
