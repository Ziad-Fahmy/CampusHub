import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with backend API...');
    
    // Real API call to your backend
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('Backend login response:', response.data);
    
    const { token } = response.data;
    
    // Store auth token
    await AsyncStorage.setItem('token', token);
    
    // Get user profile after login
    const profileResponse = await apiClient.get('/auth/profile');
    console.log('Profile response:', profileResponse.data);
    
    // Store user data
    await AsyncStorage.setItem('user', JSON.stringify(profileResponse.data));
    
    // Return in the format your Redux expects
    return {
      token,
      userId: profileResponse.data._id,
      email: profileResponse.data.email,
      name: profileResponse.data.name,
      role: profileResponse.data.role,
    };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    // IMPORTANT: Re-throw the error so the Redux slice can handle it as a rejected promise
    throw error.response ? error.response.data : error.message;
  }
};

// ... (rest of your auth.js file remains unchanged)
// Keep your existing functions unchanged
export const registerUser = async (registerData) => {
  try {
    return { success: true };
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
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