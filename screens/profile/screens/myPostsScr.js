import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

export default function MyPostsScreen({ closeMyPostsScreen, directToForum }) {
    const [postsData, setPostsData] = useState([]);
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
                const q = query(postsCollectionRef, where('userId', '==', userId));
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
        fetchPostData();
    }, []);

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

    return (
        <View style={styles.myPostsContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeMyPostsScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Posts</Text>
                <TouchableOpacity onPress={postsData.length > 0 ? openEditMyPostsList : closeEditMyPostsList} style={styles.settingButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color='#000000' />
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
                                    <View style={styles.postInfo}>
                                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.text}>
                                            {post.text.length > 80 ? `[${post.text.substring(0, 50)}...]` : `[${post.text}]`}
                                        </Text>
                                    </View>
                                    {isEditMode && (
                                        <View style={{ position: 'absolute', right: 10 }}>
                                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => toggleSelectPost(post.id)}>
                                                <Ionicons name={selectedPostsForDelete.includes(post.id) ? 'checkbox-outline' : 'square-outline'} size={24} color='#000000' />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {!isEditMode && (
                                        <View style={{ position: 'absolute', right: 10 }}>
                                            <Text style={[styles.text, { color: '#CCCCCC' }]}>{post.time}</Text>
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
                visible={showConfirmationModal}
                transparent={true}
                animationType='fade'
                onRequestClose={() => setShowConfirmationModal(false)}
            >
                <View style={styles.modalContainer}>
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
        paddingHorizontal: 40,
        marginBottom: 21,
    },
    backButton: {
        position: 'absolute',
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingButton: {
        marginLeft: 230,
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
        marginRight: '2%',
    },
    text: {
        fontSize: 16,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        width: '80%',
        alignItems: 'center',
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