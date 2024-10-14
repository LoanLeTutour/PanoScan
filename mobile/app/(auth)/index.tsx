import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import styles from "./index.styles";
import LoadingSpinner from "@/components/WaitingPage";

const LogInScreen: React.FC = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mailPlaceholder, setMailPlaceholder] =
    useState<string>("Adresse mail");
  const [passwordPlaceholder, setPasswordPlaceholder] =
    useState<string>("Mot de passe");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login, loading } = useAuth();


  // Premiers filtres pour l'email et le mot de passe une fois le bouton "suivant" poussé
  const checkMailInput = () => {
    if (email === "") {
      setMailPlaceholder("Entrez votre adresse mail");
      setErrorMessage("Vous devez entrer une addresse mail et un mot de passe valides")
      return false;
    }
    return true;
  };
  const checkPasswordInput = () => {
    if (password === "") {
      setPasswordPlaceholder("Entrez votre mot de passe");
      setErrorMessage("Vous devez entrer une addresse mail et un mot de passe valides")
      return false;
    }
    return true;
  };

  const checkInputs = async () => {
    if (checkMailInput() && checkPasswordInput()) {
      await handleLogin();
    }
  };

  // Une fois que les premiers filtres sont passés, la fonction login du AuthContext est appelé
  const handleLogin = async () => {
    console.log("Filtres passés => fonction Login de l'AuthContext");
    const result = await login(email, password);
    console.log("Login finished");

    if (!result.success) {
      console.log(result.message)
      setErrorMessage(result.message || "Erreur inconnue");
    }
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
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
            onChangeText={(email: string) => setEmail(email)}
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
