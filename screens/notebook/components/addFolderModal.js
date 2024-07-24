import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import Modal from 'react-native-modal';

import { auth, db } from '../../../initializeFB';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddFolderModal = ({ isVisible, onClose, onFolderAdded }) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [isAddingFolder, setIsAddingFolder] = useState(false);
    const [folderNameCount, setFolderNameCount] = useState(0);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleFolderNameChange = (text) => {
        if (text.length <= 80) {
            setNewFolderName(text);
            setFolderNameCount(text.length);
        }
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
                    createdAt: formatDate(new Date()),
                });

                const newFolder = {
                    id: newFolderRef.id,
                    folderName: newFolderName.trim(),
                    createdAt: formatDate(new Date()),
                };

                onFolderAdded(newFolder);
                setNewFolderName('');
                setIsAddingFolder(false);
                setFolderNameCount(0);
                onClose();
            }
        } catch (error) {
            console.error('Error adding folder:', error.message);
            Alert.alert('Error', 'Failed to add folder');
            setIsAddingFolder(false);
        }
    };

    const onCancelAddingFolder = () => {
        setNewFolderName('');
        setIsAddingFolder(false);
        setFolderNameCount(0);
        onClose();
    }

    return (
        <Modal
            isVisible={isVisible}
            transparent={true}
            animationIn='fadeIn'
            animationOut='fadeOut'
            onBackdropPress={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeaderContainer}>
                        <Text style={styles.modalTitle}>Create folder</Text>
                        <View style={styles.characterCountTextContainer}>
                            <Text style={{ color: '#808080' }}>{folderNameCount}/80</Text>
                        </View>
                    </View>
                    <TextInput
                        style={styles.folderNameInput}
                        placeholder="Folder Name"
                        value={newFolderName}
                        onChangeText={handleFolderNameChange}
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity onPress={onCancelAddingFolder} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={styles.verticalLine} />
                        <TouchableOpacity onPress={addNewFolder} style={styles.modalButton} disabled={isAddingFolder}>
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
    );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
    modalHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    characterCountTextContainer: {
        justifyContent: 'center',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
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
});

export default AddFolderModal;