import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserMetaData } from '../../services/signinService';
import { getUserDataSelector } from '../../store/selectors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ModalProfileIcon from '../../../assets/svgs/modalProfile.svg';
import CustomModal from '../../components/ui/CustomModal';
import AppHeader from '../../components/AppHeader';
import AddPostIcon from '../../../assets/svgs/addPost.svg';
import {
  fetchPostsByUserId,
  sendPostRequest,
} from '../../services/homeService';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../styles/fonts';
import DotDivider from '../../../assets/svgs/dotDivider.svg';
import CallIcon from '../../../assets/svgs/call.svg';
import PlayIcon from '../../../assets/svgs/playSound.svg';
import TextMsgIcon from '../../../assets/svgs/textMsg.svg';
import { showSnackbar } from '../../store/slices/snackBarSlice';

const capitalizeWords = (str) => {
  return str.replace(/\b\w+/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};

const handleCall = (phoneNumber) => {
  Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
    console.error('An error occurred', err),
  );
};

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

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;
  const [userPostsData, setUserPostsData] = useState([]);
  const [requestedPosts, setRequestedPosts] = useState([]);
  console.log({ requestedPosts });

  useEffect(() => {
    getUserMetaData();
  }, [userId, userToken]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Home screen focus effect');
      getUserPosts();
    }, [userId, userToken]),
  );

  const handleRequestClick = async (postId, userId) => {
    const finalData = {
      post_booking_id: postId,
      user_id: userId,
    };
    const response = await sendPostRequest(finalData, userToken);
    if (response?.status === 'Requested') {
      dispatch(
        showSnackbar({
          message:
            'Request sent successfully. You can track the status in MyTrips',
          type: 'success',
        }),
      );
      setRequestedPosts((prevRequestedPosts) => {
        return [...prevRequestedPosts, response.post_booking_id];
      });
    }
  };
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

  const getUserPosts = async () => {
    setIsLoading(true);
    const response = await fetchPostsByUserId(userId, userToken);
    if (response?.error === false) {
      const filteredPosts = response?.data.filter(
        (post) =>
          post.post_status === 'Available' || post.post_status === 'Closed',
      );
      setUserPostsData(filteredPosts);
    }
    setIsLoading(false);
  };

  const handlePrimaryAction = () => {
    setIsModalVisible(false);
    navigation.openDrawer();
  };

  const handleAddPost = () => {
    navigation.navigate('PostTrip');
  };

  const renderPostCard = ({ item }) => {
    const isAvailable = item.post_status === 'Available';

    if (isAvailable) {
      const hasCommentOrVoice = item.post_comments || item.post_voice_message;

      return (
        <View style={styles.card}>
          <View style={{ ...styles.cardHeader, backgroundColor: '#CCE3F4' }}>
            <Text style={styles.cardType}>
              {capitalizeWords(item.bookingType.booking_type_name)}
            </Text>
            <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
            <Text style={styles.cardStatus}>
              {capitalizeWords(item.post_status)}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.User.u_profile_pic }}
                style={styles.profilePic}
              />
              <Text style={styles.userName}>
                {capitalizeWords(item.User.u_name)}
              </Text>
            </View>
            <View style={styles.companyInfo}>
              <Ionicons name="people" size={20} color="#005680" />
              <Text style={styles.companyName}>
                {capitalizeWords('Public')}
              </Text>
            </View>
          </View>
          <DotDivider />
          <View style={styles.cardBody}>
            <View style={styles.mainContent}>
              {!hasCommentOrVoice && (
                <>
                  <View style={styles.tripInfo}>
                    <View style={styles.timeAndDate}>
                      <Ionicons name="time-outline" size={20} color="#005680" />
                      <Text style={styles.tripTime}>
                        {item.pick_up_time || 'N/A'}
                      </Text>
                      <Text style={styles.tripDate}>
                        {item.from_date || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.distanceAndVehicle}>
                      <View style={styles.distanceInfo}>
                        <Ionicons
                          name="car-outline"
                          size={20}
                          color="#005680"
                        />
                        <Text style={styles.distanceText}>4hr 40kms</Text>
                      </View>
                      <View style={styles.vehicleInfo}>
                        <Ionicons name="car" size={20} color="#005680" />
                        <Text style={styles.vehicleText}>
                          {capitalizeWords(item.VehicleTypes?.v_type || 'N/A')}
                          {', '}
                          {capitalizeWords(item.VehicleNames?.v_name || 'N/A')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#4CAF50"
                    />
                    <Text style={styles.locationText}>
                      {capitalizeWords(item.pick_up_location || 'N/A')}
                    </Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Ionicons name="location" size={20} color="#F44336" />
                    <Text style={styles.locationText}>
                      {capitalizeWords(item.destination || 'N/A')}
                    </Text>
                  </View>
                </>
              )}
              {hasCommentOrVoice && (
                <>
                  <View style={styles.vehicleInfo}>
                    <Ionicons name="car" size={20} color="#005680" />
                    <Text style={styles.vehicleText}>
                      {capitalizeWords(item.VehicleTypes?.v_type || 'N/A')}
                      {', '}
                      {capitalizeWords(item.VehicleNames?.v_name || 'N/A')}
                    </Text>
                  </View>
                  <View style={styles.commentSection}>
                    <Text style={styles.commentText}>
                      {capitalizeWords(
                        item.post_comments || 'Voice Message Available',
                      )}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  {!hasCommentOrVoice && (
                    <View style={styles.amountSection}>
                      <Text style={styles.amountLabel}>Amount:</Text>
                      <Text style={styles.amountText}>
                        Rs {item?.bookingTypeTariff[0]?.base_fare_rate}/-
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    handleRequestClick(item.id, userId);
                  }}
                  disabled={requestedPosts.includes(item.id)}
                >
                  <Text style={styles.acceptButtonText}>
                    {requestedPosts.includes(item.id) ? 'requested' : 'request'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity onPress={() => handleCall(item.User.u_mob_num)}>
                <CallIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <PlayIcon />
              </TouchableOpacity>
              <TouchableOpacity>
                <TextMsgIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.card, styles.closedCard]}>
          <View style={{ ...styles.cardHeader, backgroundColor: '#FF9C7D' }}>
            <Text style={styles.cardType}>
              {capitalizeWords(item.bookingType.booking_type_name)}
            </Text>
            <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
            <Text style={[styles.cardStatus, styles.closedStatus]}>
              {capitalizeWords(item.post_status)}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.User.u_profile_pic }}
                style={styles.profilePic}
              />
              <Text style={styles.userName}>
                {capitalizeWords(item.User.u_name)}
              </Text>
            </View>
            <View style={styles.companyInfo}>
              <Ionicons name="people" size={20} color="#005680" />
              <Text style={styles.companyName}>
                {capitalizeWords('Public')}
              </Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.mainContent}>
              <View style={styles.tripInfo}>
                {!item.post_voice_message && !item.post_comments && (
                  <>
                    <View style={styles.timeAndDate}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.tripTime}>
                        {capitalizeWords(item.pick_up_time || 'N/A')}
                      </Text>
                      <Text style={styles.tripDate}>
                        {capitalizeWords(item.from_date || 'N/A')}
                      </Text>
                    </View>
                    <View style={styles.distanceAndVehicle}>
                      <View style={styles.distanceInfo}>
                        <Ionicons name="car-outline" size={16} color="#666" />
                        <Text style={styles.distanceText}>4hr 40kms</Text>
                      </View>
                      <View style={styles.vehicleInfo}>
                        <Ionicons name="car" size={16} color="#666" />
                        <Text style={styles.vehicleText}>
                          {capitalizeWords(item.VehicleTypes?.v_type || 'N/A')}
                          {', '}
                          {capitalizeWords(item.VehicleNames?.v_name || 'N/A')}
                        </Text>
                      </View>
                    </View>
                  </>
                )}

                <View style={styles.vehicleInfo}>
                  <Ionicons name="car" size={16} color="#666" />
                  <Text style={styles.vehicleText}>
                    {capitalizeWords(item.VehicleTypes?.v_type || 'N/A')}
                    {', '}
                    {capitalizeWords(item.VehicleNames?.v_name || 'N/A')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
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
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <FlatList
        data={userPostsData}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#F0F0F0',
  },
  listContainer: {
    padding: 10,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cardType: {
    fontSize: 17,
    fontFamily: FONTS.SemiBold600,
    color: '#123F67',
    lineHeight: 22,
  },
  cardDate: {
    color: '#000000',
    fontSize: 12,
  },
  cardStatus: {
    color: '#21833F',
    fontSize: 14,
    fontFamily: FONTS.SemiBold600,
    lineHeight: 23,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: '#0D0D0D',
    lineHeight: 27,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: FONTS.Regular400,
    color: '#000000',
  },
  cardBody: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 12,
  },
  mainContent: {
    flex: 1,
    marginRight: 10,
  },
  tripInfo: {
    marginBottom: 12,
  },
  timeAndDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTime: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: '#171661',
    lineHeight: 22,
  },
  tripDate: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: '#171661',
    lineHeight: 22,
  },
  distanceAndVehicle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: '#171661',
    lineHeight: 22,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    color: '#171661',
    lineHeight: 22,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.Regular400,
    lineHeight: 25,
    color: '#0F0F0F',
  },
  commentSection: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  commentText: {
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  footerLeft: {
    flex: 1,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    lineHeight: 23,
    color: '#0F0F0F',
  },
  amountText: {
    fontSize: 16,
    fontFamily: FONTS.Bold700,
    color: '#123F67',
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#005680',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtonsContainer: {
    backgroundColor: '#CCE3F4',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    width: 42,
  },
  closedCard: {
    backgroundColor: 'white',
  },
  closedStatus: {
    color: '#D33D0E',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});

export default HomeScreen;
