import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import { usePhotos } from "../context/PhotoContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "@/components/WaitingPage";
import { PhotoUserType } from "../context/PhotoContext";
import PhotoUserDetailPage from "@/components/PhotoUserDetailPage";



const Page = () => {
  const { photos, fetchPhotos } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoUserType>();
  const { loading } = useAuth();
  const router = useRouter();

  const { selectedPhotoId } = useLocalSearchParams();
  

  useEffect(() => {
      fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    console.log("Photos:", photos);
    if (photos && selectedPhotoId) {
      const photoId = Number(selectedPhotoId) // Convert to integer
      const photo = photos.find(photo => photo.id === photoId);
      setSelectedPhoto(photo);
    }
  }, [photos, selectedPhotoId]);

  const redirectToPhotoCapture = () => {
    router.replace("/(tabs)/photo");
  };

  const HeaderHistory = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Historique</Text>
      </View>
    );
  };

  const receiveCurrentPhoto = (item: PhotoUserType) => {
    setSelectedPhoto(item);
  };

  const handleBackFromPhotoUserDetailPage = () => {
    setSelectedPhoto(undefined);
    console.log("Back to History");
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <SafeAreaView style={styles.background}>
      {selectedPhoto ? (
        <PhotoUserDetailPage
          photo={selectedPhoto}
          backButtonToHistoryPressed={handleBackFromPhotoUserDetailPage}
        />
      ) : photos.length === 0 ? (
        <View>
          <HeaderHistory />
          <View style={styles.noDataContainer}>
            <Text style={styles.textNoData}>
              Vous n'avez pas encore de photos
            </Text>
            <TouchableOpacity
              onPress={() => redirectToPhotoCapture()}
              style={styles.buttonRedirect}
            >
              <Text style={styles.textRedirect}>Prendre une photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <HeaderHistory />
          <FlatList
            data={photos}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({ item, index }) => (
              <PhotoCard
                item={item}
                index={index}
                fetchPhotos={fetchPhotos}
                setCurrentPhoto={receiveCurrentPhoto}
              />
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Page;
