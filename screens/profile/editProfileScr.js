import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ username: initialUsername, profileImage: initialProfileImage, description: initialDescription, updateProfile, closeEditProfile }) {
    const [username, setUsername] = useState(initialUsername);
    const [profileImage, setProfileImage] = useState(initialProfileImage);
    const [description, setDescription] = useState(initialDescription);

    const handleImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required.');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
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

    const handleSaveChanges = () => {
        updateProfile(username, profileImage, description);
    };

    return (
        <View style={styles.editProfileContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeEditProfile} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit profile</Text>
            </View>

            {/* Edit Profile Form */}
            <View style={styles.contentContainer}>
                {/* Profile Picture */}
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
                    <Image source={profileImage} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageLabelContainer}>
                    <Text style={styles.profileImageLabel}>Edit picture</Text>
                </TouchableOpacity>

                {/* Username */}
                <Text style={styles.labels}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder={initialUsername}
                    value={username}
                    onChangeText={setUsername}
                />

                {/* Description */}
                <Text style={styles.labels}>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder={initialDescription}
                    value={description}
                    onChangeText={handleDescriptionChange}
                />

                {/* Save button */}
                <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
                    <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>
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
});