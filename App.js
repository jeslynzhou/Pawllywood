import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/auth/AuthScreen/authScr.js';
import AuthenticatedScreen from './screens/auth/AuthenticatedScreen/authenticatedScr.js';
import SplashScreen from './screens/auth/AuthScreen/splashScr.js';
import LibraryScreen from './screens/auth/AuthenticatedScreen/libraryScr.js'; // Import the LibraryScreen component
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './initializeFB'; // Use the configured auth
import { styles } from './components/styles.js';

const Stack = createStackNavigator();

const App = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // State to manage splash screen

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false); // Stop loading once auth state is determined
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Authenticated' : 'Auth'}>
        <Stack.Screen name="Auth">
          {props => (
            <AuthScreen
              {...props}
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
        </Stack.Screen>
        <Stack.Screen name="Authenticated">
          {props => (
            <AuthenticatedScreen
              {...props}
              user={user}
              handleAuthentication={handleAuthentication}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Library" component={LibraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
