import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { ApiResponse, AuthResponse, LoginForm, RegisterForm } from "../types";

// Dynamic API URL that automatically adapts to your changing IP
const getApiBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:3001/api";
  }

  // For mobile development, use Expo's automatic IP detection
  if (__DEV__) {
    // Get the debugger host from Expo Constants - this is your machine's current IP
    const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

    if (debuggerHost) {
      console.log(`🌐 Using dynamic IP from Expo: ${debuggerHost}`);
      return `http://${debuggerHost}:3001/api`;
    }

    // Fallback for different platforms
    if (Platform.OS === "ios") {
      // iOS Simulator can use localhost
      return "http://localhost:3001/api";
    }

    if (Platform.OS === "android") {
      // Android emulator uses special IP to reach host machine
      return "http://10.0.2.2:3001/api";
    }
  }

  return "http://localhost:3001/api";
};

// Simple storage utility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

class SimpleApiClient {
  private token: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await storage.getItem("auth_token");
    } catch (error) {
      console.error("Error loading token:", error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    // Get fresh API URL for each request to handle IP changes
    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 10000)
    );

    try {
      console.log(`Making request to: ${url} (attempt ${retryCount + 1})`);
      const response = await Promise.race([fetch(url, config), timeoutPromise]);
      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Request failed",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Request failed (attempt ${retryCount + 1}):`, error);

      // Retry once if it's a network error and we haven't retried yet
      if (
        retryCount === 0 &&
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("fetch"))
      ) {
        console.log("🔄 Retrying request with fresh IP...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        return this.request(endpoint, options, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async login(credentials: LoginForm): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.token = response.data.tokens.accessToken;
      try {
        await storage.setItem("auth_token", response.data.tokens.accessToken);
        await storage.setItem(
          "refresh_token",
          response.data.tokens.refreshToken
        );
      } catch (error) {
        console.error("Error saving tokens:", error);
      }
    }

    return response;
  }

  async register(userData: RegisterForm): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        role: "PATIENT",
      }),
    });

    if (response.success && response.data) {
      this.token = response.data.tokens.accessToken;
      try {
        await storage.setItem("auth_token", response.data.tokens.accessToken);
        await storage.setItem(
          "refresh_token",
          response.data.tokens.refreshToken
        );
      } catch (error) {
        console.error("Error saving tokens:", error);
      }
    }

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    try {
      await storage.removeItem("auth_token");
      await storage.removeItem("refresh_token");
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  }

  // Clear all local authentication data (for testing purposes)
  async clearAllAuthData(): Promise<void> {
    this.token = null;
    try {
      // Clear API tokens
      await storage.removeItem("auth_token");
      await storage.removeItem("refresh_token");

      // Clear Zustand auth store
      await storage.removeItem("auth-storage");

      console.log("✅ All authentication data cleared!");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.token) {
      try {
        this.token = await storage.getItem("auth_token");
      } catch (error) {
        return false;
      }
    }
    return !!this.token;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>("/auth/me");
  }

  // Onboarding API methods
  async submitChildInfo(data: {
    childFirstName: string;
    childLastName: string;
    childSex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
    childDateOfBirth?: string;
  }): Promise<ApiResponse<{ nextStep: string }>> {
    // Add a default date of birth if not provided (we'll collect this in a future screen)
    const dataWithDefaults = {
      ...data,
      childDateOfBirth: data.childDateOfBirth || new Date().toISOString(),
    };

    return this.request<{ nextStep: string }>(
      "/profile/onboarding/child-info",
      {
        method: "POST",
        body: JSON.stringify(dataWithDefaults),
      }
    );
  }

  async submitLocation(data: {
    zipCode: string;
  }): Promise<ApiResponse<{ nextStep: string }>> {
    return this.request<{ nextStep: string }>("/profile/onboarding/location", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async submitMedications(data: {
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
    preferredMedicationTime?: string;
  }): Promise<ApiResponse<{ nextStep: string }>> {
    return this.request<{ nextStep: string }>(
      "/profile/onboarding/medications",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async submitNotifications(data: {
    dailyLogRemindersEnabled: boolean;
    preferredDailyLogTime?: string;
  }): Promise<ApiResponse<{ onboardingCompleted: boolean }>> {
    return this.request<{ onboardingCompleted: boolean }>(
      "/profile/onboarding/notifications",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async getOnboardingStatus(): Promise<
    ApiResponse<{
      onboardingCompleted: boolean;
      currentStep?: string;
      steps: Array<{
        stepName: string;
        completed: boolean;
        completedAt?: string;
      }>;
    }>
  > {
    return this.request<{
      onboardingCompleted: boolean;
      currentStep?: string;
      steps: Array<{
        stepName: string;
        completed: boolean;
        completedAt?: string;
      }>;
    }>("/profile/onboarding/status");
  }

  async getUserProfile(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>("/profile");
  }

  async completeOnboarding(): Promise<
    ApiResponse<{ onboardingCompleted: boolean }>
  > {
    return this.request<{ onboardingCompleted: boolean }>(
      "/profile/onboarding/complete",
      {
        method: "POST",
      }
    );
  }

  // Submit complete onboarding data in one request
  async submitCompleteOnboarding(data: {
    childFirstName: string;
    childLastName: string;
    childSex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
    childDateOfBirth: string;
    zipCode: string;
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
    preferredMedicationTime?: string;
    dailyLogRemindersEnabled: boolean;
    preferredDailyLogTime?: string;
  }): Promise<ApiResponse<{ onboardingCompleted: boolean }>> {
    return this.request<{ onboardingCompleted: boolean }>(
      "/profile/onboarding/complete",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  // Register user and complete onboarding in one request
  async registerWithOnboarding(
    registrationData: {
      email: string;
      password: string;
      confirmPassword: string;
      termsAccepted: boolean;
      hipaaNoticeAcknowledged: boolean;
    },
    onboardingData: {
      childFirstName: string;
      childLastName: string;
      childSex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
      childDateOfBirth: string;
      zipCode: string;
      medicationRemindersEnabled: boolean;
      dailyMedicationDoses?: number;
      preferredMedicationTime?: string;
      dailyLogRemindersEnabled: boolean;
      preferredDailyLogTime?: string;
    }
  ): Promise<ApiResponse<AuthResponse>> {
    // First register the user
    const registerResponse = await this.register(registrationData);

    if (!registerResponse.success || !registerResponse.data) {
      return registerResponse;
    }

    // Store the token for the onboarding request
    this.token = registerResponse.data.tokens.accessToken;

    try {
      await storage.setItem(
        "auth_token",
        registerResponse.data.tokens.accessToken
      );
      await storage.setItem(
        "refresh_token",
        registerResponse.data.tokens.refreshToken
      );
    } catch (error) {
      console.error("Error saving tokens:", error);
    }

    // Now complete onboarding
    const onboardingResponse = await this.submitCompleteOnboarding(
      onboardingData
    );

    if (!onboardingResponse.success) {
      // If onboarding fails, we should probably log out the user
      await this.logout();
      return {
        success: false,
        error: onboardingResponse.error || "Failed to complete onboarding",
      };
    }

    // Return the registration response with updated user data
    return registerResponse;
  }
}

export const api = new SimpleApiClient();
