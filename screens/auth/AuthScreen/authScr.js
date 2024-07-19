import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { auth, db, storage } from '../../../initializeFB';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

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
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        setCurrentScreen('Authenticated');
        console.log('You have signed in successfully!');
      } else {
        if (password !== retypePassword) {
          Alert.alert('Authentication error', "Passwords don't match");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const defaultUserPictureRef = ref(storage, 'default_profile_picture/default_profile_picture.png');
        const defaultUserPictureURL = await getDownloadURL(defaultUserPictureRef);

        await setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: email,
          picture: defaultUserPictureURL,
          description: 'Write something about yourself!',
        });

        const defaultPetPictureRef = ref(storage, 'default_profile_picture/default_pet_image_square.png');
        const defaultPetPictureURL = await getDownloadURL(defaultPetPictureRef);

        const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
        await addDoc(petsCollectionRef, {
          name: 'Your default pet',
          picture: defaultPetPictureURL,
          breed: 'Click on the edit button to start editing now!',
          birthDate: '',
          age: '',
          gender: '',
          adoptedDate: new Date().toLocaleDateString(),
        });

        const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
        const defaultNoteRef = await addDoc(notesCollectionRef, {
          title: 'About Default Pets',
          createdAt: new Date().toLocaleDateString(),
          text: 'I love my pet!',
          folderId: '', // optional
        });

        const foldersCollectionRef = collection(db, 'users', user.uid, 'folders');
        const defaultFolderRef = await addDoc(foldersCollectionRef, {
          folderName: 'My Pets (Default)',
          createdAt: new Date().toLocaleDateString(),
          noteIds: [defaultNoteRef.id], //Array to hold note IDs (for reference)
        });

        // Update the note to include the folderId (the first note gets assigned to the default folder)
        await setDoc(defaultNoteRef, { folderId: defaultFolderRef.id }, { merge: true });

        setCurrentScreen('Authenticated');
        console.log('You have created an account successfully!');
      }
    } catch (error) {
      Alert.alert('Authentication error', 'Please check your email and(/or) your password again.');
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