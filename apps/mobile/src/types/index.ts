// Simple types for basic login functionality
export interface User {
  id: string;
  email: string;
  role: string;
  onboardingCompleted: boolean;
  currentOnboardingStep?: string;
  createdAt: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  hipaaNoticeAcknowledged: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Onboarding Types
export interface ChildInfoData {
  childFirstName: string;
  childLastName: string;
  childSex: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
}

export interface LocationData {
  zipCode: string;
}

export interface MedicationData {
  medicationRemindersEnabled: boolean;
  dailyMedicationDoses?: number;
  preferredMedicationTime?: string;
}

export interface NotificationData {
  dailyLogRemindersEnabled: boolean;
  preferredDailyLogTime?: string;
}

export interface OnboardingData extends ChildInfoData, LocationData, MedicationData, NotificationData {
  childDateOfBirth: string;
}