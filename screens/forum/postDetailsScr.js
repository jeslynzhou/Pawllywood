import React from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';

const PostDetailsScr = ({ post, onBack, openImageViewer, imageViewerVisible, currentImages, currentImageIndex, closeImageViewer }) => {
    return (
        <View style={styles.postDetailsContainer}>
            <Button title="Back" onPress={onBack} />
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
            </View>
            {/* Title */}
            <Text style={styles.postTitle}>{post.title}</Text>
            {/* Content */}
            <Text style={styles.postText}>{post.content}</Text>
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
            {/* Comments */}
            <ScrollView style={styles.commentsContainer}>
                {post.comments && post.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                        <Text>{comment.username}</Text>
                        <Text>{comment.text}</Text>
                    </View>
                ))}
            </ScrollView>
            {/* Image Viewer Modal */}
            <Modal visible={imageViewerVisible} transparent={true}>
                <View style={styles.imageViewerContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
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
        backgroundColor: '#FCF9D9',
        width: '100%',
        flex: 1,
    },
    profilePictureContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        marginVertical: 8,
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
        marginVertical: 10,
    },
    postText: {
        fontSize: 16,
        marginBottom: 10,
    },
    imageScrollContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    postImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },
    commentsContainer: {
        flex: 1,
    },
    comment: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
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
});
