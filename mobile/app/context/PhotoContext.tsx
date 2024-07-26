import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '@/constants/backend_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type Photo = {
  id: number;
  LocalUri: string;
  active: boolean;
  photo: string;
  result: object;
  uploaded_at: string;
  user: number;
};

type PhotoContextType = {
  photos: Photo[];
  fetchPhotos: () => void;
  loading: boolean;
  error: string | null;
};


const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, accessToken } = useAuth();

  const fetchPhotos = async () => {
    if (!userId || !accessToken) {
      console.error('UserId:', userId);
      console.error('AccessToken:', accessToken);
      console.error('User not authenticated');
      setError('User not authenticated')
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Photo[]>(`${backend_url()}user/${userId}/photos/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPhotos(response.data);
    } catch (er) {
      console.error('Failed to fetch photos', er);
      setError('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && accessToken) {
      fetchPhotos();
    }
  }, [userId]);

  return (
    <PhotoContext.Provider value={{ photos, fetchPhotos, loading, error}}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
