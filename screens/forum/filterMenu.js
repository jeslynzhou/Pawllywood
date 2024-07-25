import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Modal, TouchableWithoutFeedback } from 'react-native';

const FilterMenu = ({ isVisible, onClose, onApply, onClear, selectedFilters, onChangeFilter }) => {
    // Handle mutually exclusive selection for crowd alert filters
    const handleCrowdAlertToggle = (type) => {
        if (type === 'crowdAlert') {
            onChangeFilter('crowdAlert', true);
            onChangeFilter('notCrowdAlert', false);
        } else {
            onChangeFilter('crowdAlert', false);
            onChangeFilter('notCrowdAlert', true);
        }
    };

    // Function to handle clearing all filters
    const handleClearFilters = () => {
        onChangeFilter('saved', false);
        onChangeFilter('pinned', false);
        onChangeFilter('crowdAlert', false);
        onChangeFilter('notCrowdAlert', false);
        if (onClear) onClear(); // Optionally call onClear if provided
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.menu}>
                <Text style={styles.title}>Filter Options</Text>
                <View style={styles.filterItem}>
                    <Switch
                        value={selectedFilters.saved}
                        onValueChange={(newValue) => onChangeFilter('saved', newValue)}
                    />
                    <Text>Saved Posts</Text>
                </View>
                <View style={styles.filterItem}>
                    <Switch
                        value={selectedFilters.pinned}
                        onValueChange={(newValue) => onChangeFilter('pinned', newValue)}
                    />
                    <Text>Pinned Posts</Text>
                </View>
                <View style={styles.filterItem}>
                    <Switch
                        value={selectedFilters.crowdAlert}
                        onValueChange={() => handleCrowdAlertToggle('crowdAlert')}
                    />
                    <Text>Crowd Alert Posts</Text>
                </View>
                <View style={styles.filterItem}>
                    <Switch
                        value={selectedFilters.notCrowdAlert}
                        onValueChange={() => handleCrowdAlertToggle('notCrowdAlert')}
                    />
                    <Text>Not Crowd Alert Posts</Text>
                </View>
                {/* Add more filter options as needed */}
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => {
                        onApply();
                        onClose(); // Close the modal after applying filters
                    }}
                >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                        handleClearFilters();
                        onClose(); // Close the modal after clearing filters
                    }}
                >
                    <Text style={styles.clearButtonText}>Clear Filters</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menu: {
        position: 'absolute',
        top: '30%', // Center vertically
        right: 30,
        left: 30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 17,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    applyButton: {
        marginTop: 20,
        backgroundColor: '#F26419',
        paddingVertical: 10,
        borderRadius: 17,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    clearButton: {
        marginTop: 10,
        backgroundColor: '#ddd',
        paddingVertical: 10,
        borderRadius: 17,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#000',
        fontSize: 16,
    },
});

export default FilterMenu;
