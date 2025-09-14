import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { utils, colors } from '../styles/tw';
import { useOnboardingStore } from '../store/onboardingStore';

interface OnboardingDateOfBirthScreenProps {
  onNext: (data: { childDateOfBirth: string }) => void;
  onBack?: () => void;
}

export default function OnboardingDateOfBirthScreen({ onNext, onBack }: OnboardingDateOfBirthScreenProps) {
  const { data } = useOnboardingStore();
  const currentYear = new Date().getFullYear();
  const defaultDate = new Date(currentYear - 10, 5, 15); // 10 years ago, June 15th
  
  // Initialize with stored date if available
  const initialDate = data.childDateOfBirth ? new Date(data.childDateOfBirth) : defaultDate;
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleNext = () => {
    // Validate date
    const today = new Date();
    
    if (selectedDate > today) {
      Alert.alert('Invalid Date', 'Date of birth cannot be in the future');
      return;
    }

    if (selectedDate < new Date(1900, 0, 1)) {
      Alert.alert('Invalid Date', 'Please enter a valid date of birth');
      return;
    }

    // Create ISO string for the selected date
    const dateOfBirth = selectedDate.toISOString();
    onNext({ childDateOfBirth: dateOfBirth });
  };

  const isValidDate = selectedDate !== null;

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      <KeyboardAvoidingView 
        style={utils.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[utils.px6, utils.py5]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button and progress */}
          <View style={[utils.flexRow, utils.itemsCenter, utils.mb8]}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={[utils.p2, utils.mr4]}>
                <Ionicons name="arrow-back" size={24} color={colors.gray800} />
              </TouchableOpacity>
            )}
            
            {/* Progress Bar */}
            <View style={utils.flex1}>
              <View style={[
                { height: 8, backgroundColor: colors.gray200 },
                utils.rounded,
                { overflow: 'hidden' }
              ]}>
                <View style={[
                  { height: '100%', width: '50%', backgroundColor: colors.primary },
                  utils.rounded
                ]} />
              </View>
            </View>
          </View>

            {/* Content */}
            <View style={utils.flex1}>
              <Text style={[
                utils.text4xl,
                utils.fontSemibold,
                utils.textBlack,
                utils.mb8,
                { lineHeight: 34 }
              ]}>
                When is your child's date of birth?
              </Text>

              {/* Selected Date Display */}
              <View style={[
                utils.bgGray50,
                utils.rounded2xl,
                utils.p6,
                utils.mb8,
                utils.itemsCenter
              ]}>
                <Text style={[
                  utils.text2xl,
                  utils.fontSemibold,
                  utils.textGray800,
                  utils.mb2
                ]}>
                  {formatDate(selectedDate)}
                </Text>
                <Text style={[utils.textSm, utils.textGray600]}>
                  Selected Date
                </Text>
              </View>

              {/* Date Picker Button */}
              <TouchableOpacity
                style={[
                  utils.flexRow,
                  utils.itemsCenter,
                  utils.justifyBetween,
                  utils.border,
                  utils.borderGray200,
                  utils.rounded2xl,
                  utils.px6,
                  utils.py4,
                  utils.bgWhite,
                  utils.mb8,
                  { minHeight: 60 }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[utils.textLg, utils.textGray800, utils.fontMedium]}>
                  Select Date of Birth
                </Text>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              </TouchableOpacity>

              {/* Native Date Picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}

              {Platform.OS === 'ios' && showDatePicker && (
                <View style={[utils.flexRow, utils.justifyBetween, utils.mb8]}>
                  <TouchableOpacity
                    style={[
                      utils.px6,
                      utils.py3,
                      utils.rounded2xl,
                      utils.border,
                      { borderColor: colors.gray300 }
                    ]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[utils.textBase, utils.textGray600]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      utils.px6,
                      utils.py3,
                      utils.rounded2xl,
                      utils.bgPrimary
                    ]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[utils.textBase, utils.textWhite, utils.fontMedium]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

            {/* Description */}
            <Text style={[
              utils.textBase,
              utils.textGray600,
              { textAlign: 'center', lineHeight: 22 },
              utils.mb5
            ]}>
              We'll use this information to deliver personalized insights into asthma control for your child's age.
            </Text>

            {/* Learn More Link */}
            <TouchableOpacity style={[{ alignSelf: 'center' }, utils.py2, utils.mb8]}>
              <Text style={[
                utils.textBase,
                utils.textGray400,
                { textDecorationLine: 'underline' }
              ]}>
                Learn More...
              </Text>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity
              style={[
                utils.rounded3xl,
                utils.py4,
                utils.itemsCenter,
                { marginTop: 'auto' },
                isValidDate ? utils.bgPrimary : utils.bgGray300
              ]}
              onPress={handleNext}
              disabled={!isValidDate}
            >
              <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

