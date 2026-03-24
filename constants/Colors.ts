// Bảng màu cho toàn bộ app — hỗ trợ light/dark mode

const tintColorLight = '#4A90E2';
const tintColorDark = '#64B5F6';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.08)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    primary: '#4A90E2',
    primaryLight: '#EBF4FF',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    background: '#0F1117',
    surface: '#1A1D26',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#2D3748',
    card: '#1E2231',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: '#34D399',
    warning: '#FBD38D',
    error: '#FC8181',
    primary: '#64B5F6',
    primaryLight: '#1E3A5F',
  },
};
