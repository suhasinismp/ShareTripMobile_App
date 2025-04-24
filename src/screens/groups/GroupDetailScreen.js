import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MenuIcon from '../../../assets/svgs/menu.svg';
import AppHeader from '../../components/AppHeader';
import UploadOptionsModal from '../../components/UploadOptionsModal';
import { fieldNames } from '../../constants/strings/fieldNames';
import {
  deleteGroup,
  deleteGroupUser,
  exitGroup,
  getGroupUserDetailsById,
  updateGroup,
  updateUserAdminStatus,
} from '../../services/groupsService';
import { useTheme } from '../../hooks/useTheme';
import { getUserDataSelector } from '../../store/selectors';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomText from '../../components/ui/CustomText';
import { yupResolver } from '@hookform/resolvers/yup';
import { groupScheme } from '../../constants/schema/groupScheme';
import EditGroup from '../../../assets/svgs/editGroup.svg';
import DeleteGroup from '../../../assets/svgs/deleteGroup.svg';
import ExitGroupIcon from '../../../assets/svgs/exitGroup.svg';
import AddNewMember from '../../../assets/svgs/addnewMember.svg';
import CustomModal from '../../components/ui/CustomModal';
import ModalProfileIcon from '../../../assets/svgs/modalProfile.svg';

const inputFields = [
  {
    id: 1,
    name: fieldNames.GROUP_NAME,
    placeholder: 'Enter Group Name',
    fieldType: 'input',
    multiLine: false,
  },
  {
    id: 2,
    name: fieldNames.GROUP_DESCRIPTION,
    placeholder: 'Group Description',
    fieldType: 'input',
    multiLine: true,
  },
];

const GroupDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { groupImage, groupId, groupName, groupDescription } = route.params;

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [groupLogo, setGroupLogo] = useState(groupImage);

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(null);
  const [isEditMenuVisible, setIsEditMenuVisible] = useState(false);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [adminId, setAdminId] = useState([]);

  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(groupScheme),
    defaultValues: {
      [fieldNames.GROUP_NAME]: groupName,
      [fieldNames.GROUP_DESCRIPTION]: groupDescription,
    },
  });

  useEffect(() => {
    fetchGroupMembers();
  }, []);

  // const fetchGroupMembers = async () => {
  //   try {
  //     const response = await getGroupUserDetailsById(groupId, userToken);
  //     const members = response?.data || [];

  //     const admins = members
  //       .filter((member) => member.is_admin)
  //       .map((member) => member.user_id);
  //     setAdminId(admins);
  //     setGroupMembers(response?.data);
  //   } catch (error) {
  //     console.error('Error fetching group members:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchGroupMembers = async () => {
    try {
      const response = await getGroupUserDetailsById(groupId, userToken);
      console.log('Group members response:', response); // Add logging

      // Validate response data
      if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response data:', response);
        setGroupMembers([]);
        return;
      }

      // Filter out any invalid member data
      const validMembers = response.data.filter(member =>
        member && member.user_id && member.User
      );

      console.log('Valid members:', validMembers); // Add logging

      const admins = validMembers
        .filter((member) => member.is_admin)
        .map((member) => member.user_id);

      setAdminId(admins);
      setGroupMembers(validMembers);
    } catch (error) {
      console.error('Error fetching group members:', error);
      setGroupMembers([]);
    } finally {
      setLoading(false);
    }
  };
  const updateAdminStatus = async ({ recordId, groupId, userId, status }) => {
    const finalData = {
      id: recordId,
      groups_id: groupId,
      user_id: userId,
      is_admin: status,
    };
    console.log('Data being sent:', finalData);  // Log the data to be sent

    const response = await updateUserAdminStatus(finalData, userToken);
    console.log("API Response:", response); // Log the response

    if (response && response.includes(1)) {
      setIsMenuVisible(null);
      fetchGroupMembers();
    } else {
      console.error("Failed to update admin status:", response); // Log failure response
    }
  };


  const handleDelete = async ({ groupId, userId }) => {
    const response = await deleteGroupUser(userToken, userId, groupId);
    console.log('ttt', response)
    if (response?.message === 'User successfully removed from the group') {
      setIsMenuVisible(null);
      fetchGroupMembers();
    }
  };

  const handleLogoUpload = (file) => {
    setGroupLogo(file.uri);
    setModalVisible(false);
  };

  const handleEditLogo = () => {
    setModalVisible(true);
  };

  const renderField = (field) => (
    <CustomTextInput
      key={field.id}
      name={field.name}
      placeholder={field.placeholder}
      multiLine={field.multiLine}
      control={control}
    />
  );

  const renderRightIcon = () => (
    <TouchableOpacity onPress={toggleMenu}>
      <MenuIcon width={24} height={24} fill="#000000" />
    </TouchableOpacity>
  );



  const handleMenuOption = (option) => {
    setIsMenuVisible(false);

    if (option === 'editGroup') {
    }
    if (option === 'deleteGroup') {
    }
  };

  const handleMenuDelete = () => {
    setIsDeleteModalVisible(true);
  };

  // const handleSave = async (data) => {
  //   const finalData = {
  //     id: groupId,
  //     group_name: data.groupName,
  //     group_details: data.groupDescription,
  //   };

  //   const formData = new FormData();
  //   formData.append('json', JSON.stringify(finalData));

  //   const response = await updateGroup(formData, userToken);

  //   if (response?.error === false) {
  //     setIsEditModeOn(false);
  //     setIsEditMenuVisible(false); // Show edit menu on success
  //   } else {
  //     console.error('Failed to update group:', response.message);
  //   }
  // };


  const handleSave = async (data) => {
    try {
      setIsSaving(true);
      const finalData = {
        id: groupId,
        group_name: data[fieldNames.GROUP_NAME],
        group_details: data[fieldNames.GROUP_DESCRIPTION],
      };

      const formData = new FormData();
      formData.append('json', JSON.stringify(finalData));

      const response = await updateGroup(formData, userToken);
      console.log('Update group response:', response);

      if (response?.error === false) {
        // Update local state with new values
        setValue(fieldNames.GROUP_NAME, data[fieldNames.GROUP_NAME]);
        setValue(fieldNames.GROUP_DESCRIPTION, data[fieldNames.GROUP_DESCRIPTION]);

        setIsEditModeOn(false);
        setIsEditMenuVisible(false);

        // Navigate back to refresh the group details
        navigation.navigate('Groups', { refresh: Date.now() });
      } else {
        Alert.alert('Error', response?.message || 'Failed to update group');
      }
    } catch (error) {
      console.error('Update group error:', error);
      Alert.alert('Error', error?.message || 'Failed to update group');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await deleteGroup(groupId, userToken);
      console.log('Delete group response:', response);

      if (response?.message === 'Successfully delete the Group') {
        setIsDeleteModalVisible(false);
        setIsEditMenuVisible(false);
        // Force a refresh of the groups list before navigating back
        navigation.navigate('Groups', { refresh: Date.now() });
      } else {
        Alert.alert('Error', 'Failed to delete group');
      }
    } catch (error) {
      console.error('Delete group error:', error);
      Alert.alert('Error', error?.message || 'Failed to delete group');
    }
  };

  // const handleExitGroup = async () => {
  //   const response = await exitGroup(userId, groupId, userToken);

  //   if (response.message === 'Successfully exit the Group') {
  //     navigation.goBack();
  //   }
  // };
  const handleExitGroup = async () => {
    try {
      const response = await exitGroup(userId, groupId, userToken);
      console.log('Exit group response:', response);

      if (response?.message === 'Successfully exit the Group') {
        // Clear any local state if needed
        setGroupMembers([]);
        setAdminId([]);

        // Navigate back to Groups screen with refresh parameter
        navigation.navigate('Groups', { refresh: Date.now() });
      } else {
        Alert.alert('Error', 'Failed to exit group');
      }
    } catch (error) {
      console.error('Exit group error:', error);
      Alert.alert('Error', error?.message || 'Failed to exit group');
    }
  };

  const handleAddmember = async () => {
    navigation.navigate('AddGroupMembers', { groupId });
  };

  const toggleMenu = () => setIsEditMenuVisible(!isEditMenuVisible);

  const renderMemberItem = ({ item, index }) => {
    const username = item?.User?.u_name;
    const userProfilePic = item?.User?.u_profile_pic;
    const userMobileNum = item?.User?.u_mob_num;

    if (item?.is_admin) {
      adminId.push(item?.user_id);
    }

    return (
      <View style={styles.memberItem}>
        <Image
          source={{ uri: userProfilePic || 'https://via.placeholder.com/150' }}
          style={styles.memberImage}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text style={styles.memberName}>{username}</Text>
          <Text style={styles.memberMobile}>{userMobileNum}</Text>

          {item.is_admin && <Text>Admin</Text>}

          <>
            {adminId.includes(userId) && item.user_id != userId && (
              <TouchableOpacity
                onPress={() => {
                  setIsMenuVisible((prevIndex) =>
                    prevIndex === index ? null : index,
                  );
                }}
              >
                <MenuIcon style={styles.menuIcon} />
              </TouchableOpacity>
            )}
            {isMenuVisible === index && (
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    updateAdminStatus({
                      recordId: item?.id,
                      groupId: groupId,
                      userId: item?.user_id,
                      status: !item?.is_admin,
                    });
                  }}
                >
                  <Text>
                    {item?.is_admin ? 'remove as admin' : 'make as admin'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    handleDelete({ groupId: groupId, userId: item?.user_id });
                  }}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        backIcon={true}
        title="Group Details"
        rightIconComponent={
          adminId.includes(userId) ? renderRightIcon() : false
        }
      />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
      >
        <Modal
          visible={isEditMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleMenu}
        >
          <TouchableOpacity style={styles.modalOverlays} onPress={toggleMenu}>
            <View style={styles.menuContain}>
              <TouchableOpacity
                style={styles.menuItems}
                onPress={() => {
                  setIsEditModeOn(true);
                  setIsEditMenuVisible(false);
                }}
              >
                <CustomText variant="body" text="Edit Group" />
                <EditGroup />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItems}
                onPress={() => setIsDeleteModalVisible(true)}
              >
                <CustomText variant="body" text="Delete Group" />
                <DeleteGroup />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.logoContainer}>
          {groupLogo ? (
            <Image source={{ uri: groupLogo }} style={styles.groupLogo} />
          ) : (
            <View style={[styles.groupLogo, { backgroundColor: '#E0E0E0' }]} />
          )}
          <TouchableOpacity style={styles.editButton} onPress={handleEditLogo}>
            <Ionicons name="camera-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        {isEditModeOn ? (
          inputFields.map(renderField)
        ) : (
          <>
            <Text>{groupName}</Text>
            <Text>{groupDescription}</Text>
          </>
        )}
        {/* <TouchableOpacity style={styles.save} onPress={isEditModeOn ? handleSubmit(handleSave) : handleExitGroup}
                >
                    <CustomText
                        variant="body"
                        text={isEditModeOn ? "Save" : "Exit Group"}

                    />

                    <ExitGroupIcon />


                </TouchableOpacity> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Members :{groupMembers?.length}</Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              paddingRight: 40,
            }}
            onPress={() => handleAddmember('addnewMember')}
          >
            <AddNewMember style={{ marginRight: 10 }} />
            <CustomText
              variant="body"
              text="Add new Member"
              textStyle={{ color: 'red' }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.memberListContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primaryColor} />
          ) : (
            <FlatList
              data={groupMembers}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </KeyboardAwareScrollView>

      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={handleLogoUpload}
        camera
        gallery
      />

      {/* <TouchableOpacity
        style={styles.menu}
        onPress={isEditModeOn ? handleSubmit(handleSave) : handleExitGroup}
      >
        <CustomText
          variant="body"
          text={isEditModeOn ? 'Save' : 'ExitGroup'}
          textStyle={{ color: 'red' }}
        />
        {isEditModeOn ? null : <ExitGroupIcon style={{ marginLeft: 8 }} />}
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.menu}
        onPress={isEditModeOn ? handleSubmit(handleSave) : handleExitGroup}
        disabled={isSaving}
      >
        <CustomText
          variant="body"
          text={isEditModeOn ? (isSaving ? 'Saving...' : 'Save') : 'ExitGroup'}
          textStyle={{ color: 'red' }}
        />
        {isEditModeOn ? null : <ExitGroupIcon style={{ marginLeft: 8 }} />}
      </TouchableOpacity>
      <CustomModal
        visible={isDeleteModalVisible}
        title="Delete Group"
        subtitle="Are you sure you want to delete this Group? this action cannot be undone."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<ModalProfileIcon />}
        onPrimaryAction={handleDeleteGroup}
        onSecondaryAction={() => {
          setIsDeleteModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuIcon: {
    alignSelf: 'flex-end',
  },
  scrollView: { flex: 1 },
  contentContainer: { flexGrow: 1, padding: 20 },
  logoContainer: { alignSelf: 'center', marginBottom: 20 },
  groupLogo: { height: 142, width: 142, borderRadius: 71 },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  memberListContainer: { marginTop: 20, marginBottom: 60 },
  memberItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  memberImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  memberName: { fontSize: 16, fontWeight: 'bold' },
  memberMobile: { fontSize: 14, color: 'gray' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    flex: 1,
    zIndex: 5,
    bottom: 30,
    right: 20,
  },
  menuItems: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  menuContain: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 45,
    marginRight: 24,
    elevation: 5,
  },
  modalOverlays: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  save: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    right: 30,
  },
});

export default GroupDetailScreen;
