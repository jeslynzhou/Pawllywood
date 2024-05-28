import React from 'react';
import LogInScreen from './logIn';
import SignInScreen from './signIn';
import { View, Text, Image, StyleSheet } from 'react-native';

const AuthScreen = ({ username, setUsername, email, setEmail, password, setPassword, retypePassword, setRetypePassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {isLogin && (
        <Image
          source={require('/Users/j6s1yn8z/Pawllywood/assets/app_images/magic_cat.png')}
          style={styles.image}
        />
      )}

      {!isLogin && (
        <SignInScreen
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

      {isLogin && (
        <LogInScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  image: {
    alignSelf: 'center',
  },
});

export default AuthScreen;
