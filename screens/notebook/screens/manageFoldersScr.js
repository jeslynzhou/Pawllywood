import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageFoldersScreen({ closeManageFolders }) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeManageFolders} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text>Manage Folders Screen</Text>
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
