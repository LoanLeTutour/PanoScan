import {Colors} from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    container:{
        flexGrow:1,
        backgroundColor: Colors.white,
        padding: 10,

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
    }
});

export default styles;