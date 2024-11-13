import { StyleSheet } from "react-native";

import {Colors} from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.secondary,
        borderRadius: verticalScale(10),
        padding: verticalScale(15),
        gap: verticalScale(15),
        elevation: verticalScale(5),
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowColor: Colors.secondary
    },
    overview:{
        flexDirection:'row',
        borderRadius: verticalScale(10),
        backgroundColor: Colors.secondary,
        height: verticalScale(200)
    },
    imageContainer:{
        width: '45%',
        height: '100%',
        borderRadius: verticalScale(10),
    },
    image:{
        width: horizontalScale(140),
        height: verticalScale(200),
        borderRadius: verticalScale(10),
    },
    imageInfo:{
        width: horizontalScale(140),
        height: verticalScale(80),
        borderRadius: verticalScale(10),
        marginTop: verticalScale(10)
    },
    infoContainer:{
        width: '55%',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'space-between',
        gap: verticalScale(10)
    },
    idemContainer: {
        textAlign: 'center',
        alignItems: 'center',
        gap : verticalScale(3)
    },
    buttonContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent:'space-between'
    },
    button:{
        alignItems: 'center',
        padding: verticalScale(5),
        gap: verticalScale(3),
        backgroundColor: Colors.primary,
        borderRadius: verticalScale(10),
        elevation: verticalScale(5),
        shadowColor: Colors.primary,

    },
    buttonText:{
        color: Colors.white,
        fontSize: verticalScale(14),
        fontWeight: 'bold',
    },
    text:{
        textAlign: 'center',
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: horizontalScale(14)
    },
    modalContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.secondary,
        opacity: 1
    },
    modalView:{
        alignItems: 'center',
        padding: verticalScale(30),
        
    },
    modalText:{
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(25),
        textAlign: 'center'
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
    imageModal:{
        width: horizontalScale(280),
        height: verticalScale(400),
        borderRadius: verticalScale(20),
        margin: verticalScale(20)
    },
    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },

})

export default styles;