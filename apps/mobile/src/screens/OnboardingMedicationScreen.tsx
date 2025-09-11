import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingMedicationScreenProps {
  onNext: (data: {
    medicationRemindersEnabled: boolean;
    dailyMedicationDoses?: number;
  }) => void;
  onBack: () => void;
}

const OnboardingMedicationScreen: React.FC<OnboardingMedicationScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [medicationRemindersEnabled, setMedicationRemindersEnabled] = useState<boolean | null>(null);
  const [dailyDoses, setDailyDoses] = useState(1);

  const handleYesNoSelection = (enabled: boolean) => {
    setMedicationRemindersEnabled(enabled);
  };

  const incrementDoses = () => {
    if (dailyDoses < 10) {
      setDailyDoses(dailyDoses + 1);
    }
  };

  const decrementDoses = () => {
    if (dailyDoses > 1) {
      setDailyDoses(dailyDoses - 1);
    }
  };

  const handleNext = () => {
    if (medicationRemindersEnabled === null) return;

    const data = {
      medicationRemindersEnabled,
      ...(medicationRemindersEnabled && { dailyMedicationDoses: dailyDoses }),
    };

    onNext(data);
  };

  const isNextDisabled = medicationRemindersEnabled === null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, styles.progressCompleted]} />
            <View style={[styles.progressSegment, styles.progressCompleted]} />
            <View style={[styles.progressSegment, styles.progressCompleted]} />
            <View style={[styles.progressSegment, styles.progressActive]} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Do you need medication{'\n'}reminder?
          </Text>

          <Text style={styles.subtitle}>
            Keeping reminder all in the app.
          </Text>

          {/* YES/NO Selection */}
          <View style={styles.selectionContainer}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                medicationRemindersEnabled === false && styles.selectionButtonActive,
              ]}
              onPress={() => handleYesNoSelection(false)}
            >
              <Text
                style={[
                  styles.selectionText,
                  medicationRemindersEnabled === false && styles.selectionTextActive,
                ]}
              >
                NO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectionButton,
                medicationRemindersEnabled === true && styles.selectionButtonActive,
              ]}
              onPress={() => handleYesNoSelection(true)}
            >
              <Text
                style={[
                  styles.selectionText,
                  medicationRemindersEnabled === true && styles.selectionTextActive,
                ]}
              >
                YES
              </Text>
            </TouchableOpacity>
          </View>

          {/* Daily Doses Counter (only show if YES is selected) */}
          {medicationRemindersEnabled === true && (
            <View style={styles.dosesContainer}>
              <Text style={styles.dosesTitle}>
                How many daily doses of medication{'\n'}do they take?
              </Text>

              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    dailyDoses <= 1 && styles.counterButtonDisabled,
                  ]}
                  onPress={decrementDoses}
                  disabled={dailyDoses <= 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={dailyDoses <= 1 ? "#ccc" : "#666"} 
                  />
                </TouchableOpacity>

                <Text style={styles.counterValue}>{dailyDoses}</Text>

                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    styles.counterButtonAdd,
                    dailyDoses >= 10 && styles.counterButtonDisabled,
                  ]}
                  onPress={incrementDoses}
                  disabled={dailyDoses >= 10}
                >
                  <Ionicons 
                    name="add" 
                    size={20} 
                    color={dailyDoses >= 10 ? "#ccc" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextDisabled ? styles.nextButtonDisabled : null,
            ]}
            onPress={handleNext}
            disabled={isNextDisabled}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressContainer: {
    paddingBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  progressCompleted: {
    backgroundColor: '#7CB342',
  },
  progressActive: {
    backgroundColor: '#7CB342',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 60,
  },
  selectionContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 60,
  },
  selectionButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionButtonActive: {
    borderColor: '#7CB342',
    backgroundColor: '#f8fff8',
  },
  selectionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
  },
  selectionTextActive: {
    color: '#7CB342',
  },
  dosesContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  dosesTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  counterButtonAdd: {
    backgroundColor: '#7CB342',
    borderColor: '#7CB342',
  },
  counterButtonDisabled: {
    opacity: 0.5,
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#7CB342',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingMedicationScreen;
