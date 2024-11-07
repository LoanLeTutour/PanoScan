import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import styles from "./PhotoUserDetailPage.styles";
import { PhotoUserType } from "@/app/context/PhotoContext";
import { Colors } from "@/constants/Colors";
import PredictionItem from "./PredictionItem";

interface PhotoUserPageType {
  photo: PhotoUserType;
  backButtonToHistoryPressed: () => void;
}
const PhotoUserDetailPage: React.FC<PhotoUserPageType> = ({
  photo,
  backButtonToHistoryPressed,
}) => {
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(imageLoading);
  }, [imageLoading]);

  const correctPhotoUserSource = (url: string) => {
    const idUrl = url.slice(32, -18);
    return `https://drive.google.com/uc?export=view&id=${idUrl}`;
  };

  const formatting_Date = (date: string) => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const year = date.slice(0, 4);
    const month = Number(date.slice(5, 7));
    const str_month = months[month - 1];
    const day = date.slice(8, 10);
    const hour = date.slice(11, 13);
    const minutes = date.slice(14, 16);
    return `Prise le ${day} ${str_month} ${year} à ${hour}h${minutes}`;
  };

  const handleBackToHistory = () => {
    console.log("pressed");
    backButtonToHistoryPressed();
  };

  const HeaderSelectedPhoto = () => {
    return (
      <View style={styles.mainHeaderContainer}>
        <Text style={styles.title}>Photo</Text>
      </View>
    );
  };

  const PhotoUserView = () => {
    return (
      <View style={styles.photoUserContainer}>
        <View style={styles.photoUserHeader}>
          <View style={styles.subTitleContainer}>
            <Text style={styles.subTitle}>
              {formatting_Date(photo.uploaded_at)}
            </Text>
          </View>
        </View>
        <View style={styles.photoContainer}>
          {imageLoading && (
            <ActivityIndicator
              style={styles.loadingSpinner}
              size="large"
              color={Colors.primary}
            />
          )}
          <Image
            resizeMode="cover"
            style={styles.photoUser}
            source={{ uri: correctPhotoUserSource(photo.photo_url) }}
            onLoadEnd={() => setImageLoading(false)}
            onError={(e) => {
              console.log("Image failed to load", e.nativeEvent.error);
              setImageLoading(false);
            }}
          />
        </View>
      </View>
    );
  };

  const PredictionHeader = () => {
    return (
      <View style={styles.predictionsHeaderContainer}>
        <Text style={styles.subTitle}>Predictions:</Text>
      </View>
    );
  };

  const ListOfPredictions = () => {
    return (
      <FlatList
        data={photo.result}
        keyExtractor={(index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.predictionsContainer}
        renderItem={({ item, index }) => (
          <PredictionItem item={item} index={index} />
        )}
      />
    );
  };

  return (
    <View>
      <HeaderSelectedPhoto />
      <PhotoUserView />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handleBackToHistory()}
      >
        <Ionicons name="arrow-undo" size={40} color={Colors.secondary} />
      </TouchableOpacity>
      <PredictionHeader />
      <ListOfPredictions />
    </View>
  );
};

export default PhotoUserDetailPage;
