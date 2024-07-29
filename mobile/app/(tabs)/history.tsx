import React, { useEffect } from "react";
import { View, FlatList, Alert } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import { usePhotos } from "../context/PhotoContext";

const Page = () => {
  const { photos, fetchPhotos} = usePhotos();

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos]);




  return (
    <View style={styles.background}>
      <FlatList
        data={photos}
        keyExtractor={(index) => index.toString()}
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
