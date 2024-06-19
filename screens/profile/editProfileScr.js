import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ username, setUsername, closeEditProfile }) {
    const [newUsername, setNewUsername] = useState(username);

    const saveChanges = () => {
        setUsername(newUsername);
        closeEditProfile();
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
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder={username}
                    value={newUsername}
                    onChangeText={setNewUsername}
                />
                <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    editProfileContainer: {
        marginTop: '10%',
        paddingHorizontal: 16,
        paddingVertical: 16,
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
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#616161',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 17,
        borderColor: '#000000',
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: '#F26419',
        borderRadius: 17,
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});