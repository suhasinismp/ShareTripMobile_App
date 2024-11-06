import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import * as Contacts from 'expo-contacts';

import AppHeader from '../../../components/AppHeader';
import { getUserDataSelector } from '../../../store/selectors';

import WhatsappIcon from '../../../../assets/svgs/whatsappIcon.svg';
import { createPost } from '../../../services/postTripService';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../../components/ui/CustomButton';
import { postUserByPhoneNumber } from '../../../services/addGroupMembersService';


const SelectContactScreen = ({ route }) => {
  const { finalData, recordedAudioUri } = route.params;
  const navigation = useNavigation();

  const [contacts, setContacts] = useState([]);
  const [uiData, setUiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sentContacts, setSentContacts] = useState([]);

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        setContacts(data);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      handleCreatePostNumberByName();
    }
  }, [contacts]);

  const handleContactSelection = async (contact) => {
    const updatedFinalData = {
      ...finalData,
      post_type_value: JSON.stringify([contact.userId]),
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(updatedFinalData));

    if (recordedAudioUri) {
      const filename = recordedAudioUri.split('/').pop();
      formData.append('voiceMessage', {
        uri: recordedAudioUri,
        type: 'audio/m4a',
        name: filename,
      });
    }

    try {
      const response = await createPost(formData, userToken);

      if (
        response?.message === 'Post Booking Data created successfully' &&
        response?.error === false
      ) {
        setSentContacts([...sentContacts, contact.userPhoneNumber]);
        if (selectedContacts.length === uiData.length - 1) {
          navigation.navigate('Home');
        }
      } else {
        alert(response?.message || 'Failed to send. Please try again.');
      }
    } catch (error) {
      console.error('Error sending post:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCreatePostNumberByName = async () => {
    const phoneNumbers = contacts.flatMap(
      (contact) => contact.phoneNumbers?.map((phone) => phone.number) || [],
    );
    const uniquePhoneNumbers = [...new Set(phoneNumbers)];

    try {
      const response = await postUserByPhoneNumber(
        { phone_numbers: uniquePhoneNumbers },
        userToken,
      );

      const finalData = response?.map((item) => {
        if (item?.user_id) {
          return {
            userName: item.user_name,
            userPhoneNumber: item.phone_no,
            userId: item.user_id,
            userProfilePic: item.user_profile_pic,
            vehicles: item.vehicles,
          };
        } else {
          const contact = contacts.find((c) =>
            c.phoneNumbers?.some((phone) => phone.number === item.phone_no),
          );
          return {
            userName: contact?.name || 'Unknown User',
            userPhoneNumber: item.phone_no,
            isWhatsApp: true,
          };
        }
      });

      setUiData(finalData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to fetch contacts. Please try again.');
    }
  };

  const filteredData = uiData?.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userPhoneNumber.includes(searchQuery),
  );

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      {item?.userId != (undefined || null) && (
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <Image
              source={{
                uri: item.userProfilePic || 'https://via.placeholder.com/50',
              }}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.driverName}>{item.userName}</Text>
              <Text style={styles.driverPhone}>{item.userPhoneNumber}</Text>
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>
                {item?.vehicles[0]?.vehicle_name}
              </Text>
              <Text style={styles.vehicleNumber}>
                {item?.vehicles[0]?.vehicle_number}
              </Text>
            </View>
          </View>
          <View style={styles.vehicleImagesContainer}>
            {item?.vehicles[0]?.vehicle_images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.vehicleImage}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              sentContacts.includes(item.userPhoneNumber) && styles.sentButton,
            ]}
            onPress={() => handleContactSelection(item)}
            disabled={sentContacts.includes(item.userPhoneNumber)}
          >
            <Text style={styles.sendButtonText}>
              {sentContacts.includes(item.userPhoneNumber) ? 'Sent' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {item?.isWhatsApp === true && (
        <View style={styles.contactInfo}>
          <Image
            source={{
              uri: item.userProfilePic || 'https://via.placeholder.com/50',
            }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contactName}>{item.userName}</Text>
            <Text style={styles.contactPhone}>{item.userPhoneNumber}</Text>
          </View>
          <WhatsappIcon width={24} height={24} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title={'Contacts'} />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone number"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.userPhoneNumber}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancel"
            variant="text"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
          <CustomButton
            title="Go To Home"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  driverCard: {
    padding: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  vehicleInfo: {
    alignItems: 'flex-end',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleNumber: {
    fontSize: 14,
    color: '#666',
  },
  vehicleImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vehicleImage: {
    width: '23%',
    aspectRatio: 4 / 3,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: '#005680',
    paddingVertical: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sentButton: {
    backgroundColor: '#888',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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

export default SelectContactScreen;
