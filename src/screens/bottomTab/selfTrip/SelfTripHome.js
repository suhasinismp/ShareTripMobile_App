import React, { useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AddPostIcon from '../../../../assets/svgs/addPost.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { formatDate } from '../../../utils/formatdateUtil';
import { fetchUserSelfPosts } from '../../../services/selfTripService';
import PostCard from '../../../components/PostCard';


const SelfTripHome = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;
  const [userSelfTripData, setUserSelfTripData] = useState([])

  useFocusEffect(
    useCallback(() => {
      getSelfTripPosts();


    }, [userId, userToken]),
  );

  const getSelfTripPosts = async () => {
    const response = await fetchUserSelfPosts(userId, userToken)
    if (response.error === false) {
      setUserSelfTripData(response.data)
    }
    console.log({ response })
  }



  const handleAddPost = () => {
    navigation.navigate('CreateSelfTrip');
  };
  const renderSelfPostCard = ({ item }) => (
    <PostCard
      // Card Header Props
      bookingType={item?.bookingType_name}
      createdAt={formatDate(item?.created_at)}
      postStatus={item?.post_status}
      // User Info Props
      userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
      userName={item?.User_name}

      // Trip Details Props
      pickUpTime={item?.pick_up_time}
      fromDate={item?.from_date}
      vehicleType={item?.Vehicle_type_name}
      vehicleName={item?.Vehicle_name}
      pickUpLocation={item?.pick_up_location}
      destination={item?.destination}
      // Comment/Voice Props
      postComments={item?.post_comments}
      postVoiceMessage={item?.post_voice_message}
      // Amount Props
      baseFareRate={item?.bookingTypeTariff_base_fare_rate}
      // Action Props
      onRequestPress={() => { }

      }

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

  return (
    <>
      <FlatList
        data={userSelfTripData} // Ensure this is defined or passed as a prop
        renderItem={renderSelfPostCard} // Ensure this function is defined
        keyExtractor={(item) => item.post_booking_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
        <AddPostIcon />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
    marginTop: 30,
  },
});

export default SelfTripHome;


