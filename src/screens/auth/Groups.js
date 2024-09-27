
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form'; // For form handling
import { Ionicons } from '@expo/vector-icons'; // For the search icon
import CustomTextInput from './CustomTextInput'; // Import the CustomTextInput component

const SearchComponent = () => {
  const { control, handleSubmit } = useForm(); // Initialize react-hook-form

  // Define the onSearch function
  const onSearch = (data) => {
    console.log('Searching for:', data.searchInput); // Handle search logic here
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        placeholder="Search" // Input placeholder
        name="searchInput" // Form field name
        control={control} // Form control
        rightItem={
          <TouchableOpacity onPress={handleSubmit(onSearch)} style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>
        }
      />
      <FlatList
      data={filteredData}
      keyExtractor={(item)=>item.id.string()}
      renderItem={({item})=>(
        <card
        
        
        />
      )}

      
      />
    
      
   


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  searchButton: {
    padding: 8,
  },
});

export default SearchComponent;
