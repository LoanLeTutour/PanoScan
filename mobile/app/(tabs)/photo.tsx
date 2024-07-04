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

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, {intermediates: true});
  }
};
const imagePickerOptions : ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [9, 16],
  quality: 0.75,
}



const Page = () => {
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
      <View style={styles.container}>
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
        color="white"
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
        console.log(photo);
        setImage(photo.uri);
      } catch (err) {
        console.log(err, "capturing image");
      }
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
            onPress={sendToBackend}
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
        onCameraReady={displayTakePictureButton}
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

  const sendToBackend = () => {};

  return (
    <View style={styles.container}>
      {!image ? displayCamera() : displayTakenImage(image)}
    </View>
  );
};

export default Page;
