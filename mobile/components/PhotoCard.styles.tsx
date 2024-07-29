import {Colors} from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding:15,
        gap: 15,
        marginBottom: 10,
        elevation: 10,
        shadowColor: Colors.secondary,   
    },
    overview:{
        flexDirection:'row',
        borderRadius: 10,
        backgroundColor: Colors.secondary,
    },
    imageContainer:{
        width: '45%',
        height: '100%',
        borderRadius: 10,
    },
    image:{
        width: 140,
        height:200,
        borderRadius: 10,
    },
    imageInfo:{
        width: 140,
        height:80,
        borderRadius: 10,
        marginTop: 10
    },
    infoContainer:{
        width: '55%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    idemContainer: {
        alignItems: 'center',
        gap : 5
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent:'space-between'
    },
    button:{
        alignItems: 'center',
        padding:5,
        gap: 3,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Colors.primary,

    },
    buttonText:{
        color: Colors.white,
        fontSize: 15,
        fontWeight: 'bold',
    },
    text:{
        color: Colors.white,
        fontWeight: 'bold',
    }

})

export default styles;