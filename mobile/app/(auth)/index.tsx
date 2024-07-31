import { useState, useEffect} from "react";
import { View, Text,TextInput, TouchableOpacity} from "react-native";
import { useRouter} from "expo-router";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./index.styles";
import axios from "axios";
import { backend_url } from "@/constants/backend_url";
import LoadingSpinner from "@/components/WaitingPage";
const LogInScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mailPlaceholder, setMailPlaceholder] = useState<string>("Adresse mail");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState<string>("Mot de passe");
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {login, loading} = useAuth()

  const checkLoggedIn = async (key: string) => {
    console.log('check logged in function in index page')
    try {
    const refreshToken = await AsyncStorage.getItem(key);
    console.log('refresh token from asyncstorage:', refreshToken)
    if (!refreshToken) {
      return
    }
    console.log('refreshing the access token')
    const response = await axios.post(`${backend_url()}token/refresh/`, {
      refresh: refreshToken,
    });
    const { access} = response.data;
    console.log('accessToken updated:', access)
    await AsyncStorage.setItem('accessToken', access);
    console.log('updated accessToken to asyncStorage')
    router.replace('(tabs)/photo')
    console.log('redirect to photo page')
    } catch(error:any){
      console.log('key existence checking error', error)
      if (error.response && error.response.status === 401){
        return;
      }
    }
  };
  useEffect(() => {
    checkLoggedIn('refreshToken')
  }, []);
  
  const checkInputs = async () => {
    if (checkMailInput() && checkPasswordInput()) {
      await handleLogin();
    }
  };
  const checkMailInput = () => {
    if (email === "") {
      setMailPlaceholder("Entrez votre adresse mail");
      return false;
    }
    return true;
  };

  const checkPasswordInput = () => {
    if (password === "") {
      setPasswordPlaceholder("Entrez votre mot de passe");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    console.log('Handling login...');
    
    const result = await login(email, password);
    console.log('Login finished');
  
    if (!result.success) {
      setErrorMessage(result.message || 'Erreur inconnue');
    }
  };

  

  return (
    loading ? <LoadingSpinner/> :
    <View style={styles.container}>
      <Text style={styles.title}>PanoScan</Text>
      <View style={styles.formContainer}>
        <Text style={styles.titleForm}>Identification</Text>
        <View style={styles.inputArea}>
          <TextInput
            autoCapitalize="none"
            inputMode="email"
            keyboardType="email-address"
            style={styles.inputField}
            placeholder={mailPlaceholder}
            value={email}
            onChangeText={(email: string) =>
              setEmail(email)
            }
          />
          <TextInput
            autoCapitalize="none"
            inputMode="text"
            keyboardType="default"
            style={styles.inputField}
            placeholder={passwordPlaceholder}
            value={password}
            secureTextEntry={true}
            onChangeText={(password: string) => setPassword(password)}
          />
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={checkInputs}>
          <Text style={styles.btnText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogInScreen;
