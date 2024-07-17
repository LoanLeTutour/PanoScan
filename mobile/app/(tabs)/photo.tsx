import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button
} from "react-native";
import { CameraView, useCameraPermissions, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


import styles from "../(tabs)styles/photo.styles";
import { backend_url } from "@/constants/backend_url";
import { useRouter } from "expo-router";


const imgDir = FileSystem.documentDirectory + 'photos/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true});
  }
};

const HomePage: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string>("");
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setflashMode] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter()

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.container, {justifyContent:'center'}]}>
        <Text style={{ textAlign: 'center'}}>Une permission d'accès à la caméra est requise</Text>
        <Button onPress={requestPermission} title="donner la permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  console.log(facing)}

  const toggleFlashMode = () => {
    setflashMode(current => (current === 'on' ? 'off' : 'on'));
    console.log(flashMode)}


  const FlashIcon = () => {
    if (flashMode === 'off') {
      return(<Ionicons
        name="flash-off"
        color="grey"
        size={30}
        style={styles.icons}
      />)
    }
    else {
      return (<Ionicons 
        name="flash" 
        color="white" 
        size={30} 
        style={styles.icons} />)
    }
  }
  
  const imagePickerOptions : ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [9, 16],
    quality: 0.75,
  }

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
    if (!result.canceled) {
      console.log(result.assets[0].uri);
      saveImage(result.assets[0].uri)
    }
  };

  const saveImage = async (uri : string) => {
    await ensureDirExists();
    const fileName = new Date().getTime() + '.jpg';
    const dest = imgDir + fileName;
    await FileSystem.copyAsync({from: uri, to:dest});
    setImage(uri);
  }

  const takeAPicture = async () => {
    if (cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          console.log(photo);
          saveImage(photo.uri);
        }
        
      } catch (err) {
        console.log(err, "capturing image");
      }
    }
    else {
      console.log("Camera reference is not valid.");
    }
  };

  const displayTakePictureButton = () => {
    return(
            <View style={styles.capturingButtonContainer}>
              <TouchableOpacity
                style={styles.capturingButton}
                onPress={takeAPicture}
              />
            </View>)
  }

  const removeImage = () => {
    setImage("");
  };

  const displayTakenImage = (image: string) => {
    return (
      <View style={styles.resultContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <View style={styles.buttonsResultContainer}>
          <TouchableOpacity
            style={styles.buttonTakenImage}
            onPress={uploadPhoto}
          >
            <Text style={styles.textResult}>Tester</Text>
            <Ionicons name="search" color="white" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTakenImage}
            onPress={removeImage}
          >
            <Text style={styles.textResult}>Supprimer</Text>
            <Ionicons name="trash" color="white" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flashMode}
        ref={cameraRef}
      >
        <View style={styles.buttonsContainer}>
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity onPress={toggleFlashMode}>
              <FlashIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" color="white" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomButtonsContainer}>
            {displayTakePictureButton()}
            <View>
              <TouchableOpacity
                style={styles.uploadingButton}
                onPress={selectImage}
              >
                <Ionicons name="download" color="white" size={70} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    );
  };
  
  const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log(refreshToken)
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }
        const response = await axios.post(`${backend_url()}token/refresh/`, {
            refresh: refreshToken,
        });
        const { access, refresh } = response.data;
        await AsyncStorage.setItem('accessToken', access);
        await AsyncStorage.setItem('refreshToken', refresh);
        return access;
    } catch (error:any) {
        console.error('Failed to refresh token', error);
        if (error.response && error.response.status === 401){
          console.log('refresh token expired')
          router.replace('(auth)/index')
        }
    }
};


const uploadPhoto = async () => {
  try {
      let accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
          accessToken = await refreshAccessToken();
      }

      const response = await FileSystem.uploadAsync(
          `${backend_url()}upload/`,
          image,
          {
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: "photo",
              headers: {
                  "Authorization": `Bearer ${accessToken}`,
              },
          }
      );

      if (response.status !== 201) {
          console.log("Failed to upload image!");
          const newAccessToken = await refreshAccessToken();
              // Réessayez l'upload avec le nouveau token
              await FileSystem.uploadAsync(
                  `${backend_url()}upload/`,
                  image,
                  {
                      httpMethod: "POST",
                      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                      fieldName: "photo",
                      headers: {
                          "Authorization": `Bearer ${newAccessToken}`,
                      },
                  }
              );
      } else {
          console.log('Image uploaded successfully:', response.body);
      }
  } catch (error:any) {
      if (error.response && error.response.status === 401) {
          // Token expiré, essayez de le rafraîchir
          try {
              const newAccessToken = await refreshAccessToken();
              // Réessayez l'upload avec le nouveau token
              const retryResponse = await FileSystem.uploadAsync(
                  `${backend_url()}upload/`,
                  image,
                  {
                      httpMethod: "POST",
                      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                      fieldName: "photo",
                      headers: {
                          "Authorization": `Bearer ${newAccessToken}`,
                      },
                  }
              );

              if (retryResponse.status !== 201) {
                  throw new Error("Failed to upload image on retry!");
              } else {
                  console.log('Image uploaded successfully on retry:', retryResponse.body);
              }
          } catch (retryError: any) {
              console.error('Retry failed', retryError);

          }
      } else {
          console.error(error);

      }
  }
};


  return (
    <View style={styles.container}>
      {!image ? displayCamera() : displayTakenImage(image)}
    </View>
  );

}
export default HomePage;
