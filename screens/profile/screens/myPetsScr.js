import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';

export default function MyPetsScreen({ closeMyPetsScreen, handleAddingPet, directToHome }) {
    const [petProfilesData, setPetProfilesData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewMode, setViewMode] = useState('currentPets');
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isArchivedMode, setIsArchivedMode] = useState(false);
    const [selectedPetsForEdit, setSelectedPetsForEdit] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchPetData() {
        try {
            const user = auth.currentUser;
            if (user) {
                const petsCollectionRef = collection(db, 'users', user.uid, 'pets');

                if (viewMode === 'currentPets') {
                    q = query(petsCollectionRef, where('isArchived', '==', false));
                } else if (viewMode === 'archivedPets') {
                    q = query(petsCollectionRef, where('isArchived', '==', true));
                }
                const querySnapShot = await getDocs(q);
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
    }, [viewMode]);

    { /* Edit Modal */ }
    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    { /* Archive pets */ }
    const handleArchivedPetsList = () => {
        setIsArchivedMode(true);
        setShowEditModal(false);
    };

    const closeArchivedPetsList = () => {
        setSelectedPetsForEdit([]);
        setIsArchivedMode(false);
    };

    const archiveSelectedPets = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const archivePromises = selectedPetsForEdit.map(async (petId) => {
                    const petDocRef = doc(db, 'users', user.uid, 'pets', petId);
                    await updateDoc(petDocRef, {
                        isArchived: true,
                    });
                });
                await Promise.all(archivePromises);

                fetchPetData();
                setSelectedPetsForEdit([]);
                setIsArchivedMode(false);
            }
        } catch (error) {
            console.error('Error archiving pets:', error.message);
            Alert.alert('Error archiving pets.', 'Please try again later.');
        }
    };

    { /* Delete pets */ }
    const handleDeletePetsList = () => {
        setIsDeleteMode(true);
        setShowEditModal(false);
    };

    const closeDeleteMyPetsList = () => {
        setSelectedPetsForEdit([]);
        setIsDeleteMode(false);
    };

    const toggleSelectPet = (petId) => {
        const index = selectedPetsForEdit.indexOf(petId);
        if (index === -1) {
            setSelectedPetsForEdit([...selectedPetsForEdit, petId]);
        } else {
            const updatedSelectedPetsForDelete = [...selectedPetsForEdit];
            updatedSelectedPetsForDelete.splice(index, 1);
            setSelectedPetsForEdit(updatedSelectedPetsForDelete);
        }
    };

    const deleteSelectedPets = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const deletionPromises = selectedPetsForEdit.map(async (petId) => {
                    const petDocRef = doc(db, 'users', user.uid, 'pets', petId);
                    await deleteDoc(petDocRef);
                });

                await Promise.all(deletionPromises);

                // Refresh after deletion
                fetchPetData();
                setSelectedPetsForEdit([]);
                setIsDeleteMode(false); // Exit edit mode after deletion
            }
        } catch (error) {
            console.error('Error deleting pets:', error.message);
        }
    };

    const handleCurrentPetsView = () => {
        setViewMode('currentPets');
    };

    const handleArchivedPetsView = () => {
        setViewMode('archivedPets');
    };

    return (
        <View style={styles.myPetsContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeMyPetsScreen} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>My Pets</Text>
                <TouchableOpacity onPress={petProfilesData.length > 0 ? openEditModal : closeEditModal} style={styles.editContainer}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.viewModeContainer}>
                <TouchableOpacity style={[styles.viewModeButton, viewMode === 'currentPets' ? styles.viewModeActiveButton : null]} onPress={handleCurrentPetsView}>
                    <Text style={styles.viewModeButtonText}>Current</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewModeButton, viewMode === 'archivedPets' ? styles.viewModeActiveButton : null]} onPress={handleArchivedPetsView}>
                    <Text style={styles.viewModeButtonText}>Archive</Text>
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
                        <>
                            {viewMode === 'currentPets' && (
                                <TouchableOpacity onPress={handleAddingPet} style={styles.petInfoContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.text}>You don't have any pets. Click here to add your first pet now!</Text>
                                    </View>
                                    <View style={styles.navigateButtonContainer}>
                                        <Ionicons name="chevron-forward-outline" size={24} color='#CCCCCC' />
                                    </View>
                                </TouchableOpacity>
                            )}
                            {viewMode === 'archivedPets' && (
                                <View style={styles.petInfoContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.text}>You don't have any pets in archive.</Text>
                                    </View>
                                </View>
                            )}

                        </>
                    ) : (
                        petProfilesData.map((petProfile) => (
                            <View key={petProfile.id}>
                                <TouchableOpacity onPress={directToHome} key={petProfile.id} style={[styles.petInfoContainer]} disabled={isDeleteMode || isArchivedMode}>
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
                                    {(isDeleteMode || isArchivedMode) && (
                                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelectPet(petProfile.id)}>
                                            <Ionicons name={selectedPetsForEdit.includes(petProfile.id) ? 'checkbox-outline' : 'square-outline'} size={24} color='#000000' />
                                        </TouchableOpacity>
                                    )}
                                    {!isDeleteMode && !isArchivedMode && (
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

            {/* Edit Modal */}
            <Modal
                isVisible={showEditModal}
                transparent={true}
                animationIn='fadeIn'
                animationOut='fadeOut'
                onBackdropPress={closeEditModal}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Do you want to edit your pets list?</Text>
                    <View style={styles.modalButtonContainer}>
                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={handleArchivedPetsList} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Archive</Text>
                        </TouchableOpacity>

                        <View style={styles.separatorLine} />

                        <TouchableOpacity onPress={handleDeletePetsList} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal >

            {/* Buttons for Archived Mode */}
            {isArchivedMode && (
                <View style={styles.editModeButtonsContainer}>
                    <TouchableOpacity onPress={closeArchivedPetsList} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
                        <Text style={styles.editModeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={archiveSelectedPets} style={[styles.editModeButton, { backgroundColor: '#F26419' }]}>
                        <Text style={styles.editModeButtonText}>Confirm Archive</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Buttons for Delete Mode */}
            {isDeleteMode && (
                <View style={styles.editModeButtonsContainer}>
                    <TouchableOpacity onPress={closeDeleteMyPetsList} style={[styles.editModeButton, { backgroundColor: '#CCCCCC' }]}>
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
    viewModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    viewModeButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    viewModeButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    viewModeActiveButton: {
        backgroundColor: '#F26419',
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
