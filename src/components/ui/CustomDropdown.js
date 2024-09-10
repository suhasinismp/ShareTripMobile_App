import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';

const CustomDropdown = ({
  placeholder,
  data,
  search = false,
  containerStyle,
  dropdownStyle,
  placeholderStyle,
  dropdownListStyle,
  searchInputStyle,
  itemStyle,
  itemTextStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const dropdownRef = useRef(null);
  const [dropdownLayout, setDropdownLayout] = useState(null);

  useEffect(() => {
    if (search) {
      setFilteredData(
        data.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data, search]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownLayout({ width, height });
      });
    }
  };

  const onItemPress = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, itemStyle]}
      onPress={() => onItemPress(item)}
    >
      <Text style={itemTextStyle}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        ref={dropdownRef}
        style={[styles.dropdown, dropdownStyle]}
        onPress={toggleDropdown}
      >
        <Text style={[styles.dropdownText, placeholderStyle]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
      </TouchableOpacity>

      {isOpen && dropdownLayout && (
        <View
          style={[
            styles.dropdownList,
            {
              top: dropdownLayout.height,
              width: dropdownLayout.width,
            },
            dropdownListStyle,
          ]}
        >
          {search && (
            <TextInput
              style={[styles.searchInput, searchInputStyle]}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.value.toString()}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 1000,
    width: '100%',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CustomDropdown;
