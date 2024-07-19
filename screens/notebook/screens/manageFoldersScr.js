import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc, addDoc, Timestamp } from 'firebase/firestore';

export default function ManageFoldersScreen({ closeManageFolders }) {
    const [foldersData, setFoldersData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFoldersForDelete, setSelectedFoldersForDelete] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newFolderName, setNewFolderName] = useState('')
    const [isAddingFolder, setIsAddingFolder] = useState(false);

    useEffect(() => {
        fetchFolderData();
    }, []);

    const fetchFolderData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const foldersCollectionRef = collection(db, `users/${userId}/folders`);
                const querySnapshot = await getDocs(foldersCollectionRef);
                const folders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFoldersData(folders);
            } else {
                console.log('User not authenticated.');
            }
        } catch (error) {
            console.error('Error fetching folders:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const onClose = () => {
        setIsModalVisible(false);
    };

    const toggleEditMode = () => {
        setIsEditMode(prev => !prev);
        setSelectedFoldersForDelete([]);
    };

    const toggleSelectFolder = (folderId) => {
        const index = selectedFoldersForDelete.indexOf(folderId);
        if (index === -1) {
            setSelectedFoldersForDelete([...selectedFoldersForDelete, folderId]);
        } else {
            const updatedSelectedFoldersForDelete = [...selectedFoldersForDelete];
            updatedSelectedFoldersForDelete.splice(index, 1);
            setSelectedFoldersForDelete(updatedSelectedFoldersForDelete);
        }
    };

    const toggleAddNewFolderModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const addNewFolder = async () => {
        if (!newFolderName.trim()) {
            Alert.alert('Error', 'Folder name cannot be empty');
            return;
        }

        setIsAddingFolder(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const foldersCollectionRef = collection(db, 'users', user.uid, 'folders');

                // Check if the folder name already exists
                const querySnapShot = await getDocs(foldersCollectionRef);
                const existingFolders = querySnapShot.docs.map(doc => doc.data().folderName);

                if (existingFolders.includes(newFolderName.trim())) {
                    Alert.alert('Error', "There's already a folder with that name.");
                    setIsAddingFolder(false);
                    return;
                }

                const newFolderRef = await addDoc(foldersCollectionRef, {
                    folderName: newFolderName.trim(),
                    createdAt: Timestamp.fromDate(new Date()),
                    noteIds: [],
                });

                const newFolder = {
                    id: newFolderRef.id,
                    folderName: newFolderName.trim(),
                    createdAt: Timestamp.fromDate(new Date()),
                    noteIds: [],
                };

                setFoldersData(prevFolders => [...prevFolders, newFolder]);
                setNewFolderName('');
                setIsAddingFolder(false);
                toggleAddNewFolderModal();
            }
        } catch (error) {
            console.error('Error adding folder:', error.message);
            Alert.alert('Error', 'Failed to add folder');
            setIsAddingFolder(false);
        }
    };

    const deleteSelectedFolders = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const deletionPromises = selectedFoldersForDelete.map(async (folderId) => {
                    const folderDocRef = doc(db, `users/${userId}/folders`, folderId);
                    await deleteDoc(folderDocRef);
                });

                await Promise.all(deletionPromises);

                // Refresh after deletion
                fetchFolderData();
                setSelectedFoldersForDelete([]);
                setIsEditMode(false); // Exit edit mode after deletion
            }
        } catch (error) {
            console.error('Error deleting folders:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeManageFolders} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Manage Folders</Text>
                <TouchableOpacity onPress={foldersData.length > 0 ? toggleEditMode : null} style={styles.editContainer}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#F26419' />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {/* Folders List */}
                    {foldersData.length === 0 ? (
                        <TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.folderName, { color: '#CCCCCC' }]}>You don't have any folders.</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        foldersData.map((folder) => (
                            <View key={folder.id}>
                                <TouchableOpacity
                                    onPress={() => { }}
                                    style={styles.folderContainer}
                                >
                                    <View style={styles.folderInfo}>
                                        <Ionicons name="folder-outline" size={24} color='#000000' />
                                        <Text style={styles.folderName}>{folder.folderName}</Text>
                                    </View>
                                    {isEditMode && (
                                        <View style={{ justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => toggleSelectFolder(folder.id)}>
                                                <Ionicons name={selectedFoldersForDelete.includes(folder.id) ? 'checkbox-outline' : 'square-outline'} size={24} color='#000000' />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.separatorLine} />
                            </View>
                        ))
                    )}
                    <TouchableOpacity onPress={toggleAddNewFolderModal} style={styles.folderContainer}>
                        <View style={styles.folderInfo}>
                            <Ionicons name="add-circle-outline" size={24} color='#000000' />
                            <Text style={styles.folderName}>Create folder</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Buttons for Edit Mode */}
            {isEditMode && (
                <View style={styles.editModeButtonsContainer}>
                    <TouchableOpacity onPress={toggleEditMode} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                        <Text style={styles.editModeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteSelectedFolders} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                        <Text style={styles.editModeButtonText}>Confirm Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            { /* Adding New Folder Modal */}
            <Modal
                isVisible={isModalVisible}
                transparent={true}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create folder</Text>
                        <TextInput
                            style={styles.folderNameInput}
                            placeholder="Folder Name"
                            value={newFolderName}
                            onChangeText={setNewFolderName}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity onPress={toggleAddNewFolderModal} style={[styles.modalButton, styles.cancelButton]}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={styles.verticalLine} />
                            <TouchableOpacity onPress={addNewFolder} style={[styles.modalButton, styles.addButton]} disabled={isAddingFolder}>
                                {isAddingFolder ? (
                                    <ActivityIndicator size='small' color='#F26419' />
                                ) : (
                                    <Text style={styles.modalButtonText}>Add</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const screenHeight = Dimensions.get('window').height;

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
        marginBottom: 21,
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
    editContainer: {
        justifyContent: 'flex-end',
    },
    editText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    noFoldersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    folderContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    folderInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    folderName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        height: screenHeight * (1 / 3.5),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        justifyContent: 'center',
    },
    folderNameInput: {
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 17,
        padding: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    verticalLine: {
        borderRightColor: '#CCCCCC',
        borderRightWidth: 1,
        marginVertical: 5,
    },
    editModeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    editModeButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        marginHorizontal: 3,
    },
    editModeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
