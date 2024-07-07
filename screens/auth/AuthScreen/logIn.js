import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LogInScreen = ({ email, setEmail, password, setPassword, handleAuthentication }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(email !== '' && password !== '');
  }, [email, password]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <Text style={styles.labels}>
        Email <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Type your email here"
        autoCapitalize="none"
        textContentType="oneTimeCode"
      />

      <Text style={styles.labels}>
        Password <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Type your password here"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color='#000000' />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleAuthentication} style={[styles.button, isFormValid ? null : styles.disabledButton]} disabled={!isFormValid}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  labels: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 17,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  passwordInput: {
    flex: 1,
  },
  input: {
    height: 45,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 17,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    height: 45,
    backgroundColor: '#F26419',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  disabledButton: {
    height: 45,
    backgroundColor: 'rgba(242, 100, 25, 0.7)',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  required: {
    color: '#F26419',
  },
});

export default LogInScreen;
