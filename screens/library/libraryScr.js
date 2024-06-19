import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { database } from '../../initializeFB';
import NavigationBar from '../../components/navigationBar';

export default function LibraryScreen({ directToProfile, directToLibrary }) {
  const [currentScreen, setCurrentScreen] = useState('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsList = [];
        const querySnapshot = await getDocs(collection(database, 'breeds'));
        querySnapshot.forEach(doc => {
          breedsList.push({
            id: doc.id,
            breed: doc.data().breed,
            type: doc.data()['dog/cat'],
          });
        });
        setBreeds(breedsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching breeds: ', error);
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  const filteredBreeds = breeds.filter(breed =>
    breed.breed.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType ? breed.type === selectedType : true)
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.libContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'dog' && styles.selectedTypeButton]}
          onPress={() => setSelectedType('dog')}
        >
          <Text style={styles.buttonText}>Dog</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'cat' && styles.selectedTypeButton]}
          onPress={() => setSelectedType('cat')}
        >
          <Text style={styles.buttonText}>Cat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onFocus={() => setIsSearching(true)}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      {isSearching && (
        <View style={styles.breedListContainer}>
          <ScrollView style={styles.breedList}>
            {filteredBreeds.map(breed => (
              <TouchableOpacity key={breed.id} style={styles.breedBlock}>
                <Text style={styles.breedText}>{breed.breed}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {/* Navigation Bar (Footer) */}
      <NavigationBar
        activeScreen={currentScreen}
        directToProfile={directToProfile}
        directToLibrary={directToLibrary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  libContainer: {
    flex: 1,
    width: '100%',
    marginTop: '3%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#F26419',
  },
  searchContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
  },
  breedListContainer: {
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  breedList: {
    flexGrow: 1,
    borderRadius: 17,
    backgroundColor: 'white',
    maxHeight: 200,
  },
  breedBlock: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
  },
  breedText: {
    fontSize: 16,
    color: '#4E3622',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    bottom: 0,
    position: 'absolute'
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 17,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
