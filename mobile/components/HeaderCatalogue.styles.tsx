import { StyleSheet } from "react-native"

import { Colors } from "@/constants/Colors"

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        left: 10,
    },
    subTitle: {
        padding: 10,
        fontWeight: 'bold',
        color: Colors.secondary,
        fontSize: 20,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    subTitleContainer: {
        maxWidth: '65%'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 100,
    },
})


export default styles