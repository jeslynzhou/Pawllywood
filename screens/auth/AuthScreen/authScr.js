import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { auth, db } from '../../../initializeFB';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

import LogInScreen from './logIn';
import SignUpScreen from './signUp';


const AuthScreen = ({
  username, setUsername,
  email, setEmail,
  password, setPassword,
  retypePassword, setRetypePassword,
  isLogin, setIsLogin,
  setCurrentScreen
}) => {
  const { height } = Dimensions.get('window');
  // image
  const imageSize = height * 0.2;

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setCurrentScreen('Authenticated');
        console.log('You have signed in successfully!');
      } else {
        if (password !== retypePassword) {
          console.error("Passwords don't match");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: email,
          picture: require('../../../assets/profile_images/default_profile_picture.png'),
          description: ''
        });

        const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
        await addDoc(petsCollectionRef, {
          name: '',
          picture: require('../../../assets/home_images/default_pet_image_square.png'),
          breed: '',
          birthDate: '',
          age: '',
          gender: '',
          notes: '',
          adoptedDate: '',
        });

        setCurrentScreen('Authenticated');
        console.log('You have created an account successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {isLogin && (
        <Image
          source={require('../../../assets/app_images/magic_cat.png')}
          style={[styles.image, { width: imageSize, height: imageSize }]}
        />
      )}

      {isLogin ? (
        <LogInScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
        />
      ) : (
        <SignUpScreen
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          retypePassword={retypePassword}
          setRetypePassword={setRetypePassword}
          handleAuthentication={handleAuthentication}
        />
      )}

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: '#FCF9D9',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 25,
    marginBottom: 16,
    textAlign: 'left',
    marginTop: 20,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: '#F26419',
    fontWeight: 'bold',
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});

export default AuthScreen;
