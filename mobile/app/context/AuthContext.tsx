import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './ApiContext';
import axios from 'axios';
import { backend_url } from '@/constants/backend_url';
import { useRouter } from 'expo-router';

type AuthResponse = {
  access: string;
  refresh: string;
  user_id: string; 
};

type AuthContextType = {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  refreshAccessToken: (token: string) => Promise<string | null>;
  setUser: (userId: string, token: string) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const loadAuthData = async () => {
      try{
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedAccessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (storedUserId && storedRefreshToken) {
          const isTokenValid = await checkTokenValidity(storedRefreshToken);
          if (isTokenValid) {
            setUserId(storedUserId);
            setRefreshToken(storedRefreshToken);
            if (!storedAccessToken) {
              const newAccessToken = await refreshAccessToken(storedRefreshToken);
              if (newAccessToken) {
                setAccessToken(newAccessToken);
                router.replace('/(tabs)/photo');
              } else {
                logout();
              }
            } else {
              setAccessToken(storedAccessToken);
              router.replace('/(tabs)/photo');
            }

          } else {
            logout()
          }
      }

      } catch(error) {
        console.error('Failed to load authentication data', error);
      }
      
    };

    loadAuthData();
  }, []);

  const setUser = (userId: string, token: string) => {
    AsyncStorage.setItem('userId', userId);
    AsyncStorage.setItem('accessToken', token);
    setUserId(userId);
    setAccessToken(token);
  };

  const checkTokenValidity = async (token: string): Promise<boolean> => {
    try {
      const response = await api.post(`${backend_url()}token/verify/`, { token });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  const refreshAccessToken = async (token: string): Promise<string | null> => {
    try {
      const response = await api.post(`${backend_url()}token/refresh/`, { refresh: token });
      if (response.data && response.data.access) {
        await AsyncStorage.setItem('accessToken', response.data.access);
        setAccessToken(response.data.access);
        return response.data.access;
      }else {
        console.error('No access token in the response')
        return null
      }
    } catch (error) {
      console.error('Failed to refresh access token', error)
      return null;
    }
  };
  

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await api.post<AuthResponse>(`${backend_url()}token/`, {
        email,
        password,
      });
      if (response.data.access) {
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);

        const userId = response.data.user_id;
      if (userId) {
        await AsyncStorage.setItem('userId', userId.toString());
        setUserId(userId.toString());
      } else {
        console.error('UserId not found in response');
      }
        router.replace('(tabs)/photo'); 
        // Assuming you have a way to get userId from the response or a subsequent request
        // setUserId(response.data.userId);
      }
      return response.data;
    } catch (err:any) {
      if (axios.isAxiosError(err)) {
        console.log('Axios error details:', err.toJSON());
        console.log('Error response:', err.response);
        console.log('Error request:', err.request);
        console.log('Error message:', err.message);
      } else {
        console.log('Unexpected error:', err);
      }
    }
  };

  const logout = async () => {
    setUserId(null);
    setAccessToken(null);
    setRefreshToken(null);

    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    router.replace('(auth)/index');
  };

  return (
    <AuthContext.Provider value={{ userId, accessToken, refreshToken,setAccessToken, refreshAccessToken,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
