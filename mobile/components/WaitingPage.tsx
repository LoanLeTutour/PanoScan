import React from 'react';
import { View, Image, Animated, Easing } from 'react-native';
import { styles } from './WaitingPage.styles';
// Fonction pour créer l'animation
const createAnimation = (delay: number) => {
  const animation = new Animated.Value(0);

  Animated.loop(
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
      delay: delay,
      useNativeDriver: true,
    })
  ).start();

  return animation;
};

const LoadingSpinner = () => {
  // Création des animations pour les trois ronds
  const animation1 = createAnimation(0);
  const animation2 = createAnimation(500);
  const animation3 = createAnimation(1000);

  // Interpolation pour les opacités
  const opacity1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1]
  });
  const opacity2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1]
  });
  const opacity3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1]
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../assets/images/logo_panoscan.png')}
        />
      </View>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: opacity1 }]} />
        <Animated.View style={[styles.dot, { opacity: opacity2 }]} />
        <Animated.View style={[styles.dot, { opacity: opacity3 }]} />
      </View>
    </View>
  );
};

export default LoadingSpinner;