import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    mainHeaderContainer: {
        backgroundColor: Colors.primary,
        marginTop: verticalScale(10),
    },
    backButton: {
        top: verticalScale(74),
        left: horizontalScale(10),
        position: 'absolute',
    },

    title: {
        alignSelf: 'center',
        padding: verticalScale(10),
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: horizontalScale(20)
    },
    photoUserContainer: {
        gap: verticalScale(10),
        marginBottom: verticalScale(20)
    },
    photoUserHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(80),
    },
    subTitleText: {
        color: Colors.secondary,
        fontSize: verticalScale(18),
        fontWeight: 'bold',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    subTitleContainer: {
        maxWidth: '65%',
        padding: verticalScale(10),
    },
    photoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        width: horizontalScale(280),
        height: verticalScale(200),
        borderRadius: verticalScale(10),
    },

    photoUser:{
        width: horizontalScale(280),
        height: verticalScale(200),
        borderRadius: verticalScale(10),
    },

    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },
    
    predictionsHeaderContainer: {
        padding: verticalScale(10)
    },
    predictionsContainer: {
        paddingHorizontal: horizontalScale(15)

    },
    
    
    

})

export default styles