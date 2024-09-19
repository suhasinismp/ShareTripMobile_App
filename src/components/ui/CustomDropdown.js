import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from './CustomText';

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
  height = 56,
  label,
  isOpen,
  onToggle,
  onSelect,
  value,
  onChange,
  ...props
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const dropdownRef = useRef(null);
  const [dropdownLayout, setDropdownLayout] = useState(null);

  useEffect(() => {
    if (search) {
      setFilteredData(
        data.filter((item) =>
          item[label].toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data, search, label]);

  const toggleDropdown = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isOpen) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownLayout({ width, height });
      });
    }
  };

  const onItemPress = (item) => {
    setSearchQuery('');
    if (onSelect) {
      onSelect(item);
    }
    if (onChange) {
      onChange(item[label]);
    }
    if (onToggle) {
      onToggle();
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.created_at.toString()}
      style={[styles.item, itemStyle]}
      onPress={() => onItemPress(item)}
    >
      <Text style={itemTextStyle}>{item[label]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable onPress={toggleDropdown}>
        <CustomText
          variant="placeHolderText"
          style={[
            styles.label,
            { backgroundColor: theme.backgroundColor },
            {
              top: !isOpen && !value ? height / 2 - 11 : -9,
            },
            (isOpen || value) && styles.labelRaised,
            isOpen && styles.labelFocused,
          ]}
          text={placeholder}
        />

        <View
          ref={dropdownRef}
          style={[
            styles.dropdown,
            { height: height, backgroundColor: theme.backgroundColor },
            dropdownStyle,
            isOpen && styles.dropdownFocused,
          ]}
        >
          <Text style={[styles.dropdownText, placeholderStyle]}>
            {value || ''}
          </Text>
          <View style={styles.arrowContainer}>
            <View style={[styles.arrow, isOpen && styles.arrowUp]} />
          </View>
        </View>
      </Pressable>

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
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredData.map(renderItem)}
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
  },
  dropdownFocused: {
    borderColor: '#6750A4',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownList: {
    position: 'absolute',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    width: '100%',
    elevation: 5,
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
  label: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelRaised: {
    fontSize: 12,
  },
  labelFocused: {
    color: '#6750A4',
  },
  arrowContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#005581',
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
});

export default CustomDropdown;
