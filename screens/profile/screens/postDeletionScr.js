import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

export default function PostDeletionScreen({ }) {
    const { width, height } = Dimensions.get('window');
    const imageSize = height * 0.25;
    const imagePosition = height * 0.33;

    return (
        <View style={styles.postDeletionContainer}>
            <Image
                source={require('../../../assets/app_images/end_icon.png')}
                style={[styles.image, { width: imageSize, height: imageSize, top: imagePosition }]}
                resizeMode='contain'
            />
            <View style={[styles.textContainer, { top: imagePosition + imageSize * 1.1 }]}>
                <Text style={styles.text}>Thank you for using Pawllywood!</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postDeletionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        position: 'absolute',
    },
});
