// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   View,
//   Text,
// } from 'react-native';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import AddPostIcon from '../../../../assets/svgs/addPost.svg';
// import { useDispatch, useSelector } from 'react-redux';
// import { getUserDataSelector } from '../../../store/selectors';
// import { formatDate } from '../../../utils/formatdateUtil';
// import {
//   endSelfTrip,
//   fetchUserSelfPosts,
//   startSelfTrip,
// } from '../../../services/selfTripService';
// import PostCard from '../../../components/PostCard';
// import AppHeader from '../../../components/AppHeader';
// import CustomModal from '../../../components/ui/CustomModal';
// import TripSummaryModal from '../../../components/tripModals/TripSummaryModal';

// import TripProgressModal from '../../../components/tripModals/TripProgressModal';
// import ClosingDetailsModal from '../../../components/tripModals/ClosingDetailsModal';
// import CustomerSignatureModal from '../../../components/tripModals/CustomerSignatureModal';
// import AdditionalChargesModal from '../../../components/tripModals/AdditionalChargesModal';
// import {
//   closeForDay,
//   closeTrip,
//   fetchMultiDayTripDetails,
//   fetchTripDetails,
//   postAdditionCharges,
//   startTripMultiDay,
// } from '../../../services/MyTripsService';
// import axios from 'axios';
// import StartTripModal from '../../../components/tripModals/StartTripModal';

// const SelfTripHome = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const userData = useSelector(getUserDataSelector);
//   const userId = userData.userId;
//   const userToken = userData.userToken;
//   const [userSelfTripData, setUserSelfTripData] = useState([]);

//   const [showStartTripModal, setShowStartTripModal] = useState(false);

//   const [showTripProgressModal, setShowTripProgressModal] = useState(false);

//   const [showTripSummaryModal, setShowTripSummaryModal] = useState(false);
//   const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
//   const [navigateToBills, setNavigateToBills] = useState(false);

//   const [showCustomerSignatureModal, setShowCustomerSignatureModal] =
//     useState(false);
//   const [selectedTripData, setSelectedTripData] = useState(null);
//   // const [isGstClosingForDay, setIsGstClosingForDay] = useState(false);
//   // const [isGstSummaryValue, setIsGstSummaryValue] = useState(false);

//   const [tripSummaryData, setTripSummaryData] = useState(null);
//   const [tripType, setTripType] = useState('');
//   const [openingKms, setOpeningKms] = useState('');
//   const [openingTime, setOpeningTime] = useState('');
//   const [openingDate, setOpeningDate] = useState('');
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [closingKms, setClosingKms] = useState('');
//   const [closingTime, setClosingTime] = useState('');
//   const [closingDate, setClosingDate] = useState('');
//   // const [endDate, setEndDate] = useState('');
//   const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
//   const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
//   const [closingActionType, setClosingActionType] = useState('end');
//   const [finalDay, setFinalDay] = useState(false);
//   console.log({ finalDay })
//   const [additionalChargesData, setAdditionalChargesData] = useState(null);
//   const [additionalChargesDocs, setAdditionalChargesDocs] = useState(null);

//   useEffect(() => {
//     if (showStartTripModal) {
//       const today = new Date();
//       const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
//       if (showStartTripModal) setOpeningDate(formattedDate);

//     }
//   }, [showStartTripModal]);

//   useFocusEffect(
//     useCallback(() => {
//       getSelfTripPosts();
//     }, [userId, userToken]),
//   );

//   const getSelfTripPosts = async () => {
//     const response = await fetchUserSelfPosts(userId, userToken);

//     if (response.error === false) {
//       setUserSelfTripData(response.data);
//     }
//   };

//   const handleStartTrip = async () => {
//     const response = await startSelfTrip(
//       {
//         post_bookings_id: selectedTripData?.post_booking_id,
//         start_trip_kms: openingKms,
//         start_date: openingDate,
//         start_time: openingTime,
//         pick_up_address: selectedTripData?.pick_up_location || '',
//         destination: selectedTripData?.destination || '',
//         customer_name: selectedTripData?.user_name || '',
//         customer_phone_numb: selectedTripData?.user_phone || '',
//         posted_user_id: selectedTripData?.posted_user_id,
//         accepted_user_id: userId,
//       },
//       userToken,
//     );

//     if (response?.error === false) {
//       setShowStartTripModal(false);
//       setOpeningKms('');
//       setOpeningTime('');
//       setOpeningDate('');
//       setSelectedTripData(null);
//       setTripType('');
//       await getSelfTripPosts();
//     }
//   };

//   const handleContinueForNextDay = async () => {
//     setTripType('multiDay');
//     const response = await fetchMultiDayTripDetails(
//       selectedTripData?.post_booking_id,
//       userToken,
//     );

//     if (response.error === false) {
//       setTripSummaryData({
//         openingKms: response?.data?.start_trip_kms || '',
//         openingTime: response?.data?.start_time || '',
//         openingDate: response?.data?.start_date || '',
//         closingKms: response?.data?.end_trip_kms || '',
//         closingTime: response?.data?.end_trip_time || '',
//         closingDate: response?.data?.end_trip_date || closingDate,
//       });

//     }

//     if (
//       response?.error === false &&
//       response?.message === 'You need to close last day trip details'
//     ) {
//       if (response?.data?.end_trip_kms == null) {
//         setShowTripProgressModal(false);
//         setShowTripSummaryModal(true)
//         // setShowClosingDetailsModal(true);
//       } else if (response?.data?.is_additional === null) {
//         setShowTripProgressModal(false);
//         setShowAdditionalCharges(true);
//       }
//     } else {
//       if (response?.message === 'You have closed last day Trip ride data') {
//         setShowTripProgressModal(false);
//         setShowStartTripModal(true);
//       }
//     }
//   };

//   const handleButtonPress = (tripData) => {
//     setSelectedTripData(tripData);
//     setTripType('');
//     if (tripData?.request_status === 'Start Trip') {
//       setShowStartTripModal(true);
//     } else if (tripData?.request_status === 'On Duty') {
//       setShowTripProgressModal(true);
//     }
//   };

//   const handleCloseForDay = async () => {
//     const response = await closeForDay(
//       {
//         post_bookings_id: selectedTripData?.post_booking_id,
//         end_trip_kms: closingKms,
//         end_trip_date: closingDate,
//         end_trip_time: closingTime,
//         posted_user_id: selectedTripData?.posted_user_id,
//         accepted_user_id: userId,
//         // is_gst: isGstClosingForDay,
//       },
//       userToken,
//     );

//     if (response?.error === false) {
//       // setShowClosingDetailsModal(false);
//       setShowTripSummaryModal(false)
//       setClosingKms('');
//       setClosingTime('');
//       // setClosingDate('');
//       // setIsGst(true);
//       setShowAdditionalCharges(true);
//     }
//   };

//   const handleEndTrip = async () => {
//     setFinalDay(true);
//     setShowTripProgressModal(false);
//     // const tripDetails = await fetchTripDetails(
//     //   selectedTripData?.post_booking_id,
//     //   userToken,
//     // );

//     const tripDetails = await fetchMultiDayTripDetails(
//       selectedTripData?.post_booking_id,
//       userToken,
//     );
//     console.log({ tripDetails });

//     if (tripDetails?.error === false) {
//       setTripSummaryData({
//         openingKms: tripDetails?.data?.start_trip_kms || '',
//         openingTime: tripDetails?.data?.start_time || '',
//         openingDate: tripDetails?.data?.start_date || '',
//         closingKms: tripDetails?.data?.end_trip_kms || '',
//         closingTime: tripDetails?.data?.end_trip_time || '',
//         closingDate: tripDetails?.data?.end_trip_date || closingDate,
//       });
//       console.log('000', tripDetails?.data?.end_trip_kms?.length)
//       console.log('ddd', tripDetails?.data?.customer_signature)
//       if (
//         tripDetails?.data?.end_trip_kms?.length > 0 &&
//         tripDetails?.data?.customer_signature === null

//       ) {


//         setShowTripProgressModal(false);
//         setShowAdditionalCharges(true);

//       } else {
//         setShowTripProgressModal(false);
//         setShowTripSummaryModal(true);
//       }


//     }
//   };

//   const handleBackToTripProgress = () => {
//     // setShowClosingDetailsModal(false);
//     setShowTripSummaryModal(false)
//     setShowTripProgressModal(true);
//   };

//   const handleCloseTrip = async ({ closingKms, closingTime, closingDate }) => {
//     setClosingDate(closingDate)
//     const response = await endSelfTrip(
//       {
//         post_bookings_id: selectedTripData?.post_booking_id,
//         end_trip_kms: closingKms,
//         end_trip_date: closingDate,
//         end_trip_time: closingTime,
//         posted_user_id: userId,
//         accepted_user_id: userId,
//         // is_gst: isGstSummaryValue,
//       },
//       userToken,
//     );

//     if (response?.error === false) {
//       setShowTripSummaryModal(false);
//       setShowAdditionalCharges(true);
//     }
//   };
//   const handleMultiDayStart = async () => {
//     const finalData = {
//       post_bookings_id: selectedTripData?.post_booking_id,
//       start_time: openingTime,
//       start_trip_kms: openingKms,
//       start_date: openingDate,
//     };

//     const response = await startTripMultiDay(finalData, userToken);
//     if (response?.error === false) {
//       setShowStartTripModal(false);
//       setOpeningKms('');
//       setOpeningTime('');
//       setOpeningDate('');
//       setSelectedTripData(null);
//       setTripType('');
//       await getSelfTripPosts();
//     }
//   };

//   const handleAdditionalChargesNext = async (documents, charges) => {
//     let finalData = {
//       post_booking_id: selectedTripData?.post_booking_id,
//       advance: charges?.advance * 1,
//       parking: charges?.parking * 1,
//       tolls: charges?.tolls * 1,
//       state_tax: charges?.stateTax * 1,
//       cleaning: charges?.cleaning * 1,
//       night_batta: charges?.nightBatta * 1,
//       end_date: closingDate || tripSummaryData?.closingDate,
//     };

//     if (finalDay) {
//       finalData.end_trip = 'trip completing';
//     }
//     setAdditionalChargesData(finalData);
//     setAdditionalChargesDocs(documents);

//     if (!finalDay) {
//       console.log('hi');
//       console.log({ finalData });
//       const formData = new FormData();
//       formData.append('json', JSON.stringify(finalData));

//       // Group documents by fileNumber
//       if (documents && documents.length > 0) {
//         let groupedDocuments = {};

//         for (const doc of documents) {
//           if (!groupedDocuments[doc.fileNumber]) {
//             groupedDocuments[doc.fileNumber] = [];
//           }
//           groupedDocuments[doc.fileNumber].push({
//             uri: doc.uri,
//             type: doc.type,
//             name: doc.name,
//           });
//         }

//         // Append each file in correct format
//         for (const key in groupedDocuments) {
//           if (groupedDocuments[key].length > 0) {
//             for (const file of groupedDocuments[key]) {
//               if (file.uri) {
//                 formData.append(key, {
//                   uri: file.uri,
//                   type: file.type,
//                   name: file.name,
//                 });
//               }
//             }
//           }
//         }
//       }
//       const response = await postAdditionCharges(formData, userToken);

//       if (response?.error === false) {
//         setClosingDate(''), setShowAdditionalCharges(false);
//         setShowCustomerSignatureModal(true);
//       }
//     } else {
//       console.log('else')
//       setShowAdditionalCharges(false);
//       setShowCustomerSignatureModal(true);

//     }
//   };

//   const handleAddPost = () => {
//     navigation.navigate('CreateSelfTrip');
//   };
//   const renderSelfPostCard = ({ item }) => (
//     <PostCard
//       // Card Header Props
//       bookingType={item?.bookingType_name}
//       createdAt={formatDate(item?.created_at)}
//       postStatus={item?.post_status}
//       userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
//       userName={item?.User_name}
//       // Trip Details Props
//       pickUpTime={item?.pick_up_time}
//       fromDate={item?.from_date}
//       vehicleType={item?.Vehicle_type_name}
//       vehicleName={item?.Vehicle_name}
//       pickUpLocation={item?.pick_up_location}
//       destination={item?.destination}
//       // Comment/Voice Props
//       postComments={item?.post_comments}
//       postVoiceMessage={item?.post_voice_message}
//       // Amount Props
//       baseFareRate={item?.bookingTypeTariff_base_fare_rate}
//       Action
//       Props
//       onRequestPress={() => handleButtonPress(item)}
//       onTripSheetPress={() => {
//         navigation.navigate('ViewTripSheet', {
//           from: 'selfTrips',
//           postId: item?.post_booking_id,
//         });
//       }}
//       isRequested={item?.request_status}
//       packageName={item?.bookingTypePackage_name}
//     />
//   );

//   return (
//     <>
//       <View style={styles.container}>
//         <AppHeader
//           drawerIcon={true}
//           groupIcon={true}
//           onlineIcon={true}
//           muteIcon={true}
//           search={true}
//         />
//         <Text
//           style={{
//             textAlign: 'center',
//             fontWeight: 'bold',
//             fontSize: 20,
//             marginBottom: 10,
//           }}
//         >
//           Own Booking
//         </Text>

//         <FlatList
//           data={userSelfTripData} // Ensure this is defined or passed as a prop
//           renderItem={renderSelfPostCard} // Ensure this function is defined
//           keyExtractor={(item) => item.post_booking_id.toString()}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />

//         <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
//           <AddPostIcon />
//         </TouchableOpacity>

//         <CustomModal
//           visible={showStartTripModal}
//           onPrimaryAction={handleStartTrip}
//           onSecondaryAction={() => setShowStartTripModal(false)}
//           hideButtons={true}
//         >
//           <StartTripModal
//             openingKms={openingKms}
//             setOpeningKms={setOpeningKms}
//             openingTime={openingTime}
//             setOpeningTime={setOpeningTime}
//             openingDate={openingDate}
//             setOpeningDate={setOpeningDate}
//             handleStartTrip={
//               tripType === 'multiDay' ? handleMultiDayStart : handleStartTrip
//             }
//             showTimePicker={showTimePicker}
//             setShowTimePicker={setShowTimePicker}
//             showDatePicker={showDatePicker}
//             setShowDatePicker={setShowDatePicker}
//             onClose={() => setShowStartTripModal(false)}
//           />
//         </CustomModal>

//         <CustomModal visible={showTripProgressModal}>
//           <TripProgressModal
//             handleContinueForNextDay={handleContinueForNextDay}
//             handleEndTrip={handleEndTrip}
//             onClose={() => setShowTripProgressModal(false)}
//             transfer={selectedTripData?.bookingType_name === 'Transfer'}
//           />
//         </CustomModal>



//         <CustomModal visible={showTripSummaryModal}>
//           <TripSummaryModal
//             tripSummaryData={tripSummaryData}
//             setShowTripSummaryModal={setShowTripSummaryModal}
//             setShowAdditionalCharges={setShowAdditionalCharges}
//             // setIsGstSummaryValue={setIsGstSummaryValue}
//             onPressNext={(closingDetails) => {
//               handleCloseTrip({
//                 closingKms: closingDetails.closingKms,
//                 closingTime: closingDetails.closingTime,
//                 closingDate: closingDetails.closingDate,
//               });
//             }}
//             onClose={() => setShowTripSummaryModal(false)}
//           />
//         </CustomModal>

//         <CustomModal visible={showAdditionalCharges}>
//           <AdditionalChargesModal
//             onNext={handleAdditionalChargesNext}
//             onClose={() => setShowAdditionalCharges(false)}
//           />
//         </CustomModal>

//         <CustomModal
//           visible={showCustomerSignatureModal}
//           onSecondaryAction={() => setShowCustomerSignatureModal(false)}
//         >
//           <CustomerSignatureModal
//             selectedTripData={selectedTripData}
//             userToken={userToken}
//             userId={userId}
//             onClose={() => setShowCustomerSignatureModal(false)}
//             fetch={getSelfTripPosts}
//             goTo={navigateToBills}
//             additionalCharges={
//               finalDay ? { additionalChargesData, additionalChargesDocs } : null
//             }
//           />
//         </CustomModal>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F0F0',
//   },
//   list: {
//     flexGrow: 1,
//   },

//   // paddingBottom: 16,

//   floatingButton: {
//     position: 'absolute',
//     bottom: 50,
//     right: 20,
//     backgroundColor: '#007AFF',
//     borderRadius: 50,
//     padding: 10,
//     marginTop: 30,
//   },
// });

// export default SelfTripHome;


import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
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
  startTripMultiDay,
} from '../../../services/MyTripsService';
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

  const [showTripSummaryModal, setShowTripSummaryModal] = useState(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [navigateToBills, setNavigateToBills] = useState(false);

  const [showCustomerSignatureModal, setShowCustomerSignatureModal] =
    useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);
  // const [isGstClosingForDay, setIsGstClosingForDay] = useState(false);
  // const [isGstSummaryValue, setIsGstSummaryValue] = useState(false);

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
  // const [endDate, setEndDate] = useState('');
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
  const [closingActionType, setClosingActionType] = useState('end');
  const [finalDay, setFinalDay] = useState(false);
  console.log({ finalDay })
  const [additionalChargesData, setAdditionalChargesData] = useState(null);
  console.log('ooo', additionalChargesData)
  const [additionalChargesDocs, setAdditionalChargesDocs] = useState(null);

  useEffect(() => {
    if (showStartTripModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      if (showStartTripModal) setOpeningDate(formattedDate);

    }
  }, [showStartTripModal]);

  useFocusEffect(
    useCallback(() => {
      getSelfTripPosts();
    }, [userId, userToken]),
  );

  const getSelfTripPosts = async () => {
    const response = await fetchUserSelfPosts(userId, userToken);

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
        // is_gst: isGstClosingForDay,
      },
      userToken,
    );

    if (response?.error === false) {
      // setShowClosingDetailsModal(false);
      setShowTripSummaryModal(false)
      setClosingKms('');
      setClosingTime('');
      // setClosingDate('');
      // setIsGst(true);
      setShowAdditionalCharges(true);
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
      console.log('000', tripDetails?.data?.end_trip_kms?.length)
      console.log('ddd', tripDetails?.data?.customer_signature)
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

  const handleCloseTrip = async ({ closingKms, closingTime, closingDate }) => {
    setClosingDate(closingDate)
    const response = await endSelfTrip(
      {
        post_bookings_id: selectedTripData?.post_booking_id,
        end_trip_kms: closingKms,
        end_trip_date: closingDate,
        end_trip_time: closingTime,
        posted_user_id: userId,
        accepted_user_id: userId,
        // is_gst: isGstSummaryValue,
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
    console.log('qqq', finalData)
    if (finalDay) {
      finalData.end_trip = 'trip completing';
    }
    setAdditionalChargesData(finalData);
    setAdditionalChargesDocs(documents);

    if (!finalDay) {
      // console.log('hi');
      console.log('eee',);
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
      console.log('sss', response)
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


  const handleAddPost = () => {
    navigation.navigate('CreateSelfTrip');
  };

  // Update the onTripSheetPress handler
  const onTripSheetPress = (item) => {
    if (item?.post_booking_id) {
      navigation.navigate('ViewTripSheet', {
        from: 'selfTrips',
        postId: item.post_booking_id,
        isSelfTrip: true,
        tripData: item,// Pass the trip data
        returnScreen: 'SelfTripHome',
      });
    }
  };
  const renderSelfPostCard = ({ item }) => (
    <PostCard
      // ... existing props ...
      bookingType={item?.bookingType_name}
      createdAt={formatDate(item?.created_at)}
      postStatus={item?.post_status}
      userProfilePic={item?.User_profile || 'https://via.placeholder.com/150'}
      userName={item?.User_name}
      pickUpTime={item?.pick_up_time}
      fromDate={item?.from_date}
      vehicleType={item?.Vehicle_type_name}
      vehicleName={item?.Vehicle_name}
      pickUpLocation={item?.pick_up_location}
      destination={item?.destination}
      postComments={item?.post_comments}
      postVoiceMessage={item?.post_voice_message}
      baseFareRate={item?.bookingTypeTariff_base_fare_rate}
      // Add call functionality
      onCallPress={() => handleCall(item?.user_phone || item?.User?.u_phone)}
      showCallButton={true}
      userPhone={item?.user_phone || item?.User?.u_phone}
      // ... rest of the props ...
      onRequestPress={() => handleButtonPress(item)}
      onTripSheetPress={() => {
        navigation.navigate('ViewTripSheet', {
          from: 'selfTrips',
          postId: item?.post_booking_id,
          isSelfTrip: true,
          tripData: item,
          returnScreen: 'SelfTripHome'
        });
      }}
      isRequested={item?.request_status}
      packageName={item?.bookingTypePackage_name}
    />
  );

  return (
    <>
      <View style={styles.container}>
        <AppHeader
          drawerIcon={true}
        // groupIcon={true}
        // onlineIcon={true}
        // muteIcon={true}
        // search={true}
        />
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Own Booking
        </Text>

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
          hideButtons={true}
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

        <CustomModal visible={showTripProgressModal}>
          <TripProgressModal
            handleContinueForNextDay={handleContinueForNextDay}
            handleEndTrip={handleEndTrip}
            onClose={() => setShowTripProgressModal(false)}
            transfer={selectedTripData?.bookingType_name === 'Transfer'}
          />
        </CustomModal>



        <CustomModal visible={showTripSummaryModal}>
          <TripSummaryModal
            tripSummaryData={tripSummaryData}
            setShowTripSummaryModal={setShowTripSummaryModal}
            setShowAdditionalCharges={setShowAdditionalCharges}
            // setIsGstSummaryValue={setIsGstSummaryValue}
            onPressNext={(closingDetails) => {
              handleCloseTrip({
                closingKms: closingDetails.closingKms,
                closingTime: closingDetails.closingTime,
                closingDate: closingDetails.closingDate,
              });
            }}
            onClose={() => setShowTripSummaryModal(false)}
          />
        </CustomModal>

        <CustomModal visible={showAdditionalCharges}>
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
            fetch={getSelfTripPosts}
            goTo={navigateToBills}
            additionalCharges={
              finalDay ? { additionalChargesData, additionalChargesDocs } : null
            }
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
  list: {
    flexGrow: 1,
  },

  // paddingBottom: 16,

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

