import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../components/ui/CustomInput';
import BackIcon from '../../../assets/svgs/back.svg';
import CheckBoxActive from '../../../assets/svgs/checkBoxActive.svg';
import CheckBoxInactive from '../../../assets/svgs/checkBoxInactive.svg';


const ClosingDetailsModal = ({
  handleBackToTripProgress,
  closingKms,
  setClosingKms,
  closingTime,
  setClosingTime,
  closingDate,
  setClosingDate,
  showClosingTimePicker,
  setShowClosingTimePicker,
  showClosingDatePicker,
  setShowClosingDatePicker,
  handleCloseTrip,
  onClose,
  setIsGstClosingForDay

}) => {

  const [isGst, setIsGst] = useState(false)



  useEffect(() => {
    setIsGstClosingForDay(isGst);
  }, [isGst])

  return (
    <View style={styles.modalContent}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 10, right: 10 }}
        onPress={onClose}
      >
        <FontAwesome name="times" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.modalHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToTripProgress}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Closing Details</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Closing Kms</Text>
        <CustomInput
          placeholder="Enter Closing Kms"
          value={closingKms}
          onChangeText={setClosingKms}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Closing Time</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowClosingTimePicker(true)}
        >
          <FontAwesome
            name="clock-o"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={closingTime}
            placeholder="HH:MM AM/PM"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Closing Date</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowClosingDatePicker(true)}
        >
          <FontAwesome
            name="calendar"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={closingDate}
            placeholder="YYYY/MM/DD"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
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

      <Text style={styles.helperText}>
        Enter Closing Kms and Time to end for Day
      </Text>

      <TouchableOpacity style={styles.actionButton} onPress={handleCloseTrip}>
        <Text style={styles.actionButtonText}>Close for the Day</Text>
      </TouchableOpacity>

      {showClosingTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowClosingTimePicker(false);
            if (selectedDate) {
              const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              setClosingTime(formattedTime);
            }
          }}
        />
      )}

      {showClosingDatePicker && (
        <DateTimePicker
          value={
            closingDate ? new Date(closingDate.replace(/\//g, '-')) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowClosingDatePicker(false);
            if (selectedDate) {
              const formattedDate = `${selectedDate.getFullYear()}/${String(
                selectedDate.getMonth() + 1,
              ).padStart(
                2,
                '0',
              )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
              setClosingDate(formattedDate);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
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
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1e4976',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ClosingDetailsModal;
