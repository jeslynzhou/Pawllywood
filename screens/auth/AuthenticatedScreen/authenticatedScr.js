import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const AuthenticatedScreen = ({ user, navigateToProfile }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToProfile();
    }, 2000); // Redirect after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const { width, height } = Dimensions.get('window');
  // title
  const fontSize = height * 0.055; // size of title
  const marginVertical = fontSize * 0.05; // vertical margin of title to be 5% of font size
  // email text
  const usernameFontSize = height * 0.025; // size of email text (adjusted for more appropriate size)
  // image
  const imageSize = height * 0.58; // size of image (dogs and cats)
  const imagePosition = {
    bottom: 0.01 * imageSize,
    left: -0.15 * width,
  }; // position of image
  // title container
  const titleCmarginTop = height * 0.08;

  return (
    <View style={styles.container}>
      <View style={[styles.titleContainer, { marginTop: titleCmarginTop }]}>
        <Text style={[styles.title, { fontSize, lineHeight: fontSize, marginVertical }]}>Welcome</Text>
        <Text style={[styles.usernameText, { fontSize: usernameFontSize, lineHeight: usernameFontSize, marginVertical }]}>{user.username}</Text>
      </View>
      <Image
        source={require('../../../assets/app_images/authenticatedScr_Background.png')}
        style={[styles.image, { width: imageSize, height: imageSize }, imagePosition]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9D9',
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'flex-start', // Align content to the left
    padding: 20,
  },
  titleContainer: {
    marginTop: '3%',
    marginLeft: 5, // No margin from the left
  },
  title: {
    fontWeight: 'bold',
  },
  usernameText: {
    marginTop: 5, // Space between title and email
  },
  image: {
    position: 'absolute',
  },
});

export default AuthenticatedScreen;