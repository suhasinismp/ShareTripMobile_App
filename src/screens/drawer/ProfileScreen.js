import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
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
import { yupResolver } from '@hookform/resolvers/yup';
import { UserDetailsScheme } from '../../constants/schema/userDetailsScheme';
import { getProfileByUserId } from '../../services/profileScreenService';
import CustomInput from '../../components/ui/CustomInput';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import RightArrow from '../../../assets/svgs/rightArrow.svg';
import RingtoneScreen from './RingtoneScreen';



const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [userSingleData, setUserSingleData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector(getUserDataSelector);
  const userId = userData?.userId;
  const userToken = userData?.userToken;


  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(UserDetailsScheme),
    defaultValues: {
      [fieldNames.USER_NAME]: '',
      [fieldNames.PHONE_NUMBER]: '',
      [fieldNames.EMAIL]: '',
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

      if (response.error === false && response.data) {
        const data = response?.data;
        setUserSingleData(data)
        // Populate form fields using `reset` from react-hook-form
        reset({
          [fieldNames.USER_NAME]: data.u_name || '',
          [fieldNames.PHONE_NUMBER]: data.u_mob_num || '',
          [fieldNames.EMAIL]: data.u_email_id || '',
        });
      } else {
        Alert.alert('Error', 'Failed to load profile details.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const finalData = {
        id: userId,
        u_name: data[fieldNames.USER_NAME],
        u_mob_num: data[fieldNames.PHONE_NUMBER],
        u_email_id: data[fieldNames.EMAIL],
      };

      const formData = new FormData();
      formData.append('json', JSON.stringify(finalData));

      if (userProfile && userProfile.uri) {
        formData.append('profile', {
          uri: userProfile.uri,
          type: userProfile.type,
          name: userProfile.name,
        });
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.patch(
        'http://ec2-43-204-97-126.ap-south-1.compute.amazonaws.com:7000/share-trip/auth/users',
        formData,
        config
      );

      if (response.data.error === false) {
        Alert.alert('Success', 'Profile updated successfully');
        getUserDetails(); // Fetch updated profile
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error occurred while updating profile:', error.message);
      Alert.alert('Error', 'An error occurred while updating the profile.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title="Profile" />
      <View style={styles.userProfileContainer}>
        <Image
          source={{ uri: userProfile ? userProfile.uri : userSingleData?.u_profile_pic }}
          style={styles.userProfile}
        />
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
      {/* Form Fields */}
      <Controller
        control={control}
        name={fieldNames.USER_NAME}
        render={({ field: { onChange, value } }) => (
          <CustomInput
            placeholder="Enter User Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name={fieldNames.PHONE_NUMBER}
        render={({ field: { onChange, value } }) => (
          <CustomInput
            placeholder="Enter Phone Number"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name={fieldNames.EMAIL}
        render={({ field: { onChange, value } }) => (
          <CustomInput
            placeholder="Enter Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
          />
        )}
      />
      <View style={styles.buttonContainer}>

        <CustomButton
          title="Ringtons"
          style={styles.ringButton}
          onPress={() => navigation.navigate('Ringtones')}
          RightIcon={RightArrow}
        />
        <CustomButton
          title="Save"
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={setUserProfile}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 250,

  },
  saveButton: {
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#005680',
    borderRadius: 4,
    height: 50,
    marginTop: 120,
  },
  ringButton: {
    width: width * 0.3,
    height: 50,
    marginTop: 50,
    alignItems: 'flex-start',
    backgroundColor: 'gray',

  },
});

export default ProfileScreen;
