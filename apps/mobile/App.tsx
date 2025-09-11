import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/authStore';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const { isLoading, checkAuthStatus } = useAuthStore();

  // Check for existing auth token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.log('Auth check failed on startup:', error);
        // Continue to welcome screen if auth check fails
      }
    };
    
    initializeAuth();
  }, []); // Only run once on app start

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🏥</Text>
            <Text style={styles.loadingText}>Asthma Tracker</Text>
          </View>
          <Text style={styles.loadingSubtext}>Loading your health dashboard...</Text>
          <View style={styles.loadingIndicator}>
            <View style={styles.loadingDot} />
            <View style={styles.loadingDot} />
            <View style={styles.loadingDot} />
          </View>
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7CB342',
    marginHorizontal: 4,
    opacity: 0.4,
  },
});