import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NavigationBar from '../../components/navigationBar';

export default function ForumScreen({ directToProfile, directToNotebook, directToHome, directToLibrary }) {
    const [currentScreen, setCurrentScreen] = useState('Forum');
    return (
        <View style={styles.forumContainer}>
            <Text>Forum Screen</Text>
            {/* Navigation Bar */}
            <NavigationBar
                activeScreen={currentScreen}
                directToProfile={directToProfile}
                directToNotebook={directToNotebook}
                directToHome={directToHome}
                directToLibrary={directToLibrary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    forumContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
