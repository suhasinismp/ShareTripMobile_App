import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import FilterIcon from '../../../assets/svgs/filter.svg';
import AppHeader from '../../components/AppHeader';
import PostCard from '../../components/PostCard';
import {
  closeForDay,
  closeTrip,
  confirmedDriverTrips,
  confirmedPostedGuyTrips,
  fetchMultiDayTripDetails,
  fetchTripDetails,
  getDriverInProgressTrips,
  getPostedGuyInProgressTrips,
  postAdditionCharges,
  startTrip,
  startTripMultiDay,
} from '../../services/MyTripsService';
import { getUserDataSelector } from '../../store/selectors';
import { handleCall } from './HomeScreen';
import StartTripModal from '../../components/tripModals/StartTripModal';
import TripProgressModal from '../../components/tripModals/TripProgressModal';
import ClosingDetailsModal from '../../components/tripModals/ClosingDetailsModal';
import TripSummaryModal from '../../components/tripModals/TripSummaryModal';
import AdditionalChargesModal from '../../components/tripModals/AdditionalChargesModal';
import CustomerSignatureModal from '../../components/tripModals/CustomerSignatureModal';
import CustomAccordion from '../../components/ui/CustomAccordion';
import CustomSelect from '../../components/ui/CustomSelect';
import CustomModal from '../../components/ui/CustomModal';
import { fetchTripSheetByPostId } from '../../services/postTripService';
import { useNavigation } from '@react-navigation/native';
import BillMeBillDriverModal from '../../components/tripModals/BillMeBillDriverModal';

const MyTrips = () => {
  const navigation = useNavigation();
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
  const [navigateToBills, setNavigateToBills] = useState(false);

  // Trip data states
  const [inProgressDriverData, setInProgressDriverData] = useState([]);
  const [inProgressPostedData, setInProgressPostedData] = useState([]);
  const [confirmedDriverData, setConfirmedDriverData] = useState([]);
  const [confirmedPostedData, setConfirmedPostedData] = useState([]);
  const [uiData, setUiData] = useState([]);

  // Modal states
  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [showTripProgressModal, setShowTripProgressModal] = useState(false);

  const [showClosingDetailsModal, setShowClosingDetailsModal] = useState(false);
  const [showTripSummaryModal, setShowTripSummaryModal] = useState(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [showCustomerSignatureModal, setShowCustomerSignatureModal] =
    useState(false);
  const [isGstClosingForDay, setIsGstClosingForDay] = useState(false);
  const [isGstSummaryValue, setIsGstSummaryValue] = useState(false);

  // Trip data states
  const [selectedTripData, setSelectedTripData] = useState(null);

  const [tripSummaryData, setTripSummaryData] = useState(null);
  const [tripType, setTripType] = useState('');
  // Start trip states
  const [openingKms, setOpeningKms] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Closing details states
  const [closingKms, setClosingKms] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
  const [closingActionType, setClosingActionType] = useState('end');
  const [showBillMeBillDriverModal, setShowBillMeBillDriverModal] = useState();
  const [finalDay, setFinalDay] = useState(false);
  const [additionalChargesData, setAdditionalChargesData] = useState(null);
  const [additionalChargesDocs, setAdditionalChargesDocs] = useState(null);

  useEffect(() => {
    if (showStartTripModal || showClosingDetailsModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      if (showStartTripModal) setOpeningDate(formattedDate);
      if (showClosingDetailsModal) setClosingDate(formattedDate);
    }
  }, [showStartTripModal, showClosingDetailsModal]);

  useEffect(() => {
    fetchUiData();
  }, [selectedFilterOne, selectedFilterTwo, selectedFilterThree]);

  useEffect(() => {
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      setUiData(confirmedDriverData);
    } else if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      setUiData(confirmedPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      setUiData(inProgressPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties'
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
  ]);

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


  const handleContinueForNextDay = async () => {
    setTripType('multiDay');
    const response = await fetchMultiDayTripDetails(
      selectedTripData?.post_booking_id,
      userToken,
    );

    if (
      response?.error === false &&
      response?.message === 'You need to close last day trip details'
    ) {
      if (response?.data?.end_trip_kms == null) {
        setShowTripProgressModal(false);
        setShowClosingDetailsModal(true);
      } else if (response?.data?.is_additional === null) {
        setShowTripProgressModal(false);
        setShowAdditionalCharges(true);
      }
    } else {
      if (response?.message === 'You have closed last day Trip ride data') {
        setShowTripProgressModal(false);
        setShowStartTripModal(true);
      }
    }
  };
  const handleEndTrip = async () => {
    setFinalDay(true);
    setShowTripProgressModal(false);
    const tripDetails = await fetchTripDetails(
      selectedTripData?.post_booking_id,
      userToken,
    );
    console.log({ tripDetails });

    if (tripDetails?.error === false) {
      setTripSummaryData({
        openingKms: tripDetails?.data?.start_trip_kms || '',
        openingTime: tripDetails?.data?.start_time || '',
        openingDate: tripDetails?.data?.start_date || '',
        closingKms: tripDetails?.data?.end_trip_kms || '',
        closingTime: tripDetails?.data?.end_trip_time || '',
        closingDate: tripDetails?.data?.end_trip_date || closingDate,
      });
      console.log('fff', tripDetails?.data?.end_trip_kms?.length)
      console.log('hhh', tripDetails?.data?.customer_signature)
      if (
        tripDetails?.data?.end_trip_kms?.length > 0 &&
        tripDetails?.data?.customer_signature === null

      ) {
        setShowTripProgressModal(false);
        setShowAdditionalCharges(true);

      } else {
        setShowTripProgressModal(false);
        setShowTripSummaryModal(true);
      }


    }
  };

  const handleBackToTripProgress = () => {
    setShowClosingDetailsModal(false);
    setShowTripProgressModal(true);
  };

  const handleCloseForDay = async () => {
    const response = await closeForDay(
      {
        post_bookings_id: selectedTripData?.post_booking_id,
        end_trip_kms: closingKms,
        end_trip_date: closingDate,
        end_trip_time: closingTime,
        posted_user_id: selectedTripData?.posted_user_id,
        accepted_user_id: userId,
        is_gst: isGstClosingForDay,
      },
      userToken,
    );

    if (response?.error === false) {
      setShowClosingDetailsModal(false);
      setClosingKms('');
      setClosingTime('');

      // setIsGst(true);
      setShowAdditionalCharges(true);
    }
  };

  const handleCloseTrip = async ({ closingKms, closingTime, closingDate }) => {
    setClosingDate(closingDate)
    const response = await closeTrip(
      {
        post_bookings_id: selectedTripData?.post_booking_id,
        end_trip_kms: closingKms,
        end_trip_date: closingDate,
        end_trip_time: closingTime,
        posted_user_id: selectedTripData?.posted_user_id,
        accepted_user_id: userId,
        is_gst: isGstSummaryValue,
      },
      userToken,
    );

    if (response?.error === false) {
      setShowTripSummaryModal(false);
      setShowAdditionalCharges(true);
    }
  };
  const handleMultiDayStart = async () => {
    const finalData = {
      post_bookings_id: selectedTripData?.post_booking_id,
      start_time: openingTime,
      start_trip_kms: openingKms,
      start_date: openingDate,
    };

    const response = await startTripMultiDay(finalData, userToken);
    if (response?.error === false) {
      setShowStartTripModal(false);
      setOpeningKms('');
      setOpeningTime('');
      setOpeningDate('');
      setSelectedTripData(null);
      setTripType('');
      await fetchUiData();
    }
  };

  const handleStartTrip = async () => {
    const response = await startTrip(
      {
        post_bookings_id: selectedTripData?.post_booking_id,
        start_trip_kms: openingKms,
        start_date: openingDate,
        start_time: openingTime,
        pick_up_address: selectedTripData?.pick_up_location || '',
        destination: selectedTripData?.destination || '',
        customer_name: selectedTripData?.user_name || '',
        customer_phone_numb: selectedTripData?.user_phone || '',
        posted_user_id: selectedTripData?.posted_user_id,
        accepted_user_id: userId,
      },
      userToken,
    );

    if (response?.error === false) {
      setShowStartTripModal(false);
      setOpeningKms('');
      setOpeningTime('');
      setOpeningDate('');
      setSelectedTripData(null);
      await fetchUiData();
    }
  };

  const handleButtonPress = async (tripData) => {
    try {
      setSelectedTripData(tripData);
      setTripType('');

      const tripStatus = tripData?.post_trip_trip_status;
      if (tripStatus === 'Start Trip') {
        setShowStartTripModal(true);
      } else if (tripStatus === 'On Duty') {
        console.log('uuu', tripStatus)
        setShowTripProgressModal(true);
      }
    } catch (error) {
      console.error('Error handling trip:', error);
      // Add appropriate error handling here (e.g., showing an error message to user)
    }
  };

  const handleAdditionalChargesNext = async (documents, charges) => {
    let finalData = {
      post_booking_id: selectedTripData?.post_booking_id,
      advance: charges?.advance * 1,
      parking: charges?.parking * 1,
      tolls: charges?.tolls * 1,
      state_tax: charges?.stateTax * 1,
      cleaning: charges?.cleaning * 1,
      night_batta: charges?.nightBatta * 1,
      end_date: closingDate || tripSummaryData?.closingDate,
    };

    if (finalDay) {
      finalData.end_trip = 'trip completing';
    }
    setAdditionalChargesData(finalData);
    setAdditionalChargesDocs(documents);

    if (!finalDay) {
      console.log('hi');
      console.log({ finalData });
      const formData = new FormData();
      formData.append('json', JSON.stringify(finalData));

      // Group documents by fileNumber
      if (documents && documents.length > 0) {
        let groupedDocuments = {};

        for (const doc of documents) {
          if (!groupedDocuments[doc.fileNumber]) {
            groupedDocuments[doc.fileNumber] = [];
          }
          groupedDocuments[doc.fileNumber].push({
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
          });
        }

        // Append each file in correct format
        for (const key in groupedDocuments) {
          if (groupedDocuments[key].length > 0) {
            for (const file of groupedDocuments[key]) {
              if (file.uri) {
                formData.append(key, {
                  uri: file.uri,
                  type: file.type,
                  name: file.name,
                });
              }
            }
          }
        }
      }
      const response = await postAdditionCharges(formData, userToken);

      if (response?.error === false) {
        setClosingDate(''), setShowAdditionalCharges(false);
        setShowCustomerSignatureModal(true);
      }
    } else {
      console.log('else')
      setShowAdditionalCharges(false);
      setShowCustomerSignatureModal(true);

    }
  };

  const getEmptyStateMessage = () => {
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      return 'No confirmed duties found';
    }
    if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No confirmed posted trips found';
    }
    if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No in-progress posted trips found';
    }
    if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties'
    ) {
      return 'No in-progress duties found';
    }
    if (selectedFilterOne === 'Enquiry') {
      return 'No enquiries found';
    }
    return 'No data available';
  };

  const renderItem = ({ item }) => {
    if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
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
    }

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
        onRequestPress={() => handleButtonPress(item)}
        onCallPress={() => handleCall(item?.user_phone)}
        onPlayPress={() => { }}
        onTripSheetPress={() => {
          navigation.navigate('ViewTripSheet', {
            from: 'myTrips',
            postId: item?.post_booking_id,
          });
        }}
        isRequested={item?.post_trip_trip_status || item?.request_status}
        packageName={item?.booking_package_name}
        postStatus={'Available'}
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
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
        My Trips
      </Text>

      <View style={styles.container}>
        <View style={styles.filterRow}>
          <CustomSelect
            text="My Duties"
            isSelected={selectedFilterTwo === 'MyDuties'}
            onPress={() => setSelectedFilterTwo('MyDuties')}
          />
          <CustomSelect
            text="Posted Trips"
            isSelected={selectedFilterTwo === 'PostedTrips'}
            onPress={() => setSelectedFilterTwo('PostedTrips')}
          />

          <CustomSelect
            text="Enquiry"
            isSelected={selectedFilterTwo === 'Enquiry'}
            onPress={() => setSelectedFilterTwo('Enquiry')}
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <>
            <View style={styles.filterRow2}>
              <CustomSelect
                text="Confirmed"
                isSelected={selectedFilterOne === 'Confirmed'}
                onPress={() => setSelectedFilterOne('Confirmed')}
              />
              <CustomSelect
                text="In Progress"
                isSelected={selectedFilterOne === 'InProgress'}
                onPress={() => setSelectedFilterOne('InProgress')}
              />
              <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                <FilterIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
              <CustomSelect
                text="Local"
                isSelected={selectedFilterThree === 'Local'}
                onPress={() => setSelectedFilterThree('Local')}
              />
              <CustomSelect
                text="Out Station"
                isSelected={selectedFilterThree === 'OutStation'}
                onPress={() => setSelectedFilterThree('OutStation')}
              />
              <CustomSelect
                text="Transfer"
                isSelected={selectedFilterThree === 'Transfer'}
                onPress={() => setSelectedFilterThree('Transfer')}
              />
            </View>
          </>
        )}

        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#005680" />
            </View>
          ) : !uiData?.length ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>{getEmptyStateMessage()}</Text>
            </View>
          ) : (
            <FlatList
              data={uiData}
              renderItem={renderItem}
              keyExtractor={(item) =>
                item?.post_booking_id?.toString() ||
                item?.post_bookings_id?.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>

      <CustomModal
        visible={showStartTripModal}
        onPrimaryAction={handleStartTrip}
        onSecondaryAction={() => setShowStartTripModal(false)}
      >
        <StartTripModal
          openingKms={openingKms}
          setOpeningKms={setOpeningKms}
          openingTime={openingTime}
          setOpeningTime={setOpeningTime}
          openingDate={openingDate}
          setOpeningDate={setOpeningDate}
          handleStartTrip={
            tripType === 'multiDay' ? handleMultiDayStart : handleStartTrip
          }
          showTimePicker={showTimePicker}
          setShowTimePicker={setShowTimePicker}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          onClose={() => setShowStartTripModal(false)}
        />
      </CustomModal>

      <CustomModal
        visible={showTripProgressModal}
        onSecondaryAction={() => setShowTripProgressModal(false)}
      >
        <TripProgressModal
          handleContinueForNextDay={handleContinueForNextDay}
          handleEndTrip={handleEndTrip}
          onClose={() => setShowTripProgressModal(false)}
          transfer={selectedTripData?.booking_type_name === 'Transfer'}
        />
      </CustomModal>

      <CustomModal
        visible={showClosingDetailsModal}
        onSecondaryAction={handleBackToTripProgress}
      >
        <ClosingDetailsModal
          handleBackToTripProgress={handleBackToTripProgress}
          closingKms={closingKms}
          setClosingKms={setClosingKms}
          closingTime={closingTime}
          setClosingTime={setClosingTime}
          closingDate={closingDate}
          setClosingDate={setClosingDate}
          showClosingTimePicker={showClosingTimePicker}
          setShowClosingTimePicker={setShowClosingTimePicker}
          showClosingDatePicker={showClosingDatePicker}
          setShowClosingDatePicker={setShowClosingDatePicker}
          closingActionType={closingActionType}
          handleCloseTrip={handleCloseForDay}
          onClose={() => setShowClosingDetailsModal(false)}
          setIsGstClosingForDay={setIsGstClosingForDay}
        />
      </CustomModal>

      <CustomModal
        visible={showTripSummaryModal}
        onSecondaryAction={() => setShowTripSummaryModal(false)}
      >
        <TripSummaryModal
          tripSummaryData={tripSummaryData}
          setShowTripSummaryModal={setShowTripSummaryModal}
          setShowAdditionalCharges={setShowAdditionalCharges}
          setIsGstSummaryValue={setIsGstSummaryValue}
          onPressNext={(closingDetails) => {
            // Check if values are received
            handleCloseTrip({
              closingKms: closingDetails.closingKms,
              closingTime: closingDetails.closingTime,
              closingDate: closingDetails.closingDate,
            });
          }}
          onClose={() => setShowTripSummaryModal(false)}
        />
      </CustomModal>

      <CustomModal
        visible={showAdditionalCharges}
        onSecondaryAction={() => setShowAdditionalCharges(false)}
      >
        <AdditionalChargesModal
          onNext={handleAdditionalChargesNext}
          onClose={() => setShowAdditionalCharges(false)}
        />
      </CustomModal>

      <CustomModal
        visible={showCustomerSignatureModal}
        onSecondaryAction={() => setShowCustomerSignatureModal(false)}
      >
        <CustomerSignatureModal
          selectedTripData={selectedTripData}
          userToken={userToken}
          userId={userId}
          onClose={() => setShowCustomerSignatureModal(false)}
          fetch={fetchUiData}
          goTo={navigateToBills}
          additionalCharges={
            finalDay ? { additionalChargesData, additionalChargesDocs } : null
          }
        />
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
  listContent: {
    paddingBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  filterRow2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 5,
    gap: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MyTrips;
