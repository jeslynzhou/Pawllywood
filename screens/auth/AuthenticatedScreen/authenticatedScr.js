import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { db } from '../../../initializeFB';
import { doc, getDoc } from 'firebase/firestore';

const AuthenticatedScreen = ({ user, directToHome }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();

    const timer = setTimeout(() => {
      directToHome();
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  const { width, height } = Dimensions.get('window');
  const fontSize = height * 0.055;
  const marginVertical = fontSize * 0.05;
  const usernameFontSize = height * 0.025;
  const imageSize = height * 0.58;
  const imagePosition = {
    bottom: 0.01 * imageSize,
    left: -0.15 * width,
  };
  const titleCmarginTop = height * 0.08;

  return (
    <View style={styles.container}>
      <View style={[styles.titleContainer, { marginTop: titleCmarginTop }]}>
        <Text style={[styles.title, { fontSize, lineHeight: fontSize, marginVertical }]}>Welcome</Text>
        <Text style={[styles.usernameText, { fontSize: usernameFontSize, lineHeight: usernameFontSize, marginVertical }]}>
          {userData && userData.username}
        </Text>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  titleContainer: {
    marginTop: '3%',
    marginLeft: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  usernameText: {
    marginTop: 5,
  },
  image: {
    position: 'absolute',
  },
});

export default AuthenticatedScreen;
