import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { api } from '../services/api';
import { User } from '../types';

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        console.error('Failed to load user:', response.error);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.logout();
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              onLogout(); // Logout anyway
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome!</Text>
        {user && (
          <Text style={styles.subtitle}>
            Logged in as: {user.email}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎉 Login Successful!</Text>
          <Text style={styles.cardText}>
            Your simple login system is working perfectly. 
            This is where your main app content would go.
          </Text>
        </View>

        {user && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Details:</Text>
            <Text style={styles.detailText}>ID: {user.id}</Text>
            <Text style={styles.detailText}>Email: {user.email}</Text>
            <Text style={styles.detailText}>Role: {user.role}</Text>
            <Text style={styles.detailText}>
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

