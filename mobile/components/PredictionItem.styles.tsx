import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    predictionItemContainer: {
        backgroundColor: Colors.secondary,
        borderRadius: verticalScale(10),
        zIndex: 1,
        flexDirection: 'row',
        marginBottom: verticalScale(15),
        padding: verticalScale(15),
        elevation: verticalScale(5),
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowColor: Colors.secondary
    },

    leftContainer: {
        width: '50%',
        alignItems: 'center',
        gap: verticalScale(10)
    },
    photoPrediction:{
        width: horizontalScale(140),
        height: verticalScale(100),
        borderRadius: verticalScale(10),
    },
    rightContainer: {
        flex: 1,
        width: '50%',
        padding: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(10)
    },
    positionIconContainer: {
        backgroundColor: Colors.primary,
        width: horizontalScale(35),
        borderRadius: verticalScale(100),
        padding: verticalScale(2)
    },
    positionText: {
        alignSelf: 'center',
        fontSize: verticalScale(25),
        color: Colors.white
    },
    textInfo: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(15)


    },
    buttonToCatalogueContainer: {
        flex: 1,
        alignItems: 'center',
    },
    buttonToCatalogue: {
        width: '45%',
        backgroundColor: Colors.primary,
        paddingVertical: verticalScale(20),
        borderRadius: verticalScale(10),
    },
    textButtonToCatalogue :{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(18),
        alignSelf: 'center',
    },
    modalContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.secondary,
        opacity: 1,
    },
    modalView:{
        alignItems: 'center',
        padding: verticalScale(30),
        
    },
    modalTitle:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(25),
        textAlign: 'center',
        marginBottom: verticalScale(30)
    },
    modalText:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(25),
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
        height: verticalScale(100),
        marginHorizontal: horizontalScale(10),
        borderRadius: verticalScale(10)
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