import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';

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
            isVisible={isVisible}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={onClose}
        >
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
    menu: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 17,
        alignSelf: 'center',
        width: '90%',
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
