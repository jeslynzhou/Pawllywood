import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator, Share, Modal, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, storage } from '../../initializeFB';
import { doc, getDocs, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, deleteDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import NavigationBar from '../../components/navigationBar';
import PostScreen from './postScr';
import PostDetailsScr from './postDetailsScr';
import MapScreen from './mapScr';
import DeleteModal from './deleteModal';

export default function ForumScreen({ directToProfile, directToNotebook, directToHome, directToLibrary }) {
    const [currentScreen, setCurrentScreen] = useState('Forum');
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [isLoadingUserData, setLoadingUserData] = useState(false);
    const [commentTexts, setCommentTexts] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [searchHeight, setSearchHeight] = useState(0);
    const [profileHeight, setProfileHeight] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUris, setImageUris] = useState([]);
    const [isCrowdAlert, setIsCrowdAlert] = useState(false);
    const [location, setLocation] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [sortedPosts, setSortedPosts] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

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
                setLoadingUserData(false);
            }
        };

        setLoadingUserData(true);
        fetchUserData();
    }, []);

    const fetchPosts = async () => {
        try {
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts().then(() => {
            setRefreshing(false);
        });
    }, []);

    const handlePost = () => {
        setCurrentScreen('Post');
    };

    const handlePostSubmit = async (title, content, imageUrls, isCrowdAlert, location) => {
        if (!title.trim() || !content.trim()) {
            console.log('Title or content is empty.');
            return;
        }

        const newPost = {
            title: title,
            content: content,
            username: userData.username || 'Unknown User',
            userId: auth.currentUser.uid,
            userProfilePicture: userData.picture,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            comments: [],
            upvotes: [],
            downvotes: [],
            images: imageUrls, // Add the array of image URLs
            isPinned: false,
            isSaved: false,
            isCrowdAlert: isCrowdAlert,
            location: location,
        };

        try {
            const docRef = await addDoc(collection(db, 'posts'), newPost);
            newPost.id = docRef.id;

            // Assuming setPosts is a state setter for posts
            setPosts(prevPosts => [newPost, ...prevPosts]);

            // Clear input fields or reset state as needed
            setTitle('');
            setContent('');
            setImageUris([]);
            setIsCrowdAlert(false);
            setLocation(null);

            // Navigate or set the current screen state
            setCurrentScreen('Forum');
        } catch (error) {
            console.error('Error adding post to Firestore:', error.message);
        }
    };

    const handleCancelPost = () => {
        setCurrentScreen('Forum');
    };

    const handlePress = (post) => {
        setSelectedPost(post);
    };

    const openImageViewer = (images, index) => {
        setCurrentImages(images);
        setCurrentImageIndex(index);
        setImageViewerVisible(true);
    };

    const closeImageViewer = () => {
        setImageViewerVisible(false);
    };

    const togglePinPost = async (postId, isCurrentlyPinned) => {
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, { isPinned: !isCurrentlyPinned });
    
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, isPinned: !isCurrentlyPinned } : post
                )
            );
        } catch (error) {
            console.error('Error updating post pin status:', error.message);
        }
    };

    const toggleSavePost = async (postId, currentIsSaved) => {
        try {
          const postDocRef = doc(db, 'posts', postId);
      
          // Update the isSaved status to its opposite value
          await updateDoc(postDocRef, {
            isSaved: !currentIsSaved
          });
      
          console.log(`Post ${postId} saved status toggled successfully! New status: ${!currentIsSaved}`);
        } catch (error) {
          console.error('Error toggling save post:', error.message);
        }
    };
    
    const filterAndSortPosts = (posts, searchQuery) => {
        const filteredPosts = posts.filter(post => {
            if (post.content) {
                const matchesQuery = post.content.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesQuery;
            }
            return false;
        });
    
        return filteredPosts.sort((a, b) => b.isPinned - a.isPinned || new Date(b.date) - new Date(a.date));
    };

    useEffect(() => {
        setSortedPosts(filterAndSortPosts(posts, searchQuery));
    }, [posts, searchQuery]);

    const deletePost = async (postId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const postDocRef = doc(db, 'posts', postId);
                await deleteDoc(postDocRef);

                fetchPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    const handleDeletePress = (postId) => {
        setPostToDelete(postId);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        deletePost(postToDelete);
        setModalVisible(false);
        setPostToDelete(null);
    };

    const cancelDelete = () => {
        setModalVisible(false);
        setPostToDelete(null);
    };

    const handleLocationPress = (location) => {
        setSelectedLocation(location);
        setMapVisible(true);
    };

    const handleComment = async (postId, commentText) => {
        if (!commentText.trim() || !userData) return;

        const newComment = {
            username: userData.username || 'Unknown User',
            userId: auth.currentUser.uid,
            userProfilePicture: userData.picture,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            text: commentText
        };

        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                comments: arrayUnion(newComment)
            });

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
                )
            );
            setCommentTexts(prevState => ({
                ...prevState,
                [postId]: ''
            }));

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

    const onShare = async (post) => {
        try {
            const message = `
Title: ${post.title}

Post: ${post.content}
 
Upvotes: ${post.upvotes.length}
 
Downvotes: ${post.downvotes.length}
 
Comments:
${post.comments.map(comment => `\t${comment.username}: ${comment.text}`).join('\n')}
        `;

            const result = await Share.share({
                message: message.trim(), // Share the formatted message
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Post shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.log('Error sharing post:', error.message);
        }
    };


    const toggleExpandedComments = (postId) => {
        setExpandedComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const { height } = Dimensions.get('window');
    const marginTop = searchHeight + profileHeight + height * 0.04;

    if (selectedPost) {
        return <PostDetailsScr post={selectedPost} onBack={() => setSelectedPost(null)} 
            openImageViewer={openImageViewer} imageViewerVisible={imageViewerVisible} 
            currentImages={currentImages} currentImageIndex={currentImageIndex} closeImageViewer={closeImageViewer}/>;
    }
    
    if (mapVisible && selectedLocation) {
        return <MapScreen latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} onBack={() => setMapVisible(false)} />;
    }

    return (
        <View style={styles.forumContainer}>
            {currentScreen === 'Forum' ? (
                <>
                    {/* Search Box */}
                    <View
                        style={styles.searchSection}
                        onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            setSearchHeight(height);
                        }}
                    >
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Profile Section */}
                    {isLoadingUserData ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size='large' color='#F26419' />
                        </View>
                    ) : userData ? (
                        <View
                            style={styles.profileSection}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setProfileHeight(height);
                            }}
                        >
                            <View style={styles.profilePictureContainer}>
                                <Image
                                    source={userData.picture ? { uri: userData.picture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                    style={styles.profilePicture}
                                />
                            </View>
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
                    <ScrollView
                        style={[styles.postsContainer, { marginTop }]}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {sortedPosts.map(post => (
                            <View key={post.id} style={styles.postContainer}>
                                <View style={[styles.eachPostContainer, post.isCrowdAlert ? styles.crowdAlertBackground : styles.normalBackground]}>
                                    <View style={styles.postUserContainer}>
                                        <View style={[styles.profilePictureContainer, { width: 40, height: 40 }]}>
                                            <Image
                                                source={post.userProfilePicture ? { uri: post.userProfilePicture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                                style={styles.profilePicture}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.postUser}>{post.username}</Text>
                                            <Text style={styles.postDate}>{post.date} • {post.time}</Text>
                                        </View>
                                        {/* delete posts */}
                                        <TouchableOpacity onPress={() => handleDeletePress(post.id)}>
                                            <Ionicons name="trash-outline" size={22} color='#000000' />
                                        </TouchableOpacity>
                                        {/* pin posts */}
                                        <TouchableOpacity onPress={() => togglePinPost(post.id, post.isPinned)}>
                                            <Ionicons name={post.isPinned ? "pin" : "pin-outline"} size={22} color='#000000' />
                                        </TouchableOpacity>
                                        {/* save posts */}
                                        <TouchableOpacity onPress={() => toggleSavePost(post.id, post.isSaved)}>
                                            <Ionicons name={post.isSaved? "star" : "star-outline"} size={22} color='#000000' />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => handlePress(post)} key={post.id}>
                                        {/* Title */}
                                        <Text style={styles.postTitle}>{post.title}</Text>
                                        {/* Content */}
                                        <Text style={styles.postText}>{post.content}</Text>
                                    </TouchableOpacity>
                                    {/* Images */}
                                    <ScrollView horizontal style={styles.imageScrollContainer}>
                                        {post.images && post.images.map((imageUri, index) => (
                                            <TouchableOpacity key={index} onPress={() => openImageViewer(post.images, index)}>
                                                <Image
                                                    source={{ uri: imageUri }}
                                                    style={styles.postImage}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    {/* Location Container */}
                                    {post.location && (
                                        <TouchableOpacity onPress={() => handleLocationPress(post.location)}>
                                            <View style={styles.locationContainer}>
                                                <Ionicons name="location-outline" size={20} color="#000" />
                                                <Text style={styles.locationText}>
                                                    Lat: {post.location.latitude}, Lon: {post.location.longitude}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <View style={styles.postActions}>
                                        <View style={styles.votesContainer}>
                                            <TouchableOpacity style={styles.votesSmallerContainer} onPress={() => handleUpvote(post.id)}>
                                                <MaterialCommunityIcons
                                                    name={post.upvotes.includes(userData.email) ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
                                                    size={20}
                                                    color={post.upvotes.includes(userData.email) ? '#33658A' : '#000000'}
                                                />
                                                <View style={styles.voteTextContainer}>
                                                    <Text>{post.upvotes.length}</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <View style={styles.verticalLine} />

                                            <TouchableOpacity style={styles.votesSmallerContainer} onPress={() => handleDownvote(post.id)}>
                                                <MaterialCommunityIcons
                                                    name={post.downvotes.includes(userData.email) ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
                                                    size={20}
                                                    color={post.downvotes.includes(userData.email) ? '#F26419' : '#000000'}
                                                />
                                                <View style={styles.voteTextContainer}>
                                                    <Text>{post.downvotes.length}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity style={styles.shareContainer} onPress={() => onShare(post)}>
                                            <Ionicons name="arrow-redo-outline" size={20} color='#000000' />
                                        </TouchableOpacity>

                                    </View>
                                    <View style={styles.commentInputContainer}>
                                        <View style={[styles.profilePictureContainer, { width: 40, height: 40 }]}>
                                            <Image
                                                source={userData.picture ? { uri: userData.picture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                                style={styles.profilePicture}
                                            />
                                        </View>
                                        <TextInput
                                            style={styles.commentInput}
                                            placeholder="Add a comment..."
                                            value={commentTexts[post.id] || ''}
                                            onChangeText={text => {
                                                setCommentTexts(prevState => ({
                                                    ...prevState,
                                                    [post.id]: text
                                                }));
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (commentTexts[post.id]?.trim()) {
                                                    handleComment(post.id, commentTexts[post.id]);
                                                }
                                            }}
                                            disabled={!commentTexts[post.id]?.trim()}  // Disable button if comment text is empty
                                        >
                                            <Ionicons
                                                name={"send-outline"}
                                                size={20}
                                                style={{
                                                    color: commentTexts[post.id]?.trim() ? '#33658A' : '#CCCCCC', // Change color based on comment text presence
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.commentSection}>
                                        {/* View more comments */}
                                        {post.comments.length > 1 && (
                                            <TouchableOpacity
                                                onPress={() => toggleExpandedComments(post.id)}
                                                style={styles.expandedCommentsButtonContainer}
                                            >
                                                <Text style={{ fontWeight: 'bold', color: '#808080' }}>{expandedComments[post.id] ? 'View less comments' : 'View more comments'}</Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* Display one comment initially */}
                                        {post.comments.length > 0 && (
                                            <View style={styles.commentContainer}>
                                                <View>
                                                    <View style={[styles.profilePictureContainer, { width: 40, height: 40, alignSelf: 'flex-start' }]}>
                                                        <Image
                                                            source={post.comments[0].userProfilePicture ? { uri: post.comments[0].userProfilePicture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                                            style={styles.profilePicture}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.commentInfoContainer}>
                                                    <View style={styles.comment}>
                                                        <Text style={styles.commentUser}>{post.comments[0].username}</Text>
                                                        <Text style={styles.commentText}>{post.comments[0].text}</Text>
                                                    </View>
                                                    <View style={styles.commentDateTimeContainer}>
                                                        <Text style={styles.commentDateTime}>{post.comments[0].date} • {post.comments[0].time}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )}

                                        {/* Additional comments if expanded */}
                                        {expandedComments[post.id] && post.comments.slice(1).map((comment, index) => (
                                            <View key={index} style={styles.commentContainer}>
                                                <View>
                                                    <View style={[styles.profilePictureContainer, { width: 40, height: 40, alignSelf: 'flex-start' }]}>
                                                        <Image
                                                            source={comment.userProfilePicture ? { uri: comment.userProfilePicture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                                            style={styles.profilePicture}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.commentInfoContainer}>
                                                    <View style={styles.comment}>
                                                        <Text style={styles.commentUser}>{comment.username}</Text>
                                                        <Text style={styles.commentText}>{comment.text}</Text>
                                                    </View>
                                                    <View style={styles.commentDateTimeContainer}>
                                                        <Text style={styles.commentDateTime}>{comment.date} • {comment.time}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                        <Modal visible={imageViewerVisible} transparent={true}>
                            <View style={styles.modalContainer}>
                                <ScrollView
                                    horizontal
                                    pagingEnabled
                                    style={styles.fullscreenImageScroll}
                                    contentOffset={{ x: currentImageIndex * Dimensions.get('window').width, y: 0 }}
                                >
                                    {currentImages.map((imageUri, index) => (
                                        <TouchableOpacity key={index} onPress={closeImageViewer} style={styles.fullscreenImageContainer}>
                                            <Image
                                                source={{ uri: imageUri }}
                                                style={styles.fullscreenImage}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </Modal>
                        <DeleteModal
                            isVisible={isModalVisible}
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    </ScrollView>
                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToNotebook={directToNotebook}
                        directToHome={directToHome}
                        directToLibrary={directToLibrary}
                    />
                </>
            ) : (
                <PostScreen handlePostSubmit={handlePostSubmit} handleCancel={handleCancelPost} />
            )}
        </View>          
    );
}

const styles = StyleSheet.create({
    forumContainer: {
        marginTop: '10%',
        backgroundColor: '#FCF9D9',
        width: '100%',
        flex: 1,
    },
    searchSection: {
        alignItems: 'center',
        marginHorizontal: 16,
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 5,
        height: '6%',
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
    },
    profileSection: {
        alignItems: 'center',
        marginHorizontal: 16,
        flexDirection: 'row',
        marginVertical: 4,
        justifyContent: 'space-between',
    },
    profilePictureContainer: {
        width: 53,
        height: 53,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#CCCCCC',
        overflow: 'hidden',
        marginRight: 10,
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    postInput: {
        flex: 1,
        padding: 10,
        borderColor: '#ccc',
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
        width: '100%',
        alignSelf: 'center',
        height: '75.2%',
        marginTop: 16,
        position: 'absolute',
    },
    postContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
    },
    postUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    postText: {
        marginTop: 10,
        fontSize: 16,
    },
    imageScrollContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    postImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    postActions: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    votesContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 3,
        borderColor: '#CCCCCC',
        justifyContent: 'flex-start',
    },
    votesSmallerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 3,
    },
    voteTextContainer: {
        paddingRight: 7,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    shareContainer: {
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    commentSection: {
        marginTop: 8,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
        paddingTop: '3%',
    },
    commentInput: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 17,
        marginRight: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    commentInfoContainer: {
        flex: 1,
    },
    comment: {
        flex: 1,
        padding: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 17,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 14,
    },
    commentDateTimeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    commentDateTime: {
        fontSize: 12,
        color: '#808080',
    },
    loadingContainer: {
        flex: 1,
        alignSelf: 'center',
    },
    verticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: '#CCCCCC',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImageScroll: {
        flexDirection: 'row',
    },
    fullscreenImageContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    fullscreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    eachPostContainer: {
        padding: 16,
        borderRadius: 17,
    },
    normalBackground: {
        backgroundColor: 'white',
    },
    crowdAlertBackground: {
        backgroundColor: '#FFE5B4',
    },
    locationContainer: {
        flexDirection: 'row',
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
    },
});
