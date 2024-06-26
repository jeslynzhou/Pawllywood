import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import DatePicker from 'react-native-modern-datepicker';

export default function BirthDateModal({ initialDate, visible, onDateSelect, dateType, onClose }) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [currentDate, setCurrentDate] = useState(initialDate);

    useEffect(() => {
        setCurrentDate(initialDate);
    }, [initialDate]);

    const handleDateSelect = (date) => {
        try {
            const dateParts = date.split('/');
            const parsedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid Date');
            }

            const formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`;

            onDateSelect(formattedDate, dateType);
            onClose();

        } catch (error) {
            console.error('Error formatting date:', error);
        }
    };

    const handleCancelDateSelection = () => {
        setSelectedDate(initialDate);
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <DatePicker
                    mode='calendar'
                    selected={currentDate}
                    onSelectedChange={(date) => setCurrentDate(date)}
                    options={{
                        mainColor: '#F26419',
                        borderColor: 'rgba(0, 0, 0, 0)'
                    }}
                    style={{ borderRadius: 17 }}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={handleCancelDateSelection}
                        style={[styles.button, { backgroundColor: '#CCCCCC' }]}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDateSelect.bind(this, currentDate)}
                        style={[styles.button, { backgroundColor: '#F26419' }]}
                    >
                        <Text style={styles.buttonText}>Select</Text>
                    </TouchableOpacity>
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
        backgroundColor: 'rgba(252, 249, 217, 1)',
        padding: 32,
        marginTop: 64,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 15,
    },
    button: {
        flex: 1,
        height: 45,
        backgroundColor: '#F26419',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});