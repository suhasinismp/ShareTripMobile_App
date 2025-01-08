import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomInput from '../../../components/ui/CustomInput';
import CustomText from '../../../components/ui/CustomText';
import CustomSelect from '../../../components/ui/CustomSelect';
import CustomButton from '../../../components/ui/CustomButton';
import AppHeader from '../../../components/AppHeader';
import { getTripTypes } from '../../../services/postTripService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { fetchTripBill } from '../../../services/tripBillService';
import { showSnackbar } from '../../../store/slices/snackBarSlice';

const { width } = Dimensions.get('window');

const TripBillEditScreen = ({ navigation, route }) => {
  const postId = route.params.postId;
  const userData = useSelector(getUserDataSelector);
  const dispatch = useDispatch();
  const { userToken, userId } = userData;
  const [isLoading, setIsLoading] = useState(false);

  // Initialize all states with empty strings instead of null
  const [tripTypes, setTripTypes] = useState([]);
  const [selectedTripType, setSelectedTripType] = useState('');
  const [bookingType, setBookingType] = useState('');
  const [slabRate, setSlabRate] = useState('');
  const [slabKms, setSlabKms] = useState('');
  const [extraKmsCharges, setExtraKmsCharges] = useState('');
  const [dayBatta, setDayBatta] = useState('');
  const [nightBatta, setNightBatta] = useState('');
  const [parking, setParking] = useState('');
  const [tolls, setTolls] = useState('');
  const [otherStateTaxes, setOtherStateTaxes] = useState('');
  const [advance, setAdvance] = useState('');
  const [cleaningCharges, setCleaningCharges] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [tripUsage, setTripUsage] = useState('');
  const [pickupDetail, setPickupDetail] = useState('');
  const [visitingPlaces, setVisitingPlaces] = useState('');

  const fetchConstants = async () => {
    setIsLoading(true);
    try {
      const tripTypesResponse = await getTripTypes(userToken);
      if (!tripTypesResponse.error) {
        setTripTypes(tripTypesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching constants:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to fetch trip types',
          type: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTripData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTripBill(postId, userToken);
      const data = response?.data;

      if (data) {
        setBookingType(data.bookingType_id?.toString() || '');
        setSelectedTripType(data.bookingType_id || '');
        setSlabRate(data.bookingTypeTariff_base_fare_rate?.toString() || '');
        setSlabKms(data.packageKms?.toString() || '');
        setExtraKmsCharges(data.extra_km_amount?.toString() || '');
        setDayBatta(data.day_batta_count?.toString() || '');
        setNightBatta(data.night_batta_count?.toString() || '');
        setParking(data.parking?.toString() || '');
        setTolls(data.tolls?.toString() || '');
        setOtherStateTaxes(data.other_state_taxes?.toString() || '');
        setAdvance(data.advance?.toString() || '');
        setCleaningCharges(data.cleaning_charges?.toString() || '');
        setCustomerName(data.customer_name || '');
        setCustomerPhone(data.customer_phone_no || '');
        setDriverName(data.driver_name || '');
        setDriverPhone(data.driver_phone || '');
        setVehicleType(data.Vehicle_type_name || '');
        setVehicleNumber(data.vehicle_registration_number || '');
        setTripUsage(data.tripSheetRide?.[0]?.total_kms?.toString() || '');
        setPickupDetail(data.pick_up_location || '');
        setVisitingPlaces(data.visiting_place || '');
      }
    } catch (error) {
      console.error('Error loading trip data:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to load trip details',
          type: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConstants();
  }, []);

  useEffect(() => {
    if (postId) {
      loadTripData();
    }
  }, [postId]);

  const handleSave = async () => {
    // Implement save functionality
    try {
      const updatedData = {
        booking_type_id: selectedTripType,
        bookingTypeTariff_base_fare_rate: slabRate,
        packageKms: slabKms,
        extra_km_amount: extraKmsCharges,
        day_batta_count: dayBatta,
        night_batta_count: nightBatta,
        parking: parking,
        tolls: tolls,
        other_state_taxes: otherStateTaxes,
        advance: advance,
        cleaning_charges: cleaningCharges,
        customer_name: customerName,
        customer_phone_no: customerPhone,
        driver_name: driverName,
        driver_phone: driverPhone,
        vehicle_registration_number: vehicleNumber,
        pick_up_location: pickupDetail,
        visiting_place: visitingPlaces,
      };

      // Add your API call here
      // await updateTripBill(postId, updatedData, userToken);

      dispatch(
        showSnackbar({
          visible: true,
          message: 'Trip details updated successfully',
          type: 'success',
        }),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error updating trip details:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to update trip details',
          type: 'error',
        }),
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <>
      <AppHeader title="Edit Trip Bill" backIcon={true} />
      <KeyboardAwareScrollView
        style={styles.container}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
      >
        {/* Fare Breakdown Section */}
        <View style={styles.section}>
          <CustomText
            text="Fare Breakdown"
            variant="sectionTitleText"
            style={styles.sectionTitle}
          />
          <View style={styles.inputGroup}>
            <CustomText
              text={'Select Booking Type :'}
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
                  onPress={() => setSelectedTripType(item.id)}
                  unselectedStyle={styles.unselectedBorder}
                />
              )}
              contentContainerStyle={styles.listContentContainer}
            />

            <View style={styles.inputRow}>
              <CustomInput
                value={slabRate || ''}
                onChangeText={setSlabRate}
                keyboardType="numeric"
                placeholder={'Slab Rate'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={slabKms || ''}
                onChangeText={setSlabKms}
                placeholder={'Slab kms'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={extraKmsCharges || ''}
                onChangeText={setExtraKmsCharges}
                placeholder={'Extra Kms Charges'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={dayBatta || ''}
                onChangeText={setDayBatta}
                keyboardType="numeric"
                placeholder={'Day Batta'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={nightBatta || ''}
                onChangeText={setNightBatta}
                keyboardType="numeric"
                placeholder={'Night Batta'}
              />
            </View>
          </View>
        </View>

        {/* Others Charges Section */}
        <View style={styles.section}>
          <CustomText
            text="Others Charges"
            variant="sectionTitleText"
            style={styles.sectionTitle}
          />
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <CustomInput
                value={parking || ''}
                onChangeText={setParking}
                keyboardType="numeric"
                placeholder={'Parking'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={tolls || ''}
                onChangeText={setTolls}
                keyboardType="numeric"
                placeholder={'Tolls'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={otherStateTaxes || ''}
                onChangeText={setOtherStateTaxes}
                keyboardType="numeric"
                placeholder={'Other State Taxes'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={advance || ''}
                onChangeText={setAdvance}
                keyboardType="numeric"
                placeholder={'Advance'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={cleaningCharges || ''}
                onChangeText={setCleaningCharges}
                keyboardType="numeric"
                placeholder={'Cleaning Charges'}
              />
            </View>
          </View>
        </View>

        {/* Customer Detail Section */}
        <View style={styles.section}>
          <CustomText
            text="Customer Detail"
            variant="sectionTitleText"
            style={styles.sectionTitle}
          />
          <View style={styles.customerDetailRow}>
            <CustomInput
              value={customerName || ''}
              onChangeText={setCustomerName}
              placeholder="Name"
            />
            <CustomInput
              value={customerPhone || ''}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              placeholder="Phone"
            />
          </View>
        </View>

        {/* Driver & Vehicle Detail Section */}
        <View style={styles.section}>
          <View style={styles.detailsContainer}>
            <View style={styles.driverDetail}>
              <CustomText
                text="Driver Detail"
                variant="sectionTitleText"
                style={styles.detailTitle}
              />
              <CustomInput
                value={driverName || ''}
                onChangeText={setDriverName}
                placeholder="Driver Name"
              />
              <CustomInput
                value={driverPhone || ''}
                onChangeText={setDriverPhone}
                keyboardType="phone-pad"
                placeholder="Driver Phone"
              />
            </View>
            <View style={styles.vehicleDetail}>
              <CustomText
                text="Vehicle Detail"
                variant="sectionTitleText"
                style={styles.detailTitle}
              />
              <CustomSelect
                text={vehicleType || ''}
                containerStyle={styles.vehicleSelect}
                onPress={() => {}}
                isSelected={true}
              />
              <CustomInput
                value={vehicleNumber || ''}
                onChangeText={setVehicleNumber}
                placeholder="Vehicle Number"
              />
            </View>
          </View>
        </View>

        {/* Trip Usage Section */}
        <View style={styles.section}>
          <CustomText
            text="Trip Usage"
            variant="sectionTitleText"
            style={styles.sectionTitle}
          />
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <CustomInput
                value={tripUsage || ''}
                onChangeText={setTripUsage}
                placeholder={'Trip Usage'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={pickupDetail || ''}
                onChangeText={setPickupDetail}
                placeholder={'Pickup Detail'}
              />
            </View>
            <View style={styles.inputRow}>
              <CustomInput
                value={visitingPlaces || ''}
                onChangeText={setVisitingPlaces}
                placeholder={'Visiting Places'}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancel"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={{ color: '#005680' }}
          />
          <CustomButton
            title="Save"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  inputGroup: {
    gap: 12,
  },
  inputRow: {
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#37474f',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  select: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customerDetailRow: {
    gap: 12,
  },
  customerInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  detailsContainer: {
    gap: 16,
  },
  driverDetail: {
    flex: 1,
    gap: 12,
  },
  vehicleDetail: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  detailInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  vehicleSelect: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#008B8B',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#008B8B',
  },
  listContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  selectItem: {
    marginRight: 10,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 120,
  },
  selectedText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedBackground: {
    backgroundColor: '#CCE3F4',
  },
  unselectedBorder: {
    borderColor: '#005680',
    borderWidth: 1,
  },
});

export default TripBillEditScreen;
