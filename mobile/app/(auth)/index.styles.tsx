import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 30,
        alignItems: 'center',
        gap: 140,
    },
    title: {
        fontSize: 36,
        color: Colors.secondary,
        fontWeight: 'bold',
        marginTop: 140,
    },
    formContainer:{
        alignItems: 'center',
        width: '80%',
        gap: 40,
    },
    titleForm: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.secondary
    },
    inputArea: {
        width: '100%',
        gap: 10,
    },

    inputField: {
        height: 44,
        width: '100%',
        borderWidth: 3,
        borderColor: Colors.primary,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',

    },
    btn: {
        backgroundColor: Colors.primary,
        height: 50,
        width: '40%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },

})

export default styles;