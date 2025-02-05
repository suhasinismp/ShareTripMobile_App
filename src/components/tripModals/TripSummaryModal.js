import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../ui/CustomInput';
import CustomText from '../ui/CustomText';
import CheckBoxActive from '../../../assets/svgs/checkBoxActive.svg';
import CheckBoxInactive from '../../../assets/svgs/checkBoxInactive.svg';

const TripSummaryModal = ({
  tripSummaryData,
  setShowTripSummaryModal,
  setShowAdditionalCharges,
  onPressNext,
  onClose,
  setIsGstSummaryValue,
}) => {
  // Opening details states
  const [openingKms, setOpeningKms] = useState(
    tripSummaryData?.openingKms || '',
  );
  const [openingTime, setOpeningTime] = useState(
    tripSummaryData?.openingTime || '',
  );
  const [openingDate, setOpeningDate] = useState(
    tripSummaryData?.openingDate || '',
  );

  // Closing details states
  const [closingKms, setClosingKms] = useState(
    tripSummaryData?.closingKms || '',
  );
  const [closingTime, setClosingTime] = useState(
    tripSummaryData?.closingTime || '',
  );
  const [closingDate, setClosingDate] = useState(
    tripSummaryData?.closingDate || '',
  );
  const [isGst, setIsGst] = useState(false);

  useEffect(() => {
    setIsGstSummaryValue(isGst)
  }, [isGst])

  // Date & Time picker states
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);



  const onClosingTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowClosingTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setClosingTime(formattedTime);
    }
  };

  const onClosingDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowClosingDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = `${currentDate.getFullYear()}/${String(
        currentDate.getMonth() + 1,
      ).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
      setClosingDate(formattedDate);
    }
  };

  const showTimePicker = (type) => {
    if (type === 'closingTime') {
      setShowClosingTimePicker(true);
    }
  };

  const showDatePicker = (type) => {
    if (type === 'closingDate') {
      setShowClosingDatePicker(true);
    }
  };

  // const handleNext = () => {
  //   const closingDetails = {
  //     closingKms: closingKms,
  //     closingTime: closingTime,
  //     closingDate: closingDate,
  //   }
  //   onPressNext(closingDetails)
  // };

  const handleNext = () => {
    onPressNext({
      closingKms,
      closingTime,
      closingDate,
      isGst,
    });
  };

  return (
    <ScrollView
      style={styles.modalContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={{ position: 'absolute', top: 10, right: 10 }}
        onPress={onClose}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <FontAwesome name="times" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Trip Details</Text>

      <View style={[styles.summaryContainer]}>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Opening Details</Text>

          <View style={styles.inputRow}>
            <CustomText text={"Opening Kms : "} style={{ fontWeight: 'bold' }} />
            <CustomText text={`${openingKms} km`} />


          </View>
          <View style={styles.inputRow}>
            <CustomText text={"Opening Time : "} style={{ fontWeight: 'bold' }} />
            <CustomText text={openingTime} />

          </View>
          <View style={styles.inputRow}>
            <CustomText text={"Opening Date : "} style={{ fontWeight: 'bold' }} />
            <CustomText text={openingDate} />

          </View>



        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Closing Details</Text>

          <View style={styles.inputGroup}>
            <CustomInput
              placeholder="Closing Kilometers"
              value={closingKms}
              onChangeText={setClosingKms}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Closing Time</Text>
            <TouchableOpacity
              style={styles.timePickerContainer}
              onPress={() => showTimePicker('closingTime')}
            >
              <FontAwesome
                name="clock-o"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Text style={styles.pickerInput}>
                {closingTime || 'Select Time'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Closing Date</Text>
            <TouchableOpacity
              style={styles.timePickerContainer}
              onPress={() => showDatePicker('closingDate')}
            >
              <FontAwesome
                name="calendar"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Text style={styles.pickerInput}>
                {closingDate || 'Select Date'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'space-between', }}>
          <Text >GST</Text>
          <TouchableOpacity onPress={() => setIsGst(!isGst)}>
            {isGst ? (<CheckBoxActive width={24} height={24} />
            ) : (
              <CheckBoxInactive width={24} height={24} />
            )}

          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {showClosingTimePicker && (
        <DateTimePicker
          testID="closingTimePicker"
          value={new Date()}
          mode="time"
          is24Hour={false}
          onChange={onClosingTimeChange}
        />
      )}

      {showClosingDatePicker && (
        <DateTimePicker
          testID="closingDatePicker"
          value={closingDate ? new Date(closingDate) : new Date()}
          mode="date"
          onChange={onClosingDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
  },
  elevation: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summarySection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,

  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 10,
  },
  pickerInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,

  },
  nextButton: {
    backgroundColor: '#005680',
    padding: 16,
    borderRadius: 8,

  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});

export default TripSummaryModal;
