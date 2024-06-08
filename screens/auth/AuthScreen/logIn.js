import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../../components/styles';

const { labels } = styles;

const LogInScreen = ({ email, setEmail, password, setPassword, handleAuthentication }) => {
  return (
    <View>
      <Text style={styles.labels}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Type your email here"
        autoCapitalize="none"
        textContentType="oneTimeCode"
      />
      <Text style={styles.labels}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Type your password here"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleAuthentication} style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogInScreen;
