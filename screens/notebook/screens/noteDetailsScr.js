import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function NoteDetailsScreen({ note, closeNoteDetails }) {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [noteFolderId, setNoteFolderId] = useState('');
    const [showEditNoteModal, setShowEditNoteModal] = useState(false);
    const [showBackgroundColorModal, setShowBackgroundColorModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('');

    useEffect(() => {
        setNoteTitle(note.title);
        setNoteText(note.text);
        setNoteFolderId(note.folderId);
        setBackgroundColor(note.backgroundColor);
    }, [note]);

    const handleSaveNote = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const noteRef = doc(db, `users/${user.uid}/notes`, note.id);

                // Check if there are changes before updating
                if (noteTitle !== note.title || noteText !== note.text || noteFolderId !== note.folderId || backgroundColor !== note.backgroundColor) {
                    await updateDoc(noteRef, {
                        title: noteTitle,
                        text: noteText,
                        folderId: noteFolderId,
                        backgroundColor: backgroundColor,
                    });
                    Alert.alert('Note updated successfully!');
                }
            } catch (error) {
                console.error('Error updating note:', error.message);
                Alert.alert('Error updating note', 'Failed to update note. Please try again later.');
            }
        } else {
            console.log('User not authenticated');
        };
    };

    const handleBackAndSave = () => {
        handleSaveNote();
        closeNoteDetails();
    };

    { /* Edit Note Modal */ }
    const openEditNoteModal = () => {
        setShowEditNoteModal(true);
    };

    const closeEditNoteModal = () => {
        setShowEditNoteModal(false);
    };

    { /* Edit background color */ }
    const openEditBackgroundColorModal = () => {
        setShowBackgroundColorModal(true);
        setShowEditNoteModal(false);
    };

    const closeEditBackgroundColorModal = () => {
        setShowBackgroundColorModal(false);
    };

    const handleBackgroundColorSelection = (color) => {
        setBackgroundColor(color);
        setSelectedBackgroundColor(color); // keep track
        closeEditBackgroundColorModal();
    };

    const colorOptions = ['#FFFFFF', '#33658A', '#86BBD8', '#758E4F', '#F6AE2D', '#F26419']

    { /* Handle Delete Note */ }
    const openDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(true);
        setShowEditNoteModal(false);
    };

    const closeDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(false);
    };

    const handleDeleteNote = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const noteRef = doc(db, 'users', user.uid, 'notes', note.id);
                await deleteDoc(noteRef);
                Alert.alert('Note deleted successfully!');
                closeNoteDetails();
            } catch (error) {
                console.error('Error deleting note:', error.message);
                Alert.alert('Error deleting note', 'Failed to delete note. Please try again later.');
            }
        } else {
            console.log('User not authenticated');
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
                <TouchableOpacity onPress={openEditNoteModal} style={styles.editButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color='#000000' />
                </TouchableOpacity>
            </View>

            <View style={[styles.textInputContainer, { backgroundColor: backgroundColor }]}>
                <TextInput
                    style={styles.input}
                    multiline
                    value={noteText}
                    onChangeText={setNoteText}
                />
            </View>

            {/* Edit Note Modal */}
            <Modal
                isVisible={showEditNoteModal}
                transparent={true}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={closeEditNoteModal}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.modalTitle}>Edit Note</Text>
                        </View>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={openEditBackgroundColorModal} style={styles.modalButton}>
                            <Ionicons name="color-wand-outline" size={24} color='#000000' />
                            <Text style={styles.modalButtonText}>Background Color</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={{}} style={styles.modalButton}>
                            <Ionicons name="enter-outline" size={24} color='#000000' />
                            <Text style={styles.modalButtonText}>Move to folder</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={openDeleteConfirmationModal} style={styles.modalButton}>
                            <Ionicons name="trash-outline" size={24} color='#000000' />
                            <Text style={styles.modalButtonText}>Delete Note</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            { /* Edit Background Color Modal */}
            <Modal
                isVisible={showBackgroundColorModal}
                transparent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackdropPress={closeEditBackgroundColorModal}
            >
                <View style={styles.editModalContainer}>
                    <View style={styles.editModalContent}>
                        <Text style={styles.editModalTitle}>Background color</Text>
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
            </Modal >


            { /* Delete Note Confirmation Modal */}
            < Modal
                isVisible={showDeleteConfirmationModal}
                transparent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackdropPress={closeDeleteConfirmationModal}
            >
                <View style={styles.editModalContainer}>
                    <View style={styles.editModalContent}>
                        <Text style={styles.editModalTitle}>Delete note?</Text>
                        <View style={styles.editModalButtonContainer}>
                            <TouchableOpacity onPress={closeDeleteConfirmationModal} style={styles.editModalButton}>
                                <Text style={styles.editModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={styles.verticalLine} />
                            <TouchableOpacity onPress={handleDeleteNote} style={styles.editModalButton}>
                                <Text style={styles.editModalButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        </View >
    );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
        height: 665,
    },
    input: {
        fontSize: 16,
        textAlignVertical: 'top',
    },

    modalContainer: {
        position: 'absolute',
        top: 10,
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
        padding: 1,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
        marginVertical: 1,
    },
    editModalContainer: {
        alignSelf: 'center',
    },
    editModalContent: {
        backgroundColor: '#FFFFFF',
        width: screenWidth * 0.8,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 17,
        padding: 20,
    },
    editModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editModalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
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
        marginVertical: 5,
    },
    colorsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 5,
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
});
