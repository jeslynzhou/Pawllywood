import { Text, View, ImageBackground, TouchableOpacity } from "react-native";
import React from 'react';
import { styles } from "../../components/styles";

export default function ProfileScreen({ handleSignOut }) {
    return (
        <View style={styles.profileContainer}>
            <Text> Profile Screen </Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}