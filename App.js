import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import ProfileScreen from './screens/profile/profileScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js';
import SplashScreen from './screens/auth/AuthScreen/splashScr.js';
import LibraryScreen from './screens/library/libraryScr.js'; // Import the LibraryScreen component
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './initializeFB'; // Use the configured auth
import { styles } from './components/styles.js';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setCurrentScreen('Authenticated');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    resetInputFields();
  }, [isLogin]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('You have logged out successfully!');
        await signOut(auth);
        setCurrentScreen('Auth');
      } else {
        // Log in or sign up
        if (isLogin) {
          // Log in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('You have signed in successfully!');
          setCurrentScreen('Authenticated');
        } else {
          // Sign up
          if (password !== retypePassword) {
            console.error("Passwords don't match");
            return;
          }
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('You have created an account successfully!');
          setCurrentScreen('Authenticated');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('You have signed out successfully!');
      setCurrentScreen('Auth');
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  }

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

  const directToLibrary = () => {
    setCurrentScreen('Library');
  };

  const directToProfile = () => {
    setCurrentScreen('Profile');
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
          handleAuthentication={handleAuthentication}
        />
      )}
      {currentScreen === 'Authenticated' && (
        <AuthenticatedScreen
          user={user}
          handleAuthentication={handleAuthentication}
          navigateToProfile={() => setCurrentScreen('Profile')}
        />
      )}
      {currentScreen === 'Profile' && (
        <ProfileScreen
          user={user}
          handleSignOut={handleSignOut}
          directToLibrary={directToLibrary}
        />
      )}
      {currentScreen === 'Library' && (
        <LibraryScreen
          directToProfile={directToProfile}
        />
      )}
    </ScrollView>
  );
};

export default App;