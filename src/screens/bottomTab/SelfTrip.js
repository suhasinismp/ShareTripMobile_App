import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomText from '../../components/ui/CustomText';
import CustomInput from '../../components/ui/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/ui/CustomButton';
import { useTheme } from '../../hooks/useTheme';
import CustomSelect from '../../components/ui/CustomSelect';
import TimeDatePicker from '../../components/TimeDatePicker';

const { width } = Dimensions.get('window');

const SelfTrip = () => {
  const { theme } = useTheme();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [notes1, setNotes1] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('Cash');
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [visitingPlace, setVisitingPlace] = useState('');

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = (uri) => {
    setIsRecording(false);
    setRecordedAudioUri(uri);
  };
  const handleFromDateChange = () => {};
  const handleToDateChange = () => {};
  const handleTimeChange = () => {};

  const getSelectedTripTypePackages = () => {};
  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
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
        <View style={{ ...styles.sectionContainer, gap: 10 }}>
          <CustomText text="Customer Details :" variant="sectionTitleText" />
          <CustomInput
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <CustomInput
            placeholder="Customer Phone"
            value={customerPhone}
            onChangeText={setCustomerPhone}
          />
        </View>

        <View style={styles.sectionContainer}>
          <CustomInput
            placeholder="Type your message"
            value={message}
            onChangeText={setMessage}
            multiline={true}
            rightItem={
              !recordedAudioUri && (
                <TouchableOpacity onPress={handleStartRecording}>
                  {/* <MicIcon fill={isRecording ? 'red' : 'black'} /> */}
                </TouchableOpacity>
              )
            }
          />
        </View>
        <View style={styles.sectionContainer}>
          <CustomText
            text={'Select Trip Type :'}
            variant={'sectionTitleText'}
          />
          {/* <FlatList
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
          /> */}
        </View>
        <View style={styles.sectionContainer}>
          <CustomText text={'Select Package :'} variant={'sectionTitleText'} />
          {/* <FlatList
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
          /> */}
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

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancel"
            variant="text"
            style={styles.cancelButton}
            onPress={() => {
              // Handle cancel action
            }}
          />
          <CustomButton
            title="Start Trip"
            style={styles.submitButton}
            onPress={() => {
              // Handle start trip action
            }}
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

export default SelfTrip;
