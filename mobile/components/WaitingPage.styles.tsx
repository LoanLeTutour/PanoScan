import { StyleSheet } from "react-native";

import { Colors } from "@/constants/Colors";
import useScale from "@/constants/scales";

const {verticalScale, horizontalScale} = useScale()

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
    logoContainer: {
      marginBottom: verticalScale(20),
    },
    logo: {
      height: verticalScale(300),
      width: horizontalScale(300)
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: horizontalScale(60),
    },
    dot: {
      width: horizontalScale(12),
      height: verticalScale(12),
      borderRadius: verticalScale(6),
      backgroundColor: Colors.primary,
    },
  });