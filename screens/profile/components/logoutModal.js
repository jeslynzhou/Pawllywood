import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default function LogoutModal({ visible, onClose, onLogout }) {
    return (
        <Modal
            isVisible={visible}
            transparent={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Log out of your account?</Text>
                    <View style={styles.modalButtonContainer}>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={onLogout} style={styles.modalButton}>
                            <Text style={[styles.modalButtonText, { fontWeight: 'bold', color: '#F26419' }]}>Log out</Text>
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
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
});