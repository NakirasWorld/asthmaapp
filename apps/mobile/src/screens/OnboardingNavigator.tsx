import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import OnboardingChildInfoScreen from "./OnboardingChildInfoScreen";
import OnboardingDateOfBirthScreen from "./OnboardingDateOfBirthScreen";
import OnboardingLocationScreen from "./OnboardingLocationScreen";
import OnboardingMedicationScreen from "./OnboardingMedicationScreen";
import OnboardingMedicationTimeScreen from "./OnboardingMedicationTimeScreen";
import OnboardingDailyLogTimeScreen from "./OnboardingDailyLogTimeScreen";
import OnboardingSuccessScreen from "./OnboardingSuccessScreen";
import {
  ChildInfoData,
  LocationData,
  MedicationData,
  NotificationData,
} from "../types";
import { api } from "../services/api";
import { useOnboardingStore } from "../store/onboardingStore";
import { useAuthStore } from "../store/authStore";

interface OnboardingNavigatorProps {
  onComplete: () => void;
  onLogout?: () => void;
}

type OnboardingStep =
  | "child_info"
  | "date_of_birth"
  | "location"
  | "medications"
  | "medication_time"
  | "daily_log_time"
  | "success";

export default function OnboardingNavigator({
  onComplete,
  onLogout,
}: OnboardingNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("child_info");
  const {
    updateChildInfo,
    updateDateOfBirth,
    updateLocation,
    updateMedication,
    updateMedicationTime,
    updateDailyLogTime,
    isStepComplete,
    isAllDataComplete,
    getCompleteData,
    getRegistrationData,
    isSubmitting,
    setSubmitting,
    setError,
    error,
    reset,
  } = useOnboardingStore();
  const { login } = useAuthStore(); // We'll use login after successful registration

  const handleChildInfoNext = (data: ChildInfoData) => {
    updateChildInfo(data);
    setCurrentStep("date_of_birth");
  };

  const handleDateOfBirthNext = (data: { childDateOfBirth: string }) => {
    updateDateOfBirth(data.childDateOfBirth);
    setCurrentStep("location");
  };

  const handleLocationNext = (zipCode: string) => {
    updateLocation(zipCode);
    setCurrentStep("medications");
  };

  const handleMedicationNext = (data: {
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
  }) => {
    updateMedication(data);

    // If medication reminders are enabled, go to time selection
    if (data.medicationRemindersEnabled) {
      setCurrentStep("medication_time");
    } else {
      // Skip medication time and go directly to daily log
      setCurrentStep("daily_log_time");
    }
  };

  const handleMedicationTimeNext = (time: string) => {
    updateMedicationTime(time);
    setCurrentStep("daily_log_time");
  };

  const handleDailyLogTimeNext = async (data: {
    dailyLogRemindersEnabled: boolean;
    preferredDailyLogTime?: string;
  }) => {
    updateDailyLogTime(data);

    // Now submit all onboarding data at once
    await submitCompleteOnboarding();
  };

  const submitCompleteOnboarding = async () => {
    if (!isAllDataComplete()) {
      setError("Please complete all required fields");
      return;
    }

    const completeData = getCompleteData();
    const registrationData = getRegistrationData();

    if (!completeData) {
      setError("Invalid onboarding data");
      return;
    }

    if (!registrationData) {
      setError("Invalid registration data");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Use the new combined registration + onboarding API
      const response = await api.registerWithOnboarding(
        registrationData,
        completeData
      );

      if (response.success && response.data) {
        // Update auth store with the new user
        await login(registrationData.email, registrationData.password);
        setCurrentStep("success");
        // Clear the onboarding data from storage since it's been submitted
        // We don't reset here to allow the success screen to access data if needed
      } else {
        setError(
          response.error || "Failed to complete registration and onboarding"
        );
        Alert.alert(
          "Registration Error",
          response.error ||
            "Failed to create account and complete onboarding. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error completing registration and onboarding:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      setError(errorMessage);
      Alert.alert(
        "Connection Error",
        "Unable to create account and complete onboarding. Please check your internet connection and try again.",
        [
          { text: "Retry", onPress: () => submitCompleteOnboarding() },
          { text: "Cancel" },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessNext = () => {
    // Clear onboarding data and complete
    reset();
    onComplete();
  };

  const handleLogout = () => {
    // Clear onboarding data on logout
    reset();
    if (onLogout) {
      onLogout();
    }
  };

  const handleBack = () => {
    const { data } = useOnboardingStore.getState();

    switch (currentStep) {
      case "date_of_birth":
        setCurrentStep("child_info");
        break;
      case "location":
        setCurrentStep("date_of_birth");
        break;
      case "medications":
        setCurrentStep("location");
        break;
      case "medication_time":
        setCurrentStep("medications");
        break;
      case "daily_log_time":
        // Check if we came from medication_time or directly from medications
        if (data.medicationRemindersEnabled) {
          setCurrentStep("medication_time");
        } else {
          setCurrentStep("medications");
        }
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "child_info":
        return (
          <OnboardingChildInfoScreen
            onNext={handleChildInfoNext}
            onBack={currentStep !== "child_info" ? handleBack : undefined}
          />
        );

      case "date_of_birth":
        return (
          <OnboardingDateOfBirthScreen
            onNext={handleDateOfBirthNext}
            onBack={handleBack}
          />
        );

      case "location":
        return (
          <OnboardingLocationScreen
            onNext={handleLocationNext}
            onBack={handleBack}
          />
        );

      case "medications":
        return (
          <OnboardingMedicationScreen
            onNext={handleMedicationNext}
            onBack={handleBack}
          />
        );

      case "medication_time":
        return (
          <OnboardingMedicationTimeScreen
            onNext={handleMedicationTimeNext}
            onBack={handleBack}
          />
        );

      case "daily_log_time":
        return (
          <OnboardingDailyLogTimeScreen
            onNext={handleDailyLogTimeNext}
            onBack={handleBack}
          />
        );

      case "success":
        return (
          <OnboardingSuccessScreen
            onNext={handleSuccessNext}
            onLogout={onLogout ? handleLogout : undefined}
          />
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderCurrentStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
