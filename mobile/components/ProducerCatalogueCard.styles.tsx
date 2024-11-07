import { StyleSheet} from "react-native";

import { Colors } from "@/constants/Colors";

const styles = StyleSheet.create({
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
})

export default styles