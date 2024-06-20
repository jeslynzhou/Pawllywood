import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

import NavigationBar from '../../components/navigationBar';
import EditPetInfoScreen from './editPetInfo';

export default function HomeScreen({ directToProfile, directToNotebook, directToLibrary, directToForum }) {
    const [currentScreen, setCurrentScreen] = useState('Home');

    const { width, height } = Dimensions.get('window');
    const logoHeightSize = height * 0.1;
    const logoWidthSize = width * 0.5;

    const handleEditPetInfo = () => {
        setCurrentScreen('EditPetInfo');
    };

    const closeEditPetInfo = () => {
        setCurrentScreen('Home');
    };

    return (
        <>
            {currentScreen === 'Home' && (
                <View style={styles.homeContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/home_images/pawllywood_logo.png')}
                            style={{ height: logoHeightSize, width: logoWidthSize }}
                            resizeMode='contain'
                        />
                    </View>

                    {/* Home Screen Content */}
                    <View style={styles.contentContainer}>
                        {/* Pet Info */}
                        <Text style={styles.labels}>Pet Info</Text>
                        <View style={styles.petInfoBox}>
                            <TouchableOpacity onPress={handleEditPetInfo} style={styles.editButton}>
                                <Ionicons name='ellipsis-horizontal' size={15} color='#000000' />
                            </TouchableOpacity>
                            <View style={styles.petInfoContainer}>
                                {/* Pet Picture & Name */}
                                <View style={styles.pictureNameContainer}>
                                    <Image style={styles.petImageContainer} />
                                    <Text style={styles.petName}>Peanut</Text>
                                </View>

                                {/* Pet Information */}
                                <View style={styles.infoContainer}>

                                </View>
                            </View>
                        </View>

                        {/* Notes */}
                        <Text style={styles.labels}>Notes</Text>
                        <View style={styles.notesBox}>
                            <TouchableOpacity onPress={handleEditPetInfo} style={styles.editButton}>
                                <Ionicons name='ellipsis-horizontal' size={15} color='#000000' />
                            </TouchableOpacity>
                            <View style={styles.notesInfoContainer}>
                                <Text style={styles.input}>Click here to take notes!</Text>
                            </View>
                        </View>
                    </View>

                    {/* Navigation Bar */}
                    <NavigationBar
                        activeScreen={currentScreen}
                        directToProfile={directToProfile}
                        directToNotebook={directToNotebook}
                        directToLibrary={directToLibrary}
                        directToForum={directToForum}
                    />
                </View>
            )}
            {currentScreen === 'EditPetInfo' && (
                <EditPetInfoScreen
                    closeEditPetInfo={closeEditPetInfo}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    header: {
        position: 'absolute',
        alignSelf: 'flex-start',
        marginTop: 32,
        marginLeft: -7,
    },
    contentContainer: {
        marginTop: 100,
        paddingHorizontal: 16,
        width: '100%',
    },
    labels: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    petInfoBox: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 12,
        marginBottom: 7,
        height: 190, //might delete later
    },
    editButton: {
        alignSelf: 'flex-end',
    },
    petInfoContainer: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 7,
    },
    pictureNameContainer: {
        borderWidth: 1,
        padding: 5,
    },
    petImageContainer: {

    },
    petName: {

    },
    infoContainer: {
        flex: 1,
        borderWidth: 1,
    },
    notesBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingTop: 5,
        paddingBottom: 12,
        height: 300, //might delete later
    },
    notesInfoContainer: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
    },
});
