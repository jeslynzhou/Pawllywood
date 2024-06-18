import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import NavigationBar from '../../components/navigationBar';
import { styles } from '../../components/styles';

export default function LibraryScreen({ directToProfile, directToLibrary }) {
  const [currentScreen, setCurrentScreen] = useState('Library');
  const [searchQuery, setSearchQuery] = useState('');
  const animals = [
    { type: 'Dog', name: 'Bulldog' },
    { type: 'Dog', name: 'Beagle' },
    { type: 'Dog', name: 'Labrador' },
    { type: 'Cat', name: 'Persian' },
    { type: 'Cat', name: 'Siamese' },
    { type: 'Cat', name: 'Maine Coon' },
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <ScrollView contentContainerStyle={styles.animalList}>
        {filteredAnimals.map((animal, index) => (
          <TouchableOpacity key={index} style={styles.animalBlock}>
            <Text style={styles.animalText}>{animal.name} ({animal.type})</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Bar (Footer) */}
      <NavigationBar
        activeScreen={currentScreen}
        directToProfile={directToProfile}
        directToLibrary={directToLibrary}
      />
    </View>
  );
}
