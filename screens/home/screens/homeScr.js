import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

import NavigationBar from '../../../components/navigationBar';
import EditPetProfileScreen from './editPetProfileScr';
import AddPetScreen from '../../profile/screens/addPetScr';

export default function HomeScreen({ directToProfile, directToNotebook, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [petProfilesData, setPetProfilesData] = useState([]);
    const [activePetIndex, setActivePetIndex] = useState(0);
    const { width, height } = Dimensions.get('window');
    const logoHeightSize = height * 0.1;
    const logoWidthSize = width * 0.5;

    useEffect(() => {
        fetchPetData();
    }, []);

    const fetchPetData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
                const querySnapShot = await getDocs(petsCollectionRef);
                const fetchedPetProfiles = querySnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                fetchedPetProfiles.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    } else if (!a.name && !b.name) {
                        return 0;
                    } else if (!a.name) {
                        return 1; // Place items with 'name' field before those without 'name'
                    } else {
                        return -1;
                    }
                });

                setPetProfilesData(fetchedPetProfiles);
            } else {
                console.lof('User not authenticated.');
            }
        } catch (error) {
            console.error('Error fetching pets profile:', error.message);
        }
    };

    const handleEditPetProfile = () => {
        setCurrentScreen('EditPetProfile');
    };

    const closeEditPetProfile = () => {
        setCurrentScreen('Home');
    };

    const updatePetProfile = async (updatedPetProfile) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const petRef = doc(db, 'users', user.uid, 'pets', updatedPetProfile.id);
                await updateDoc(petRef, updatedPetProfile);
                const updatedPetProfiles = petProfilesData.map(petProfile => {
                    if (petProfile.id === updatedPetProfile.id) {
                        return updatedPetProfile;
                    } else {
                        return petProfile;
                    }
                });
                setPetProfilesData(updatedPetProfiles);
            } else {
                console.log('User not authenticated.');
            }
        } catch (error) {
            console.error('Error updating pet profile:', error.message);
        }
    };

    const handleAddingPets = () => {
        setCurrentScreen('AddPet');
    };

    const closeAddPet = () => {
        setCurrentScreen('Home');
    };

    return (
        <>
            {currentScreen === 'Home' && (
                <View style={styles.homeContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={require('../../../assets/home_images/pawllywood_logo.png')}
                            style={{ height: logoHeightSize, width: logoWidthSize }}
                            resizeMode='contain'
                        />
                    </View>
                    {/* Pet Profile Label */}
                    <View style={styles.petProfileLabelContainer}>
                        <Text style={styles.labels}>Pet Profile ({petProfilesData.length > 0 ? `${activePetIndex + 1}/${petProfilesData.length}` : ''})</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        {/* Swiper Container */}
                        <Swiper
                            loop={false}
                            index={activePetIndex}
                            onIndexChanged={(index) => setActivePetIndex(index)}
                            showsPagination={false}
                            style={styles.swiperContainer}
                        >
                            {petProfilesData.map((petProfile, index) => (
                                <View key={index} style={styles.swiperSlide}>
                                    {/* Pet Profile Box */}
                                    <View style={styles.petProfileBox}>
                                        <TouchableOpacity onPress={handleEditPetProfile} style={styles.editButton}>
                                            <Ionicons name='ellipsis-horizontal' size={15} color='#000000' />
                                        </TouchableOpacity>
                                        <View style={styles.petProfileContainer}>
                                            {/* Pet Picture & Name */}
                                            <View style={styles.pictureNameContainer}>
                                                <View style={styles.petImageContainer}>
                                                    <Image
                                                        source={petProfile.picture ? { uri: petProfile.picture.toString() } : require('../../../assets/home_images/default_pet_image_square.png')}
                                                        style={styles.petImage}
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                                <Text style={styles.petName}>{petProfile.name}</Text>
                                            </View>

                                            {/* Pet Profile Info */}
                                            <View style={styles.infoContainer}>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.input}>•</Text>
                                                    <Text style={[styles.input, { marginLeft: 5, }]}>Breed: {petProfile.breed}</Text>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.input}>•</Text>
                                                    <Text style={[styles.input, { marginLeft: 5, }]}>D.O.B: {petProfile.birthDate}</Text>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.input}>•</Text>
                                                    <Text style={[styles.input, { marginLeft: 5, }]}>Age: {petProfile.age}</Text>
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.input}>•</Text>
                                                    <Text style={[styles.input, { marginLeft: 5, }]}>Gender: {petProfile.gender}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Notes Box */}
                                        <View style={styles.notesContainer}>
                                            <Text style={[styles.labels, { fontSize: 23 }]}>Notes</Text>
                                            <View style={styles.notesBox}>
                                                <View style={styles.notesInfoContainer}>
                                                    <Text style={styles.input}>Click here to take notes!</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </Swiper>
                    </View >

                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToNotebook={directToNotebook}
                        directToLibrary={directToLibrary}
                        directToForum={directToForum}
                    />

                    {/* Add Pet Button */}
                    <TouchableOpacity style={styles.addPetButton} onPress={handleAddingPets}>
                        <Ionicons name="add-circle" size={70} color='rgba(242, 100, 25, 0.7)' />
                    </TouchableOpacity>
                </View >
            )}
            {currentScreen === 'EditPetProfile' && (
                <EditPetProfileScreen
                    petProfile={petProfilesData[activePetIndex]}
                    updatePetProfile={updatePetProfile}
                    setPetProfile={setPetProfilesData}
                    closeEditPetProfile={closeEditPetProfile}
                />
            )}
            {currentScreen === 'AddPet' && (
                <AddPetScreen
                    fetchPetData={fetchPetData}
                    closeAddPet={closeAddPet}
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
        position: 'absolute',
    },
    swiperContainer: {
        marginTop: 100,
    },
    swiperSlide: {
        margin: 16,
    },
    petProfileLabelContainer: {
        position: 'absolute',
        top: 80,
        left: 16,
        zIndex: 1,
        marginTop: 27,
    },
    labels: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 5,
        marginRight: 10,
    },
    petProfileBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        marginTop: 37,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 12,
        height: 605,
    },
    editButton: {
        alignSelf: 'flex-end',
    },
    petProfileContainer: {
        flexDirection: 'row',
    },
    pictureNameContainer: {
        flex: 1,
        alignItems: 'center',
    },
    petImageContainer: {
        width: '100%',
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
        marginLeft: 10,
        paddingBottom: 23,
    },
    notesContainer: {
        flex: 1,
    },
    notesBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        padding: 12,
    },
    notesInfoContainer: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
    },
    input: {
        fontSize: 15,
    },
    addPetButton: {
        position: 'absolute',
        bottom: 68,
        right: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
});