import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Modal from 'react-native-modal';

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
            isVisible={visible}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={onClose}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Emergency Hotlines</Text>
                {hotlines.map((hotline, index) => (
                    <TouchableOpacity key={index} onPress={() => handleCall(hotline.number)} style={styles.hotlineButton}>
                        <Text style={styles.hotlineText}>{hotline.label}: {hotline.number}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 17,
        alignItems: 'center',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
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
        paddingHorizontal: 20,
    },
});


export default EmergencyModal;

