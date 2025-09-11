// Temporary script to clear all authentication data
import { api } from './src/services/api.js';

async function clearAuth() {
  try {
    await api.clearAllAuthData();
    console.log('Authentication data cleared successfully!');
    console.log('Please restart the app to see changes.');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

clearAuth();
