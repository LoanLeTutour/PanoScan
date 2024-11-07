import { StyleSheet } from "react-native"

import {Colors} from "@/constants/Colors";


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        
    },
    camera: {
        flex:1,
        borderRadius: 20,
        padding: 30,
    },
    buttonsContainer: {
        justifyContent: 'space-between',
    },
    topButtonsContainer:{
        flex: 1,
        alignItems: 'flex-end',
        gap: 30,
        marginRight: 20,
        marginTop: 30
    },
    icons:{
        height: 30,
        width: 30,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
    },
    
    uploadingButton: {
        marginLeft: '35%',
    },
    
    capturingButtonContainer:{
        borderRadius:70,
        borderColor:Colors.white,
        borderWidth: 2,
        marginLeft: '40%',
    },
    capturingButton:{
        backgroundColor: Colors.white,
        height: 70,
        width: 70,
        borderRadius:70,
        borderWidth: 5,
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
        width: 350,
        height: 533,
        resizeMode: 'stretch',
        alignSelf: 'center',
        borderRadius: 10,
    },
    buttonTakenImage:{
        backgroundColor: Colors.primary,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: 150,
        borderRadius: 10,
    },
    textResult: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 20,
    }

})

export default styles;