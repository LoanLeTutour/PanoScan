import React, { useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity} from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import { usePhotos } from "../context/PhotoContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "@/components/WaitingPage";
import { useRouter } from "expo-router";

const Page = () => {
  const { photos, fetchPhotos} = usePhotos();
  const {loading} = useAuth()
  const router = useRouter()
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const redirectToPhotoCapture = () => {
    router.replace('/(tabs)/photo')
  }
  
  return (
    loading ? <LoadingSpinner/> :
    <SafeAreaView style={styles.background}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Historique</Text>
      </View>

      {
        photos.length === 0 ?
        <View style={styles.noDataContainer}>
          <Text style={styles.textNoData}>Vous n'avez pas encore de photos</Text>
          <TouchableOpacity
            onPress={() => redirectToPhotoCapture()}
            style={styles.buttonRedirect}
          >
            <Text style={styles.textRedirect}>Prendre une photo</Text>
          </TouchableOpacity>
        </View>
        
        :
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
      }    
      
    </SafeAreaView>
  );
};

export default Page;
