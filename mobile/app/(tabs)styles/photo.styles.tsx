import { StyleSheet } from "react-native"

import {Colors} from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        
    },
    camera: {
        flex:1,
        borderRadius: verticalScale(20),
        padding: verticalScale(30),
    },
    buttonsContainer: {
        justifyContent: 'space-between',
    },
    topButtonsContainer:{
        flex: 1,
        alignItems: 'flex-end',
        gap: verticalScale(30),
        marginRight: horizontalScale(20),
        marginTop: verticalScale(30)
    },
    icons:{
        height: verticalScale(30),
        width: horizontalScale(30),
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
    },
    
    uploadingButton: {
        marginLeft: '35%',
    },
    
    capturingButtonContainer:{
        borderRadius: horizontalScale(100),
        borderColor:Colors.white,
        borderWidth: horizontalScale(3),
        marginLeft: '40%',
        height: horizontalScale(80),
        width: horizontalScale(80),
        justifyContent: 'center'
    },
    capturingButton:{
        alignSelf: 'center',
        backgroundColor: Colors.white,
        height: horizontalScale(70),
        width: horizontalScale(70),
        borderRadius: horizontalScale(100),
        borderWidth: horizontalScale(4),
        borderColor: Colors.black,
    },
    
    resultContainer:{
        flex: 1,
        width: '100%',
        backgroundColor: Colors.secondary,
        justifyContent: 'space-evenly',
    },
    buttonsResultContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    image: {
        width: horizontalScale(350),
        height: verticalScale(533),
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: verticalScale(10),
    },
    buttonTakenImage:{
        backgroundColor: Colors.primary,
        padding: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: horizontalScale(150),
        borderRadius: horizontalScale(10),
    },
    textResult: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: verticalScale(20),
    }

})

export default styles;