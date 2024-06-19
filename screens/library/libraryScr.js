import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../initializeFB';
import NavigationBar from '../../components/navigationBar';

export default function LibraryScreen({ directToProfile, directToLibrary }) {
  const [currentScreen, setCurrentScreen] = useState('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsList = [];
        const querySnapshot = await getDocs(collection(db, 'breeds'));
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

  const { width } = Dimensions.get('window');
  const imageL = width * 0.25;

  const filteredBreeds = breeds.filter(breed =>
    breed.breed.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType ? breed.type === selectedType : true)
  );

  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed);
    setSearchQuery(breed.breed);
    setIsSearching(false);
  };

  const renderAspectButtons = () => {
    const aspects = selectedType === 'dog'
      ? [
        { name: 'About', image: require('../../assets/library_images/aboutDogs.png') },
        { name: 'Health', image: require('../../assets/library_images/healthDogs.png') },
        { name: 'Grooming', image: require('../../assets/library_images/groomingDogs.png') },
        { name: 'Exercise', image: require('../../assets/library_images/exerciseDogs.png') },
        { name: 'Training', image: require('../../assets/library_images/trainingDogs.png') },
        { name: 'Nutrition', image: require('../../assets/library_images/nutritionDogs.png') },
      ]
      : [
        { name: 'About', image: require('../../assets/library_images/aboutCats.png') },
        { name: 'Appearance and Colours', image: require('../../assets/library_images/coloursCats.png') },
        { name: 'Personality', image: require('../../assets/library_images/personalitiesCats.png') },
        { name: 'Care', image: require('../../assets/library_images/careCats.png') },
        { name: 'Health', image: require('../../assets/library_images/healthCats.png') },
      ];

    return (
      <View style={styles.aspectButtonContainer}>
        {aspects.map((aspect, index) => (
          <TouchableOpacity
            key={index}
            style={styles.aspectButton}
            onPress={() => directToOtherPage(aspect.name)}
          >
            <Image source={aspect.image} style={{ width: imageL, height: imageL, marginBottom: 5 }} />
            <Text style={styles.buttonText}>{aspect.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const directToOtherPage = (aspect) => {
    // Replace this with actual navigation logic
    console.log(`Navigating to ${aspect} page of ${selectedBreed.breed}`);
  };

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
          style={[
            styles.typeButton,
            selectedType === 'dog' && styles.selectedTypeButtonDog
          ]}
          onPress={() => setSelectedType('dog')}
        >
          <Text style={styles.buttonText}>Dog</Text>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          style={[
            styles.typeButton,
            selectedType === 'cat' && styles.selectedTypeButtonCat
          ]}
          onPress={() => setSelectedType('cat')}
        >
          <Text style={styles.buttonText}>Cat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Choose a breed"
          value={searchQuery}
          onFocus={() => setIsSearching(true)}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      {isSearching && (
        <View style={styles.breedListContainer}>
          <ScrollView style={styles.breedList}>
            {filteredBreeds.map(breed => (
              <TouchableOpacity key={breed.id} style={styles.breedBlock} onPress={() => handleBreedSelect(breed)}>
                <Text style={styles.breedText}>{breed.breed}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedType && !isSearching && renderAspectButtons()}
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
    marginTop: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
    borderRadius: 17,
    borderWidth: 1,
    marginHorizontal: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTypeButtonDog: {
    backgroundColor: '#F26419',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  selectedTypeButtonCat: {
    backgroundColor: '#F26419',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  searchContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  breedListContainer: {
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 16,
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
  aspectButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 8,
  },
  aspectButton: {
    width: '44%',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 17,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: 'black',
  },
});