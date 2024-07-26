import React, { useEffect } from "react";
import { useState } from "react";
import { View, FlatList, Alert } from "react-native";

import styles from "../(tabs)styles/history.styles";
import PhotoCard from "@/components/PhotoCard";
import axios from "axios";
import { backend_url } from "@/constants/backend_url";
import * as FileSystem from 'expo-file-system';
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as MediaLibrary from 'expo-media-library';
import { usePhotos } from "../context/PhotoContext";
import {jwtDecode} from 'jwt-decode';

const Page = () => {
  const { userId, accessToken, refreshToken } = useAuth();
  const { photos, fetchPhotos, loading, error } = usePhotos();
  const router = useRouter()

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos]);




  return (
    <View style={styles.background}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        renderItem={({item, index}) => (
          <PhotoCard
          item = {item}
          index = {index} 
          />
        )}
      />
    </View>
  );
};

export default Page;
