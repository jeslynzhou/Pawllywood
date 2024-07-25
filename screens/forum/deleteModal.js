import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const deleteModal = ({ isVisible, onConfirm, onCancel }) => {
    return (
        <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            transparent={true}
            isVisible={isVisible}
            onRequestClose={onCancel}
            onBackdropPress={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Delete this post?</Text>
                    <View style={styles.modalButtonsContainer}>

                        <TouchableOpacity style={styles.modalButton} onPress={onCancel}>
                            <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>

                        <View style={styles.verticalLine} />

                        <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
                            <Text style={[styles.modalButtonText, { color: '#F26419' }]}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        alignSelf: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 17,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        alignSelf: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        margin: 15,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        padding: 2,
    },
    verticalLine: {
        borderRightColor: '#808080',
        borderRightWidth: 1,
        marginVertical: 4,
    },
});

export default deleteModal;
