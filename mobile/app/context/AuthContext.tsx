import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import api from './ApiContext';
import { backend_url } from '@/constants/backend_url';

// Contexte d'authentification 

type AuthResponse = {
  access: string;
  refresh: string;
  user_id: string; 
};

type AuthContextType = {
  userId: string | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setLoading: (arg0: boolean) => void;
  setAccessToken: (token: string) => void;
  refreshAccessToken: (token: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter()

  // un effet est ajouté pour récupérer les key asyncStorage à chaque connexion et les mettre à jour si besoin
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


  // Checker la validité du token refresh
  const checkTokenValidity = async (token: string): Promise<boolean> => {
    try {
      const response = await api.post(`${backend_url()}token/verify/`, { token });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };
  // Rafraichir l'access token à l'aide du refresh token
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
  
  // Logique de connexion
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
  // Logique de déconnexion
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
    <AuthContext.Provider value={{ userId, loading, accessToken, refreshToken, setLoading, setAccessToken, refreshAccessToken, login, logout }}>
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
