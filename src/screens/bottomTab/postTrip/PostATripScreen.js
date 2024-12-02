import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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
  updatePost,
} from '../../../services/postTripService';
import {
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../../services/vehicleDetailsService';
import { getUserDataSelector } from '../../../store/selectors';
import AudioContainer from '../../../components/AudioContainer';
import TimeDatePicker from '../../../components/TimeDatePicker';

const { width } = Dimensions.get('window');

const VehicleButton = ({ item, isSelected, onPress, imageKey, nameKey }) => (
  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
    <TouchableOpacity
      style={[styles.vehicleButton, isSelected && styles.selectedVehicleButton]}
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
);

const shareTypeData = [
  { label_id: 1, label_value: 'Public' },
  { label_id: 2, label_value: 'Group' },
  { label_id: 3, label_value: 'Contact' },
];

const PostATripScreen = ({ route }) => {
  const from = route.params?.from;
  const postId = route.params?.postId;
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;
  const { theme } = useTheme();

  // State declarations
  const [postType, setPostType] = useState('Quick Share');
  const [tripTypes, setTripTypes] = useState([]);
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleNames, setVehicleNames] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState(null);
  const [selectedShareType, setSelectedShareType] = useState(1);
  const [initialData, setInitialData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [visitingPlace, setVisitingPlace] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [notes1, setNotes1] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [rate, setRate] = useState('');
  const [extraKms, setExtraKms] = useState('');
  const [extraHours, setExtraHours] = useState('');
  const [dayBatta, setDayBatta] = useState('');
  const [nightBatta, setNightBatta] = useState('');

  console.log({ initialData });

  // Initial setup and data fetching
  useEffect(() => {
    if (from !== undefined) {
      setPostType('Trip Sheet');
      getTripSheetDetails();
    }
    fetchConstants();
  }, []);

  // Navigation listener for fetching trip sheet details
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (from !== undefined) {
        getTripSheetDetails();
      }
    });

    return unsubscribe;
  }, [navigation, from]);

  // Set default trip type and package when trip types are loaded
  useEffect(() => {
    if (tripTypes.length > 0) {
      const localTripType = tripTypes.find(
        (trip) => trip.booking_type_name === 'LOCAL',
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
      setSelectedTripType(initialData.booking_type_id);
      setSelectedPackage(initialData.package_id);
      setSelectedVehicleType(initialData.vehicle_type_id);
      setSelectedVehicleName(initialData.vehicle_name_id);
      setSelectedShareType(initialData.share_type_id);
      setSelectedFromDate(initialData.from_date);
      setSelectedToDate(initialData.to_date);
      setSelectedTime(initialData.from_time);
      setRate(initialData.rate);
      setExtraKms(initialData.extra_kms);
      setExtraHours(initialData.extra_hours);
      setDayBatta(initialData.day_batta);
      setNightBatta(initialData.night_batta);
    }
  }, [initialData]);

  const getTripSheetDetails = async () => {
    try {
      if (from === 'bills') {
        const response = await fetchTripByPostId(postId, userToken);
        console.log({ response });
        if (response.error === false) {
          setInitialData(response.data.postBooking);
        }
      } else if (from === 'home') {
        const response = await fetchTripSheetByPostId(postId, userToken);

        if (response.error === false) {
          setInitialData(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching trip sheet details:', error);
    }
  };

  const fetchConstants = async () => {
    try {
      const [tripTypesResponse, vehicleTypesResponse, vehicleNamesResponse] =
        await Promise.all([
          getTripTypes(userToken),
          fetchVehicleTypes(userToken),
          fetchVehicleNames(userToken),
        ]);

      if (tripTypesResponse.error === false) {
        setTripTypes(tripTypesResponse.data);
      }

      if (vehicleTypesResponse.error === false) {
        setVehicleTypes(vehicleTypesResponse.data);
      }

      if (vehicleNamesResponse.error === false) {
        setVehicleNames(vehicleNamesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching constants:', error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (uri) => {
    setIsRecording(false);
    setRecordedAudioUri(uri);
  };

  const handleDeleteRecording = () => {
    setRecordedAudioUri(null);
  };

  const handleFromDateChange = (newDate) => {
    setSelectedFromDate(newDate);
  };

  const handleToDateChange = (newDate) => {
    setSelectedToDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

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
        { value: notes1, message: 'Please enter additional notes.' },
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
        note_2: notes1,
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

    // Trip Sheet validation
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
      { value: notes1, message: 'Please enter additional notes.' },
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

    // Prepare data for submission
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
      note_2: notes1,
      visiting_place: visitingPlace,
      pick_up_time: selectedTime,
      from_date: selectedFromDate,
      to_date: selectedToDate,
      post_type_id: selectedShareType,
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData));

    try {
      const response = await updatePost(formData, userToken);
      console.log({ response });
      if (from === 'bills') {
        navigation.navigate('Drawer', {
          screen: 'TripBill',
          params: { postId: initialData.id },
        });
      } else {
        navigation.goBack();
      }

      // if (response.error === false) {
      // } else {
      //   alert(response.message);
      // }
    } catch (error) {
      console.error('Error updating trip sheet:', error);
      alert('Failed to update trip sheet. Please try again.');
    }
  };

  const getSelectedTripTypePackages = () => {
    const selectedTrip = tripTypes.find((trip) => trip.id === selectedTripType);
    return selectedTrip ? selectedTrip.bookingTypePackageAsBookingType : [];
  };

  const renderSelectItem = useCallback(
    ({ item, isSelected, onPress, textKey }) => (
      <CustomSelect
        text={item[textKey]}
        containerStyle={styles.selectItem}
        selectedTextStyle={styles.selectedText}
        selectedStyle={styles.selectedBackground}
        isSelected={isSelected}
        onPress={onPress}
        unselectedStyle={styles.unselectedBorder}
        textStyle={styles.selectedText}
      />
    ),
    [],
  );

  const renderVehicleItem = useCallback(
    ({ item, isSelected, onPress, imageKey, nameKey }) => (
      <VehicleButton
        item={item}
        isSelected={isSelected}
        onPress={onPress}
        imageKey={imageKey}
        nameKey={nameKey}
      />
    ),
    [],
  );

  const renderCommonContent = () => (
    <>
      <View style={styles.sectionContainer}>
        <CustomText text={'Select Trip Type :'} variant={'sectionTitleText'} />
        <FlatList
          data={tripTypes}
          renderItem={({ item }) =>
            renderSelectItem({
              item,
              isSelected: selectedTripType === item.id,
              onPress: () => {
                setSelectedTripType(item.id);
                const packages = item.bookingTypePackageAsBookingType;
                if (packages.length > 0) {
                  setSelectedPackage(packages[0].id);
                } else {
                  setSelectedPackage(null);
                }
              },
              textKey: 'booking_type_name',
            })
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
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
          renderItem={({ item }) =>
            renderVehicleItem({
              item,
              isSelected: selectedVehicleType === item.id,
              onPress: () => setSelectedVehicleType(item.id),
              imageKey: 'v_type_pic',
              nameKey: 'v_type',
            })
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehicleListContainer}
        />
      </View>

      <View style={styles.sectionContainer}>
        <CustomText
          text={'Select Vehicle Name :'}
          variant={'sectionTitleText'}
        />
        <FlatList
          data={vehicleNames}
          renderItem={({ item }) =>
            renderVehicleItem({
              item,
              isSelected: selectedVehicleName === item.id,
              onPress: () => setSelectedVehicleName(item.id),
              imageKey: 'v_pic',
              nameKey: 'v_name',
            })
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehicleListContainer}
        />
      </View>

      <View style={styles.sectionContainer}>
        <CustomText text={'Select Package :'} variant={'sectionTitleText'} />
        <FlatList
          data={getSelectedTripTypePackages()}
          renderItem={({ item }) =>
            renderSelectItem({
              item,
              isSelected: selectedPackage === item.id,
              onPress: () => setSelectedPackage(item.id),
              textKey: 'package_name',
            })
          }
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </>
  );

  const renderQuickShareContent = () => (
    <>
      {renderCommonContent()}
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
      {!from && (
        <View style={styles.shareTypeContainer}>
          <CustomText
            text={'Share To :'}
            variant={'sectionTitleText'}
            style={{ marginBottom: 10 }}
          />
          <FlatList
            data={shareTypeData}
            renderItem={({ item }) =>
              renderSelectItem({
                item,
                isSelected: selectedShareType === item.label_id,
                onPress: () => setSelectedShareType(item.label_id),
                textKey: 'label_value',
              })
            }
            keyExtractor={(item) => item.label_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shareTypeList}
          />
        </View>
      )}
    </>
  );

  const renderTripSheetContent = () => (
    <>
      <View style={{ ...styles.sectionContainer, gap: 10 }}>
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
          <CustomSelect
            text={'Cash'}
            containerStyle={styles.paymentType}
            selectedTextStyle={styles.selectedText}
            selectedStyle={styles.selectedBackground}
            isSelected={selectedPaymentType === 'Cash'}
            onPress={() => setSelectedPaymentType('Cash')}
            unselectedStyle={styles.unselectedBorder}
          />
          <CustomSelect
            text={'Credit'}
            containerStyle={styles.paymentType}
            selectedTextStyle={styles.selectedText}
            selectedStyle={styles.selectedBackground}
            isSelected={selectedPaymentType === 'Credit'}
            onPress={() => setSelectedPaymentType('Credit')}
            unselectedStyle={styles.unselectedBorder}
          />
        </View>
      </View>

      <View style={{ ...styles.sectionContainer, gap: 10 }}>
        <CustomText text={'Notes :'} variant={'sectionTitleText'} />
        <CustomInput
          placeholder="Type your message"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
        />
        <CustomInput
          placeholder="Type your message"
          value={notes1}
          onChangeText={setNotes1}
          multiline={true}
        />
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
        <View style={{ marginTop: 4, gap: 10 }}>
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
        <View style={{ marginTop: 4 }}>
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
            data={shareTypeData}
            renderItem={({ item }) =>
              renderSelectItem({
                item,
                isSelected: selectedShareType === item.label_id,
                onPress: () => setSelectedShareType(item.label_id),
                textKey: 'label_value',
              })
            }
            keyExtractor={(item) => item.label_id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shareTypeList}
          />
        </View>
      )}
    </>
  );

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
            <CustomSelect
              text={'Quick Share'}
              containerStyle={styles.postType}
              selectedTextStyle={styles.selectedPostTypeText}
              selectedStyle={styles.selectedPostTypeBackground}
              isSelected={postType === 'Quick Share'}
              onPress={() => setPostType('Quick Share')}
              unselectedStyle={styles.unselectedBorder}
            />
            <CustomSelect
              text={'Trip Sheet'}
              containerStyle={styles.postType}
              selectedTextStyle={styles.selectedPostTypeText}
              selectedStyle={styles.selectedPostTypeBackground}
              isSelected={postType === 'Trip Sheet'}
              onPress={() => setPostType('Trip Sheet')}
              unselectedStyle={styles.unselectedBorder}
            />
          </View>
        )}

        {postType === 'Quick Share'
          ? renderQuickShareContent()
          : renderTripSheetContent()}

        <View style={styles.buttonContainer}>
          <CustomButton
            title={'Cancel'}
            variant="text"
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          />
          <CustomButton
            title={from === (undefined || 'bills') ? 'Save' : 'Update'}
            style={styles.submitButton}
            onPress={from === undefined ? handleSend : handleUpdate}
          />
        </View>

        <View style={{ marginBottom: 40 }} />
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
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  postType: {
    width: width * 0.4,
    height: 40,
    justifyContent: 'center',
  },
  selectedPostTypeText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedPostTypeBackground: { backgroundColor: '#008B8B' },
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
  listContentContainer: {
    marginTop: 8,
  },
  selectItem: {
    marginRight: 8,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
  },
  vehicleListContainer: {
    paddingVertical: 10,
  },
  vehicleButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
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
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  shareTypeContainer: {
    marginTop: 16,
  },
  shareTypeList: {
    justifyContent: 'space-between',
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paymentType: {
    width: width * 0.4,
    height: 40,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#005680',
    borderRadius: 4,
    width: width * 0.4,
    alignItems: 'center',
  },
  submitButton: {
    width: width * 0.4,
    alignItems: 'center',
    backgroundColor: '#008B8B',
    borderRadius: 4,
  },
  dateTimeContainer: {
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 10,
    width: width * 0.3,
    alignItems: 'center',
  },
  tariffContainer: {
    marginTop: 8,
    flex: 1,
  },
  tariffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tariffInput: {
    width: '44%',
    height: 40,
  },
  fullWidthInput: {
    width: '100%',
  },
});

export default PostATripScreen;
