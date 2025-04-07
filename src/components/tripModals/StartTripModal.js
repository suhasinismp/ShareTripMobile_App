// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
// } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import CustomInput from '../../components/ui/CustomInput';

// const StartTripModal = ({
//   openingKms,
//   setOpeningKms,
//   openingTime,
//   setOpeningTime,
//   openingDate,
//   setOpeningDate,
//   handleStartTrip,
//   showTimePicker,
//   setShowTimePicker,
//   showDatePicker,
//   setShowDatePicker,
//   onClose,

// }) => {
//   return (
//     <View style={styles.modalContent}>
//       <View style={styles.modalHeader}>
//         <Text style={styles.modalTitle}>Opening Trip Details</Text>
//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <FontAwesome name="times" size={24} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputGroup}>
//         <CustomInput
//           placeholder="Opening Kms"
//           value={openingKms}
//           onChangeText={setOpeningKms}
//           keyboardType="numeric"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Opening Time</Text>
//         <TouchableOpacity
//           style={styles.timePickerContainer}
//           onPress={() => setShowTimePicker(true)}
//         >
//           <FontAwesome
//             name="clock-o"
//             size={20}
//             color="#666"
//             style={styles.inputIcon}
//           />
//           <TextInput
//             style={styles.pickerInput}
//             value={openingTime}
//             placeholder="HH:MM AM/PM"
//             editable={false}
//             placeholderTextColor="#999"
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Opening Date</Text>
//         <TouchableOpacity
//           style={styles.timePickerContainer}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <FontAwesome
//             name="calendar"
//             size={20}
//             color="#666"
//             style={styles.inputIcon}
//           />
//           <TextInput
//             style={styles.pickerInput}
//             value={openingDate}
//             placeholder="YYYY/MM/DD"
//             editable={false}
//             placeholderTextColor="#999"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.actionButton} onPress={handleStartTrip}>
//         <Text style={styles.actionButtonText}>Start Trip</Text>
//       </TouchableOpacity>

//       {showTimePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="time"
//           is24Hour={false}
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowTimePicker(false);
//             if (selectedDate) {
//               const formattedTime = selectedDate.toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//               });
//               setOpeningTime(formattedTime);
//             }
//           }}
//         />
//       )}

//       {showDatePicker && (
//         <DateTimePicker
//           value={
//             openingDate ? new Date(openingDate.replace(/\//g, '-')) : new Date()
//           }
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               const formattedDate = `${selectedDate.getFullYear()}/${String(
//                 selectedDate.getMonth() + 1,
//               ).padStart(
//                 2,
//                 '0',
//               )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
//               setOpeningDate(formattedDate);
//             }
//           }}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalContent: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 8,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   timePickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     backgroundColor: '#F9FAFB',
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   pickerInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   actionButton: {
//     backgroundColor: '#1e4976',
//     padding: 16,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
// });

// export default StartTripModal;

import React from 'react';
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

const StartTripModal = ({
  openingKms,
  setOpeningKms,
  openingTime,
  setOpeningTime,
  openingDate,
  setOpeningDate,
  handleStartTrip,
  showTimePicker,
  setShowTimePicker,
  showDatePicker,
  setShowDatePicker,
  onClose,

}) => {
  return (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Opening Trip Details</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <CustomInput
          placeholder="Opening Kms"
          value={openingKms}
          onChangeText={setOpeningKms}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Opening Time</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <FontAwesome
            name="clock-o"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={openingTime}
            placeholder="HH:MM AM/PM"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Opening Date</Text>
        <TouchableOpacity
          style={styles.timePickerContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <FontAwesome
            name="calendar"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.pickerInput}
            value={openingDate}
            placeholder="YYYY/MM/DD"
            editable={false}
            placeholderTextColor="#999"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          if (!openingKms || isNaN(openingKms) || parseInt(openingKms) < 0) {
            alert('Please enter a valid Opening KMs');
            return;
          }

          if (!openingTime || !/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(openingTime)) {
            alert('Please select a valid Opening Time');
            return;
          }

          if (!openingDate) {
            alert('Please select Opening Date');
            return;
          }

          const selectedDate = new Date(openingDate.replace(/\//g, '-'));
          const today = new Date();
          if (selectedDate > today) {
            alert('Opening Date cannot be in the future');
            return;
          }

          // All validations passed
          handleStartTrip();
        }}
      >
        <Text style={styles.actionButtonText}>Start Trip</Text>
      </TouchableOpacity>



      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const formattedTime = selectedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
              setOpeningTime(formattedTime);
            }
          }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={
            openingDate ? new Date(openingDate.replace(/\//g, '-')) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formattedDate = `${selectedDate.getFullYear()}/${String(
                selectedDate.getMonth() + 1,
              ).padStart(
                2,
                '0',
              )}/${String(selectedDate.getDate()).padStart(2, '0')}`;
              setOpeningDate(formattedDate);
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
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
  actionButton: {
    backgroundColor: '#FFD700', // Changed to yellow
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StartTripModal;
