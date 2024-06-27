import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs } from 'firebase/firestore';

export default function MyPetsScreen({ closeMyPetsScreen }) {
    const [petProfilesData, setPetProfilesData] = useState([]);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const petsCollectionRef = collection(db, 'users', user.uid, 'pets');
                    const querySnapShot = await getDocs(petsCollectionRef);
                    const fetchedPetProfiles = querySnapShot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPetProfilesData(fetchedPetProfiles);
                } else {
                    console.log('User not authenticated.');
                }
            } catch (error) {
                console.error('Error fetching pets profile:', error.message);
            }
        };

        fetchPetData();
    }, []);

    const viewPetProfile = (petId) => {
        console.log(`Viewing pet profile with ID: ${petId}`);
    };

    return (
        <View style={styles.myPetsContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeMyPetsScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Pets</Text>
            </View>

            {/* Ny Pets List */}
            {petProfilesData.map(petProfile => (
                <>
                    <TouchableOpacity key={petProfile.id} style={styles.petInfoContainer} onPress={() => viewPetProfile(petProfile.id)}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: petProfile.picture ? petProfile.picture.toString() : '../../../assets/home_images/default_pet_image_circle.png' }}
                                style={styles.profileImage}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.nameAndAdoptedDateContainer}>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>{petProfile.name}</Text>
                            <Text style={styles.text}>Adopted Date: {petProfile.adoptedDate}</Text>
                        </View>
                        <View style={styles.navigateButtonContainer}>
                            <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.separatorLine} />
                </>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    myPetsContainer: {
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
    contentContainer: {
        justifyContent: 'flex-start',
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    petInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
    },
    profileImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    nameAndAdoptedDateContainer: {
        flex: 1,
        marginLeft: 10,
        alignSelf: 'center',
    },
    text: {
        fontSize: 16,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    navigateButtonContainer: {
        alignSelf: 'center',
    },
});
