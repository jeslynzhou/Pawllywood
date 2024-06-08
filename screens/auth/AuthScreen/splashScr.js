import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const SplashScreen = ({ onTimeout }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTimeout]);

  const { width, height } = Dimensions.get('window');
  //image or logo
  const imageSize = height * 0.63; //size of image (dogs and cats)
  const imagePosition = {
    bottom: -0.05 * imageSize,
    right: -0.17 * imageSize,
  }; //postion of image
  //slogan
  const fontSize = height * 0.055; //size of slogan
  const marginVertical = fontSize * 0.05; // vertical margin of slogan to be 5% of font size
  //image2 or inline image
  const inlineImageSize = width * 0.15; // size of image2 (decorations)
  const image2MarginTop = -0.18 * width; // the image2 margin top
  //slogan container
  const sloganCmarginTop = height * 0.08;

  return (
    <View style={styles.container}>
      <View style={[styles.sloganContainer, { marginTop: sloganCmarginTop }]}>
        <Text style={[styles.slogan, { fontSize, lineHeight: fontSize, marginVertical }]}>Connect,</Text>
        <View style={styles.inlineContainer}>
          <Text style={[styles.slogan, { fontSize, lineHeight: fontSize, marginVertical }]}>Learn, Love</Text>
          <View style={styles.inlineImageContainer}>
            <Image
              source={require('../../../assets/app_images/splashScr_Image2.png')}
              style={{ width: inlineImageSize, height: inlineImageSize, marginTop: image2MarginTop }}
            />
          </View>
        </View>
        <Text style={[styles.slogan, { fontSize, lineHeight: fontSize, marginVertical }]}>with</Text>
        <Text style={[styles.slogan, styles.pawllywood, { fontSize, lineHeight: fontSize, marginVertical }]}>Pawllywood</Text>
      </View>
      <Image
        source={require('../../../assets/app_images/splashScr_Image.png')}
        style={[styles.image, { width: imageSize, height: imageSize }, imagePosition]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9D9',
    justifyContent: 'flex-start', // Align slogan to the top left corner
    alignItems: 'flex-start',
    padding: 20,
  },
  sloganContainer: {
    marginLeft: 15,
  },
  slogan: {
    fontWeight: 'bold',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inlineImageContainer: {
    justifyContent: 'flex-end',
  },
  pawllywood: {
    color: '#F26419',
  },
  image: {
    position: 'absolute',
  },
});

export default SplashScreen;
