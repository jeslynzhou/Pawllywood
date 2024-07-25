import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from '../../initializeFB';
import { Ionicons } from '@expo/vector-icons';
import UploadImageModal from './uploadImageModal';
import MapScreen from './mapScr';
import * as Location from 'expo-location';


export default function PostScreen({ handlePostSubmit, handleCancel, }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUris, setImageUris] = useState([]);
    const [isCrowdAlert, setIsCrowdAlert] = useState(false);
    const [location, setLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false); // State for modal visibility

    const handleTitleChange = (text) => {
        // Split the text by spaces and check the word count
        const words = text.trim().split(/\s+/);
        if (words.length <= 20) {
            setTitle(text);
        } else {
            // Optionally, you could alert the user here
            Alert.alert('Word Limit Exceeded', `Title can only be up to 20 words.`);
        }
    };

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
        } finally {
            setShowUploadModal(false);
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
        } finally {
            setShowUploadModal(false);
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
        const roundedLocation = {
            latitude: parseFloat(currentLocation.coords.latitude.toFixed(3)),
            longitude: parseFloat(currentLocation.coords.longitude.toFixed(3)),
        };
        setLocation(roundedLocation);
    };

    const handleDeleteLocation = () => {
        setLocation(null);
    };

    if (showMap && location) {
        return <MapScreen latitude={location.latitude} longitude={location.longitude} onBack={() => setShowMap(false)} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>New post</Text>
            </View>
            <View style={styles.titleContainer}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={handleTitleChange}
                />
            </View>
            <View style={styles.contentContainer}>
                <ScrollView
                    contentContainerStyle={styles.contentScrollContainer}
                    style={styles.contentScroll}
                >
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Content"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />
                </ScrollView>
            </View>
            <ScrollView
                horizontal
                contentContainerStyle={styles.imageContainer}
            >
                <TouchableOpacity
                    style={styles.addPictureButton}
                    onPress={() => setShowUploadModal(true)}
                >
                    <Ionicons name="add-circle-outline" size={40} color="#808080" />
                </TouchableOpacity>
                {imageUris.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteImage(uri)}
                        >
                            <Ionicons name="close-circle" size={24} color="#D3D3D3" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <UploadImageModal
                visible={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUploadFromCamera={handleUploadFromCamera}
                onUploadFromLibrary={handleUploadFromLibrary}
            />

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
                <TouchableOpacity
                    onPress={handleGetLocation}
                    style={{ flexDirection: 'row', alignContent: 'center' }}
                >
                    <Ionicons name="location-outline" size={22} color="black" />
                    <Text style={styles.locationLabel}>Location</Text>
                </TouchableOpacity>
                {location && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={styles.locationText}>
                            {`Lat: ${location.latitude}, Lon: ${location.longitude}`}
                        </Text>
                        <TouchableOpacity onPress={() => setShowMap(true)} style={styles.viewButton}>
                            <Text style={styles.viewMapText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteLocation}>
                            <Ionicons name="trash-outline" size={22} color="#F26419" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        position: 'absolute',
        height: '100%',
        width: '100%',
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
    titleContainer: {
        padding: 5,
        borderTopStartRadius: 17,
        borderTopEndRadius: 17,
        backgroundColor: 'white',
        marginTop: '3%',
        borderBottomWidth: 1,
        borderColor: 'rgba(204, 204, 204, 0.5)',
    },
    titleInput: {
        borderColor: '#CCCCCC',
        padding: 8,
        fontWeight: 'bold',
        fontSize: 20,
    },
    contentInput: {
        borderColor: '#CCCCCC',
        padding: 8,
        fontSize: 16,
        height: 230,
        textAlignVertical: 'top',
    },
    contentContainer: {
        padding: 5,
        borderBottomStartRadius: 17,
        borderBottomEndRadius: 17,
        backgroundColor: 'white',
        marginBottom: '3%',
        height: 280,
    },
    contentScroll: {
        flex: 1,
    },
    contentScrollContainer: {
        flexGrow: 1,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 8,
    },
    imageWrapper: {
        marginHorizontal: 4,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
    },
    addPictureButton: {
        width: 105,
        height: 105,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
        alignSelf: 'center',
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
        marginVertical: 16,
        alignItems: 'center',
        borderRadius: 17,
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
        fontSize: 14,
        marginRight: '4%',
        fontWeight: 'bold',
    },
    switch: {
        width: 50,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        padding: 3,
    },
    switchOn: {
        backgroundColor: '#4CD137',
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
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-end',
    },
    toggleOff: {
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: '4%',
        alignSelf: 'center',
        paddingLeft: 5,
    },
    locationText: {
        marginLeft: 1,
    },
    viewMapText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    viewButton: {
        marginHorizontal: 15,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
});
