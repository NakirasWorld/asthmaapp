import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { utils, colors } from '../styles/tw';
import { useOnboardingStore } from '../store/onboardingStore';

interface OnboardingChildInfoScreenProps {
  onNext: (data: {
    childFirstName: string;
    childLastName: string;
    childSex: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  }) => void;
  onBack?: () => void;
}

export default function OnboardingChildInfoScreen({ onNext, onBack }: OnboardingChildInfoScreenProps) {
  const { data } = useOnboardingStore();
  
  const [childFirstName, setChildFirstName] = useState(data.childFirstName || '');
  const [childLastName, setChildLastName] = useState(data.childLastName || '');
  const [childSex, setChildSex] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'>(data.childSex || 'MALE');
  const [showSexPicker, setShowSexPicker] = useState(false);

  const handleNext = () => {
    if (!childFirstName.trim() || !childLastName.trim()) {
      Alert.alert('Required Fields', 'Please fill in all fields to continue');
      return;
    }

    // Pass the data to the parent component for navigation
    onNext({
      childFirstName: childFirstName.trim(),
      childLastName: childLastName.trim(),
      childSex,
    });
  };

  const getSexDisplayText = (sex: string) => {
    switch (sex) {
      case 'MALE': return 'Male';
      case 'FEMALE': return 'Female';
      case 'OTHER': return 'Other';
      case 'PREFER_NOT_TO_SAY': return 'Prefer not to say';
      default: return 'Select';
    }
  };

  const closePicker = () => {
    setShowSexPicker(false);
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      <TouchableWithoutFeedback onPress={closePicker}>
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
                    { height: '100%', width: '25%', backgroundColor: colors.primary },
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
                utils.mb4,
                { lineHeight: 34 }
              ]}>
                How should we refer to your child?
              </Text>
              <Text style={[
                utils.textBase,
                utils.textGray600,
                utils.mb8,
                { lineHeight: 22 }
              ]}>
                This helps us customize the app to benefit you most.
              </Text>

              {/* Form */}
              <View style={utils.mb8}>
                {/* First Name Input */}
                <View style={utils.mb4}>
                  <TextInput
                    style={[
                      utils.border,
                      utils.borderGray200,
                      utils.rounded2xl,
                      utils.px4,
                      utils.py3,
                      utils.textBase,
                      utils.textGray800,
                      utils.bgWhite,
                      { minHeight: 48 }
                    ]}
                    placeholder="First Name"
                    placeholderTextColor={colors.gray400}
                    value={childFirstName}
                    onChangeText={setChildFirstName}
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>

                {/* Last Name Input */}
                <View style={utils.mb4}>
                  <TextInput
                    style={[
                      utils.border,
                      utils.borderGray200,
                      utils.rounded2xl,
                      utils.px4,
                      utils.py3,
                      utils.textBase,
                      utils.textGray800,
                      utils.bgWhite,
                      { minHeight: 48 }
                    ]}
                    placeholder="Last Name"
                    placeholderTextColor={colors.gray400}
                    value={childLastName}
                    onChangeText={setChildLastName}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                  />
                </View>

                {/* Sex Picker */}
                <TouchableOpacity 
                  style={[
                    utils.flexRow,
                    utils.itemsCenter,
                    utils.justifyBetween,
                    utils.border,
                    utils.borderGray200,
                    utils.rounded2xl,
                    utils.px4,
                    utils.py3,
                    utils.bgWhite,
                    utils.mb4,
                    { minHeight: 48 }
                  ]}
                  onPress={() => {
                    closePicker();
                    setShowSexPicker(!showSexPicker);
                  }}
                >
                  <Text style={[
                    utils.textBase,
                    utils.textGray800
                  ]}>
                    {getSexDisplayText(childSex)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.gray400} />
                </TouchableOpacity>

                {showSexPicker && (
                  <TouchableWithoutFeedback>
                    <View style={[
                      utils.border,
                      utils.borderGray200,
                      utils.rounded2xl,
                      utils.bgWhite,
                      utils.mb4
                    ]}>
                      <Picker
                        selectedValue={childSex}
                        onValueChange={(itemValue) => {
                          setChildSex(itemValue);
                        }}
                        style={{ height: 150 }}
                      >
                        <Picker.Item label="Male" value="MALE" />
                        <Picker.Item label="Female" value="FEMALE" />
                        <Picker.Item label="Other" value="OTHER" />
                        <Picker.Item label="Prefer not to say" value="PREFER_NOT_TO_SAY" />
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>

              {/* Done Button */}
              <TouchableOpacity
                style={[
                  utils.rounded3xl,
                  utils.py4,
                  utils.itemsCenter,
                  { marginTop: 'auto' },
                  (childFirstName.trim() && childLastName.trim()) ? utils.bgPrimary : utils.bgGray300
                ]}
                onPress={handleNext}
                disabled={!childFirstName.trim() || !childLastName.trim()}
              >
                <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

