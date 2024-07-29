import React, { createContext, useContext,useCallback, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '@/constants/backend_url';
import { useAuth } from './AuthContext';

export type Photo = {
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
  const { userId, accessToken, refreshAccessToken, refreshToken } = useAuth();

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Photo[]>(`${backend_url()}user/${userId}/photos/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPhotos(response.data);
      setError(null);
    } catch (er) {
      if (axios.isAxiosError(er) && er.response?.status === 401) {
        throw new Error('401');
      } else {
        console.error('Failed to fetch photos', er);
        setError('Failed to fetch photos');
      }
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken]);
  
  
  const handleFetchPhotos = useCallback(async () => {
    if (!userId || !accessToken) {
      console.error('User not authenticated');
      setError('User not authenticated');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await fetchPhotos();
    } catch (err: any) {
      if (err.message === '401') {
        try {
          if (refreshToken) {
            await refreshAccessToken(refreshToken);
          if (accessToken) {
            await fetchPhotos();
          } else {
            setError('Failed to refresh token');
          }
          } else {
            setError('No refresh token')
          }
          
        } catch (refreshError) {
          console.error('Failed to refresh token', refreshError);
          setError('Failed to refresh token');
        }
      } else {
        console.error('Failed to fetch photos', error);
        setError('Failed to fetch photos');
      }
    }
  }, [fetchPhotos, userId, accessToken, refreshAccessToken, refreshToken]);

  useEffect(() => {
    if (userId && accessToken) {
      handleFetchPhotos();
    }
  }, [userId, accessToken, handleFetchPhotos]);

  return (
    <PhotoContext.Provider value={{ photos, fetchPhotos: handleFetchPhotos, loading, error}}>
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
