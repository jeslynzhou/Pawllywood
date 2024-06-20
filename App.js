import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js';
import SplashScreen from './screens/auth/AuthScreen/splashScr.js';
import ProfileScreen from './screens/profile/profileScr.js';
import LibraryScreen from './screens/library/libraryScr.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './initializeFB.js'; // Use the configured auth
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

  const directToLibrary = () => {
    setCurrentScreen('Library');
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
          directToProfile={directToProfile}
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
