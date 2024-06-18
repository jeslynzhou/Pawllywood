import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../../components/navigationBar';

export default function ProfileScreen({ username: initialUsername, handleSignOut, directToProfile, directToLibrary }) {
  const [profileImage, setProfileImage] = useState(require('../../assets/default-profile-picture.png'));
  const [username, setUsername] = useState(initialUsername);
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [description, setDescription] = useState('');
  const [currentScreen, setCurrentScreen] = useState('Profile');


  const handleImagePicker = async () => {
    // Request permission to access the media library
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required.');
      return;
    }

    // Launch image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setProfileImage({ uri: pickerResult.uri });
    }
  };

  const handleTakePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera is required.');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setProfileImage({ uri: pickerResult.uri });
    }
  };

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
    // Here you can save the updated username to AsyncStorage or send it to your backend
    setIsEditingUsername(false); // Close the modal after username change
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const openUsernameModal = () => {
    setIsEditingUsername(true);
    setNewUsername(username); // Initialize input field with current username
  };

  const closeUsernameModal = () => {
    setIsEditingUsername(false);
    setNewUsername(''); // Clear input field
  };

  const saveUsername = () => {
    if (newUsername.trim() !== '') {
      setUsername(newUsername.trim()); // Update username state
      // Here you can save the updated username to AsyncStorage or send it to your backend
      setIsEditingUsername(false); // Close the modal after username change
    }
  };

  return (
    <>
      <View style={styles.profileInfoContainer}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>

        {/* Username and Bio description */}
        <View style={styles.profileTextContainer}>
          <View style={styles.usernameRow}>
            <Text style={styles.usernameInput}>{username}</Text>
            <TouchableOpacity onPress={openUsernameModal}>
              <Ionicons name="pencil-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Write something about yourself"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={handleDescriptionChange}
          />
        </View>
      </View>

      <View style={styles.profileContainer}>
        {/* My Pets and My Posts Button */}
        <View style={styles.functionButtonContainer}>
          <TouchableOpacity onPress={() => console.log('Navigate to My Pets')}>
            <View style={styles.functionButton}>
              <Ionicons name="paw-outline" size={24} color="black" />
              <Text style={styles.functionButtonText}>My Pets</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Navigate to My Posts')}>
            <View style={styles.functionButton}>
              <Ionicons name="newspaper-outline" size={24} color="black" />
              <Text style={styles.functionButtonText}>My Post</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Log out button */}
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>

        {/* Modal for Username Change */}
        <Modal
          visible={isEditingUsername}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Username</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={handleUsernameChange}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={closeUsernameModal} style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveUsername} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Navigation Bar (Footer) */}
        <NavigationBar
          activeScreen={currentScreen}
          directToProfile={directToProfile}
          directToLibrary={directToLibrary}
        />
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: '#FCF9D9',
    justifyContent: 'space-between',
    width: '100%',
    height: '90%',
    backgroundColor: '#FCF9D9',
    marginTop: '10%',
    paddingHorizontal: 5,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTextContainer: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  functionButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  functionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  functionButtonText: {
    marginLeft: 10,
    fontSize: 16,
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
  },
  savedDescription: {
    marginTop: 10,
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    minWidth: 300,
    maxWidth: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});


