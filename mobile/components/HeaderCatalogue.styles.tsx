import { StyleSheet } from "react-native"

import { Colors } from "@/constants/Colors"
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        left: horizontalScale(10),
    },
    subTitle: {
        padding: verticalScale(10),
        fontWeight: 'bold',
        color: Colors.secondary,
        fontSize: verticalScale(20),
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    subTitleContainer: {
        maxWidth: '65%'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(100),
    },
})


export default styles