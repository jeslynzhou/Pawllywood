import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, PanResponder, Modal, ActivityIndicator } from 'react-native'; import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../initializeFB';
import NavigationBar from '../../components/navigationBar';
import { Ionicons } from '@expo/vector-icons';
 
export default function LibraryScreen({ directToProfile, directToNotebook, directToLibrary, directToForum, directToHome }) {
  const [currentScreen, setCurrentScreen] = useState('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonContainerHeight, setButtonContainerHeight] = useState(0);
  const [searchContainerHeight, setSearchContainerHeight] = useState(0);
  const [marginTopContentContainer, setMarginTopContentContainer] = useState(0);
 
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
            about: doc.data().about,
            health: doc.data().health,
            grooming: doc.data().grooming,
            exercise: doc.data().exercise,
            training: doc.data().training,
            nutrition: doc.data().nutrition,
            appearance_and_colours: doc.data().appearance,
            personality: doc.data().personality,
            care: doc.data().care,
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
 
  useEffect(() => {
    const calculateMarginTop = () => {
      const marginTop = buttonContainerHeight + searchContainerHeight + (height + width) * 0.06;
      setMarginTopContentContainer(marginTop);
    };
 
    calculateMarginTop();
  }, [buttonContainerHeight, searchContainerHeight]);
 
 
  const calculateMarginTop = (buttonContainerHeight, searchContainerHeight) => {
    const marginTop = buttonContainerHeight + searchContainerHeight + height * 0.1;
    setMarginTopContentContainer(marginTop);
  };
 
  const { height, width } = Dimensions.get('window');
  const imageL = width * 0.25;
 
  const filteredBreeds = breeds.filter(
    breed =>
      breed.breed.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType ? breed.type === selectedType : true)
  );
 
  const handleBreedSelect = breed => {
    setSelectedBreed(breed);
    setSearchQuery(breed.breed);
    setIsSearching(false);
    setSelectedAspect(null);
  };
 
  const handleTypeSelect = type => {
    setSelectedType(type);
    setSearchQuery('');
    setSelectedBreed(null);
    setSelectedAspect(null);
    setIsSearching(false);
  };
 
  const handleAspectPress = (aspectName) => {
    if (!selectedBreed) {
      setIsModalVisible(true);
    } else {
      setSelectedAspect(aspectName);
    }
  };
 
  const renderAspectButtons = () => {
    const aspects =
      selectedType === 'dog'
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
            onPress={() => handleAspectPress(aspect.name)} // Update onPress handler
          >
            <Image source={aspect.image} style={{ width: imageL, height: imageL, marginBottom: 5 }} />
            <Text style={styles.buttonText}>{aspect.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
 
  const renderAspectContent = () => {
    const contentMap = {
      About: selectedBreed.about,
      Health: selectedBreed.health,
      Grooming: selectedBreed.grooming,
      Exercise: selectedBreed.exercise,
      Training: selectedBreed.training,
      Nutrition: selectedBreed.nutrition,
      'Appearance and Colours': selectedBreed.appearance_and_colours,
      Personality: selectedBreed.personality,
      Care: selectedBreed.care,
    };
 
    const aspects =
      selectedType === 'dog'
        ? ['About', 'Health', 'Grooming', 'Exercise', 'Training', 'Nutrition']
        : ['About', 'Appearance and Colours', 'Personality', 'Care', 'Health'];
 
    const aspectIndex = aspects.indexOf(selectedAspect);
 
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 20 && aspectIndex > 0) {
          setSelectedAspect(aspects[aspectIndex - 1]);
        } else if (gestureState.dx < -20 && aspectIndex < aspects.length - 1) {
          setSelectedAspect(aspects[aspectIndex + 1]);
        }
      },
    });
 
    return (
      <View style={[styles.contentContainer, { marginTop: marginTopContentContainer }]} {...panResponder.panHandlers}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.returnButton} onPress={() => setSelectedAspect(null)}>
            <Ionicons name="arrow-back-outline" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {selectedBreed.breed} - {selectedAspect}
          </Text>
        </View>
        <ScrollView
          style={styles.topButtonsContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {aspects.map((aspect, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.topButton, selectedAspect === aspect && styles.selectedTopButton]}
              onPress={() => setSelectedAspect(aspect)}
            >
              <Text style={styles.topButtonText}>{aspect}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView style={styles.scrollViewContent}>
          <Text style={styles.contentText}>{contentMap[selectedAspect]}</Text>
        </ScrollView>
      </View>
    );
  };
 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#F26419' />
      </View>
    );
  };
 
  return (
    <View style={styles.libContainer}>
      <View style={styles.buttonContainer} onLayout={(event) => setButtonContainerHeight(event.nativeEvent.layout.height)}>
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'dog' && styles.selectedTypeButtonDog]}
          onPress={() => handleTypeSelect('dog')}
        >
          <Text style={styles.buttonText}>Dog</Text>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity
          style={[styles.typeButton, selectedType === 'cat' && styles.selectedTypeButtonCat]}
          onPress={() => handleTypeSelect('cat')}
        >
          <Text style={styles.buttonText}>Cat</Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.searchContainer}
        onLayout={(event) => setSearchContainerHeight(event.nativeEvent.layout.height)}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Choose a breed"
          value={searchQuery}
          onFocus={() => setIsSearching(true)}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      {isSearching && (
        <View style={[styles.breedListContainer, { zIndex: 1 }]}>
          <ScrollView style={styles.breedList}>
            {filteredBreeds.map(breed => (
              <TouchableOpacity key={breed.id} style={styles.breedBlock} onPress={() => handleBreedSelect(breed)}>
                <Text style={styles.breedText}>{breed.breed}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {selectedType && !isSearching && !selectedAspect && renderAspectButtons()}
      {selectedAspect && renderAspectContent()}
      {/* Modal Implementation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Please select a breed first!</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Navigation Bar (Footer) */}
      <NavigationBar
        activeScreen={currentScreen}
        directToProfile={directToProfile}
        directToNotebook={directToNotebook}
        directToLibrary={directToLibrary}
        directToForum={directToForum}
        directToHome={directToHome}
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
    backgroundColor: '#FFFFFF',
  },
  breedListContainer: {
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  breedList: {
    flexGrow: 1,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
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
    maxHeight: 135,
  },
  aspectButton: {
    width: '44%',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 4,
    borderWidth: 1,
    borderRadius: 17,
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
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    position: 'absolute',
    width: '100%',
    height: '70%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnButton: {
    padding: 10,
    borderRadius: 17,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    maxHeight: 60,
  },
  topButton: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 17,
    margin: 5,
  },
  selectedTopButton: {
    backgroundColor: '#F26419',
  },
  topButtonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'justify',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F26419',
    borderRadius: 17,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    flex: 1,
  },
});