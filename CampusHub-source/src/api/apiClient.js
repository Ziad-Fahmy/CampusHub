import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine the API URL based on the environment
let API_URL;

if (__DEV__) {
  // Local dev - Android emulator should use 10.0.2.2
  API_URL = 'http://10.0.2.2:5000/api';
} else {
  // Production URL (replace with real one when deployed)
  API_URL = 'https://your-production-backend.com/api';
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5-second timeout
});

// ✅ Request interceptor — add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && token !== 'demo-token') {
        config.headers['x-auth-token'] = token;
      }
    } catch (err) {
      console.warn('Failed to attach token:', err);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor — log and handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.msg || error.message;

    console.error(`API Client Error [${status}]:`, message);

    if (status === 401) {
      console.warn('Token invalid or expired. Clearing local storage.');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Optional: Redirect to login screen if needed
    }

    return Promise.reject(error);
  }
);

export default apiClient;
