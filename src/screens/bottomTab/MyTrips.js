import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
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

const MyTrips = () => {
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilterOne, setSelectedFilterOne] = useState('Confirmed');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('MyDuties');
  const [selectedFilterThree, setSelectedFilterThree] = useState('Local');
  const [inProgressDriverData, setInProgressDriverData] = useState([]);
  const [inProgressPostedData, setInProgressPostedData] = useState([]);
  const [confirmedDriverData, setConfirmedDriverData] = useState([]);
  const [confirmedPostedData, setConfirmedPostedData] = useState([]);
  const [uiData, setUiData] = useState([]);
  console.log({ uiData });

  useEffect(() => {
    fetchDriverInProgressData();
    fetchPostedGuyInProgressData();
    fetchConfirmedDriverData();
    fetchConfirmedPostedData();
  }, []);

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
      setUiData();
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
    const response = await getDriverInProgressTrips(userId, userToken);
    if (response?.error === false) {
      setInProgressDriverData(response?.data);
    }
  };

  const fetchPostedGuyInProgressData = async () => {
    const response = await getPostedGuyInProgressTrips(userId, userToken);
    if (response?.error === false) {
      setInProgressPostedData(response?.data);
    }
  };

  const fetchConfirmedDriverData = async () => {
    const response = await confirmedDriverTrips(userId, userToken);
    if (response?.error === false) {
      setConfirmedDriverData(response?.data);
    }
  };

  const fetchConfirmedPostedData = async () => {
    const response = await confirmedPostedGuyTrips(userId, userToken);
    if (response?.error === false) {
      setConfirmedPostedData(response?.data);
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

  const renderPostCard = ({ item }) => {
    return (
      <PostCard
        bookingType={item.booking_type_name}
        // User Info Props
        userProfilePic={
          item.user_profile_pic || 'https://via.placeholder.com/150'
        }
        userName={item.user_name}
        // Trip Details Props
        pickUpTime={item.pick_up_time}
        fromDate={item.from_date}
        vehicleType={item.vehicle_type}
        vehicleName={item.vehicle_name}
        pickUpLocation={item.pick_up_location}
        destination={item.destination}
        // Comment/Voice Props
        postComments={item.post_comments}
        postVoiceMessage={item.post_voice_message}
        // Amount Props
        baseFareRate={item?.bookingTypeTariff_base_fare_rate}
        // Action Props
        onRequestPress={() => {}}
        onCallPress={() => {}}
        onPlayPress={() => {
          /* TODO: Implement voice message playback */
        }}
        onMessagePress={() => {
          /* TODO: Implement messaging */
        }}
        isRequested={item?.request_status || item?.status}
      />
    );
  };

  const renderAccordion = ({ item }) => {
    return (
      <CustomAccordion
        bookingType={item.booking_type_name}
        amount={item.base_fare_rate}
        pickUpTime={item.pick_up_time}
        fromDate={item.trip_date}
        distanceTime={item.distance_time}
        vehicleType={item.vehicle_type}
        vehicleName={item.vehicle_name}
        pickUpLocation={item.pick_up_location}
        destination={item.destination}
        postComments={item.post_comments}
        postVoiceMessage={item.post_voice_message}
        drivers={item.trackingDetails}
        onCallPress={() => {}}
        onMessagePress={() => {}}
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
            onPress={() => {
              handleFilterOneSelect('Confirmed');
            }}
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
        <View>
          {showFilters && (
            <>
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
            </>
          )}
        </View>
        <View style={{ marginHorizontal: 20 }}>
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
          />
        </View>
      </View>
      <View style={{ marginBottom: showFilters ? 210 : 80 }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#F0F0F0',
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
});

export default MyTrips;
