import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../../../components/styles';

const SignUpScreen = ({ username, setUsername, email, setEmail, password, setPassword, retypePassword, setRetypePassword, handleAuthentication }) => {
  return (
    <View>
      <Text style={styles.labels}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Type your username here"
        autoCapitalize="none"
      />
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
      <TextInput
        style={styles.input}
        value={retypePassword}
        onChangeText={setRetypePassword}
        placeholder="Retype your password here"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleAuthentication} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
