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


import styles from "../(tabs)styles/photo.styles";
import { backend_url } from "@/constants/backend_url";
import { useAuth } from "../context/AuthContext";
import { usePhotos } from "../context/PhotoContext";
import LoadingSpinner from "@/components/WaitingPage";


const imgDir = FileSystem.documentDirectory + 'photos/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true});
  }
};

const HomePage: React.FC = () => {
  const {userId, loading, accessToken, refreshToken, setLoading, refreshAccessToken, logout} = useAuth()
  const { fetchPhotos} = usePhotos();
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string>("");
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setflashMode] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

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

  // Commande pour tester ponctuellement l'authentification
  /*const toggleCameraFacing = () => {
    logout()}*/

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
  
  const uploadPhoto = async () => {
    setLoading(true)
    try {
      if (!userId || !accessToken) {
        console.error('User not authenticated');
        return;
      }
      let tokenToUse = accessToken
      if (refreshToken) {
        try {
          const response = await refreshAccessToken(refreshToken)
          if (response) {
            tokenToUse = response
          } else {
            console.error('Failed to retrieve access token')
            return
          }
        } catch (refreshError) {
          console.error('Failed to refresh access token')
          return;
        }
        
        const uploadResponse = await FileSystem.uploadAsync(
          `${backend_url()}upload/`,
          image,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'photo',
            headers: {
              Authorization: `Bearer ${tokenToUse}`,
            },
          }
        );
  
        if (uploadResponse.status === 201) {
          fetchPhotos();
          setImage("")
        } else {
          console.error(`Failed to upload image. Status: ${uploadResponse.status}`)
          
        }
      }

      
    
    }catch (error: any){
      console.error('Error uploading image:', error);
    }finally {
      setLoading(false)
    }
  }


  return (
    loading ? <LoadingSpinner/> :
    <View style={styles.container}>
      {!image ? displayCamera() : displayTakenImage(image)}
    </View>
  );

}
export default HomePage;
