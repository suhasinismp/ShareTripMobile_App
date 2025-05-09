import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import MenuIcon from '../../../assets/svgs/menu.svg';
import SearchIcon from '../../../assets/svgs/search.svg';
import CustomText from '../../components/ui/CustomText';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { getGroupListUserId, getGroups, getGroupsByUserId } from '../../services/groupsService';
import { useNavigation } from '@react-navigation/native';



const GroupsScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userId = userData?.userId;
  const userToken = userData?.userToken;
  const [groups, setGroups] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchGroupsByUserId();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchGroupsByUserId = async () => {
    try {
      const response = await getGroupListUserId(userId, userToken); // Fix: pass userId first, then token
      console.log('Groups response:', response);
      if (response?.data) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
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
    navigation.navigate('GroupDetailScreen', {
      groupImage: item.group_logo,
      groupId: item.group_id,
      groupName: item.group_name, // Pass group name
      groupDescription: item.group_details,
    });

  };

  const renderRightIcon = () => (
    <TouchableOpacity onPress={toggleMenu}>
      <MenuIcon width={24} height={24} fill="#000000" style={styles.menuIconStyle} />
    </TouchableOpacity>
  );

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem} onPress={() => { handleGroupPress(item) }}>
      {/* // <View style={styles.groupItem}> */}
      <Image
        source={{ uri: item.group_logo || 'https://via.placeholder.com/50' }}
        style={styles.groupLogo}
      />
      <CustomText
        variant="body"
        text={item.group_name}
        style={styles.groupName}
      />
      {/* // </View> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        backIcon={true}
        title="Groups"
        rightIconComponent={renderRightIcon()}
      />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Group Name"
          />
          <SearchIcon width={24} height={24} style={styles.searchIcon} />
        </View>

        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.group_id.toString()}  // Changed from item.id to item.group_id
          contentContainerStyle={styles.listContent}
        />
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuOption('GroupRequests')}
            >
              <CustomText variant="body" text="Group Requests" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuOption('CreateGroup')}
            >
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
  menuIconStyle: {
    width: 24,
    height: 24,
  },
  menuItem: {
    padding: 12,
  },
});

export default GroupsScreen;

