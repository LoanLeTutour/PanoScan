import { StyleSheet } from "react-native";

import {Colors} from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()


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
        padding: verticalScale(15),
        gap: verticalScale(15)

    },
    titleContainer: {
        backgroundColor: Colors.primary,
        marginTop: verticalScale(10),
    },
    title: {
        alignSelf: 'center',
        padding: verticalScale(10),
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: verticalScale(18)
    },
    noDataContainer: {
        flexGrow: 1,
        padding: verticalScale(20),
        alignSelf: 'center',
        gap: verticalScale(20),
        justifyContent: 'center',
        marginTop: '50%',
        elevation: verticalScale(5),
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowColor: Colors.primary
    },
    textNoData: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: verticalScale(18),
        color: Colors.secondary
    },
    buttonRedirect: {
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        borderRadius: verticalScale(10),
        padding: verticalScale(20),
        width: '80%'
    },
    textRedirect: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: verticalScale(18),
    },
    backButton: {
        position: 'absolute',
        left: horizontalScale(10)
    },
});

export default styles;