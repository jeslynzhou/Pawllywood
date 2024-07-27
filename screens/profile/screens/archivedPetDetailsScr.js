import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db, auth } from '../../../initializeFB';
import { doc, getDoc } from 'firebase/firestore';

export default function ArchivedPetDetailsScreen({ onClose, archivedPetId }) {
    const [archivedPetDetails, setArchivedPetDetails] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArchivedPetDetails = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const archivedPetDocRef = doc(db, 'users', user.uid, 'pets', archivedPetId);
                    const archivedPetDoc = await getDoc(archivedPetDocRef);

                    if (archivedPetDoc.exists()) {
                        setArchivedPetDetails(archivedPetDoc.data());
                    } else {
                        Alert.alert('Error fetching pet data', 'Pet not found');
                    }
                } else {
                    Alert.alert('User not authenticated');
                }
            } catch (error) {
                Alert.alert('Error fetching pet details', 'Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchArchivedPetDetails();
    }, [archivedPetId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#F26419' />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={24} color='#000000' />
                </TouchableOpacity>
                <Text style={styles.headerText}>{archivedPetDetails.name}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
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
    loadingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
});