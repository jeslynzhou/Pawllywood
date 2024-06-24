import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../../components/navigationBar';

export default function ForumScreen({ directToProfile, directToNotebook, directToHome, directToLibrary }) {
    const [currentScreen, setCurrentScreen] = useState('Forum');
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [askShareText, setAskShareText] = useState('');

    const handlePost = () => {
        if (postText.trim()) {
            setPosts([{ id: Date.now().toString(), text: postText }, ...posts]);
            setPostText('');
        }
    };

    const handleAskShareSubmit = () => {
        if (askShareText.trim()) {
            setPosts([{ id: Date.now().toString(), text: askShareText }, ...posts]);
            setAskShareText('');
        }
    };

    const filteredPosts = posts.filter(post => post.text.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.forumContainer}>
            {/* Search Box */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search posts..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Profile Section */}
            <View style={styles.profileSection}>
                {/* Replace with actual user profile picture */}
                <Image
                    style={styles.profilePicture}
                    source={require('../../assets/icon.png')} // Example placeholder
                />
                <TextInput
                    style={styles.askShareInput}
                    placeholder="Want to ask/share?"
                    value={askShareText}
                    onChangeText={setAskShareText}
                />
                <View style={styles.askPostButtons}>
                    <TouchableOpacity style={styles.button} onPress={handleAskShareSubmit}>
                        <Text style={styles.buttonText}>Ask</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePost}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Posts List */}
            <FlatList
                data={filteredPosts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.postText}>{item.text}</Text>
                    </View>
                )}
            />

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
}

const styles = StyleSheet.create({
    forumContainer: {
        flex: 1,
        padding: 16,
        marginTop: 50,
        backgroundColor: '#FCF9D9',
    },
    searchInput: {
        marginBottom: 16,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25, // half of the width and height to make it circular
        marginRight: 10,
    },
    askShareInput: {
        flex: 1,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    askPostButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        marginRight: 10,
        borderRadius: 17,
        backgroundColor: '#F26419',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    postContainer: {
        padding: 16,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    postText: {
        fontSize: 16,
    },
});
