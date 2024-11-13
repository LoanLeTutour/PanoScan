import { View, Text, Image, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import styles from "./PredictionItem.styles";
import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

interface PredictionItemProps {
  item: SinglePredictionType;
  index: number;
}

export interface SinglePredictionType {
  collection_name: string;
  decor_code: string;
  decor_collection_id: number;
  decor_name: string;
  photo_url: string;
  producer_name: string;
  producer_id: number
}

const correctPhotoProducerSource = (url: string) => {
  const idUrl = url.slice(31);
  return `https://drive.google.com/uc?export=view&id=${idUrl}`;
};

const PredictionItem: React.FC<PredictionItemProps> = ({ item, index }) => {
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const {verticalScale, horizontalScale} = useScale()

  return (
    <TouchableOpacity style={styles.predictionItemContainer} onPress={() => setModalVisible(true)}>
        <View style={styles.leftContainer}>
          <View style={styles.positionIconContainer}>
            <Text style={styles.positionText}>{index + 1}</Text>
          </View>
          { imageLoading && (
                    <ActivityIndicator
                    style={[styles.loadingSpinner, {marginTop: verticalScale(30), marginLeft: horizontalScale(10)}]}
                    size="large"
                    color={Colors.primary}
                    />
                    )}
          <Image
            resizeMode="cover"
            style={styles.photoPrediction}
            source={{ uri: correctPhotoProducerSource(item.photo_url) }}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={(e) => {
              console.log("Image failed to load", e.nativeEvent.error);
              setImageLoading(false);
            }}
          />
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.textInfo}>{item.producer_name}</Text>
          <Text style={styles.textInfo}>Collection {item.collection_name}</Text>
          <Text style={styles.textInfo}>{item.decor_code}</Text>
          <Text style={styles.textInfo}>{item.decor_name}</Text>
        </View>
      <Modal 
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Voulez-vous voir les produits en stock usine pour le décor {item.decor_code} ?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                router.push({pathname: '/(tabs)/catalogue', 
                                  params: {
                                    producer_prediction_id: item.producer_id.toString(), // Assurez-vous d'ajuster `producer_id` si nécessaire
                                    decor_collection_prediction_id: item.decor_collection_id.toString()
                                  }})
                                setModalVisible(false)
                            }}
                            >
                                <Text style={styles.modalText}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalText}>Non</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
    </TouchableOpacity>
    
  );
};

export default PredictionItem;
