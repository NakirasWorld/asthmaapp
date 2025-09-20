import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";

// Import screens - we'll create wrapper components that handle the props
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabNavigator from "./MainTabNavigator";
import OnboardingNavigator from "../screens/OnboardingNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Wrapper components that handle the props using the auth store
const LoginScreenWrapper = ({ navigation }: any) => {
  return (
    <LoginScreen
      onLoginSuccess={() => {
        // Navigation will happen automatically via auth state change
      }}
      onSwitchToRegister={() => {
        navigation.navigate("Register");
      }}
    />
  );
};

const RegisterScreenWrapper = ({ navigation }: any) => {
  return (
    <RegisterScreen
      onStartOnboarding={() => {
        // Navigate to onboarding instead of waiting for auth state change
        navigation.navigate("Onboarding");
      }}
      onSwitchToLogin={() => {
        navigation.navigate("Login");
      }}
    />
  );
};

const MainTabNavigatorWrapper = () => {
  const { logout } = useAuthStore();

  return <MainTabNavigator />;
};

const OnboardingScreenWrapper = () => {
  const { user, refreshUserProfile, logout } = useAuthStore();

  const handleOnboardingComplete = async () => {
    // Refresh user data to get updated onboarding status
    await refreshUserProfile();
  };

  return (
    <OnboardingNavigator
      onComplete={handleOnboardingComplete}
      onLogout={logout}
    />
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Determine initial route based on auth status and onboarding completion
  const getInitialRoute = () => {
    if (!isAuthenticated) return "Login";
    if (user && !user.onboardingCompleted) return "Onboarding";
    return "Main";
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7CB342",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {isAuthenticated ? (
          // Authenticated screens
          <>
            {user && !user.onboardingCompleted ? (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreenWrapper}
                options={{
                  title: "Welcome",
                  headerShown: false,
                  gestureEnabled: false, // Prevent swiping back
                }}
              />
            ) : (
              <Stack.Screen
                name="Main"
                component={MainTabNavigatorWrapper}
                options={{
                  title: "Asthma Tracker",
                  headerShown: false, // Hide header since tabs have their own navigation
                }}
              />
            )}
          </>
        ) : (
          // Authentication screens (including onboarding for non-authenticated users)
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreenWrapper}
              options={{
                title: "Welcome Back",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreenWrapper}
              options={{
                title: "Create Account",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreenWrapper}
              options={{
                title: "Welcome",
                headerShown: false,
                gestureEnabled: false, // Prevent swiping back
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
