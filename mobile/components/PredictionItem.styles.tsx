import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
    predictionItemContainer: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 10,
        elevation: 1,
        zIndex: 1,

    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 15,
    },
    leftTopContainer: {
        width: '50%',
        alignItems: 'center',
        gap: 10
    },
    photoPrediction:{
        width: 140,
        height:100,
        borderRadius: 10,
    },
    rightTopContainer: {
        flex: 1,
        width: '50%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    positionIconContainer: {
        backgroundColor: Colors.primary,
        width: 35,
        borderRadius: 100,
        padding: 2
    },
    positionText: {
        alignSelf: 'center',
        fontSize: 25,
        color: Colors.white
    },
    textInfo: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 15


    },
    buttonToCatalogueContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonToCatalogue: {
        width: '45%',
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        borderRadius: 10,
    },
    textButtonToCatalogue :{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'center',
    },
    modalContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.secondary,
        opacity: 0.9,
    },
    modalView:{
        alignItems: 'center',
        padding: 30,
        
    },
    modalTitle:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: 30
    },
    modalText:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
    modalButtonContainer:{
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '100%'
    },
    modalButton:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        height: 100,
        marginHorizontal: 10,
        borderRadius: 10
    },
    imageModal:{
        width: 280,
        height:400,
        borderRadius: 20,
        margin: 20
    },
    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },

})

export default styles