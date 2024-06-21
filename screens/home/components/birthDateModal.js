import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';

export default function BirthDateModal({ visible, onDateSelect, onClose }) {
    const handleDateSelect = (date) => {
        onDateSelect(date);
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <DatePicker
                    mode='calendar'
                    onSelectedChange={handleDateSelect}
                    options={{
                        mainColor: '#F26419',
                        borderColor: 'rgba(0, 0, 0, 0)'
                    }}
                    style={{ borderRadius: 17 }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(252, 249, 217, 1)',
        padding: 32,
        marginTop: 64,
    },
})