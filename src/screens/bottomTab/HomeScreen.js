import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchUserMetaData } from '../../services/signinService';
import { getUserDataSelector } from '../../store/selectors';

import { useNavigation } from '@react-navigation/native';
import ModalProfileIcon from '../../../assets/svgs/modalProfile.svg';
import CustomModal from '../../components/ui/CustomModal';
import AppHeader from '../../components/AppHeader';
import AddPostIcon from '../../../assets/svgs/addPost.svg';

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  useEffect(() => {
    getUserMetaData();
  }, [userId, userToken]);

  const getUserMetaData = async () => {
    const response = await fetchUserMetaData(userId, userToken);

    if (
      response.userStatuses.vehicleStatusExists == false ||
      response.userStatuses.vehicleDocStatusExists == false ||
      response.userStatuses.userDocStatusExists == false ||
      response.userStatuses.userBusinessStatusExists === false ||
      response.userStatuses.userSubscriptionStatusExists == false
    ) {
      setIsModalVisible(true);
    }
  };

  const handlePrimaryAction = () => {
    setIsModalVisible(false);
    navigation.openDrawer();
  };

  const handleAddPost = () => {
    navigation.navigate('PostTrip');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <View style={styles.content}></View>
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
        <AddPostIcon />
      </TouchableOpacity>
      <CustomModal
        visible={isModalVisible}
        title="Complete Your profile"
        // subtitle="Upload your documents to boost your visibility and build trust with fellow drivers!"
        primaryButtonText="Upload Documents"
        secondaryButtonText="Cancel"
        icon={<ModalProfileIcon />}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={() => {
          setIsModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});

export default HomeScreen;
