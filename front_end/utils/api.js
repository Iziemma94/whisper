import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.56.1/api', // for Android emulator; change if using Expo or physical device
});

export default api;

// Attach token to headers automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// 📥 Register user
export const signupUser = async (email, password1, password2) => {
    return api.post('signup/', {
      email,
      password1,
      password2
    });
  };
  
  // 🔐 Login user
  export const loginUser = async (email, password) => {
    return api.post('login/', {
      email,
      password
    });
  };