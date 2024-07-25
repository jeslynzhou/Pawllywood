import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { getExpoPushTokenAsync, setNotificationChannelAsync } from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';


import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js';
import SplashScreen from './screens/auth/AuthScreen/splashScr.js';
import ProfileScreen from './screens/profile/screens/profileScr.js';
import NotebookScreen from './screens/notebook/screens/notebookScr.js';
import HomeScreen from './screens/home/screens/homeScr.js';
import LibraryScreen from './screens/library/libraryScr.js';
import ForumScreen from './screens/forum/forumScr.js';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './initializeFB.js'; // Use the configured auth
import { styles } from './components/styles.js';
import MyPostsScreen from './screens/profile/screens/myPostsScr.js';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // State to manage splash screen
  const [currentScreen, setCurrentScreen] = useState('Auth'); // Track current screen

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable permissions for notifications.');
        return;
      }
    };

    requestPermissions();

    // Configure notification handlers
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    // Cleanup listeners on unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => subscription.remove();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await getExpoPushTokenAsync()).data;
    console.log('Generated Expo push token:', token);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        expoPushToken: token,
      });
      console.log('Expo push token updated successfully');
    } catch (error) {
      console.error('Error updating expoPushToken:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    resetInputFields();
  }, [isLogin]);

  const resetInputFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRetypePassword('');
  };

  const handleSplashScreenTimeout = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onTimeout={handleSplashScreenTimeout} />;
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('You have signed out successfully!');
      setCurrentScreen('Auth');
      setIsLogin(true);
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  const directToProfile = () => {
    setCurrentScreen('Profile');
  };

  const directToNotebook = () => {
    setCurrentScreen('Notebook')
  };

  const directToHome = () => {
    setCurrentScreen('Home');
  };

  const directToLibrary = () => {
    setCurrentScreen('Library');
  };

  const directToForum = () => {
    setCurrentScreen('Forum');
  };

  return (
    <ScrollView contentContainerStyle={styles.appContainer}>
      {currentScreen === 'Auth' && (
        <AuthScreen
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          retypePassword={retypePassword}
          setRetypePassword={setRetypePassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === 'Authenticated' && (
        <AuthenticatedScreen
          user={user}
          handleAuthentication={() => setCurrentScreen('Auth')}
          directToHome={directToHome}
        />
      )}
      {currentScreen === 'Profile' && (
        <ProfileScreen
          user={user}
          handleSignOut={handleSignOut}
          directToNotebook={directToNotebook}
          directToHome={directToHome}
          directToLibrary={directToLibrary}
          directToForum={directToForum}
        />
      )}
      {currentScreen === 'Notebook' && (
        <NotebookScreen
          directToProfile={directToProfile}
          directToHome={directToHome}
          directToLibrary={directToLibrary}
          directToForum={directToForum}
        />
      )}
      {currentScreen === 'Home' && (
        <HomeScreen
          directToProfile={directToProfile}
          directToNotebook={directToNotebook}
          directToLibrary={directToLibrary}
          directToForum={directToForum}
        />
      )}
      {currentScreen === 'Library' && (
        <LibraryScreen
          directToProfile={directToProfile}
          directToNotebook={directToNotebook}
          directToHome={directToHome}
          directToForum={directToForum}
        />
      )}
      {currentScreen === 'Forum' && (
        <ForumScreen
          directToProfile={directToProfile}
          directToNotebook={directToNotebook}
          directToHome={directToHome}
          directToLibrary={directToLibrary}
        />
      )}
      {currentScreen === 'MyPosts' && (
        <MyPostsScreen
          closeMyPostsScreen={() => { setCurrentScreen('Profile'), console.log('Back to Profile') }}
          directToProfile={directToProfile}
          directToNotebook={directToNotebook}
          directToHome={directToHome}
          directToLibrary={directToLibrary}
          directToForum={directToForum}
        />
      )}
    </ScrollView>
  );
};

export default App;