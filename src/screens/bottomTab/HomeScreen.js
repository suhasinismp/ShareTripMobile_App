import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchUserMetaData } from '../../services/signinService';
import { getUserDataSelector } from '../../store/selectors';
import {
  fetchPostsByUserId,
  sendPostRequest,
} from '../../services/homeService';
import { showSnackbar } from '../../store/slices/snackBarSlice';

// Components
import PostCard from '../../components/PostCard';
import CustomModal from '../../components/ui/CustomModal';
import AppHeader from '../../components/AppHeader';

// Assets
import ModalProfileIcon from '../../../assets/svgs/modalProfile.svg';
import AddPostIcon from '../../../assets/svgs/addPost.svg';
import { getAllVehiclesByUserId } from '../../services/vehicleDetailsService';

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours.toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

export const handleCall = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
    console.error('An error occurred', err),
  );
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);

  // State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPostsData, setUserPostsData] = useState([]);

  const [userVehicles, setUserVehicles] = useState([]);

  // Constants from userData
  const userId = userData.userId;
  const userToken = userData.userToken;

  useEffect(() => {
    getUserMetaData();
  }, [userId, userToken]);

  useFocusEffect(
    useCallback(() => {
      getUserPosts();

      const intervalId = setInterval(() => {
        getUserPosts();
      }, 60000);

      return () => {
        clearInterval(intervalId);
      };
    }, [userId, userToken]),
  );

  useEffect(() => {
    getUserVehicles();
  }, [userId, userToken]);

  const getUserMetaData = async () => {
    const response = await fetchUserMetaData(userId, userToken);

    if (
      response.userStatuses.vehicleStatusExists === false ||
      response.userStatuses.vehicleDocStatusExists === false ||
      response.userStatuses.userDocStatusExists === false ||
      response.userStatuses.userBusinessStatusExists === false ||
      response.userStatuses.userSubscriptionStatusExists === false
    ) {
      setIsModalVisible(true);
    }
  };

  const getUserVehicles = async () => {
    const response = await getAllVehiclesByUserId(userToken, userId);
    setUserVehicles(response.data);
  };

  const getUserPosts = async () => {
    setIsLoading(true);
    const response = await fetchPostsByUserId(userId, userToken);

    if (response?.error === false) {
      const filteredPosts = response?.data.filter(
        (post) =>
          post.post_status === ('Available' || 'available') ||
          post.post_status === ('Closed' || 'closed'),
      );
      setUserPostsData(filteredPosts);
    }
    setIsLoading(false);
  };

  const handleRequestClick = async (postId, userId, postedUserId) => {
    const finalData = {
      post_bookings_id: postId,
      accepted_user_id: userId,
      vehicle_id: userVehicles[0].st_vehicles_id,
      posted_user_id: postedUserId,
    };
    const response = await sendPostRequest(finalData, userToken);
    if (response?.confirm_status === 'Accepted') {
      dispatch(
        showSnackbar({
          message:
            'Request sent successfully. You can track the status in MyTrips',
          type: 'success',
        }),
      );
      await getUserPosts();
    }
  };

  const handlePrimaryAction = () => {
    setIsModalVisible(false);
    navigation.openDrawer();
  };

  const handleAddPost = () => {
    navigation.navigate('PostTrip');
  };

  const renderPostCard = ({ item }) => (
    <PostCard
      // Card Header Props
      bookingType={item?.bookingType_name}
      createdAt={formatDate(item?.created_at)}
      postStatus={item?.post_status}
      // User Info Props
      userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
      userName={item?.User_name}
      postSharedWith={
        item?.post_type_id === 1
          ? 'Public'
          : item?.post_type_id === 2
            ? 'Group'
            : 'You'
      }
      // Trip Details Props
      pickUpTime={item?.pick_up_time}
      fromDate={item?.from_date}
      vehicleType={item?.Vehicle_type}
      vehicleName={item?.Vehicle_name}
      pickUpLocation={item?.pick_up_location}
      destination={item?.destination}
      // Comment/Voice Props
      postComments={item?.post_comments}
      postVoiceMessage={item?.post_voice_message}
      // Amount Props
      baseFareRate={item?.bookingTypeTariff_base_fare_rate}
      // Action Props
      onRequestPress={() =>
        handleRequestClick(item?.post_booking_id, userId, item?.posted_user_id)
      }
      onCallPress={() => handleCall(item?.User?.u_mob_num)}
      onPlayPress={() => {
        /* TODO: Implement voice message playback */
      }}
      onMessagePress={() => {
        /* TODO: Implement messaging */
      }}
      isRequested={item?.request_status}
      packageName={item?.bookingTypePackage_name}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005680" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />

      <FlatList
        data={userPostsData}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.post_booking_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
        <AddPostIcon />
      </TouchableOpacity>

      <CustomModal
        visible={isModalVisible}
        title="Complete Your Profile"
        subtitle="Complete Your Profile To Boost Your Visibility And Build Trust With Fellow Drivers!"
        primaryButtonText="Go To Profile"
        secondaryButtonText="Cancel"
        icon={<ModalProfileIcon />}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  listContainer: {
    padding: 10,
    gap: 10,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});

export default HomeScreen;
