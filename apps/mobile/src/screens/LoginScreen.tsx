import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { utils, colors } from "../styles/tw";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        // Navigation will happen automatically via auth state change
        // No need to call onLoginSuccess() - the AppNavigator will handle it
      } else {
        Alert.alert("Login Failed", error || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred");
    }
  };

  return (
    <SafeAreaView style={[utils.flex1, utils.bgWhite]} edges={["top"]}>
      <KeyboardAvoidingView
        style={utils.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[utils.px8, utils.py5, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={[utils.itemsCenter, utils.mb8, { marginBottom: 60 }]}>
            <Text
              style={[
                utils.textBlack,
                utils.mb2,
                { fontSize: 64, fontWeight: "300", letterSpacing: -1 },
              ]}
            >
              hewa
            </Text>
            <Text
              style={[utils.textGray500, { fontSize: 20, fontWeight: "400" }]}
            >
              Welcome
            </Text>
          </View>

          {/* Form */}
          <View style={[{ width: "100%", maxWidth: 400, alignSelf: "center" }]}>
            {/* Username Input */}
            <View
              style={[
                utils.flexRow,
                utils.itemsCenter,
                utils.py4,
                utils.mb6,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray200,
                  marginBottom: 30,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.gray400}
                style={[utils.mr4, { width: 20 }]}
              />
              <TextInput
                style={[utils.flex1, utils.textBase, utils.textGray800]}
                placeholder="Username"
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
            <View
              style={[
                utils.flexRow,
                utils.itemsCenter,
                utils.py4,
                utils.mb6,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray200,
                  marginBottom: 30,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.gray400}
                style={[utils.mr4, { width: 20 }]}
              />
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

            {/* Region Input */}
            <View
              style={[
                utils.flexRow,
                utils.itemsCenter,
                utils.py4,
                utils.mb6,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray200,
                  marginBottom: 30,
                },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={20}
                color={colors.gray400}
                style={[utils.mr4, { width: 20 }]}
              />
              <TextInput
                style={[utils.flex1, utils.textBase, utils.textGray800]}
                placeholder="Region"
                placeholderTextColor={colors.gray400}
                value={region}
                onChangeText={setRegion}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                utils.bgPrimary,
                utils.roundedFull,
                utils.py4,
                utils.itemsCenter,
                utils.mt6,
                utils.mb5,
                { paddingVertical: 18, marginTop: 30, marginBottom: 25 },
                isLoading && utils.bgGray300,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[utils.textWhite, utils.textLg, utils.fontSemibold]}>
                {isLoading ? "Logging In..." : "Log In"}
              </Text>
            </TouchableOpacity>

            {/* Forgot Links */}
            <View
              style={[
                utils.flexRow,
                utils.justifyBetween,
                utils.mb6,
                { marginBottom: 30 },
              ]}
            >
              <TouchableOpacity style={utils.flex1}>
                <Text
                  style={[
                    utils.textGray500,
                    utils.textSm,
                    { textAlign: "center" },
                  ]}
                >
                  Forget password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={utils.flex1}>
                <Text
                  style={[
                    utils.textGray500,
                    utils.textSm,
                    { textAlign: "center" },
                  ]}
                >
                  Forget username?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Program Code Button */}
            <TouchableOpacity
              style={[
                utils.border2,
                utils.borderPrimary,
                utils.roundedFull,
                utils.itemsCenter,
                utils.mb5,
                { paddingVertical: 15, marginBottom: 25 },
              ]}
            >
              <Text
                style={[utils.textPrimary, utils.textBase, utils.fontMedium]}
              >
                Log in with a program code
              </Text>
            </TouchableOpacity>

            {/* Create Account Button - Now part of main content */}
            <TouchableOpacity
              style={[
                utils.bgTransparent,
                utils.border2,
                utils.borderPrimary,
                utils.roundedFull,
                utils.py4,
                utils.itemsCenter,
                { paddingVertical: 15 },
              ]}
              onPress={onSwitchToRegister}
            >
              <Text
                style={[utils.textPrimary, utils.textBase, utils.fontSemibold]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
