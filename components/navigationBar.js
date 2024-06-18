import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationBar = ({ activeScreen, directToProfile, directToNotebook, directToHome, directToLibrary, directToForum }) => {
    return (
        <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={directToProfile} style={[styles.navBarButton, activeScreen === 'Profile' ? styles.activeNavButton : null]}>
                <View style={[styles.iconWrapper, activeScreen === 'Profile' ? styles.activeIcon : null]}>
                    <Ionicons name="person-outline" size={24} color={activeScreen === 'Profile' ? '#FFF' : 'black'} />
                </View>
                <Text style={[styles.navBarText, activeScreen === 'Profile' ? styles.activeNavText : null]}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={directToNotebook} style={[styles.navBarButton, activeScreen === 'Notebook' ? styles.activeNavButton : null]}>
                <View style={[styles.iconWrapper, activeScreen === 'Notebook' ? styles.activeIcon : null]}>
                    <Ionicons name="bookmark-outline" size={24} color={activeScreen === 'Notebook' ? '#FFF' : 'black'} />
                </View>
                <Text style={[styles.navBarText, activeScreen === 'Notebook' ? styles.activeNavText : null]}>Notebook</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={directToHome} style={[styles.navBarButton, activeScreen === 'Home' ? styles.activeNavButton : null]}>
                <View style={[styles.iconWrapper, activeScreen === 'Home' ? styles.activeIcon : null]}>
                    <Ionicons name="home-outline" size={24} color={activeScreen === 'Home' ? '#FFF' : 'black'} />
                </View>
                <Text style={[styles.navBarText, activeScreen === 'Home' ? styles.activeNavText : null]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={directToLibrary} style={[styles.navBarButton, activeScreen === 'Library' ? styles.activeNavButton : null]}>
                <View style={[styles.iconWrapper, activeScreen === 'Library' ? styles.activeIcon : null]}>
                    <Ionicons name="folder-outline" size={24} color={activeScreen === 'Library' ? '#FFF' : 'black'} />
                </View>
                <Text style={[styles.navBarText, activeScreen === 'Library' ? styles.activeNavText : null]}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={directToForum} style={[styles.navBarButton, activeScreen === 'Forum' ? styles.activeNavButton : null]}>
                <View style={[styles.iconWrapper, activeScreen === 'Forum' ? styles.activeIcon : null]}>
                    <Ionicons name="chatbubbles-outline" size={24} color={activeScreen === 'Forum' ? '#FFF' : 'black'} />
                </View>
                <Text style={[styles.navBarText, activeScreen === 'Forum' ? styles.activeNavText : null]}>Forum</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
    },
    navBarButton: {
        alignItems: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navBarText: {
        marginTop: 5,
        fontSize: 12,
    },
    activeNavButton: {
        borderRadius: 10,
    },
    activeNavText: {
        color: '#F26419',
        fontWeight: 'bold',
    },
    activeIcon: {
        backgroundColor: '#F26419',
    },
});

export default NavigationBar;
