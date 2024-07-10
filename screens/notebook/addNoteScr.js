import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { db, auth } from '../../initializeFB';
import { addDoc, collection } from 'firebase/firestore';

export default function AddNoteScreen({ fetchNotes, closeAddNote }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [folderId, setFolderId] = useState(''); // Optional folder ID

    const handleAddNote = async () => {
        try {
            // Validate inputs
            if (!title.trim()) {
                Alert.alert('Error', 'Please enter a title for your note.');
                return;
            }

            // Create a new note document
            const user = auth.currentUser;
            const notesCollectionRef = collection(db, 'users', user.uid, 'notes'); // Replace 'currentUserId' with the actual user ID
            const newNoteRef = await addDoc(notesCollectionRef, {
                title: title.trim(),
                text: text.trim(),
                createdAt: new Date().toLocaleDateString(),
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
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
                maxLength={100}
            />

            <Text style={styles.label}>Text</Text>
            <TextInput
                style={[styles.input, { height: 120 }]}
                value={text}
                onChangeText={setText}
                placeholder="Enter text"
                multiline
            />

            {/* Optional: Add folder selection UI */}
            {/* Replace this with your actual folder selection UI */}
            {/* For simplicity, assume a basic folder selection */}
            {/* <Text style={styles.label}>Folder</Text>
      <TextInput
        style={styles.input}
        value={folderId}
        onChangeText={setFolderId}
        placeholder="Enter folder ID (optional)"
      /> */}

            <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
                <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#F26419',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
