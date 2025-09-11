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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { utils, colors } from '../styles/tw';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onSwitchToLogin }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hipaaNoticeAcknowledged, setHipaaNoticeAcknowledged] = useState(false);
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Check password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      Alert.alert('Error', 'Password must contain uppercase, lowercase, and number');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    if (!hipaaNoticeAcknowledged) {
      Alert.alert('Error', 'Please acknowledge the HIPAA notice');
      return;
    }

    try {
      const success = await register(email, password, confirmPassword, termsAccepted, hipaaNoticeAcknowledged);
      
      if (success) {
        // Navigation will happen automatically via auth state change
      } else {
        Alert.alert('Registration Failed', error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={['top']}>
      <KeyboardAvoidingView 
        style={utils.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[utils.px8, utils.py5]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={[utils.itemsCenter, utils.mb8]}>
            <Text style={[
              utils.textBlack,
              utils.mb2,
              { fontSize: 64, fontWeight: '300', letterSpacing: -1 }
            ]}>
              hewa
            </Text>
            <Text style={[
              utils.textGray500,
              { fontSize: 20, fontWeight: '400' }
            ]}>
              Create Account
            </Text>
          </View>

          {/* Form */}
          <View style={[{ width: '100%', maxWidth: 400, alignSelf: 'center' }]}>
            
            {/* Email Input */}
            <View style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.py4,
              utils.mb6,
              { borderBottomWidth: 1, borderBottomColor: colors.gray200, marginBottom: 25 }
            ]}>
              <Ionicons name="mail-outline" size={20} color={colors.gray400} style={[utils.mr4, { width: 20 }]} />
              <TextInput
                style={[utils.flex1, utils.textBase, utils.textGray800]}
                placeholder="Email"
                placeholderTextColor={colors.gray400}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            {/* Password Input */}
            <View style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.py4,
              utils.mb6,
              { borderBottomWidth: 1, borderBottomColor: colors.gray200, marginBottom: 25 }
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.gray400} style={[utils.mr4, { width: 20 }]} />
              <TextInput
                style={[utils.flex1, utils.textBase, utils.textGray800]}
                placeholder="Password"
                placeholderTextColor={colors.gray400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                textContentType="oneTimeCode"
                autoComplete="off"
                spellCheck={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={utils.p1}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.gray400}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={[
              utils.flexRow,
              utils.itemsCenter,
              utils.py4,
              utils.mb6,
              { borderBottomWidth: 1, borderBottomColor: colors.gray200, marginBottom: 25 }
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.gray400} style={[utils.mr4, { width: 20 }]} />
              <TextInput
                style={[utils.flex1, utils.textBase, utils.textGray800]}
                placeholder="Confirm Password"
                placeholderTextColor={colors.gray400}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                textContentType="oneTimeCode"
                autoComplete="off"
                spellCheck={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={utils.p1}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.gray400}
                />
              </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            <View style={[
              utils.bgGray50,
              utils.p4,
              utils.rounded2xl,
              utils.mb6,
              utils.border,
              { borderColor: colors.gray200, marginBottom: 25 }
            ]}>
              <Text style={[utils.textSm, utils.fontSemibold, utils.textGray600, utils.mb2]}>
                Password Requirements:
              </Text>
              <Text style={[utils.textXs, utils.textGray600, utils.mb1, utils.px2]}>
                • At least 8 characters
              </Text>
              <Text style={[utils.textXs, utils.textGray600, utils.mb1, utils.px2]}>
                • Contains uppercase letter (A-Z)
              </Text>
              <Text style={[utils.textXs, utils.textGray600, utils.mb1, utils.px2]}>
                • Contains lowercase letter (a-z)
              </Text>
              <Text style={[utils.textXs, utils.textGray600, utils.px2]}>
                • Contains number (0-9)
              </Text>
            </View>

            {/* Terms and HIPAA Checkboxes */}
            <View style={[utils.mb4]}>
              <TouchableOpacity
                style={[utils.flexRow, utils.itemsStart, utils.mb4]}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <View style={[
                  { width: 20, height: 20 },
                  utils.border2,
                  utils.rounded,
                  utils.mr3,
                  utils.itemsCenter,
                  utils.justifyCenter,
                  utils.bgWhite,
                  termsAccepted ? [utils.bgPrimary, { borderColor: colors.primary }] : { borderColor: colors.gray300 }
                ]}>
                  {termsAccepted && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
                <Text style={[utils.flex1, utils.textSm, utils.textGray800, { lineHeight: 20 }]}>
                  I accept the Terms and Conditions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[utils.flexRow, utils.itemsStart]}
                onPress={() => setHipaaNoticeAcknowledged(!hipaaNoticeAcknowledged)}
              >
                <View style={[
                  { width: 20, height: 20 },
                  utils.border2,
                  utils.rounded,
                  utils.mr3,
                  utils.itemsCenter,
                  utils.justifyCenter,
                  utils.bgWhite,
                  hipaaNoticeAcknowledged ? [utils.bgPrimary, { borderColor: colors.primary }] : { borderColor: colors.gray300 }
                ]}>
                  {hipaaNoticeAcknowledged && <Ionicons name="checkmark" size={14} color={colors.white} />}
                </View>
                <Text style={[utils.flex1, utils.textSm, utils.textGray800, { lineHeight: 20 }]}>
                  I acknowledge the HIPAA Privacy Notice
                </Text>
              </TouchableOpacity>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[
                utils.bgPrimary,
                utils.roundedFull,
                utils.py4,
                utils.itemsCenter,
                utils.mt4,
                utils.mb5,
                { paddingVertical: 18 },
                isLoading && utils.bgGray300
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
        
        {/* Bottom Button - Outside ScrollView to stay at bottom */}
        <View style={[utils.px8, utils.py5, utils.bgWhite, { paddingTop: 10 }]}>
          <TouchableOpacity
            style={[utils.itemsCenter, utils.py3]}
            onPress={onSwitchToLogin}
          >
            <Text style={[utils.textGray500, utils.textBase]}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
