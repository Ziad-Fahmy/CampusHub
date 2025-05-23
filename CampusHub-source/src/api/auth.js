import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const loginUser = async (email, password) => {
  try {
    // For demo purposes, simulate a successful login
    // In a real app, you would use apiClient.post('/auth/login', { email, password })
    const response = {
      data: {
        token: 'demo-token',
        userId: '1',
        email: email,
        name: 'Demo User',
        role: 'student',
      }
    };
    
    const { token, userId, email: userEmail, name, role } = response.data;
    
    // Store auth data
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify({ 
      id: userId, 
      email: userEmail,
      name,
      role 
    }));
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const registerUser = async (registerData) => {
  try {
    // Simulate register API call
    return { success: true };
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    // Simulate forgot password API call
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    throw error;
  }
};
