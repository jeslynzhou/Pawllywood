import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const MenuModal = ({ visible, onClose, handleAllNotesView, handleFoldersView, handleManageFolders, currentViewMode }) => {

    return (
        <Modal
            isVisible={visible}
            transparent={true}
            animationIn='slideInLeft'
            animationOut='slideOutLeft'
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <View style={styles.modalButtonContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.modalTitle}>Menu</Text>
                    </View>

                    <View style={styles.separatorLine} />

                    <TouchableOpacity
                        onPress={handleAllNotesView}
                        style={[styles.modalButton, currentViewMode === 'allNotes' ? styles.activeModalButton : null]}
                    >
                        <Ionicons name="document-text-outline" size={24} color='#000000' />
                        <Text style={styles.modalButtonText}>All Notes</Text>
                    </TouchableOpacity>

                    <View style={styles.separatorLine} />

                    <TouchableOpacity
                        onPress={handleFoldersView}
                        style={[styles.modalButton, currentViewMode !== 'allNotes' ? styles.activeModalButton : null]}
                    >
                        <Ionicons name="folder-open-outline" size={24} color='#000000' />
                        <Text style={styles.modalButtonText}>Folders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleManageFolders} style={styles.manageFoldersButton} >
                        <Text style={styles.manageFolderButtonText}>Manage Folders</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        width: screenWidth * (2 / 3),
        height: '100%',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        padding: 10,
        margin: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        margin: 5,
    },
    modalButtonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    activeModalButton: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
        borderRadius: 17,
        margin: 5,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
        width: '100%',
    },
    manageFoldersButton: {
        borderWidth: 1,
        borderRadius: 17,
        alignItems: 'center',
        marginHorizontal: 20,
        padding: 5,
    },
    manageFolderButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default MenuModal;
