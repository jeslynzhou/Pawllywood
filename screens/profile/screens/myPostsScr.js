import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

export default function MyPostsScreen({ closeMyPostsScreen, directToForum }) {
    const [postsData, setPostsData] = useState([]);
    const [viewMode, setViewMode] = useState('myPosts');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPostsForDelete, setSelectedPostsForDelete] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPostData() {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const postsCollectionRef = collection(db, 'posts');

                if (viewMode === 'myPosts') {
                    q = query(postsCollectionRef, where('userId', '==', userId));
                } else if (viewMode === 'savedPosts') {
                    q = query(postsCollectionRef, where('isSaved', '==', true));
                }

                const querySnapShot = await getDocs(q);
                const fetchedPostsInfo = querySnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPostsData(fetchedPostsInfo);
            } else {
                console.log('User not authenticated.');
            }
        } catch (error) {
            console.error('Error fetching posts profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchPostData();
    }, [viewMode]);

    { /* Handle View */ }
    const handleMyPostsView = () => {
        setViewMode('myPosts');
    };

    const handleSavedPostsView = () => {
        setViewMode('savedPosts');
    };

    { /* Edit My Posts List */ }
    const openEditMyPostsList = () => {
        setShowConfirmationModal(true);
    };

    const closeEditMyPostsList = () => {
        setShowConfirmationModal(false);
        setSelectedPostsForDelete([]);
        setIsEditMode(false);
    };

    const confirmEditPostsList = () => {
        setIsEditMode(true);
        setShowConfirmationModal(false);
    };

    const toggleSelectPost = (postId) => {
        const index = selectedPostsForDelete.indexOf(postId);
        if (index === -1) {
            setSelectedPostsForDelete([...selectedPostsForDelete, postId]);
        } else {
            const updatedSelectedPostsForDelete = [...selectedPostsForDelete];
            updatedSelectedPostsForDelete.splice(index, 1);
            setSelectedPostsForDelete(updatedSelectedPostsForDelete);
        }
    };

    const deleteSelectedPosts = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const deletionPromises = selectedPostsForDelete.map(async (postId) => {
                    const postDocRef = doc(db, 'posts', postId);
                    await deleteDoc(postDocRef);
                });

                await Promise.all(deletionPromises);

                // Refresh after deletion
                fetchPostData();
                setSelectedPostsForDelete([]);
                setIsEditMode(false); // Exit edit mode after deletion
            }
        } catch (error) {
            console.error('Error deleting posts:', error.message);
        }
    };

    { /* Post Details Modal */ }
    const openPostDetailsModal = () => {
        setShowPostDetailsModal(true);
    };

    return (
        <View style={styles.myPostsContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeMyPostsScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Posts</Text>
                {viewMode === 'myPosts' && (
                    <TouchableOpacity onPress={postsData.length > 0 ? openEditMyPostsList : closeEditMyPostsList} style={styles.editContainer}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.viewModeContainer}>
                <TouchableOpacity style={[styles.viewModeButton, viewMode === 'myPosts' ? styles.viewModeActiveButton : null]} onPress={handleMyPostsView}>
                    <Text style={styles.viewModeButtonText}>My posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewModeButton, viewMode === 'savedPosts' ? styles.viewModeActiveButton : null]} onPress={handleSavedPostsView}>
                    <Text style={styles.viewModeButtonText}>Saved posts</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#F26419' />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {/* My Posts List */}
                    {postsData.length === 0 ? (
                        <TouchableOpacity onPress={directToForum} style={styles.postInfoContainer}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text}>You don't have any posts. Click here to share your thoughts in the forum!</Text>
                            </View>
                            <View style={styles.navigateButtonContainer}>
                                <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        postsData.map((post) => (
                            <View key={post.id}>
                                <View key={post.id} style={[styles.postInfoContainer]}>
                                    <TouchableOpacity onPress={openPostDetailsModal} style={styles.postInfo}>
                                        {viewMode === 'savedPosts' && (
                                            <View style={{ paddingBottom: 5, }}>
                                                <Text>{post.username}</Text>
                                            </View>
                                        )}
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.postTitle}>
                                            {post.title.length > 80 ? `${post.title.substring(0, 50)}...` : `${post.title}`}
                                        </Text>
                                    </TouchableOpacity>
                                    {isEditMode && (
                                        <View style={{ paddingLeft: 17, paddingRight: 5, }}>
                                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => toggleSelectPost(post.id)}>
                                                <Ionicons name={selectedPostsForDelete.includes(post.id) ? 'checkbox-outline' : 'square-outline'} size={24} color='#000000' />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {!isEditMode && (
                                        <View style={{ paddingVertical: 2.7 }}>
                                            <Text style={[styles.text, { color: '#CCCCCC' }]}>{post.date}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.separatorLine} />
                            </View>
                        ))

                    )}
                </View>
            )}

            {/* Confirmation Modal */}
            <Modal
                isVisible={showConfirmationModal}
                transparent={true}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={() => setShowConfirmationModal(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Do you want to edit your posts list?</Text>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={confirmEditPostsList} style={styles.modalButton}>
                            <Text style={[styles.modalButtonText, { fontWeight: 'bold', color: '#F26419' }]}>Yes</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={() => { setShowConfirmationModal(false), setIsEditMode(false) }} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            {/* Buttons for Edit Mode */}
            {isEditMode && (
                <View style={styles.editModeButtonsContainer}>
                    <TouchableOpacity onPress={closeEditMyPostsList} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                        <Text style={styles.editModeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteSelectedPosts} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                        <Text style={styles.editModeButtonText}>Confirm Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View >
    );
};

const styles = StyleSheet.create({
    myPostsContainer: {
        flex: 1,
        marginTop: '10%',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    editContainer: {
        justifyContent: 'flex-end',
    },
    editText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 15,
        marginBottom: 10,
    },
    viewModeButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    viewModeActiveButton: {
        backgroundColor: '#F26419',
    },
    viewModeButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    contentContainer: {
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    postInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    postInfo: {
        marginRight: 25,
        flex: 1,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separatorLine: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    modalButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    editModeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    editModeButton: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        paddingVertical: 12,
        marginHorizontal: 3,
    },
    editModeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loadingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
});
