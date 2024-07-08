import { TouchableOpacity, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./PhotoCard.styles";
import {Colors} from "../constants/Colors";

const PhotoCard = () => {
    const date = new Date('20/10/2024');
    return (
        <View style={styles.container}>
            <View style={styles.overview}>
            <View style={styles.imageContainer}>
                <Image 
                resizeMode="cover"
                style={styles.image}
                source={require('../assets/images/icon.png')}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.text}>18 Janvier 2024  </Text>
                <View style={styles.idemContainer}>
                <Text style={styles.text}>SwissKrono</Text>
                <Text style={styles.text}>K-101-PE</Text>
                <Text style={styles.text}>Fiable à 67%</Text>
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
                <TouchableOpacity style={[styles.button, {width: '30%'}]}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                    <Ionicons name="trash" color={Colors.white} size={30}/>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export default PhotoCard;