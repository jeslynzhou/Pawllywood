import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const LogoutModal = ({ visible, onClose, onLogout }) => (
    <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Log out of your account?</Text>
                <View style={styles.modalButtonContainer}>
                    <View style={styles.separatorLine} />

                    <TouchableOpacity onPress={onLogout} style={styles.modalButton}>
                        <Text style={styles.modalButtonTextHighlighted}>Log out</Text>
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
        marginVertical: 20,
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        alignSelf: 'center',
    },
    modalButtonTextHighlighted: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F26419',
    },
    modalButtonText: {
        fontSize: 16,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
});

export default LogoutModal;