import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import defaultPetPicture from '../../../assets/home_images/default_pet_image_square.png'

import { doc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../initializeFB';

export default function AddPetScreen({ closeAddPet }) {
    const { height } = Dimensions.get('window');
    const imageSize = height * 0.2;

    const [petData, setPetData] = useState({
        name: '',
        breed: '',
        birthDate: '',
        age: '',
        gender: '',
        notes: '',
        adoptedDate: '',
        picture: defaultPetPicture,
    });

    const handleAddPet = async () => {
        try {
            const user = auth.currentUser;
            const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
            await addDoc(petsCollectionRef, petData);
            console.log('Pet added successfully!');
            closeAddPet(); // Close the add pet screen after successful addition
        } catch (error) {
            console.error('Error adding pet:', error.message);
        }
    };

    return (
        <View style={styles.addPetContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeAddPet} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add pet</Text>
            </View>

            {/* Add Pet Profile Form */}
            <View style={styles.contentContainer}>
                {/* Pet Image */}

                <TouchableOpacity style={styles.profileImageContainer}>
                    <Image source={petData.picture} style={[styles.profileImage, { width: imageSize, height: imageSize }]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileImageLabelContainer}>
                    <Text style={styles.profileImageLabel}>Edit picture</Text>
                </TouchableOpacity>

                {/* Pet Information Inputs */}
                <Text style={styles.labels}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={petData.name}
                    onChangeText={(text) => setPetData({ ...petData, name: text })}
                />

                <Text style={styles.labels}>Breed</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Breed"
                    value={petData.breed}
                    onChangeText={(text) => setPetData({ ...petData, breed: text })}
                />

                <Text style={styles.labels}>Birth Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Birth Date"
                    value={petData.birthDate}
                    onChangeText={(text) => setPetData({ ...petData, birthDate: text })}
                />

                <Text style={styles.labels}>Age</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={petData.age}
                    onChangeText={(text) => setPetData({ ...petData, age: text })}
                />

                <Text style={styles.labels}>Gender</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Gender"
                    value={petData.gender}
                    onChangeText={(text) => setPetData({ ...petData, gender: text })}
                />

                <Text style={styles.labels}>Adopted Date</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Adopted Date"
                    value={petData.adoptedDate}
                    onChangeText={(text) => setPetData({ ...petData, adoptedDate: text })}
                />

                {/* Button to Add Pet */}
                <TouchableOpacity style={styles.button} onPress={handleAddPet}>
                    <Text style={styles.buttonText}>Add Pet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    addPetContainer: {
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
        borderRadius: 17,
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