import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomInput from '../../components/ui/CustomInput';
import { fieldNames } from '../../constants/strings/fieldNames';
import CustomTextInput from '../../components/ui/CustomTextInput';
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
import { getProfileByUserId } from '../../services/profileScreenService';

const { width } = Dimensions.get('window');

const inputFields = [
  {
    id: 1,
    name: fieldNames.USER_NAME,
    placeholder: 'Enter Name',
    fieldType: 'input',
    multiLine: false,
  },
  ,
  {
    id: 2,
    name: fieldNames.PHONE_NUMBER,
    placeholder: 'Enter phone number',
    fieldType: 'input',
    multiLine: false,
  },
  {
    id: 3,
    name: fieldNames.EMAIL,
    placeholder: 'Enter Email',
    fieldType: 'input',
    multiLine: false,
  },
];

const ProfileScreen = () => {
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const userId = userData?.userId;
  const [initialUserDetails, setInitialUserDetails] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(UserDetailsScheme),
    defaultValues: {
      [fieldNames.USER_NAME]: 'nandini',
      [fieldNames.PHONE_NUMBER]: '9731214801',
      [fieldNames.EMAIL]: 'suhasini@ganakalabs.com',
    },
  });

  useEffect(() => {
    getUserDetails()
   
  }, [userToken, userId])

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getProfileByUserId(userToken, userId);
     
      if (response.error === false && response.data) {
        setInitialUserDetails(response.data);
      } else {
        setInitialUserDetails(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialUserDetails) {
      reset({
        [fieldNames.USER_NAME]: initialUserDetails.u_name || '',
        [fieldNames.PHONE_NUMBER]: initialUserDetails.u_mob_num || '',
        [fieldNames.EMAIL]: initialUserDetails.u_email_id || '',
      });
      if (initialUserDetails.u_profile_pic) {
        setUserProfile([initialUserDetails.u_profile_pic]);
      }
    }
  }, [initialUserDetails, reset]);

  const handleUserProfileUpload = (file) => {
    setUserProfile(file.uri);
    setModalVisible(false);
  };

  const handleEditUserProfile = () => {};

  const onSubmit = async (data) => {
    if (
      !data.userName &&
      !data.phone &&
      !data.email &&
      profilePic.length === 0
    ) {
      navigate();
    } else {
      const finalData = {
        user_id: userId,
        u_name: data.userName,
        u_email_id: data.phone,
        u_mob_num: data.email,
      };
      try {
        let response;
        if (initialUserDetails) {
          response = await updateUserProfile(finalData, userToken, userProfile);
        } else
         
        if (response && response.error === false) {
          setIsEditModeOn(false);
        } else {
          console.error('Failed to update Profile:', response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title="Profile" />
      <View style={styles.userProfileContainer}>
        {/* {userProfile ? (
          <Image source={{ uri: userProfile }} style={styles.userProfile} />
        ) : (
          <View style={[styles.userProfile, { backgroundColor: '#E0E0E0' }]} />
        )} */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditUserProfile}
        >
          <Ionicons name="camera-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {inputFields.map((item) => (
          <CustomInput
            key={item.id}
            control={control}
            name={item.name}
            placeholder={item.placeholder}
            secureTextEntry={item.secureTextEntry}
          />
        ))}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Save"
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
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
  profileContainer: {
    alignItems: 'center', // Center content horizontally
    padding: 20,
    marginTop: 50,
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
  },
  sectionContainer: {
    marginTop: 16,
    marginVertical: 10,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  saveButton: {
    width: width * 0.3,
    alignItems: 'center',
    backgroundColor: '#005680',
    borderRadius: 4,
    marginRight: 10,
    height: 50,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 4,
    gap: 10,
    flex: 1,
    width: '97%',
  },

  input: {
    width: '50%',
    alignSelf: 'center',
    paddingHorizontal: 10, // Added padding to avoid text touching edges
    marginVertical: 10,
  },
});

export default ProfileScreen;
