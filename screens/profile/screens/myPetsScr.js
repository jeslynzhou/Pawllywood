import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function MyPetsScreen({ closeMyPetsScreen, handleAddingPet, directToHome }) {
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
                <TouchableOpacity onPress={closeMyPetsScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Pets</Text>
                <TouchableOpacity onPress={petProfilesData.length > 0 ? openEditMyPetsList : closeEditMyPetsList} style={styles.editContainer}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#F26419' />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {/* My Pets List */}
                    {petProfilesData.length === 0 ? (
                        <TouchableOpacity onPress={handleAddingPet} style={styles.petInfoContainer}>
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
                                <TouchableOpacity onPress={directToHome} key={petProfile.id} style={[styles.petInfoContainer]}>
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

            {/* Confirmation Modal */}
            <Modal
                isVisible={showConfirmationModal}
                transparent={true}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={() => setShowConfirmationModal(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Do you want to edit your pets list?</Text>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={confirmEditPetsList} style={styles.modalButton}>
                            <Text style={[styles.modalButtonText, { fontWeight: 'bold', color: '#F26419' }]}>Yes</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={() => setShowConfirmationModal(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            {/* Buttons for Edit Mode */}
            {isEditMode && (
                <View style={styles.editModeButtonsContainer}>
                    <TouchableOpacity onPress={closeEditMyPetsList} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                        <Text style={styles.editModeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteSelectedPets} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                        <Text style={styles.editModeButtonText}>Confirm Delete</Text>
                    </TouchableOpacity>
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
        paddingLeft: 40,
        marginBottom: 21,
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
    editContainer: {
        justifyContent: 'flex-end',
    },
    editText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
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
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
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
