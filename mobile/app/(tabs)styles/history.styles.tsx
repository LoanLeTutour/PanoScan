import { StyleSheet } from "react-native";

import {Colors} from "@/constants/Colors";


const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    container:{
        flex: 1,
        backgroundColor: Colors.white,
    },

    flatListContainer: {
        flexGrow:1,
        padding: 15,
        gap:15

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
    noDataContainer: {
        flexGrow: 1,
        padding: 20,
        alignSelf: 'center',
        gap: 20,
        justifyContent: 'center',
        marginTop: '50%'
    },
    textNoData: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.secondary
    },
    buttonRedirect: {
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 20,
        width: '80%'
    },
    textRedirect: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: 18,
    },
    backButton: {
        position: 'absolute',
        left: 10
    },
});

export default styles;