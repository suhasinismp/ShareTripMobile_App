
// import React from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { useForm,Controller } from 'react-hook-form'; // For form handling
// import { Ionicons } from '@expo/vector-icons'; // For the search icon
// import CustomTextInput from './CustomTextInput'; // Import the CustomTextInput component
// import { BottomTabBar } from '@react-navigation/bottom-tabs';
// import { useNavigation } from '@react-navigation/native';

// const Groups =()=>{



// const SearchComponent = () => {
//   const { control, handleSubmit } = useForm(); // Initialize react-hook-form

//   const navigation =useNavigation()


//   // Define the onSearch function
//   const onSearch = (data) => {
//     console.log('Searching for:', data.searchInput); // Handle search logic here
//   };

  
// }
//   return (
//     <View style={styles.container}>
//       <CustomTextInput
//         placeholder="Search" 
//         name="searchInput" 
//         control={control} 
//         // rightItem={
//         //   // <TouchableOpacity onPress={handleSubmit(onSearch)} style={styles.searchButton}>
//         //   //   <Ionicons name="search-outline" size={24} color="black" />
//         //   // </TouchableOpacity>
//         // }
//       />
//       <FlatList
//       data={filteredData}
//       keyExtractor={(item)=>item.id.string()}
//       renderItem={({item})=>(
//         <card
        
        
//         />
//       )}

      
//       />
    
      
   


//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   searchButton: {
//     padding: 8,
//   },
// });

// export default Groups;



import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useForm, Controller } from 'react-hook-form'; // Form handling
import { Ionicons } from '@expo/vector-icons'; // Icon for search button
import CustomTextInput from './CustomTextInput'; // Import your CustomTextInput component
import { useNavigation } from '@react-navigation/native'; // Navigation hook

const Groups = () => {
  const { control, handleSubmit } = useForm(); // Initialize react-hook-form
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [allData, setAllData] = useState([
    // Mock data array
    { id: '1', name: 'Group 1' },
    { id: '2', name: 'Group 2' },
    { id: '3', name: 'Group 3' },
  ]);

  const navigation = useNavigation(); // Navigation hook

  // Search function to filter data
  const onSearch = (data) => {
    const searchTerm = data.searchInput.toLowerCase();
    const filtered = allData.filter(item => item.name.toLowerCase().includes(searchTerm));
    setFilteredData(filtered); // Update state with filtered data
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="searchInput"
        render={({ field: { onChange, value } }) => (
          <CustomTextInput
            placeholder="Search"
            value={value}
            onChangeText={onChange}
            rightItem={
              <TouchableOpacity onPress={handleSubmit(onSearch)} style={styles.searchButton}>
                <Ionicons name="search-outline" size={24} color="black" />
              </TouchableOpacity>
            }
          />
        )}
      />

      <FlatList
        data={filteredData.length > 0 ? filteredData : allData} // Display all data initially
        keyExtractor={(item) => item.id.toString()} // Fix: use toString() on id
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}>
              <View>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchButton: {
    padding: 8,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Groups;
