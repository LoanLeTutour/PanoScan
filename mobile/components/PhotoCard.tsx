import { useState } from "react";
import { TouchableOpacity, View, Text, Image, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./PhotoCard.styles";
import {Colors} from "../constants/Colors";
import { PhotoUserType } from "@/app/context/PhotoContext";
import { useAuth } from "@/app/context/AuthContext";
interface PhotoCardProps {
    item: PhotoUserType;
    index: number;
    fetchPhotos: () => void;
    setCurrentPhoto: (item: PhotoUserType) => void;
  }
const PhotoCard: React.FC<PhotoCardProps> = ({item, index, fetchPhotos, setCurrentPhoto}) => {
    const {accessToken,refreshToken, refreshAccessToken, setLoading, api} = useAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handlePressPhoto = (item: PhotoUserType) => {
        setCurrentPhoto(item)
    }

    const formatting_Date = (date: string) => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        const year = date.slice(0, 4)
        const month = Number(date.slice(5, 7))
        const str_month = months[month - 1]
        const day = date.slice(8, 10)
        const hour = date.slice(11,13)
        const minutes = date.slice(14,16)
        return `Prise le ${day} ${str_month} ${year} \n à ${hour}h${minutes}` 
    }

    const correctPhotoUserSource = (url: string) => {
        const idUrl = url.slice(32, -18)
        return(`https://drive.google.com/uc?export=view&id=${idUrl}`)
    }
    const correctPhotoProducerSource = (url: string) => {
        const idUrl = url.slice(31)
        return(`https://drive.google.com/uc?export=view&id=${idUrl}`)
    }

    const deactivatePhoto = async (photoId: number) => {
        if (refreshToken){
            refreshAccessToken(refreshToken)
            try {
                setLoading(true)
                const response = await api.patch(`photo_user/${photoId}/deactivate/`, {}, {
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
    
            }finally{
                setLoading(false)
            }
        }

        
        
    }
    return (
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
                source={{uri : correctPhotoUserSource(item.photo_url)}}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(e) => {
                    console.log('Image failed to load', e.nativeEvent.error)
                    setImageLoading(false)
                }}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.text}>{formatting_Date(item.uploaded_at)}</Text>
                <View style={styles.idemContainer}>
                    <Text style={styles.text}>Meilleure correspondance :</Text>
                    <Text style={styles.text}>{item.result[0]?.producer_name}</Text>
                    <Text style={styles.text}>{item.result[0]?.decor_code}</Text>
                    { imageLoading && (
                    <ActivityIndicator
                    style={styles.loadingSpinner}
                    size="large"
                    color={Colors.primary}
                    />
                    )}
                    <Image 
                    resizeMode="cover"
                    style={styles.imageInfo}
                    source={{uri : correctPhotoProducerSource(item.result[0]?.photo_url)}}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={(e) => {
                    console.log('Image failed to load', e.nativeEvent.error)
                    setImageLoading(false)
                }}
                    />
                </View>
            </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                style={[styles.button, {width: '65%'}]}
                onPress={() => handlePressPhoto(item)}>
                    <Text style={styles.buttonText}>Voir détails</Text>
                    <Ionicons name="arrow-forward-circle" color={Colors.white} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.button, {width: '30%'}]}
                onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                    <Ionicons name="trash" color={Colors.white} size={30}/>
                </TouchableOpacity>
            </View>
            <Modal 
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Voulez-vous vraiment supprimer cette photo ?</Text>
                        <Image 
                        resizeMode="cover"
                        style={styles.imageModal}
                        source={{uri : correctPhotoUserSource(item.photo_url)}}
                        onError={(e) => console.log('Image failed to load', e.nativeEvent.error)}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                deactivatePhoto(item.id)
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
        </View>
        


    )
};

export default PhotoCard;
