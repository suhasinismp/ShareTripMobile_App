import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import AppHeader from '../../../components/AppHeader';
import { getGroups } from '../../../services/groupsService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../../components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { createPost } from '../../../services/postTripService';

const SelectGroupScreen = ({ route }) => {
  const { finalData, recordedAudioUri } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;

  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGroups();
  }, [userData]);

  const fetchGroups = async () => {
    const response = await getGroups(userToken);
    if (
      response?.error === false &&
      response?.message === 'Groups fetched successfully'
    ) {
      const sortedGroups = response?.data.sort((a, b) =>
        a.group_name.localeCompare(b.group_name),
      );
      setAllGroups(sortedGroups);
      setFilteredGroups(sortedGroups);
    }
  };

  const handleSend = async () => {
    if (selectedGroupIds.length > 0) {
      finalData.post_type_value = JSON.stringify(selectedGroupIds);

      const formData = new FormData();

      formData.append('json', JSON.stringify(finalData));
      if (recordedAudioUri) {
        const filename = recordedAudioUri.split('/').pop();

        formData.append('voiceMessage', {
          uri: recordedAudioUri,
          type: 'audio/m4a',
          name: filename,
        });
      }

      const response = await createPost(formData, userToken);

      if (
        response?.message === 'Post Booking Data created successfully' &&
        response?.error === false
      ) {
        navigation.navigate('Home');
      } else {
        alert(response?.message);
      }
    } else {
      alert('Please select at least one group');
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allGroups.filter((group) =>
      group.group_name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredGroups(filtered);
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroupIds((prevIds) =>
      prevIds.includes(groupId)
        ? prevIds.filter((id) => id !== groupId)
        : [...prevIds, groupId],
    );
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => toggleGroupSelection(item.id)}
    >
      <Image
        source={{ uri: item.group_logo || 'https://via.placeholder.com/50' }}
        style={styles.groupLogo}
      />
      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: theme.textColor }]}>
          {item.group_name}
        </Text>
      </View>
      {selectedGroupIds.includes(item.id) ? (
        <Feather name="check-circle" size={24} color="green" />
      ) : (
        <Feather name="check-circle" size={24} color="#D3D3D3" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
    >
      <AppHeader
        backIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={'Select Group'}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={24}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search By Group Name"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={filteredGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
        <View style={styles.bottomSpacing} />
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel"
          variant="text"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        <CustomButton title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  groupLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SelectGroupScreen;
