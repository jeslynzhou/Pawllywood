import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, deleteDoc, doc } from 'firebase/firestore';

import DeleteAccountModal from '../components/deleteAccountModal';
import PostDeletionScreen from './postDeletionScr';

export default function ManageAccountScreen({ closeManageAccountScreen }) {
    const [currentScreen, setCurrentScreen] = useState('ManageAccount');
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    const openDeleteAccountModal = () => {
        setShowDeleteAccountModal(true);
    };

    const closeDeleteAccountModal = () => {
        setShowDeleteAccountModal(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await user.delete();
            }

            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            setShowDeleteAccountModal(false);
            setCurrentScreen('PostDeletion');

        } catch (error) {
            console.log('Error deleting user account:', error.message);
            Alert.alert('Delete Account Failed', 'Failed to delete your account. Please try again later.');
        }
    };

    return (
        <>
            {currentScreen === 'ManageAccount' && (
                <>
                    <View style={styles.manageAccountContainer}>
                        {/* Header */}
                        < View style={styles.headerContainer} >
                            <TouchableOpacity onPress={closeManageAccountScreen} style={styles.backButton}>
                                <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Manage Account</Text>
                        </View >

                        {/* Content */}
                        <View style={styles.featureContainer}>
                            <TouchableOpacity onPress={openDeleteAccountModal}>
                                <View style={styles.featurePanel}>
                                    <Ionicons name="trash-outline" size={24} color='#000000' />
                                    <Text style={styles.featurePanelText}>Delete account</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' style={{ marginLeft: 'auto' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DeleteAccountModal
                        visible={showDeleteAccountModal}
                        onClose={closeDeleteAccountModal}
                        handleDeleteAccount={handleDeleteAccount}
                    />
                </>
            )}
            {currentScreen === 'PostDeletion' && (
                <PostDeletionScreen />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    manageAccountContainer: {
        flex: 1,
        marginTop: '10%',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginBottom: 21,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    featureContainer: {
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    featurePanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
    },
    featurePanelText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    button: {
        height: 45,
        backgroundColor: '#F26419',
        borderColor: '#F26419',
        borderWidth: 1,
        borderRadius: 17,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loadingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
});