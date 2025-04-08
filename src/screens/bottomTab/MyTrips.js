



import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import ArrowDown from '../../../assets/svgs/arrowDown.svg';
import AppHeader from '../../components/AppHeader';
import PostCard from '../../components/PostCard';
import AdditionalChargesModal from '../../components/tripModals/AdditionalChargesModal';
import CustomerSignatureModal from '../../components/tripModals/CustomerSignatureModal';
import StartTripModal from '../../components/tripModals/StartTripModal';
import TripProgressModal from '../../components/tripModals/TripProgressModal';
import TripSummaryModal from '../../components/tripModals/TripSummaryModal';
import CustomAccordion from '../../components/ui/CustomAccordion';
import CustomModal from '../../components/ui/CustomModal';
import CustomSelect from '../../components/ui/CustomSelect';
import {
  closeForDay,
  closeTrip,
  confirmedDriverTrips,
  confirmedPostedGuyTrips,
  fetchMultiDayTripDetails,
  getDriverDataByPostId,
  getDriverInProgressTrips,
  getPostedGuyInProgressTrips,
  postAdditionCharges,
  startTrip,
  startTripMultiDay
} from '../../services/MyTripsService';
import { getUserDataSelector } from '../../store/selectors';
import { handleCall } from './HomeScreen';
import { fetchChatMessages } from '../../services/chatService';
import { deletePostedTrip } from '../../services/MyTripsService';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/snackBarSlice';

const MyTrips = ({ route }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
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

  // const [showClosingDetailsModal, setShowClosingDetailsModal] = useState(false);
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
  const [showLocationFilters, setShowLocationFilters] = useState(null);

  useEffect(() => {
    if (showStartTripModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      if (showStartTripModal) setOpeningDate(formattedDate);

    }
  }, [showStartTripModal]);

  useEffect(() => {
    fetchUiData();
  }, [selectedFilterOne, selectedFilterTwo, selectedFilterThree]);



  useEffect(() => {
    setShowFilters(true);
    if (route?.params) {
      // Set filter states from route params
      if (route.params.filterOne) {
        setSelectedFilterOne(route.params.filterOne);
      }
      if (route.params.filterTwo) {
        setSelectedFilterTwo(route.params.filterTwo);
      }
      if (route.params.bookingType) {
        setSelectedFilterThree(route.params.bookingType);
        setShowLocationFilters(true);
      }

      fetchUiData();
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'MyDuties') {
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



  useEffect(() => {
    let filteredData = [];

    // First filter based on status and type
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      filteredData = [...confirmedDriverData];
    } else if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'PostedTrips') {
      filteredData = [...confirmedPostedData];
    } else if (selectedFilterOne === 'InProgress' && selectedFilterTwo === 'PostedTrips') {
      filteredData = [...inProgressPostedData];
    } else if (selectedFilterOne === 'InProgress' && selectedFilterTwo === 'MyDuties') {
      filteredData = [...inProgressDriverData];
    }

    // Only apply booking type filter if showLocationFilters is true
    if (showLocationFilters && selectedFilterThree && filteredData.length > 0) {
      filteredData = filteredData.filter(item => {
        const bookingType = (item?.booking_type_name || item?.bookingType_name || item?.bookingType || '').toLowerCase();
        const selectedType = selectedFilterThree.toLowerCase();

        // Handle OutStation variations
        if (selectedType === 'outstation') {
          return bookingType === 'outstation' ||
            bookingType === 'out station' ||
            bookingType === 'outstation trip';
        }

        return bookingType === selectedType.toLowerCase();
      });
    }


    setUiData(filteredData);
  }, [
    selectedFilterOne,
    selectedFilterTwo,
    selectedFilterThree,
    showLocationFilters,  // Add this dependency
    confirmedDriverData,
    confirmedPostedData,
    inProgressDriverData,
    inProgressPostedData
  ]);

  // Remove or comment out the old useEffect that was setting uiData

  // const fetchUiData = async () => {
  //   setIsLoading(true);
  //   await Promise.all([
  //     fetchDriverInProgressData(),
  //     fetchPostedGuyInProgressData(),
  //     fetchConfirmedDriverData(),
  //     fetchConfirmedPostedData(),
  //   ]);
  //   setIsLoading(false);
  //   if (currentBookingType === 'OutStation') {
  //     setSelectedFilterThree('OutStation');
  //     setShowLocationFilters(true);
  //   }
  // };


  const fetchUiData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchDriverInProgressData(),
        fetchPostedGuyInProgressData(),
        fetchConfirmedDriverData(),
        fetchConfirmedPostedData(),
      ]);

      // Remove the currentBookingType check
      if (selectedFilterThree === 'OutStation') {
        setShowLocationFilters(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (item) => {
    try {
      setIsLoading(true);
      if (!item?.post_booking_id) {
        throw new Error('Invalid post ID');
      }

      const response = await deletePostedTrip(
        item.post_booking_id,
        userId,
        userToken
      );

      if (response?.error === false && response?.message === "Successfully deleted the post booking") {
        dispatch(
          showSnackbar({
            message: response.message,
            type: 'success',
          })
        );
        // Refresh the data
        await fetchUiData();
        // Navigate back to the previous screen if needed
        navigation.goBack();
      } else {
        throw new Error(response?.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      dispatch(
        showSnackbar({
          message: error.message || 'Failed to delete post. Please try again.',
          type: 'error',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };


  const fetchDriverInProgressData = async () => {
    try {
      const response = await getDriverInProgressTrips(userId, userToken);

      if (response?.error === false) {
        let data = response?.data;
        // If coming from a booking acceptance, ensure the data is properly filtered
        if (route?.params?.fromBooking && route?.params?.bookingType) {
          data = data.filter(item =>
            item?.booking_type_name === route?.params?.bookingType
          );
        }
        setInProgressDriverData(data);
      }
    } catch (error) {
      console.error('Error fetching driver in progress data:', error);
    }
  };

  // const fetchPostedGuyInProgressData = async () => {
  //   try {
  //     const response = await getPostedGuyInProgressTrips(userId, userToken);
  //     if (response?.error === false) {
  //       let data = response?.data;

  //       // If coming from booking acceptance, don't filter here
  //       // Let the useEffect handle the filtering
  //       setInProgressPostedData(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching posted guy in progress data:', error);
  //   }
  // };

  const fetchPostedGuyInProgressData = async () => {
    try {
      const response = await getPostedGuyInProgressTrips(userId, userToken);

      if (response?.error === false && Array.isArray(response.data)) {
        // Separate quoted and non-quoted trips
        const quotedArray = response.data.filter(
          item => item.request_status === 'Quoted'
        );

        const nonQuotedArray = response.data.filter(
          item => item.request_status !== 'Quoted'
        );


        const quotedWithDrivers = await Promise.all(
          quotedArray.map(async (item) => {
            try {
              const driverResponse = await getDriverDataByPostId(item.post_booking_id, userToken);


              if (!driverResponse?.error && Array.isArray(driverResponse?.data)) {

                const trackingDetails = driverResponse.data[0].drivers.map(driver => ({

                  id: driver.id,
                  user_name: driver.name,
                  user_id: driver.id,
                  user_profile: driver.profile_pic,
                  user_phone: driver.phone_number,
                  vehicle_number: driver.vehicle_registration,
                  vehicle_type: driver.vehicle_type,
                  vehicle_model: driver.vehicle_model,
                  vehicle_seating_capacity: driver.vehicle_seating_capacity,
                  vehicle_name: driver.vehicle_name,
                  vehicle_id: driver.vehicle_id,
                  post_booking_id: item.post_booking_id,


                }));


                return {
                  ...item,
                  trackingDetails
                };
              } else {
                console.warn(`No driver data found for post_booking_id: ${item.post_booking_id}`);
                return {
                  ...item,
                  trackingDetails: []
                };
              }
            } catch (error) {
              console.error(`Error fetching driver for ${item.post_booking_id}:`, error);
              return {
                ...item,
                trackingDetails: []
              };
            }
          })
        );

        const finalCombined = [...nonQuotedArray, ...quotedWithDrivers];


        setInProgressPostedData(finalCombined);
      } else {
        console.error('Invalid response from getPostedGuyInProgressTrips:', response);
        setInProgressPostedData([]);
      }
    } catch (error) {
      console.error('Error in fetchPostedGuyInProgressData:', error);
      setInProgressPostedData([]);
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
    if (response.error === false) {
      setTripSummaryData({
        openingKms: response?.data?.start_trip_kms || '',
        openingTime: response?.data?.start_time || '',
        openingDate: response?.data?.start_date || '',
        closingKms: response?.data?.end_trip_kms || '',
        closingTime: response?.data?.end_trip_time || '',
        closingDate: response?.data?.end_trip_date || closingDate,
      });
    }

    if (
      response?.error === false &&
      response?.message === 'You need to close last day trip details'
    ) {
      if (response?.data?.end_trip_kms == null) {
        setShowTripProgressModal(false);
        setShowTripSummaryModal(true)
        // setShowClosingDetailsModal(true);
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
    // const tripDetails = await fetchTripDetails(
    //   selectedTripData?.post_booking_id,
    //   userToken,
    // );

    const tripDetails = await fetchMultiDayTripDetails(
      selectedTripData?.post_booking_id,
      userToken,
    );


    if (tripDetails?.error === false) {
      setTripSummaryData({
        openingKms: tripDetails?.data?.start_trip_kms || '',
        openingTime: tripDetails?.data?.start_time || '',
        openingDate: tripDetails?.data?.start_date || '',
        closingKms: tripDetails?.data?.end_trip_kms || '',
        closingTime: tripDetails?.data?.end_trip_time || '',
        closingDate: tripDetails?.data?.end_trip_date || closingDate,
      });

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
    // setShowClosingDetailsModal(false);
    setShowTripSummaryModal(false)
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
      // setShowClosingDetailsModal(false);
      setShowTripSummaryModal(false)
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
      const currentBookingType = selectedFilterThree;
      await fetchUiData();
      setSelectedFilterThree(currentBookingType);
      setShowLocationFilters(true);
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

      setShowAdditionalCharges(false);
      setShowCustomerSignatureModal(true);

    }
  };

  const handleChatPress = (item) => {
    navigation.navigate('ChatScreen', {
      postId: item.post_booking_id,
      userId: item.posted_user_id,
      userName: item.user_name,
    });
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
      selectedFilterTwo === 'PostedTrips',
      item?.request_status === 'Quoted'
    ) {


      return (


        < CustomAccordion
          bookingType={item?.booking_type_name}
          amount={item?.booking_tarif_base_fare_rate}
          pickUpTime={item?.pick_up_time}
          fromDate={item?.trip_date || item?.from_date
          }
          distanceTime={item?.distance_time}
          vehicleType={item?.vehicle_type}
          vehicleName={item?.vehicle_name}
          pickUpLocation={item?.pick_up_location}
          destination={item?.destination}
          postComments={item?.post_comments}
          postVoiceMessage={item?.post_voice_message}
          drivers={item?.trackingDetails}

          onRefreshData={fetchUiData}
          onCallPress={() => handleCall(item?.User_phone)}
          onMessagePress={() => handleChatPress(item)}

          userToken={userToken}

        />

      )
    }
    const userProfilePic = selectedFilterTwo === 'PostedTrips'
      ? item?.accepted_user_profile || item?.user_profile || 'https://via.placeholder.com/150'
      : item?.user_profile_pic || 'https://via.placeholder.com/150';

    const userName = selectedFilterTwo === 'PostedTrips'
      ? item?.accepted_user_name || item?.user_name || 'User'
      : item?.user_name || 'User';

    return (
      <PostCard
        bookingType={item?.booking_type_name}
        userProfilePic={userProfilePic}
        userName={userName}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.trip_date || item?.from_date}
        vehicleType={item?.vehicle_type || item?.vehicle_type}
        vehicleName={item?.vehicle_name || item?.vehicle_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments}
        postVoiceMessage={item?.post_voice_message}
        baseFareRate={item?.booking_tarif_base_fare_rate}
        onRequestPress={() =>
          selectedFilterOne === 'InProgress' &&
            selectedFilterTwo === 'PostedTrips' ?
            handleDeletePost(item) :
            handleButtonPress(item)
        }

        onCallPress={() => handleCall(item?.user_phone)}
        chat={true}
        onMessagePress={() => handleChatPress(item)}
        onPlayPress={() => { }}
        onTripSheetPress={() => {
          navigation.navigate('ViewMyTripsTripSheet', {
            from: 'myTrips',
            edit: item?.post_trip_trip_status == undefined ? false : true,
            postId: item?.post_booking_id,
          });
        }}
        isRequested={
          selectedFilterTwo === 'PostedTrips' && selectedFilterOne === 'InProgress'
            ? 'Delete'
            : item?.post_trip_trip_status || item?.request_status
        }
        packageName={item?.booking_package_name}
        postStatus={'Available'}
        isAvailable={true}
        showActionButtons={true}
      />
    );




  }





  return (
    <>
      <AppHeader
        drawerIcon={true}
        // groupIcon={true}
        // onlineIcon={true}
        // muteIcon={true}
        search={true}
      />
      {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
        My Trips
      </Text> */}
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
        {selectedFilterTwo === 'PostedTrips'
          ? 'Posted Trips'
          : selectedFilterTwo === 'Enquiry'
            ? 'Trip Dairy'
            : 'Received Trips'}
      </Text>

      <View style={styles.container}>
        <View style={styles.filterRow}>

        </View>


        {showFilters && (
          <>
            {selectedFilterTwo === 'Enquiry' ? (
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
            ) : (
              <>
                <View style={styles.filterRow2}>
                  <CustomSelect
                    text={selectedFilterTwo === 'PostedTrips' ? 'Confirmed' : 'Confirmed'}
                    isSelected={selectedFilterOne === 'Confirmed'}
                    onPress={() => setSelectedFilterOne('Confirmed')}
                  />
                  <CustomSelect
                    text="Pending"
                    isSelected={selectedFilterOne === 'InProgress'}
                    onPress={() => setSelectedFilterOne('InProgress')}
                  />
                  <View style={styles.bookingTypeContainer}>
                    <CustomSelect
                      text="Booking type"
                      isSelected={showLocationFilters}
                      onPress={() => setShowLocationFilters(!showLocationFilters)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowLocationFilters(!showLocationFilters)}
                      style={styles.filterIconContainer}
                    >
                      <ArrowDown />
                    </TouchableOpacity>
                  </View>
                </View>
                {showLocationFilters && (
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
                )}
              </>
            )}
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
  bookingTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterIconContainer: {
    padding: 5,
  },
});

export default MyTrips;

