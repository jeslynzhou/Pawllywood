import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB.js';
import { collection, deleteDoc, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

import NavigationBar from '../../../components/navigationBar.js';
import AddNoteScreen from './addNoteScr.js';
import AddFolderModal from '../components/addFolderModal.js';
import ManageFoldersScreen from './manageFoldersScr.js';
import NoteDetailsScreen from './noteDetailsScr.js';
import MenuModal from '../components/menuModal.js';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Two items per row with margin

export default function NotebookScreen({ directToProfile, directToHome, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Notebook');
    const [viewMode, setViewMode] = useState('allNotes');
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenuModal, setShowMenuModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [showEditNotesModal, setShowEditNotesModal] = useState(false);
    const [isMovingMode, setIsMovingMode] = useState(false);
    const [isPinningMode, setIsPinningMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [showSelectingFolderModal, setShowSelectingFolderModal] = useState(false);
    const [showSelectingPetProfileModal, setShowSelectingPetProfileModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [selectedDestinationFolder, setSelectedDestinationFolder] = useState(null);
    const [selectedDestinationPetProfile, setSelectedDestinationPetProfile] = useState(null);

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
                ...doc.data(),
                petId: Array.isArray(doc.data().petId) ? doc.data().petId : [], // Ensure petId is an array
            }));
            setNotes(fetchedNotes);

            // Fetch folders
            const foldersCollectionRef = collection(db, 'users', user.uid, 'folders');
            const foldersSnapshot = await getDocs(foldersCollectionRef);
            const fetchedFolders = foldersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sort folders by name
            fetchedFolders.sort((a, b) => a.folderName.localeCompare(b.folderName));
            setFolders(fetchedFolders);

            // Fetch pets
            const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
            const petsSnapshot = await getDocs(petsCollectionRef);
            const fetchedPets = petsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Sort pets by name
            fetchedPets.sort((a, b) => a.name.localeCompare(b.name));
            setPets(fetchedPets);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const onClose = () => {
        setCurrentScreen('Notebook');
        fetchNotes();
    };

    { /* Search Notes */ }
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredNotes = viewMode === 'allNotes'
        ? notes.filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : selectedFolder
            ? notes.filter(note => note.folderId === selectedFolder.id && note.title.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];

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

    { /* Edit Modal */ }
    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    { /* Edit Notes Mode */ }
    const openEditNotesModal = () => {
        setShowEditModal(false);
        setTimeout(() => {
            setShowEditNotesModal(true);
            console.log('i m good');
        }, 3000); // 300 milliseconds delay ensures immediate execution after current call stack
    };

    const closeEditNotesModal = () => {
        setShowEditNotesModal(false);
        setSelectedNotes([]);
        setIsMovingMode(false);
        setIsPinningMode(false);
        setIsDeleteMode(false);
    };

    { /* Moving Mode */ }
    const onMovingNotes = () => {
        setIsMovingMode(true);
        setIsPinningMode(false);
        setIsDeleteMode(false);
        setShowEditNotesModal(false);
        setSelectedDestinationFolder(selectedFolder);
    };

    const confirmMovingNotes = () => {
        if (selectedNotes.length > 0) {
            setShowSelectingFolderModal(true);
            setShowEditNotesModal(false);
        }
    };

    const moveSelectedNotes = async () => {
        try {
            const user = auth.currentUser;
            if (user && selectedDestinationFolder) {
                const movingPromises = selectedNotes.map(async (noteId) => {
                    const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
                    await updateDoc(noteDocRef, {
                        folderId: selectedDestinationFolder.id,
                    });
                });

                await Promise.all(movingPromises);

                fetchNotes();  // Update the state after moving notes
                setSelectedNotes([]);
                setSelectedDestinationFolder(null);
                setIsMovingMode(false);
            }
        } catch (error) {
            console.error('Error moving notes:', error.message);
        }
    };

    const onPinToPetProfile = () => {
        setIsPinningMode(true);
        setIsMovingMode(false);
        setIsDeleteMode(false);
        setTimeout(() => {
            setShowEditNotesModal(false);
        }, 100);
    };

    const confirmPinToPetProfile = () => {
        if (selectedNotes.length > 0) {
            console.log('its working');
            setShowEditNotesModal(false); // First hide the edit notes modal
            setTimeout(() => {
                setShowSelectingPetProfileModal(true); // Then show the selecting pet profile modal after a delay
            }, 300); // Adjust the delay (300ms) as needed
        }
    };

    const pinToPetProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user && selectedDestinationPetProfile) {
                const pinningPromises = selectedNotes.map(async (noteId) => {
                    const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
                    const noteSnapshot = await getDoc(noteDocRef);
                    const noteData = noteSnapshot.data();
                    const existingPetIds = noteData.petId || [];

                    if (existingPetIds.includes(selectedDestinationPetProfile.id)) {
                        // Pet ID is already in the petId array, show an alert
                        Alert.alert('Alert', 'This note is already pinned to the selected pet profile.');
                        return;
                    }

                    // Update the note document with the new petId
                    await updateDoc(noteDocRef, {
                        petId: [...existingPetIds, selectedDestinationPetProfile.id],
                    });
                });

                await Promise.all(pinningPromises);

                fetchNotes();

                setTimeout(() => {
                    // Clear the selected notes
                    setSelectedNotes([]);

                    // Reset the selected destination pet profile
                    setSelectedDestinationPetProfile(null);

                    // Exit pinning mode
                    setIsPinningMode(false);
                }, 1000); // Adjust the delay as needed

                console.log('is it closing');
            }
        } catch (error) {
            console.error('Error pinning notes:', error.message);
        }
    };


    { /* Delete Mode */ }
    const confirmDeleteNotes = () => {
        setIsDeleteMode(true);
        setIsMovingMode(false);
        setIsPinningMode(false);
        setShowEditNotesModal(false);
    };

    const toggleSelectNotesForEdit = (noteId) => {
        const index = selectedNotes.indexOf(noteId);

        if (index === -1) {
            // Add noteId to selectedNotes after a delay
            setTimeout(() => {
                setSelectedNotes([...selectedNotes, noteId]);
            }, 300); // Adjust the delay (300ms) as needed
        } else {
            // Remove noteId from selectedNotes after a delay
            setTimeout(() => {
                const updatedSelectedNotesForDelete = [...selectedNotes];
                updatedSelectedNotesForDelete.splice(index, 1);
                setSelectedNotes(updatedSelectedNotesForDelete);
            }, 300); // Adjust the delay (300ms) as needed
        }
    };

    const deleteSelectedNotes = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const deletionPromises = selectedNotes.map(async (noteId) => {
                    const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
                    await deleteDoc(noteDocRef);
                });

                await Promise.all(deletionPromises);

                fetchNotes();
                setSelectedNotes([]);
                setIsDeleteMode(false);
                closeDeleteConfirmationModal();
            }
        } catch (error) {
            console.error('Error deleting notes:', error.message);
        }
    };

    const openDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(true);
    };

    const closeDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(false);
    };

    { /* Add Folder Modal */ }

    const openAddFolderModal = () => {
        setShowEditModal(false);

        setTimeout(() => {
            setShowAddFolderModal(true);;
        }, 300);
    };

    const closeAddFolderModal = () => {
        setShowAddFolderModal(false);
    };

    const addNewFolder = async (newFolder) => {
        setFolders(prevFolders => [...prevFolders, newFolder]);
    };

    { /* Handle View */ }
    const handleAllNotesView = () => {
        setViewMode('allNotes');
        setSelectedFolder(null);
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

    { /* Note Details Screen */ }
    const handleNoteDetails = (note) => {
        setSelectedNote(note);
        setCurrentScreen('NoteDetails');
    };

    { /* Render Note & Folder Rows */ }
    const renderNoteItem = (note) => (
        <View>
            <TouchableOpacity onPress={() => {
                if (isDeleteMode) {
                    toggleSelectNotesForEdit(note.id);
                } else if (isMovingMode) {
                    toggleSelectNotesForEdit(note.id);
                    setSelectedDestinationFolder(selectedFolder);
                } else if (isPinningMode) {
                    toggleSelectNotesForEdit(note.id);
                } else {
                    handleNoteDetails(note);
                }
            }}
                style={[styles.noteItem, { backgroundColor: note.backgroundColor }]}>
                <Text>{note.text}</Text>
                {(isDeleteMode || isMovingMode || isPinningMode) && (
                    <View style={styles.checkboxContainer}>
                        <Ionicons name={selectedNotes.includes(note.id) ? 'checkmark-circle-outline' : 'ellipse-outline'} size={24} color='#000000' />
                    </View>
                )}
            </TouchableOpacity>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteDate}>{note.createdAt}</Text>
        </View >
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

    const handleFolderPress = (folder) => {
        setSelectedFolder(folder);
    };

    const renderFolderItem = (folder) => (
        <TouchableOpacity key={folder.id} onPress={() => handleFolderPress(folder)}>
            <View style={[
                styles.folderItem,
                { backgroundColor: selectedFolder && selectedFolder.id === folder.id ? '#F26419' : '#FFFFFF' }
            ]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.folderName}>{folder.folderName}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFolderRows = () => {
        return (
            <View>
                <ScrollView horizontal style={styles.foldersContainer}>
                    {folders.map(folder => renderFolderItem(folder))}
                </ScrollView>
            </View>
        )
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
                        <TouchableOpacity onPress={notes.length > 0 ? openEditModal : closeEditModal} style={styles.editButtonContainer}>
                            <Ionicons name='ellipsis-vertical' size={20} color='#000000' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header}>
                        <TouchableOpacity style={[styles.headerButton, viewMode === 'allNotes' ? styles.activeButton : null]} onPress={handleAllNotesView}>
                            <Text style={styles.headerButtonText}>All notes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.headerButton, viewMode === 'folders' ? styles.activeButton : null]} onPress={handleFoldersView}>
                            <Text style={styles.headerButtonText}>Folders</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.notesContainer}>
                        {viewMode === 'allNotes' ? (
                            filteredNotes.length > 0 ? (
                                <ScrollView style={styles.notesContainer}>
                                    {renderNoteRows()}
                                </ScrollView>
                            ) : (
                                <View style={styles.header}>
                                    <Text style={styles.text}>No notes found.</Text>
                                </View>
                            )
                        ) : (
                            folders.length > 0 ? (
                                <>
                                    {renderFolderRows()}
                                    {selectedFolder && (
                                        <ScrollView style={styles.notesContainer}>
                                            {filteredNotes.length > 0 ? (
                                                renderNoteRows()
                                            ) : (
                                                <View style={{ marginHorizontal: 16 }}>
                                                    <Text style={styles.text}>No notes found in this folder.</Text>
                                                </View>
                                            )}
                                        </ScrollView>
                                    )}

                                </>
                            ) : (
                                <Text style={styles.text}>No folders found.</Text>
                            )
                        )}

                        {/* Edit Mode Modal */}
                        <Modal
                            isVisible={showEditModal}
                            transparent={true}
                            animationIn='fadeIn'
                            animationOut='fadeOut'
                            onBackdropPress={() => setShowEditModal(false)}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Edit</Text>
                                <View style={styles.modalButtonContainer}>


                                    {filteredNotes.length > 0 && (
                                        <>
                                            <View style={styles.separatorLine} />
                                            <TouchableOpacity onPress={openEditNotesModal} style={styles.modalButton}>
                                                <Text style={styles.modalButtonText}>Edit Notes</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    <View style={styles.separatorLine} />

                                    {viewMode === 'folders' && (
                                        <TouchableOpacity onPress={openAddFolderModal} style={styles.modalButton}>
                                            <Text style={styles.modalButtonText}>Create folder</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </Modal>

                        {/* Edit Notes Modal */}
                        <Modal
                            isVisible={showEditNotesModal}
                            transparent={true}
                            animationIn='fadeIn'
                            animationOut='fadeOut'
                            onBackdropPress={() => setShowEditNotesModal(false)}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Edit notes</Text>
                                <View style={styles.modalButtonContainer}>
                                    <View style={styles.separatorLine} />

                                    <TouchableOpacity onPress={onMovingNotes} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Move to folder</Text>
                                    </TouchableOpacity>

                                    <View style={styles.separatorLine} />

                                    <TouchableOpacity onPress={onPinToPetProfile} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Pin to pet profile</Text>
                                    </TouchableOpacity>

                                    <View style={styles.separatorLine} />

                                    <TouchableOpacity onPress={confirmDeleteNotes} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        { /* Select Folder Modal */}
                        <Modal
                            isVisible={showSelectingFolderModal}
                            transparent={true}
                            animationIn='fadeIn'
                            animationOut='fadeOut'
                            onBackdropPress={() => setShowSelectingFolderModal(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={{ width: '100%', }}>
                                    <Text style={[styles.modalTitle, { alignSelf: 'center' }]}>Select folder</Text>
                                    <View style={styles.separatorLine} />
                                </View>

                                <View style={styles.modalButtonContainer}>
                                    <ScrollView>
                                        {folders.map(folder => (
                                            <TouchableOpacity
                                                key={folder.id}
                                                style={[styles.modalButton, { alignItems: 'flex-start', paddingHorizontal: 15, }]}
                                                onPress={() => {
                                                    // Set the selected destination folder immediately
                                                    setSelectedDestinationFolder(folder);

                                                    // Wait for 300ms before moving selected notes
                                                    setTimeout(() => {
                                                        moveSelectedNotes();

                                                        // After moving the notes, wait another 300ms before closing the modal
                                                        setTimeout(() => {
                                                            setShowSelectingFolderModal(false);
                                                        }, 300); // Adjust the delay as needed
                                                    }, 300); // Adjust the delay as needed
                                                }}
                                            >
                                                <Text style={[styles.modalButtonText, { paddingVertical: 5, }]}>{folder.folderName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        { /* Select Pet Profile Modal */}
                        <Modal
                            isVisible={showSelectingPetProfileModal}
                            transparent={true}
                            animationIn='fadeIn'
                            animationOut='fadeOut'
                            onBackdropPress={() => setShowSelectingPetProfileModal(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={{ width: '100%', }}>
                                    <Text style={[styles.modalTitle, { alignSelf: 'center' }]}>Select pet profile</Text>
                                    <View style={styles.separatorLine} />
                                </View>

                                <View style={styles.modalButtonContainer}>
                                    <ScrollView>
                                        {pets.map(pet => (
                                            <TouchableOpacity
                                                key={pet.id}
                                                style={[styles.modalButton, { alignItems: 'flex-start', paddingHorizontal: 15, }]}
                                                onPress={() => {
                                                    // Set the selected pet profile
                                                    setSelectedDestinationPetProfile(pet);

                                                    // Pin the pet profile
                                                    pinToPetProfile();
                                                    console.log('hi');

                                                    // Close the modal after a short delay
                                                    setTimeout(() => {
                                                        setShowSelectingPetProfileModal(false);
                                                    }, 3000); // Adjust the delay as needed
                                                    console.log('why this is not closing');
                                                }}
                                            >
                                                <Text style={[styles.modalButtonText, { paddingVertical: 5, }]}>{pet.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        {/* Add New Folder Modal */}
                        <AddFolderModal
                            isVisible={showAddFolderModal}
                            onClose={closeAddFolderModal}
                            onFolderAdded={addNewFolder}
                        />

                        { /* Delete post confirmation Modal */}
                        <Modal
                            isVisible={showDeleteConfirmationModal}
                            transparent={true}
                            animationIn="fadeIn"
                            animationOut="fadeOut"
                            onBackdropPress={closeDeleteConfirmationModal}
                        >
                            <View style={styles.deleteConfirmationModalContainer}>
                                <View style={styles.deleteConfirmationModalContent}>
                                    <Text style={styles.deleteConfirmationModalTitle}>Delete this post?</Text>
                                    <View style={styles.deleteConfirmationModalButtonsContainer}>

                                        <TouchableOpacity style={styles.deleteConfirmationModalButton} onPress={closeDeleteConfirmationModal}>
                                            <Text style={styles.deleteConfirmationModalButtonText}>No</Text>
                                        </TouchableOpacity>

                                        <View style={styles.verticalLine} />

                                        <TouchableOpacity style={styles.deleteConfirmationModalButton} onPress={deleteSelectedNotes}>
                                            <Text style={[styles.deleteConfirmationModalButtonText, { color: '#F26419' }]}>Yes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        {/* Buttons for Moving Mode */}
                        {isMovingMode && (
                            <View style={styles.editModeButtonsContainer}>
                                <TouchableOpacity onPress={closeEditNotesModal} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                                    <Text style={styles.editModeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmMovingNotes} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                                    <Text style={styles.editModeButtonText}>Move to...</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Buttons for Moving Mode */}
                        {isPinningMode && (
                            <View style={styles.editModeButtonsContainer}>
                                <TouchableOpacity onPress={closeEditNotesModal} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                                    <Text style={styles.editModeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmPinToPetProfile} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                                    <Text style={styles.editModeButtonText}>Pin to...</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Buttons for Delete Mode */}
                        {isDeleteMode && (
                            <View style={styles.editModeButtonsContainer}>
                                <TouchableOpacity onPress={closeEditNotesModal} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                                    <Text style={styles.editModeButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={openDeleteConfirmationModal} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                                    <Text style={styles.editModeButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View >

                    {/* Add Note Button */}
                    {!isDeleteMode && !isMovingMode && !isPinningMode && (
                        <TouchableOpacity style={styles.addNoteButton} onPress={handleAddingNote}>
                            <Ionicons name="add-circle" size={70} color='rgba(242, 100, 25, 0.7)' />
                        </TouchableOpacity>
                    )}

                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToHome={directToHome}
                        directToLibrary={directToLibrary}
                        directToForum={directToForum}
                    />
                </View >
            )}

            {currentScreen === 'AddNote' && (
                <AddNoteScreen
                    fetchNotes={fetchNotes}
                    closeAddNote={onClose}
                />
            )}

            {currentScreen === 'NoteDetails' && selectedNote && (
                <NoteDetailsScreen
                    note={selectedNote}
                    closeNoteDetails={onClose}
                    showEditButton={true}
                />
            )}

            {currentScreen === 'ManageFolders' && (
                <ManageFoldersScreen
                    closeManageFolders={onClose}
                />
            )}

            { /* Menu Modal */}
            <MenuModal
                visible={showMenuModal}
                onClose={closeMenuModal}
                handleAllNotesView={handleAllNotesView}
                handleFoldersView={handleFoldersView}
                handleManageFolders={openManageFoldersScreen}
                currentViewMode={viewMode}
            />
        </>
    );
};

const styles = StyleSheet.create({
    notebookContainer: {
        marginTop: '10%',
        flex: 1,
    },
    searchContainer: {
        marginTop: '3%',
        marginBottom: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
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
        marginHorizontal: 16,
    },
    toggleMenuButton: {
        marginRight: 10,
        alignSelf: 'center',
    },
    toggleEditModeButton: {
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
    text: {
        fontSize: 14,
        padding: 5,
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
        marginHorizontal: 16,
    },
    noteItem: {
        width: ITEM_WIDTH,
        height: 200,
        borderWidth: 1,
        borderRadius: 17,
        borderColor: '#000000',
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
    foldersContainer: {
        height: 45,
        borderColor: '#000000',
        marginHorizontal: 16,
    },
    folderItem: {
        width: 120,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        marginRight: 9,
        padding: 3,
    },
    folderName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 7,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    addNoteButton: {
        position: 'absolute',
        bottom: '8.65%',
        right: '4.1%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonContainer: {
        alignSelf: 'center',
    },
    modalContent: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        width: '80%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
    },
    separatorLine: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
    },
    editModeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 16,
    },
    editModeButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        margin: 3,
    },
    editModeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loadingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    checkboxContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
    },

    deleteConfirmationModalContainer: {
        alignSelf: 'center',
    },
    deleteConfirmationModalContent: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 17,
    },
    deleteConfirmationModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        alignSelf: 'center',
    },
    deleteConfirmationModalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        margin: 15,
    },
    deleteConfirmationModalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteConfirmationModalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        padding: 2,
    },
    verticalLine: {
        borderRightColor: '#808080',
        borderRightWidth: 1,
        marginVertical: 4,
    },

});