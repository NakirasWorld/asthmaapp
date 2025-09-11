import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { utils, colors } from '../styles/tw';

interface OnboardingDailyLogTimeScreenProps {
  onNext: (data: { dailyLogRemindersEnabled: boolean; preferredDailyLogTime?: string }) => void;
  onBack: () => void;
}

const OnboardingDailyLogTimeScreen: React.FC<OnboardingDailyLogTimeScreenProps> = ({
  onNext,
  onBack,
}) => {
  const defaultTime = new Date();
  defaultTime.setHours(8, 0, 0, 0); // Default to 8:00 AM
  
  const [selectedTime, setSelectedTime] = useState<Date>(defaultTime);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleNext = () => {
    onNext({
      dailyLogRemindersEnabled: true,
      preferredDailyLogTime: formatTime(selectedTime),
    });
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
        <KeyboardAvoidingView 
          style={utils.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={[utils.px6, utils.pb6]}
            showsVerticalScrollIndicator={false}
            style={utils.flex1}
          >
            {/* Header */}
            <View style={[utils.py2, utils.pb5]}>
              <TouchableOpacity onPress={onBack} style={[utils.p2, { marginLeft: -8 }]}>
                <Ionicons name="arrow-back" size={24} color={colors.gray800} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={[utils.pb8]}>
              <View style={[
                utils.flexRow,
                { height: 8, backgroundColor: colors.gray200 },
                utils.rounded
              ]}>
                <View style={[
                  utils.flex1,
                  utils.rounded,
                  { marginHorizontal: 1, backgroundColor: colors.primary }
                ]} />
              </View>
            </View>

            {/* Main Content */}
            <View style={utils.flex1}>
              <Text style={[
                utils.text4xl,
                utils.fontSemibold,
                utils.textBlack,
                utils.mb6,
                { lineHeight: 40 }
              ]}>
                When do you want to receive daily log alert?
              </Text>

              <Text style={[
                utils.textBase,
                utils.textGray600,
                utils.mb8,
                { lineHeight: 22 }
              ]}>
                By logging daily symptoms, you'll be able to better understand how daily patterns affect your child's asthma and overall wellbeing.
              </Text>

              {/* Selected Time Display */}
              <View style={[
                utils.bgGray50,
                utils.rounded2xl,
                utils.p6,
                utils.mb6,
                utils.itemsCenter,
                { width: '100%' }
              ]}>
                <Text style={[
                  utils.text2xl,
                  utils.fontSemibold,
                  utils.textGray800,
                  utils.mb2
                ]}>
                  {formatTime(selectedTime)}
                </Text>
                <Text style={[utils.textSm, utils.textGray600]}>
                  Daily Log Reminder Time
                </Text>
              </View>

              {/* Time Picker Button */}
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
                  utils.mb6,
                  { minHeight: 60, width: '100%' }
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[utils.textLg, utils.textGray800, utils.fontMedium]}>
                  Select Reminder Time
                </Text>
                <Ionicons name="time-outline" size={24} color={colors.primary} />
              </TouchableOpacity>

              {/* Native Time Picker */}
              {showTimePicker && (
                <View style={utils.mb6}>
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                  />
                </View>
              )}

              {/* iOS Time Picker Controls */}
              {Platform.OS === 'ios' && showTimePicker && (
                <View style={[utils.flexRow, utils.justifyBetween, utils.mb6]}>
                  <TouchableOpacity
                    style={[
                      utils.px6,
                      utils.py3,
                      utils.rounded2xl,
                      utils.border,
                      { borderColor: colors.gray300 }
                    ]}
                    onPress={() => setShowTimePicker(false)}
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
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={[utils.textBase, utils.textWhite, utils.fontMedium]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Fixed Bottom Button */}
          <View style={[utils.px6, utils.pb6, utils.bgWhite]}>
            <TouchableOpacity
              style={[
                utils.bgPrimary,
                utils.roundedFull,
                utils.justifyCenter,
                utils.itemsCenter,
                utils.shadow,
                utils.elevation4,
                { width: '100%', height: 60 }
              ]}
              onPress={handleNext}
            >
              <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OnboardingDailyLogTimeScreen;
