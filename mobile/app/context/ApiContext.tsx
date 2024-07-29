// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend_url } from '@/constants/backend_url';

// Axios instance
const api = axios.create({
  baseURL: backend_url(),
});

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];
let failedQueuePromise: Promise<void> | null = null;

const refreshAccessToken = async (token: string): Promise<string | null> => {
  try {
    const response = await axios.post(`${backend_url()}token/refresh/`, { refresh: token });
    if (response.data.access) {
      await AsyncStorage.setItem('accessToken', response.data.access);
      return response.data.access;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
  return null;
};

api.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const newAccessToken = await refreshAccessToken(refreshToken!);

        if (newAccessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          failedQueue.forEach(callback => callback(newAccessToken));
          failedQueue = [];
          isRefreshing = false;

          return api(originalRequest);
        } else {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          window.location.href = '/auth/index';
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push((token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
