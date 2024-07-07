import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';

import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js';
import SplashScreen from './screens/auth/AuthScreen/splashScr.js';
import ProfileScreen from './screens/profile/screens/profileScr.js';
import NotebookScreen from './screens/notebook/notebookScr.js';
import HomeScreen from './screens/home/screens/homeScr.js';
import LibraryScreen from './screens/library/libraryScr.js';
import ForumScreen from './screens/forum/forumScr.js';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './initializeFB.js'; // Use the configured auth
import { styles } from './components/styles.js';
import MyPostsScreen from './screens/profile/screens/myPostsScr.js';

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
    </ScrollView>
  );
};

export default App;
