import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NavigationBar from '../../components/navigationBar';
import EditProfileScreen from './editProfileScr';
import LogoutModal from './logoutModal';

export default function ProfileScreen({ username: initialUsername, handleSignOut, directToNotebook, directToHome, directToLibrary, directToForum }) {
  const [currentScreen, setCurrentScreen] = useState('Profile');
  const [profileImage, setProfileImage] = useState(require('../../assets/default-profile-picture.png'));
  const [username, setUsername] = useState(initialUsername);
  const [description, setDescription] = useState('Write something about yourself!');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleEditProfile = () => {
    setCurrentScreen('EditProfile');
  };

  const updateProfile = (newUsername, newProfileImage, newDescription) => {
    setUsername(newUsername);
    setProfileImage(newProfileImage);
    setDescription(newDescription);
    setCurrentScreen('Profile');
  };

  const closeEditProfile = () => {
    setCurrentScreen('Profile');
  };

  const handleAddingPets = () => {
    console.log('Adding pet!');
  };

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
              <View style={styles.profileImageContainer}>
                <Image source={profileImage} style={styles.profileImage} />
              </View>

              {/* Username and Description */}
              <View style={styles.profileTextContainer}>
                <View style={styles.usernameRow}>
                  <Text style={styles.usernameInput}>{username}</Text>
                  <Text style={styles.descriptionInput}>{description}</Text>
                </View>
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
                  <Ionicons name="document-outline" size={24} color="black" />
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
            directToNotebook={directToNotebook}
            directToHome={directToHome}
            directToLibrary={directToLibrary}
            directToForum={directToForum}
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
          profileImage={profileImage}
          description={description}
          updateProfile={updateProfile}
          closeEditProfile={closeEditProfile}
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
    paddingTop: 50,
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionInput: {
    fontSize: 14,
  },
  functionButtonBox: {
    flexDirection: 'row',
    marginVertical: '5%',
  },
  functionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 30,
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
    fontSize: 15,
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