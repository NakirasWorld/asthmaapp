# Asthma Tracker - React Native Mobile App

A HIPAA-compliant mobile application for tracking asthma symptoms and providing health insights to patients.

## 🏥 Healthcare Features

- **HIPAA Compliance**: Secure data handling with encrypted storage
- **Symptom Tracking**: Record asthma symptoms, peak flow, SpO2, and rescue medication usage
- **Health Metrics**: Visualize trends and patterns in asthma data
- **Native Security**: Biometric authentication and secure token storage
- **Offline Support**: Continue tracking even without internet connection

## 📱 Technology Stack

### Mobile Framework
- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety and better developer experience
- **Expo Router** for navigation and deep linking

### State Management & Data
- **Zustand** for lightweight state management
- **React Query** for server state management and caching
- **React Hook Form** with Zod validation for forms

### Security & Storage
- **Expo Secure Store** for encrypted token storage
- **Expo Local Authentication** for biometric login
- **JWT** authentication with automatic refresh

### UI & Styling
- **React Native** built-in components
- **Custom healthcare-optimized styling**
- **Accessible design** following platform guidelines

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio
- Backend API running on port 3001

### Installation

1. Install dependencies:
```bash
cd apps/mobile
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on simulator/device:
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── forms/          # Form components
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   └── HomeScreen.tsx
├── services/           # API and external services
│   └── api.ts          # API client
├── store/              # Zustand state stores
│   └── authStore.ts    # Authentication state
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔒 Security Features

### Data Protection
- **Expo Secure Store**: Encrypted token storage using device keychain
- **HTTPS Communication**: All API calls use secure protocols
- **Input Validation**: Client-side validation with Zod schemas
- **Automatic Token Refresh**: Seamless authentication renewal

### Privacy Compliance
- **HIPAA Compliant**: Designed for healthcare data protection
- **No Third-Party Analytics**: Patient privacy first
- **Local Data Encryption**: Sensitive data encrypted on device
- **Secure Session Management**: Automatic logout on inactivity

### Authentication Security
- **JWT Tokens**: Secure authentication with short-lived access tokens
- **Biometric Login**: Face ID, Touch ID, and fingerprint support
- **Secure Token Storage**: Tokens stored in device secure enclave
- **Session Timeout**: Automatic logout for security

## 📊 Features

### Current Features
- ✅ **Secure Login**: Email/password authentication with test credentials
- ✅ **User Dashboard**: Welcome screen with user information
- ✅ **Secure Storage**: Encrypted token management
- ✅ **Auto-Authentication**: Persistent login state
- ✅ **Error Handling**: User-friendly error messages

### Planned Features
- 📝 **Symptom Entry**: Add daily asthma symptoms and measurements
- 📈 **Health Charts**: Visual trends and patterns
- 💊 **Medication Tracking**: Record rescue inhaler usage
- 🔔 **Reminders**: Medication and measurement reminders
- 📱 **Biometric Login**: Face ID and Touch ID support
- 🌙 **Dark Mode**: Eye-friendly interface
- 📴 **Offline Mode**: Continue tracking without internet

## 🧪 Testing

### Test Credentials
- **Email**: test@example.com
- **Password**: password123

### Testing on Device
1. Install Expo Go app on your device
2. Scan QR code from `npm start`
3. App will load with test login screen

### Testing Authentication
1. Use test credentials or create new account
2. Verify secure token storage
3. Test logout and re-authentication
4. Verify API connectivity with backend

## 🔧 Configuration

### Environment Setup
The app automatically detects development vs production:
- **Development**: API at `http://localhost:3001`
- **Production**: Configure your production API URL

### Backend Integration
The mobile app connects to the same Express.js backend:
- Shared authentication system
- Same database and user accounts
- Consistent API responses

## 📱 Platform Support

### iOS
- iOS 13.0+
- iPhone and iPad support
- Native iOS design patterns
- Face ID and Touch ID integration

### Android
- Android 6.0+ (API level 23)
- Material Design components
- Fingerprint authentication
- Adaptive icons

## 🚀 Deployment

### Development Build
```bash
eas build --profile development
```

### Production Build
```bash
eas build --profile production
```

### App Store Submission
1. Build production version
2. Configure app store metadata
3. Submit for review following healthcare app guidelines

## 🤝 Contributing

This is a healthcare application handling sensitive patient data. Please follow:

1. **Security Guidelines**: Never log sensitive data
2. **HIPAA Compliance**: Follow healthcare data protection standards
3. **Code Quality**: Use TypeScript and proper error handling
4. **Testing**: Test all authentication and data flows

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**⚠️ Important**: This application handles sensitive health data. Always follow HIPAA guidelines and security best practices. Never commit sensitive data or API keys to version control.
