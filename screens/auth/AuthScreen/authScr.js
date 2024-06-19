import React from 'react';
import LogInScreen from './logIn';
import SignUpScreen from './signUp';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { styles } from '../../../components/styles';

const AuthScreen = ({
  username, setUsername,
  email, setEmail,
  password, setPassword,
  retypePassword, setRetypePassword,
  isLogin, setIsLogin,
  handleAuthentication
}) => {
  const { width, height } = Dimensions.get('window');
  // image
  const imageSize = height * 0.2; // size of image (dogs and cats)

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

export default AuthScreen;
