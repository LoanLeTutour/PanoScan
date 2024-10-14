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

  // Checker la validité du token refresh
  const checkRefreshTokenValidity = async (token: string): Promise<boolean> => {
    console.log('verifying the validity of refresh token...')
    try {
      const response = await api.post(`${backend_url()}token/verify/`, { token });
      if (response.status === 200){return true}
      else {throw Error}
      } catch (error) {
      console.log(error)
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
          throw Error
        }
      } catch (error) {
        console.error('Failed to refresh access token', error)
        return null;
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



  const loadAuthData = async () => { // Fonction qui récupère les données de l'asyncStorage à l'arrivée dans l'application
    try{
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      console.log('Stored User ID:', storedUserId);
      console.log('Stored Access Token:', storedAccessToken);
      console.log('Stored Refresh Token:', storedRefreshToken);

      if (!(storedUserId && storedRefreshToken)){ // En arrivant sur la page d'accueil, pas d'userId ou de refreshToken => logout()
        logout();
      }
      else{
        const isRefreshTokenValid = await checkRefreshTokenValidity(storedRefreshToken);
        if (!isRefreshTokenValid){ // Si le refreshToken est expiré, logout()
          logout()
        }
        else{ // Sinon, on rafraichit l'accessToken car sa durée de vie est de 5 minutes
          const newAccessToken = await refreshAccessToken(storedRefreshToken);
          if (!newAccessToken) { // Si il n'y a pas d'accessToken, le refreshToken s'est expiré entre le checkRefreshToken et le refreshAccessToken => logout()
            logout();
          }
          else {
          // Si l'accessToken est valide, on enregistre les données dans les états et l'utilisateur est connecté sur la page photo
            setAccessToken(newAccessToken);
            setRefreshToken(storedRefreshToken);
            setUserId(storedUserId);
            router.replace('/(tabs)/photo');
          }
        }
      }

    } catch(error) {
      console.error('Failed to load authentication data', error);
      logout()
    }finally{
      setLoading(false);
    }
    
  };
  // un effet se déclenche pour récupérer les keys asyncStorage à chaque connexion et les mettre à jour si besoin
  useEffect(() => {

    loadAuthData();
  }, []);


  

  
  // Logique de connexion
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      console.log('Entrée dans la fonction login de l"AuthContext');
      console.log(`appel API au : ${backend_url()}token/`)
      const response = await axios.post<AuthResponse>(`${backend_url()}token/`, { email, password });
      console.log(response)
      if (response.data.access && response.data.refresh && response.data.user_id) {
        console.log('Data retrieved !');
        const user_id_string = response.data.user_id.toString()
        // Stockage des données dans l'asyncStorage
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        await AsyncStorage.setItem('user_id', user_id_string)
        
        // Stockage des données dans les états
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        setUserId(user_id_string)

        // Redirection de l'utilisateur sur la page photo
        router.replace('(tabs)/photo');
        console.log('Redirecting to photo page');
        return { success: true, message: `Connexion réussie de l'utilisateur ID: ${userId}` };
        }
      else {
        return {success : false, message : "Les tokens ou l'userId ne sont pas présents dans la response"}
      }
    } catch (err: any) {
  
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        switch (status) {
          case 401:
            console.log('Invalid credentials');
            return { success: false, message: 'Email et/ou mot de passe incorrect' };
          case 404:
            console.log('Email not found in database');
            return { success: false, message: "Cet email n'est pas associé à un compte PanoScan" };
          default:
            console.log('Network or server error', err.message);
            return { success: false, message: 'Problème de réseau ou serveur' };
        }
      } else {
        console.log('Unexpected error:', err);
        return { success: false, message: 'Erreur inattendue' };
      }
    }finally{
      setLoading(false)
    }
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
