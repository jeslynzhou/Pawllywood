import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB.js';
import { collection, getDocs } from 'firebase/firestore';

import NavigationBar from '../../../components/navigationBar.js';
import AddNoteScreen from './addNoteScr.js';
import ManageFoldersScreen from './manageFoldersScr.js';
import MenuModal from '../components/menuModal.js';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Two items per row with margin

export default function NotebookScreen({ directToProfile, directToHome, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Notebook');
    const [notes, setNotes] = useState([]);
    const [viewMode, setViewMode] = useState('allNotes');
    const [folders, setFolders] = useState([]); // Array to store folder details if needed
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenuModal, setShowMenuModal] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const user = auth.currentUser;

            // Fetch notes
            const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
            const notesSnapshot = await getDocs(notesCollectionRef);
            const fetchedNotes = notesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(fetchedNotes);

            // Fetch folders
            const foldersCollectionRef = collection(db, 'users', user.uid, 'folders');
            const foldersSnapshot = await getDocs(foldersCollectionRef);
            const fetchedFolders = foldersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFolders(fetchedFolders);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const onClose = () => {
        setCurrentScreen('Notebook');
    };

    { /* Search Notes */ }
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredNotes = notes.filter(note => {
        return note.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    { /* Add Note */ }
    const handleAddingNote = () => {
        setCurrentScreen('AddNote');
    };

    { /* Menu Modal */ }
    const openMenuModal = () => {
        setShowMenuModal(true);
    };

    const closeMenuModal = () => {
        setShowMenuModal(false);
    };

    const handleAllNotesView = () => {
        setViewMode('allNotes');
        setShowMenuModal(false);
    };

    const handleFoldersView = () => {
        setViewMode('folders');
        setShowMenuModal(false);
    };

    { /* Manage Folders Screen */ }
    const openManageFoldersScreen = () => {
        setCurrentScreen('ManageFolders');
        setShowMenuModal(false);
    };

    { /* Render Note & Folder Rows */ }
    const renderNoteItem = (note) => (
        <View>
            <TouchableOpacity key={note.id} style={styles.noteItem}>
                <Text>{note.text}</Text>
            </TouchableOpacity>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteDate}>{note.createdAt}</Text>
        </View>
    );

    const renderNoteRows = () => {
        const rows = [];
        for (let i = 0; i < filteredNotes.length; i += 2) {
            const note1 = filteredNotes[i];
            const note2 = filteredNotes[i + 1];
            rows.push(
                <View key={`row_${i}`} style={styles.rows}>
                    {note1 && renderNoteItem(note1)}
                    {note2 && renderNoteItem(note2)}
                </View>
            )
        }
        return rows;
    };

    const renderFolderItem = (folder) => (
        <TouchableOpacity key={folder.id}>
            <Image
                source={require('../../../assets/notebook_images/default_folder.png')}
                style={styles.folderImage}
                resizeMode='contain'
            />
            <Text style={styles.folderName}>{folder.folderName}</Text>
        </TouchableOpacity>
    );

    const renderFolderRows = () => {
        const rows = [];
        for (let i = 0; i < folders.length; i += 2) {
            const folder1 = folders[i];
            const folder2 = folders[i + 1];
            rows.push(
                <View key={`row_${i}`} style={styles.rows}>
                    {folder1 && renderFolderItem(folder1)}
                    {folder2 && renderFolderItem(folder2)}
                </View>
            );
        }
        return rows;
    };


    return (
        <>
            {currentScreen === 'Notebook' && (
                <View style={styles.notebookContainer}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={openMenuModal} style={styles.toggleMenuButton}>
                            <Ionicons name="menu-outline" size={30} color='#000000' />
                        </TouchableOpacity>
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

                    <ScrollView style={styles.notesContainer}>
                        {viewMode === 'allNotes' ? (
                            filteredNotes.length > 0 ? (
                                renderNoteRows()
                            ) : (
                                <Text>No notes found.</Text>
                            )
                        ) : (
                            folders.length > 0 ? (
                                renderFolderRows()
                            ) : (
                                <Text>No folders found.</Text>
                            )
                        )}
                    </ScrollView>
                </View>
            )}
            {currentScreen === 'AddNote' && (
                <AddNoteScreen
                    fetchNotes={fetchNotes}
                    closeAddNote={onClose}
                />
            )}

            {currentScreen === 'ManageFolders' && (
                <ManageFoldersScreen
                    closeManageFolders={onClose}
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

            { /* Menu Modal */}
            <MenuModal
                visible={showMenuModal}
                onClose={closeMenuModal}
                handleAllNotesView={handleAllNotesView}
                handleFoldersView={handleFoldersView}
                handleManageFolders={openManageFoldersScreen}
                currentViewMode={viewMode}
            />

            {/* Add Note Button */}
            {currentScreen !== 'AddNote' && (
                <TouchableOpacity style={styles.addNoteButton} onPress={handleAddingNote}>
                    <Ionicons name="add-circle" size={70} color='rgba(242, 100, 25, 0.7)' />
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    notebookContainer: {
        marginTop: '10%',
        marginHorizontal: 16,
    },
    searchContainer: {
        marginTop: '3%',
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 10,
    },
    toggleMenuButton: {
        marginRight: 10,
        alignSelf: 'center',
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
        height: 600,
    },
    rows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    noteItem: {
        width: ITEM_WIDTH,
        height: 200,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 17,
        borderColor: '#CCCCCC',
        padding: 10,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '2%',
    },
    noteDate: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#808080',
        textAlign: 'center',
        marginTop: 2,
        marginBottom: 10,
    },
    folderImage: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
    },
    folderName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '-5%',
    },
    addNoteButton: {
        position: 'absolute',
        bottom: 68,
        right: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});