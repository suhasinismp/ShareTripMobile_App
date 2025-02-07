import React, { useState } from 'react';
import CustomInput from '../ui/CustomInput';
import { FontAwesome } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TripBillEditModal = ({
  startTripKms,
  setStartTripKms,
  startTime,
  setStartTime,
  startDate,
  setStartDate,
  endTripKms,
  setEndTripKms,
  endTripTime,
  setEndTripTime,
  endTripDate,
  setEndTripDate,
  handleTripBillEdit,
  onClose,
}) => {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  return (
    <View style={styles.modalContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.modalTitle}>Trip Table details</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputsWrapper}>
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <CustomInput
              placeholder="Start Kms"
              value={startTripKms}
              onChangeText={setStartTripKms}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <CustomInput
              placeholder="End Kms"
              value={endTripKms}
              onChangeText={setEndTripKms}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Start Time</Text>
          <TouchableOpacity
            style={styles.timePickerContainer}
            onPress={() => setShowStartTimePicker(true)}
          >
            <FontAwesome
              name="clock-o"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.pickerInput}
              value={startTime}
              placeholder="startTime"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>End Time</Text>
          <TouchableOpacity
            style={styles.timePickerContainer}
            onPress={() => setShowEndTimePicker(true)}
          >
            <FontAwesome
              name="clock-o"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.pickerInput}
              value={endTripTime}
              placeholder="End Time"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.timePickerContainer}
            onPress={() => setShowStartDatePicker(true)}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.pickerInput}
              value={startDate}
              placeholder="startDate"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>End Date</Text>
          <TouchableOpacity
            style={styles.timePickerContainer}
            onPress={() => setShowEndDatePicker(true)}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.pickerInput}
              value={endTripDate}
              placeholder="End Date"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleTripBillEdit}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      {showStartTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartTimePicker(false);
            if (selectedDate) {
              const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              setStartTime(formattedTime);
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndTimePicker(false);
            if (selectedDate) {
              const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              setEndTripTime(formattedTime);
            }
          }}
        />
      )}

      {showStartDatePicker && (
        <DateTimePicker
          value={
            startDate ? new Date(startDate.replace(/\//g, '-')) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              const formattedDate = `${selectedDate.getFullYear()}/${String(
                selectedDate.getMonth() + 1,
              ).padStart(
                2,
                '0',
              )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
              setStartDate(formattedDate);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={
            endTripDate ? new Date(endTripDate.replace(/\//g, '-')) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              const formattedDate = `${selectedDate.getFullYear()}/${String(
                selectedDate.getMonth() + 1,
              ).padStart(
                2,
                '0',
              )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
              setEndTripDate(formattedDate);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  inputsWrapper: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  inputIcon: {
    marginRight: 12,
  },
  pickerInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripBillEditModal;
