import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import UploadImageModal from '../../profile/components/uploapImageModal';
import BirthDateModal from '../components/birthDateModal';
import GenderOptionsModal from '../../profile/components/genderOptionsModal';

export default function EditPetProfileScreen({ petProfile, updatePetProfile, closeEditPetProfile }) {
    const [editedPetProfile, setEditedPetProfile] = useState({ ...petProfile });
    const [pictureUri, setPictureUri] = useState(editedPetProfile.picture || null);
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [showBirthDateModal, setShowBirthDateModal] = useState(false);
    const [showGenderOptionsModal, setShowGenderOptionsModal] = useState(false);

    useEffect(() => {
        setEditedPetProfile({ ...petProfile });
        setPictureUri(petProfile.picture || null);
    }, [petProfile]);

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
                quality: 1,
            });

            if (!cameraResult.canceled) {
                setPictureUri(cameraResult.assets[0].uri);
                setShowUploadImageModal(false);
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
                quality: 1,
            });

            if (!libraryResult.canceled) {
                setPictureUri(libraryResult.assets[0].uri);  // Updated here to use the correct URI format
                setShowUploadImageModal(false);
            }
        } catch (error) {
            console.log('Error uploading image from library:', error);
        }
    };

    const openBirthDateModal = () => {
        setShowBirthDateModal(true);
    };

    const closeBirthDateModal = () => {
        setShowBirthDateModal(false);
    };

    const handleDateSelect = (date) => {
        try {
            const dateParts = date.split('/');
            const selectedDay = parseInt(dateParts[0], 10);
            const selectedMonth = parseInt(dateParts[1], 10);
            const selectedYear = parseInt(dateParts[2], 10);

            const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
            const today = new Date();

            // Check if selected date is after today's date
            if (selectedDate > today) {
                Alert.alert('Invalid Date', 'Please select a date that is not later than today.');
                return;
            }

            // Calculate age
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }

            setEditedPetProfile({
                ...editedPetProfile,
                birthDate: date,
                age: age.toString(),
            });

            closeBirthDateModal();
        } catch (error) {
            console.error('Error formatting date:', error);
        }

    };

    const openGenderOptionsModal = () => {
        setShowGenderOptionsModal(true);
    };

    const closeGenderOptionsModal = () => {
        setShowGenderOptionsModal(false);
    };

    const handleGenderSelect = (selectedGender) => {
        setEditedPetProfile({
            ...editedPetProfile,
            gender: selectedGender,
        });
    };

    const handleSaveChanges = async () => {
        try {
            const updatedPetProfile = { ...editedPetProfile };
            if (pictureUri) {
                updatedPetProfile.picture = pictureUri;
            }

            await updatePetProfile(updatedPetProfile);
            closeEditPetProfile();
            console.log('Pet Profile updated successfully!');
        } catch (error) {
            console.error('Error saving pet changes:', error.message);
        }
    };

    return (
        <View style={styles.editProfileContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeEditPetProfile} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Pet Profile</Text>
            </View>

            {/* Edit Pet Profile Form */}
            <View style={styles.contentContainer}>
                {/* Pet Picture */}
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageContainer}>
                    <Image source={{ uri: pictureUri }} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageLabelContainer}>
                    <Text style={styles.profileImageLabel}>Edit picture</Text>
                </TouchableOpacity>

                {/* Pet name */}
                <Text style={styles.labels}>Pet Name</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetProfile.name}
                    onChangeText={(text) => setEditedPetProfile({ ...editedPetProfile, name: text })}
                    placeholder="Type your pet's name here"
                />

                {/* Breed */}
                <Text style={styles.labels}>Breed</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetProfile.breed}
                    onChangeText={(text) => setEditedPetProfile({ ...editedPetProfile, breed: text })}
                    placeholder="Type your pet's breed here"
                />

                {/* Birth Date */}
                <Text style={styles.labels}>Birth Date</Text>
                <TouchableOpacity onPress={openBirthDateModal} style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: editedPetProfile.birthDate ? '#000000' : '#6E6E6E' }]}>
                            {editedPetProfile.birthDate || "Select your pet's birthdate"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Age */}
                <Text style={styles.labels}>Age</Text>
                <View style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: editedPetProfile.age ? '#000000' : '#6E6E6E' }]}>
                            {editedPetProfile.age || "Age will be automatically display"}
                        </Text>
                    </View>
                </View>

                {/* Gender */}
                <Text style={styles.labels}>Gender</Text>
                <TouchableOpacity onPress={openGenderOptionsModal} style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: editedPetProfile.gender ? '#000000' : '#6E6E6E' }]}>
                            {editedPetProfile.gender || "Select your pet's gender"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

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

            {/* Birth Date Modal */}
            <BirthDateModal
                visible={showBirthDateModal}
                onDateSelect={handleDateSelect}
                onClose={closeBirthDateModal}
            />
            {/* Gender Modal */}
            <GenderOptionsModal
                visible={showGenderOptionsModal}
                onSelectedGender={handleGenderSelect}
                onClose={closeGenderOptionsModal}
            />
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
        width: 160,
        height: 160,
        borderWidth: 1,
        borderRadius: 17,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 15,
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
    inputTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
