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
import { useSelector } from 'react-redux';
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
} from '../../../services/postTripService';
import {
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../../services/vehicleDetailsService';
import { getUserDataSelector } from '../../../store/selectors';
import AudioContainer from '../../../components/AudioContainer';
import TimeDatePicker from '../../../components/TimeDatePicker';
import { cleanHTML } from '../../../utils/cleanHTML';

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

const headers = [
  'Date',
  'Start Time',
  'Start KMs',
  'End Time',
  'End KMs',
  'Total KMs',
];
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
};
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
  const { from, postId } = route.params || {};
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
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
  // const [notes1, setNotes1] = useState('');
  const [rate, setRate] = useState('');
  const [extraKms, setExtraKms] = useState('');
  const [extraHours, setExtraHours] = useState('');
  const [dayBatta, setDayBatta] = useState('');
  const [nightBatta, setNightBatta] = useState('');
  const [tripTableData, setTripTableData] = useState(null);

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

  useEffect(() => {
    const initializeScreen = async () => {
      if (from !== undefined) {
        setPostType(POST_TYPES.TRIP_SHEET);
        await getTripSheetDetails();
      }
      await fetchConstants();
      if (from === 'bills') {
        await getTripTable();
      }
    };

    initializeScreen();
  }, [from]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (from !== undefined) {
        getTripSheetDetails();
      }
    });

    return unsubscribe;
  }, [navigation, from]);

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
      const {
        booking_type_id,
        package_id,
        vehicle_type_id,
        vehicle_name_id,
        share_type_id,
        from_date,
        to_date,
        from_time,
        rate: initialRate,
        extra_kms,
        extra_hours,
        day_batta,
        night_batta,
        customer_name,
        customer_phone,
        pick_up_location,
        destination,
        visiting_place: initial_visiting_place,
        payment_type,
        note_1,
        note_2,
      } = initialData;

      setSelectedTripType(booking_type_id);
      setSelectedPackage(package_id);
      setSelectedVehicleType(vehicle_type_id);
      setSelectedVehicleName(vehicle_name_id);
      setSelectedShareType(share_type_id);
      setSelectedFromDate(from_date);
      setSelectedToDate(to_date);
      setSelectedTime(from_time);
      setRate(initialRate);
      setExtraKms(extra_kms);
      setExtraHours(extra_hours);
      setDayBatta(day_batta);
      setNightBatta(night_batta);
      setCustomerName(customer_name);
      setCustomerPhone(customer_phone);
      setPickupLocation(pick_up_location);
      setDropLocation(destination);
      setVisitingPlace(initial_visiting_place);
      setSelectedPaymentType(payment_type);
      setNotes(note_1);
      // setNotes1(note_2);
    }
  }, [initialData]);

  // API Calls
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
        setInitialData(
          from === 'bills' ? response.data.postBooking : response.data,
        );
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
      setTripTableData(response?.data.tripSheetRide);
    }
  };

  // Handlers
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

  const handleSend = async () => {
    let isValid = true;
    let errorMessage = '';

    // Validation logic
    if (postType === 'Quick Share') {
      if (!selectedTripType) {
        isValid = false;
        errorMessage = 'Please select a trip type.';
      } else if (!selectedPackage) {
        isValid = false;
        errorMessage = 'Please select a package.';
      } else if (!selectedVehicleType) {
        isValid = false;
        errorMessage = 'Please select a vehicle type.';
      } else if (!selectedVehicleName) {
        isValid = false;
        errorMessage = 'Please select a vehicle name.';
      } else if (message.length === 0 && !recordedAudioUri) {
        isValid = false;
        errorMessage = 'Please enter a message or record an audio.';
      } else if (!selectedShareType) {
        isValid = false;
        errorMessage = 'Please select a share type.';
      }
    } else if (postType === 'Trip Sheet') {
      const requiredFields = [
        { value: selectedTripType, message: 'Please select a trip type.' },
        { value: selectedPackage, message: 'Please select a package.' },
        {
          value: selectedVehicleType,
          message: 'Please select a vehicle type.',
        },
        {
          value: selectedVehicleName,
          message: 'Please select a vehicle name.',
        },
        { value: customerName, message: 'Please enter customer name.' },
        { value: customerPhone, message: 'Please enter customer phone.' },
        { value: pickupLocation, message: 'Please enter pickup location.' },
        { value: dropLocation, message: 'Please enter drop location.' },
        { value: rate, message: 'Please enter rate.' },
        { value: extraKms, message: 'Please enter extra kms.' },
        { value: extraHours, message: 'Please enter extra hours.' },
        { value: dayBatta, message: 'Please enter day batta.' },
        { value: nightBatta, message: 'Please enter night batta.' },
        {
          value: selectedPaymentType,
          message: 'Please select a payment type.',
        },
        { value: notes, message: 'Please enter notes.' },
        // { value: notes1, message: 'Please enter additional notes.' },
        { value: visitingPlace, message: 'Please enter visiting place.' },
        { value: selectedTime, message: 'Please select time.' },
        { value: selectedFromDate, message: 'Please select from date.' },
        { value: selectedToDate, message: 'Please select to date.' },
        { value: selectedShareType, message: 'Please select a share type.' },
      ];

      for (const field of requiredFields) {
        if (!field.value) {
          isValid = false;
          errorMessage = field.message;
          break;
        }
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // Prepare data for submission
    let finalData = {
      posted_user_id: userId,
      post_status: 'Available',
      booking_type_id: selectedTripType,
      booking_types_package_id: selectedPackage,
      vehicle_type_id: selectedVehicleType,
      vehicle_name_id: selectedVehicleName,
      post_type_id: selectedShareType,
    };

    if (message.length > 0) {
      finalData.post_comments = message;
    }

    if (postType === 'Trip Sheet') {
      Object.assign(finalData, {
        customer_name: customerName,
        customer_phone_no: customerPhone,
        pick_up_location: pickupLocation,
        destination: dropLocation,
        base_fare_rate: rate,
        extra_km_rate: extraKms,
        extra_hr_rate: extraHours,
        day_batta_rate: dayBatta,
        night_batta_rate: nightBatta,
        payment_type: selectedPaymentType,
        note_1: notes,
        // note_2: notes1,
        visiting_place: visitingPlace,
        pick_up_time: selectedTime,
        from_date: selectedFromDate,
        to_date: selectedToDate,
      });
    }

    if (selectedShareType === 1) {
      finalData.post_type_value = null;
      let formData = new FormData();
      formData.append('json', JSON.stringify(finalData));

      if (recordedAudioUri) {
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
          navigation.navigate('Home');
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
    let isValid = true;
    let errorMessage = '';

    const requiredFields = [
      { value: selectedTripType, message: 'Please select a trip type.' },
      { value: selectedPackage, message: 'Please select a package.' },
      { value: selectedVehicleType, message: 'Please select a vehicle type.' },
      { value: selectedVehicleName, message: 'Please select a vehicle name.' },
      { value: customerName, message: 'Please enter customer name.' },
      { value: customerPhone, message: 'Please enter customer phone.' },
      { value: pickupLocation, message: 'Please enter pickup location.' },
      { value: dropLocation, message: 'Please enter drop location.' },
      { value: rate, message: 'Please enter rate.' },
      { value: extraKms, message: 'Please enter extra kms.' },
      { value: extraHours, message: 'Please enter extra hours.' },
      { value: dayBatta, message: 'Please enter day batta.' },
      { value: nightBatta, message: 'Please enter night batta.' },
      { value: selectedPaymentType, message: 'Please select a payment type.' },
      { value: notes, message: 'Please enter notes.' },
      // { value: notes1, message: 'Please enter additional notes.' },
      { value: visitingPlace, message: 'Please enter visiting place.' },
      { value: selectedTime, message: 'Please select time.' },
      { value: selectedFromDate, message: 'Please select from date.' },
      { value: selectedToDate, message: 'Please select to date.' },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        isValid = false;
        errorMessage = field.message;
        break;
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    let finalData = {
      id: initialData.id,
      post_booking_id: postId,
      posted_user_id: userId,
      post_status: 'Available',
      booking_type_id: selectedTripType,
      booking_types_package_id: selectedPackage,
      vehicle_type_id: selectedVehicleType,
      vehicle_name_id: selectedVehicleName,
      customer_name: customerName,
      customer_phone_no: customerPhone,
      pick_up_location: pickupLocation,
      destination: dropLocation,
      base_fare_rate: rate,
      extra_km_rate: extraKms,
      extra_hr_rate: extraHours,
      day_batta_rate: dayBatta,
      night_batta_rate: nightBatta,
      payment_type: selectedPaymentType,
      note_1: notes,
      // note_2: notes1,
      visiting_place: visitingPlace,
      pick_up_time: selectedTime,
      from_date: selectedFromDate,
      to_date: selectedToDate,
      post_type_id: selectedShareType,
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData));

    try {
      await updatePost(formData, userToken);
      if (from === 'bills') {
        navigation.navigate('Drawer', {
          screen: 'TripBill',
          params: { postId: initialData.id },
        });
      } else {
        navigation.goBack();
      }
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
      const destinationUri = `${Platform.OS === 'android' ? FileSystem.cacheDirectory : FileSystem.documentDirectory}${filename}`;

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

  // Memoized Selectors
  const getSelectedTripTypePackages = useMemo(() => {
    const selectedTrip = tripTypes.find((trip) => trip.id === selectedTripType);
    return selectedTrip ? selectedTrip.bookingTypePackageAsBookingType : [];
  }, [tripTypes, selectedTripType]);

  // Render Functions
  const renderCommonContent = useCallback(
    () => (
      <>
        <View style={styles.sectionContainer}>
          <CustomText
            text={'Select Trip Type :'}
            variant={'sectionTitleText'}
          />
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
                onPress={() => {
                  setSelectedVehicleType(item.id);
                }}
                imageKey="v_type_pic"
                nameKey="v_type"
              />
            )}
            contentContainerStyle={styles.vehicleListContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
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
                  onPress={() => {
                    setSelectedVehicleName(item.id);
                  }}
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
        </View>

        <View style={styles.sectionContainer}>
          <CustomText text={'Select Package :'} variant={'sectionTitleText'} />
          <FlatList
            data={getSelectedTripTypePackages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
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
      </>
    ),
    [
      tripTypes,
      vehicleTypes,
      filteredVehicleNames,
      selectedTripType,
      selectedVehicleType,
      selectedVehicleName,
      selectedPackage,
      getSelectedTripTypePackages,
    ],
  );

  const renderQuickShareContent = useCallback(
    () => (
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
    ),
    [
      message,
      recordedAudioUri,
      isRecording,
      from,
      selectedShareType,
      handleStartRecording,
      handleStopRecording,
      handleDeleteRecording,
      renderCommonContent,
    ],
  );
  const renderTripSheetContent = useCallback(
    () => (
      <>
        <View style={[styles.sectionContainer, styles.gap10]}>
          <CustomText
            text={'Customer Details :'}
            variant={'sectionTitleText'}
          />
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
          <CustomText text={'Tariff :'} variant={'sectionTitleText'} />
          <View style={styles.tariffContainer}>
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
              <CustomInput
                placeholder="Day Batta"
                value={dayBatta}
                onChangeText={setDayBatta}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.tariffRow}>
              <CustomInput
                placeholder="Night Batta"
                value={nightBatta}
                onChangeText={setNightBatta}
                style={styles.tariffInput}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

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
          {/* <CustomInput
            placeholder="Type your message"
            value={notes1}
            onChangeText={setNotes1}
            multiline={true} */}
          {/* /> */}
        </View>

        <View style={styles.sectionContainer}>
          <CustomText text={'Date & Time :'} variant={'sectionTitleText'} />
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
            <CustomText
              text={'Select to Post :'}
              variant={'sectionTitleText'}
            />
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
    ),
    [
      customerName,
      customerPhone,
      rate,
      extraKms,
      extraHours,
      dayBatta,
      nightBatta,
      selectedPaymentType,
      notes,
      // notes1,
      selectedFromDate,
      selectedToDate,
      selectedTime,
      pickupLocation,
      dropLocation,
      visitingPlace,
      from,
      selectedShareType,
      handleFromDateChange,
      handleToDateChange,
      handleTimeChange,
      renderCommonContent,
    ],
  );

  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header, index) => (
        <View
          key={index}
          style={[
            styles.headerCell,
            index === headers.length - 1 && styles.lastCell,
          ]}
        >
          <Text style={styles.headerText}>{header}</Text>
        </View>
      ))}
    </View>
  );

  // Render table row
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{formatDate(item.start_date)}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.start_time || '-'}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.start_kms || '-'}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.end_time || '-'}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.end_kms || '-'}</Text>
      </View>
      <View style={[styles.cell, styles.lastCell]}>
        <Text style={styles.cellText}>
          {item.total_kms === 'NaN' ? '-' : item.total_kms}
        </Text>
      </View>
    </View>
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
        backIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={from != undefined ? 'Trip Sheet' : 'Post A Trip'}
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
          <View>
            {renderTableHeader()}
            <FlatList
              data={tripTableData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
            />
          </View>
        )}

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
            title={from === undefined ? 'Save' : 'Update'}
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
    backgroundColor: '#CCE3F4',
  },
  unselectedBorder: {
    borderColor: '#005680',
    borderWidth: 1,
  },
  sectionContainer: {
    marginTop: 16,
  },
  gap10: {
    gap: 10,
  },
  listContentContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
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
    marginTop: 20,
  },
  shareTypeTitle: {
    marginBottom: 12,
  },
  shareTypeList: {
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
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
    width: width * 0.45,
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
  audioContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  messageInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noVehicleText: {
    marginTop: 12,
    color: '#666666',
    fontStyle: 'italic',
    fontSize: 13,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  lastCell: {
    borderRightWidth: 0,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    textAlign: 'center',
  },
});

export default PostATripScreen;
