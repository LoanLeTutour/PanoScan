import { StyleSheet } from "react-native";

import {Colors} from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()


const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    container:{
        flexGrow:1,
        backgroundColor: Colors.white,
        padding: horizontalScale(15),
        gap: verticalScale(15),
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        backgroundColor: Colors.primary,
        marginTop: verticalScale(10),
    },
    title: {
        alignSelf: 'center',
        padding: verticalScale(10),
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: verticalScale(18)
    },
    button:{
        alignItems: 'center',
        padding: verticalScale(20),
        minWidth: '50%',
        gap: verticalScale(3),
        backgroundColor: Colors.primary,
        borderRadius: verticalScale(10),
        elevation: verticalScale(5),
        shadowColor: Colors.primary
    },
    textButton: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: Colors.white
    },
    subTitleContainer: {
        maxWidth: '65%'
    },

    subTitle: {
        padding: verticalScale(10),
        fontWeight: 'bold',
        color: Colors.secondary,
        fontSize: verticalScale(20),
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: verticalScale(80),
        marginBottom: verticalScale(20)
    },
    backButton: {
        position: 'absolute',
        left: horizontalScale(10)
    },

})

export default styles;