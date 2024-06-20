import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NavigationBar from '../../components/navigationBar';

export default function HomeScreen({ directToProfile, directToNotebook, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Home');
    return (
        <View style={styles.homeContainer}>
            <Text>Home Screen</Text>
            {/* Navigation Bar */}
            <NavigationBar
                activeScreen={currentScreen}
                directToProfile={directToProfile}
                directToNotebook={directToNotebook}
                directToLibrary={directToLibrary}
                directToForum={directToForum}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
