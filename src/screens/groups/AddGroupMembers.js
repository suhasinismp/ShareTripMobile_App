import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, PermissionsAndroid, Platform, Linking } from 'react-native';
import AppHeader from '../../components/AppHeader';
import * as Contacts from 'expo-contacts';
import CustomModal from '../../components/ui/CustomModal';

import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { postUserByPhoneNumber } from '../../services/AddGroupMembersService';

const AddGroupMembers = ({ route }) => {
  const { groupId } = route?.params || 18;
  const [contacts, setContacts] = useState([]);

  const [uiData, setUiData] = useState([]);



  // console.log({ contacts })

  const [isModalVisible, setIsModalVisible] = useState(false)
  const userData = useSelector(getUserDataSelector)
  const userToken = userData.userToken


  useEffect(() => {
    const fetchContacts = async () => {


      let permissionStatus = await Contacts.getPermissionsAsync()

      if (permissionStatus.canAskAgain === true) {
        // console.log('hello')
        const askPermissionStatus = await Contacts.requestPermissionsAsync()

        if (askPermissionStatus.status === 'granted') {
          const { data } = await Contacts.getContactsAsync();
          // console.log({ data })
          setContacts(data);
          handleCreatePostNumberByName(data);
        }
      } else {
        // console.log('hi')
        setIsModalVisible(true)
      }
    };

    fetchContacts();
  }, []);

  const handleCreatePostNumberByName = async (data) => {
    let finalArray = []
    let finalData = contacts.map((contact) => {
      // console.log('xyz', contact)
      let lenthOfArray = contact.phoneNumbers?.length || 0
      // console.log("mon", lenthOfArray)
      for (let i = 0; i < lenthOfArray; i++) {
        finalArray.push(contact.phoneNumbers[i])
        console.log(contact.phoneNumbers[i])
      }
    })

    const response = await postUserByPhoneNumber({ phone_numbers: finalArray }, userToken)
    // console.log({ response })
    if (response?.phone_no) {
      const finalData = {

        userName: response.user_name,
        userPhoneNumber: response.phone_no,
      }
      setUiData(finalData);
    }
  }

  //   const response = await postUserByPhoneNumber({ phone_numbers: finalArray }, usertoken);
  //   if (response?.phone_no) {
  //     const finalData = response.phone_no.map((phone, index) => ({
  //       id: index.toString(),
  //       name: phone.name,   // Example field
  //       phone: phone.number, // Example field
  //     }));
  //     console.log("finalData", finalData)
  //     setUiData(finalData);
  //   }

  // }

  const handlePrimaryAction = () => {
    Linking.openSettings();
    setIsModalVisible(false);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <>
      <AppHeader backIcon={true} title={'Add Group Members'} />
      <View style={styles.container}>
        <FlatList
          data={uiData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <Text style={styles.contactName}>{item.name}</Text>
              {item.emails && item.emails.length > 0 && (
                <Text style={styles.contactEmail}>{item.emails[0].email}</Text>
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
      </View>
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
  contactEmail: {
    fontSize: 14,
    color: '#888',
  },
});

export default AddGroupMembers;


