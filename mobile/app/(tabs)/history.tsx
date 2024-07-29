import React, { useEffect, useCallback } from "react";
import { View, FlatList, Alert } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import { usePhotos } from "../context/PhotoContext";

const Page = () => {
  const { photos, fetchPhotos, loading} = usePhotos();

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <View style={styles.background}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        renderItem={({item, index}) => (
          <PhotoCard
          item = {item}
          index = {index} 
          fetchPhotos= {fetchPhotos}
          />
        )}
      />
    </View>
  );
};

export default Page;
