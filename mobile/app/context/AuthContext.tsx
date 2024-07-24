import React, { createContext, useContext, useState, ReactNode } from 'react';
import authService from '../services/authService';
import { useRouter } from "expo-router";
import {jwtDecode} from 'jwt-decode';
import { useEffect } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  userId: any;
  setUserId: React.Dispatch<any>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const user_connection = await authService.login(email, password);
    const decoded: { user_id: number } = jwtDecode(user_connection.access);
    console.log(decoded)
    setUserId(decoded.user_id);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("(tabs)/photo");
      console.log(userId); // `userId` should now have the correct value
    }
  }, [isAuthenticated, userId, router]);

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserId(0);
    router.replace('(auth)/')
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, setUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};