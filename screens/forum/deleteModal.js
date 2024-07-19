import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const deleteModal = ({ isVisible, onConfirm, onCancel }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Are you sure you want to delete this post?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
                            <Text style={styles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={onCancel}>
                            <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 17,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
});

export default deleteModal;
