import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { updateDoc, doc } from 'firebase/firestore';

export default function NoteDetailsScreen({ note, closeNoteDetails }) {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [noteFolderId, setNoteFolderId] = useState('');

    useEffect(() => {
        setNoteTitle(note.title);
        setNoteText(note.text);
        setNoteFolderId(note.folderId);
    }, [note]);

    const handleSaveNote = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const noteRef = doc(db, `users/${user.uid}/notes`, note.id);

                // Check if there are changes before updating
                if (noteTitle !== note.title || noteText !== note.text || noteFolderId !== note.folderId) {
                    await updateDoc(noteRef, {
                        title: noteTitle,
                        text: noteText,
                        folderId: noteFolderId,
                    });
                    Alert.alert('Note updated successfully!');
                } else {
                    console.log('No changes detected');
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
            </View>

            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.input}
                    multiline
                    value={noteText}
                    onChangeText={setNoteText}
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
