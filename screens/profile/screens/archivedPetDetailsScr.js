import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

import NoteDetailsScreen from '../../notebook/screens/noteDetailsScr';

export default function ArchivedPetDetailsScreen({ onClose, archivedPetId }) {
    const [currentScreen, setCurrentScreen] = useState('ArchivedPetDetails');
    const [petDetails, setPetDetails] = useState(null);
    const [petNotes, setPetNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArchivedPetDetails = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const archivedPetDocRef = doc(db, 'users', user.uid, 'pets', archivedPetId);
                    const archivedPetDoc = await getDoc(archivedPetDocRef);

                    if (archivedPetDoc.exists()) {
                        setPetDetails(archivedPetDoc.data());
                    } else {
                        Alert.alert('Error fetching pet data', 'Pet not found');
                    }
                } else {
                    Alert.alert('User not authenticated');
                }
            } catch (error) {
                Alert.alert('Error fetching pet details', 'Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchArchivedPetDetails();
    }, [archivedPetId]);

    useEffect(() => {
        fetchNotesForPet();
    }, [archivedPetId]);

    const fetchNotesForPet = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log('User not authenticated.');
                return;
            }

            if (!petDetails) {
                console.log('Pet profiles data is empty.');
                return;
            }

            const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
            const querySnapShot = await getDocs(notesCollectionRef);

            const fetchedNotes = querySnapShot.docs
                .filter(doc => {
                    const noteData = doc.data();
                    return Array.isArray(noteData.petId) && noteData.petId.includes(archivedPetId);
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

    { /* Note Details Screen */ }
    const handleNoteDetails = (note) => {
        setSelectedNote(note);
        setCurrentScreen('NoteDetails');
    };

    const closeNoteDetailsScreen = () => {
        setCurrentScreen('ArchivedPetDetails');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#F26419' />
            </View>
        );
    };

    return (
        <>
            {currentScreen === 'ArchivedPetDetails' && (
                <View style={styles.container}>
                    { /* Header */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{petDetails.name}</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.petProfileBox}>
                            <View style={styles.petProfileContainer}>
                                {/* Pet Picture & Name */}
                                <View style={styles.pictureContainer}>
                                    <Image
                                        source={petDetails.picture ? { uri: petDetails.picture.toString() } : require('../../../assets/home_images/default_pet_image_square.png')}
                                        style={styles.petImage}
                                        resizeMode='cover'
                                    />
                                </View>

                                {/* Pet Profile Info */}
                                <View style={styles.infoContainer}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.input}>•</Text>
                                        <Text style={[styles.input, { marginLeft: 5, }]}>Breed: {petDetails.breed}</Text>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.input}>•</Text>
                                        <Text style={[styles.input, { marginLeft: 5, }]}>D.O.B: {petDetails.birthDate}</Text>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.input}>•</Text>
                                        <Text style={[styles.input, { marginLeft: 5, }]}>Age: {petDetails.age}</Text>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.input}>•</Text>
                                        <Text style={[styles.input, { marginLeft: 5, }]}>Gender: {petDetails.gender}</Text>
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
                                        <TouchableOpacity onPress={{}} style={styles.noNotesContainer}>
                                            <Text style={styles.input}>No notes available for this pet. Click here to add new note now!</Text>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {currentScreen === 'NoteDetails' && selectedNote && (
                <NoteDetailsScreen
                    note={selectedNote}
                    closeNoteDetails={closeNoteDetailsScreen}
                    showEditButton={false}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '10%',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    petProfileBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        marginTop: '6%',
        paddingHorizontal: 12,
        paddingVertical: 12,
        height: '95%',
    },
    petProfileContainer: {
        flexDirection: 'row',
    },
    pictureContainer: {
        flex: 1,
        alignItems: 'center',
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
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    notesContainer: {
        flex: 1,
        marginTop: 20,
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