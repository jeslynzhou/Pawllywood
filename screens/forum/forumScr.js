import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../../initializeFB';
import { doc, getDocs, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove, collection } from 'firebase/firestore';

import NavigationBar from '../../components/navigationBar';

export default function ForumScreen({ directToProfile, directToNotebook, directToHome, directToLibrary, user }) {
    const [currentScreen, setCurrentScreen] = useState('Forum');
    const [userData, setUserData] = useState(null);
    const [isLoadingUserData, setLoadingUserData] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isCommentBUttonEnabled, setCommentButtonEnabled] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log('No such document!');
                    }
                } else {
                    console.log('No user is currently signed in.');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            } finally {
                setLoadingUserData(false);  // Update loading state when done
            }
        };

        setLoadingUserData(true);  // Set loading state when fetching starts
        fetchUserData();
    }, []);

    // Fetching posts data
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsSnapshot = await getDocs(collection(db, 'posts'));
                const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error.message);
            }
        };

        fetchPosts();
    }, []);

    const handlePost = async () => {
        if (!postText.trim() || !userData) {
            console.log('Post text is empty or user data is not available.');
            return;
        }

        const newPost = {
            text: postText,
            user: userData.username || 'Unknown User',
            userId: auth.currentUser.uid,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            comments: [],
            upvotes: [],
            downvotes: [],
        };

        try {
            // Add new post to Firestore
            const docRef = await addDoc(collection(db, 'posts'), newPost);
            newPost.id = docRef.id; // Assign the Firestore document ID to newPost

            // Update local state with new post
            setPosts(prevPosts => [newPost, ...prevPosts]);
            setPostText('');

        } catch (error) {
            console.error('Error adding post to Firestore:', error.message);
        }
    };

    const handleComment = async (postId) => {
        if (!commentText.trim() || !userData) return;

        const newComment = {
            text: commentText,
            user: userData.username || 'Unknown User',
            userId: auth.currentUser.uid,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
        };

        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                comments: arrayUnion(newComment)
            });

            // Update local state with new comment
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
                )
            );
        } catch (error) {
            console.error('Error adding comment to Firestore:', error.message);
        }
    };

    const handleUpvote = async (postId) => {
        if (!userData || !userData.email) {
            console.log('User data not available or missing UID.');
            return;
        }

        try {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);
            const postData = postDoc.data();

            if (!postData) {
                console.log('Post not found.');
                return;
            }

            if (postData.upvotes.includes(userData.email)) {
                // User already upvoted, remove upvote
                await updateDoc(postRef, {
                    upvotes: arrayRemove(userData.email)
                });
            } else {
                // User hasn't upvoted, add upvote and remove downvote if exists
                await updateDoc(postRef, {
                    upvotes: arrayUnion(userData.email),
                    downvotes: arrayRemove(userData.email)
                });
            }

            // Update local state with updated upvotes
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, upvotes: postData.upvotes.includes(userData.email) ? postData.upvotes.filter(id => id !== userData.email) : [...postData.upvotes, userData.email] } : post
                )
            );

        } catch (error) {
            console.error('Error updating upvotes:', error.message);
        }
    };

    const handleDownvote = async (postId) => {
        if (!userData || !userData.email) {
            console.log('User data not available or missing UID.');
            return;
        }

        try {
            const postRef = doc(db, 'posts', postId);
            const postDoc = await getDoc(postRef);
            const postData = postDoc.data();

            if (!postData) {
                console.log('Post not found.');
                return;
            }

            if (postData.downvotes.includes(userData.email)) {
                // User already downvoted, remove downvote
                await updateDoc(postRef, {
                    downvotes: arrayRemove(userData.email)
                });
            } else {
                // User hasn't downvoted, add downvote and remove upvote if exists
                await updateDoc(postRef, {
                    downvotes: arrayUnion(userData.email),
                    upvotes: arrayRemove(userData.email)
                });
            }

            // Update local state with updated downvotes
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, downvotes: postData.downvotes.includes(userData.email) ? postData.downvotes.filter(id => id !== userData.email) : [...postData.downvotes, userData.email] } : post
                )
            );

        } catch (error) {
            console.error('Error updating downvotes:', error.message);
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesQuery = post.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesQuery;
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
            </View>
            {/* Profile Section */}
            {isLoadingUserData ? (
                <ActivityIndicator size='large' color='#0000FF' />
            ) : userData ? (
                <View style={styles.profileSection}>
                    <Image
                        style={styles.profilePicture}
                        source={require('../../assets/icon.png')}
                    />
                    <TextInput
                        style={styles.postInput}
                        placeholder="What's on your mind?"
                        value={postText}
                        onChangeText={setPostText}
                    />
                    <View style={styles.postButtons}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handlePost}
                        >
                            <Text style={styles.buttonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text>User not logged in.</Text>
            )}

            {/* Posts List */}
            <ScrollView style={styles.postsContainer}>
                {filteredPosts.map(post => (
                    <View key={post.id} style={styles.postContainer}>
                        <Text style={styles.postUser}>{post.user}</Text>
                        <Text style={styles.postDate}>{post.date} {post.time}</Text>
                        <Text style={styles.postText}>{post.text}</Text>
                        <View style={styles.postActions}>
                            <TouchableOpacity onPress={() => handleUpvote(post.id)}>
                                <Ionicons name="caret-up" size={20} color={post.upvotes.includes(userData.email) ? '#33658A' : '#000000'} />
                                <Text style={{ alignSelf: 'center' }}>{post.upvotes.length}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDownvote(post.id)}>
                                <Ionicons name="caret-down" size={20} color={post.downvotes.includes(userData.email) ? '#F26419' : '#000000'} />
                                <Text style={{ alignSelf: 'center' }}>{post.downvotes.length}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Share post with id:', post.id)}>
                                <Ionicons name="share-social" size={20} color='#000000' />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentSection}>
                            <View style={styles.commentTextContainer}>
                                <TextInput
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChangeText={(text) => {
                                        setCommentText(text);
                                        setCommentButtonEnabled(text.trim().length > 0);
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => handleComment(post.id)}
                                    disabled={!isCommentBUttonEnabled}
                                    style={styles.commentButton}
                                >
                                    <Ionicons name={isCommentBUttonEnabled ? "send" : "send-outline"} size={20} style={{ color: isCommentBUttonEnabled ? '#33658A' : '#CCCCCC' }} />
                                </TouchableOpacity>
                            </View>
                            {post.comments.map((comment, index) => (
                                <View key={index} style={styles.comment}>
                                    <Text style={styles.commentUser}>{comment.user}</Text>
                                    <Text style={styles.commentDateTime}>{comment.date} {comment.time}</Text>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>

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
        marginTop: '10%',
        backgroundColor: '#FCF9D9',
    },
    searchSection: {
        marginBottom: 5,
        marginHorizontal: 16,
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 16,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    postInput: {
        flex: 1,
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
        marginRight: 10,
    },
    postButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 17,
        backgroundColor: '#F26419',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    postsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    postContainer: {
        padding: 16,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
    },
    postUser: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    postDate: {
        fontSize: 12,
        color: '#808080',
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
    commentTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
        padding: 8,
    },
    commentButton: {
        justifyContent: 'center',
        marginRight: 5,
    },
    comment: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 17,
    },
    commentUser: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    commentDateTime: {
        fontSize: 12,
        color: '#808080',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
    },
});