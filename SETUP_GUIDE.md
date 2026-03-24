# Setup Guide — MyApp (React Native Expo + Firebase Push Notification)

## Bước 1: Cài đặt Node.js và Expo CLI

```bash
# Cài Node.js 18+ từ https://nodejs.org
# Cài Expo CLI
npm install -g expo-cli eas-cli
```

## Bước 2: Clone/copy project và cài dependencies

```bash
cd MyApp
npm install
```

## Bước 3: Cài đặt packages cần thiết (nếu chưa có)

```bash
npx expo install expo-notifications expo-device expo-constants
npx expo install @react-native-async-storage/async-storage
npx expo install nanoid
```

## Bước 4: Cấu hình Firebase

### 4.1 Tạo Firebase Project
1. Vào [https://console.firebase.google.com](https://console.firebase.google.com)
2. Tạo project mới
3. Bật **Cloud Messaging** trong project settings

### 4.2 Android
1. Thêm Android app với package: `com.yourcompany.myapp`
2. Download `google-services.json`
3. Copy vào thư mục root của project (thay file placeholder hiện tại)

### 4.3 iOS
1. Thêm iOS app với Bundle ID: `com.yourcompany.myapp`
2. Download `GoogleService-Info.plist`
3. Copy vào thư mục root của project

### 4.4 APNs Key (cho iOS push notification)
1. Vào Firebase Console → Project Settings → Cloud Messaging
2. Upload APNs Authentication Key từ Apple Developer Portal

## Bước 5: Chạy app

```bash
# Development server
npx expo start

# Chạy trên Android emulator
npx expo start --android

# Chạy trên iOS simulator (macOS only)
npx expo start --ios
```

> ⚠️ **Lưu ý**: Push notification KHÔNG hoạt động trên simulator/emulator.
> Cần thiết bị thật để test FCM.

## Bước 6: Build với EAS (để test push notification thực tế)

```bash
# Cài EAS CLI
npm install -g eas-cli

# Đăng nhập Expo account
eas login

# Cấu hình EAS
eas build:configure

# Build development client (để test trên thiết bị)
eas build --profile development --platform android
# hoặc
eas build --profile development --platform ios
```

## Bước 7: Test Push Notification

### Cách 1: Expo Push Tool
1. Mở app trên thiết bị thật
2. Copy Expo Push Token từ màn hình Settings
3. Vào [https://expo.dev/notifications](https://expo.dev/notifications)
4. Paste token và gửi test notification

### Cách 2: cURL
```bash
curl -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[xxxxxx]",
    "title": "Test Notification",
    "body": "Đây là thông báo test",
    "data": { "screen": "notifications", "id": "123" }
  }' \
  https://exp.host/--/api/v2/push/send
```

### Cách 3: Nút test trong app
- Vào tab **Thông báo** → tap icon gửi (góc phải header) để gửi local notification

### Cách 4: Firebase Console
1. Firebase Console → Cloud Messaging → New campaign
2. Notification → Enter title và body
3. Target → Paste FCM Token từ màn hình Settings
4. Send test message

## Cấu trúc thư mục

```
MyApp/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigation config
│   │   ├── index.tsx         # Home screen
│   │   ├── explore.tsx       # Explore screen
│   │   ├── notifications.tsx # Notifications list
│   │   └── settings.tsx      # Settings
│   ├── _layout.tsx           # Root layout + deep link handler
│   └── notification-detail.tsx
├── components/
│   ├── HomeHeader.tsx
│   ├── MenuCard.tsx
│   └── NotificationItem.tsx
├── hooks/
│   ├── useNotifications.ts   # Main notification hook
│   └── useColorScheme.ts
├── services/
│   └── notificationService.ts # FCM logic
├── constants/
│   ├── Colors.ts
│   └── Config.ts
├── types/
│   └── index.ts
├── app.json                  # Expo config + FCM setup
├── google-services.json      # Firebase Android (THAY BẰNG FILE THẬT)
└── package.json
```

## Troubleshooting

### "Not a physical device" error
→ Chạy trên thiết bị thật, không phải emulator

### Token không lấy được
→ Kiểm tra EAS Project ID trong app.json (cần EAS account)

### Notification không hiện trên iOS
→ Kiểm tra APNs key đã upload trong Firebase Console chưa

### Android notification không có sound
→ Kiểm tra notification channel đã được tạo (xem `setupAndroidNotificationChannel` trong notificationService.ts)
