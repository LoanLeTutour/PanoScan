import { TouchableOpacity, Text, View, Image, ActivityIndicator } from "react-native";
import { useState } from "react";

import { StructureDecorProps } from "@/app/(tabs)/catalogue";
import styles from "./StructureCatalogueCard.styles";
import { Colors } from "@/constants/Colors";

interface StructureDecorCardProps {
    item: StructureDecorProps,
    index: number,
    setCurrentStructure: (item: StructureDecorProps) => void
  }


const StructureCatalogueCard: React.FC<StructureDecorCardProps> = ({ item, index, setCurrentStructure }) => {
  const [imageLoading, setImageLoading] = useState(true);    
  
  const handlePressStructure = (item: StructureDecorProps) => {
        setCurrentStructure(item)
    }

    const correctPhotoSource = (url: string) => {
      const idUrl = url.slice(32, -17)
      return(`https://drive.google.com/uc?export=view&id=${idUrl}`)
  }
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePressStructure(item)}
      >
        <View style={styles.container}>
            <View style={styles.overview}>
            <View style={styles.imageContainer}>
                { imageLoading && (
                    <ActivityIndicator
                    style={styles.loadingSpinner}
                    size="large"
                    color={Colors.primary}
                    />
                )}
            <Image 
                resizeMode="cover"
                style={styles.image}
                source={{uri : correctPhotoSource(item.structure.photo_url)}}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(e) => {
                    console.log('Image failed to load', e.nativeEvent.error)
                    setImageLoading(false)
                }}
                />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.idemContainer}>
                    <Text style={styles.text}>{item.structure.code}</Text>
                    <Text style={styles.text}>{item.structure.name}</Text>
            </View>
            </View>
        </View>
        </View>
      </TouchableOpacity>
    );
  };

  export default StructureCatalogueCard