import React, { useEffect } from "react";
import { useState } from "react";
import { View, FlatList, Alert } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import axios from "axios";
import { backend_url } from "@/constants/backend_url";
import * as FileSystem from 'expo-file-system';
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as MediaLibrary from 'expo-media-library';
import { usePhotos, Photo } from "../context/PhotoContext";

const Page = () => {
  const {userId} = useAuth()
  const { photos, setPhotos } = usePhotos();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log(refreshToken)
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }
        const response = await axios.post(`${backend_url()}token/refresh/`, {
            refresh: refreshToken,
        });
        const { access, refresh } = response.data;
        await AsyncStorage.setItem('accessToken', access);
        await AsyncStorage.setItem('refreshToken', refresh);
        return access;
    } catch (error:any) {
        console.error('Failed to refresh token', error);
        if (error.response && error.response.status === 401){
          console.log('refresh token expired')
          router.replace('(auth)/index')
        }
    }
};

const downloadPhotos = async (photos: any[]): Promise<Photo[]> => {
  try {
    const promises = photos.map(async (photo) => {
      const photoUri = photo.photo.slice(7)
      const completePhotoUrl = `${backend_url()}${photoUri}`;
      const fileName = photo.photo.split('/').pop(); // Extraire le nom de fichier de l'URL
      console.log(FileSystem.documentDirectory)
      console.log(fileName)
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      console.log('Downloading:', photo.photo, 'to', fileUri);
      const { uri } = await FileSystem.downloadAsync(completePhotoUrl, fileUri);
      console.log('Downloaded to:', uri);
        return {...photo, LocalUri: uri.startsWith('file://') ? uri : `file://${uri}`};
    });
    const updatedPhotos = await Promise.all(promises);
    return updatedPhotos.filter(Boolean) as Photo[];
  } catch (error) {
    console.error('Failed to download photos', error);
    return [];
  }
};

const fetchPhotos = async () => {
  const {accessPrivileges} = await MediaLibrary.requestPermissionsAsync();
  if (accessPrivileges === 'none'){
    Alert.alert("L'accès à la librairie est nécessaire") 
    return;
  }
  if (userId && userId !== 0) {
    const accessToken = await refreshAccessToken()
    console.log(accessToken)
    if (accessToken) {
      try {
        const response = await axios.get(backend_url() + `user/${userId}/photos/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        console.log(response.data);
        const downloadedPhotos = await downloadPhotos(response.data);
          if (downloadedPhotos) {
            setPhotos(downloadedPhotos); // Ici, on est sûr que downloadedPhotos est un tableau de Photo
          }
      } catch (error) {
        console.log(error, 'fetch photos failed');
      } finally {
        console.log(photos)
      }
    }
  }
}
  useEffect(() => {
    fetchPhotos();
  }, [userId]);


  return (
    <View style={styles.background}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        renderItem={({item, index}) => (
          <PhotoCard
          item = {item}
          index = {index} 
          />
        )}
      />
    </View>
  );
};

export default Page;
