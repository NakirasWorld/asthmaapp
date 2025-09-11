import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingChildInfoScreen from './OnboardingChildInfoScreen';
import OnboardingDateOfBirthScreen from './OnboardingDateOfBirthScreen';
import OnboardingLocationScreen from './OnboardingLocationScreen';
import OnboardingMedicationScreen from './OnboardingMedicationScreen';
import OnboardingMedicationTimeScreen from './OnboardingMedicationTimeScreen';
import OnboardingDailyLogTimeScreen from './OnboardingDailyLogTimeScreen';
import OnboardingSuccessScreen from './OnboardingSuccessScreen';
import { ChildInfoData, LocationData, MedicationData, NotificationData } from '../types';
import { api } from '../services/api';

interface OnboardingNavigatorProps {
  onComplete: () => void;
  onLogout?: () => void;
}

type OnboardingStep = 'child_info' | 'date_of_birth' | 'location' | 'medications' | 'medication_time' | 'daily_log_time' | 'success';

export default function OnboardingNavigator({ onComplete, onLogout }: OnboardingNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('child_info');
  const [onboardingData, setOnboardingData] = useState<Partial<{
    childInfo: ChildInfoData;
    dateOfBirth: { childDateOfBirth: string };
    location: LocationData;
    medication: MedicationData;
    medicationTime?: string;
    notification: NotificationData;
  }>>({});

  const handleChildInfoNext = (data: ChildInfoData) => {
    setOnboardingData(prev => ({ ...prev, childInfo: data }));
    setCurrentStep('date_of_birth');
  };

  const handleDateOfBirthNext = async (data: { childDateOfBirth: string }) => {
    setOnboardingData(prev => ({ ...prev, dateOfBirth: data }));
    
    // Now we have both child info and date of birth, submit to API
    const childInfoData = onboardingData.childInfo;
    if (childInfoData) {
      try {
        await api.submitChildInfo({
          ...childInfoData,
          childDateOfBirth: data.childDateOfBirth,
        });
        setCurrentStep('location');
      } catch (error) {
        console.error('Error submitting child info:', error);
        // Handle error - could show alert or retry
        setCurrentStep('location'); // Continue for now
      }
    }
  };

  const handleLocationNext = async (zipCode: string) => {
    const locationData: LocationData = { zipCode };
    setOnboardingData(prev => ({ ...prev, location: locationData }));
    
    try {
      await api.submitLocation(locationData);
      setCurrentStep('medications');
    } catch (error) {
      console.error('Error submitting location:', error);
      // Handle error - could show alert or retry
      setCurrentStep('medications'); // Continue for now
    }
  };

  const handleMedicationNext = async (data: {
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
  }) => {
    const medicationData: MedicationData = {
      medicationRemindersEnabled: data.medicationRemindersEnabled,
      dailyMedicationDoses: data.dailyMedicationDoses,
    };
    setOnboardingData(prev => ({ ...prev, medication: medicationData }));
    
    try {
      await api.submitMedications(medicationData);
      // If medication reminders are enabled, go to time selection
      if (data.medicationRemindersEnabled) {
        setCurrentStep('medication_time');
      } else {
        // Skip medication time and go directly to daily log
        setCurrentStep('daily_log_time');
      }
    } catch (error) {
      console.error('Error submitting medication data:', error);
      // Handle error - could show alert or retry
      if (data.medicationRemindersEnabled) {
        setCurrentStep('medication_time');
      } else {
        setCurrentStep('daily_log_time');
      }
    }
  };

  const handleMedicationTimeNext = (time: string) => {
    setOnboardingData(prev => ({ ...prev, medicationTime: time }));
    setCurrentStep('daily_log_time');
  };

  const handleDailyLogTimeNext = async (data: {
    dailyLogRemindersEnabled: boolean;
    preferredDailyLogTime?: string;
  }) => {
    const notificationData: NotificationData = {
      dailyLogRemindersEnabled: data.dailyLogRemindersEnabled,
      preferredDailyLogTime: data.preferredDailyLogTime,
    };
    setOnboardingData(prev => ({ ...prev, notification: notificationData }));
    
    try {
      await api.submitNotifications(notificationData);
      // Complete onboarding
      await api.completeOnboarding();
      setCurrentStep('success');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Handle error - could show alert or retry
      setCurrentStep('success'); // Continue for now
    }
  };

  const handleSuccessNext = () => {
    onComplete();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'date_of_birth':
        setCurrentStep('child_info');
        break;
      case 'location':
        setCurrentStep('date_of_birth');
        break;
      case 'medications':
        setCurrentStep('location');
        break;
      case 'medication_time':
        setCurrentStep('medications');
        break;
      case 'daily_log_time':
        // Check if we came from medication_time or directly from medications
        const medicationData = onboardingData.medication;
        if (medicationData?.medicationRemindersEnabled) {
          setCurrentStep('medication_time');
        } else {
          setCurrentStep('medications');
        }
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'child_info':
        return (
          <OnboardingChildInfoScreen
            onNext={handleChildInfoNext}
            onBack={currentStep !== 'child_info' ? handleBack : undefined}
          />
        );
      
      case 'date_of_birth':
        return (
          <OnboardingDateOfBirthScreen
            onNext={handleDateOfBirthNext}
            onBack={handleBack}
          />
        );
      
      case 'location':
        return (
          <OnboardingLocationScreen
            onNext={handleLocationNext}
            onBack={handleBack}
          />
        );
      
      case 'medications':
        return (
          <OnboardingMedicationScreen
            onNext={handleMedicationNext}
            onBack={handleBack}
          />
        );
      
      case 'medication_time':
        return (
          <OnboardingMedicationTimeScreen
            onNext={handleMedicationTimeNext}
            onBack={handleBack}
          />
        );
      
      case 'daily_log_time':
        return (
          <OnboardingDailyLogTimeScreen
            onNext={handleDailyLogTimeNext}
            onBack={handleBack}
          />
        );
      
      case 'success':
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

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
