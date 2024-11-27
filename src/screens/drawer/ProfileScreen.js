import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AppHeader from '../../components/AppHeader';

import { fieldNames } from '../../constants/strings/fieldNames';
import CustomButton from '../../components/ui/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import UploadOptionsModal from '../../components/UploadOptionsModal';
import { getUserDataSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { updateUserProfile } from '../../services/registrationService';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserDetailsScheme } from '../../constants/schema/userDetailsScheme';
import { getProfileByUserId, updateProfile } from '../../services/profileScreenService';
import CustomInput from '../../components/ui/CustomInput';
import CustomText from '../../components/ui/CustomText';

const { width } = Dimensions.get('window');

// const inputFields = [
//   {

//     name: fieldNames.USER_NAME,
//     placeholder: 'Enter Name',
//     keyboardType: 'numeric'
//   },
//   {
//     id: 2,
//     name: fieldNames.PHONE_NUMBER,
//     placeholder: 'Enter Phone Number',
//   },
//   {
//     id: 3,
//     name: fieldNames.EMAIL,
//     placeholder: 'Enter Email',
//   },
// ];

const ProfileScreen = () => {
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const userId = userData?.userId;
  const [userName, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [userProfileData, setUserProfileData] = useState('')
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(UserDetailsScheme),
    defaultValues: {
      [fieldNames.USER_NAME]: 'userName',
      [fieldNames.PHONE_NUMBER]: 'phoneNumber',
      [fieldNames.EMAIL]: 'email',
    },
  });


  useEffect(() => {
    if (userToken && userId) {
      getUserDetails();
    }
  }, [userToken, userId]);

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getProfileByUserId(userToken, userId);
      console.log('API Response:', response); // Debug API response
      if (response.error === false && response.data) {
        const data = response.data;
        setUserName(data.u_name || '');
        setPhoneNumber(data.u_mob_num || '');
        setEmail(data.u_email_id || '');
        setUserProfile(data.u_profile_pic || '');
        setUserProfileData(data)
        // Populate form fields when initial user details are fetched

        reset({
          [fieldNames.USER_NAME]: data.u_name || '',
          [fieldNames.PHONE_NUMBER]: data.u_mob_num || '',
          [fieldNames.EMAIL]: data.u_email_id || '',
        });
      } else {
        console.warn('No data received or error in API response');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleUserProfileUpload = (file) => {
    setUserProfile(file.uri);
    setModalVisible(false);
  };

  // const onSubmit = async (data) => {
  //   const finalData = {
  //     id: userId,
  //     u_name: data.userName,
  //     u_mob_num: data.phoneNumber,
  //     u_email_id: data.email,
  //   };
  //   console.log('www', finalData)
  //   try {
  //     let response = await updateProfile(finalData, userToken);
  //     if (response.error === false) {
  //       setIsEditModeOn(false);
  //       alert('Profile updated successfully');
  //     } else {
  //       console.error('Failed to update profile:', response.message);
  //     }
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   }
  // };

  const onSubmit = async (data) => {
    const finalData = {
      id: userId,
      u_name: data.userName,
      u_mob_num: data.phoneNumber,
      u_email_id: data.email,
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData))
    console.log('userProfile', userProfile)
    formData.append('profileUpload', {
      uri: userProfile,
      type: 'image/jpeg',
      name: ``,

    })
    console.log('sss', formData)
    const response = await updateProfile(formData, userToken);
    console.log({ formData, userToken })
    if (response.error === false) {
      setIsEditModeOn(false);
      alert('Profile updated successfully');
    } else {
      console.error('Failed to update profile:', response.message);
    }
  }


  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title="Profile" />
      <View style={styles.userProfileContainer}>
        {userProfile ? (
          <Image source={{ uri: userProfile ? userProfile : userProfileData?.u_profile_pic }} style={styles.userProfile} />
        ) : (
          <View style={[styles.userProfile, { backgroundColor: '#E0E0E0' }]} />
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color={theme.textColor}
            style={{ marginBottom: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.inputContainer}> */}

      <CustomInput
        placeholder="Enter User Name"
        value={userName}
        onChangeText={setUserName}
      />
      <CustomInput
        placeholder="Enter Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <CustomInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {/* </View> */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Save"
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={handleUserProfileUpload}
        camera={true}
        gallery={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
  },
  userProfileContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 25,
  },
  userProfile: {
    height: 142,
    width: 142,
    borderRadius: 71,
  },
  editButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    elevation: 4,
  },
  inputContainer: {
    marginTop: 20,
    gap: 10,
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 250,
  },
  inputField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,


  },
  saveButton: {
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#005680',
    borderRadius: 4,
    height: 50,
    marginTop: 50,
  },
});

export default ProfileScreen;
