import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    // for App.js
    appContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        backgroundColor: '#FCF9D9',
    },
    authContainer: {
        width: '100%',
        height: '90%',
        backgroundColor: '#FCF9D9',
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    title: {
        fontSize: 25,
        marginBottom: 16,
        textAlign: 'left',
        marginTop: 20,
        fontWeight: 'bold',
    },
    labels: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5,
    },
    input: {
        height: 45,
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 17,
        borderColor: '#000000',
        borderWidth: 1,
    },
    button: {
        height: 45,
        backgroundColor: '#F26419',
        borderColor: '#F26419',
        borderWidth: 1,
        borderRadius: 17,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    toggleButton: {
        marginTop: 10,
        alignSelf: 'center',
    },
    toggleButtonText: {
        color: '#F26419',
        fontWeight: 'bold',
    },
    imageContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    image: {
        alignSelf: 'center',
        resizeMode: 'cover',
    },
});