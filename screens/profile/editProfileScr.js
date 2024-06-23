import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ userProfile, setUserProfile, closeEditUserProfile }) {
    const [editedUserProfile, setEditedUserProfile] = useState({ ...userProfile });
    const [profileImage, setProfileImage] = useState(userProfile.profileImage);
    const [descriptionLength, setDescriptionLength] = useState(userProfile.description.length);

    useEffect(() => {
        setProfileImage(userProfile.profileImage);
        setDescriptionLength(userProfile.description.length);
        setEditedUserProfile({ ...userProfile });
    }, [userProfile]);

    const handleSaveChanges = () => {
        setUserProfile(editedUserProfile);
        closeEditUserProfile();
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

        if (!pickerResult.cancelled) {
            setProfileImage(pickerResult.uri); // Ensure pickerResult.uri is a string URI
            setEditedUserProfile({ ...editedUserProfile, profileImage: pickerResult.uri });
        }
    };

    const handleDescriptionChanges = (text) => {
        if (text.length <= 80) {
            setEditedUserProfile({ ...editedUserProfile, description: text });
            setDescriptionLength(text.length);
        }
    };

    return (
        <View style={styles.editProfileContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeEditUserProfile} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit profile</Text>
            </View>

            {/* Edit Profile Form */}
            <View style={styles.contentContainer}>
                {/* Profile Picture */}
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
                    <Image source={{ uri: editedUserProfile.profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageLabelContainer}>
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
