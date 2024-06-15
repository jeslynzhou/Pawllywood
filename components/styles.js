import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    authContainer: {
        width: '100%',
        height: '90%',
        backgroundColor: '#FCF9D9',
        marginTop: '10%',
        paddingHorizontal: 16,
    },
    // for App.js
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FCF9D9',
    },
    title: {
        fontSize: 25,
        marginBottom: 16,
        textAlign: 'left',
        marginTop: 20,
        fontWeight: 'bold',
    },
    labels: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 5,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
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
        color: '#fff',
    },
    toggleButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    toggleButtonText: {
        color: '#F26419',
        fontWeight: 'bold',
    },
    image: {
        alignSelf: 'center',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    bottomBarButton: {
        flex: 1,
        alignItems: 'center',
    },
    bottomBarButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

