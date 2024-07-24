import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

import AddFolderModal from '../components/addFolderModal';

export default function ManageFoldersScreen({ closeManageFolders }) {
    const [foldersData, setFoldersData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFoldersForDelete, setSelectedFoldersForDelete] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const addNewFolder = async (newFolder) => {
        setFoldersData(prevFolders => [...prevFolders, newFolder]);
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
                                <Text style={{ fontSize: 16, margin: 15, }}>You don't have any folders.</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        foldersData.map((folder) => (
                            <View key={folder.id}>
                                <View style={styles.folderContainer}>
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
                                </View>

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

            {/* Adding New Folder Modal */}
            <AddFolderModal
                isVisible={isModalVisible}
                onClose={onClose}
                onFolderAdded={addNewFolder}
            />
        </View>
    );
}

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
