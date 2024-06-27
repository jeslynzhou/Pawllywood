import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import NavigationBar from '../../components/navigationBar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../initializeFB';
import { Ionicons } from '@expo/vector-icons';

export default function ForumScreen({ directToProfile, directToNotebook, directToHome, directToLibrary, user }) {
    const [currentScreen, setCurrentScreen] = useState('Forum');
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [askShareText, setAskShareText] = useState('');
    const [userData, setUserData] = useState(null);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        if (user && user.uid) {
            fetchUserData();
        }
    }, [user]);

    const handlePost = (type) => {
        console.log('handlePost called with type:', type);
        console.log('Current userData:', userData);

        const text = type === 'post' ? postText : askShareText;
        console.log('Post text:', text);

        if (text.trim()) {
            const newPost = {
                id: Date.now().toString(),
                type,
                text,
                user: userData ? userData.name : 'Unknown User',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                comments: [],
                upvotes: 0,
                downvotes: 0
            };
            console.log('New post:', newPost);
            setPosts(prevPosts => [newPost, ...prevPosts]);
            setPostText('');
            setAskShareText('');
        } else {
            console.log('Post text is empty.');
        }
    };

    const handleComment = (postId, commentText) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, comments: [...post.comments, commentText] } : post
        ));
    };

    const handleUpvote = (postId) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        ));
    };

    const handleDownvote = (postId) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
        ));
    };

    const handleShare = (postId) => {
        // Implement share functionality here (e.g., using a Share API)
        console.log('Share post with id:', postId);
    };

    const filteredPosts = posts.filter(post => {
        const matchesQuery = post.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || post.type === filterType;
        return matchesQuery && matchesType;
    });
    return (
        <View style={styles.forumContainer}>
            {/* Search Box */}
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Filter by type:</Text>
                    <TouchableOpacity onPress={() => setFilterType('all')}>
                        <Text style={filterType === 'all' ? styles.filterActive : styles.filterText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilterType('post')}>
                        <Text style={filterType === 'post' ? styles.filterActive : styles.filterText}>Posts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilterType('question')}>
                        <Text style={filterType === 'question' ? styles.filterActive : styles.filterText}>Questions</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    style={styles.profilePicture}
                    source={require('../../assets/icon.png')}
                />
                <TextInput
                    style={styles.askShareInput}
                    placeholder="Want to ask/share?"
                    value={askShareText}
                    onChangeText={setAskShareText}
                />
                <View style={styles.askPostButtons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handlePost('question')}
                    >
                        <Text style={styles.buttonText}>Ask</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handlePost('post')}
                    >
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
                        <Text style={styles.postType}>{item.type === 'post' ? 'Post' : 'Question'}</Text>
                        <Text style={styles.postUser}>{item.user}</Text>
                        <Text style={styles.postDate}>{item.date} {item.time}</Text>
                        <Text style={styles.postText}>{item.text}</Text>
                        <View style={styles.postActions}>
                            <TouchableOpacity onPress={() => handleUpvote(item.id)}>
                                <Ionicons name="thumbs-up" size={20} color="black" />
                                <Text>{item.upvotes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDownvote(item.id)}>
                                <Ionicons name="thumbs-down" size={20} color="black" />
                                <Text>{item.downvotes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleShare(item.id)}>
                                <Ionicons name="share-social" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentSection}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Add a comment..."
                                onSubmitEditing={(event) => handleComment(item.id, event.nativeEvent.text)}
                            />
                            {item.comments.map((comment, index) => (
                                <Text key={index} style={styles.commentText}>{comment}</Text>
                            ))}
                        </View>
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
};
const styles = StyleSheet.create({
    forumContainer: {
        flex: 1,
        padding: 16,
        marginTop: 50,
        backgroundColor: '#FCF9D9',
    },
    searchSection: {
        marginBottom: 16,
    },
    searchInput: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    filterLabel: {
        marginRight: 8,
    },
    filterText: {
        marginRight: 8,
        color: 'gray',
    },
    filterActive: {
        marginRight: 8,
        color: 'black',
        fontWeight: 'bold',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
    postType: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    postUser: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray',
    },
    postDate: {
        fontSize: 12,
        color: 'gray',
    },
    postText: {
        fontSize: 16,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    commentSection: {
        marginTop: 8,
    },
    commentInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
    },
    commentText: {
        marginTop: 4,
    }
});