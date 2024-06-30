import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import NavigationBar from '../../components/navigationBar';

export default function NotebookScreen({ directToProfile, directToHome, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Notebook');

    return (
        <View style={styles.notebookContainer}>
            <Text>Notebook Screen</Text>
            {/* Navigation Bar */}
            <NavigationBar
                activeScreen={currentScreen}
                directToProfile={directToProfile}
                directToHome={directToHome}
                directToLibrary={directToLibrary}
                directToForum={directToForum}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    notebookContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
