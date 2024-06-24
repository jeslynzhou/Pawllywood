import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../initializeFB';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import NavigationBar from '../../components/navigationBar';
import EditProfileScreen from './editProfileScr';
import LogoutModal from './components/logoutModal';

export default function ProfileScreen({ handleSignOut, directToNotebook, directToHome, directToLibrary, directToForum }) {
  const [currentScreen, setCurrentScreen] = useState('Profile');
  const [userProfile, setUserProfile] = useState({
    username: '',
    picture: null,
    description: '',
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is currently signed in.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setCurrentScreen('EditProfile');
  };

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
        setCurrentScreen('Profile');
        console.log('Profile updated successfully!');
      } else {
        console.log('No user is currently signed in.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  const closeEditUserProfile = () => {
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
                <Image source={userProfile.picture} style={styles.profileImage} />
              </View>

              {/* Username and Description */}
              <View style={styles.profileTextContainer}>
                <View style={styles.usernameRow}>
                  <Text style={styles.usernameInput}>{userProfile.username}</Text>
                  <Text style={styles.descriptionInput}>{userProfile.description}</Text>
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
                  <Ionicons name="paw-outline" size={24} color='#000000' />
                  <Text style={styles.featurePanelText}>My Pets</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to My Posts')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="document-outline" size={24} color='#000000' />
                  <Text style={styles.featurePanelText}>My Posts</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Group 2: Friends, Message, Notification */}
            <View style={styles.featureBox}>
              <TouchableOpacity onPress={() => console.log('Navigate to Friends')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="people-outline" size={24} color='#000000' />
                  <Text style={styles.featurePanelText}>Friends</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to Message')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color='#000000' />
                  <Text style={styles.featurePanelText}>Message</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={() => console.log('Navigate to Notification')}>
                <View style={styles.featurePanel}>
                  <Ionicons name="notifications-outline" size={24} color='#000000' />
                  <Text style={styles.featurePanelText}>Notification</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>

              <View style={styles.separatorLine} />

              <TouchableOpacity onPress={openLogoutModal}>
                <View style={styles.featurePanel}>
                  <Ionicons name="log-out-outline" size={24} color='#000000' />
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
      {currentScreen === 'EditProfile' && (
        <EditProfileScreen
          userProfile={userProfile}
          setUserProfile={handleUpdateProfile}
          closeEditUserProfile={closeEditUserProfile}
        />
      )}
      <LogoutModal
        visible={showLogoutModal}
        onClose={closeLogoutModal}
        onLogout={handleLogout}
      />
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
    borderWidth: 1,
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
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  featurePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
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