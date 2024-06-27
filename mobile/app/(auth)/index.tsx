import { UseWarmUpBrowser } from "@/hooks/UseWarmUpBrowser";
import { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, useNavigation } from "expo-router";

import styles from "./index.styles";

const LogIn = () => {
  const router = useRouter();
  UseWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [mailPlaceholder, setMailPlaceholder] = useState("Adresse mail");
  const [passwordPlaceholder, setPasswordPlaceholder] =
    useState("Mot de passe");
  const checkInputs = () => {
    if (checkMailInput() && checkPasswordInput()) {
      onSignInPress();
    }
  };
  const checkMailInput = () => {
    if (emailAddress === "") {
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
  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err, "login erreur");
    }
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanMate</Text>
      <View style={styles.formContainer}>
        <Text style={styles.titleForm}>Identification</Text>
        <View style={styles.inputArea}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.inputField}
            placeholder={mailPlaceholder}
            value={emailAddress}
            onChangeText={(emailAddress: string) =>
              setEmailAddress(emailAddress)
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

        <TouchableOpacity style={styles.btn} onPress={onSignInPress}>
          <Text style={styles.btnText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogIn;
