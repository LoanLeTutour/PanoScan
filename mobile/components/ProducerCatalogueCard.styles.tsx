import { StyleSheet} from "react-native";

import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        padding: verticalScale(20),
        minWidth: '50%',
        gap: verticalScale(3),
        backgroundColor: Colors.primary,
        borderRadius: verticalScale(10),
        elevation: verticalScale(5),
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowColor: Colors.primary
    },
    textButton: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: Colors.white
    },
})

export default styles