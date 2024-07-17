import React, { useEffect } from "react";
import { useState } from "react";
import { View, ScrollView, FlatList } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import axios from "axios";
import { backend_url } from "@/constants/backend_url";
import * as FileSystem from 'expo-file-system';


const Page = () => {
  const [photos, setPhotos] = useState([])
  const [localPhotos, setLocalPhotos] = useState([])

  useEffect(() => {
    axios.get(backend_url + 'photos/')
    .then(response => {
      setPhotos(response.data);
      downloadPhotos(response.data);
    })
    .catch(error => {
      console.log(error, 'fetch photos failed')});
  }, [])

  const downloadPhotos = async (photos) => {
    const promises = photos.map(async (photo) => {
      const fileName = photo.image_url.split('/').pop(); // Extraire le nom de fichier de l'URL
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const { uri } = await FileSystem.downloadAsync(photo.image_url, fileUri);
      return uri;
    });

    const localPaths = await Promise.all(promises);
    setLocalPhotos(localPaths);
  };

  return (
    <View style={styles.background}>
      <FlatList
        data={localPhotos}
        keyExtractor={(item, index) => index.toString()}
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
