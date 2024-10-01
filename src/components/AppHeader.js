import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  View,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './ui/CustomText';
import BackIcon from '../../assets/svgs/back.svg';
import HamburgerMenu from '../../assets/svgs/hambergerMenu.svg';
import GroupIcon from '../../assets/svgs/group.svg';
import MuteIcon from '../../assets/svgs/mute.svg';
import OnlineIcon from '../../assets/svgs/online.svg';
import SearchIcon from '../../assets/svgs/search.svg';

const AppHeader = ({
  title,
  backIcon,
  rightIcon,
  onRightIconPress,
  drawerIcon,
  search,
  groupIcon,
  onlineIcon,
  muteIcon,
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    // Implement your search logic here
    console.log('Searching for:', text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {drawerIcon && (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <HamburgerMenu width={24} height={24} />
        </TouchableOpacity>
      )}
      {backIcon && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {groupIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <GroupIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {onlineIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <OnlineIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {title && (
        <CustomText
          text={title}
          variant="headerTitle"
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
        />
      )}
      {search && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchIconContainer}>
            <SearchIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
      )}
      {muteIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <MuteIcon width={24} height={24} />
        </TouchableOpacity>
      )}

      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: '#F3F5FD',
    justifyContent: 'space-between',
    elevation: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36,
    minWidth: '40%',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 8,
  },
  searchIconContainer: {
    padding: 5,
  },
  leftContainer: {
    width: 24,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  rightContainer: {
    width: 24,
    alignItems: 'flex-end',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    alignSelf: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default AppHeader;
