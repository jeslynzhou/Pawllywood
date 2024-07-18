import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from '../../initializeFB';
import { Ionicons } from '@expo/vector-icons';

export default function PostScreen({ handlePostSubmit, handleCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUris, setImageUris] = useState([]);
    const [isCrowdAlert, setIsCrowdAlert] = useState(false);
    const [location, setLocation] = useState(null);

    const handleUploadFromCamera = async () => {
        try {
            let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('Permission Denied', 'Permission to access camera is required.');
                return;
            }

            let cameraResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.2,
            });

            if (!cameraResult.canceled) {
                setImageUris([...imageUris, cameraResult.assets[0].uri]);
            }
        } catch (error) {
            console.log('Error uploading image from camera:', error);
        }
    };

    const handleUploadFromLibrary = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert('Permission Denied', 'Permission to access library is required!');
                return;
            }

            let libraryResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.2,
            });

            if (!libraryResult.canceled) {
                setImageUris([...imageUris, libraryResult.assets[0].uri]);
            }
        } catch (error) {
            console.log('Error uploading image from library:', error);
        }
    };

    const handleImageUpload = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storage = getStorage();
        const fileRef = ref(storage, `postPictures/${auth.currentUser.uid}/${Date.now()}.jpg`);
        await uploadBytes(fileRef, blob);
        return await getDownloadURL(fileRef);
    };

    const handleDeleteImage = (uri) => {
        setImageUris(imageUris.filter(imageUri => imageUri !== uri));
    };

    const handleToggleSwitch = () => {
        setIsCrowdAlert(previousState => !previousState);
    };

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location is required!');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>
            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.contentInput}
                    placeholder="Content"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />
            </View>
            <ScrollView
                horizontal
                contentContainerStyle={styles.imageContainer}
            >
                {imageUris.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteImage(uri)}
                        >
                            <Ionicons name="close-circle-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Crowd Alert</Text>
                <TouchableOpacity
                    style={[styles.switch, isCrowdAlert ? styles.switchOn : styles.switchOff]}
                    onPress={handleToggleSwitch}
                >
                    <View style={[styles.toggle, isCrowdAlert ? styles.toggleOn : styles.toggleOff]} />
                </TouchableOpacity>
            </View>
            <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>Location</Text>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleGetLocation}
                >
                    <Ionicons name="location-outline" size={24} color="black" />
                </TouchableOpacity>
                {location && (
                    <Text style={styles.locationText}>
                        {`Lat: ${location.latitude}, Lon: ${location.longitude}`}
                    </Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleUploadFromLibrary}
            >
                <Text style={styles.buttonText}>Upload from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={handleUploadFromCamera}
            >
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                    const uploadedImageUrls = [];
                    for (const uri of imageUris) {
                        const uploadedUrl = await handleImageUpload(uri);
                        uploadedImageUrls.push(uploadedUrl);
                    }
                    handlePostSubmit(title, content, uploadedImageUrls, isCrowdAlert, location);
                }}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    titleContainer: {
        padding: 5,
        borderRadius: 17,
        backgroundColor: 'white',
        marginVertical: '3%',
    },
    titleInput: {
        borderColor: '#CCCCCC',
        padding: 8,
        marginVertical: 8,
        fontWeight: 'bold',
        fontSize: 20,
    },
    contentInput: {
        borderColor: '#CCCCCC',
        padding: 8,
        marginVertical: 8,
        fontSize: 15,
    },
    contentContainer: {
        padding: 5,
        borderRadius: 17,
        height: '30%',
        backgroundColor: 'white',
        marginVertical: '3%',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 8,
    },
    imageWrapper: {
        position: 'relative',
        marginHorizontal: 4,
    },
    image: {
        width: 100,
        height: 100,
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderRadius: 12,
        padding: 4,
    },
    button: {
        backgroundColor: '#F26419',
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#CCCCCC',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    switchLabel: {
        marginRight: 8,
    },
    switch: {
        width: 50,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        padding: 3,
    },
    switchOn: {
        backgroundColor: '#4cd137',
    },
    switchOff: {
        backgroundColor: '#dcdde1',
    },
    toggle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    toggleOn: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
    },
    toggleOff: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    locationLabel: {
        marginRight: 8,
    },
    locationButton: {
        backgroundColor: '#CCCCCC',
        padding: 10,
        borderRadius: 10,
    },
    locationText: {
        marginLeft: 10,
    }
});
