import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
    logoContainer: {
      marginBottom: 20,
    },
    logo: {
      height: 300,
      width: 300
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.primary,
    },
  });