import React, { useEffect } from "react";
import { View, FlatList, Text} from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import { usePhotos } from "../context/PhotoContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const { photos, fetchPhotos, loading} = usePhotos();

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Historique de photos</Text>
      </View>
      
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
    </SafeAreaView>
  );
};

export default Page;
