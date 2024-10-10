import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import CustomText from './ui/CustomText';

const TimeDatePicker = ({
  time,
  fromDate,
  toDate,
  onTimeChange,
  onFromDateChange,
  onToDateChange,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate && onTimeChange) {
      const formattedTime = formatTime(selectedDate);
      onTimeChange(formattedTime);
    }
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate && onFromDateChange) {
      const formattedDate = formatDate(selectedDate);
      onFromDateChange(formattedDate);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate && onToDateChange) {
      const formattedDate = formatDate(selectedDate);
      onToDateChange(formattedDate);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <View style={styles.container}>
      {/* Time Input Field */}
      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={[styles.inputContainer, styles.timeInput]}
          onPress={() => setShowTimePicker(true)}
        >
          <FontAwesome
            name="clock-o"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={time || ''}
            placeholder="HH:MM AM/PM"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>

      {/* Date Input Fields */}
      <View style={styles.dateContainer}>
        {/* From Date Field */}
        <View style={styles.dateFieldContainer}>
          <CustomText style={styles.dateLabel} text={'From Date'} />
          <TouchableOpacity
            style={[styles.inputContainer, styles.dateInput]}
            onPress={() => setShowFromDatePicker(true)}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={fromDate || ''}
              placeholder="YYYY/MM/DD"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>

        {/* To Date Field */}
        <View style={styles.dateFieldContainer}>
          <CustomText style={styles.dateLabel} text={'To Date'} />
          <TouchableOpacity
            style={[styles.inputContainer, styles.dateInput]}
            onPress={() => setShowToDatePicker(true)}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={toDate || ''}
              placeholder="YYYY/MM/DD"
              editable={false}
              placeholderTextColor="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Render Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Render From Date Picker */}
      {showFromDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleFromDateChange}
        />
      )}

      {/* Render To Date Picker */}
      {showToDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleToDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  timeContainer: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateFieldContainer: {
    width: '48%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
  },
  timeInput: {
    width: '60%',
  },
  dateInput: {
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    flex: 1,
    color: 'black',
  },
  dateLabel: {
    marginBottom: 5,
  },
});

export default TimeDatePicker;
