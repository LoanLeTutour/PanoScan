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

        console.log('Stored User ID:', storedUserId);
        console.log('Stored Access Token:', storedAccessToken);
        console.log('Stored Refresh Token:', storedRefreshToken);
        
        if (storedUserId && storedRefreshToken) {
          const isTokenValid = await checkTokenValidity(storedRefreshToken);
          if (isTokenValid) {
            console.log('refresh Token valid !')
            setUserId(storedUserId);
            setRefreshToken(storedRefreshToken);
            const newAccessToken = await refreshAccessToken(storedRefreshToken);
              if (newAccessToken) {
                setAccessToken(newAccessToken);
                router.replace('/(tabs)/photo');
              } else {
                logout();
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
    console.log('verifying the validity of refresh token...')
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
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    
    try {
      console.log('Trying to login...');
      
      const response = await axios.post<AuthResponse>(`${backend_url()}token/`, { email, password });
  
      if (response.data.access && response.data.refresh) {
        console.log('Access and refresh tokens retrieved');
  
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
        console.log('Redirecting to photo page');
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false)
        return {success : false, message : 'Les tokens ne sont pas présents dans la response'}
      }
    } catch (err: any) {
      setLoading(false);
  
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          console.log('Invalid credentials');
          return { success: false, message: 'Email et/ou mot de passe incorrect' };
        }
        if (status === 404) {
          console.log('Email not found in database');
          return { success: false, message: "Cet email n'est pas associé à un compte PanoScan" };
        }
        console.log('Network or server error', err.message);
        return { success: false, message: 'Problème de réseau ou serveur' };
      } else {
        console.log('Unexpected error:', err);
        return { success: false, message: 'Erreur inattendue' };
      }
    }
  };
  // Logique de déconnexion
  const logout = async () => {
    
    setAccessToken(null);
    setRefreshToken(null);

    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    router.replace('/');
    setUserId(null);
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
