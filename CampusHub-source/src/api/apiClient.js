import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Determine the API URL based on the environment
let API_URL;

// For development on a physical device, use your machine's IP
// For Android emulator, use '10.0.2.2'
// For iOS simulator, 'localhost' or '127.0.0.1' usually works
// For production, you'd use your deployed backend URL

if (__DEV__) { // __DEV__ is a global variable in React Native, true in development
  // You might want to use an environment variable here, or a more sophisticated check
  // For now, let's use your current IP for physical device testing
  API_URL = 'http://192.168.1.138:5000/api'; 
  // If you were testing on an Android emulator, you might use:
  // API_URL = 'http://10.0.2.2:5000/api';
  // If you were testing on an iOS simulator, you might use:
  // API_URL = 'http://localhost:5000/api';
} else {
  // This would be your production API URL
  API_URL = 'https://your-production-backend.com/api'; // REPLACE WITH YOUR PRODUCTION URL
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
} );

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && token !== 'demo-token') {
      config.headers['x-auth-token'] = token; // Backend expects this header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('API Client Error:', error.message);
    
    // Don't clear tokens on network errors, only on auth errors
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;