import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './mapScr';
import { ref } from 'firebase/storage';

const PostDetailsScr = ({ post, onBack, openImageViewer, imageViewerVisible, currentImages, currentImageIndex, closeImageViewer, convertToLocalTime, userData, handleComment}) => {
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});
    const hasImages = post.images.length > 0;

    const handleLocationPress = (location) => {
        setSelectedLocation(location);
        setMapVisible(true);
    };
    if (mapVisible && selectedLocation) {
        return <MapScreen latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} onBack={() => setMapVisible(false)} />;
    }

    return (
        <View style={styles.postDetailsContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Post Details</Text>
            </View>
            <View style={styles.postUserContainer}>
                <View style={[styles.profilePictureContainer, { width: 40, height: 40 }]}>
                    <Image
                        source={userData.picture ? { uri: userData.picture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
                        style={styles.profilePicture}
                    />
                </View>
                <View>
                    <Text style={styles.postUser}>{post.username}</Text>
                    <Text style={styles.postDate}>{post.date} • {convertToLocalTime(post.time)}</Text>
                </View>
            </View>
            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.postTitle}>{post.title}</Text>
            </View>
            {/* Content */}
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.postText}>{post.content}</Text>
            </ScrollView>
            {/* Images */}
            <ScrollView horizontal 
                style={[
                    styles.imageScrollContainer,
                    { maxHeight: hasImages ? 110 : 0 }
                ]}
            >
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
            {/* Comments Section */}
            <ScrollView style={styles.commentsContainer}>
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
                                setCommentTexts(prevState => ({
                                    ...prevState,
                                    [post.id]: ''
                                }));
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
                {/* Comments */}
                <View style={styles.commentSection}>
                    {post.comments.map((comment, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <View>
                                <View style={[styles.profilePictureContainer, { width: 40, height: 40, alignSelf: 'flex-start' }]}>
                                    <Image
                                        source={userData.picture ? { uri: userData.picture } : ref(storage, 'default_profile_picture/default_profile_picture.png')}
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
                                    <Text style={styles.commentDateTime}>{comment.date} • {convertToLocalTime(comment.time)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* Image Viewer Modal */}
            <Modal visible={imageViewerVisible} transparent={true}>
                <View style={styles.imageViewerContainer}>
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
        </View>
    );
};

export default PostDetailsScr;

const styles = StyleSheet.create({
    postDetailsContainer: {
        marginTop: '10%',
        padding: 16,
        backgroundColor: '#FCF9D9',
        width: '100%',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
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
    postUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    postUser: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    postDate: {
        fontSize: 12,
        color: '#808080',
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: '3%',
    },
    titleContainer: {
        padding: 13,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: 'rgba(204, 204, 204, 0.5)',
        borderTopStartRadius: 17,
        borderTopEndRadius: 17,
    },
    contentContainer: {
        maxHeight: 280,
        marginBottom: '3%',
        padding: 13,
        backgroundColor: 'white',
        borderBottomStartRadius: 17,
        borderBottomEndRadius: 17,
    },
    postText: {
        fontSize: 16,
        marginBottom: '3%',
    },
    imageScrollContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 1,
    },
    postImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },
    imageViewerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImageContainer: {
        width: Dimensions.get('window').width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullscreenImageScroll: {
        flexDirection: 'row',
    },
    locationContainer: {
        flexDirection: 'row',
        padding: 1,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
    },
    commentsContainer: {
        marginTop: 16,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        paddingHorizontal: 1,
        borderTopColor: '#CCCCCC',
        paddingTop: 10,
        marginBottom: '2%',
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
    commentSection: {
        flex: 1,
        marginTop: '1%',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: '1%',
    },
    commentProfile: {
        flex: 1,
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
        color: '#000000',
    },
    commentText: {
        color: '#000000',
        marginTop: 2,
    },
    commentDateTimeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    commentDateTime: {
        fontSize: 12,
        color: '#808080',
    },
});