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
        shadowColor: Colors.secondary,   
    },
    overview:{
        flexDirection:'row',
        borderRadius: verticalScale(10),
        backgroundColor: Colors.secondary,
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
        justifyContent: 'center'
    },
    idemContainer: {
        alignItems: 'center',
        gap : verticalScale(5)
    },
    text:{
        color: Colors.white,
        fontWeight: 'bold',
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