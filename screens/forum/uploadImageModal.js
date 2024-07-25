import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UploadImageModal = ({ visible, onClose, onUploadFromCamera, onUploadFromLibrary }) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Upload Pictures</Text>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.separatorLine} />

                        <TouchableOpacity style={styles.modalButton} onPress={onUploadFromCamera}>
                            <Ionicons name="camera-outline" size={24} color='#000000' />
                            <Text style={styles.modalButtonText}>Upload from Camera</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity style={styles.modalButton} onPress={onUploadFromLibrary}>
                            <Ionicons name="image-outline" size={24} color='#000000' />
                            <Text style={styles.modalButtonText}>Upload from Library</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={[styles.modalButtonText, { color: '#CCCCCC' }]}>Cancel</Text>
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
        marginVertical: 20,
    },
    modalButtonContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    modalButton: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    closeButton: {
        alignSelf: 'center',
        padding: 10,
    },
});

export default UploadImageModal;
