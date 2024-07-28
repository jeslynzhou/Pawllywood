import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { updateDoc, doc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';

const ModalTypes = {
    NONE: 'none',
    EDIT_NOTE: 'edit_note',
    EDIT_BACKGROUND_COLOR: 'edit_background_color',
    FOLDER_SELECTION: 'folder_selection',
    PIN_TO_PET_PROFILE: 'pin_to_pet_profile',
    DELETE_CONFIRMATION: 'delete_confirmation'
};

const colorOptions = [
    'rgba(255, 255, 255, 0.7)', // White with 70% opacity
    'rgba(51, 101, 138, 0.7)',  // #33658A with 70% opacity
    'rgba(134, 187, 216, 0.7)', // #86BBD8 with 70% opacity
    'rgba(117, 142, 79, 0.7)',  // #758E4F with 70% opacity
    'rgba(246, 174, 45, 0.7)',  // #F6AE2D with 70% opacity
    'rgba(242, 100, 25, 0.7)'   // #F26419 with 70% opacity
];

export default function NoteDetailsScreen({ note, closeNoteDetails, showEditButton }) {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [notePetIds, setNotePetIds] = useState(note.petId || []);
    const [noteFolderId, setNoteFolderId] = useState(note.folderId || '');
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('');
    const [folders, setFolders] = useState([]);
    const [petProfiles, setPetProfiles] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [loadingPetProfiles, setLoadingPetProfiles] = useState(false);
    const [modalMode, setModalMode] = useState(ModalTypes.NONE);

    useEffect(() => {
        fetchPetProfiles();
        fetchFolders();
    }, []);

    useEffect(() => {
        setNoteTitle(note.title);
        setNoteText(note.text);
        setNoteFolderId(note.folderId || '');
        setNotePetIds(note.petId || []);
        setBackgroundColor(note.backgroundColor);
    }, [note]);

    const fetchFolders = async () => {
        setLoadingFolders(true);
        const user = auth.currentUser;
        if (user) {
            try {
                const foldersCollectionRef = collection(db, 'users', user.uid, 'folders');
                const foldersSnapshot = await getDocs(foldersCollectionRef);
                const fetchedFolders = foldersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                fetchedFolders.sort((a, b) => a.folderName.localeCompare(b.folderName));
                setFolders(fetchedFolders);
            } catch (error) {
                console.error('Error fetching folders:', error.message);
                showAlert('Error fetching folders', 'Failed to fetch folders data. Please try again later.');
            } finally {
                setLoadingFolders(false);
            }
        } else {
            showAlert('User not authenticated');
            setLoadingFolders(false);
        }
    };

    const fetchPetProfiles = async () => {
        setLoadingPetProfiles(true);
        const user = auth.currentUser;
        if (user) {
            try {
                const petProfilesCollectionRef = collection(db, 'users', user.uid, 'pets');
                const q = query(petProfilesCollectionRef, where('isArchived', '==', false));
                const petProfilesSnapshot = await getDocs(q);
                const fetchedPetProfiles = petProfilesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                fetchedPetProfiles.sort((a, b) => a.name.localeCompare(b.name));
                setPetProfiles(fetchedPetProfiles);
            } catch (error) {
                console.error('Error fetching pet profiles:', error.message);
                showAlert('Error fetching pet profiles', 'Failed to fetch folders data. Please try again later.');
            } finally {
                setLoadingPetProfiles(false);
            }
        } else {
            showAlert('User not authenticated');
            setLoadingPetProfiles(false);
        }
    };

    const handleSaveNote = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const noteRef = doc(db, `users/${user.uid}/notes`, note.id);
                if (noteTitle !== note.title || noteText !== note.text || !arraysEqual(notePetIds, note.petId) || noteFolderId !== note.folderId || backgroundColor !== note.backgroundColor) {
                    await updateDoc(noteRef, {
                        title: noteTitle,
                        text: noteText,
                        petId: notePetIds,
                        folderId: noteFolderId,
                        backgroundColor: backgroundColor,
                    });
                    showAlert('Note updated successfully!');
                }
            } catch (error) {
                console.error('Error updating note:', error.message);
                showAlert('Error updating note', 'Failed to update note. Please try again later.');
            }
        } else {
            console.log('User not authenticated');
        }
    };

    const handleBackAndSave = () => {
        handleSaveNote();
        closeNoteDetails();
    };

    const handleModalOpen = (modalType) => {
        setModalMode(modalType);
    };

    const handleModalClose = () => {
        setModalMode(ModalTypes.NONE);
    };

    const handleBackgroundColorSelection = (color) => {
        setBackgroundColor(color);
        setSelectedBackgroundColor(color);
        handleModalClose();
    };

    const handlePetSelection = async (petId) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const newPetIds = [...notePetIds];
                if (!newPetIds.includes(petId)) {
                    newPetIds.push(petId);
                }

                setNotePetIds(newPetIds);

                const noteRef = doc(db, 'users', user.uid, 'notes', note.id);
                await updateDoc(noteRef, { petId: newPetIds });

                showAlert('Note successfully pin to pet profile!');
                handleModalClose();
            } catch (error) {
                console.error('Error pinning note to pet profile:', error.message);
                showAlert('Error pinning note', 'Failed to pin note to pet profile. Please try again later.');
            }
        } else {
            showAlert('User not authenticated');
        }
    };

    const handleFolderSelection = async (folderId) => {
        const user = auth.currentUser;
        if (user) {
            try {
                setNoteFolderId(folderId);
                const noteRef = doc(db, 'users', user.uid, 'notes', note.id);
                await updateDoc(noteRef, { folderId });
                showAlert('Note successfully moved to new folder!');
                handleModalClose();
            } catch (error) {
                console.error('Error moving note to folder:', error.message);
                showAlert('Error moving note', 'Failed to move note to folder. Please try again later.');
            }
        } else {
            showAlert('User not authenticated');
        }
    };

    const handleDeleteNote = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const noteRef = doc(db, 'users', user.uid, 'notes', note.id);
                await deleteDoc(noteRef);
                showAlert('Note deleted successfully!');
                closeNoteDetails();
            } catch (error) {
                console.error('Error deleting note:', error.message);
                showAlert('Error deleting note', 'Failed to delete note. Please try again later.');
            }
        } else {
            console.log('User not authenticated');
        }
    };

    const showAlert = (title, message) => {
        Alert.alert(title, message, [{ text: 'OK' }]);
    };

    const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        return arr1.every(item => arr2.includes(item));
    };

    const renderModalContent = () => {
        switch (modalMode) {
            case ModalTypes.EDIT_NOTE:
                return (
                    <Modal
                        isVisible={modalMode === ModalTypes.EDIT_NOTE}
                        transparent={true}
                        animationIn='fadeIn'
                        animationOut='fadeOut'
                        onBackdropPress={handleModalClose}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalButtonContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.modalTitle}>Edit Note</Text>
                                </View>

                                <View style={styles.separatorLine} />

                                <TouchableOpacity onPress={() => handleModalOpen(ModalTypes.EDIT_BACKGROUND_COLOR)} style={styles.modalButton}>
                                    <Ionicons name="color-wand-outline" size={24} color='#000000' />
                                    <Text style={styles.modalButtonText}>Background Color</Text>
                                </TouchableOpacity>

                                <View style={styles.separatorLine} />

                                <TouchableOpacity onPress={() => handleModalOpen(ModalTypes.FOLDER_SELECTION)} style={styles.modalButton}>
                                    <Ionicons name="enter-outline" size={24} color='#000000' />
                                    <Text style={styles.modalButtonText}>Move to folder</Text>
                                </TouchableOpacity>

                                <View style={styles.separatorLine} />

                                <TouchableOpacity onPress={() => handleModalOpen(ModalTypes.PIN_TO_PET_PROFILE)} style={styles.modalButton}>
                                    <Ionicons name="paw-outline" size={24} color='#000000' />
                                    <Text style={styles.modalButtonText}>Pin to pet profile</Text>
                                </TouchableOpacity>

                                <View style={styles.separatorLine} />

                                <TouchableOpacity onPress={() => handleModalOpen(ModalTypes.DELETE_CONFIRMATION)} style={styles.modalButton}>
                                    <Ionicons name="trash-outline" size={24} color='#000000' />
                                    <Text style={styles.modalButtonText}>Delete Note</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                );
            case ModalTypes.EDIT_BACKGROUND_COLOR:
                return (
                    <Modal
                        isVisible={modalMode === ModalTypes.EDIT_BACKGROUND_COLOR}
                        transparent={true}
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        onBackdropPress={handleModalClose}
                        style={styles.modalContainer}
                    >
                        <View style={styles.editModalContainer}>
                            <View style={styles.editModalContent}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.editModalTitle}>Background color</Text>
                                    <View style={styles.separatorLine} />
                                </View>
                                <View style={styles.colorsContainer}>
                                    <View style={styles.colorRow}>
                                        {colorOptions.slice(0, 3).map((color, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.colorOption, { backgroundColor: color }]}
                                                onPress={() => handleBackgroundColorSelection(color)}
                                            >
                                                {selectedBackgroundColor === color && (
                                                    <Ionicons name="checkmark-circle" size={60} color="rgba(0, 0, 0, 0.5)" style={styles.checkmark} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <View style={styles.colorRow}>
                                        {colorOptions.slice(3, 6).map((color, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.colorOption, { backgroundColor: color }]}
                                                onPress={() => handleBackgroundColorSelection(color)}
                                            >
                                                {selectedBackgroundColor === color && (
                                                    <Ionicons name="checkmark-circle" size={60} color="rgba(0, 0, 0, 0.5)" style={styles.checkmark} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                );
            case ModalTypes.FOLDER_SELECTION:
                return (
                    <Modal
                        isVisible={modalMode === ModalTypes.FOLDER_SELECTION}
                        transparent={true}
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        onBackdropPress={handleModalClose}
                        style={styles.modalContainer}
                    >
                        <View style={styles.editModalContainer}>
                            <View style={styles.editModalContent}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.editModalTitle}>Move to Folder</Text>
                                    <View style={styles.separatorLine} />
                                </View>
                                <ScrollView style={styles.folderScrollView}>
                                    {folders.map((folder) => (
                                        <TouchableOpacity
                                            key={folder.id}
                                            style={styles.folderOptions}
                                            onPress={() => handleFolderSelection(folder.id)}
                                        >
                                            <Text style={styles.folderName}>{folder.folderName}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                );
            case ModalTypes.PIN_TO_PET_PROFILE:
                return (
                    <Modal
                        isVisible={modalMode === ModalTypes.PIN_TO_PET_PROFILE}
                        transparent={true}
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        onBackdropPress={handleModalClose}
                        style={styles.modalContainer}
                    >
                        <View style={styles.editModalContainer}>
                            <View style={styles.editModalContent}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.editModalTitle}>Pin to pet profile</Text>
                                    <View style={styles.separatorLine} />
                                </View>
                                {loadingPetProfiles ? (
                                    <Text>Loading pet profiles...</Text>
                                ) : (
                                    <ScrollView style={styles.folderScrollView}>
                                        {petProfiles.map((pet) => (
                                            <TouchableOpacity
                                                key={pet.id}
                                                style={styles.folderOptions}
                                                onPress={() => handlePetSelection(pet.id)}
                                            >
                                                <Text style={styles.folderName}>{pet.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        </View>
                    </Modal>
                );
            case ModalTypes.DELETE_CONFIRMATION:
                return (
                    <Modal
                        isVisible={modalMode === ModalTypes.DELETE_CONFIRMATION}
                        transparent={true}
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        onBackdropPress={handleModalClose}
                        style={styles.modalContainer}
                    >
                        <View style={styles.editModalContainer}>
                            <View style={styles.editModalContent}>
                                <Text style={styles.editModalTitle}>Delete note?</Text>
                                <View style={styles.editModalButtonContainer}>
                                    <TouchableOpacity onPress={handleModalClose} style={styles.editModalButton}>
                                        <Text style={styles.editModalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <View style={styles.verticalLine} />
                                    <TouchableOpacity onPress={handleDeleteNote} style={styles.editModalButton}>
                                        <Text style={[styles.editModalButtonText, { color: '#F26419' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackAndSave} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <TextInput
                    style={styles.headerText}
                    value={noteTitle}
                    onChangeText={setNoteTitle}
                    maxLength={100}
                    numberOfLines={1}
                />
                {showEditButton && (
                    <TouchableOpacity onPress={() => handleModalOpen(ModalTypes.EDIT_NOTE)} style={styles.editButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color='#000000' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.textInputContainer, { backgroundColor: backgroundColor }]}>
                <TextInput
                    style={styles.input}
                    multiline
                    value={noteText}
                    onChangeText={setNoteText}
                />
            </View>
            {renderModalContent()}
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        marginTop: '10%',
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        margin: 16,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    editButton: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
        right: 0,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    textInputContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 25,
        height: 676,
    },
    input: {
        fontSize: 16,
        textAlignVertical: 'top',
    },

    modalContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: screenWidth * (2 / 3),
        justifyContent: 'flex-start',
        borderRadius: 17,
    },
    titleContainer: {
        alignItems: 'center',
        padding: 10,
        margin: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7,
        margin: 5,
    },
    modalButtonText: {
        fontSize: 16,
        marginLeft: 10,
        padding: 2,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    editModalContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    editModalContent: {
        backgroundColor: '#FFFFFF',
        width: screenWidth * 0.8,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 17,
    },
    editModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        alignSelf: 'center',
    },
    editModalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        margin: 15,
    },
    editModalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editModalButtonText: {
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
    colorsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    checkmark: {
        position: 'absolute',
        alignSelf: 'center',
        top: -6,
        right: -6,
        width: 60,
    },

    folderScrollView: {
        alignSelf: 'flex-start',
        width: '100%',
        maxHeight: 170,
    },
    folderOptions: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    folderName: {
        alignSelf: 'flex-start',
        fontSize: 16,
    }
});