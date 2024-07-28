import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

import NavigationBar from '../../../components/navigationBar';
import EditPetProfileScreen from './editPetProfileScr';
import AddPetScreen from './addPetScr';
import AddNoteScreen from '../../notebook/screens/addNoteScr';
import NoteDetailsScreen from '../../notebook/screens/noteDetailsScr';

export default function HomeScreen({ directToProfile, directToNotebook, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [petProfilesData, setPetProfilesData] = useState([]);
    const [activePetIndex, setActivePetIndex] = useState(0);
    const [petNotes, setPetNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const { width, height } = Dimensions.get('window');
    const logoHeightSize = height * 0.1;
    const logoWidthSize = width * 0.5;

    useEffect(() => {
        fetchPetData();
    }, [activePetIndex]);

    useEffect(() => {
        if (petProfilesData.length > 0) {
            fetchNotesForPet();
        }
    }, [petProfilesData]);


    const fetchPetData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
                const q = query(petsCollectionRef, where('isArchived', '==', false));
                const querySnapShot = await getDocs(q);
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

    const fetchNotesForPet = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log('User not authenticated.');
                return;
            }

            if (petProfilesData.length === 0) {
                console.log('Pet profiles data is empty.');
                return;
            }

            const petId = petProfilesData[activePetIndex].id;
            const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
            const querySnapShot = await getDocs(notesCollectionRef);

            const fetchedNotes = querySnapShot.docs
                .filter(doc => {
                    const noteData = doc.data();
                    return Array.isArray(noteData.petId) && noteData.petId.includes(petId);
                })
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

            setPetNotes(fetchedNotes);
        } catch (error) {
            console.error('Error fetching pet notes:', error.message);
        }
    };

    const onClose = () => {
        setCurrentScreen('Home');
        fetchPetData();
        fetchNotesForPet();
    };

    const handleEditPetProfile = () => {
        setCurrentScreen('EditPetProfile');
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

    { /* Add Note Screen */ }
    const handleAddingNote = () => {
        setCurrentScreen('AddNote')
    }

    { /* Note Details Screen */ }
    const handleNoteDetails = (note) => {
        setSelectedNote(note);
        setCurrentScreen('NoteDetails');
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
                        <View >
                            <Text style={styles.labels}>Pet Profile ({petProfilesData.length > 0 ? `${activePetIndex + 1}/${petProfilesData.length}` : ''})</Text>
                        </View>
                        <View style={styles.editButtonContainer}>
                            <TouchableOpacity onPress={handleEditPetProfile} style={styles.editButton}>
                                <Text style={styles.editButtonText}>Edit Pet Profile</Text>
                            </TouchableOpacity>
                        </View>
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
                                            <ScrollView style={styles.notesScrollViewContainer}>
                                                {petNotes.length > 0 ? (
                                                    petNotes.map(note => (
                                                        <TouchableOpacity key={note.id} onPress={() => handleNoteDetails(note)} style={[styles.notesBox, { backgroundColor: note.backgroundColor }]}>
                                                            <Text style={styles.input}>{note.text}</Text>
                                                        </TouchableOpacity>
                                                    ))
                                                ) : (
                                                    <TouchableOpacity onPress={handleAddingNote} style={styles.noNotesContainer}>
                                                        <Text style={styles.input}>No notes available for this pet. Click here to add new note now!</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </ScrollView>
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
                    closeEditPetProfile={onClose}
                />
            )}
            {currentScreen === 'AddPet' && (
                <AddPetScreen
                    fetchPetData={fetchPetData}
                    closeAddPet={onClose}
                />
            )}
            {currentScreen === 'AddNote' && (
                <AddNoteScreen
                    fetchNotes={fetchNotesForPet}
                    closeAddNote={onClose}
                    petId={petProfilesData[activePetIndex].id}
                />
            )}
            {currentScreen === 'NoteDetails' && selectedNote && (
                <NoteDetailsScreen
                    note={selectedNote}
                    closeNoteDetails={onClose}
                    showEditButton={true}
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
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: '25%',
        zIndex: 1,
    },
    labels: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 5,
        marginRight: 10,
    },
    editButtonContainer: {
        margin: 11,
    },
    editButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    editButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    petProfileBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        marginTop: 37,
        paddingHorizontal: 12,
        paddingVertical: 12,
        height: 605,
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
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        padding: 12,
        marginBottom: 10,
        maxHeight: 170,
    },
    noNotesContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        padding: 12,
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
