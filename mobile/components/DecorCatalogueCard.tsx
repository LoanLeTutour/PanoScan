import { useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";

import styles from "./DecorCatalogueCard.styles";
import {Colors} from "../constants/Colors";
import { DecorCollectionProps } from "@/app/(tabs)/catalogue";

interface DecorCardProps {
    item: DecorCollectionProps;
    index: number;
    setCurrentDecor: (item: DecorCollectionProps) => void
  }
const DecorCatalogueCard: React.FC<DecorCardProps> = ({item, index, setCurrentDecor}) => {

    const [imageLoading, setImageLoading] = useState(true);


    const correctPhotoSource = (url: string) => {
        const idUrl = url.slice(31)
        return(`https://drive.google.com/uc?export=view&id=${idUrl}`)
    }

    const handlePressDecor = (item: DecorCollectionProps) => {
        setCurrentDecor(item)
    }

    return (
        <TouchableOpacity
        onPress={() => handlePressDecor(item)}
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
                source={{uri : correctPhotoSource(item.decor.photo_url)}}
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
                    <Text style={styles.text}>{item.decor.name}</Text>
                    <Text style={styles.text}>{item.decor.code}</Text>
                    <Text style={styles.text}>Collection: {item.collection.name}</Text>
            </View>
            </View>
        </View>
        </View>
        </TouchableOpacity>

    )
};

export default DecorCatalogueCard;
