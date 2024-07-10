import React from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native';

const PostDetailsScr = ({ post, onBack }) => {
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
                    <Image
                        key={index}
                        source={{ uri: imageUri }}
                        style={styles.postImage}
                    />
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
});