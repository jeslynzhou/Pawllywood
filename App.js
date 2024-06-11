import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import ProfileScreen from './screens/profile/profileScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js'; // Import the AuthenticatedScreen component
import SplashScreen from './screens/auth/AuthScreen/splashScr.js'; // Import the SplashScreen component
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
  const [showAuthenticatedScreen, setShowAuthenticatedScreen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('You have signed in successfully!');
          setShowAuthenticatedScreen(true);
        } else {
          // Sign up
          if (password !== retypePassword) {
            console.error("Passwords don't match");
            return;
          }
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
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

  const navigateToProfile = () => {
    setShowAuthenticatedScreen(false);
  };

  if (isLoading) {
    return <SplashScreen onTimeout={handleSplashScreenTimeout} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.appContainer}>
      {user ? (
        // Show authenticated screen if user is authenticated
        showAuthenticatedScreen ? (
          <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} navigateToProfile={navigateToProfile} />
        ) : (
          <ProfileScreen user={user} handleSignOut={handleSignOut} resetInputFields={resetInputFields} />
        )
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
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
    </ScrollView>
  );
}

export default App;
