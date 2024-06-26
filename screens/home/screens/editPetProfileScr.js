import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import BirthDateModal from '../components/birthDateModal';

export default function EditPetProfileScreen({ petProfile, updatePetProfile, closeEditPetProfile }) {
    const [editedPetProfile, setEditedPetProfile] = useState({ ...petProfile });
    const [profileImage, setProfileImage] = useState(petProfile.profileImage);
    const [showBirthDateModal, setShowBirthDateModal] = useState(false);

    useEffect(() => {
        setProfileImage(petProfile.picture);
        setEditedPetProfile({ ...petProfile });
    }, [petProfile]);

    const handleSaveChanges = async () => {
        try {
            await updatePetProfile(editedPetProfile);
            closeEditPetProfile();
            console.log('Pet Profile updated successfully!');
        } catch (error) {
            console.error('Error saving pet changes:', error.message);
        }
    };

    const handleImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setProfileImage(pickerResult.uri);
            setEditedPetProfile({ ...editedPetProfile, picture: pickerResult.uri });
        }
    };

    const openBirthDateModal = () => {
        setShowBirthDateModal(true);
    };

    const closeBirthDateModal = () => {
        setShowBirthDateModal(false);
    };

    const handleDateSelect = (date) => {
        setEditedPetProfile({ ...editedPetProfile, birthDate: date });
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
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageLabelContainer}>
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
                    <View style={styles.dateTextContainer}>
                        <Text style={[{ color: editedPetProfile.birthDate ? '#000000' : '#6E6E6E' }]}>
                            {editedPetProfile.birthDate || "Select your pet's birthdate"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Age */}
                <Text style={styles.labels}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetProfile.age}
                    onChangeText={(text) => setEditedPetProfile({ ...editedPetProfile, age: text })}
                    placeholder="Type your pet's age here"
                />

                {/* Gender */}
                <Text style={styles.labels}>Gender</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetProfile.gender}
                    onChangeText={(text) => setEditedPetProfile({ ...editedPetProfile, gender: text })}
                    placeholder="Type your pet's gender here"
                />
            </View>

            {/* Save button */}
            <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
                <Text style={styles.buttonText}>Save changes</Text>
            </TouchableOpacity>

            {/* Birth Date Modal */}
            <BirthDateModal
                visible={showBirthDateModal}
                onDateSelect={handleDateSelect}
                onClose={closeBirthDateModal}
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
    dateTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
