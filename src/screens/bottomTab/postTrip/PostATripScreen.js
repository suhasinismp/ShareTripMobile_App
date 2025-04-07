


import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import MicIcon from '../../../../assets/svgs/mic.svg';
import AppHeader from '../../../components/AppHeader';
import CustomButton from '../../../components/ui/CustomButton';
import CustomInput from '../../../components/ui/CustomInput';
import CustomSelect from '../../../components/ui/CustomSelect';
import CustomText from '../../../components/ui/CustomText';
import { useTheme } from '../../../hooks/useTheme';
import {
  createPost,
  fetchTripByPostId,
  fetchTripSheetByPostId,
  getTripTypes,
  generateTripPdf,
  updatePost,
  fetchTripTable,
  updateViewTripBillTable,
} from '../../../services/postTripService';
import {
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../../services/vehicleDetailsService';
import {
  getTripDetailsSelector,
  getUserDataSelector,
  getSelfTripDetailsSelector,
} from '../../../store/selectors';
import AudioContainer from '../../../components/AudioContainer';
import TimeDatePicker from '../../../components/TimeDatePicker';
import { cleanHTML } from '../../../utils/cleanHTML';
import {
  getMyDutiesBill,
  getMyPostedTripBills,
  getMySelfTripBills,
} from '../../../services/billService';
import { parseTime } from '../../../utils/parseTimeUtil';
import { parseDate } from '../../../utils/parseDate';
import { Feather } from '@expo/vector-icons';
import CustomModal from '../../../components/ui/CustomModal';
import TripBillEditModal from '../../../components/tripModals/TripBillEditModal';
import { showSnackbar } from '../../../store/slices/snackBarSlice';
// import { Feather } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

// Constants
const SHARE_TYPE_DATA = [
  { label_id: 1, label_value: 'Public' },
  { label_id: 2, label_value: 'Group' },
  { label_id: 3, label_value: 'Contact' },
];

const PAYMENT_TYPES = {
  CASH: 'Cash',
  CREDIT: 'Credit',
};

const POST_TYPES = {
  QUICK_SHARE: 'Quick Share',
  TRIP_SHEET: 'Trip Sheet',
};


// Replace the existing TripCard component with this one
const TripCard = React.memo(({ tripData, index, onEdit }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <CustomText text={`Day ${index + 1}`} style={styles.dayText} />
        <View style={styles.headerRight}>
          <CustomText
            text={tripData.start_date || '-'}
            style={styles.dateText}
          />
          <TouchableOpacity
            onPress={() => onEdit(tripData)}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={16} color="#008B8B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.timeSection}>
          <CustomText text="Total Time:" style={styles.labelText} />
          <CustomText
            text={`${tripData.start_time || '-'} to ${tripData.end_time || '-'}`}
            style={styles.valueText}
          />
        </View>
        <View style={styles.totalSection}>
          <CustomText text="Total hrs:" style={styles.labelText} />
          <CustomText text={tripData.total_hours} style={styles.valueText} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.timeSection}>
          <CustomText text="Total KMs:" style={styles.labelText} />
          <CustomText
            text={`${tripData.start_kms || '-'} - ${tripData.end_kms || '-'}`}
            style={styles.valueText}
          />
        </View>
        <View style={styles.totalSection}>
          <CustomText text="Total:" style={styles.labelText} />
          <CustomText
            text={
              tripData.total_kms === 'NaN' ? '-' : `${tripData.total_kms} KMs`
            }
            style={styles.valueText}
          />
        </View>
      </View>
    </View>
  );
});

TripCard.displayName = 'TripCard';
// const TripCard = React.memo(({ tripData, index, onEdit }) => {
//   const handleEdit = () => {
//     onEdit(tripData);
//   };

//   return (
//     <View style={styles.cardContainer}>
//       {/* Header with Day number, Date and Edit icon */}
//       <View style={styles.cardHeader}>
//         <CustomText text={`Day ${index + 1}`} style={styles.dayText} />
//         <View style={styles.headerRight}>
//           <CustomText
//             text={tripData.start_date || '-'}
//             style={styles.dateText}
//           />
//           <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
//             <Feather name="edit-2" size={16} color="#008B8B" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Trip Time Section */}
//       <View style={styles.infoRow}>
//         <View style={styles.timeSection}>
//           <CustomText text="Trip Time:" style={styles.labelText} />
//           <CustomText
//             text={`${tripData.start_time || '-'} to ${tripData.end_time || '-'}`}
//             style={styles.valueText}
//           />
//         </View>
//         <View style={styles.totalSection}>
//           <CustomText text="Duration:" style={styles.labelText} />
//           <CustomText text={tripData.total_hours} style={styles.valueText} />
//         </View>
//       </View>

//       {/* Trip KMs Section */}
//       <View style={styles.infoRow}>
//         <View style={styles.timeSection}>
//           <CustomText text="Trip KMs:" style={styles.labelText} />
//           <CustomText
//             text={`${tripData.start_kms || '-'} - ${tripData.end_kms || '-'}`}
//             style={styles.valueText}
//           />
//         </View>
//         <View style={styles.totalSection}>
//           <CustomText text="Total:" style={styles.labelText} />
//           <CustomText
//             text={
//               tripData.total_kms === 'NaN' ? '-' : `${tripData.total_kms} KMs`
//             }
//             style={styles.valueText}
//           />
//         </View>
//       </View>
//     </View>
//   );
// });

// TripCard.displayName = 'TripCard';

// Memoized Vehicle Button Component
const VehicleButton = React.memo(
  ({ item, isSelected, onPress, imageKey, nameKey }) => (
    <View style={styles.vehicleButtonContainer}>
      <TouchableOpacity
        style={[
          styles.vehicleButton,
          isSelected && styles.selectedVehicleButton,
        ]}
        onPress={onPress}
      >
        <Image
          source={{ uri: item[imageKey] }}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <CustomText text={item[nameKey]} style={styles.vehicleText} />
    </View>
  ),
);

VehicleButton.displayName = 'VehicleButton';

const PostATripScreen = ({ route }) => {
  const { from, postId, isSelfTrip, tripData } = route.params || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(getUserDataSelector);
  const tripDetails = useSelector(getTripDetailsSelector);
  const selfTripDetails = useSelector(getSelfTripDetailsSelector);
  const { userToken, userId } = userData;
  const { theme } = useTheme();

  // Form Data States
  const [postType, setPostType] = useState(POST_TYPES.QUICK_SHARE);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [visitingPlace, setVisitingPlace] = useState('');
  const [notes, setNotes] = useState('');
  const [rate, setRate] = useState('');

  const [extraKms, setExtraKms] = useState('');

  const [extraHours, setExtraHours] = useState('');
  const [dayBatta, setDayBatta] = useState('');
  const [nightBatta, setNightBatta] = useState('');
  const [slabKms, setSlabKms] = useState('');
  const [startTripKms, setStartTripKms] = useState('');
  const [endTripKms, setEndTripKms] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTripTime, setEndTripTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endTripDate, setEndTripDate] = useState('');
  const [tripTableData, setTripTableData] = useState(null);
  const [showTripBillEditModal, setShowTripBillEditModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Selection States
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState(null);
  const [selectedShareType, setSelectedShareType] = useState(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState(
    PAYMENT_TYPES.CASH,
  );

  // Date and Time States
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Data States
  const [tripTypes, setTripTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [allVehicleNames, setAllVehicleNames] = useState([]);
  const [filteredVehicleNames, setFilteredVehicleNames] = useState([]);
  const [initialData, setInitialData] = useState(null);

  // UI States
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add this with other state declarations
  const [selectedTripCardId, setSelectedTripCardId] = useState(null);

  const resetFields = () => {
    setCustomerName('');
    setCustomerPhone('');
    setIsRecording(false);
    setRecordedAudioUri(null);
    setMessage('');
    setNotes('');
    setSelectedPaymentType('Cash');
    setSelectedFromDate(new Date());
    setSelectedToDate(new Date());
    setSelectedTime(new Date());
    setSelectedTripType(null);
    setSelectedPackage(null);
    // setModalVisible(false);
    setPickupLocation('');
    setDropLocation('');
    setVisitingPlace('');
    // setSelfTripTypes('');
    setRate('');
    setExtraKms('');
    setExtraHours('');
    setDayBatta('');
    setNightBatta('');
    setSlabKms('');
  }

  // Effects
  useEffect(() => {
    if (selectedVehicleType) {
      const filtered = allVehicleNames.filter(
        (vehicle) => vehicle.vehicle_types_id === selectedVehicleType,
      );
      setFilteredVehicleNames(filtered);
      setSelectedVehicleName(filtered[0]?.id);
    } else {
      setFilteredVehicleNames([]);
      setSelectedVehicleName(null);
    }
  }, [selectedVehicleType, allVehicleNames]);

  // useEffect(() => {
  //   const initializeScreen = async () => {
  //     if (from !== undefined) {
  //       setPostType(POST_TYPES.TRIP_SHEET);
  //       await getTripSheetDetails();
  //     }
  //     await fetchConstants();
  //     if (from === 'bills') {
  //       await getTripTable();
  //     }
  //   };

  //   initializeScreen();
  // }, [from, postId]);


  useEffect(() => {
    const initializeScreen = async () => {
      if (from !== undefined) {
        setPostType(POST_TYPES.TRIP_SHEET);

        if (tripData) {
          // Use the passed trip data
          setInitialData(tripData);
        } else if (isSelfTrip) {
          // Use self trip data from Redux
          if (selfTripDetails) {
            setInitialData(selfTripDetails);
          }
        } else {
          await getTripSheetDetails();
        }
      }
      await fetchConstants();
    };

    initializeScreen();
  }, [from, postId, isSelfTrip, tripData, selfTripDetails]);

  useEffect(() => {
    if (from === 'bills' && postId) {
      getTripTable();
    }
  }, [from, postId]);

  useEffect(() => {
    if (tripTypes.length > 0) {
      const localTripType = tripTypes.find(
        (trip) => trip.booking_type_name === 'Local',
      );
      if (localTripType) {
        setSelectedTripType(localTripType.id);
        const packages = localTripType.bookingTypePackageAsBookingType;
        if (packages.length > 0) {
          setSelectedPackage(packages[0].id);
        }
      }
    }
  }, [tripTypes]);

  useEffect(() => {


    if (initialData) {

      const data = initialData[0] || initialData;


      // Set trip type and package
      setSelectedTripType(data.booking_type_id || data.bookingType_id);
      setSelectedPackage(data.booking_types_package_id || data.bookingTypePackage_id);

      // Set vehicle details
      setSelectedVehicleType(data.vehicle_type_id || data.VehicleTypes_id);
      setSelectedVehicleName(data.vehicle_name_id || data.VehicleNames_id);

      // Set customer details
      setCustomerName(data.customer_name || '');
      setCustomerPhone(data.customer_phone_no || '');

      // Set locations
      setPickupLocation(data.pick_up_location || '');
      setDropLocation(data.destination || '');
      setVisitingPlace(data.visiting_place || '');

      // Set dates and time
      setSelectedFromDate(parseDate(data.from_date));
      setSelectedToDate(parseDate(data.to_date));
      setSelectedTime(parseTime(data.pick_up_time));

      // Set payment and notes
      setSelectedPaymentType(data.payment_type || PAYMENT_TYPES.CASH);
      setNotes(data.note_1 || '');

      // Set rates
      setRate(data.tripSheetFinal?.[0]?.base_fare_rate?.toString() || '');

      setExtraKms(data.tripSheetFinal?.[0]?.extra_km_rate?.toString() || '');
      setExtraHours(data.tripSheetFinal?.[0]?.extra_hr_rate?.toString() || '');

      setDayBatta(data.day_batta_rate?.toString() || '');
      setNightBatta(data.night_batta_rate?.toString() || '');

      // Set message if exists
      if (data.post_comments) {
        setMessage(data.post_comments);
      }
    }
  }, [initialData]);

  // API Functions
  const fetchConstants = async () => {
    setIsLoading(true);
    try {
      const [tripTypesResponse, vehicleTypesResponse, vehicleNamesResponse] =
        await Promise.all([
          getTripTypes(userToken),
          fetchVehicleTypes(userToken),
          fetchVehicleNames(userToken),
        ]);

      if (!tripTypesResponse.error) setTripTypes(tripTypesResponse.data);
      if (!vehicleTypesResponse.error)
        setVehicleTypes(vehicleTypesResponse.data);
      if (!vehicleNamesResponse.error) {
        setAllVehicleNames(vehicleNamesResponse.data);
        setFilteredVehicleNames([]);
      }
    } catch (error) {
      console.error('Error fetching constants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTripSheetDetails = async () => {
    setIsLoading(true);
    try {
      const response =
        from === 'bills'
          ? await fetchTripByPostId(postId, userToken)
          : await fetchTripSheetByPostId(postId, userToken);

      if (!response.error) {
        setInitialData(response.data);
      }
    } catch (error) {
      console.error('Error fetching trip sheet details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTripTable = async () => {
    const response = await fetchTripTable(postId, userToken);

    if (response?.error === false) {
      setTripTableData(response?.data?.tripSheetRide);
    }
  };

  // const handleTripBillEdit = async () => {
  //   try {
  //     const finalData = {
  //       id: selectedTripCardId,
  //       post_booking_id: postId,
  //       start_trip_kms: startTripKms,
  //       start_date: startDate,
  //       start_time: startTime,
  //       end_trip_date: endTripDate || startDate,
  //       end_trip_time: endTripTime,
  //       end_trip_kms: endTripKms,
  //     };
  //     // console.log('Final Data:', finalData);
  //     const response = await updateViewTripBillTable(finalData, userToken);
  //     console.log('Response:', response);
  //     if (response?.error === false) {
  //       dispatch(showSnackbar({
  //         message: 'Trip details updated successfully',
  //         type: 'success',
  //       }));
  //       setShowTripBillEditModal(false);
  //       await getTripTable(); // Refresh the trip table data
  //     } else {
  //       dispatch(showSnackbar({
  //         message: response?.message || 'Failed to update trip details',
  //         type: 'error',
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('Error updating trip details:', error);
  //     dispatch(showSnackbar({
  //       message: 'Failed to update trip details',
  //       type: 'error',
  //     }));
  //   }
  // };


  // Event Handlers
  const handleTripBillEdit = async () => {
    try {
      // Validate required fields
      if (!startTripKms || !startDate || !startTime || !endTripKms || !endTripTime) {
        throw new Error('Please fill all required fields');
      }

      // Validate KMs (end KMs should be greater than start KMs)
      if (Number(endTripKms) <= Number(startTripKms)) {
        throw new Error('End KMs must be greater than Start KMs');
      }

      const finalData = {
        id: selectedTripCardId,
        post_booking_id: postId,
        start_trip_kms: startTripKms.toString(),
        start_date: startDate,
        start_time: startTime,
        end_trip_date: endTripDate || startDate,
        end_trip_time: endTripTime,
        end_trip_kms: endTripKms.toString(),
        total_kms: (Number(endTripKms) - Number(startTripKms)).toString(),
      };

      const response = await updateViewTripBillTable(finalData, userToken);

      if (!response) {
        throw new Error('No response from server');
      }

      if (response?.error === false) {
        dispatch(showSnackbar({
          message: response.message || 'Trip details updated successfully',
          type: 'success',
        }));
        setShowTripBillEditModal(false);
        await getTripTable();
      } else {
        throw new Error(response?.message || 'Failed to update trip details');
      }
    } catch (error) {
      console.error('Error updating trip details:', error);
      dispatch(showSnackbar({
        message: error.message || 'Failed to update trip details',
        type: 'error',
      }));
    }
  };

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleStopRecording = useCallback((uri) => {
    setIsRecording(false);
    setRecordedAudioUri(uri);
  }, []);

  const handleDeleteRecording = useCallback(() => {
    setRecordedAudioUri(null);
  }, []);

  const handleFromDateChange = useCallback((newDate) => {
    setSelectedFromDate(newDate);
  }, []);

  const handleToDateChange = useCallback((newDate) => {
    setSelectedToDate(newDate);
  }, []);

  const handleTimeChange = useCallback((newTime) => {
    setSelectedTime(newTime);
  }, []);

  const validateMandatoryFields = (fields, postType) => {
    // For Quick Share
    if (postType === POST_TYPES.QUICK_SHARE) {
      const mandatoryFields = [
        {
          value: fields.selectedTripType,
          message: 'Please select a trip type.',
        },
        { value: fields.selectedPackage, message: 'Please select a package.' },
        {
          value: fields.selectedVehicleType,
          message: 'Please select a vehicle type.',
        },
        {
          value: fields.selectedVehicleName,
          message: 'Please select a vehicle name.',
        },
        {
          value: fields.selectedShareType,
          message: 'Please select a share type.',
        },
      ];

      // Additional validation for message or audio
      if (!fields.message && !fields.recordedAudioUri) {
        return {
          isValid: false,
          errorMessage: 'Please enter a message or record an audio.',
        };
      }

      for (const field of mandatoryFields) {
        if (!field.value) {
          return { isValid: false, errorMessage: field.message };
        }
      }
    }
    // For Trip Sheet
    else if (postType === POST_TYPES.TRIP_SHEET) {
      const mandatoryFields = [
        {
          value: fields.selectedTripType,
          message: 'Please select a trip type.',
        },
        { value: fields.selectedPackage, message: 'Please select a package.' },
        {
          value: fields.selectedVehicleType,
          message: 'Please select a vehicle type.',
        },
        {
          value: fields.selectedVehicleName,
          message: 'Please select a vehicle name.',
        },
      ];

      for (const field of mandatoryFields) {
        if (!field.value) {
          return { isValid: false, errorMessage: field.message };
        }
      }
    }

    return { isValid: true, errorMessage: '' };
  };

  const handleSend = async () => {
    // Validation based on postType
    const { isValid, errorMessage } = validateMandatoryFields(
      {
        selectedTripType,
        selectedPackage,
        selectedVehicleType,
        selectedVehicleName,
        selectedShareType,
        message,
        recordedAudioUri,
      },
      postType,
    );

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // Prepare base data with mandatory fields
    let finalData = {
      posted_user_id: userId,
      post_status: 'Available',
      booking_type_id: selectedTripType,
      booking_types_package_id: selectedPackage,
      vehicle_type_id: selectedVehicleType,
      vehicle_name_id: selectedVehicleName,
      post_type_id: selectedShareType,
    };

    // Add message for Quick Share
    if (postType === POST_TYPES.QUICK_SHARE && message) {
      finalData.post_comments = message;
    }

    // Add optional fields for Trip Sheet
    if (postType === POST_TYPES.TRIP_SHEET) {
      if (customerName) finalData.customer_name = customerName;
      if (customerPhone) finalData.customer_phone_no = customerPhone;
      if (pickupLocation) finalData.pick_up_location = pickupLocation;
      if (dropLocation) finalData.destination = dropLocation;
      if (rate) finalData.base_fare_rate = rate;
      if (extraKms) finalData.extra_km_rate = extraKms;
      if (extraHours) finalData.extra_hr_rate = extraHours;
      if (dayBatta) finalData.day_batta_rate = dayBatta;
      if (nightBatta) finalData.night_batta_rate = nightBatta;
      if (slabKms) finalData.extra_km_rate = slabKms;
      if (selectedPaymentType) finalData.payment_type = selectedPaymentType;
      if (notes) finalData.note_1 = notes;
      if (visitingPlace) finalData.visiting_place = visitingPlace;
      if (selectedTime) finalData.pick_up_time = selectedTime;
      if (selectedFromDate) finalData.from_date = selectedFromDate;
      if (selectedToDate) finalData.to_date = selectedToDate;
    }

    if (selectedShareType === 1) {
      finalData.post_type_value = null;
      let formData = new FormData();
      formData.append('json', JSON.stringify(finalData));

      if (recordedAudioUri && postType === POST_TYPES.QUICK_SHARE) {
        const filename = recordedAudioUri.split('/').pop();
        formData.append('voiceMessage', {
          uri: recordedAudioUri,
          type: 'audio/m4a',
          name: filename,
        });
      }

      try {
        const response = await createPost(formData, userToken);

        if (
          response.error === false &&
          response.message === 'Post Booking Data created successfully'
        ) {
          dispatch(showSnackbar({
            message: 'Post Booking Data created successfully',
            type: 'success',
          }));

          navigation.navigate('Home');
          resetFields();
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    } else if (selectedShareType === 2) {
      navigation.navigate('SelectGroups', { finalData, recordedAudioUri });
    } else if (selectedShareType === 3) {
      navigation.navigate('SelectContacts', { finalData, recordedAudioUri });
    }
  };

  const handleUpdate = async () => {
    const { isValid, errorMessage } = validateMandatoryFields(
      {
        selectedTripType,
        selectedPackage,
        selectedVehicleType,
        selectedVehicleName,
        selectedShareType,
      },
      POST_TYPES.TRIP_SHEET,
    );

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    let finalData = {
      id: postId,
      post_booking_id: postId,
      posted_user_id: userId,
      booking_type_id: selectedTripType,
      booking_types_package_id: selectedPackage,
      vehicle_type_id: selectedVehicleType,
      vehicle_name_id: selectedVehicleName,
      post_type_id: selectedShareType,
    };

    // Add optional fields
    if (customerName) finalData.customer_name = customerName;
    if (customerPhone) finalData.customer_phone_no = customerPhone;
    if (pickupLocation) finalData.pick_up_location = pickupLocation;
    if (dropLocation) finalData.destination = dropLocation;
    if (rate) finalData.base_fare_rate = rate;
    if (extraKms) finalData.extra_km_rate = extraKms;
    if (extraHours) finalData.extra_hr_rate = extraHours;
    if (dayBatta) finalData.day_batta_rate = dayBatta;
    if (nightBatta) finalData.night_batta_rate = nightBatta;
    if (slabKms) finalData.extra_km_rate = slabKms;
    if (selectedPaymentType) finalData.payment_type = selectedPaymentType;
    if (notes) finalData.note_1 = notes;
    if (visitingPlace) finalData.visiting_place = visitingPlace;
    if (selectedTime) finalData.pick_up_time = selectedTime;
    if (selectedFromDate) finalData.from_date = selectedFromDate;
    if (selectedToDate) finalData.to_date = selectedToDate;

    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData));

    try {
      const response = await updatePost(formData, userToken);

      // if (from === 'bills') {
      //   navigation.goBack();
      await getMyDutiesBill(userId, userToken);
      await getMyPostedTripBills(userId, userToken);
      await getMySelfTripBills(userId, userToken);
      await fetchTripSheetByPostId(postId, userToken);
      // } else {
      navigation.goBack();
      // }
    } catch (error) {
      console.error('Error updating trip sheet:', error);
      alert('Failed to update trip sheet. Please try again.');
    }
  };

  const handleGeneratePDF = async () => {
    setIsPdfGenerating(true);
    try {
      const finalData = { post_booking_id: postId };
      const response = await generateTripPdf(finalData, userToken);
      const cleanedHtml = cleanHTML(response);

      const { uri } = await Print.printToFileAsync({
        html: cleanedHtml,
        base64: false,
      });

      const filename = `tripsheet_${Date.now()}.pdf`;
      const destinationUri = `${Platform.OS === 'android'
        ? FileSystem.cacheDirectory
        : FileSystem.documentDirectory
        }${filename}`;

      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(destinationUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save PDF',
        });
        setPdfUri(destinationUri);
      } else {
        alert('Sharing is not available on this device');
      }

      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Render Functions
  const renderQuickShareContent = () => (
    <>
      <View style={styles.sectionContainer}>
        <CustomInput
          placeholder={'Type your message'}
          value={message}
          onChangeText={setMessage}
          multiline={true}
          rightItem={
            !recordedAudioUri && (
              <TouchableOpacity onPress={handleStartRecording}>
                <MicIcon fill={isRecording ? 'red' : 'black'} />
              </TouchableOpacity>
            )
          }
        />
        {(isRecording || recordedAudioUri) && (
          <AudioContainer
            isRecording={isRecording}
            recordedAudioUri={recordedAudioUri}
            onRecordingComplete={handleStopRecording}
            onDelete={handleDeleteRecording}
          />
        )}
      </View>
      {renderCommonContent()}
      {!from && (
        <View style={styles.shareTypeContainer}>
          <CustomText text={'Share To :'} variant={'sectionTitleText'} />
          <FlatList
            data={SHARE_TYPE_DATA}
            renderItem={({ item }) => (
              <CustomSelect
                text={item.label_value}
                containerStyle={styles.selectItem}
                selectedTextStyle={styles.selectedText}
                selectedStyle={styles.selectedBackground}
                isSelected={selectedShareType === item.label_id}
                onPress={() => setSelectedShareType(item.label_id)}
                unselectedStyle={styles.unselectedBorder}
              />
            )}
            keyExtractor={(item) => item.label_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shareTypeList}
          />
        </View>
      )}
    </>
  );

  const renderCommonContent = () => (
    <>
      <View style={styles.sectionContainer}>
        <CustomText text={'Select Trip Type :'} variant={'sectionTitleText'} />
        <FlatList
          data={tripTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CustomSelect
              text={item.booking_type_name}
              containerStyle={styles.selectItem}
              selectedTextStyle={styles.selectedText}
              selectedStyle={styles.selectedBackground}
              isSelected={selectedTripType === item.id}
              onPress={() => {
                setSelectedTripType(item.id);
                const packages = item.bookingTypePackageAsBookingType;
                if (packages.length > 0) {
                  setSelectedPackage(packages[0].id);
                } else {
                  setSelectedPackage(null);
                }
              }}
              unselectedStyle={styles.unselectedBorder}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>

      <View style={styles.sectionContainer}>
        <CustomText text={'Select Package :'} variant={'sectionTitleText'} />
        <FlatList
          data={
            tripTypes.find((trip) => trip.id === selectedTripType)
              ?.bookingTypePackageAsBookingType || []
          }


          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CustomSelect
              text={item.package_name}
              containerStyle={styles.selectItem}
              selectedTextStyle={styles.selectedText}
              selectedStyle={styles.selectedBackground}
              isSelected={selectedPackage === item.id}
              onPress={() => setSelectedPackage(item.id)}
              unselectedStyle={styles.unselectedBorder}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>


      <View style={styles.sectionContainer}>
        <CustomText text={'Tariff :'} variant={'sectionTitleText'} />
        <View style={styles.tariffContainer}>
          {/* Local Trip (Type 1) */}
          {selectedTripType === 1 && (
            <>
              <View style={styles.tariffRow}>
                <CustomInput
                  placeholder="Rate"
                  value={rate}
                  onChangeText={setRate}
                  style={styles.tariffInput}
                  keyboardType="numeric"
                />
                <CustomInput
                  placeholder="Extra Kms"
                  value={extraKms}
                  onChangeText={setExtraKms}
                  style={styles.tariffInput}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.tariffRow}>
                <CustomInput
                  placeholder="Extra Hours"
                  value={extraHours}
                  onChangeText={setExtraHours}
                  style={styles.tariffInput}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {/* Outstation Trip (Type 2) */}
          {selectedTripType === 2 && (
            <View style={styles.tariffRow}>
              <CustomInput
                placeholder="Rate"
                value={rate}
                onChangeText={setRate}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
              <CustomInput
                placeholder="Day Batta"
                value={dayBatta}
                onChangeText={setDayBatta}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Transfer Trip (Type 3) */}
          {selectedTripType === 3 && (
            <View style={styles.tariffRow}>
              <CustomInput
                placeholder="Rate"
                value={rate}
                onChangeText={setRate}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
              <CustomInput
                placeholder="Slab Kms"
                value={slabKms}
                onChangeText={setSlabKms}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <CustomText
          text={'Select Vehicle Type :'}
          variant={'sectionTitleText'}
        />
        <FlatList
          data={vehicleTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VehicleButton
              item={item}
              isSelected={selectedVehicleType === item.id}
              onPress={() => setSelectedVehicleType(item.id)}
              imageKey="v_type_pic"
              nameKey="v_type"
            />
          )}
          contentContainerStyle={styles.vehicleListContainer}
        />
      </View>

      {/* <View style={styles.sectionContainer}>
        <CustomText
          text={'Select Vehicle Name :'}
          variant={'sectionTitleText'}
        />
        {filteredVehicleNames.length > 0 ? (
          <FlatList
            data={filteredVehicleNames}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <VehicleButton
                item={item}
                isSelected={selectedVehicleName === item.id}
                onPress={() => setSelectedVehicleName(item.id)}
                imageKey="v_pic"
                nameKey="v_name"
              />
            )}
            contentContainerStyle={styles.vehicleListContainer}
          />
        ) : (
          <CustomText
            text={'Please select a vehicle type first'}
            style={styles.noVehicleText}
          />
        )}
      </View> */}


    </>
  );

  const renderTripSheetContent = () => (
    <>
      <View style={[styles.sectionContainer, styles.gap10]}>
        <CustomText text={'Customer Details :'} variant={'sectionTitleText'} />
        <CustomInput
          placeholder="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <CustomInput
          placeholder="Customer Phone"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
        />
      </View>

      {renderCommonContent()}






      <View style={styles.sectionContainer}>
        <CustomText
          text={'Payment / Duty Type :'}
          variant={'sectionTitleText'}
        />
        <View style={styles.paymentTypeContainer}>
          {Object.values(PAYMENT_TYPES).map((type) => (
            <CustomSelect
              key={type}
              text={type}
              containerStyle={styles.paymentType}
              selectedTextStyle={styles.selectedText}
              selectedStyle={styles.selectedBackground}
              isSelected={selectedPaymentType === type}
              onPress={() => setSelectedPaymentType(type)}
              unselectedStyle={styles.unselectedBorder}
            />
          ))}
        </View>
      </View>

      <View style={[styles.sectionContainer, styles.gap10]}>
        <CustomText text={'Notes :'} variant={'sectionTitleText'} />
        <CustomInput
          placeholder="Type your message"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
        />
      </View>

      <View style={styles.sectionContainer}>
        <CustomText text={'PickUp Time :'} variant={'sectionTitleText'} />
        <View style={styles.dateTimeContainer}>
          <TimeDatePicker
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            time={selectedTime}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
            onTimeChange={handleTimeChange}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <CustomText
          text={'Pick Up / Drop Location Detail :'}
          variant={'sectionTitleText'}
        />
        <View style={styles.locationContainer}>
          <CustomInput
            placeholder="Enter Pickup Location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
            style={styles.fullWidthInput}
          />
          <CustomInput
            placeholder="Enter Drop off Location"
            value={dropLocation}
            onChangeText={setDropLocation}
            style={styles.fullWidthInput}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <CustomText text={'Visiting Place'} variant={'sectionTitleText'} />
        <View style={styles.visitingPlaceContainer}>
          <CustomInput
            placeholder="Enter Visiting Place"
            value={visitingPlace}
            onChangeText={setVisitingPlace}
            style={styles.fullWidthInput}
          />
        </View>
      </View>

      {!from && (
        <View style={styles.shareTypeContainer}>
          <CustomText text={'Select to Post :'} variant={'sectionTitleText'} />
          <FlatList
            data={SHARE_TYPE_DATA}
            renderItem={({ item }) => (
              <CustomSelect
                text={item.label_value}
                containerStyle={styles.selectItem}
                selectedTextStyle={styles.selectedText}
                selectedStyle={styles.selectedBackground}
                isSelected={selectedShareType === item.label_id}
                onPress={() => setSelectedShareType(item.label_id)}
                unselectedStyle={styles.unselectedBorder}
              />
            )}
            keyExtractor={(item) => item.label_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shareTypeList}
          />
        </View>
      )}
    </>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008B8B" />
      </View>
    );
  }

  return (
    <>
      <AppHeader
        title="Post A Trip"
        backIcon={true}
        onBackPress={() => {
          if (from === 'selfTrip') {
            navigation.navigate('SelfTripHome');
          } else {
            navigation.goBack();
          }
        }}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {!from && (
          <View style={styles.postTypeContainer}>
            {Object.values(POST_TYPES).map((type) => (
              <CustomSelect
                key={type}
                text={type}
                containerStyle={styles.postType}
                selectedTextStyle={styles.selectedPostTypeText}
                selectedStyle={styles.selectedPostTypeBackground}
                isSelected={postType === type}
                onPress={() => setPostType(type)}
                unselectedStyle={styles.unselectedBorder}
              />
            ))}
          </View>
        )}

        {postType === POST_TYPES.QUICK_SHARE
          ? renderQuickShareContent()
          : renderTripSheetContent()}

        {from === 'bills' && (
          <View style={styles.cardsContainer}>
            <FlatList
              data={tripTableData}
              renderItem={({ item, index }) => (
                <TripCard
                  tripData={item}
                  index={index}
                  onEdit={(data) => {
                    setSelectedTripCardId(data.id); // Add this line
                    setStartTripKms(data.start_kms?.toString() || '');
                    setEndTripKms(data.end_kms?.toString() || '');
                    setStartTime(data.start_time || '');
                    setEndTripTime(data.end_time || '');
                    setStartDate(data.start_date || '');
                    setEndTripDate(data.end_trip_date || '');
                    setShowTripBillEditModal(true);
                  }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cardsContentContainer}
            />
          </View>
        )}

        <CustomModal
          visible={showTripBillEditModal}
          onSecondaryAction={() => setShowTripBillEditModal(false)}
        >
          <TripBillEditModal
            startTripKms={startTripKms}
            setStartTripKms={setStartTripKms}
            endTripKms={endTripKms}
            setEndTripKms={setEndTripKms}
            startTime={startTime}
            setStartTime={setStartTime}
            endTripTime={endTripTime}
            setEndTripTime={setEndTripTime}
            startDate={startDate}
            setStartDate={setStartDate}
            endTripDate={endTripDate || startDate}
            setEndTripDate={setEndTripDate}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            handleTripBillEdit={handleTripBillEdit}
            onClose={() => setShowTripBillEditModal(false)}
          />
        </CustomModal>



        <View style={styles.buttonContainer}>
          {from === 'bills' && (
            <CustomButton
              title={isPdfGenerating ? 'Generating PDF...' : 'Share PDF'}
              style={[
                styles.submitButton,
                isPdfGenerating && styles.disabledButton,
              ]}
              onPress={handleGeneratePDF}
              disabled={isPdfGenerating}
            />
          )}
          <CustomButton
            title={from === undefined ? 'Send' : 'Update'}
            style={styles.submitButton}
            onPress={from === undefined ? handleSend : handleUpdate}
          />
        </View>
        <View style={styles.bottomSpacing} />
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F5FD',
  },
  cardsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cardListContainer: {
    paddingTop: 12,
    gap: 8,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 6,
  },
  postType: {
    width: width * 0.45,
    height: 45,
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedPostTypeText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedPostTypeBackground: {
    backgroundColor: '#008B8B',
  },
  selectedBackground: {
    backgroundColor: '#6DB8F0',
  },
  unselectedBorder: {
    borderColor: '#005680',
    borderWidth: 1,
  },
  sectionContainer: {
    marginTop: 16,
    flexDirection: 'column',

  },
  gap10: {
    gap: 10,
  },
  listContentContainer: {
    marginTop: 8,
    // padding: 4,
  },
  selectItem: {
    marginRight: 10,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 120,
  },
  vehicleButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  vehicleListContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  vehicleButton: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 8,
  },
  selectedVehicleButton: {
    borderColor: '#008B8B',
    borderWidth: 2,
    backgroundColor: '#E6F3F3',
  },
  vehicleImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vehicleText: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    color: '#333333',
  },
  shareTypeContainer: {
    marginVertical: 20,
  },
  shareTypeList: {
    justifyContent: 'flex-start',
    padding: 4,
  },
  tariffContainer: {
    marginTop: 12,
    flex: 1,
  },
  tariffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 6,
  },
  tariffInput: {
    width: '48%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 6,
  },
  paymentType: {
    width: width * 0.45,
    height: 45,
    justifyContent: 'center',
    borderRadius: 8,
  },
  dateTimeContainer: {
    marginTop: 12,
    gap: 12,
  },
  locationContainer: {
    marginTop: 8,
    gap: 12,
  },
  visitingPlaceContainer: {
    marginTop: 8,
  },
  fullWidthInput: {
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 45,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  submitButton: {
    width: width * 0.40,
    alignItems: 'center',
    backgroundColor: '#008B8B',
    borderRadius: 8,
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  bottomSpacing: {
    marginBottom: 40,
  },
  noVehicleText: {
    marginTop: 12,
    color: '#666666',
    fontStyle: 'italic',
    fontSize: 13,
  },
  // Card Styles
  cardsContainer: {
    marginTop: 16,
  },
  cardsContentContainer: {
    paddingBottom: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#008B8B',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeSection: {
    flex: 3,
  },
  totalSection: {
    flex: 2,
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
});

export default PostATripScreen;

