import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../../components/ui/CustomButton';
import AppHeader from '../../../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import {
  fetchTripBill,
  fetchTripSingleEditBill,
  updateTripBill,
  updateTripBillScreen,
} from '../../../services/tripBillService';
import { showSnackbar } from '../../../store/slices/snackBarSlice';
import CustomInput from '../../../components/ui/CustomInput';

const { width } = Dimensions.get('window');

const TripBillEditScreen = ({ navigation, route }) => {
  const postId = route.params.tripRideId;
  const userData = useSelector(getUserDataSelector);
  const dispatch = useDispatch();
  const { userToken, userId } = userData;
  const [bill, setBill] = useState([]);

  const [dayBatta, setDayBatta] = useState('');
  const [gst, setGst] = useState('');
  const [TollParking, setTollParking] = useState('');
  const [amount, setAmount] = useState('');
  const [otherCharges, setOtherCharges] = useState('');

  useEffect(() => {
    let func = async () => {
      const { data } = await fetchTripSingleEditBill(postId, userToken);
      // console.log("fetchTripSingleEditBill==>", responseData)
      setBill(data);
    };
    func();
  }, [postId]);
  useEffect(() => {
    setOtherCharges(bill?.other_charges);
    setAmount(bill?.amount);
    setTollParking(bill?.tot_toll_park);
    setGst(bill?.gst_amt);
    setDayBatta(bill?.day_batta);
  }, [bill]);

  const handleSave = async () => {
    try {
      const updatedData = {
        id: postId,
        day_batta: dayBatta,
        other_charges: otherCharges,
        amount: amount,
        tot_toll_park: TollParking,
        gst_amt: gst,
      };

      // let formData = new FormData();
      // formData.append('json', JSON.stringify(updatedData));

      const response = await updateTripBillScreen(updatedData, userToken);

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
        s
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
      >
        {/* Fare Breakdown Section */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <CustomInput
                value={dayBatta || ''}
                onChangeText={setDayBatta}
                keyboardType="numeric"
                placeholder={'Day Batta'}
              />
            </View>
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
            </View>
          </View>
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
    gap: 8,
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
