import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend_url } from '@/constants/backend_url';

interface AuthResponse {
  access: string;
  refresh: string;
}

const login = async (email: string, password: string): Promise<any> => {
  try{
  console.log('login entrée')
  const baseUrl = backend_url()
  const loginUrl = `${baseUrl}token/`
  console.log('Sending request to:', loginUrl);
  const response = await axios.post<AuthResponse>(loginUrl, {
    email,
    password,
  });
  console.log('Response:', response.data);
  if (response.data.access) {
    await AsyncStorage.setItem('accessToken', response.data.access);
    await AsyncStorage.setItem('refreshToken', response.data.refresh);
  }
  return response.data;
} catch(err) {
  if (axios.isAxiosError(err)) {
    console.log('Axios error details:', err.toJSON());
    console.log('Error response:', err.response);
    console.log('Error request:', err.request);
    console.log('Error message:', err.message);
  } else {
    console.log('Unexpected error:', err);
  }
}}

const refreshToken = async (): Promise<string> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (refreshToken) {
    const response = await axios.post<{ access: string }>(backend_url() + 'token/refresh/', {
      refresh: refreshToken,
    });
    if (response.data.access) {
      await AsyncStorage.setItem('accessToken', response.data.access);
    }
    return response.data.access;
  } else {
    throw new Error('No refresh token found');
  }
};

const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};

export default {
  login,
  refreshToken,
  logout,
};