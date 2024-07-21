import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { addDoc, collection } from 'firebase/firestore';

export default function AddNoteScreen({ fetchNotes, closeAddNote }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [folderId, setFolderId] = useState(''); // Optional folder ID
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleAddNote = async () => {
        try {
            // Validate inputs
            if (!title.trim() && !text.trim()) {
                closeAddNote();
                return;
            }

            const noteTitle = title.trim() || 'Untitled';

            // Create a new note document
            const user = auth.currentUser;
            const notesCollectionRef = collection(db, 'users', user.uid, 'notes'); // Replace 'currentUserId' with the actual user ID
            await addDoc(notesCollectionRef, {
                title: noteTitle,
                text: text.trim(),
                createdAt: formatDate(new Date()),
                folderId: folderId.trim() || '', // Optionally assign a folder ID
            });

            // Fetch updated notes data
            fetchNotes();

            // Close the Add Note screen
            closeAddNote();

            // Reset state
            setTitle('');
            setText('');
            setFolderId('');

            Alert.alert('Success', 'Note added successfully!');
        } catch (error) {
            console.error('Error adding note:', error.message);
            Alert.alert('Error', 'Failed to add note. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleAddNote} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <TextInput
                    style={styles.headerText}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title..."
                    maxLength={100}
                />
            </View>

            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Enter text"
                    multiline
                />
            </View>
        </View>
    );
};

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
        backgroundColor: '#FFFFFF',
        height: 665,
    },
    input: {
        fontSize: 16,
        textAlignVertical: 'top',
    },
});
