import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import {
  closeTrip,
  confirmedDriverTrips,
  confirmedPostedGuyTrips,
  fetchTripDetails,
  getDriverInProgressTrips,
  getPostedGuyInProgressTrips,
  postAdditionCharges,
  startTrip,
  uploadSignature,
} from '../../services/myTripsService';
import { getUserDataSelector } from '../../store/selectors';
import CustomSelect from '../../components/ui/CustomSelect';
import FilterIcon from '../../../assets/svgs/filter.svg';
import PostCard from '../../components/PostCard';
import CustomAccordion from '../../components/ui/CustomAccordion';
import { handleCall } from './HomeScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../components/ui/CustomInput';
import CustomModal from '../../components/ui/CustomModal';
import BackIcon from '../../../assets/svgs/back.svg';
import UploadOptionsModal from '../../components/UploadOptionsModal';
import SignatureScreen from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';

// Start Trip Modal Component
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
  styles,
}) => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Opening Trip Details</Text>

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

      <TouchableOpacity style={styles.actionButton} onPress={handleStartTrip}>
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
// Trip Progress Modal Component
const TripProgressModal = ({
  handleContinueForNextDay,
  handleEndTrip,
  styles,
}) => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Trip Status</Text>
      <Text style={styles.tripStatus}>Your Trip is in Progress</Text>

      <TouchableOpacity
        style={{ ...styles.actionButton, backgroundColor: 'grey' }}
        onPress={handleContinueForNextDay}
        disabled={true}
      >
        <Text style={styles.actionButtonText}>Continue for Next Day</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleEndTrip}>
        <Text style={styles.actionButtonText}>End Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

// Closing Details Modal Component
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
  closingActionType,
  handleCloseTrip,
  styles,
}) => {
  return (
    <View style={styles.modalContent}>
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

      <Text style={styles.helperText}>
        Enter Closing Kms and Time to end for Day
      </Text>

      <TouchableOpacity style={styles.actionButton} onPress={handleCloseTrip}>
        <Text style={styles.actionButtonText}>
          {closingActionType === 'end' ? 'End Trip' : 'Close for the Day'}
        </Text>
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

// Trip Summary Modal Component
const TripSummaryModal = ({
  tripSummaryData,
  setShowTripSummaryModal,
  setShowAdditionalCharges,
  styles,
}) => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Trip Details</Text>

      <View style={[styles.summaryContainer, styles.elevation]}>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Opening Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Kms:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingKms || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Time:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingTime || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Date:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingDate || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Closing Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Kms:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingKms || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Time:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingTime || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Date:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingDate || '-'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          setShowTripSummaryModal(false);
          setShowAdditionalCharges(true);
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

// Additional Charges Modal Component
const AdditionalChargesModal = ({ onNext }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [documents, setDocuments] = useState([]);
  const [charges, setCharges] = useState({
    advance: '',
    parking: '',
    tolls: '',
    stateTax: '',
    cleaning: '',
    nightBatta: '',
  });

  const fieldToFileNumber = {
    advance: 'file1',
    parking: 'file2',
    tolls: 'file3',
    stateTax: 'file4',
    cleaning: 'file5',
  };

  const handleUpload = (field) => {
    setActiveField(field);
    setUploadModalVisible(true);
  };

  const handleFileSelect = (file) => {
    const fileNumber = fieldToFileNumber[activeField];
    const newFile = {
      ...file,
      fileNumber,
    };

    const existingFileIndex = documents.findIndex(
      (doc) => doc.fileNumber === fileNumber,
    );

    if (existingFileIndex !== -1) {
      setDocuments((prev) =>
        prev.map((doc, index) => (index === existingFileIndex ? newFile : doc)),
      );
    } else {
      setDocuments((prev) => [...prev, newFile]);
    }

    setUploadModalVisible(false);
  };

  const handleRemoveDocument = (fileNumber) => {
    setDocuments((prev) => prev.filter((doc) => doc.fileNumber !== fileNumber));
  };

  const isFieldHasDocument = (field) => {
    return documents.some((doc) => doc.fileNumber === fieldToFileNumber[field]);
  };

  const chargeFields = [
    { id: 'advance', label: 'Advance', hasUpload: true },
    { id: 'parking', label: 'Parking', hasUpload: true },
    { id: 'tolls', label: 'Tolls', hasUpload: true },
    { id: 'stateTax', label: 'State Tax', hasUpload: true },
    { id: 'cleaning', label: 'Cleaning', hasUpload: true },
    { id: 'nightBatta', label: 'Night Batta', hasUpload: false },
  ];

  return (
    <View style={styles.modalContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Additional Charges</Text>
      </View>

      {/* Scrollable Content */}
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Charge Fields */}
          {chargeFields.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <CustomInput
                    placeholder={field.label}
                    value={charges[field.id]}
                    onChangeText={(text) =>
                      setCharges((prev) => ({ ...prev, [field.id]: text }))
                    }
                    keyboardType="numeric"
                    height={44}
                  />
                </View>
                {field.hasUpload && (
                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      isFieldHasDocument(field.id) &&
                        styles.uploadButtonWithDoc,
                    ]}
                    onPress={() => handleUpload(field.id)}
                  >
                    <FontAwesome
                      name={isFieldHasDocument(field.id) ? 'check' : 'plus'}
                      size={16}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {/* Documents Section */}
          {documents.length > 0 && (
            <View style={styles.documentsContainer}>
              <Text style={styles.documentsTitle}>Documents</Text>
              <View style={styles.documentsList}>
                {documents.map((doc) => (
                  <View key={doc.fileNumber} style={styles.documentChip}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDocument(doc.fileNumber)}
                      style={styles.removeButton}
                    >
                      <FontAwesome name="times" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Fixed Bottom Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            onNext(documents, charges);
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <UploadOptionsModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSelectFile={handleFileSelect}
        camera={true}
        gallery={true}
        pdf={false}
      />
    </View>
  );
};

// Customer Signature Modal Component
const CustomerSignatureModal = ({
  selectedTripData,
  userToken,
  userId,
  onClose,
  fetch,
}) => {
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef();

  const handleSignature = async (signature) => {
    console.log(
      'handleSignature triggered with data:',
      signature ? 'present' : 'absent',
    );
    try {
      if (!signature) {
        console.log('No signature data received');
        return;
      }

      const path = FileSystem.cacheDirectory + 'sign.png';
      const base64Data = signature.split(',')[1];

      if (!base64Data) {
        console.log('Invalid signature data format');
        return;
      }

      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(path);

      const finalData = {
        post_bookings_id: selectedTripData?.post_booking_id,
      };

      let formData = new FormData();

      formData.append('json', JSON.stringify(finalData));

      formData.append('signature', {
        uri: fileInfo?.uri,
        type: 'image/png',
        name: 'customer_signature.png',
      });

      if (fileInfo.exists) {
        setSignature(fileInfo?.uri);
        const response = await uploadSignature(formData, userToken);
        console.log({ response });
        if (response?.error === false) {
          onClose();
          await fetch();
        }
      }
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };

  const handleClear = () => {
    console.log('Clear signature triggered');
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
      setSignature(null);
    }
  };

  const handleEmpty = () => {
    console.log('Empty signature detected');
    setSignature(null);
  };

  const handleBegin = () => {
    console.log('Signature drawing began');
  };

  const handleEnd = () => {
    console.log('Signature drawing ended');
  };

  const style = `.m-signature-pad { box-shadow: none; border: none; } 
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; margin: 0px; }
    .m-signature-pad--body canvas {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background-color: #FFFFFF;
    }`;

  return (
    <View style={styles.signatureModalContainer}>
      <View style={styles.signatureHeaderContainer}>
        <Text style={styles.signatureTitle}>Customer Signature</Text>

        <Text style={styles.signatureWarningText}>
          Note: Check your valuables, we are not Responsible for your Belongings
        </Text>

        <View style={styles.signatureDetailsContainer}>
          <View style={styles.signatureDetailRow}>
            <Text style={styles.signatureLabel}>Booking Id</Text>
            <Text style={styles.signatureValue}>
              : {selectedTripData?.post_booking_id || 'N/A'}
            </Text>
          </View>

          <View style={styles.signatureDetailRow}>
            <Text style={styles.signatureLabel}>Customer Name</Text>
            <Text style={styles.signatureValue}>
              : {selectedTripData?.user_name || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={'contain'}
            style={styles.signatureImage}
            source={{ uri: signature }}
          />
        ) : (
          <Text style={styles.previewText}>Signature Preview</Text>
        )}
      </View>

      <View style={styles.signaturePadContainer}>
        <SignatureScreen
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onBegin={handleBegin}
          onEnd={handleEnd}
          webStyle={style}
          autoClear={false}
          imageType="image/png"
          trimWhitespace={true}
          dotSize={1}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (signatureRef.current) {
              console.log('Manually triggering signature save');
              signatureRef.current.readSignature();
            }
          }}
        >
          <Text style={styles.actionButtonText}>End Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyTrips = () => {
  // User data from Redux
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  // Filter states
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilterOne, setSelectedFilterOne] = useState('Confirmed');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('MyDuties');
  const [selectedFilterThree, setSelectedFilterThree] = useState('Local');

  // Data states
  const [inProgressDriverData, setInProgressDriverData] = useState([]);
  const [inProgressPostedData, setInProgressPostedData] = useState([]);
  const [confirmedDriverData, setConfirmedDriverData] = useState([]);
  const [confirmedPostedData, setConfirmedPostedData] = useState([]);
  const [uiData, setUiData] = useState([]);

  // Modal states for Start Trip
  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [showTripProgressModal, setShowTripProgressModal] = useState(false);
  const [openingKms, setOpeningKms] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);

  // Modal states for Closing Details
  const [showClosingDetailsModal, setShowClosingDetailsModal] = useState(false);
  const [closingKms, setClosingKms] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);
  const [showClosingDatePicker, setShowClosingDatePicker] = useState(false);
  const [closingActionType, setClosingActionType] = useState('end');

  // Trip Summary and Additional Charges states
  const [showTripSummaryModal, setShowTripSummaryModal] = useState(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [tripSummaryData, setTripSummaryData] = useState(null);

  // Customer signature modal state
  const [showCustomerSignatureModal, setShowCustomerSignatureModal] =
    useState(false);

  // Set default opening date when modal opens
  useEffect(() => {
    if (showStartTripModal || showClosingDetailsModal) {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
      if (showStartTripModal) setOpeningDate(formattedDate);
      if (showClosingDetailsModal) setClosingDate(formattedDate);
    }
  }, [showStartTripModal, showClosingDetailsModal]);

  // Initial data fetch
  useEffect(() => {
    fetchUiData();
  }, [selectedFilterOne, selectedFilterTwo, selectedFilterThree]);

  // Data fetching functions
  const fetchUiData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchDriverInProgressData(),
      fetchPostedGuyInProgressData(),
      fetchConfirmedDriverData(),
      fetchConfirmedPostedData(),
    ]);
    setIsLoading(false);
  };

  const fetchDriverInProgressData = async () => {
    try {
      const response = await getDriverInProgressTrips(userId, userToken);
      if (response?.error === false) {
        setInProgressDriverData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching driver in progress data:', error);
    }
  };

  const fetchPostedGuyInProgressData = async () => {
    try {
      const response = await getPostedGuyInProgressTrips(userId, userToken);
      if (response?.error === false) {
        setInProgressPostedData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching posted guy in progress data:', error);
    }
  };

  const fetchConfirmedDriverData = async () => {
    try {
      const response = await confirmedDriverTrips(userId, userToken);
      if (response?.error === false) {
        setConfirmedDriverData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching confirmed driver data:', error);
    }
  };

  const fetchConfirmedPostedData = async () => {
    try {
      const response = await confirmedPostedGuyTrips(userId, userToken);
      if (response?.error === false) {
        setConfirmedPostedData(response?.data);
      }
    } catch (error) {
      console.error('Error fetching confirmed posted data:', error);
    }
  };

  // Trip handling functions
  const handleContinueForNextDay = () => {
    setClosingActionType('continue');
    setShowTripProgressModal(false);
    setShowClosingDetailsModal(true);
  };

  const handleEndTrip = () => {
    setClosingActionType('end');
    setShowTripProgressModal(false);
    setShowClosingDetailsModal(true);
  };

  const handleBackToTripProgress = () => {
    setShowClosingDetailsModal(false);
    setShowTripProgressModal(true);
  };

  const handleCloseTrip = async () => {
    const finalData = {
      post_bookings_id: selectedTripData?.post_booking_id,
      end_trip_kms: closingKms,
      end_trip_date: closingDate,
      end_trip_time: closingTime,
      posted_user_id: selectedTripData?.posted_user_id,
      accepted_user_id: userId,
    };

    const response = await closeTrip(finalData, userToken);

    if (response?.error === false) {
      const response = await fetchTripDetails(
        selectedTripData?.post_booking_id,
        userToken,
      );

      if (response?.error === false) {
        setTripSummaryData({
          openingKms: response?.data?.start_trip_kms || '',
          openingTime: response?.data?.start_time || '',
          openingDate: response?.data?.start_date || '',
          closingKms: response?.data?.end_trip_kms || '',
          closingTime: response?.data?.end_trip_time || '',
          closingDate: response?.data?.end_trip_date || '',
        });
        setShowClosingDetailsModal(false);
        setShowTripSummaryModal(true);

        setClosingKms('');
        setClosingTime('');
        setClosingDate('');
      }
    }
  };

  const handleStartTrip = async () => {
    const finalData = {
      post_bookings_id: selectedTripData?.post_booking_id,
      start_trip_kms: openingKms,
      start_date: openingDate,
      start_time: openingTime,
      pick_up_address: selectedTripData?.pick_up_location || '',
      destination: selectedTripData?.destination || '',
      customer_name: selectedTripData?.user_name || '',
      customer_phone_numb: selectedTripData?.user_phone || '',
      posted_user_id: selectedTripData?.posted_user_id,
      accepted_user_id: userId,
    };

    const response = await startTrip(finalData, userToken);
    if (response?.error === false) {
      handleCloseModal();
      await fetchUiData();
    }
  };

  const handleButtonPress = (tripData) => {
    if (tripData?.post_trip_trip_status === 'Start Trip') {
      setSelectedTripData(tripData);
      setShowStartTripModal(true);
    } else if (tripData?.post_trip_trip_status === 'Trip in Progress') {
      setSelectedTripData(tripData);
      setShowTripProgressModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowStartTripModal(false);
    setOpeningKms('');
    setOpeningTime('');
    setOpeningDate('');
    setSelectedTripData(null);
  };

  // Filter handlers
  const handleFilterOneSelect = (filter) => setSelectedFilterOne(filter);
  const handleFilterTwoSelect = (filter) => setSelectedFilterTwo(filter);
  const handleFilterThreeSelect = (filter) => setSelectedFilterThree(filter);

  const handleAdditionalChargesNext = async (documents, charges) => {
    const finalData = {
      post_booking_id: selectedTripData?.post_booking_id,
      advance: charges?.advance,
      parking: charges?.parking,
      tolls: charges?.tolls,
      state_tax: charges?.stateTax,
      cleaning: charges?.cleaning,
      night_batta: charges?.nightBatta,
    };

    let formData = new FormData();

    formData.append('json', JSON.stringify(finalData));

    for (let i = 0; i < documents.length; i++) {
      formData.append(documents[i].fileNumber, {
        uri: documents[i].uri,
        type: documents[i].type,
        name: documents[i].name,
      });
    }

    const response = await postAdditionCharges(formData, userToken);

    if (response?.error === false) {
      setShowAdditionalCharges(false);
      setShowCustomerSignatureModal(true);
    }
  };

  const EmptyStateComponent = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>{getEmptyStateMessage()}</Text>
    </View>
  );

  const getEmptyStateMessage = () => {
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      return 'No confirmed duties found';
    } else if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No confirmed posted trips found';
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      return 'No in-progress posted trips found';
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties'
    ) {
      return 'No in-progress duties found';
    } else if (selectedFilterOne === 'Enquiry') {
      return 'No enquiries found';
    }
    return 'No data available';
  };

  const renderPostCard = ({ item }) => (
    <PostCard
      bookingType={item?.booking_type_name}
      userProfilePic={
        item?.user_profile_pic || 'https://via.placeholder.com/150'
      }
      userName={item?.user_name}
      pickUpTime={item?.pick_up_time}
      fromDate={item?.from_date}
      vehicleType={item?.vehicle_type}
      vehicleName={item?.vehicle_name}
      pickUpLocation={item?.pick_up_location}
      destination={item?.destination}
      postComments={item?.post_comments}
      postVoiceMessage={item?.post_voice_message}
      baseFareRate={item?.booking_tarif_base_fare_rate}
      onRequestPress={() => handleButtonPress(item)}
      onCallPress={() => handleCall(item?.user_phone)}
      onPlayPress={() => {}}
      onMessagePress={() => {}}
      isRequested={item?.post_trip_trip_status || item?.request_status}
      packageName={item?.booking_package_name}
    />
  );

  const renderAccordion = ({ item }) => (
    <CustomAccordion
      bookingType={item?.booking_type_name}
      amount={item?.base_fare_rate}
      pickUpTime={item?.pick_up_time}
      fromDate={item?.trip_date}
      distanceTime={item?.distance_time}
      vehicleType={item?.vehicle_type}
      vehicleName={item?.vehicle_name}
      pickUpLocation={item?.pick_up_location}
      destination={item?.destination}
      postComments={item?.post_comments}
      postVoiceMessage={item?.post_voice_message}
      drivers={item?.trackingDetails}
      onCallPress={() => {}}
      onMessagePress={() => {}}
      onRefreshData={fetchUiData}
      userToken={userToken}
    />
  );

  // Update UI data based on filters
  useEffect(() => {
    if (selectedFilterOne === 'Confirmed' && selectedFilterTwo === 'MyDuties') {
      setUiData(confirmedDriverData);
    } else if (
      selectedFilterOne === 'Confirmed' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      setUiData(confirmedPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'PostedTrips'
    ) {
      setUiData(inProgressPostedData);
    } else if (
      selectedFilterOne === 'InProgress' &&
      selectedFilterTwo === 'MyDuties'
    ) {
      setUiData(inProgressDriverData);
    } else if (selectedFilterOne === 'Enquiry') {
      setUiData([]);
    }
  }, [
    inProgressDriverData,
    inProgressPostedData,
    confirmedDriverData,
    confirmedPostedData,
    selectedFilterOne,
    selectedFilterTwo,
    selectedFilterThree,
  ]);

  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <CustomSelect
            text="Confirmed"
            isSelected={selectedFilterOne === 'Confirmed'}
            onPress={() => handleFilterOneSelect('Confirmed')}
          />
          <CustomSelect
            text="In Progress"
            isSelected={selectedFilterOne === 'InProgress'}
            onPress={() => handleFilterOneSelect('InProgress')}
          />
          <CustomSelect
            text="Enquiry"
            isSelected={selectedFilterOne === 'Enquiry'}
            onPress={() => handleFilterOneSelect('Enquiry')}
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View>
            <View style={styles.secondaryFilterRow}>
              <CustomSelect
                text="My Duties"
                isSelected={selectedFilterTwo === 'MyDuties'}
                onPress={() => handleFilterTwoSelect('MyDuties')}
              />
              <CustomSelect
                text="Posted Trips"
                isSelected={selectedFilterTwo === 'PostedTrips'}
                onPress={() => handleFilterTwoSelect('PostedTrips')}
              />
            </View>
            <View style={styles.tertiaryFilterRow}>
              <CustomSelect
                text="Local"
                isSelected={selectedFilterThree === 'Local'}
                onPress={() => handleFilterThreeSelect('Local')}
              />
              <CustomSelect
                text="Out Station"
                isSelected={selectedFilterThree === 'OutStation'}
                onPress={() => handleFilterThreeSelect('OutStation')}
              />
              <CustomSelect
                text="Transfer"
                isSelected={selectedFilterThree === 'Transfer'}
                onPress={() => handleFilterThreeSelect('Transfer')}
              />
            </View>
          </View>
        )}

        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#005680" />
            </View>
          ) : !uiData || uiData.length === 0 ? (
            <EmptyStateComponent />
          ) : (
            <FlatList
              data={uiData}
              renderItem={
                selectedFilterOne === 'InProgress' &&
                selectedFilterTwo === 'PostedTrips'
                  ? renderAccordion
                  : renderPostCard
              }
              keyExtractor={(item) =>
                item?.post_booking_id?.toString() ||
                item?.post_bookings_id?.toString()
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
              ListFooterComponent={() => <View style={styles.footer} />}
            />
          )}
        </View>
      </View>

      {/* Modals */}
      <CustomModal
        visible={showStartTripModal}
        onPrimaryAction={handleStartTrip}
        onSecondaryAction={handleCloseModal}
      >
        <StartTripModal
          openingKms={openingKms}
          setOpeningKms={setOpeningKms}
          openingTime={openingTime}
          setOpeningTime={setOpeningTime}
          openingDate={openingDate}
          setOpeningDate={setOpeningDate}
          handleStartTrip={handleStartTrip}
          showTimePicker={showTimePicker}
          setShowTimePicker={setShowTimePicker}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          styles={styles}
        />
      </CustomModal>

      <CustomModal
        visible={showTripProgressModal}
        onSecondaryAction={() => setShowTripProgressModal(false)}
      >
        <TripProgressModal
          handleContinueForNextDay={handleContinueForNextDay}
          handleEndTrip={handleEndTrip}
          styles={styles}
        />
      </CustomModal>

      <CustomModal
        visible={showClosingDetailsModal}
        onSecondaryAction={handleBackToTripProgress}
      >
        <ClosingDetailsModal
          handleBackToTripProgress={handleBackToTripProgress}
          closingKms={closingKms}
          setClosingKms={setClosingKms}
          closingTime={closingTime}
          setClosingTime={setClosingTime}
          closingDate={closingDate}
          setClosingDate={setClosingDate}
          showClosingTimePicker={showClosingTimePicker}
          setShowClosingTimePicker={setShowClosingTimePicker}
          showClosingDatePicker={showClosingDatePicker}
          setShowClosingDatePicker={setShowClosingDatePicker}
          closingActionType={closingActionType}
          handleCloseTrip={handleCloseTrip}
          styles={styles}
        />
      </CustomModal>

      <CustomModal
        visible={showTripSummaryModal}
        onSecondaryAction={() => setShowTripSummaryModal(false)}
      >
        <TripSummaryModal
          tripSummaryData={tripSummaryData}
          setShowTripSummaryModal={setShowTripSummaryModal}
          setShowAdditionalCharges={setShowAdditionalCharges}
          styles={styles}
        />
      </CustomModal>

      <CustomModal
        visible={showAdditionalCharges}
        onSecondaryAction={() => setShowAdditionalCharges(false)}
      >
        <AdditionalChargesModal
          onNext={(documents, charges) => {
            handleAdditionalChargesNext(documents, charges);
          }}
        />
      </CustomModal>

      <CustomModal
        visible={showCustomerSignatureModal}
        onSecondaryAction={() => setShowCustomerSignatureModal(false)}
      >
        <CustomerSignatureModal
          selectedTripData={selectedTripData}
          userToken={userToken}
          userId={userId}
          onClose={() => {
            setShowCustomerSignatureModal(false);
          }}
          fetch={async () => {
            await fetchUiData();
          }}
        />
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  footer: {
    height: 20,
  },

  // Filter Styles
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  secondaryFilterRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
  },
  tertiaryFilterRow: {
    flexDirection: 'row',
    gap: 10,
    margin: 20,
  },

  // Generic Modal Styles
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 600,
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  // Input Related Styles
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

  // Button Styles
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

  // Additional Charges Modal Specific Styles
  contentContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  scrollContentContainer: {
    paddingHorizontal: 0,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  uploadButton: {
    width: 44,
    height: 44,
    backgroundColor: '#005680',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  uploadButtonWithDoc: {
    backgroundColor: '#28a745',
  },
  documentsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  documentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  documentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },

  // Customer Signature Modal Styles
  signatureModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 600,
  },
  signatureHeaderContainer: {
    marginBottom: 24,
  },
  signatureTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  signatureWarningText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  signatureDetailsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  signatureDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  signatureLabel: {
    fontSize: 16,
    color: '#333',
    width: 140,
  },
  signatureValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  signaturePadContainer: {
    flex: 1,

    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  endTripButton: {
    backgroundColor: '#123F67',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  endTripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Button Container Styles
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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

  // summary modal
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
});

export default MyTrips;
