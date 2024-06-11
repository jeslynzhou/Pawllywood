import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../../components/styles';

const AuthenticatedScreen = ({ user, navigateToProfile }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToProfile();
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/app_images/authenticatedScr_Background.png')}
          style={styles.image} />
      </View>
    </View>
  );
};

export default AuthenticatedScreen;
