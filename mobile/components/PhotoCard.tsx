import { TouchableOpacity, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./PhotoCard.styles";
import {Colors} from "../constants/Colors";
import { base_backend_url } from "@/constants/backend_url";
import { Photo } from "@/app/context/PhotoContext";
import axios from "axios";
import { backend_url } from "@/constants/backend_url";
import { useAuth } from "@/app/context/AuthContext";
interface PhotoCardProps {
    item: Photo;
    index: number;
    fetchPhotos: () => void;
  }
const PhotoCard: React.FC<PhotoCardProps> = ({item, index, fetchPhotos}) => {
    const {accessToken,refreshToken, refreshAccessToken} = useAuth()
    const formatting_Date = (date: string) => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        const year = date.slice(0, 4)
        const month = Number(date.slice(5, 7))
        const str_month = months[month - 1]
        const day = date.slice(8, 10)
        const hour = date.slice(11,13)
        const minutes = date.slice(14,16)
        return `Prise le ${day} ${str_month} ${year} à ${hour}h${minutes}` 
    }

    const deactivatePhoto = async (photoId: number) => {
        if (refreshToken){
            refreshAccessToken(refreshToken)
            try {
                const response = await axios.patch(`${backend_url()}photo_user/${photoId}/deactivate/`, {}, {
                    headers:{
                        'Content-Type': 'application.json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.status === 200) {
                    console.log('Photo désactivée avec succès');
                    fetchPhotos();
                } else {
                    console.error('Echec de la désactivation')
                }
            } catch (err) {
                console.error(err);
    
            }
        }
        
        
    }
    return (
        <View style={styles.container}>
            <View style={styles.overview}>
            <View style={styles.imageContainer}>
            <Image 
                resizeMode="cover"
                style={styles.image}
                source={{uri : `${base_backend_url()}${item.photo}`}}
                onError={(e) => console.log('Image failed to load', e.nativeEvent.error)}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.text}>{formatting_Date(item.uploaded_at)}</Text>
                <View style={styles.idemContainer}>
                    <Text style={styles.text}>Meilleure correspondance :</Text>
                    <Text style={styles.text}>SwissKrono</Text>
                    <Text style={styles.text}>K-101-PE</Text>
                    <Image 
                    resizeMode="cover"
                    style={styles.imageInfo}
                    source={require('../assets/images/icon.png')}
                    />
                </View>
            </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, {width: '65%'}]}>
                    <Text style={styles.buttonText}>Voir détails</Text>
                    <Ionicons name="arrow-forward-circle" color={Colors.white} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.button, {width: '30%'}]}
                onPress={() => {deactivatePhoto(item.id)}}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                    <Ionicons name="trash" color={Colors.white} size={30}/>
                </TouchableOpacity>
            </View>
        </View>
                

    )
};

export default PhotoCard;
