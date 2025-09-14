import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  hipaaNoticeAcknowledged: boolean;
}

export interface OnboardingData {
  // Child Information
  childFirstName: string;
  childLastName: string;
  childSex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  childDateOfBirth: string;

  // Location Information
  zipCode: string;

  // Medication Information
  medicationRemindersEnabled: boolean;
  dailyMedicationDoses?: number;
  preferredMedicationTime?: string;

  // Daily Log Information
  dailyLogRemindersEnabled: boolean;
  preferredDailyLogTime?: string;
}

interface OnboardingStore {
  // Registration Data
  registrationData: Partial<RegistrationData>;

  // Onboarding Data
  data: Partial<OnboardingData>;
  isComplete: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setRegistrationData: (data: RegistrationData) => void;

  updateChildInfo: (data: {
    childFirstName: string;
    childLastName: string;
    childSex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  }) => void;

  updateDateOfBirth: (childDateOfBirth: string) => void;

  updateLocation: (zipCode: string) => void;

  updateMedication: (data: {
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
  }) => void;

  updateMedicationTime: (preferredMedicationTime: string) => void;

  updateDailyLogTime: (data: {
    dailyLogRemindersEnabled: boolean;
    preferredDailyLogTime?: string;
  }) => void;

  // Validation
  isStepComplete: (
    step:
      | "child_info"
      | "date_of_birth"
      | "location"
      | "medications"
      | "medication_time"
      | "daily_log_time"
  ) => boolean;
  isAllDataComplete: () => boolean;

  // Submission
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setComplete: (complete: boolean) => void;

  // Reset
  reset: () => void;

  // Get complete data for submission
  getCompleteData: () => OnboardingData | null;
  getRegistrationData: () => RegistrationData | null;
}

const initialRegistrationData: Partial<RegistrationData> = {
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
  hipaaNoticeAcknowledged: false,
};

const initialData: Partial<OnboardingData> = {
  childFirstName: "",
  childLastName: "",
  childSex: "MALE",
  childDateOfBirth: "",
  zipCode: "",
  medicationRemindersEnabled: false,
  dailyMedicationDoses: undefined,
  preferredMedicationTime: undefined,
  dailyLogRemindersEnabled: true,
  preferredDailyLogTime: undefined,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      registrationData: initialRegistrationData,
      data: initialData,
      isComplete: false,
      isSubmitting: false,
      error: null,

      // Update actions
      setRegistrationData: (registrationData) => {
        set({ registrationData, error: null });
      },

      updateChildInfo: (childInfo) => {
        set((state) => ({
          data: { ...state.data, ...childInfo },
          error: null,
        }));
      },

      updateDateOfBirth: (childDateOfBirth) => {
        set((state) => ({
          data: { ...state.data, childDateOfBirth },
          error: null,
        }));
      },

      updateLocation: (zipCode) => {
        set((state) => ({
          data: { ...state.data, zipCode },
          error: null,
        }));
      },

      updateMedication: (medicationData) => {
        set((state) => ({
          data: { ...state.data, ...medicationData },
          error: null,
        }));
      },

      updateMedicationTime: (preferredMedicationTime) => {
        set((state) => ({
          data: { ...state.data, preferredMedicationTime },
          error: null,
        }));
      },

      updateDailyLogTime: (dailyLogData) => {
        set((state) => ({
          data: { ...state.data, ...dailyLogData },
          error: null,
        }));
      },

      // Validation methods
      isStepComplete: (step) => {
        const { data } = get();

        switch (step) {
          case "child_info":
            return !!(
              data.childFirstName?.trim() &&
              data.childLastName?.trim() &&
              data.childSex
            );

          case "date_of_birth":
            return !!data.childDateOfBirth;

          case "location":
            return !!data.zipCode?.trim();

          case "medications":
            return data.medicationRemindersEnabled !== undefined;

          case "medication_time":
            // Only required if medication reminders are enabled
            return (
              !data.medicationRemindersEnabled || !!data.preferredMedicationTime
            );

          case "daily_log_time":
            return data.dailyLogRemindersEnabled !== undefined;

          default:
            return false;
        }
      },

      isAllDataComplete: () => {
        const store = get();
        return (
          store.isStepComplete("child_info") &&
          store.isStepComplete("date_of_birth") &&
          store.isStepComplete("location") &&
          store.isStepComplete("medications") &&
          store.isStepComplete("medication_time") &&
          store.isStepComplete("daily_log_time")
        );
      },

      // State management
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setError: (error) => set({ error }),
      setComplete: (isComplete) => set({ isComplete }),

      // Reset store
      reset: () => {
        set({
          registrationData: initialRegistrationData,
          data: initialData,
          isComplete: false,
          isSubmitting: false,
          error: null,
        });
      },

      // Get complete data for API submission
      getCompleteData: () => {
        const { data, isAllDataComplete } = get();

        if (!isAllDataComplete()) {
          return null;
        }

        // Ensure all required fields are present
        if (
          !data.childFirstName ||
          !data.childLastName ||
          !data.childSex ||
          !data.childDateOfBirth ||
          !data.zipCode ||
          data.medicationRemindersEnabled === undefined ||
          data.dailyLogRemindersEnabled === undefined
        ) {
          return null;
        }

        const completeData: OnboardingData = {
          childFirstName: data.childFirstName,
          childLastName: data.childLastName,
          childSex: data.childSex,
          childDateOfBirth: data.childDateOfBirth,
          zipCode: data.zipCode,
          medicationRemindersEnabled: data.medicationRemindersEnabled,
          dailyLogRemindersEnabled: data.dailyLogRemindersEnabled,
        };

        // Add optional fields if present
        if (data.dailyMedicationDoses !== undefined) {
          completeData.dailyMedicationDoses = data.dailyMedicationDoses;
        }

        if (data.preferredMedicationTime) {
          completeData.preferredMedicationTime = data.preferredMedicationTime;
        }

        if (data.preferredDailyLogTime) {
          completeData.preferredDailyLogTime = data.preferredDailyLogTime;
        }

        return completeData;
      },

      // Get registration data for API submission
      getRegistrationData: () => {
        const { registrationData } = get();

        if (
          !registrationData.email ||
          !registrationData.password ||
          !registrationData.confirmPassword ||
          !registrationData.termsAccepted ||
          !registrationData.hipaaNoticeAcknowledged
        ) {
          return null;
        }

        return registrationData as RegistrationData;
      },
    }),
    {
      name: "onboarding-storage",
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
