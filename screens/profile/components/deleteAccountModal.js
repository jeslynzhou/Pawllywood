import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function DeleteAccountModal({ visible, onClose, handleDeleteAccount }) {
    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Delete your account?</Text>
                    <Text style={styles.modalText}>Your account will be permanently deleted and you will no longer be able to use your account.</Text>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={handleDeleteAccount} style={styles.modalButton}>
                            <Text style={[styles.modalButtonText, { fontWeight: 'bold', color: '#F26419' }]}>Delete account</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    modalText: {
        fontSize: 14,
        marginHorizontal: 14,
        marginTop: 5,
        marginBottom: 14,
        textAlign: 'center'
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
});