

import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AddPostIcon from '../../../../assets/svgs/addPost.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { formatDate } from '../../../utils/formatdateUtil';
import {
  endSelfTrip,
  fetchUserSelfPosts,
  startSelfTrip,
} from '../../../services/selfTripService';
import PostCard from '../../../components/PostCard';
import AppHeader from '../../../components/AppHeader';
import CustomModal from '../../../components/ui/CustomModal';
import TripSummaryModal from '../../../components/tripModals/TripSummaryModal';

import TripProgressModal from '../../../components/tripModals/TripProgressModal';
import ClosingDetailsModal from '../../../components/tripModals/ClosingDetailsModal';
import CustomerSignatureModal from '../../../components/tripModals/CustomerSignatureModal';
import AdditionalChargesModal from '../../../components/tripModals/AdditionalChargesModal';
import {
  closeForDay,
  closeTrip,
  fetchMultiDayTripDetails,
  fetchTripDetails,
  postAdditionCharges,

} from '../../../services/MyTripsService'
import axios from 'axios';
import StartTripModal from '../../../components/tripModals/StartTripModal';

const SelfTripHome = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;
  const [userSelfTripData, setUserSelfTripData] = useState([]);
  const [showStartTripModal, setShowStartTripModal] = useState(false);


  const [showTripProgressModal, setShowTripProgressModal] = useState(false);
  const [showClosingDetailsModal, setShowClosingDetailsModal] = useState(false);
  const [showTripSummaryModal, setShowTripSummaryModal] = useState(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [showCustomerSignatureModal, setShowCustomerSignatureModal] =
    useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);

  const [tripSummaryData, setTripSummaryData] = useState(null);
  const [tripType, setTripType] = useState('');
  const [openingKms, setOpeningKms] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [closingKms, setClosingKms] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
  const [closingActionType, setClosingActionType] = useState('end');

  useEffect(() => {
    if (showStartTripModal || showClosingDetailsModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      if (showStartTripModal) setOpeningDate(formattedDate);
      if (showClosingDetailsModal) setClosingDate(formattedDate);
    }
  }, [showStartTripModal, showClosingDetailsModal]);

  useFocusEffect(
    useCallback(() => {
      getSelfTripPosts();
    }, [userId, userToken]),
  );




  const getSelfTripPosts = async () => {
    const response = await fetchUserSelfPosts(userId, userToken);
    console.log('response', response)

    if (response.error === false) {
      setUserSelfTripData(response.data);
    }
  };

  const handleStartTrip = async () => {
    const response = await startSelfTrip(
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
      setTripType('');
      await getSelfTripPosts();
    }
  };

  const handleContinueForNextDay = async () => {
    setTripType('multiDay');
    const response = await fetchMultiDayTripDetails(
      selectedTripData?.post_booking_id,
      userToken,
    )
    console.log('response', response);

    if (
      response?.error === false &&
      response?.message === 'You need to close last day trip details'
    ) {
      setShowTripProgressModal(false);
      setShowClosingDetailsModal(true);
    } else {
      if (response?.message === 'You have closed last day Trip ride data') {
        setShowTripProgressModal(false);
        setShowStartTripModal(true);
      }
    }
  };

  const handleButtonPress = (tripData) => {

    setSelectedTripData(tripData);
    setTripType('');
    if (tripData?.request_status === 'Start Trip') {
      setShowStartTripModal(true);
    } else if (tripData?.request_status === 'On Duty') {
      setShowTripProgressModal(true);
    }
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
      },
      userToken,
    );

    if (response?.error === false) {
      setShowClosingDetailsModal(false);
      setClosingKms('')
      setClosingTime('')
      setClosingDate('')
    }
  };


  const handleEndTrip = async () => {
    setShowTripProgressModal(false);
    const tripDetails = await fetchTripDetails(
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
        closingDate: tripDetails?.data?.end_trip_date || '',
      });

      setShowTripSummaryModal(true);
      setClosingKms('');
      setClosingTime('');
      setClosingDate('');
    }
  };

  const handleBackToTripProgress = () => {
    setShowClosingDetailsModal(false);
    setShowTripProgressModal(true);
  };

  const handleCloseTrip = async ({ closingKms, closingTime, closingDate }) => {
    const response = await closeTrip(
      {
        post_bookings_id: selectedTripData?.post_booking_id,
        end_trip_kms: closingKms,
        end_trip_date: closingDate,
        end_trip_time: closingTime,
        posted_user_id: selectedTripData?.posted_user_id,
        accepted_user_id: userId,
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
      await getSelfTripPosts();
    }
  };

  const handleAdditionalChargesNext = async (documents, charges) => {
    const finalData = {
      post_booking_id: selectedTripData?.post_booking_id,
      advance: charges?.advance,
      parking: charges?.parking,
      tolls: charges?.tolls,
      state_tax: charges?.stateTax,
      cleaning: charges?.cleaning,
      night_batta: charges?.nightBatta,
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData));

    documents.forEach((doc) => {
      formData.append(doc.fileNumber, {
        uri: doc.uri,
        type: doc.type,
        name: doc.name,
      });
    });

    const response = await postAdditionCharges(formData, userToken);

    if (response?.error === false) {
      setShowAdditionalCharges(false);
      setShowCustomerSignatureModal(true);
    }
  };

  const handleAddPost = () => {
    navigation.navigate('CreateSelfTrip');
  };
  const renderSelfPostCard = ({ item }) => (
    <PostCard
      // Card Header Props
      bookingType={item?.bookingType_name}
      createdAt={formatDate(item?.created_at)}
      postStatus={item?.post_status}
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
      onRequestPress={() => handleButtonPress(item)}
      onPlayPress={() => {
        /* TODO: Implement voice message playback */
      }}
      onMessagePress={() => {
        /* TODO: Implement messaging */
      }}
      // isRequested={item?.request_status}
      packageName={item?.bookingTypePackage_name}
    />
  );

  return (
    <>
      <View style={styles.container}>
        <AppHeader
          drawerIcon={true}
          groupIcon={true}
          onlineIcon={true}
          muteIcon={true}

          search={true}
        />
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Self Trips</Text>

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
          />
        </CustomModal>

        <CustomModal
          visible={showTripProgressModal}
          onSecondaryAction={() => setShowTripProgressModal(false)}
        >
          <TripProgressModal
            handleContinueForNextDay={handleContinueForNextDay}
            handleEndTrip={handleEndTrip}
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
            handleCloseTrip={handleCloseTrip}
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
            onPressNext={(closingDetails) => {

              handleCloseTrip(
                closingDetails.closingKms,
                closingDetails.closingTime,
                closingDetails.closingDate,
              )
            }}
          />
        </CustomModal>

        <CustomModal
          visible={showAdditionalCharges}
          onSecondaryAction={() => setShowAdditionalCharges(false)}
        >
          <AdditionalChargesModal onNext={handleAdditionalChargesNext} />
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
            fetch={getSelfTripPosts}
          />
        </CustomModal>
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
