import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { styles } from '../../../components/styles';

const AuthenticatedScreen = ({ user, handleAuthentication, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.emailText}>{user.email}</Text>
        <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Text style={styles.bottomBarButtonText}>User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Notebook')}
        >
          <Text style={styles.bottomBarButtonText}>Notebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.bottomBarButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.bottomBarButtonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Forum')}
        >
          <Text style={styles.bottomBarButtonText}>Forum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthenticatedScreen;
