import React from 'react';
import LogInScreen from './logIn';
import SignUpScreen from './signUp';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AuthScreen = ({ 
  username, setUsername, 
  email, setEmail, 
  password, setPassword, 
  retypePassword, setRetypePassword, 
  isLogin, setIsLogin, 
  handleAuthentication 
}) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {isLogin && (
        <Image
          source={require('/Users/j6s1yn8z/Pawllywood/assets/app_images/magic_cat.png')}
          style={styles.image}
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
    marginTop: '10%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 25,
    marginBottom: 16,
    textAlign: 'left',
    marginTop: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  image: {
    alignSelf: 'center',
  },
  toggleButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: '#F26419',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});

export default AuthScreen;
