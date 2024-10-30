import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {
  confirmedDriverTrips,
  confirmedPostedGuyTrips,
  getDriverInProgressTrips,
  getPostedGuyInProgressTrips,
} from '../../services/MyTripsService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import CustomSelect from '../../components/ui/CustomSelect';
import FilterIcon from '../../../assets/svgs/filter.svg';
import PostCard from '../../components/PostCard';
import CustomAccordion from '../../components/ui/CustomAccordion';
import { handleCall } from './HomeScreen';

const MyTrips = () => {
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilterOne, setSelectedFilterOne] = useState('Confirmed');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('MyDuties');
  const [selectedFilterThree, setSelectedFilterThree] = useState('Local');
  const [inProgressDriverData, setInProgressDriverData] = useState([]);
  console.log({ inProgressDriverData })
  const [inProgressPostedData, setInProgressPostedData] = useState([]);
  const [confirmedDriverData, setConfirmedDriverData] = useState([]);
  const [confirmedPostedData, setConfirmedPostedData] = useState([]);
  const [uiData, setUiData] = useState([]);


  useEffect(() => {
    fetchUiData()
  }, [selectedFilterOne, selectedFilterTwo, selectedFilterThree]);

  const fetchUiData = async () => {
    setIsLoading(true)
    await fetchDriverInProgressData(),
      await fetchPostedGuyInProgressData(),
      await fetchConfirmedDriverData(),
      await fetchConfirmedPostedData(),
      setIsLoading(false)

  }

  useEffect(() => {
    if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'MyDuties' &&
      (selectedFilterThree === 'Local' ||
        selectedFilterThree === 'OutStation' ||
        selectedFilterThree === 'Transfer')
    ) {
      setUiData(confirmedDriverData);
    } else if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips' &&
      (selectedFilterThree === 'Local' ||
        selectedFilterThree === 'OutStation' ||
        selectedFilterThree === 'Transfer')
    ) {
      setUiData(confirmedPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips' &&
      (selectedFilterThree === 'Local' ||
        selectedFilterThree === 'OutStation' ||
        selectedFilterThree === 'Transfer')
    ) {
      setUiData(inProgressPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties' &&
      (selectedFilterThree === 'Local' ||
        selectedFilterThree === 'OutStation' ||
        selectedFilterThree === 'Transfer')
    ) {
      setUiData(inProgressDriverData);
    } else if (selectedFilterOne === 'Enquiry') {
      setUiData([]);
    }
  }, [
    inProgressDriverData,
    inProgressPostedData,
    confirmedDriverData,
    confirmedPostedData,
    selectedFilterOne,
    selectedFilterTwo,
    selectedFilterThree,
  ]);

  const fetchDriverInProgressData = async () => {
    try {
      const response = await getDriverInProgressTrips(userId, userToken);
      if (response?.error === false) {
        setInProgressDriverData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching driver in progress data:', error);
    }
  };

  const fetchPostedGuyInProgressData = async () => {
    try {
      const response = await getPostedGuyInProgressTrips(userId, userToken);
      if (response?.error === false) {
        setInProgressPostedData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching posted guy in progress data:', error);
    }
  };

  const fetchConfirmedDriverData = async () => {
    try {
      const response = await confirmedDriverTrips(userId, userToken);
      if (response?.error === false) {
        setConfirmedDriverData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching confirmed driver data:', error);
    }
  };

  const fetchConfirmedPostedData = async () => {
    console.log('fetching')
    try {
      const response = await confirmedPostedGuyTrips(userId, userToken);
      if (response?.error === false) {
        setConfirmedPostedData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching confirmed posted data:', error);
    }
  };

  const handleFilterOneSelect = (filter) => {
    setSelectedFilterOne(filter);
  };

  const handleFilterTwoSelect = (filter) => {
    setSelectedFilterTwo(filter);
  };

  const handleFilterThreeSelect = (filter) => {
    setSelectedFilterThree(filter);
  };

  const getEmptyStateMessage = () => {
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      return 'No confirmed duties found';
    } else if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No confirmed posted trips found';
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No in-progress posted trips found';
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties'
    ) {
      return 'No in-progress duties found';
    } else if (selectedFilterOne === 'Enquiry') {
      return 'No enquiries found';
    }
    return 'No data available';
  };

  const EmptyStateComponent = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>{getEmptyStateMessage()}</Text>
    </View>
  );

  const renderPostCard = ({ item }) => {
    return (
      <PostCard
        bookingType={item?.booking_type_name}
        userProfilePic={
          item?.user_profile_pic || 'https://via.placeholder.com/150'
        }
        userName={item?.user_name}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.from_date}
        vehicleType={item?.vehicle_type}
        vehicleName={item?.vehicle_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments}
        postVoiceMessage={item?.post_voice_message}
        baseFareRate={item?.booking_tarif_base_fare_rate}
        onRequestPress={() => { }}
        onCallPress={() => handleCall(item?.user_phone)}
        onPlayPress={() => {
          /* TODO: Implement voice message playback */
        }}
        onMessagePress={() => {
          /* TODO: Implement messaging */
        }}
        isRequested={item?.post_trip_trip_status}
        packageName={item?.booking_package_name}
      />
    );
  };

  const renderAccordion = ({ item }) => {
    return (
      <CustomAccordion
        bookingType={item?.booking_type_name}
        amount={item?.base_fare_rate}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.trip_date}
        distanceTime={item?.distance_time}
        vehicleType={item?.vehicle_type}
        vehicleName={item?.vehicle_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments}
        postVoiceMessage={item?.post_voice_message}
        drivers={item?.trackingDetails}
        onCallPress={() => { }}
        onMessagePress={() => { }}
        onRefreshData={fetchUiData}
        userToken={userToken}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#005680" />
        </View>
      );
    }

    if (!uiData || uiData.length === 0) {
      return <EmptyStateComponent />;
    }

    return (
      <FlatList
        data={uiData}
        renderItem={
          selectedFilterOne === 'InProgress' &&
            selectedFilterTwo === 'PostedTrips'
            ? renderAccordion
            : renderPostCard
        }
        keyExtractor={(item) =>
          item?.post_booking_id?.toString() ||
          item?.post_bookings_id?.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={() => <View style={styles.footer} />}
      />
    );
  };

  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <CustomSelect
            text="Confirmed"
            isSelected={selectedFilterOne === 'Confirmed'}
            onPress={() => handleFilterOneSelect('Confirmed')}
          />
          <CustomSelect
            text="In Progress"
            isSelected={selectedFilterOne === 'InProgress'}
            onPress={() => handleFilterOneSelect('InProgress')}
          />
          <CustomSelect
            text="Enquiry"
            isSelected={selectedFilterOne === 'Enquiry'}
            onPress={() => handleFilterOneSelect('Enquiry')}
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View>
            <View style={styles.secondaryFilterRow}>
              <CustomSelect
                text="My Duties"
                isSelected={selectedFilterTwo === 'MyDuties'}
                onPress={() => handleFilterTwoSelect('MyDuties')}
              />
              <CustomSelect
                text="Posted Trips"
                isSelected={selectedFilterTwo === 'PostedTrips'}
                onPress={() => handleFilterTwoSelect('PostedTrips')}
              />
            </View>
            <View style={styles.tertiaryFilterRow}>
              <CustomSelect
                text="Local"
                isSelected={selectedFilterThree === 'Local'}
                onPress={() => handleFilterThreeSelect('Local')}
              />
              <CustomSelect
                text="Out Station"
                isSelected={selectedFilterThree === 'OutStation'}
                onPress={() => handleFilterThreeSelect('OutStation')}
              />
              <CustomSelect
                text="Transfer"
                isSelected={selectedFilterThree === 'Transfer'}
                onPress={() => handleFilterThreeSelect('Transfer')}
              />
            </View>
          </View>
        )}

        <View style={styles.listContainer}>{renderContent()}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  footer: {
    height: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  secondaryFilterRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
  },
  tertiaryFilterRow: {
    flexDirection: 'row',
    gap: 10,
    margin: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MyTrips;
