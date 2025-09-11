import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { utils, colors } from '../styles/tw';

interface OnboardingSuccessScreenProps {
  onNext: () => void;
  onLogout?: () => void;
}

const OnboardingSuccessScreen: React.FC<OnboardingSuccessScreenProps> = ({
  onNext,
  onLogout,
}) => {
  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      <View style={[utils.flex1, utils.px6, utils.justifyCenter, utils.itemsCenter]}>
        
        {/* Decorative Leaves */}
        <View style={[utils.absolute, { top: 60, right: 40 }]}>
          <Ionicons name="leaf" size={32} color={colors.green500} style={{ transform: [{ rotate: '15deg' }] }} />
        </View>
        
        <View style={[utils.absolute, { top: 120, left: 60 }]}>
          <Ionicons name="leaf" size={24} color={colors.green400} style={{ transform: [{ rotate: '-30deg' }] }} />
        </View>
        
        <View style={[utils.absolute, { top: 280, right: 80 }]}>
          <Ionicons name="leaf" size={28} color={colors.green500} style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        
        <View style={[utils.absolute, { bottom: 300, left: 40 }]}>
          <Ionicons name="leaf" size={20} color={colors.green400} style={{ transform: [{ rotate: '-15deg' }] }} />
        </View>
        
        <View style={[utils.absolute, { bottom: 200, right: 50 }]}>
          <Ionicons name="leaf" size={36} color={colors.green600} style={{ transform: [{ rotate: '60deg' }] }} />
        </View>
        
        <View style={[utils.absolute, { bottom: 400, left: 80 }]}>
          <Ionicons name="leaf" size={16} color={colors.green300} style={{ transform: [{ rotate: '-45deg' }] }} />
        </View>

        {/* Main Content */}
        <View style={[utils.itemsCenter, utils.mb12]}>
          <Text style={[
            utils.text4xl,
            utils.fontBold,
            utils.textBlack,
            utils.mb4,
            { textAlign: 'center', lineHeight: 40 }
          ]}>
            Setup complete!
          </Text>

          <Text style={[
            utils.textLg,
            utils.fontMedium,
            utils.textGray800,
            utils.mb3,
            { textAlign: 'center' }
          ]}>
            Your information is saved and{'\n'}reminders are set
          </Text>

          <Text style={[
            utils.textBase,
            utils.textGray500,
            { textAlign: 'center', lineHeight: 22 }
          ]}>
            Information is secure and protected with us{'\n'}every step of the way.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={[utils.wFull, { gap: 16 }]}>
          {/* Next Button */}
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
            onPress={onNext}
          >
            <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
              Next
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          {onLogout && (
            <TouchableOpacity
              style={[
                utils.border,
                utils.borderGray300,
                utils.roundedFull,
                utils.justifyCenter,
                utils.itemsCenter,
                utils.bgWhite,
                { width: '100%', height: 50 }
              ]}
              onPress={onLogout}
            >
              <Text style={[utils.textGray700, utils.textBase, utils.fontMedium]}>
                Logout
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSuccessScreen;
