import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button, Linking } from 'react-native';

const EmergencyModal = ({ visible, onClose }) => {
    const hotlines = [
        { label: 'SPCA 24/7 hotline', number: '6287 5355' },
        { label: 'AVS 24/7 hotline', number: '1800-476-1600' },
        { label: 'ACRES 24/7 hotline (for wildlife, birds, and terrapin rescues)', number: '9783 7782' },
        { label: 'Police 24/7 hotline', number: '999' },
    ];

    const handleCall = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Emergency Hotlines</Text>
                    {hotlines.map((hotline, index) => (
                        <TouchableOpacity key={index} onPress={() => handleCall(hotline.number)} style={styles.hotlineButton}>
                            <Text style={styles.hotlineText}>{hotline.label}: {hotline.number}</Text>
                        </TouchableOpacity>
                    ))}
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    hotlineButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    hotlineText: {
        fontSize: 16,
        color: '#007BFF',
    },
});


export default EmergencyModal;

