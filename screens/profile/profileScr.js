import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../../components/navigationBar';
import EditProfileScreen from './editProfileScr';
import LogoutModal from './logoutModal';

export default function ProfileScreen({ username: initialUsername, handleSignOut, directToProfile, directToLibrary }) {
  const [profileImage, setProfileImage] = useState(require('../../assets/default-profile-picture.png'));
  const [username, setUsername] = useState(initialUsername);
  const [description, setDescription] = useState('');
  const [currentScreen, setCurrentScreen] = useState('Profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);


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

  const MAX_DESCRIPTION_LENGTH = 80;
  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(text);
    }
  };

  const handleEditProfile = () => {
    setCurrentScreen('EditProfile');
  };
  const handleAddingPets = () => {
    console.log('Adding pet!');
  }

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    handleSignOut();
    setShowLogoutModal(false);
  };

  return (
    <>
      {currentScreen === 'Profile' && (
        <View style={styles.profileContainer}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.profileInfoContent}>
              {/* Profile Picture */}
              <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
                <Image source={profileImage} style={styles.profileImage} />
              </TouchableOpacity>

              {/* Username and Bio description */}
              <View style={styles.profileTextContainer}>
                <View style={styles.usernameRow}>
                  <Text style={styles.usernameInput}>{username}</Text>
                </View>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Write something about yourself"
                  multiline
                  numberOfLines={3}
                  value={description}
                  onChangeText={handleDescriptionChange}
                />
                <View style={styles.functionButtonBox}>
                  <TouchableOpacity onPress={handleEditProfile} style={styles.functionButton}>
                    <Text style={styles.functionButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddingPets} style={styles.functionButton}>
                    <Text style={styles.functionButtonText}>Add Pets</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Function Button Groups */}
          <View style={styles.featurePanelGroup}>
            {/* Group 1: My Pets and My Posts */}
            <View style={styles.featureBox}>
              <TouchableOpacity onPress={() => console.log('Navigate to My Pets')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="paw-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>My Pets</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to My Posts')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="newspaper-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>My Posts</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Group 2: Friends, Message, Notification */}
            <View style={styles.featureBox}>
              <TouchableOpacity onPress={() => console.log('Navigate to Friends')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="people-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>Friends</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to Message')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>Message</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to Notification')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="notifications-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>Notification</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={openLogoutModal}>
                <View style={styles.featurePanel}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                  <Text style={styles.featurePanelText}>Log out</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>
            </View>
          </View >

          {/* Navigation Bar */}
          <NavigationBar
            activeScreen={currentScreen}
            directToProfile={directToProfile}
            directToLibrary={directToLibrary}
          />
        </View>
      )}
      <LogoutModal
        visible={showLogoutModal}
        onClose={closeLogoutModal}
        onLogout={handleLogout}
      />
      {currentScreen === 'EditProfile' && (
        <EditProfileScreen
          username={username}
          setUsername={setUsername}
          closeEditProfile={() => setCurrentScreen('Profile')}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  profileInfoContainer: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 40,
    borderRadius: 40,
    marginTop: -10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  profileInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileTextContainer: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionInput: {
    fontSize: 16,
  },
  functionButtonBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginVertical: '5%',
    marginLeft: -15,
  },
  functionButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  functionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  featurePanelGroup: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureBox: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  featurePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  featurePanelText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  button: {
    height: 45,
    backgroundColor: '#F26419',
    borderColor: '#F26419',
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});