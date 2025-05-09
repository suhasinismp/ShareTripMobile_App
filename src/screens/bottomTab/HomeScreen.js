
import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  RefreshControl,
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
import { Audio } from 'expo-av';

// Assets
import ModalProfileIcon from '../../../assets/svgs/modalProfile.svg';
import AddPostIcon from '../../../assets/svgs/addPost.svg';
import { getAllVehiclesByUserId } from '../../services/vehicleDetailsService';
import { formatDate } from '../../utils/formatdateUtil';
import { getOnlineStatusSelector, getShowOnlyAvailableSelector } from '../../store/selectors';
import { setShowOnlyAvailable } from '../../store/slices/statusOnlineSlice';
// import { getRingToneScreen } from '../../services/ringtoneScreenService';

export const handleCall = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
    console.error('An error occurred', err),
  );
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const showOnlyAvailable = useSelector(getShowOnlyAvailableSelector);

  // State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userPostsData, setUserPostsData] = useState([]);
  const [ringTone, setRingTone] = useState()

  const [userVehicles, setUserVehicles] = useState([]);

  // Constants from userData
  const userId = userData.userId;
  const userToken = userData.userToken;

  useEffect(() => {
    if (userId && userToken) {
      getUserMetaData();
    }
  }, [userId, userToken]);

  useFocusEffect(
    useCallback(() => {
      getUserPosts();

      const intervalId = setInterval(() => {
        getUserPosts();
      }, 20000);

      return () => {
        clearInterval(intervalId);
      };
    }, [userId, userToken, showOnlyAvailable]),
  );

  useEffect(() => {
    if (userId && userToken) {
      getUserVehicles();
    }
  }, [userId, userToken]);


  // useEffect(() => {
  //   getRingTones();
  // }, [])


  const getUserMetaData = async () => {
    const response = await fetchUserMetaData(userId, userToken);
    // const ringtoneResponse = await getCurrentRingtone

    if (
      response?.userStatuses?.vehicleStatusExists === false ||
      response?.userStatuses?.vehicleDocStatusExists === false ||
      response?.userStatuses?.userDocStatusExists === false ||
      response?.userStatuses?.userBusinessStatusExists === false ||
      response?.userStatuses?.userSubscriptionStatusExists === false
    ) {
      setIsModalVisible(true);
    }
  };

  // const getRingTones = async () => {
  //   const response = await getRingToneScreen(userId, userToken);

  //   if (response) {
  //     setRingTone(response.data);
  //   }
  // }

  const getUserVehicles = async () => {
    const response = await getAllVehiclesByUserId(userToken, userId);
    setUserVehicles(response.data);
  };

  // const getUserPosts = async () => {
  //   setIsLoading(true);
  //   const response = await fetchPostsByUserId(userId, userToken);

  //   if (response?.error === false) {
  //     const filteredPosts = response?.data.filter(
  //       (post) =>
  //         post.post_status === ('Available' || 'available') ||
  //         post.post_status === ('Closed' || 'closed'),
  //     );
  //     setUserPostsData(filteredPosts);
  //   }
  //   setIsLoading(false);
  // };

  useEffect(() => {
    if (userId && userToken) {
      getUserPosts();
    }
  }, [showOnlyAvailable]);

  const getUserPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPostsByUserId(userId, userToken);

      if (response?.error === false) {
        const filteredPosts = response?.data.filter((post) => {
          const status = post.post_status?.toLowerCase() || '';
          if (showOnlyAvailable) {
            return status === 'available';
          }
          return status === 'available' || status === 'closed';
        });
        setUserPostsData(filteredPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlineStatusToggle = () => {
    dispatch(setShowOnlyAvailable(!showOnlyAvailable));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getUserPosts();

    } catch (error) {
      console.error('Error refreshing data:', error);
      dispatch(
        showSnackbar({
          message: 'Failed to refresh. Please try again.',
          type: 'error',
        }),
      );
    } finally {
      setRefreshing(false);
    }
  }, [userId, userToken]);



  const handleRequestClick = async (postId, userId, postedUserId, vehicleId, bookingType) => {
    const finalData = {
      post_bookings_id: postId,
      accepted_user_id: userId,
      vehicle_id: vehicleId,
      posted_user_id: postedUserId,
    };

    const response = await sendPostRequest(finalData, userToken);

    if (response?.confirm_status === 'Quoted') {
      dispatch(
        showSnackbar({
          message: 'Request sent successfully. You can track the status in MyTrips',
          type: 'success',
        }),
      );

      navigation.navigate('MyTrips', {
        filterOne: 'InProgress',
        filterTwo: 'PostedTrips',
        bookingType: bookingType, // Pass the booking type
        fromBooking: true // Add this flag
      });
    }
  };

  const handlePrimaryAction = () => {
    setIsModalVisible(false);
    navigation.openDrawer();
  };

  const handleAddPost = () => {
    navigation.navigate('PostTrip');
  };



  // const renderPostCard = ({ item }) => {


  //   return (
  //     <PostCard
  //       // Card Header Props
  //       bookingType={item?.bookingType_name}
  //       createdAt={formatDate(item?.created_at)}
  //       postStatus={item?.post_status}
  //       // User Info Props
  //       userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
  //       userName={item?.User_name}
  //       postSharedWith={
  //         item?.post_type_id === 1
  //           ? 'Public'
  //           : item?.post_type_id === 2
  //             ? item?.group_name
  //             : 'You'
  //       }


  //       fromDate={item?.from_date || ''}
  //       vehicleType={item?.Vehicle_type_name}

  //       vehicleName={item?.Vehicle_name}
  //       pickUpTime={item?.pick_up_time || ''}
  //       numberOfDays={item?.no_of_days || ''}
  //       pickUpLocation={item?.pick_up_location}
  //       destination={item?.destination}
  //       // Comment/Voice Props
  //       postComments={item?.post_comments}
  //       postVoiceMessage={item?.post_voice_message}
  //       // Amount Props
  //       baseFareRate={item?.bookingTypeTariff_base_fare_rate}
  //       extrakms={item?.bookingTypeTariff_extra_km_rate}
  //       // Action Props
  //       onRequestPress={() =>
  //         handleRequestClick(
  //           item?.post_booking_id,
  //           userId,
  //           item?.posted_user_id,
  //           userVehicles[0]?.st_vehicles_id,
  //         )
  //       }
  //       onCallPress={() => handleCall(item?.User_phone)}
  //       onTripSheetPress={() => {
  //         navigation.navigate('ViewTripSheet', {
  //           from: 'home',
  //           postId: item?.post_booking_id,
  //         });
  //       }}
  //       isRequested={item?.request_status || false}
  //       packageName={item?.bookingTypePackage_name || ''}
  //     />
  //   );
  // }
  const renderPostCard = ({ item }) => {
    return (
      <PostCard
        // Card Header Props
        bookingType={item?.bookingType_name?.toString() || ''}
        createdAt={formatDate(item?.created_at) || ''}
        postStatus={item?.post_status?.toString() || ''}
        // User Info Props
        userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
        userName={item?.User_name?.toString() || ''}
        postSharedWith={
          item?.post_type_id === 1
            ? 'Public'
            : item?.post_type_id === 2
              ? item?.group_name?.toString()
              : 'You'
        }
        fromDate={item?.from_date?.toString() || ''}
        vehicleType={item?.Vehicle_type_name?.toString() || ''}
        vehicleName={item?.Vehicle_name?.toString() || ''}
        pickUpTime={item?.pick_up_time?.toString() || ''}
        numberOfDays={item?.no_of_days?.toString() || ''}
        pickUpLocation={item?.pick_up_location?.toString() || ''}
        destination={item?.destination?.toString() || ''}
        // Comment/Voice Props
        postComments={item?.post_comments?.toString() || ''}
        postVoiceMessage={item?.post_voice_message?.toString() || ''}
        // Amount Props
        baseFareRate={item?.bookingTypeTariff_base_fare_rate?.toString() || ''}
        extrakms={item?.bookingTypeTariff_extra_km_rate?.toString() || ''}
        // Action Props
        onRequestPress={() =>
          handleRequestClick(
            item?.post_booking_id,
            userId,
            item?.posted_user_id,
            userVehicles[0]?.st_vehicles_id,
          )
        }
        onCallPress={() => handleCall(item?.User_phone)}
        onTripSheetPress={() => {
          navigation.navigate('ViewTripSheet', {
            from: 'home',
            postId: item?.post_booking_id,
          });
        }}
        isRequested={item?.request_status || false}
        packageName={item?.bookingTypePackage_name?.toString() || ''}
      />
    );
  };
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
        onlineIcon={true}
        onlineStatus={showOnlyAvailable}
        onOnlinePress={handleOnlineStatusToggle}
        muteIcon={true}
      />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>New Booking</Text>

      <FlatList
        data={userPostsData}
        renderItem={renderPostCard}
        keyExtractor={(item) => item?.post_booking_id?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#005680']}
            tintColor="#005680"
          />
        }
      />

      {/* <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
        <AddPostIcon />
      </TouchableOpacity> */}

      <CustomModal
        visible={isModalVisible}
        title={<Text>Complete Your Profile</Text>}
        subtitle={<Text>Complete Your Profile To Boost Your Visibility And Build Trust With Fellow Drivers!</Text>}
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
