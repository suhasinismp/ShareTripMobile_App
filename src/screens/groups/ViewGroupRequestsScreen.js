import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text, FlatList, Modal, Image } from 'react-native';
import AppHeader from '../../components/AppHeader';
import MenuIcon from '../../../assets/svgs/menu.svg';
import SearchIcon from '../../../assets/svgs/search.svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import CustomText from '../../components/ui/CustomText';
import { getGroupRequestByUserId } from '../../services/groupsService';
import CustomButton from '../../components/ui/CustomButton';



const ViewGroupRequestsScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const userId = userData.userId;
  const [groupRequestData, setGroupRequestData] = useState([]);
  console.log({ groupRequestData })
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    fetchGroupRequests()
  }, [])



  const fetchGroupRequests = async () => {
    const response = await getGroupRequestByUserId(userId, userToken)
    setGroupRequestData(response)

  }



  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);



  const renderRightIcon = () => (
    <TouchableOpacity onPress={toggleMenu}>
      <MenuIcon width={24} height={24} fill="#000000" />
    </TouchableOpacity>
  );



  const renderGroupRequestItem = ({ item }) => {
    // console.log('Group Logo:', item.group_logo);
    // console.log('Group Name:', item.group_name);


    const handleAccept = () => {

    }

    const handleDecline = () => {

    }
    const showAdditionalUsersText = item.related_user_count > 0;


    return (
      <View style={styles.groupItem}>
        <View style={styles.topSection}>
          <View style={styles.logo}>
            <Image
              source={{
                uri: item.group_logo || ' / api / placeholder / 40 / 40'
              }}
              style={styles.groupLogo}
              resizeMode="cover"
            />
            <View>
              <CustomText
                variant="body"
                text={item.group_name || 'Unnamed Group'}
                style={styles.groupName}
              />


              {item.related_users[0].is_admin && (
                <Text>Admin:{item.related_users[0].user_name}</Text>
              )}
            </View>
          </View>



          <View style={styles.relatedUserContainer}>
            <View style={styles.relatedUser}>

              {showAdditionalUsersText && (
                <View style={styles.userCountSection}>
                  <Image
                    source={{ uri: item.related_users[0].user_profile || '/api/placeholder/40/40' }}
                    style={styles.userImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.userCountText}>
                    and {item.related_user_count} others
                  </Text>
                </View>
              )}







            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Decline"
                onPress={() => { handleAccept(item.id) }}
                style={{ width: 100, height: 50, backgroundColor: 'red' }}
              />
              <CustomButton
                title="Accept"
                onPress={() => { handleDecline(item.id) }}
                style={{ width: 100, height: 50, }}
              />
            </View>
          </View>
        </View>
      </View >
    );

  }
  return (
    <View style={styles.container}>
      <AppHeader
        backIcon={true}
        title="Group Request"
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
          data={groupRequestData}
          renderItem={renderGroupRequestItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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



          </View>
        </TouchableOpacity>
      </Modal>
    </View>


  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
  },
  relatedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  relatedUser: {
    marginHorizontal: 8,
    alignSelf: 'flex-start',
  },


  logo: {
    width: 100,
    height: 100,
    flexDirection: 'row',
    alignSelf: 'flex-start',

  },
  userCountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: 'blue',
  },
  userCountText: {
    fontSize: 14,
    color: '#555',
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
  topSection: {
    flex: 1,
    flexDirection: 'column', // Align children vertically
    alignItems: 'center', // Center items horizontally
    marginBottom: 10,

  },
  content: {
    flex: 1,
    padding: 16,
  },

  groupLogo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  adminText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    backgroundColor: 'red',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 45,
    marginRight: 24,
    elevation: 5,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#98B9D7',
    backgroundColor: '#FAFBFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  groupName: {
    fontSize: 14,
    width: 150,
    // height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',

  }
});



export default ViewGroupRequestsScreen;
