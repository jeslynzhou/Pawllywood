import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignInScreen = ({ username, setUsername, email, setEmail, password, setPassword, retypePassword, setRetypePassword, handleAuthentication }) => {
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

const styles = StyleSheet.create({
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
  button: {
    height: 45,
    backgroundColor: '#F26419',
    borderColor: '#F26419',
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins',
  },
});

export default SignInScreen;
