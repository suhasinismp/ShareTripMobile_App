import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import MenuIcon from '../../../assets/svgs/menu.svg';

import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { getGroups } from '../../services/groupsService';
import SearchIcon from '../../../assets/svgs/search.svg';
import CustomText from '../../components/ui/CustomText';
const GroupsScreen = () => {
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const response = await getGroups(userToken);
    setGroups(response.data);
  };

  const renderRightIcon = () => (
    <TouchableOpacity onPress={() => console.log('Menu icon pressed')}>
      <MenuIcon width={24} height={24} fill="#000000" />
    </TouchableOpacity>
  );

  const renderGroupItem = ({ item }) => (
    <View style={styles.groupItem}>
      <Image
        source={{ uri: item.group_logo || '/api/placeholder/40/40' }}
        style={styles.groupLogo}
      />
      <CustomText
        variant="body"
        text={item.group_name}
        style={styles.groupName}
      />
    </View>
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
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
  },
});

export default GroupsScreen;
