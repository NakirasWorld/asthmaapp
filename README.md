# 🫁 Asthma Tracker App

A comprehensive React Native mobile application with Node.js backend for tracking and managing childhood asthma symptoms, medications, and daily health logs.

## 🌟 Features

### 📱 Mobile App (React Native + Expo)
- **User Authentication**: Secure login/register with JWT
- **Comprehensive Onboarding**: Child info, date of birth, location, medications, reminders
- **Native Date/Time Pickers**: iOS and Android optimized time selection
- **Medication Tracking**: Set up medication reminders and schedules
- **Daily Log Reminders**: Customizable daily symptom logging alerts
- **Success Flow**: Completion screens with logout functionality
- **Modern UI**: Utility-based styling system (Tailwind-like)
- **Responsive Design**: Works across different screen sizes

### 🖥️ Backend API (Node.js + PostgreSQL)
- **RESTful API**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based secure authentication
- **Data Validation**: Zod schema validation
- **Health Data Management**: Secure storage of child health information
- **CORS Support**: Cross-origin resource sharing configured

## 🛠️ Tech Stack

### Mobile App
- **React Native** with Expo SDK 53+
- **TypeScript** for type safety
- **Zustand** for state management
- **React Navigation** for routing
- **AsyncStorage** for local data persistence
- **Native Date/Time Pickers** for better UX

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for input validation

### Development Tools
- **Docker** for containerized development
- **ESLint** and **Prettier** for code quality
- **Git** version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Expo CLI: `npm install -g @expo/cli`
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/NakirasWorld/asthmaapp.git
cd asthmaapp
```

### 2. Start the Backend API
```bash
cd apps/api
npm install
docker-compose up -d  # Start PostgreSQL
npx prisma migrate dev  # Run database migrations
npm run dev  # Start API server on port 3001
```

### 3. Start the Mobile App
```bash
cd apps/mobile
npm install --legacy-peer-deps  # Install dependencies
npx expo start --clear  # Start Expo development server
```

### 4. Run on Device/Simulator
- **iOS**: Press `i` in terminal or scan QR code with Camera app
- **Android**: Press `a` in terminal or scan QR code with Expo Go app

## 📁 Project Structure

```
asthmaapp/
├── apps/
│   ├── api/                 # Node.js Backend
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── lib/         # Utilities (auth, validation)
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── index.ts     # Server entry point
│   │   ├── prisma/          # Database schema & migrations
│   │   └── package.json
│   │
│   └── mobile/              # React Native App
│       ├── src/
│       │   ├── screens/     # App screens
│       │   ├── navigation/  # Navigation setup
│       │   ├── services/    # API client
│       │   ├── store/       # State management
│       │   ├── styles/      # Utility styling system
│       │   └── types/       # TypeScript types
│       └── package.json
│
├── docker-compose.yml       # PostgreSQL container
├── restart-dev.sh          # Development restart script
└── README.md
```

## 🔧 Development Scripts

### Backend (apps/api)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npx prisma studio  # Database GUI
```

### Mobile (apps/mobile)
```bash
npx expo start --clear     # Start with cache clear
npx expo start --tunnel    # Start with tunnel (for testing)
npx expo build:ios        # Build for iOS
npx expo build:android    # Build for Android
```

### Root Directory
```bash
./restart-dev.sh    # Restart both API and mobile servers
```

## 📱 App Flow

1. **Authentication**: Login or Register
2. **Onboarding**:
   - Child Information (name, sex)
   - Date of Birth (native date picker)
   - Location (zip code)
   - Medication Setup
   - Medication Time (native time picker)
   - Daily Log Reminder Time (native time picker)
   - Success Screen with logout option
3. **Main App**: Health tracking dashboard

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation with Zod schemas
- CORS protection
- Secure API endpoints
- Data encryption in transit

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Onboarding
- `POST /api/onboarding/child-info` - Submit child information
- `POST /api/onboarding/location` - Submit location data
- `POST /api/onboarding/medications` - Submit medication preferences
- `POST /api/onboarding/notifications` - Submit notification preferences
- `POST /api/onboarding/complete` - Complete onboarding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**NakirasWorld**
- GitHub: [@NakirasWorld](https://github.com/NakirasWorld)
- Repository: [asthmaapp](https://github.com/NakirasWorld/asthmaapp)

## 🆘 Support

If you encounter any issues or have questions:
1. Check existing [Issues](https://github.com/NakirasWorld/asthmaapp/issues)
2. Create a new issue with detailed description
3. Include device/platform information and error logs

---

**Built with ❤️ for better childhood asthma management**