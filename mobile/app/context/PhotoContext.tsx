import React, { createContext, useContext,useCallback, ReactNode, useEffect, useState } from 'react';

import { useAuth } from './AuthContext';

export type PhotoUserType = {
  id: number;
  LocalUri: string;
  active: boolean;
  photo_url: string;
  result: object;
  uploaded_at: string;
  user: number;
};

type PhotoContextType = {
  photos: PhotoUserType[];
  fetchPhotos: () => void;
  error: string | null;
};


const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<PhotoUserType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userId, accessToken, refreshToken, setLoading, api } = useAuth();




  const loadPhotosUser = async () => {
    try{
      setLoading(true)
      const response = await api.get<PhotoUserType[]>(`user/${userId}/photos/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPhotos(response.data)
    }catch(err: any){

    }finally{
      setLoading(false)
    }
  }
  const fetchPhotos = useCallback(async () => {
    setError(null)
    try {
      const response = await api.get<PhotoUserType[]>(`user/${userId}/photos/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPhotos(response.data);
    } catch (er:any) {
      console.error("error fetching photos: ", er)

    } finally {
    }
  }, [userId]);
  
  
  const handleFetchPhotos = useCallback(async () => {
    if (!userId || !accessToken || !refreshToken) {
      console.error('User not authenticated');
      setError('User not authenticated');
      return;
    }
      await fetchPhotos();
  }, [fetchPhotos, userId]);

  useEffect(() => {
    if (userId && accessToken) {
      handleFetchPhotos();
    }
  }, [userId, handleFetchPhotos]);

  return (
    <PhotoContext.Provider value={{ photos, fetchPhotos: handleFetchPhotos, error}}>
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
