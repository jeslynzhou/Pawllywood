import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { db, auth } from '../../initializeFB';
import { collection, getDocs } from 'firebase/firestore';

import NavigationBar from '../../components/navigationBar';
import AddNoteScreen from './addNoteScr.js';

export default function NotebookScreen({ directToProfile, directToHome, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Notebook');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes(); // Fetch notes when the component mounts
    }, []);

    const fetchNotes = async () => {
        try {
            const user = auth.currentUser;
            const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
            const querySnapshot = await getDocs(notesCollectionRef);
            const fetchedNotes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(fetchedNotes);
        } catch (error) {
            console.error('Error fetching notes:', error.message);
        }
    };

    const closeAddNote = () => {
        setCurrentScreen('Notebook');
    };

    const handleAddingNote = () => {
        setCurrentScreen('AddNote');
    };


    return (
        <>
            {currentScreen === 'Notebook' && (
                <View style={styles.notebookContainer}>
                    <Text>Notebook Screen</Text>
                    {/* Example of displaying fetched notes */}
                    {notes.length > 0 && (
                        <View style={styles.notesContainer}>
                            <Text style={styles.sectionTitle}>Your Notes:</Text>
                            {notes.map(note => (
                                <View key={note.id} style={styles.noteItem}>
                                    <Text>{note.title}</Text>
                                    <Text>{note.text}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToHome={directToHome}
                        directToLibrary={directToLibrary}
                        directToForum={directToForum}
                    />
                    {/* Add Note Button */}
                    <TouchableOpacity style={styles.addButton} onPress={handleAddingNote}>
                        <Text style={styles.buttonText}>Add Note</Text>
                    </TouchableOpacity>
                </View>
            )}
            {currentScreen === 'AddNote' && (
                <AddNoteScreen
                    closeAddNote={closeAddNote}
                    fetchNotes={fetchNotes} // Pass fetchNotes function to AddNoteScreen if needed
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    notebookContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
