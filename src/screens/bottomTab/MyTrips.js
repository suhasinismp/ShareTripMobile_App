import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  TextInput,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {
  confirmedDriverTrips,
  confirmedPostedGuyTrips,
  getDriverInProgressTrips,
  getPostedGuyInProgressTrips,
  startTrip,
} from '../../services/MyTripsService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import CustomSelect from '../../components/ui/CustomSelect';
import FilterIcon from '../../../assets/svgs/filter.svg';
import PostCard from '../../components/PostCard';
import CustomAccordion from '../../components/ui/CustomAccordion';
import { handleCall } from './HomeScreen';

import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../components/ui/CustomInput';
import CustomModal from '../../components/ui/CustomModal';

const MyTrips = () => {
  // User data from Redux
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  // Filter states
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilterOne, setSelectedFilterOne] = useState('Confirmed');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('MyDuties');
  const [selectedFilterThree, setSelectedFilterThree] = useState('Local');

  // Data states
  const [inProgressDriverData, setInProgressDriverData] = useState([]);
  const [inProgressPostedData, setInProgressPostedData] = useState([]);
  const [confirmedDriverData, setConfirmedDriverData] = useState([]);
  const [confirmedPostedData, setConfirmedPostedData] = useState([]);
  const [uiData, setUiData] = useState([]);

  // Modal states
  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [openingKms, setOpeningKms] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);
  console.log({ selectedTripData });

  // Set default opening date when modal opens
  useEffect(() => {
    if (showStartTripModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      setOpeningDate(formattedDate);
    }
  }, [showStartTripModal]);

  // Initial data fetch
  useEffect(() => {
    fetchUiData();
  }, [selectedFilterOne, selectedFilterTwo, selectedFilterThree]);

  // Data fetching functions
  const fetchUiData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchDriverInProgressData(),
      fetchPostedGuyInProgressData(),
      fetchConfirmedDriverData(),
      fetchConfirmedPostedData(),
    ]);
    setIsLoading(false);
  };

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
    try {
      const response = await confirmedPostedGuyTrips(userId, userToken);
      if (response?.error === false) {
        setConfirmedPostedData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching confirmed posted data:', error);
    }
  };

  // Update UI data based on filters
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

  // Filter handlers
  const handleFilterOneSelect = (filter) => setSelectedFilterOne(filter);
  const handleFilterTwoSelect = (filter) => setSelectedFilterTwo(filter);
  const handleFilterThreeSelect = (filter) => setSelectedFilterThree(filter);

  // Modal handlers
  const handleStartTrip = async () => {
    const finalData = {
      post_bookings_id: selectedTripData?.post_booking_id,
      start_trip_kms: openingKms,
      start_date: openingDate,
      start_time: openingTime,
      pick_up_address: 'rajajnagar',
      destination: 'jayanagar',
      customer_name: 'pooja',
      customer_phone_numb: '9876567898',
      posted_user_id: selectedTripData?.posted_user_id,
      accepted_user_id: userId,
    };

    const response = await startTrip(finalData, userToken);
    if (response?.error === false) {
      handleCloseModal();
    }
  };

  const handleButtonPress = async (tripData) => {
    if (tripData?.post_trip_trip_status === 'Start Trip') {
      setSelectedTripData(tripData);
      setShowStartTripModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowStartTripModal(false);
    setOpeningKms('');
    setOpeningTime('');
    setOpeningDate('');
    setSelectedTripData(null);
  };

  // Render functions
  const StartTripModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Opening Trip Details</Text>

      <View style={styles.inputGroup}>
        <CustomInput
          placeholder="Opening Kms"
          value={openingKms}
          onChangeText={setOpeningKms}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Opening Time</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <FontAwesome
            name="clock-o"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={openingTime}
            placeholder="HH:MM AM/PM"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Opening Date</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <FontAwesome
            name="calendar"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={openingDate}
            placeholder="YYYY/MM/DD"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.startTripButton}
        onPress={handleStartTrip}
      >
        <Text style={styles.startTripButtonText}>Start Trip</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              setOpeningTime(formattedTime);
            }
          }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={
            openingDate ? new Date(openingDate.replace(/\//g, '-')) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formattedDate = `${selectedDate.getFullYear()}/${String(
                selectedDate.getMonth() + 1,
              ).padStart(
                2,
                '0',
              )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
              setOpeningDate(formattedDate);
            }
          }}
        />
      )}
    </View>
  );

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

  const renderPostCard = ({ item }) => (
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
      onRequestPress={() => handleButtonPress(item)}
      onCallPress={() => handleCall(item?.user_phone)}
      onPlayPress={() => {}}
      onMessagePress={() => {}}
      isRequested={item?.post_trip_trip_status}
      packageName={item?.booking_package_name}
    />
  );

  const renderAccordion = ({ item }) => (
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
      onCallPress={() => {}}
      onMessagePress={() => {}}
      onRefreshData={fetchUiData}
      userToken={userToken}
    />
  );

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

      <CustomModal
        visible={showStartTripModal}
        onPrimaryAction={handleStartTrip}
        onSecondaryAction={handleCloseModal}
      >
        <StartTripModalContent />
      </CustomModal>
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
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 10,
  },
  pickerInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  startTripButton: {
    backgroundColor: '#123F67',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  startTripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyTrips;
