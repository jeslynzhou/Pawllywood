import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../initializeFB';
import { collection, getDocs } from 'firebase/firestore';

import NavigationBar from '../../components/navigationBar';
import AddNoteScreen from './addNoteScr.js';

export default function NotebookScreen({ directToProfile, directToHome, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Notebook');
    const [notes, setNotes] = useState([]);
    const [viewMode, setViewMode] = useState('allNotes'); // 'allNotes' or 'folders'
    const [folders, setFolders] = useState([]); // Array to store folder details if needed
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        fetchNotes();
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

    { /* Search Notes */ }
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredNotes = notes.filter(note => {
        return note.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const closeAddNote = () => {
        setCurrentScreen('Notebook');
    };

    const handleAddingNote = () => {
        setCurrentScreen('AddNote');
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'allNotes' ? 'folders' : 'allNotes');
    };

    const navigateToFolder = (folderId) => {
        // Implement navigation or filtering based on selected folder
        console.log('Navigating to folder with ID:', folderId);
    };

    return (
        <>
            {currentScreen === 'Notebook' && (
                <View style={styles.notebookContainer}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    <View style={styles.header}>
                        <TouchableOpacity style={[styles.headerButton, viewMode === 'allNotes' ? styles.activeButton : null]} onPress={() => setViewMode('allNotes')}>
                            <Text style={styles.headerButtonText}>All notes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.headerButton, viewMode === 'folders' ? styles.activeButton : null]} onPress={() => setViewMode('folders')}>
                            <Text style={styles.headerButtonText}>Folders</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Example of displaying fetched notes or folders */}
                    {viewMode === 'allNotes' && (
                        <View style={styles.notesContainer}>
                            {filteredNotes.length > 0 ? (
                                filteredNotes.map(note => (
                                    <TouchableOpacity key={note.id} style={styles.noteItem}>
                                        <Text>{note.title}</Text>
                                        <Text>{note.text}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No notes found.</Text>
                            )}
                        </View>
                    )}

                    {/* Example of displaying folders */}
                    {viewMode === 'folders' && (
                        <View style={styles.notesContainer}>
                            <Text style={styles.sectionTitle}>Your Folders:</Text>
                            {folders.length > 0 ? (
                                folders.map(folder => (
                                    <TouchableOpacity key={folder.id} style={styles.folderItem} onPress={() => navigateToFolder(folder.id)}>
                                        <Text>{folder.name}</Text>
                                        {/* Additional folder details if needed */}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>No folders found.</Text>
                            )}
                        </View>
                    )}


                </View>
            )}
            {currentScreen === 'AddNote' && (
                <AddNoteScreen
                    fetchNotes={fetchNotes}
                    closeAddNote={closeAddNote}
                />
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
            <TouchableOpacity style={styles.addNoteButton} onPress={handleAddingNote}>
                <Ionicons name="add-circle" size={70} color='rgba(242, 100, 25, 0.7)' />
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    notebookContainer: {
        marginTop: '10%',
        margin: 16,
    },
    searchContainer: {
        marginTop: '3%',
        width: '100%',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    headerButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    headerButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeButton: {
        backgroundColor: '#F26419',
    },
    notesContainer: {
        marginTop: 10,
        width: '100%',
    },
    noteItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 17,
        borderColor: '#CCCCCC',
        padding: 10,
        marginBottom: 10,
    },
    folderItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 10,
        marginBottom: 10,
    },
    addNoteButton: {
        position: 'absolute',
        bottom: 68,
        right: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
