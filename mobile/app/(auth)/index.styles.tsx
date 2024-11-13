import {Colors} from "../../constants/Colors";
import { StyleSheet } from "react-native";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: verticalScale(30),
        alignItems: 'center',
        gap: verticalScale(140),
    },
    title: {
        fontSize: verticalScale(36),
        color: Colors.secondary,
        fontWeight: 'bold',
        marginTop: verticalScale(140),
    },
    formContainer:{
        alignItems: 'center',
        width: '80%',
        gap: verticalScale(40),
    },
    titleForm: {
        fontSize: verticalScale(24),
        fontWeight: '500',
        color: Colors.secondary
    },
    inputArea: {
        width: '100%',
        gap: verticalScale(10),
    },

    inputField: {
        height: verticalScale(44),
        width: '100%',
        borderWidth: horizontalScale(3),
        borderColor: Colors.primary,
        borderRadius: verticalScale(10),
        padding: verticalScale(10),
        backgroundColor: 'white',

    },
    btn: {
        backgroundColor: Colors.primary,
        height: verticalScale(50),
        width: '40%',
        borderRadius: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.white,
        fontSize: verticalScale(16),
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: verticalScale(12),
      },

})

export default styles;