import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../../components/styles';

const LibraryScreen = ({ navigation }) => {
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
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Text style={styles.bottomBarButtonText}>User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Notebook')}
        >
          <Text style={styles.bottomBarButtonText}>Notebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.bottomBarButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.bottomBarButtonText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('Forum')}
        >
          <Text style={styles.bottomBarButtonText}>Forum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LibraryScreen;
