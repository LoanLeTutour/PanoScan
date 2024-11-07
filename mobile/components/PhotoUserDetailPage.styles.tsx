import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
    mainHeaderContainer: {
        backgroundColor: Colors.primary,
        marginTop: 10,
    },
    backButton: {
        top: 74,
        left: 10,
        position: 'absolute',
    },

    title: {
        alignSelf: 'center',
        padding: 10,
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: 18
    },
    photoUserContainer: {
        gap: 10,
    },
    photoUserHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
    },
    subTitle: {
        padding: 10,
        color: Colors.secondary,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    subTitleContainer: {
        maxWidth: '65%'
    },
    photoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        width: 280,
        height:200,
        borderRadius: 10,
    },

    photoUser:{
        width: 280,
        height:200,
        borderRadius: 10,
    },

    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },
    
    predictionsHeaderContainer: {
        padding: 10
    },
    predictionsContainer: {
        paddingHorizontal: 15

    },
    
    
    

})

export default styles