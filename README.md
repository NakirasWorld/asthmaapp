# Asthma Tracking App

A comprehensive, HIPAA-compliant healthcare application for tracking asthma symptoms and providing health metrics to users.

## 🏥 Overview

This application helps patients track their asthma symptoms, peak flow measurements, oxygen saturation levels, and rescue medication usage. It provides valuable insights and trends to help manage asthma effectively while maintaining the highest standards of data security and privacy.

## 🏗 Architecture

### Backend (`apps/api/`)
- **Express.js** with TypeScript
- **PostgreSQL** database with Prisma ORM
- **JWT** authentication
- **Zod** validation
- **Helmet** security headers
- **Docker** containerization

### Mobile App (`apps/mobile/`)
- **React Native** with **Expo** for cross-platform mobile development
- **TypeScript** for type safety
- **Native UI components** for optimal mobile experience
- **Zustand** for state management
- **Expo Secure Store** for encrypted storage
- **React Hook Form** with Zod validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Set up the Backend
```bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Set up the Mobile App
```bash
cd apps/mobile
npm install
npm start
```

### 4. Access the Application
- Mobile App: Expo development server (scan QR code with Expo Go app)
- Backend API: http://localhost:3001
- Database: localhost:5432

## 🔒 HIPAA Compliance

This application is designed with HIPAA compliance in mind:

### Administrative Safeguards
- Role-based access controls
- User authentication and authorization
- Audit logging and monitoring
- Incident response procedures

### Physical Safeguards
- Secure hosting environment
- Access controls and monitoring
- Workstation security

### Technical Safeguards
- Encryption in transit and at rest
- Access controls and audit logs
- Data integrity and backup
- Secure communication protocols

## 📊 Features

### Patient Features
- **Symptom Tracking**: Record daily asthma symptoms
- **Peak Flow Monitoring**: Track lung function measurements
- **SpO2 Tracking**: Monitor oxygen saturation levels
- **Medication Logging**: Record rescue inhaler usage
- **Health Metrics**: View trends and patterns
- **Data Export**: Download personal health data

### Healthcare Provider Features
- **Patient Overview**: View patient data and trends
- **Alert System**: Get notified of concerning patterns
- **Report Generation**: Create detailed health reports
- **Treatment Recommendations**: Suggest interventions

## 🛠 Development

### Project Structure
```
asthma-app/
├── apps/
│   ├── api/                 # Backend Express API
│   │   ├── src/            # Source code
│   │   ├── prisma/         # Database schema and migrations
│   │   └── dist/           # Compiled JavaScript
│   └── mobile/            # React Native mobile app
│       ├── src/            # Source code
│       └── public/         # Static assets
├── docker-compose.yml      # Database configuration
└── README.md              # This file
```

### Database Schema
- **Users**: Patient and admin accounts
- **AsthmaEntries**: Daily symptom and measurement records
- **Sessions**: Authentication and security
- **AuditLogs**: Compliance and monitoring

### API Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /entries` - Fetch asthma entries
- `POST /entries` - Create new entry
- `PUT /entries/:id` - Update entry
- `DELETE /entries/:id` - Delete entry

## 🧪 Testing

### Backend Testing
```bash
cd apps/api
npm test
```

### Frontend Testing
```bash
cd apps/frontend
npm test
```

### Integration Testing
```bash
# Start all services
docker-compose up -d
npm run dev:all
```

## 📱 Mobile Support

The frontend is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Offline capability (PWA ready)
- Mobile-optimized charts and visualizations
- Biometric authentication support

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/api/.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/asthma"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
```

#### Frontend (`apps/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_ENV="development"
```

## 📈 Monitoring & Analytics

- **Health Metrics**: Track improvement trends
- **Symptom Patterns**: Identify triggers and patterns
- **Medication Effectiveness**: Monitor rescue inhaler usage
- **Quality of Life**: Track overall health improvements

## 🚨 Security Considerations

- All data is encrypted in transit and at rest
- Regular security audits and penetration testing
- Secure coding practices and dependency management
- Incident response and breach notification procedures

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private healthcare application. Please follow all security and compliance guidelines when contributing.

## 📞 Support

For technical support or questions about HIPAA compliance, please contact the development team.

---

**⚠️ Important**: This application handles sensitive health data. Always follow HIPAA guidelines and security best practices. Never commit sensitive data to version control.
