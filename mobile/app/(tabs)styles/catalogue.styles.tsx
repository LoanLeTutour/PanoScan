import { StyleSheet } from "react-native";

import {Colors} from "@/constants/Colors";


const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    container:{
        flexGrow:1,
        backgroundColor: Colors.white,
        padding: 15,
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        backgroundColor: Colors.primary,
        marginTop: 10,
    },
    title: {
        alignSelf: 'center',
        padding: 10,
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: 18
    },
    button:{
        alignItems: 'center',
        padding:20,
        minWidth: '50%',
        gap: 3,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        elevation: 5,
        shadowColor: Colors.primary
    },
    textButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white
    },
    subTitleContainer: {
        maxWidth: '65%'
    },

    subTitle: {
        padding: 10,
        fontWeight: 'bold',
        color: Colors.secondary,
        fontSize: 20,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
        marginBottom: 20
    },
    backButton: {
        position: 'absolute',
        left: 10
    },

})

export default styles;