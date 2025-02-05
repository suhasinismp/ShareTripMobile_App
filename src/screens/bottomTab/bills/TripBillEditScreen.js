import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomInput from '../../../components/ui/CustomInput';
import CustomText from '../../../components/ui/CustomText';
import CustomSelect from '../../../components/ui/CustomSelect';
import CustomButton from '../../../components/ui/CustomButton';
import AppHeader from '../../../components/AppHeader';
import { getTripTypes } from '../../../services/postTripService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { Feather } from '@expo/vector-icons';
import { fetchTripBill, updateTripBill } from '../../../services/tripBillService';
import { showSnackbar } from '../../../store/slices/snackBarSlice';
import TripBillEditModal from '../../../components/tripModals/TripBillEditModal';
import CustomModal from '../../../components/ui/CustomModal';

const { width } = Dimensions.get('window');

const TripBillEditScreen = ({ navigation, route }) => {
  const postId = route.params.postId;


  console.log({ postId })
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
  // const [parking, setParking] = useState('');
  const [gst, setGst] = useState('');
  const [TollParking, setTollParking] = useState('');
  const [showTripBillEditModal, setShowTripBillEditModal] = useState(false)
  const [bill, setBill] = useState([]);

  const [otherStateTaxes, setOtherStateTaxes] = useState('');
  const [amount, setAmount] = useState('');
  const [otherCharges, setOtherCharges] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [tripUsage, setTripUsage] = useState('');
  const [pickupDetail, setPickupDetail] = useState('');
  const [visitingPlaces, setVisitingPlaces] = useState('');
  const [tripId, setTripId] = useState(null);
  const [postedUserId, setPostedUserId] = useState(null)
  const [disabled, setDisabled] = useState(true);
  const [discount, setDiscount] = useState('')
  console.log({ tripId })


  const TripCard = React.memo(({ tripData, index, onEdit }) => {
    return (
      <View style={styles.cardContainer}>
        {/* Header with Day number, Date and Edit icon */}
        <View style={styles.cardHeader}>
          <CustomText text={`Day ${index + 1}`} style={styles.dayText} />
          <View style={styles.headerRight}>
            <CustomText
              text={tripData.start_date || '-'}
              style={styles.dateText}
            />
            <TouchableOpacity
              onPress={() => {
                onEdit && onEdit(tripData);  // Call onEdit if it exists
                setShowTripBillEditModal(true);  // Open the modal
              }}
              style={styles.editButton}
            >
              <Feather name="edit-2" size={16} color="#008B8B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Time Section */}
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

        {/* Trip KMs Section */}
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
      const { data } = await fetchTripBill(postId, userToken);

      setBill(data)
      console.log({ data })
      if (data) {
        setBookingType(data.bookingType_id?.toString() || '');
        setTripId(data.trip_sheet_ride_id || '');
        setPostedUserId(data.posted_User_id)
        setSelectedTripType(data.bookingType_id || '');
        setSlabRate(data.bookingTypeTariff_base_fare_rate?.toString() || '');
        setSlabKms(data.packageKms?.toString() || '');
        // setExtraKmsCharges(data.extra_km_amount?.toString() || '');
        setDayBatta(data?.tripSheetRide?.day_batta?.toString() || '');
        // setNightBatta(data?.tripSheetRide?.night_batta?.toString() || '');

        setAmount(data?.tripSheetRide?.amount?.toString() || '');
        setGst(data?.tripSheetRide?.gst_amt?.toString() || '');
        setTollParking(data.tripSheetRide?.tot_toll_park?.toString() || '')
        setOtherStateTaxes(data.tripSheetRide?.state_tax?.toString() || '');
        // setAdvance(data.advance?.toString() || '');
        setOtherCharges(data.tripSheetRide?.toString() || '');
        setCustomerName(data.customer_name || '');
        setCustomerPhone(data.customer_phone_no || '');
        setDriverName(data.driver_name || '');
        setDriverPhone(data.driver_phone || '');
        setVehicleType(data.Vehicle_type_name || '');
        setVehicleNumber(data.vehicle_registration_number || '');
        setTripUsage(data.tripSheetRide?.reduce((total, trip) => total + parseInt(trip.total_kms), 0).toString() || '');
        // setPickupDetail(data.pick_up_location || '');
        // setVisitingPlaces(data.visiting_place || '');
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

    console.log('hi')

    try {
      const updatedData = {
        id: tripId,
        post_booking_id: postId,
        // posted_user_id:
        booking_type_id: selectedTripType,
        bookingTypeTariff_base_fare_rate: slabRate,
        packageKms: slabKms,
        extra_km_amount: extraKmsCharges,
        bookingTypeTariff_day_batta_rate: dayBatta,
        bookingTypeTariff_night_batta_rate: nightBatta,
        // parking: parking,
        tot_toll_park: TollParking,
        discount: discount,
        gst_amt: gst,
        state_tax: otherStateTaxes,
        other_charges: otherCharges,
        amount: amount,
        cleaning: cleaningCharges,
        customer_name: customerName,
        customer_phone_no: customerPhone,
        driver_name: driverName,
        driver_phone: driverPhone,
        vehicle_registration_number: vehicleNumber,
        pick_up_location: pickupDetail,
        visiting_place: visitingPlaces,
      };
      console.log({ updatedData })
      let formData = new FormData();
      formData.append('json', JSON.stringify(updatedData));

      const response = await updateTripBill(formData, userToken);
      console.log('Response:', response);
      if (response.error === false) {
        await fetchTripBill(postId, userToken)
        dispatch(
          showSnackbar({
            visible: true,
            message: 'Trip details updated successfully',
            type: 'success',
          }),
        );
        navigation.goBack();
      }

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
            {/* <View style={styles.inputRow}>
              <CustomInput
                value={extraKmsCharges || ''}
                onChangeText={disabled ? undefined : onChangeText}
                placeholder={'Extra Kms Charges'}
                editable={!disabled}
              />
            </View> */}
            <View style={styles.inputRow}>
              <CustomInput
                value={dayBatta || ''}
                onChangeText={setDayBatta}
                keyboardType="numeric"
                placeholder={'Day Batta'}
              />
            </View>
            {/* <View style={styles.inputRow}>
              <CustomInput
                value={nightBatta || ''}
                onChangeText={setNightBatta}
                keyboardType="numeric"
                placeholder={'Night Batta'}
              />
            </View>  */}
            {/* <View style={styles.inputRow}>
              <CustomInput
                value={discount || ''}
                onChangeText={setDiscount}
                keyboardType="numeric"
                placeholder={'Discount'}
              /> */}

            {/* </View> */}
            {/* <View style={styles.section}>
            <CustomText
              text="Others Charges"
              variant="sectionTitleText"
              style={styles.sectionTitle}
            /> */}
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <CustomInput
                  value={TollParking || ''}
                  onChangeText={setTollParking}
                  keyboardType="numeric"
                  placeholder={'TollParking'}
                />
              </View>
              <View style={styles.inputRow}>
                <CustomInput
                  value={gst || ''}
                  onChangeText={setGst}
                  keyboardType="numeric"
                  placeholder={'Gst'}
                />
              </View>
              <View style={styles.inputRow}>
                <CustomInput
                  value={amount || ''}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder={'Amount'}
                />
              </View>
              <View style={styles.inputRow}>
                <CustomInput
                  value={otherCharges || ''}
                  onChangeText={setOtherCharges}
                  keyboardType="numeric"
                  placeholder={'Other Charges'}
                />
              </View>
              {/* <View style={styles.inputRow}>
                  <CustomInput
                    value={otherStateTaxes || ''}
                    onChangeText={setOtherStateTaxes}
                    keyboardType="numeric"
                    placeholder={'Other State Charges'}
                  />
                </View> */}
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
                onPress={() => { }}
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
            text="Total Usage"
            variant="sectionTitleText"
            style={styles.sectionTitle}
          />
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <CustomInput
                value={tripUsage || ''}
                onChangeText={setTripUsage}
                placeholder={'Total Usage'}
              />
            </View>
            {/* <View style={styles.inputRow}>
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
            </View> */}
          </View>
        </View>

        {/* Action Buttons */}



        <View style={styles.cardsContainer}>
          <FlatList
            data={bill?.tripSheetRide}
            renderItem={({ item, index }) => (
              <TripCard tripData={item} index={index} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}

          />
        </View>

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
      </KeyboardAwareScrollView >
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    padding: 16,
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
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  sectionList: {
    flexGrow: 0, // Prevents SectionList from taking extra space
    marginBottom: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8

  },
  cardsContainer: {
    marginTop: 0,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
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
  totalSection: {
    flex: 2,
    alignItems: 'flex-end',
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
  listContainer: {
    paddingBottom: 16,
    flexGrow: 1,
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
