import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  Text,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import MenuIcon from '../../../assets/svgs/menu.svg';
import SearchIcon from '../../../assets/svgs/search.svg';
import CustomText from '../../components/ui/CustomText';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { getGroups } from '../../services/groupsService';
import { useNavigation } from '@react-navigation/native';

const GroupsScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getGroups(userToken);
      if (response && Array.isArray(response.data)) {
        setGroups(response.data);
        setFilteredGroups(response.data);
      } else {
        setGroups([]); // Ensure empty array
        setFilteredGroups([]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
      setFilteredGroups([]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGroups(groups);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const matchedGroups = groups.filter((group) =>
        group.group_name.toLowerCase().includes(lowerCaseQuery)
      );

      if (matchedGroups.length === 0) {
        setFilteredGroups([]); // No matches, show no group found message
      } else {
        setFilteredGroups(matchedGroups);
      }
    }
  };

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const handleMenuOption = (option) => {
    setIsMenuVisible(false);
    if (option === 'CreateGroup') {
      navigation.navigate('CreateGroup');
    }
    if (option === 'GroupRequests') {
      navigation.navigate('GroupRequests');
    }
  };

  const handleGroupPress = (item) => {
    if (!item || !item.id) {
      navigation.navigate('NoGroupFoundScreen'); // Navigate if group not found
      return;
    }
    navigation.navigate('GroupDetailScreen', {
      groupId: item.id,
      groupName: item.group_name,
      groupDescription: item.group_details,
    });
  };

  const renderRightIcon = () => (
    <TouchableOpacity onPress={toggleMenu}>
      <MenuIcon width={24} height={24} fill="#000000" />
    </TouchableOpacity>
  );

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem} onPress={() => handleGroupPress(item)}>
      <Image
        source={{ uri: item.group_logo || 'https://via.placeholder.com/50' }}
        style={styles.groupLogo}
      />
      <CustomText variant="body" text={item.group_name} style={styles.groupName} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title="Groups" rightIconComponent={renderRightIcon()} />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Group Name"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
            <SearchIcon width={24} height={24} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* Check if there are no groups and show the "No groups found" message */}
        {filteredGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim() === '' ? 'No groups available' : 'No group found'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('GroupRequests')}>
              <CustomText variant="body" text="Group Requests" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('CreateGroup')}>
              <CustomText variant="body" text="Create New Group" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#98B9D7',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#98B9D7',
    backgroundColor: '#FAFBFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  groupLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  groupName: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 45,
    marginRight: 24,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default GroupsScreen;
