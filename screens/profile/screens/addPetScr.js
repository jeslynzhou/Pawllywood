import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../initializeFB';

import BirthDateModal from '../../home/components/birthDateModal';
import GenderOptionsModal from '../components/genderOptionsModal';

export default function AddPetScreen({ closeAddPet }) {
    const [showBirthDateModal, setShowBirthDateModal] = useState(false);
    const [showAdoptedDateModal, setShowAdoptedDateModal] = useState(false);
    const [showGenderOptionsModal, setShowGenderOptionsModal] = useState(false);
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
        picture: require('../../../assets/home_images/default_pet_image_square.png'),
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

    const openBirthDateModal = () => {
        setShowBirthDateModal(true);
    };

    const closeBirthDateModal = () => {
        setShowBirthDateModal(false);
    };

    const openAdoptedDateModal = () => {
        setShowAdoptedDateModal(true);
    };

    const closeAdoptedDateModal = () => {
        setShowAdoptedDateModal(false);
    };

    const handleDateSelect = (date, type) => {
        try {
            // Split & extract from formatted date
            const dateParts = date.split('/');
            const selectedDay = parseInt(dateParts[0], 10);
            const selectedMonth = parseInt(dateParts[1], 10);
            const selectedYear = parseInt(dateParts[2], 10);

            const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
            const today = new Date();

            // Calculate age
            if (type === 'birthDate') {
                let age = today.getFullYear() - selectedDate.getFullYear();
                const monthDiff = today.getMonth() - selectedDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                    age--;
                }

                setPetData({
                    ...petData,
                    birthDate: date,
                    age: age.toString(),
                });

                closeBirthDateModal();
            } else if (type === 'adoptedDate') {
                setPetData({
                    ...petData,
                    adoptedDate: date,
                });
                closeAdoptedDateModal();
            }
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
        setPetData({
            ...petData,
            gender: selectedGender,
        });
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

                {/* Pet name */}
                <Text style={styles.labels}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={petData.name}
                    onChangeText={(text) => setPetData({ ...petData, name: text })}
                />

                {/* Breed */}
                <Text style={styles.labels}>Breed</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Breed"
                    value={petData.breed}
                    onChangeText={(text) => setPetData({ ...petData, breed: text })}
                />

                {/* Birth Date */}
                <Text style={styles.labels}>Birth Date</Text>
                <TouchableOpacity onPress={openBirthDateModal} style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: petData.birthDate ? '#000000' : '#6E6E6E' }]}>
                            {petData.birthDate || "Select your pet's birthday"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Age */}
                <Text style={styles.labels}>Age</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    value={petData.age}
                    onChangeText={(text) => setPetData({ ...petData, age: text })}
                />

                {/* Gender */}
                <Text style={styles.labels}>Gender</Text>
                <TouchableOpacity onPress={openGenderOptionsModal} style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: petData.gender ? '#000000' : '#6E6E6E' }]}>
                            {petData.gender || "Select your pet's gender"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Adopted Date */}
                <Text style={styles.labels}>Adopted Date</Text>
                <TouchableOpacity onPress={openAdoptedDateModal} style={styles.input}>
                    <View style={styles.inputTextContainer}>
                        <Text style={[{ color: petData.adoptedDate ? '#000000' : '#6E6E6E' }]}>
                            {petData.adoptedDate || "Select your pet's adopted date"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Button to Add Pet */}
                <TouchableOpacity style={styles.button} onPress={handleAddPet}>
                    <Text style={styles.buttonText}>Add Pet</Text>
                </TouchableOpacity>
            </View>

            {/* Birth Date Modal */}
            <BirthDateModal
                initialDate={petData.birthDate}
                visible={showBirthDateModal}
                onDateSelect={(date) => handleDateSelect(date, 'birthDate')}
                onClose={closeBirthDateModal}
                dateType="birthDate"
            />

            {/* Adopted Date Modal */}
            <BirthDateModal
                initialDate={petData.adoptedDate}
                visible={showAdoptedDateModal}
                onDateSelect={(date) => handleDateSelect(date, 'adoptedDate')}
                onClose={closeAdoptedDateModal}
                dateType="adoptedDate"
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
    inputTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});