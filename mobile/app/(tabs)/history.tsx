import React from "react";
import { View, ScrollView } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";

const Page = () => {
  return (
    <View style={styles.background}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <PhotoCard />
        <PhotoCard />
        <PhotoCard />
      </ScrollView>
    </View>
  );
};

export default Page;
