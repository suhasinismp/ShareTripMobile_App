import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Linking, Image } from 'react-native';
import AppHeader from '../../components/AppHeader';
import * as Contacts from 'expo-contacts';
import CustomModal from '../../components/ui/CustomModal';
import CustomButton from '../../components/ui/CustomButton';
import WhatsappIcon from '../../../assets/svgs/whatsappIcon.svg';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { postSendGroupInvite, postUserByPhoneNumber } from '../../services/AddGroupMembersService';

const AddGroupMembers = ({ route }) => {
  const { groupId } = route?.params;


  const [contacts, setContacts] = useState([]);
  const [uiData, setUiData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  console.log("abc", invitedUsers)

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId

  useEffect(() => {
    const fetchContacts = async () => {
      let permissionStatus = await Contacts.getPermissionsAsync();

      if (permissionStatus.canAskAgain === true) {
        const askPermissionStatus = await Contacts.requestPermissionsAsync();

        if (askPermissionStatus.status === 'granted') {
          const { data } = await Contacts.getContactsAsync();
          setContacts(data);
        }
      } else {
        setIsModalVisible(true);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      handleCreatePostNumberByName(contacts);
    }
  }, [contacts]);

  const handleCreatePostNumberByName = async () => {
    let finalArray = [];

    contacts.forEach((contact) => {
      const lengthOfArray = contact.phoneNumbers?.length || 0;
      for (let i = 0; i < lengthOfArray; i++) {
        finalArray.push(contact.phoneNumbers[i].number);
      }
    });

    const uniqueFinalArray = [...new Set(finalArray)];

    const response = await postUserByPhoneNumber({ phone_numbers: uniqueFinalArray }, userToken);

    let finalData = [];
    response.forEach((item) => {
      if (item?.user_id) {
        finalData.push({
          userName: item.user_name,
          userPhoneNumber: item.phone_no,
          userEmail: item.user_email,
          vehicles: item.vehicles,
          userId: item.user_id,
          userProfilePic: item.user_profile_pic,

        });
      } else {
        contacts.forEach((contact) => {
          if (contact.phoneNumbers) {
            // Safely access contact.phoneNumbers
            const matchedNumber = contact.phoneNumbers.find((numberObject) => numberObject.number === item.phone_no);

            if (matchedNumber) {
              finalData.push({
                userName: contact.name,
                userPhoneNumber: matchedNumber.number,

              });
            }
          }
        });
      }
    });

    setUiData(finalData);
  };

  const handleInvite = async (userId, phoneNumber, groupId) => {
    try {
      const finalData = {
        group_admin_id: userId,
        phone_no: phoneNumber,
        group_id: groupId,
      };
      // console.log('xyz', finalData)
      const response = await postSendGroupInvite(finalData, userToken)
      console.log("xyz", response);
      if (response?.message === 'Invitation sent successfully') {
        setInvitedUsers((prevInvitedUsers) => {
          const updatedInvitedUsers = [...prevInvitedUsers, phoneNumber]
          console.log("mno", updatedInvitedUsers)
          return updatedInvitedUsers;

        })
      } else {
        console.log('Invited:', response);
      }
    } catch (error) {
      console.error('error sending invite', error)
    }
  }

  const handlePrimaryAction = () => {
    Linking.openSettings();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <AppHeader backIcon={true} title={'Add Group Members'} />
      <View style={styles.container}>


        <FlatList
          data={uiData}
          keyExtractor={(item) => item.userPhoneNumber} // Ensure each list item has a unique key
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={styles.profile}>
                {item.userProfilePic && (
                  <Image
                    source={{ uri: item.userProfilePic }}

                    style={{ width: 50, height: 50 }} // Apply custom styles for profile picture
                    resizeMode="cover"
                  />

                )}
                <View style={{ flexDirection: 'column' }}>

                  <Text style={styles.contactName}>{item.userName || 'Unknown User'}</Text>
                  <Text style={styles.contactPhone}>{item.userPhoneNumber}</Text>

                  {!item.userId && (

                    <WhatsappIcon />
                  )}

                </View>
              </View>


              {item.message && <Text style={styles.errorMessage}>{item.message}</Text>}
              {item.vehicles && item.vehicles.length > 0 && (
                <View>
                  <Text>{item.vehicles[0].vehicle_name} - {item.vehicles[0].vehicle_number}</Text>

                  {/* Using FlatList to render images */}
                  <FlatList
                    data={item.vehicles[0].vehicle_images}
                    keyExtractor={(image, index) => index.toString()}
                    horizontal
                    renderItem={({ item: image }) => (
                      <Image
                        source={{ uri: image }}
                        style={{ width: 50, height: 40, alignSelf: 'flex-end' }}
                        resizeMode="contain"
                      />


                    )}
                  />
                </View>

              )}
              {console.log("mon", invitedUsers.includes(item.userPhoneNumber))}
              {item?.userId && (

                <CustomButton
                  title={invitedUsers.includes(item.userPhoneNumber) ? 'Invited' : 'Invite'}
                  onPress={() => handleInvite(userId, item.userPhoneNumber, groupId)}

                  style={{ width: 100, height: 50, alignSelf: 'flex-end' }}
                  disabled={invitedUsers.includes(item.userPhoneNumber)}
                />
              )}

            </View>
          )}

        />
        <CustomModal
          visible={isModalVisible}
          title="Permission Required"
          subtitle="ShareTrip needs access to your contacts. Please enable contact access in app settings."
          primaryButtonText="Open Settings"
          secondaryButtonText="Cancel"
          onPrimaryAction={handlePrimaryAction}
          onSecondaryAction={handleCancel}
        />
      </View >
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',


  },
  contactPhone: {
    fontSize: 14,
  },
  errorMessage: {
    fontSize: 12,
    color: 'red',
  },
  profile:
  {

    flexDirection: 'row',

  }
});

export default AddGroupMembers;
