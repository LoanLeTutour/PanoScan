import { useState} from "react";
import { View, Text,TextInput, TouchableOpacity } from "react-native";
import { useRouter} from "expo-router";
import authService from '../authService';

import styles from "./index.styles";

const LogInScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mailPlaceholder, setMailPlaceholder] = useState<string>("Adresse mail");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState<string>("Mot de passe");
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkInputs = () => {
    if (checkMailInput() && checkPasswordInput()) {
      handleLogin();
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
    try {
      await authService.login(email, password);
      router.replace('(tabs)'); // Navigation vers l'écran d'accueil après connexion réussie
    } catch (error) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PanoScan</Text>
      <View style={styles.formContainer}>
        <Text style={styles.titleForm}>Identification</Text>
        <View style={styles.inputArea}>
          <TextInput
            autoCapitalize="none"
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
