import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ManageAccountScreen({ closeManageAccountScreen }) {
    const [petProfilesData, setPetProfilesData] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPetsForDelete, setSelectedPetsForDelete] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPetData() {
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
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchPetData();
    }, []);

    const openEditMyPetsList = () => {
        setShowConfirmationModal(true);
    };

    const closeEditMyPetsList = () => {
        setShowConfirmationModal(false);
        setSelectedPetsForDelete([]);
        setIsEditMode(false);
    };

    const confirmEditPetsList = () => {
        setIsEditMode(true);
        setShowConfirmationModal(false);
    };

    const toggleSelectPet = (petId) => {
        const index = selectedPetsForDelete.indexOf(petId);
        if (index === -1) {
            setSelectedPetsForDelete([...selectedPetsForDelete, petId]);
        } else {
            const updatedSelectedPetsForDelete = [...selectedPetsForDelete];
            updatedSelectedPetsForDelete.splice(index, 1);
            setSelectedPetsForDelete(updatedSelectedPetsForDelete);
        }
    };

    const deleteSelectedPets = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const deletionPromises = selectedPetsForDelete.map(async (petId) => {
                    const petDocRef = doc(db, 'users', user.uid, 'pets', petId);
                    await deleteDoc(petDocRef);
                });

                await Promise.all(deletionPromises);

                // Refresh after deletion
                fetchPetData();
                setSelectedPetsForDelete([]);
                setIsEditMode(false); // Exit edit mode after deletion
            }
        } catch (error) {
            console.error('Error deleting pets:', error.message);
        }
    };

    return (
        <View style={styles.myPetsContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeManageAccountScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Manage Account</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#F26419' />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {/* My Pets List */}
                    {petProfilesData.length === 0 ? (
                        <TouchableOpacity onPress={() => console.log('Hello')} style={styles.petInfoContainer}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text}>You don't have any pets. Click here to add your first pet now!</Text>
                            </View>
                            <View style={styles.navigateButtonContainer}>
                                <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        petProfilesData.map((petProfile) => (
                            <View key={petProfile.id}>
                                <TouchableOpacity onPress={() => console.log('Hello')} key={petProfile.id} style={[styles.petInfoContainer]}>
                                    <View style={styles.profileImageContainer}>
                                        <Image
                                            source={{ uri: petProfile.picture }}
                                            style={styles.profileImage}
                                            resizeMode='cover'
                                        />
                                    </View>
                                    <View style={styles.nameAndAdoptedDateContainer}>
                                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{petProfile.name}</Text>
                                        <Text style={styles.text}>Adopted Date: {petProfile.adoptedDate}</Text>
                                    </View>
                                    {isEditMode && (
                                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelectPet(petProfile.id)}>
                                            <Ionicons name={selectedPetsForDelete.includes(petProfile.id) ? 'checkbox-outline' : 'square-outline'} size={24} color='#000000' />
                                        </TouchableOpacity>
                                    )}
                                    {!isEditMode && (
                                        <View style={styles.navigateButtonContainer}>
                                            <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' />
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <View style={styles.separatorLine} />
                            </View>
                        ))

                    )}
                </View>
            )}
        </View >
    );
};

const styles = StyleSheet.create({
    myPetsContainer: {
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
    petInfoContainer: {
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
    checkboxContainer: {
        alignSelf: 'center',
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
