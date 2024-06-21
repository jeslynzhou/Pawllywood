import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NavigationBar from '../../components/navigationBar';
import EditPetProfileScreen from './editPetProfile';

export default function HomeScreen({ directToProfile, directToNotebook, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [petProfile, setPetProfile] = useState({
        name: '',
        picture: require('../../assets/home_images/default_pet_image_square.png'),
        breed: '',
        birthDate: '',
        age: '',
        gender: '',
    });

    const { width, height } = Dimensions.get('window');
    const logoHeightSize = height * 0.1;
    const logoWidthSize = width * 0.5;

    const handleEditPetProfile = () => {
        setCurrentScreen('EditPetProfile');
    };

    const closeEditPetProfile = () => {
        setCurrentScreen('Home');
    };

    return (
        <>
            {currentScreen === 'Home' && (
                <View style={styles.homeContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/home_images/pawllywood_logo.png')}
                            style={{ height: logoHeightSize, width: logoWidthSize }}
                            resizeMode='contain'
                        />
                    </View>

                    {/* Home Screen Content */}
                    <View style={styles.contentContainer}>
                        {/* Pet Profile */}
                        <Text style={styles.labels}>Pet Profile</Text>
                        <View style={styles.petProfileBox}>
                            <TouchableOpacity onPress={handleEditPetProfile} style={styles.editButton}>
                                <Ionicons name='ellipsis-horizontal' size={15} color='#000000' />
                            </TouchableOpacity>
                            <View style={styles.petProfileContainer}>
                                {/* Pet Picture & Name */}
                                <View style={styles.pictureNameContainer}>
                                    <View style={styles.petImageContainer}>
                                        <Image
                                            source={petProfile.picture}
                                            style={styles.petImage}
                                            resizeMode='cover'
                                        />
                                    </View>
                                    <Text style={styles.petName}>{petProfile.name}</Text>
                                </View>

                                {/* Pet Profile */}
                                <View style={styles.infoContainer}>
                                    <Text style={styles.input}>• Breed: {petProfile.breed}</Text>
                                    <Text style={styles.input}>• D.O.B: {petProfile.birthDate}</Text>
                                    <Text style={styles.input}>• Age: {petProfile.age}</Text>
                                    <Text style={styles.input}>• Gender: {petProfile.gender}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Notes */}
                        <Text style={styles.labels}>Notes</Text>
                        <View style={styles.notesBox}>
                            <TouchableOpacity onPress={handleEditPetProfile} style={styles.editButton}>
                                <Ionicons name='ellipsis-horizontal' size={15} color='#000000' />
                            </TouchableOpacity>
                            <View style={styles.notesInfoContainer}>
                                <Text style={styles.input}>Click here to take notes!</Text>
                            </View>
                        </View>
                    </View>

                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToNotebook={directToNotebook}
                        directToLibrary={directToLibrary}
                        directToForum={directToForum}
                    />
                </View>
            )}
            {currentScreen === 'EditPetProfile' && (
                <EditPetProfileScreen
                    petProfile={petProfile}
                    setPetProfile={setPetProfile}
                    closeEditPetProfile={closeEditPetProfile}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    header: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginTop: 32,
        marginLeft: -7,
    },
    contentContainer: {
        marginTop: 100,
        paddingHorizontal: 16,
        width: '100%',
    },
    labels: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    petProfileBox: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 12,
        marginBottom: 7,
        height: 220, //might delete later
    },
    editButton: {
        alignSelf: 'flex-end',
    },
    petProfileContainer: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'row',
    },
    pictureNameContainer: {
        flex: 1,
        alignItems: 'center',
    },
    petImageContainer: {
        width: 160,
        height: 160,
        borderWidth: 1,
        borderRadius: 17,
        overflow: 'hidden',
    },
    petImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingBottom: 23,
    },
    notesBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 12,
        height: 300, //might delete later
    },
    notesInfoContainer: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
    },
});
