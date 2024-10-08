import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from '../../../initializeFB';
import { doc, setDoc } from 'firebase/firestore';
import UploadImageModal from '../components/uploapImageModal';

export default function EditProfileScreen({ userProfile, setUserProfile, closeEditUserProfile }) {
    const [editedUserProfile, setEditedUserProfile] = useState({ ...userProfile });
    const [descriptionLength, setDescriptionLength] = useState(editedUserProfile.description.length);
    const [pictureUri, setPictureUri] = useState(editedUserProfile.picture || null);
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);

    useEffect(() => {
        setEditedUserProfile({ ...userProfile });
        setDescriptionLength(userProfile.description.length);
        setPictureUri(userProfile.picture || null);
    }, [userProfile]);

    const handleOpenUploadImageModal = () => {
        setShowUploadImageModal(true);
    };

    const handleCloseUploadImageModal = () => {
        setShowUploadImageModal(false);
    };

    const handleUploadFromCamera = async () => {
        try {
            let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('Permission Denied', 'Permission to access camera is required.');
                return;
            }

            let cameraResult = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.2,
            });

            if (!cameraResult.canceled) {
                await handleImageUpload(cameraResult.assets[0].uri);
            }
        } catch (error) {
            console.log('Error uploading image from camera:', error);
        }
    };

    const handleUploadFromLibrary = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('Permission Denied', 'Permission to access library is required!');
                return;
            }

            let libraryResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.2,
            });

            if (!libraryResult.canceled) {
                await handleImageUpload(libraryResult.assets[0].uri);
            }
        } catch (error) {
            console.log('Error uploading image from library:', error);
        }
    };

    const handleImageUpload = async (uri) => {
        try {
            setShowUploadImageModal(false);
            const uploadedUrl = await uploadImageAsync(uri);
            setPictureUri(uploadedUrl);
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };

    const uploadImageAsync = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
        await uploadBytes(fileRef, blob);
        return await getDownloadURL(fileRef);
    };

    const handleDescriptionChanges = (text) => {
        if (text.length <= 80) {
            setEditedUserProfile({ ...editedUserProfile, description: text });
            setDescriptionLength(text.length);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const updatedProfile = { ...editedUserProfile };
            if (pictureUri) {
                updatedProfile.picture = pictureUri;
            }

            await handleUpdateProfile(updatedProfile);
            closeEditUserProfile();
            console.log('Your profile has been updated successfully.');
        } catch (error) {
            console.error('Error saving changes:', error.message);
        }
    };

    const handleUpdateProfile = async (updatedProfile) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, updatedProfile, { merge: true });
                setUserProfile(updatedProfile);
            } else {
                console.log('No user is currently signed in.');
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    return (
        <View style={styles.editProfileContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeEditUserProfile} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit profile</Text>
            </View>

            {/* Edit Profile Form */}
            <View style={styles.contentContainer}>
                {/* Profile Picture */}
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageContainer}>
                    <Image source={{ uri: pictureUri }} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageLabelContainer}>
                    <Text style={styles.profileImageLabel}>Edit picture</Text>
                </TouchableOpacity>

                {/* Username */}
                <Text style={styles.labels}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={editedUserProfile.username}
                    onChangeText={(text) => setEditedUserProfile({ ...editedUserProfile, username: text })}
                    placeholder="Type your username here"
                />

                {/* Description */}
                <View style={styles.labelsAndCharacterCount}>
                    <Text style={styles.labels}>Description</Text>
                    <Text style={styles.characterCountText}>{descriptionLength}/80</Text>
                </View>
                <TextInput
                    style={styles.input}
                    value={editedUserProfile.description}
                    onChangeText={handleDescriptionChanges}
                    placeholder="Type your description here"
                    maxLength={80}
                    multiline
                />

                {/* Save button */}
                <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
                    <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>

                {/* Upload Image Modal */}
                <UploadImageModal
                    visible={showUploadImageModal}
                    onClose={handleCloseUploadImageModal}
                    onUploadFromCamera={handleUploadFromCamera}
                    onUploadFromLibrary={handleUploadFromLibrary}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    editProfileContainer: {
        marginTop: '10%',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 21,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileImageLabelContainer: {
        alignSelf: 'center',
        margin: 10,
    },
    profileImageLabel: {
        fontSize: 14,
    },
    labels: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#616161',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderRadius: 17,
        borderColor: '#000000',
    },
    button: {
        height: 45,
        backgroundColor: '#F26419',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    labelsAndCharacterCount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    characterCountText: {
        fontSize: 12,
        color: '#616161',
        alignSelf: 'center',
        marginRight: 10,
    },
});
