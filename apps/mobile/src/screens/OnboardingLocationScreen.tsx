import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingLocationScreenProps {
  onNext: (zipCode: string) => void;
  onBack: () => void;
}

const OnboardingLocationScreen: React.FC<OnboardingLocationScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  const validateZipCode = (zip: string): boolean => {
    // US ZIP code validation (5 digits or 5+4 format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const formatZipCode = (text: string): string => {
    // Remove non-digits
    const digits = text.replace(/\D/g, '');
    
    // Limit to 9 digits max (5+4)
    const limitedDigits = digits.slice(0, 9);
    
    // Add dash after 5th digit if there are more digits
    if (limitedDigits.length > 5) {
      return limitedDigits.slice(0, 5) + '-' + limitedDigits.slice(5);
    }
    
    return limitedDigits;
  };

  const handleZipCodeChange = (text: string) => {
    const formattedZip = formatZipCode(text);
    setZipCode(formattedZip);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleNext = () => {
    if (!zipCode.trim()) {
      setError('ZIP code is required');
      return;
    }

    if (!validateZipCode(zipCode)) {
      setError('Please enter a valid ZIP code');
      return;
    }

    onNext(zipCode);
  };

  const isNextDisabled = !zipCode.trim() || !validateZipCode(zipCode);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
              <View style={[styles.progressSegment, styles.progressActive]} />
              <View style={[styles.progressSegment, styles.progressInactive]} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>What is your{'\n'}zipcode?</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Zipcode"
                placeholderTextColor="#999"
                value={zipCode}
                onChangeText={handleZipCodeChange}
                keyboardType="numeric"
                maxLength={10} // 5 digits + dash + 4 digits
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.description}>
              We use this to track weather and{'\n'}
              pollen levels, helping connect{'\n'}
              environmental factors to your{'\n'}
              child's health.
            </Text>

            {/* Next Button */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                isNextDisabled ? styles.nextButtonDisabled : null,
              ]}
              onPress={handleNext}
              disabled={isNextDisabled}
            >
              <View style={styles.nextButtonContent}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>C</Text>
                </View>
                <Text style={styles.nextButtonText}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
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
  progressInactive: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 34,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    paddingHorizontal: 24,
    fontSize: 18,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 60,
  },
  nextButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#7CB342',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingLocationScreen;
