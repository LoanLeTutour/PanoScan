import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.white,
        alignItems: 'center',
    },
    containerPermission: {
        flex:1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    textPermission: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 30,
        fontWeight: 'bold',
    },
    buttonPermission: {
        backgroundColor: Colors.secondary,
        padding: 20,
        borderRadius: 10,

    },
    textButtonPermission: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    camera: {
        flex:1,
        borderRadius: 20,
        padding: 20,
    },
    topButtonsContainer:{
        flex: 1,
        alignItems: 'flex-start',
        gap: 30,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
    },
    uploadingButton: {
        marginLeft: '35%',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'space-between',
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
    icons:{
        height: 30,
        width: 30,
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