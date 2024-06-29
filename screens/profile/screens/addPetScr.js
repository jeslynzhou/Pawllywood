import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { db, auth, storage } from '../../../initializeFB';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

import UploadImageModal from '../components/uploapImageModal';
import BirthDateModal from '../../home/components/birthDateModal';
import GenderOptionsModal from '../components/genderOptionsModal';

export default function AddPetScreen({ closeAddPet }) {
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
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
        picture: null,
    });

    useEffect(() => {
        const getDefaultPetPicture = async () => {
            try {
                const defaultPetPictureRef = ref(storage, 'default_profile_picture/default_pet_image_square.png');
                const defaultPetPictureURL = await getDownloadURL(defaultPetPictureRef);
                setPetData({ ...petData, picture: defaultPetPictureURL });
            } catch (error) {
                console.error('Error fetching default pet picture:', error.message);
            }
        };

        getDefaultPetPicture();
    }, []);

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

    {/* Upload Image Modal */ }
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
                setPetData({ ...petData, picture: cameraResult.assets[0].uri });
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
                Alert.alert('Permission Denied', 'Permission to access library is required.');
                return;
            }

            let libraryResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!libraryResult.canceled) {
                setPetData({ ...petData, picture: libraryResult.assets[0].uri });
                setShowUploadImageModal(false);
            }
        } catch (error) {
            console.log('Error uploading image from library:', error);
        }
    };

    {/* BirthDate & Age & AdoptedDate Modals */ }
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

    {/* Gender Options Modal */ }
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
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageContainer}>
                    <Image source={{ uri: petData.picture }} style={[styles.profileImage, { width: imageSize, height: imageSize }]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOpenUploadImageModal} style={styles.profileImageLabelContainer}>
                    <Text style={styles.profileImageLabel}>Edit picture</Text>
                </TouchableOpacity>

                {/* Pet name */}
                <Text style={styles.labels}>Pet Name</Text>
                <TextInput
                    style={styles.input}
                    value={petData.name}
                    onChangeText={(text) => setPetData({ ...petData, name: text })}
                    placeholder="Type your pet's name here"
                />

                {/* Breed */}
                <Text style={styles.labels}>Breed</Text>
                <TextInput
                    style={styles.input}
                    value={petData.breed}
                    onChangeText={(text) => setPetData({ ...petData, breed: text })}
                    placeholder="Type your pet's breed here"
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
                    value={petData.age}
                    onChangeText={(text) => setPetData({ ...petData, age: text })}
                    placeholder="Type your pet's age here"
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

            {/* Upload Image Modal */}
            <UploadImageModal
                visible={showUploadImageModal}
                onClose={handleCloseUploadImageModal}
                onUploadFromCamera={handleUploadFromCamera}
                onUploadFromLibrary={handleUploadFromLibrary}
            />

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