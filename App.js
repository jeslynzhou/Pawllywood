import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCGHpSfjU4CJ02RtoGp_01j5cF6P629epg",
  authDomain: "pawllywood-abc3e.firebaseapp.com",
  projectId: "pawllywood-abc3e",
  storageBucket: "pawllywood-abc3e.appspot.com",
  messagingSenderId: "62836081451",
  appId: "1:62836081451:web:7ccb964474f61b6c5c3b6e",
  measurementId: "G-5GGHJXB9BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const AuthScreen = ({ username, setUsername, email, setEmail, password, setPassword, retypePassword, setRetypePassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {isLogin && (
        <Image
          source={require('./assets/magic_cat.png')}
          style={styles.image}
        />
      )}

      {!isLogin && (
        <View>
          <Text style={styles.labels}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Type your username here"
            autoCapitalize="none"
          />
        </View>
      )}
      <Text style={styles.labels}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Type your email here"
        autoCapitalize="none"
      />
      <Text style={styles.labels}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Type your password here"
        secureTextEntry
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          value={retypePassword}
          onChangeText={setRetypePassword}
          placeholder="Retype your password here"
          secureTextEntry
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAuthentication} style={styles.button}>
          <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}


const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};
export default App = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);


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
          await createUserWithEmailAndPassword(auth, username, email, password);
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
  useEffect(() => {
    resetInputFields();
  }, [isLogin]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FCF9D9',
  },
  authContainer: {
    width: '100%', // 80% of the screen width
    height: '90%', // 80% of the screen height
    backgroundColor: '#FCF9D9',
    marginTop: '10%', // Adjust as needed to center vertically
    paddingHorizontal: 16, // Add horizontal padding if needed
  },
  title: {
    fontSize: 25,
    marginBottom: 16,
    textAlign: 'left',
    marginTop: 20, // Adding a top margin here
    fontWeight: 'bold', // Making the text bold
    fontFamily: 'Poppins', // Specify Poppins font family
  },
  labels: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 17,
    borderColor: '#000000',
    borderWidth: 1,
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    height: 45,
    backgroundColor: '#F26419', // Background color
    borderColor: '#F26419', // Border color
    borderWidth: 1, // Border width
    borderRadius: 17, // Border radius
    paddingHorizontal: 16, // Horizontal padding
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Text color
    fontFamily: 'Poppins', // Specify Poppins font family
  },
  toggleText: {
    color: '#F26419',
    textAlign: 'center',
    fontFamily: 'Poppins', // Specify Poppins font family
  },
  bottomContainer: {
    marginTop: 0,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins', // Specify Poppins font family
  },
  image: {
    alignSelf: 'center',
  },
});
