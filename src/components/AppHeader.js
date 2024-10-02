import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
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
  rightIconComponent,
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
    console.log('Searching for:', text);
  };

  const renderLeftSection = () => (
    <View style={styles.leftSection}>
      {drawerIcon && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <HamburgerMenu width={24} height={24} />
        </TouchableOpacity>
      )}
      {backIcon && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {groupIcon && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Group')}
        >
          <GroupIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {onlineIcon && (
        <TouchableOpacity style={styles.iconButton}>
          <OnlineIcon width={24} height={24} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRightSection = () => (
    <View style={styles.rightSection}>
      {muteIcon && (
        <TouchableOpacity style={styles.iconButton}>
          <MuteIcon width={24} height={24} />
        </TouchableOpacity>
      )}
      {rightIconComponent}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderLeftSection()}

      {(title || search) && (
        <View style={styles.centerSection}>
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
        </View>
      )}

      {renderRightSection()}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginHorizontal: 5,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36,
    width: '100%',
    maxWidth: 200,
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
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default AppHeader;
