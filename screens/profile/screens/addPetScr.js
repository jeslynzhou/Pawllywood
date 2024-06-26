import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { doc, collection, addDoc } from 'firebase/firestore';

import { db } from '../../../initializeFB';

const AddPetScreen = ({ userId, closeAddPet }) => {
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
        picture: require('../../../assets/home_images/default_pet_image_square.png'), // Default image or blank
    });

    const handleAddPet = async () => {
        try {
            const petsCollectionRef = collection(db, 'users', userId, 'pets');
            await addDoc(petsCollectionRef, petData);
            console.log('Pet added successfully!');
            closeAddPet(); // Close the add pet screen after successful addition
        } catch (error) {
            console.error('Error adding pet:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Pet</Text>

            {/* Pet Image */}
            <Image source={petData.picture} style={[styles.image, { width: imageSize, height: imageSize }]} />

            {/* Pet Information Inputs */}
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={petData.name}
                onChangeText={(text) => setPetData({ ...petData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Breed"
                value={petData.breed}
                onChangeText={(text) => setPetData({ ...petData, breed: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Birth Date"
                value={petData.birthDate}
                onChangeText={(text) => setPetData({ ...petData, birthDate: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={petData.age}
                onChangeText={(text) => setPetData({ ...petData, age: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={petData.gender}
                onChangeText={(text) => setPetData({ ...petData, gender: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Notes"
                value={petData.notes}
                onChangeText={(text) => setPetData({ ...petData, notes: text })}
            />
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    image: {
        marginTop: 20,
        marginBottom: 20,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    button: {
        backgroundColor: '#F26419',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AddPetScreen;
