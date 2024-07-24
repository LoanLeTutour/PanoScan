// context/PhotoContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Photo {
  id: string;
  photo: string;
  result: object;
  uploaded_at: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (newPhoto: Photo) => void;
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhoto = (newPhoto: Photo) => {
    setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, setPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = (): PhotoContextType => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
