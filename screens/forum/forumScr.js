import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator, Share, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db, storage } from '../../initializeFB';
import { doc, getDocs, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, deleteDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import NavigationBar from '../../components/navigationBar';
import PostScreen from './postScr';
import PostDetailsScr from './postDetailsScr';
import MapScreen from './mapScr';
import DeleteModal from './deleteModal';
import FilterMenu from './filterMenu';
import EmergencyModal from './emergencyModal';

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
    const [emergencyHeight, setEmergencyHeight] = useState(0);
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
    const [isFilterMenuVisible, setFilterMenuVisible] = useState(false); // State for filter menu visibility
    const [selectedFilters, setSelectedFilters] = useState({
        saved: false,
        pinned: false,
        crowdAlert: false,
        notCrowdAlert: false,
    });
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPostActionsModal, setShowPostActionsModal] = useState(false);
    const [postInAction, setPostInAction] = useState(null);

    const sendNotification = async (expoPushToken, title, body) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: title,
            body: body,
            data: { extraData: 'Some data if needed' }, // Optional
        };

        try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            const responseData = await response.json();
            console.log('Notification Response:', responseData);
        } catch (error) {
            console.error('Error sending notification:', error.message);
        }
    };


    const handleToggleFilterMenu = () => {
        setFilterMenuVisible(!isFilterMenuVisible);
    };

    const handleApplyFilters = () => {
        // Apply filters
        setFilterMenuVisible(false);
    };


    const handleChangeFilter = (filterName, value) => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

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
            const user = auth.currentUser;
            if (!user) {
                console.error('No user is currently signed in.');
                return;
            }

            // Fetch the current user's data
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            const pinnedPosts = userData.pinnedPosts || [];
            const savedPosts = userData.savedPosts || [];

            // Fetch all posts
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter posts based on user's saved and pinned posts
            const filteredPosts = postsData.filter(post => {
                let include = true;
                if (selectedFilters.saved && !savedPosts.includes(post.id)) include = false;
                if (selectedFilters.pinned && !pinnedPosts.includes(post.id)) include = false;
                if (selectedFilters.crowdAlert && !post.isCrowdAlert) include = false;
                if (selectedFilters.notCrowdAlert && post.isCrowdAlert) include = false;
                return include;
            });

            // Sort posts using the user's pinned posts
            const sortedPosts = filterAndSortPosts(filteredPosts, searchQuery, pinnedPosts);
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);


    useEffect(() => {
        fetchPosts();
    }, [selectedFilters]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    }, [selectedFilters]);

    const handlePost = () => {
        setCurrentScreen('Post');
    };

    const convertToLocalTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handlePostSubmit = async (title, content, imageUrls, isCrowdAlert, location) => {
        if (!title.trim() || !content.trim()) {
            console.log('Title or content is empty.');
            return;
        }

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const newPost = {
            title: title,
            content: content,
            username: userData.username || 'Unknown User',
            userId: auth.currentUser.uid,
            userProfilePicture: userData.picture,
            date: formatDate(new Date()),
            time: new Date().toISOString(),
            comments: [],
            upvotes: [],
            downvotes: [],
            images: imageUrls, // Add the array of image URLs
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

    { /* Handle Post Action */ }
    const openPostActionsModal = (post) => {
        setPostInAction(post);
        setShowPostActionsModal(true);
    };

    const closePostActionsModal = () => {
        setShowPostActionsModal(false);
        setPostInAction(null);
    };

    const renderPostActionsModal = () => {
        if (!postInAction) {
            return null;
        }

        const handlePinPost = () => {
            togglePinPost(postInAction.id, postInAction.isPinned);
            closePostActionsModal();
        };

        const handleSavePost = () => {
            toggleSavePost(postInAction.id, postInAction.isSaved);
            closePostActionsModal();
        };

        const handleDeletePost = () => {
            handleDeletePress(postInAction.id);
            closePostActionsModal();
        };

        return (
            <Modal
                isVisible={showPostActionsModal}
                transparent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onRequestClose={closePostActionsModal}
                onBackdropPress={closePostActionsModal}
            >
                <View style={styles.postActionsModalContainer}>
                    {/* pin posts */}
                    <TouchableOpacity onPress={handlePinPost} style={styles.postActionsButton}>
                        <Ionicons
                            name={(userData.pinnedPosts && Array.isArray(userData.pinnedPosts) && userData.pinnedPosts.includes(postInAction.id)) ? "pin" : "pin-outline"}
                            size={20}
                            color='#000000'
                            style={{ alignSelf: 'center' }}
                        />
                        <Text style={styles.postActionsButtonText}>Pin this post</Text>
                    </TouchableOpacity>

                    <View style={styles.separatorLine} />
                    {/* save posts */}
                    <TouchableOpacity onPress={handleSavePost} style={styles.postActionsButton}>
                        <Ionicons
                            name={(userData.savedPosts && Array.isArray(userData.savedPosts) && userData.savedPosts.includes(postInAction.id)) ? "star" : "star-outline"}
                            size={20}
                            color='#000000'
                            style={{ alignSelf: 'center' }}
                        />
                        <Text style={styles.postActionsButtonText}>Save this post</Text>
                    </TouchableOpacity>

                    <View style={styles.separatorLine} />

                    {/* delete posts */}
                    {postInAction.userId === auth.currentUser.uid && (
                        <TouchableOpacity onPress={handleDeletePost} style={styles.postActionsButton}>
                            <Ionicons name="trash-outline" size={20} color='#000000' style={{ alignSelf: 'center' }} />
                            <Text style={styles.postActionsButtonText}>Delete your post</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>
        )
    };

    const togglePinPost = async (postId) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user is currently signed in.');
                return;
            }

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            let pinnedPosts = userDoc.data().pinnedPosts || [];

            // Check if the post is already pinned
            const isCurrentlyPinned = pinnedPosts.includes(postId);

            if (isCurrentlyPinned) {
                // Remove the post ID from the pinnedPosts array
                pinnedPosts = pinnedPosts.filter(id => id !== postId);
            } else {
                // Add the post ID to the pinnedPosts array
                pinnedPosts.push(postId);
            }

            await updateDoc(userRef, { pinnedPosts });

            // Update the local state to reflect the change
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, isPinned: !isCurrentlyPinned } : post
                )
            );

            // Update userData state to reflect the pin change
            setUserData(prevUserData => ({
                ...prevUserData,
                pinnedPosts: pinnedPosts
            }));

            console.log(`Post ${postId} pin status toggled successfully! New status: ${!isCurrentlyPinned}`);
        } catch (error) {
            console.error('Error updating pinned posts:', error.message);
        }
    };


    const toggleSavePost = async (postId) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user is currently signed in.');
                return;
            }

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            let savedPosts = userDoc.data().savedPosts || [];

            // Check if the post is already saved
            const isCurrentlySaved = savedPosts.includes(postId);

            if (isCurrentlySaved) {
                // Remove the post ID from the savedPosts array
                savedPosts = savedPosts.filter(id => id !== postId);
            } else {
                // Add the post ID to the savedPosts array
                savedPosts.push(postId);
            }

            await updateDoc(userRef, { savedPosts });

            // Update the local state to reflect the change
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, isSaved: !isCurrentlySaved } : post
                )
            );

            // Update userData state to reflect the save change
            setUserData(prevUserData => ({
                ...prevUserData,
                savedPosts: savedPosts
            }));

            console.log(`Post ${postId} save status toggled successfully! New status: ${!isCurrentlySaved}`);
        } catch (error) {
            console.error('Error toggling save post:', error.message);
        }
    };


    const filterAndSortPosts = (posts, searchQuery, pinnedPosts) => {
        const filteredPosts = posts.filter(post => {
            if (post.content) {
                const matchesQuery = post.content.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesQuery;
            }
            return false;
        });

        return filteredPosts.sort((a, b) => {
            const aIsPinned = pinnedPosts.includes(a.id);
            const bIsPinned = pinnedPosts.includes(b.id);
            return bIsPinned - aIsPinned || new Date(b.date) - new Date(a.date);
        });
    };


    useEffect(() => {
        setSortedPosts(filterAndSortPosts(posts, searchQuery, pinnedPosts));
    }, [posts, searchQuery, pinnedPosts]);

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

            // Send notification to post author
            const postDoc = await getDoc(postRef);
            const postData = postDoc.data();
            if (postData) {
                const userRef = doc(db, 'users', postData.userId);
                const userDoc = await getDoc(userRef);
                const userExpoToken = userDoc.data().expoPushToken;

                if (userExpoToken) {
                    await sendNotification(userExpoToken, 'New Comment', `${userData.username} commented on your post.`);
                } else {
                    console.log('No expoPushToken found for user:', postData.userId);
                }
            }

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

                // Send notification to post author
                const userRef = doc(db, 'users', postData.userId);
                const userDoc = await getDoc(userRef);
                const userExpoToken = userDoc.data().expoPushToken; // Assume expoPushToken is stored in user document

                await sendNotification(userExpoToken, 'New Upvote', `${userData.username} upvoted your post.`);
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

                // Send notification to post author
                const userRef = doc(db, 'users', postData.userId);
                const userDoc = await getDoc(userRef);
                const userExpoToken = userDoc.data()?.expoPushToken; // Ensure `expoPushToken` is present

                if (!userExpoToken) {
                    console.error('User Expo Push Token is missing.');
                    return;
                }

                await sendNotification(userExpoToken, 'New Downvote', `${userData.username} downvoted your post.`);
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
    const marginTop = searchHeight + profileHeight + emergencyHeight * 0.43 + height * 0.04;

    if (selectedPost) {
        return <PostDetailsScr post={selectedPost} onBack={() => setSelectedPost(null)}
            openImageViewer={openImageViewer} imageViewerVisible={imageViewerVisible}
            currentImages={currentImages} currentImageIndex={currentImageIndex} closeImageViewer={closeImageViewer} />;
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
                            <TouchableOpacity
                                style={styles.postButton}
                                onPress={handlePost}
                            >
                                <View style={styles.buttonContent}>
                                    <Text style={{ color: '#808080', alignSelf: 'center' }}>What's on your mind?</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleToggleFilterMenu} // Toggle filter menu visibility
                            >
                                <Ionicons name="funnel" size={25} color='#000000' />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text>User not logged in.</Text>
                    )}


                    {/* Posts List */}
                    <ScrollView
                        style={styles.postsContainer}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {/* Emergency Section */}
                        <View
                            style={styles.emergencySection}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                setEmergencyHeight(height);
                            }}
                        >
                            <TouchableOpacity onPress={() => setShowModal(true)}>
                                <Text style={styles.emergencyText}>Emergencies? Call now!</Text>
                            </TouchableOpacity>
                        </View>

                        {sortedPosts.map(post => (
                            <View key={post.id} style={styles.postContainer}>
                                <View style={[post.isCrowdAlert ? styles.crowdAlertPostContainer : styles.eachPostContainer]}>
                                    <View style={styles.postUserContainer}>
                                        <View style={[styles.profilePictureContainer, { width: 40, height: 40 }]}>
                                            <Image
                                                source={post.userProfilePicture ? { uri: post.userProfilePicture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                                                style={styles.profilePicture}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.postUser}>{post.username}</Text>
                                            <Text style={styles.postDate}>{post.date} • {convertToLocalTime(post.time)}</Text>
                                        </View>
                                        <View style={styles.actionButton}>
                                            <TouchableOpacity onPress={() => openPostActionsModal(post)}>
                                                <Ionicons
                                                    name="ellipsis-horizontal"
                                                    size={20}
                                                    color='#000000'
                                                />
                                            </TouchableOpacity>
                                        </View>
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
                                                    Lat: {post.location.latitude.toFixed(3)}, Lon: {post.location.longitude.toFixed(3)}
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

                        <Modal isVisible={imageViewerVisible} transparent={true}>
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

                        {renderPostActionsModal()}

                        <DeleteModal
                            isVisible={isModalVisible}
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                        {/* Filter Menu */}
                        <FilterMenu
                            isVisible={isFilterMenuVisible}
                            onClose={() => setFilterMenuVisible(false)}
                            onApply={handleApplyFilters}
                            selectedFilters={selectedFilters}
                            onChangeFilter={handleChangeFilter}
                        />
                        {/* Emergency Modal */}
                        <EmergencyModal
                            visible={showModal}
                            onClose={() => setShowModal(false)}
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
        borderRadius: 30,
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
    postButton: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderColor: '#F0F0F0',
        backgroundColor: '#F0F0F0',
        borderRadius: 17,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        padding: 10,
    },
    buttonText: {
        marginHorizontal: 5,
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
        position: 'absolute',
        marginTop: '32%',
    },
    postContainer: {
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
    postActionsModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 5,
        paddingBottom: 20,
    },
    postActionsButton: {
        margin: 15,
        flexDirection: 'row',
    },
    postActionsButtonText: {
        paddingLeft: 10,
        alignSelf: 'center',
        fontSize: 16,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    postText: {
        marginBottom: 8,
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
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 17,
    },
    crowdAlertPostContainer: {
        backgroundColor: '#FFE5B4',
        marginHorizontal: 8,
        padding: 8,
        borderRadius: 17,
    },
    locationContainer: {
        flexDirection: 'row',
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
    },
    emergencySection: {
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        padding: 5,
    },
    emergencyText: {
        fontSize: 16,
        color: '#F26419'
    },
});
