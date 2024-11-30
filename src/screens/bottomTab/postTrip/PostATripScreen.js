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
  generateTripPdf,
  getTripTypes,
} from '../../../services/postTripService';
import {
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../../services/vehicleDetailsService';
import { getUserDataSelector } from '../../../store/selectors';
import AudioContainer from '../../../components/AudioContainer';
import TimeDatePicker from '../../../components/TimeDatePicker';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

const cleanHTML = (response) => {
  try {
    // Check if response is an object with html property
    if (response && response.html) {
      return response.html
        .replace(/\\n/g, '\n')
        .replace(/\\/g, '')
        .replace(/" "/g, '"')
        .replace(/class=\s*"\s*([^"]+)\s*"/g, 'class="$1"')
        .replace(/\s+/g, ' ')
        .replace(/style=\s*"\s*([^"]+)\s*"/g, 'style="$1"')
        .replace(/<!--\s*-->/g, '')
        .replace(/>\s+</g, '><')
        .trim();
    }
    // If response is directly HTML string
    return response
      .replace(/\\n/g, '\n')
      .replace(/\\/g, '')
      .replace(/" "/g, '"')
      .replace(/class=\s*"\s*([^"]+)\s*"/g, 'class="$1"')
      .replace(/\s+/g, ' ')
      .replace(/style=\s*"\s*([^"]+)\s*"/g, 'style="$1"')
      .replace(/<!--\s*-->/g, '')
      .replace(/>\s+</g, '><')
      .trim();
  } catch (error) {
    console.error('Error cleaning HTML:', error);
    return '<!DOCTYPE html><html><body></body></html>';
  }
};

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
  const [pdfUri, setPdfUri] = useState(null);
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

  const { theme } = useTheme();

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

  useEffect(() => {
    fetchConstants();
  }, []);

  useEffect(() => {
    if (tripTypes.length > 0) {
      const localTripType = tripTypes.find(
        (trip) => trip.booking_type_name === 'LOCAL',
      );
      if (localTripType) {
        setSelectedTripType(localTripType.id);
        const localPackages = localTripType.bookingTypePackageAsBookingType;
        if (localPackages.length > 0) {
          setSelectedPackage(localPackages[0].id);
        }
      }
    }
  }, [tripTypes]);

  useEffect(() => {
    if (from != undefined) {
      setPostType('Trip Sheet');
      getTripSheetDetails();
    }
  }, [from]);

  useEffect(() => {}, [initialData]);

  const getTripSheetDetails = async () => {
    const response = await fetchTripByPostId(postId, userToken);

    if (response.error === false) {
      setInitialData(response.data.postBooking);
    }
  };

  const generateAndSavePDF = async () => {
    const finalData = { post_booking_id: 100 };
    const response = await generateTripPdf(finalData, userToken);
    console.log({ response });

    const cleanedHtml = cleanHTML(response);
    const { uri } = await Print.printToFileAsync({
      html: cleanedHtml,
    });

    console.log({ uri });

    const pdfDir = `${FileSystem.cacheDirectory}pdfs/`;
    const pdfPath = `${pdfDir}tripsheet.pdf`;

    await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });

    await FileSystem.copyAsync({
      from: uri,
      to: pdfPath,
    });

    console.log({ pdfPath });

    setPdfUri(pdfPath);
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
      } else if (customerName.length === 0) {
        isValid = false;
        errorMessage = 'Please enter customer name.';
      } else if (customerPhone.length === 0) {
        isValid = false;
        errorMessage = 'Please enter customer phone.';
      } else if (pickupLocation.length === 0) {
        isValid = false;
        errorMessage = 'Please enter pickup location.';
      } else if (dropLocation.length === 0) {
        isValid = false;
        errorMessage = 'Please enter drop location.';
      } else if (rate.length === 0) {
        isValid = false;
        errorMessage = 'Please enter rate.';
      } else if (extraKms.length === 0) {
        isValid = false;
        errorMessage = 'Please enter extra kms.';
      } else if (extraHours.length === 0) {
        isValid = false;
        errorMessage = 'Please enter extra hours.';
      } else if (dayBatta.length === 0) {
        isValid = false;
        errorMessage = 'Please enter day batta.';
      } else if (nightBatta.length === 0) {
        isValid = false;
        errorMessage = 'Please enter night batta.';
      } else if (!selectedPaymentType) {
        isValid = false;
        errorMessage = 'Please select a payment type.';
      } else if (notes.length === 0) {
        isValid = false;
        errorMessage = 'Please enter notes.';
      } else if (notes1.length === 0) {
        isValid = false;
        errorMessage = 'Please enter additional notes.';
      } else if (visitingPlace.length === 0) {
        isValid = false;
        errorMessage = 'Please enter visiting place.';
      } else if (!selectedTime) {
        isValid = false;
        errorMessage = 'Please select time.';
      } else if (!selectedFromDate) {
        isValid = false;
        errorMessage = 'Please select from date.';
      } else if (!selectedToDate) {
        isValid = false;
        errorMessage = 'Please select to date.';
      } else if (!selectedShareType) {
        isValid = false;
        errorMessage = 'Please select a share type.';
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    let finalData = { posted_user_id: userId, post_status: 'Available' };

    if (selectedTripType) {
      finalData.booking_type_id = selectedTripType;
    }

    if (selectedPackage) {
      finalData.booking_types_package_id = selectedPackage;
    }

    if (selectedVehicleType) {
      finalData.vehicle_type_id = selectedVehicleType;
    }

    if (selectedVehicleName) {
      finalData.vehicle_name_id = selectedVehicleName;
    }

    if (message.length > 0) {
      finalData.post_comments = message;
    }

    if (selectedShareType === 1) {
      finalData.post_type_id = 1;
    } else if (selectedShareType === 2) {
      finalData.post_type_id = 2;
    } else if (selectedShareType === 3) {
      finalData.post_type_id = 3;
    }

    if (customerName.length > 0) {
      finalData.customer_name = customerName;
    }

    if (customerPhone.length > 0) {
      finalData.customer_phone_no = customerPhone;
    }

    if (pickupLocation.length > 0) {
      finalData.pick_up_location = pickupLocation;
    }

    if (dropLocation.length > 0) {
      finalData.destination = dropLocation;
    }

    if (rate.length > 0) {
      finalData.base_fare_rate = rate;
    }

    if (extraKms.length > 0) {
      finalData.extra_km_rate = extraKms;
    }

    if (extraHours.length > 0) {
      finalData.extra_hr_rate = extraHours;
    }

    if (dayBatta.length > 0) {
      finalData.day_batta_rate = dayBatta;
    }

    if (nightBatta.length > 0) {
      finalData.night_batta_rate = nightBatta;
    }

    if (selectedPaymentType) {
      finalData.payment_type = selectedPaymentType;
    }

    if (notes.length > 0) {
      finalData.note_1 = notes;
    }

    if (notes1.length > 0) {
      finalData.note_2 = notes1;
    }

    if (visitingPlace.length > 0) {
      finalData.visiting_place = visitingPlace;
    }

    if (selectedTime) {
      finalData.pick_up_time = selectedTime;
    }

    if (selectedFromDate) {
      finalData.from_date = selectedFromDate;
    }

    if (selectedToDate) {
      finalData.to_date = selectedToDate;
    }

    if (selectedShareType == 1) {
      finalData.post_type_value = null;
    }

    if (selectedShareType == 1) {
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

      const response = await createPost(formData, userToken);

      if (
        response.error === false &&
        response.message === 'Post Booking Data created successfully'
      ) {
        navigation.navigate('Home');
      } else {
        alert(response.message);
      }
    } else if (selectedShareType == 2) {
      navigation.navigate('SelectGroups', { finalData, recordedAudioUri });
    } else if (selectedShareType == 3) {
      navigation.navigate('SelectContacts', { finalData, recordedAudioUri });
    }
  };
  const fetchConstants = async () => {
    const response = await getTripTypes(userToken);
    if (response.error === false) {
      setTripTypes(response.data);
    }

    const vehicleTypesResponse = await fetchVehicleTypes(userToken);
    if (vehicleTypesResponse.error === false) {
      setVehicleTypes(vehicleTypesResponse.data);
    }

    const vehicleNamesResponse = await fetchVehicleNames(userToken);

    if (vehicleNamesResponse.error === false) {
      setVehicleNames(vehicleNamesResponse.data);
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
          <View style={styles.inputRow}>
            {/* <Ionicons
              name="location"
              size={24}
              color="#4CAF50"
              style={styles.inputIcon}
            /> */}
            <CustomInput
              placeholder="Enter Pickup Location"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              style={styles.fullWidthInput}
            />
          </View>
          <View style={styles.inputRow}>
            {/* <Ionicons
              name="location"
              size={24}
              color="#FF5722"
              style={styles.inputIcon}
            /> */}
            <CustomInput
              placeholder="Enter Drop off Location"
              value={dropLocation}
              onChangeText={setDropLocation}
              style={styles.fullWidthInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <CustomText text={'Visiting Place'} variant={'sectionTitleText'} />
        <View style={{ marginTop: 4 }}>
          <View style={styles.inputRow}>
            {/* <Ionicons
              name="navigate-circle-outline"
              size={24}
              color="#2196F3"
              style={styles.inputIcon}
            /> */}
            <CustomInput
              placeholder="Enter Visiting Place"
              value={visitingPlace}
              onChangeText={setVisitingPlace}
              style={styles.fullWidthInput}
            />
          </View>
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
            onPress={() => {
              // Handle cancel action
            }}
          />
          <CustomButton
            title={'Send'}
            style={styles.submitButton}
            onPress={handleSend}
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
  },
  tariffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tariffInput: {
    width: '40%',
    height: 30,
  },
});

export default PostATripScreen;
