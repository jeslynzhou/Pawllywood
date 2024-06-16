import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../components/styles';

export default function LibraryScreen({ handleSignOut, directToProfile }) {
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
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={directToProfile} style={styles.button}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
