import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function EditPetInfoScreen({ petInfo, setPetInfo, closeEditPetInfo }) {
    const [editedPetInfo, setEditedPetInfo] = useState({ ...petInfo });

    const handleSaveChanges = () => {
        setPetInfo(editedPetInfo);
        closeEditPetInfo();
        console.log('You have saved changes successfully!');
    };

    return (
        <View style={styles.editProfileContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeEditPetInfo} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Pet Info</Text>
            </View>

            {/* Edit Pet Info Form */}
            <View style={styles.contentContainer}>
                {/* Pet name */}
                <Text style={styles.labels}>Pet name</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetInfo.name}
                    onChangeText={(text) => setEditedPetInfo({ ...editedPetInfo, name: text })}
                    placeholder="Name"
                />

                {/* Breed */}
                <Text style={styles.labels}>Breed</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetInfo.breed}
                    onChangeText={(text) => setEditedPetInfo({ ...editedPetInfo, breed: text })}
                    placeholder="Breed"
                />

                {/* Age */}
                <Text style={styles.labels}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetInfo.age}
                    onChangeText={(text) => setEditedPetInfo({ ...editedPetInfo, age: text })}
                    placeholder="Age"
                />

                {/* Gender */}
                <Text style={styles.labels}>Gender</Text>
                <TextInput
                    style={styles.input}
                    value={editedPetInfo.gender}
                    onChangeText={(text) => setEditedPetInfo({ ...editedPetInfo, gender: text })}
                    placeholder="Gender"
                />
            </View>

            {/* Save button */}
            <TouchableOpacity onPress={handleSaveChanges} style={styles.button}>
                <Text style={styles.buttonText}>Save changes</Text>
            </TouchableOpacity>
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
        marginBottom: 23,
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